import React, { Component } from 'react'
import Redux, { Dispatch } from 'redux'
import { View, StatusBar, Platform, PermissionsAndroid, Text } from 'react-native'
import { NavigationContainerComponent } from 'react-navigation'
import AppNavigation from '../Navigation'
import NavigationService from '../Navigation/Service'
import styles from './Styles'

class App extends Component<{}> {
  
  render () {
    const barStyle = Platform.OS === 'ios' ? 'dark-content' : 'light-content'
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={barStyle} />
        <AppNavigation
          ref={(navRef: NavigationContainerComponent) => { NavigationService.setTopLevelNavigator(navRef) }}
        />
      </View>
    )
  }
}

export default App
