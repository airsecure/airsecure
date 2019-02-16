import React, { Component } from 'react'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import configureStore from '../Redux/configureStore'
import MainActions from '../Redux/MainRedux'

import Textile, {Events as TextileEvents} from '@textile/react-native-sdk'

const { store } = configureStore()

class App extends Component {

  textile = Textile
  events = new TextileEvents()

  render () {
    return (
      <Provider store={store}>
          <RootContainer />
      </Provider>
    )
  }

  componentDidMount () {
    this.events.addListener('newNodeState', (payload) => {
      if (payload.state === 'started') {
        store.dispatch(MainActions.nodeStarted())
      }
      console.info('@textile/newNodeState', payload.state)
    })
    this.textile.setup()
  }

  componentWillUnmount () {
    this.textile.tearDown()
  }
}

export default App
