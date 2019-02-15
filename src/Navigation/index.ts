import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation'

import Initializing from '../Containers/Initializing'
import Home from '../Containers/Home'

const nav = createSwitchNavigator(
  {
    Initializing,
    Home
  },
  {
    initialRouteName: 'Initializing'
  }
)

const app = createAppContainer(nav)

export default app
