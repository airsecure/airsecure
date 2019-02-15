import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, TouchableOpacity } from 'react-native'
import MainActions, { MainState } from '../../Redux/MainRedux'
import { RootAction, RootState } from '../../Redux/Types'
import styles from '../Styles'
import { ThreadFilesInfo } from '@textile/react-native-sdk'

interface StateProps {
  apps: ThreadFilesInfo[]
}

interface DispatchProps {
  scanNewQRCode: () => void
}

type Props = StateProps & DispatchProps

class Home extends Component<Props> {
  state = {  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This should be a list of your Apps to auth</Text>
        <TouchableOpacity
          onPress={this.props.scanNewQRCode}
        >
          <Text>This should be a QR Code Button</Text>
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
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
