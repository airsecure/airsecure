import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  scanNewQRCode: createAction('SCAN_NEW_QR_CODE'),
  scanNewQRCodeSuccess: createAction('SCAN_NEW_QR_CODE_SUCCESS'),
  scanNewQRCodeExit: createAction('SCAN_NEW_QR_CODE_EXIT'),
  scanNewQRCodeError: createAction('SCAN_NEW_QR_CODE_ERROR', (resolve) => {
    return (error: Error) => resolve({ error })
  }),
}
export type MainActions = ActionType<typeof actions>

export interface MainState {
  scanning: boolean
  error?: Error
}
const initialState: MainState = {
  scanning: false
};

export function reducer(state = initialState, action: MainActions) {
  switch (action.type) {
    case getType(actions.scanNewQRCode):
      return { ...state, scanning: true, error: null };
    case getType(actions.scanNewQRCodeSuccess):
      return { ...state, scanning: false, error: null };
    case getType(actions.scanNewQRCodeExit):
      return { ...state, scanning: false, error: null };
    case getType(actions.scanNewQRCodeError):
      return { ...state, scanning: false, error: action.payload.error };
    default:
      return state;
  }
}

export default actions
