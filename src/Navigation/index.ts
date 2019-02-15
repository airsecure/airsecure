import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation'

import Initializing from '../Containers/Initializing'
import Scanner from '../Containers/Scanner'
import Home from '../Containers/Home'

const nav = createSwitchNavigator(
  {
    Initializing,
    Home,
    Scanner
  },
  {
    initialRouteName: 'Scanner'
  }
)

const app = createAppContainer(nav)

export default app
