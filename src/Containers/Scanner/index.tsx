import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Image } from 'react-native'
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
    NavigationService.navigate('Home')
  }

  render() {
    return (
      <View style={styles.containerNoPadding}>
        <View style={styles.qrContainer}>
          <QRCodeScanner
            onRead={this.onSuccess}
            topContent={<Text style={styles.scannerHeader}>Scan barcode</Text>}
            cameraProps={{ captureAudio: false }}
            showMarker={true}
            bottomContent={
              <TouchableOpacity
              /* tslint:disable-next-line jsx-no-lambda */
                onPress={() => { NavigationService.navigate('Home') }}
                style={styles.scanButton}
              >
                <Image
                  style={styles.scanIcon}
                  source={require('../../Static/Images/close.png')}
                />
              </TouchableOpacity>
            }
          />
        </View>
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
