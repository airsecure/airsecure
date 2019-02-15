import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { View, Text, ViewStyle } from 'react-native'
import MainActions, { MainState } from '../../redux'

type Props = {}

interface DispatchProps {
  search: () => void
}

class Home extends Component<Props> {
  state = {  }

  render() {
    return (
      <View>
        <Text>Hi</Text>
      </View>
    )
  }
}

export default Home
