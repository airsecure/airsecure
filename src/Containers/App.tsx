import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'

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

  componentWillUnmount () {
    this.textile.tearDown()
  }
}

export default App
