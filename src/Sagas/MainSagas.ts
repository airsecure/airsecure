import { takeLatest, call, put, select, delay, all } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import MainActions, {MainSelectors, AuthenticatedApp} from '../Redux/MainRedux'
import Textile, { ThreadInfo, ThreadFilesInfo, ThreadType, ThreadSharing, SchemaType } from '@textile/react-native-sdk'
import parseUrl from 'url-parse'
import * as JSON_SCHEMA from '../schema.json'
import * as RNFS from 'react-native-fs'
import { Buffer } from 'buffer'
import OTP from 'otp.js'

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* mainSagaInit() {
  yield takeLatest('NODE_STARTED', nodeStarted)
  yield takeLatest('SCAN_NEW_QR_CODE_SUCCESS', parseNewCode)
  yield takeLatest('GET_APP_THREAD_SUCCESS', getAuthenticatedApps)
  yield takeLatest('TOGGLE_CODE', handleCountdown)
}

function getToken(item: AuthenticatedApp) {
  const TOTP = OTP.totp
  const code = TOTP.gen(item.secret)
  // const otp = new OTP(item.secret, { algorithm: item.algorithm || 'sha1', digits: item.digits || 6, period: item.period || 30})
  return code
}
export function * handleCountdown(action: ActionType<typeof MainActions.toggleCode>) {
  const item = yield select(MainSelectors.getItemBySecret, action.payload.secret)
  if (!item) {
    return
  }
  let seconds = item.seconds
  let code = item.code
  if (!item.code || seconds === 0) {
    seconds = 30

    code = yield call(getToken, item)

    yield put(MainActions.updateCode(action.payload.secret, code, 30))
  }
  while (seconds > 0) {
    yield delay(1000)
    seconds -= 1
    yield put(MainActions.updateCode(action.payload.secret, code, seconds))
  }
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
  const files = yield all(blocks.map((block) => {
    if (block.files.length && block.files[0].file) {
      return call(Textile.fileData, block.files[0].file.hash)
    }
  }))
  const apps = files.map((file) => {
    return JSON.parse(Buffer.from(file.url.split(',')[1], 'base64').toString())
  })
  yield put(MainActions.getAppsSuccess(apps))
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
  const label = url.pathname.slice(1).split(':')
  const file = url.query
  file['user'] = label[1]
  file['type'] = url.host

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
    console.log("CODY ERR: " + err.message)
  }
}
