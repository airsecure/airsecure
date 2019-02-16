import { takeLatest, takeEvery, call, put, select, delay, take } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import MainActions, {MainSelectors, AuthenticatedApp} from '../Redux/MainRedux'
import Textile, { ThreadInfo, ThreadFilesInfo, ThreadType, ThreadSharing, SchemaType, FileData } from '@textile/react-native-sdk'
import parseUrl from 'url-parse'
import { Alert } from 'react-native'
import * as JSON_SCHEMA from '../schema.json'
import * as RNFS from 'react-native-fs'
import { Buffer } from 'buffer'
const jsotp = require('jsotp')

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* mainSagaInit() {
  yield takeLatest('NODE_STARTED', nodeStarted)
  yield takeLatest('SCAN_NEW_QR_CODE_SUCCESS', parseNewCode)
  yield takeLatest('GET_APP_THREAD_SUCCESS', getAuthenticatedApps)
  yield takeEvery('TOGGLE_CODE', handleCountdown)
  yield takeLatest('DELETE_APP', deleteApp)
}

function getToken(item: AuthenticatedApp) {
  if (item.type && item.type.toLocaleLowerCase() === 'hotp') {
    const hotp = jsotp.HOTP(item.secret)
    return '' + hotp.at(item.counter)
  }
  // Create TOTP object
  const totp = jsotp.TOTP(item.secret)
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

export function * nodeStarted() {
  const APP_THREAD_NAME = 'authenticated_apps'
  const APP_THREAD_KEY = 'ABCIDEASLKD'
  const threads: ReadonlyArray<ThreadInfo> = yield call(Textile.threads)
  let target = threads.find((thread: ThreadInfo) => thread.key === APP_THREAD_KEY)
  if (!target) {
    target = yield call(Textile.addThread, APP_THREAD_KEY, APP_THREAD_NAME, ThreadType.PRIVATE, ThreadSharing.NOT_SHARED, [], SchemaType.JSON, JSON.stringify(JSON_SCHEMA))
  }
  yield put(MainActions.getThreadSuccess(target))
}

function * refreshThreads(target: ThreadInfo) {
  const blocks: ReadonlyArray<ThreadFilesInfo> = yield call(Textile.threadFiles, '', 100, target.id)

  const files: Array<{file: FileData, blockId: string}> = []
  for (const block of blocks) {
    if (block.files.length && block.files[0].file) {
      const file = yield call(Textile.fileData, block.files[0].file.hash)
      files.push({
        file,
        blockId: block.block
      })
    }
  }
  const apps = files.map((data) => {
    const dir = JSON.parse(Buffer.from(data.file.url.split(',')[1], 'base64').toString())
    dir['blockId'] = data.blockId
    return dir
  })
  yield put(MainActions.getAppsSuccess(apps))
}

export function * deleteApp(action: ActionType<typeof MainActions.deleteApp>) {
  const {secret} = action.payload
  const item = yield select(MainSelectors.getItemBySecret, secret)
  if (!item) {
    return
  }
  yield call(Textile.addThreadIgnore, item.blockId)
  const target = yield select(MainSelectors.getAppThread)
  yield call(refreshThreads, target)
}

export function * getAuthenticatedApps(action: ActionType<typeof MainActions.getThreadSuccess>) {
  if (action.payload.appThread) {
    const target = action.payload.appThread
    yield call(refreshThreads, target)
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

  if (url.host !== 'totp') {
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
  }

  const label = url.pathname.slice(1)
  const file = url.query

  if (!file.issuer) {
    yield put(MainActions.enterIssuerRequest())
    while (!file.issuer) {
      yield take(getType(MainActions.enterIssuerSuccess))
      file.issuer = yield select(MainSelectors.getIssuer) || ''
    }
  }

  file['user'] = label.split(':')[1] || label
  file['type'] = url.host

  const exists = yield select(MainSelectors.getItemBySecret, url.query.secret)
  if (exists) {
    // don't duplicate entries
    return
  }

  const path = RNFS.DocumentDirectoryPath + '/' + fakeUUID() + '.json'
  try {
   yield call(RNFS.writeFile, path, JSON.stringify(file), 'utf8')
   const result = yield call(Textile.prepareFilesAsync, path, appThread.id)
   yield call(RNFS.unlink, path)

   const dir = result.dir
   if (!dir) {
     return
   }
   yield call(Textile.addThreadFiles, dir, appThread.id)
   yield call(refreshThreads, appThread)
  } catch (err) {
    // pass
  }
}
