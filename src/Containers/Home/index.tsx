import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import MainActions, { MainState } from '../../Redux/MainRedux'
import { RootAction, RootState } from '../../Redux/Types'
import styles from '../Styles'
import { ThreadFilesInfo } from '@textile/react-native-sdk'

interface StateProps {
  apps: ReadonlyArray<ThreadFilesInfo>
  fakeApps: any[]
}

interface DispatchProps {
  scanNewQRCode: () => void
}

type Props = StateProps & DispatchProps

class Home extends Component<Props> {
  state = {  }

  renderRow = () => {
    return (
      <View style={styles.appCell}>
        <View style={styles.visibleRow}>
          <View style={styles.leftColumn}>
            <Image
              style={styles.appIcon}
              source={require('../../Static/Images/scan.png')}
            />
          </View>
          <View style={styles.middleColumn}>
            <Text style={styles.appName}></Text>
            <Text style={styles.userName}></Text>
          </View>
          <View style={styles.rightColumn}>
            <Text style={styles.userName}>^</Text>
          </View>
        </View>
        <View style={styles.hiddenRow}>
          <Text style={styles.code}>458 418</Text>
          <Text style={styles.seconds}>16s</Text>
        </View>
        <View style={styles.progressRow}/>>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>AirSecure</Text>
        <FlatList
          data={this.props.fakeApps}
          renderItem={this.renderRow}
        />
        <TouchableOpacity
          onPress={this.props.scanNewQRCode}
          style={styles.scanButton}
        >
          <Image
            style={styles.scanIcon}
            source={require('../../Static/Images/scan.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  apps: state.main.authenticatedApps,
  fakeApps: [{
    name: 'Textile Photos',
    logo: 'https://some-photo',
    username: 'andrew@textile.io'
  }]
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
