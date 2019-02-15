import { takeLatest, call, put } from 'redux-saga/effects'
import MainActions from '../Redux/MainRedux'

// watcher saga: watches for actions dispatched to the store, starts worker saga
export function* mainSagaInit() {
  yield takeLatest('SCAN_NEW_QR_CODE', scanNewQRCode)
}

// function that makes the api request and returns a Promise for response
export function * doSomething() {
  console.log('doing something')
  return true
}

// worker saga: makes the api call when watcher saga sees the action
export function * scanNewQRCode() {
  try {
    const response = yield call(doSomething)
    // dispatch a success action to the store with the new dog
    yield put(MainActions.scanNewQRCodeSuccess())
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put(MainActions.scanNewQRCodeError(error))
  }
}