import { all, call } from 'redux-saga/effects'
import { Dispatch } from 'redux'

/* ------------- Types ------------- */

import MainActions from '../Redux/MainRedux'

/* ------------- Sagas ------------- */

import {
  mainSagaInit
} from './MainSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root (dispatch: Dispatch) {
  yield all([
    call(mainSagaInit)
  ])
}
