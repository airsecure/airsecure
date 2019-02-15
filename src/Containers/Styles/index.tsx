import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'

interface Style {
  applicationView: ViewStyle
  container: ViewStyle
  main: ViewStyle
  closeButton: ViewStyle
  closeText: TextStyle
}

const styles = StyleSheet.create<Style>({
  applicationView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  main: {
    backgroundColor: 'white',
    flex: 1
  },
  closeButton: {
    zIndex: 3
  },
  closeText: {
    fontSize: 48
  }
})

export default styles
