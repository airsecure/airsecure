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
  scanNewQRCodeSuccess: (url: string) => void
}

type Props = StateProps & DispatchProps

class Scanner extends Component<Props> {
  state = {  }

  onSuccess = (e: any) => {
    this.props.scanNewQRCodeSuccess(e.data)
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
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode()),
    scanNewQRCodeSuccess: (url: string) => dispatch(MainActions.scanNewQRCodeSuccess(url))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Scanner)
