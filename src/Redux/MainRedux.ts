import { createAction, ActionType, getType } from 'typesafe-actions'
import { ThreadInfo, ThreadFilesInfo } from '@textile/react-native-sdk'
import { RootState } from './Types';

const actions = {
  nodeStarted: createAction('NODE_STARTED'),
  getThreadSuccess: createAction('GET_APP_THREAD_SUCCESS', (resolve) => {
    return (appThread?: ThreadInfo) => resolve({ appThread })
  }),
  getAppsSuccess: createAction('GET_APPS_SUCCESS', (resolve) => {
    return (authenticatedApps: ReadonlyArray<ThreadFilesInfo>) => resolve({ authenticatedApps })
  }),
  scanNewQRCode: createAction('SCAN_NEW_QR_CODE'),
  scanNewQRCodeSuccess: createAction('SCAN_NEW_QR_CODE_SUCCESS', (resolve) => {
    return (url: string) => resolve({ url })
  }),
  fakeToggle: createAction('FAKE_TOGGLE', (resolve) => {
    return (index: number) => resolve({ index })
  }),
  updateSeconds: createAction('UPDATE_COUNTDOWN_SECONDS', (resolve) => {
    return (index: number, seconds: number) => resolve({ index, seconds })
  })
}
export type MainActions = ActionType<typeof actions>

export interface MainState {
  fakeApps: any[]
  appThread?: ThreadInfo
  authenticatedApps: ReadonlyArray<ThreadFilesInfo>
  scanning: boolean
  error?: Error
}

const initialState: MainState = {
  fakeApps: [{
    name: 'Textile Photos',
    url: 'textile.io',
    username: 'andrew@textile.io',
    hide: false,
    code: undefined,
    seconds: 0
  },
  {
    name: 'Coinbase',
    url: 'coinbase.com',
    username: 'andrew.hill@gmail.com',
    hide: false,
    code: undefined,
    seconds: 0
  },
  {
    name: 'GitHub',
    url: 'github.com',
    username: 'andrewxhill',
    hide: false,
    code: undefined,
    seconds: 0
  }],
  authenticatedApps: [],
  scanning: false
}

export function reducer(state = initialState, action: MainActions) {
  switch (action.type) {
    case getType(actions.fakeToggle): {
      const {index} = action.payload
      const updatedFake = state.fakeApps.map((a, i) => {
        if (i === index) {
          return {
            name: a.name,
            url: a.url,
            username: a.username,
            hide: !a.hide,
            code: a.code ? undefined : '429589',
            seconds: a.code ? 30 : 0
          }
        }
        return a
      })
      return { ...state, fakeApps: updatedFake }
    }
    case getType(actions.updateSeconds):
      const {index, seconds} = action.payload
      const updatedFake = state.fakeApps.map((a, i) => {
        if (i === index) {
          return {
            ...a,
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
  getItemByIndex: (state: RootState, index: number) => state.main.fakeApps[index]
}
export default actions
