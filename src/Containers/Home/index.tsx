import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native'
import ProgressBarAnimated from 'react-native-progress-bar-animated'
import NavigationService from '../../Navigation/Service'
import MainActions, { AuthenticatedApp } from '../../Redux/MainRedux'
import { RootAction, RootState } from '../../Redux/Types'
import styles from '../Styles'
import rowStyles from '../Styles/row'
import { ThreadFilesInfo } from '@textile/react-native-sdk'
import { materialColors } from 'react-native-typography'

interface StateProps {
  apps: ReadonlyArray<AuthenticatedApp>
}

interface DispatchProps {
  scanNewQRCode: () => void
  toggleCode: (secret: string) => void
}

interface ScreenState {
  barWidth: number
}

type Props = StateProps & DispatchProps & ScreenState

interface HeaderParams {
  delete: string
}

class Home extends Component<Props> {

  state = {
    barWidth:  Dimensions.get('screen').width - 30
   }

  componentDidMount() {
    this.setState({
      barWidth:  Dimensions.get('screen').width - 30
    })
  }
  scanNew = () => {
    NavigationService.navigate('Scanner')
  }

  getShort(name: string) {
    const nm = name.toLowerCase().replace('.', ' ').trim()
    if (nm.length < 3) {
      return nm
    }
    const parts = nm.split(' ')
    if (parts.length > 1) {
      return parts[0].substring(0, 1) + parts[1].substring(0, 1)
    }

    const con = nm.substring(0, 1) + nm.replace(/[aeiou]/ig, '').substring(1)
    if (con.length === 2) {
      return con
    }

    if (con.length < 2) {
      return nm.substring(0, 2)
    }

    if (nm.length % 2 === 0) {
      const x = nm.substring((nm.length / 2) - 1, (nm.length / 2))
      const y = nm.substring((nm.length / 2), 1 + (nm.length / 2))
      const go1 = x === 'a' || x === 'e' || x === 'i' || x === 'o' || x === 'u'
      const go2 = y === 'a' || y === 'e' || y === 'i' || y === 'o' || y === 'u'
      if (!go1 && !go2) {
        return nm.substring(0, 1) + y
      }
    }
    return con.substring(0, 2)
  }
  renderRow = ({item}) => {
    const toggleIcon = item.code && !item.hidden ? '^' : '⌄'
    const codeColumn = item.code && !item.hidden ? rowStyles.codeRow : rowStyles.displayNone
    const progressRow = item.code && !item.hidden ? rowStyles.progressRow : rowStyles.displayNone
    const barWidth = Dimensions.get('screen').width - 30
    const codeString = item.code ? `${item.code.substring(0, 3)} ${item.code.substring(3, 6)}` : ''
    return (
      <TouchableOpacity
        style={rowStyles.appCell}
        activeOpacity={0.98}
        /* tslint:disable-next-line jsx-no-lambda */
        onPress={() => { this.props.toggleCode(item.secret) }}
      >
        <View style={rowStyles.mainRow}>
          <View style={rowStyles.mainRowLeftColumn}>
            <View style={rowStyles.iconBox}>
              <Text style={rowStyles.logoText}>{this.getShort(item.issuer).toLocaleUpperCase()}</Text>
            </View>
          </View>
          <View style={rowStyles.mainRowMiddleColumn}>
            <Text style={rowStyles.appName}>{item.issuer}</Text>
            <Text style={rowStyles.userName}>{item.user}</Text>
          </View>
          <View style={rowStyles.mainRowRightColumn}>
            <Text style={rowStyles.toggleRow}>{toggleIcon}</Text>
          </View>
        </View>
        <View style={codeColumn}>
          <View style={rowStyles.spacer}><Text>.</Text></View>
          <Text style={rowStyles.code}>{codeString}</Text>
          <Text style={rowStyles.seconds}/>
        </View>
        <View style={progressRow}>
          <ProgressBarAnimated
              style={{
                backgroundColor: 'red',
                borderRadius: 0,
                borderColor: 'orange'
              }}
              borderRadius={0}
              borderColor={'white'}
              backgroundColor={'black'}
              height={3}
              width={barWidth}
              maxWidth={barWidth}
              value={100 * Number(item.seconds) / 30.0}
          />
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>AirSecure</Text>
        {this.props.apps && <FlatList
          data={this.props.apps}
          renderItem={this.renderRow}
        />}
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
  apps: state.main.authenticatedApps
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode()),
    toggleCode: (secret: string) => dispatch(MainActions.toggleCode(secret))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
