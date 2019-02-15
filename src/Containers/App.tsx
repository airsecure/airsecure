import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import MainActions from '../Redux/MainRedux'

import Textile from '@textile/react-native-sdk'

const { store } = configureStore()

class App extends Component {

  textile = Textile

  render () {
    return (
      <Provider store={store}>
          <RootContainer />
      </Provider>
    )
  }

  componentWillMount () {
    this.textile.setup()
  }
  componentDidMount() {
    store.dispatch(MainActions.startup())
  }

  componentWillUnmount () {
    this.textile.tearDown()
  }
}

export default App
