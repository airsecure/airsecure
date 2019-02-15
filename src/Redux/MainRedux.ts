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
  fakeToggle: createAction('FAKE_TOGGLE', (resolve) => {
    return (secret: string) => resolve({ secret })
  }),
  updateCode: createAction('UPDATE_CODE', (resolve) => {
    return (index: number, code: string, seconds: number) => {
      console.log("CODY CODE: " + code)
      return resolve({ index, code, seconds })
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
    case getType(actions.fakeToggle): {
      const {secret} = action.payload
      const updatedApps = state.authenticatedApps.map((a) => {
        if (a.secret === secret) {
          return {
            issuer: a.issuer,
            logoUrl: a.logoUrl,
            secret: a.secret,
            user: a.user,
            hidden: !a.hidden,
            code: a.code,
            seconds: a.code ? 30 : 0
          }
        }
        return a
      })
      return { ...state, authenticatedApps: updatedApps }
    }
    case getType(actions.updateCode):
      const {index, code, seconds} = action.payload
      const updatedFake = state.authenticatedApps.map((a, i) => {
        if (i === index) {
          return {
            ...a,
            code,
            seconds
          }
        }
        return a
      })
      return { ...state, fakeApps: updatedFake }
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
  getItemBySecret: (state: RootState, secret: string) => state.main.authenticatedApps.find(item => item.secret === secret),
  getAppThread: (state: RootState) => state.main.appThread
}
export default actions
