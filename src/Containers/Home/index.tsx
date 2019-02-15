import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native'
import ProgressBarAnimated from 'react-native-progress-bar-animated'
import NavigationService from '../../Navigation/Service'
import MainActions from '../../Redux/MainRedux'
import { RootAction, RootState } from '../../Redux/Types'
import styles from '../Styles'
import rowStyles from '../Styles/row'
import { ThreadFilesInfo } from '@textile/react-native-sdk'
import { materialColors } from 'react-native-typography'

interface StateProps {
  apps: ReadonlyArray<ThreadFilesInfo>
}

interface DispatchProps {
  scanNewQRCode: () => void
  fakeToggle: (index: number) => void
}

interface ScreenState {
  barWidth: number
}

type Props = StateProps & DispatchProps & ScreenState

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
  renderRow = ({item, index}) => {
    console.log("CODY ITEM: " + item)
    const toggleIcon = item.code && !item.hidden ? '^' : '⌄'
    const codeColumn = item.code && !item.hidden ? rowStyles.codeRow : rowStyles.displayNone
    const progressRow = item.code && !item.hidden ? rowStyles.progressRow : rowStyles.displayNone
    const barWidth = Dimensions.get('screen').width - 30
    const codeString = item.code ? `${item.code.substring(0, 3)} ${item.code.substring(3, 6)}` : ''
    return (
      <TouchableOpacity
        style={rowStyles.appCell}
        /* tslint:disable-next-line jsx-no-lambda */
        onPress={() => { this.props.fakeToggle(index) }}
      >
        <View style={rowStyles.mainRow}>
          <View style={rowStyles.mainRowLeftColumn}>
            {item.logo &&
              <Image
                style={rowStyles.appIcon}
                source={{uri: `http://logo.clearbit.com/${item.url}?size=40`}}
              />
            }
            {
              !item.logo &&
              <Image
                style={rowStyles.appIcon}
                source={require('../../Static/Images/unknown.png')}
              />
            }
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
              backgroundColor={materialColors.blackTertiary}
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
        <FlatList
          data={this.props.apps}
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
  apps: state.main.authenticatedApps
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode()),
    fakeToggle: (index: number) => dispatch(MainActions.fakeToggle(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
