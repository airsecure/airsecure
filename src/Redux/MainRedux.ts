import { createAction, ActionType, getType } from 'typesafe-actions'
import { ThreadInfo, ThreadFilesInfo } from '@textile/react-native-sdk'

const actions = {
  nodeStarted: createAction('NODE_STARTED'),
  getThreadSuccess: createAction('GET_APP_THREAD_SUCCESS', (resolve) => {
    return (appThread?: ThreadInfo) => resolve({ appThread })
  }),
  getAppsSuccess: createAction('GET_APPS_SUCCESS', (resolve) => {
    return (authenticatedApps: ReadonlyArray<ThreadFilesInfo>) => resolve({ authenticatedApps })
  }),
  scanNewQRCode: createAction('SCAN_NEW_QR_CODE'),
  scanNewQRCodeSuccess: createAction('SCAN_NEW_QR_CODE_SUCCESS'),
  scanNewQRCodeExit: createAction('SCAN_NEW_QR_CODE_EXIT'),
  scanNewQRCodeError: createAction('SCAN_NEW_QR_CODE_ERROR', (resolve) => {
    return (error: Error) => resolve({ error })
  })
}
export type MainActions = ActionType<typeof actions>

export interface MainState {
  appThread?: ThreadInfo
  authenticatedApps: ReadonlyArray<ThreadFilesInfo>
  scanning: boolean
  error?: Error
}

const initialState: MainState = {
  authenticatedApps: [],
  scanning: false
}

export function reducer(state = initialState, action: MainActions) {
  switch (action.type) {
    case getType(actions.getThreadSuccess):
      return { ...state, appThread: action.payload.appThread }
    case getType(actions.getAppsSuccess):
      return { ...state, authenticatedApps: action.payload.authenticatedApps }
    case getType(actions.scanNewQRCode):
      return { ...state, scanning: true, error: undefined }
    case getType(actions.scanNewQRCodeSuccess):
      return { ...state, scanning: false, error: undefined }
    case getType(actions.scanNewQRCodeExit):
      return { ...state, scanning: false, error: undefined }
    case getType(actions.scanNewQRCodeError):
      return { ...state, scanning: false, error: action.payload.error }
    default:
      return state
  }
}

export default actions
