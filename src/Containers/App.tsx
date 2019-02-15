import React, { Component } from 'react'
import Redux, { Dispatch } from 'redux'
import { View, StatusBar, Platform, PermissionsAndroid, Text } from 'react-native'
import { NavigationContainerComponent } from 'react-navigation'
import AppNavigation from '../Navigation'
import NavigationService from '../Navigation/Service'

class App extends Component<{}> {

  render () {
    const barStyle = Platform.OS === 'ios' ? 'dark-content' : 'light-content'
    return (
      <View>
        <StatusBar barStyle={barStyle} />
        <AppNavigation
          ref={(navRef: NavigationContainerComponent) => { NavigationService.setTopLevelNavigator(navRef) }}
        />
      </View>
    )
  }
}

export default App
