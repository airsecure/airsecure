import { takeLatest, takeEvery, call, put, select, delay, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import MainActions, {MainSelectors, AuthenticatedApp} from '../Redux/MainRedux'
import { pb, API } from '@textile/react-native-sdk'
import parseUrl from 'url-parse'
import { Alert } from 'react-native'
import { Buffer } from 'buffer'
const jsotp = require('jsotp')

const JSON_SCHEMA = {
  name: 'otp',
  pin: true,
  mill: '/json',
  json_schema: {
    title: 'OTP',
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'Valid types are hotp and totp, to distinguish whether the key will be used for counter-based HOTP or for TOTP.',
        enum: ['hotp', 'totp']
        },
      user: {
        type: 'string',
        description: 'The unique client ID'
        },
      issuer: {
        type: 'string',
        description: 'The unique provider ID'
        },
      secret: {
        description: 'The Base32 encoded random bytes secret key',
        type: 'string'
        },
      algorithm: {
        type: 'string',
        description: 'Hash algorithm',
        enum: ['sha1', 'sha256', 'sha512']
        },
      digits: {
        type: 'number',
        description: 'The digits parameter may have the values 6 or 8, and determines how long of a one-time passcode to display to the user. The default is 6.'
        },
      counter: {
        type: 'number',
        description: 'The counter parameter is required when provisioning a key for use with HOTP. It will set the initial counter value.'
        },
      period: {
        type: 'number',
        description: 'The period parameter defines a period that a TOTP code will be valid for, in seconds. The default value is 30.'
        },
      logoUrl: {
        type: 'string',
        description: 'Logo of account'
        }
      },
    required: ['user', 'secret']
    }
  }

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* mainSagaInit() {
  yield takeLatest('NODE_STARTED', nodeStarted)
  yield takeLatest('SCAN_NEW_QR_CODE_SUCCESS', parseNewCode)
  yield takeLatest('GET_APP_THREAD_SUCCESS', getAuthenticatedApps)
  yield takeEvery('TOGGLE_CODE', handleCountdown)
  yield takeLatest('DELETE_APP', deleteApp)
}

function getToken(item: AuthenticatedApp) {
  // Create TOTP object
  const totp = jsotp.TOTP(item.secret, item.period || 30)
  totp.digits = item.digits || 6
  return '' + totp.now()
}

export function * handleCountdown(action: ActionType<typeof MainActions.toggleCode>) {
  const item = yield select(MainSelectors.getItemBySecret, action.payload.secret)
  if (!item) {
    return
  }
  let seconds = item.seconds
  let code = item.code

  do {
    const epoch = Math.round(new Date().getTime() / 1000.0)
    seconds = 30 - (Math.floor(epoch) - (Math.floor(epoch / 30) * 30))

    code = yield call(getToken, item)
    yield put(MainActions.updateCode(action.payload.secret, code, seconds))

    yield delay(500)

  } while (!item.hidden)
}

function * getOrCreateThread() {
  const APP_THREAD_NAME = 'authenticated_apps'
  const APP_THREAD_KEY = 'ABCIDEASLKD'
  try {
    const threads: pb.ThreadList = yield call(API.threads.list)
    const target = threads.items.find((thread: pb.IThread) => thread.key === APP_THREAD_KEY)
    if (!target) {
      throw new Error('No thread found')
    }
    yield put(MainActions.getThreadSuccess(target))
  } catch (err) {
    const schema = pb.AddThreadConfig.Schema.create()
    schema.json = JSON.stringify(JSON_SCHEMA)
    const config = pb.AddThreadConfig.create()
    config.key = APP_THREAD_KEY
    config.name = APP_THREAD_NAME
    config.type = pb.Thread.Type.PRIVATE
    config.sharing = pb.Thread.Sharing.NOT_SHARED
    config.schema = schema

    const newTarget: pb.IThread = yield call(API.threads.add, config)
    yield put(MainActions.getThreadSuccess(newTarget))
  }
}

