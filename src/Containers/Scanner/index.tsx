import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, TouchableOpacity } from 'react-native'
import MainActions, { MainState } from '../../Redux/MainRedux'
import QRCodeScanner from 'react-native-qrcode-scanner'
import { RootAction } from '../../Redux/Types'
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

  onSuccess(e: any) {
    console.log('An error occured', e.data)
  }


  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          topContent={
            <Text>
              Go to wikipedia.org/wiki/QR_code on your computer and scan the QR code.
          </Text>
          }
          bottomContent={
            <TouchableOpacity>
              <Text>OK. Got it!</Text>
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
