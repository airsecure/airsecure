import { combineReducers } from 'redux'

import { reducer as mainReducer } from './MainRedux'

export default combineReducers({
  main: mainReducer
})
