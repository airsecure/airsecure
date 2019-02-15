import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
// import urlParse from 'url-parse'
import { Alert } from 'react-native'
import { View, Text, TouchableOpacity } from 'react-native'
import MainActions, { MainState } from '../../Redux/MainRedux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RootAction } from '../../Redux/Types'
import NavigationService from '../../Navigation/Service'
import styles from '../Styles'

interface StateProps {
  accounts: []
}

interface DispatchProps {
  scanNewQRCode: () => void
}

type Props = StateProps & DispatchProps

class Scanner extends Component<Props> {
  state = {  }

  onSuccess = (e: any) => {
    console.log('Scanned', e.data)
    // const parsed = urlParse.parse(e.data)
    Alert.alert(
      JSON.stringify(e.data),
      'Alert Msg',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => NavigationService.navigate('Home') }
      ],
      { cancelable: false }
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess}
          topContent={<Text>Scan barcode</Text>}
          cameraProps={{ captureAudio: false }}
          bottomContent={
            <TouchableOpacity
              // tslint:disable-next-line:jsx-no-lambda
              onPress={() => { NavigationService.navigate('Home') }}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          }
        />
      </View>
    )
  }
}

const mapStateToProps = (state: MainState): StateProps => ({
  accounts: []
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scanner)
