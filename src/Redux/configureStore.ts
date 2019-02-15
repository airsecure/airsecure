import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './RootReducer'
import rootSaga from '../Sagas/'

export default () => {

  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

  sagaMiddleware.run(rootSaga, store.dispatch)

  return { store }
}
