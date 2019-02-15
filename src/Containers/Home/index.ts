import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, ViewStyle, TouchableOpacity } from 'react-native'
import MainActions, { MainState } from '../../redux'

type Props = {}
type StateProps = {
  accounts: []
}

interface DispatchProps {
  search: () => void
}

class Home extends Component<Props> {
  state = {  }

  render() {
    return (
      <View>
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

const mapStateToProps = (state: MainState): StateProps => ({
  accounts: []
})

const mapDispatchToProps = (dispatch: Dispatch<MainActions>): DispatchProps => {
  return {
    search: () => dispatch(MainActions.apiCallRequest()),
    scanNewQRCode: () => dispatch(MainActions.scanNewQRCode()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
