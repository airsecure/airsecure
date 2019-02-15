import { StateType } from 'typesafe-actions'

import RootReducer from './RootReducer'
import { MainActions } from './MainRedux'

export type RootState = StateType<typeof RootReducer>
export type RootAction =
  MainActions
  // Add any new types here
