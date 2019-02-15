import { takeLatest, call, put, select, delay } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import MainActions, {MainSelectors} from '../Redux/MainRedux'
import Textile, { ThreadInfo, ThreadFilesInfo, ThreadType, ThreadSharing, SchemaType } from '@textile/react-native-sdk'

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* mainSagaInit() {
  yield takeLatest('NODE_STARTED', nodeStarted)
  yield takeLatest('SCAN_NEW_QR_CODE_SUCCESS', parseNewCode)
  yield takeLatest('GET_APP_THREAD_SUCCESS', getAuthenticatedApps)
  yield takeLatest('FAKE_TOGGLE', handleFakeCountdown)
}

export function * handleFakeCountdown(action: ActionType<typeof MainActions.fakeToggle>) {
  const item = yield select(MainSelectors.getItemByIndex, action.payload.index)
  if (!item) {
    return
  }
  let seconds = item.seconds
  if (item.code && seconds === 0) {
    yield put(MainActions.updateSeconds(action.payload.index, 30))
    seconds = 30
  }
  while (seconds > 0) {
    yield delay(1000)
    seconds -= 1
    yield put(MainActions.updateSeconds(action.payload.index, seconds))
  }
}

export function * nodeStarted() {
  const APP_THREAD_NAME = 'authenticated_apps'
  const APP_THREAD_KEY = 'ABCIDEASLKDF'
  const threads: ReadonlyArray<ThreadInfo> = yield call(Textile.threads)
  let target = threads.find((thread: ThreadInfo) => thread.key === APP_THREAD_KEY)
  if (!target) {
    target = yield call(Textile.addThread, APP_THREAD_KEY, APP_THREAD_NAME, ThreadType.PRIVATE, ThreadSharing.NOT_SHARED, [], SchemaType.MEDIA)
  }
  yield put(MainActions.getThreadSuccess(target))
}

export function * getAuthenticatedApps(action: ActionType<typeof MainActions.getThreadSuccess>) {
  if (action.payload.appThread) {
    const target = action.payload.appThread
    const blocks: ReadonlyArray<ThreadFilesInfo> = yield call(Textile.threadFiles, '-1', 100, target.id)
    yield put(MainActions.getAppsSuccess(blocks))
  }
}

// worker saga: makes the api call when watcher saga sees the action
export function * parseNewCode(action: ActionType<typeof MainActions.scanNewQRCodeSuccess>) {
  console.log(action.payload.url)
}
