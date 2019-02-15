import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import NavigationService from '../../Navigation/Service'
import MainActions from '../../Redux/MainRedux'
import { RootAction, RootState } from '../../Redux/Types'
import styles from '../Styles'
import rowStyles from '../Styles/row'
import { ThreadFilesInfo } from '@textile/react-native-sdk'

interface StateProps {
  apps: ReadonlyArray<ThreadFilesInfo>
  fakeApps: any[]
}

interface DispatchProps {
  scanNewQRCode: () => void
  fakeToggle: (index: number) => void
}

type Props = StateProps & DispatchProps

class Home extends Component<Props> {
  state = {  }

  scanNew = () => {
    NavigationService.navigate('Scanner')
  }
  renderRow = ({item, index}) => {
    const toggleIcon = item.code && !item.hidden ? '^' : '⌄'
    const codeColumn = item.code && !item.hidden ? rowStyles.codeRow : rowStyles.displayNone
    return (
      <TouchableOpacity
        style={rowStyles.appCell}
        /* tslint:disable-next-line jsx-no-lambda */
        onPress={() => { this.props.fakeToggle(index) }}
      >
        <View style={rowStyles.mainRow}>
          <View style={rowStyles.mainRowLeftColumn}>
            <Image
              style={rowStyles.appIcon}
              source={{uri: `http://logo.clearbit.com/${item.url}?size=40`}}
            />
          </View>
          <View style={rowStyles.mainRowMiddleColumn}>
            <Text style={rowStyles.appName}>{item.name}</Text>
            <Text style={rowStyles.userName}>{item.username}</Text>
          </View>
          <View style={rowStyles.mainRowRightColumn}>
            <Text style={rowStyles.toggleRow}>{toggleIcon}</Text>
          </View>
        </View>
        <View style={codeColumn}>
          <View style={rowStyles.spacer}><Text>.</Text></View>
          <Text style={rowStyles.code}>{item.code}</Text>
          <Text style={rowStyles.seconds}/>
        </View>
        <View style={rowStyles.progressRow}/>
      </TouchableOpacity>
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
          onPress={this.scanNew}
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
  fakeApps: state.main.fakeApps
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode()),
    fakeToggle: (index: number) => dispatch(MainActions.fakeToggle(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
