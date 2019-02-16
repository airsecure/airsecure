import { createAction, ActionType, getType } from 'typesafe-actions'
import { ThreadInfo, ThreadFilesInfo } from '@textile/react-native-sdk'
import { RootState } from './Types'

const actions = {
  nodeStarted: createAction('NODE_STARTED'),
  getThreadSuccess: createAction('GET_APP_THREAD_SUCCESS', (resolve) => {
    return (appThread?: ThreadInfo) => resolve({ appThread })
  }),
  getAppsSuccess: createAction('GET_APPS_SUCCESS', (resolve) => {
    return (authenticatedApps: ReadonlyArray<AuthenticatedApp>) => resolve({ authenticatedApps })
  }),
  scanNewQRCode: createAction('SCAN_NEW_QR_CODE'),
  scanNewQRCodeSuccess: createAction('SCAN_NEW_QR_CODE_SUCCESS', (resolve) => {
    return (url: string) => resolve({ url })
  }),
  toggleCode: createAction('TOGGLE_CODE', (resolve) => {
    return (secret: string) => resolve({ secret })
  }),
  updateCode: createAction('UPDATE_CODE', (resolve) => {
    return (secret: string, code: string, seconds: number) => {
      return resolve({ secret, code, seconds })
    }
  })
}
export type MainActions = ActionType<typeof actions>

export interface AuthenticatedApp {
  issuer: string
  logoUrl: string
  user: string
  secret: string
  hidden?: boolean
  code?: string
  seconds?: number
  algorithm?: string
  digits?: number
  period?: number
  type?: string
}

export interface MainState {
  appThread?: ThreadInfo
  authenticatedApps: ReadonlyArray<AuthenticatedApp>
  scanning: boolean
  error?: Error
}

const initialState: MainState = {
  authenticatedApps: [],
  scanning: false
}

export function reducer(state = initialState, action: MainActions) {
  switch (action.type) {
    case getType(actions.toggleCode): {
      const {secret} = action.payload
      const updatedApps = state.authenticatedApps.map((a) => {
        if (a.secret === secret) {
          return {
            ...a,
            hidden: !a.hidden
          }
        }
        return a
      })
      return { ...state, authenticatedApps: updatedApps }
    }
    case getType(actions.updateCode):
      const {secret, code, seconds} = action.payload
      const updatedApps = state.authenticatedApps.map((a) => {
        if (a.secret === secret) {
          return {
            ...a,
            code: seconds > 0 ? code : undefined,
            seconds
          }
        }
        return a
      })
      return { ...state, authenticatedApps: updatedApps }
    case getType(actions.getThreadSuccess):
      return { ...state, appThread: action.payload.appThread }
    case getType(actions.getAppsSuccess):
      return { ...state, authenticatedApps: action.payload.authenticatedApps }
    case getType(actions.scanNewQRCode):
      return { ...state, scanning: true, error: undefined }
    case getType(actions.scanNewQRCodeSuccess):
      return { ...state, scanning: false, error: undefined }
    default:
      return state
  }
}

export const MainSelectors = {
  getItemBySecret: (state: RootState, secret: string) => state.main.authenticatedApps.find((item) => item.secret === secret),
  getAppThread: (state: RootState) => state.main.appThread
}
export default actions