export function * nodeStarted() {
  yield call(getOrCreateThread)
}

export function * refreshThreads() {
  const appThread = yield select(MainSelectors.getAppThread)
  const apps: any[] = []
  try {
    const posts = yield call(API.files.list, '', -1, appThread.id)
    const rows: Array<{hash: string, block: string}> = []
    for (const post of posts.items) {
      for (const entry of post.files) {
        rows.push({
          hash: entry.file.hash,
          block: post.block
        })
      }
    }
    for (const entry of rows) {
      try {
        const data: string = yield call(API.files.data, entry.hash)
        const buff = Buffer.from(data.split(',')[1], 'base64')
        const json = JSON.parse(buff.toString())
        const app: AuthenticatedApp = {
          ...json,
          blockId: entry.block
        }
        apps.push(app)
      } catch (err) {
        // console.log('file error', err.message)
      }
    }
  } catch (err) {
    // console.log('files error', err.message)
  } finally {
    yield put(MainActions.getAppsSuccess(apps))
  }
}

export function * deleteApp(action: ActionType<typeof MainActions.deleteApp>) {
  const {secret} = action.payload
  const item = yield select(MainSelectors.getItemBySecret, secret)
  if (!item) {
    return
  }
  yield call(API.ignores.add, item.blockId)
  yield call(refreshThreads)
}

export function * getAuthenticatedApps(action: ActionType<typeof MainActions.getThreadSuccess>) {
  if (action.payload.appThread) {
    yield call(refreshThreads)
  }
}

function fakeUUID () {
   return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
     // tslint:disable-next-line:no-bitwise
     const r = Math.random() * 16 | 0
     // tslint:disable-next-line:no-bitwise
     const v = c === 'x' ? r : (r & 0x3 | 0x8)
     return v.toString(16)
   })
}

// worker saga: makes the api call when watcher saga sees the action
export function * parseNewCode(action: ActionType<typeof MainActions.scanNewQRCodeSuccess>) {
  const appThread = yield select(MainSelectors.getAppThread)

  const url = parseUrl(action.payload.url, true)

  if (url.host.toLocaleLowerCase() !== 'totp') {
    Alert.alert(
      'Invalid One-Time Password Protocol',
      'Must be TOTP',
      [
        {
          text: 'Cancel', onPress: () => {
            return
          }
        }
      ],
      { cancelable: true }
    )
    return
  }

  const label = decodeURIComponent(url.pathname.slice(1))
  const file = url.query

  if (!file.issuer) {
    yield put(MainActions.enterIssuerRequest())
    while (!file.issuer) {
      yield take(getType(MainActions.enterIssuerSuccess))
      file.issuer = yield select(MainSelectors.getIssuer) || ''
    }
  }

  // cleanup issuer and user strings
  file.issuer = decodeURIComponent(file.issuer)
  file['user'] = label.split(':')[1] || label
  file['type'] = url.host
  file['algorithm'] = (file.algorithm || 'sha1').toLocaleLowerCase()
  file['digits'] = parseInt(file.digits || 6, 10)
  file['period'] = parseInt(file.period || 30, 10)

  const exists = yield select(MainSelectors.getItemBySecret, url.query.secret)
  if (exists) {
    // don't duplicate entries
    return
  }
  // const path = RNFS.DocumentDirectoryPath + '/' + fakeUUID() + '.json'
  try {

    const input = Buffer.from(JSON.stringify(file)).toString('base64')
    const result = yield call(API.files.prepareFiles, input, appThread.id)

    yield call(API.files.add, result.dir, appThread.id)


    // yield call(RNFS.writeFile, path, JSON.stringify(file), 'utf8')
    // const result = yield call(API.files.prepare, path, appThread.id)
    // yield call(RNFS.unlink, path)
    // const dir = result.dir
    // if (!dir) {
    //   return
    // }
    // yield call(API.files.add, dir, appThread.id)
    yield call(refreshThreads)
  } catch (err) {
    // pass
  }
}
