import { takeLatest, call, put, select, delay } from 'redux-saga/effects'
import { ActionType } from 'typesafe-actions'
import MainActions, {MainSelectors} from '../Redux/MainRedux'
import Textile, { ThreadInfo, ThreadFilesInfo, ThreadType, ThreadSharing, SchemaType } from '@textile/react-native-sdk'
import parseUrl from 'url-parse'
import * as JSON_SCHEMA from '../schema.json'

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* mainSagaInit() {
  yield takeLatest('NODE_STARTED', nodeStarted)
  yield takeLatest('SCAN_NEW_QR_CODE_SUCCESS', parseNewCode)
  yield takeLatest('GET_APP_THREAD_SUCCESS', getAuthenticatedApps)
  yield takeLatest('FAKE_TOGGLE', handleFakeCountdown)
}

interface CompanySearch {
  name: string,
  domain: string,
  logo: string
}
export function * getDomain (name: string) {
  const companies: CompanySearch[] = yield fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${name}`)
    .then((response) => response.json())
  if (companies.length) {
    return companies[0]
  }
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
  const APP_THREAD_KEY = 'ABCIDEASLKD'
  const threads: ReadonlyArray<ThreadInfo> = yield call(Textile.threads)
  let target = threads.find((thread: ThreadInfo) => thread.key === APP_THREAD_KEY)
  if (!target) {
    target = yield call(Textile.addThread, APP_THREAD_KEY, APP_THREAD_NAME, ThreadType.PRIVATE, ThreadSharing.NOT_SHARED, [], SchemaType.JSON, JSON.stringify(JSON_SCHEMA))
  }
  yield put(MainActions.getThreadSuccess(target))
}

export function * getAuthenticatedApps(action: ActionType<typeof MainActions.getThreadSuccess>) {
  if (action.payload.appThread) {
    const target = action.payload.appThread
    const blocks: ReadonlyArray<ThreadFilesInfo> = yield call(Textile.threadFiles, '0', 100, target.id)
    yield put(MainActions.getAppsSuccess(blocks))
  }
}

// worker saga: makes the api call when watcher saga sees the action
export function * parseNewCode(action: ActionType<typeof MainActions.scanNewQRCodeSuccess>) {
  const appThread = yield select(MainSelectors.getAppThread)

  let url = parseUrl(action.payload.url, true)
  let label = url.pathname.slice(1).split(':')
  var file = url.query
  file["user"] = label[1]

  const path = RNFS.DocumentDirectoryPath + fakeUUID() + '.json'
  try {
   const success = yield call(RNFS.writeFile, path, JSON.stringify(file), 'utf8')
   if (success) {
     const result = yield call(Textile.prepareFilesAsync, path, appThread.id)
     const dir = result.dir
     if (!dir) {
       return
     }
     const blockInfo = yield call(Textile.addThreadFiles, dir, appThread.id)
     console.log(blockInfo)
   }
  } catch (err) {
    console.log(err.message)
  }
}
