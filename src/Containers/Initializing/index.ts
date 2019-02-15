import React, { Component } from 'react'
import { View, Text } from 'react-native'

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
