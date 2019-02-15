import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageStyle
} from 'react-native'

import { material, materialColors, systemWeights } from 'react-native-typography'

interface Style {
  applicationView: ViewStyle
  container: ViewStyle
  header: TextStyle
  scanButton: ViewStyle
  scanIcon: ImageStyle
}

const styles = StyleSheet.create<Style>({
  applicationView: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40
  },
  header: {
    ...systemWeights.bold,
    color: materialColors.blackPrimary,
    fontSize: 40,
    marginTop: 40,
    marginBottom: 50,
    alignSelf: 'center'
  },
  scanButton: {
    position: 'absolute',
    bottom: 60,
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: materialColors.blackPrimary,
    zIndex: 3,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  scanIcon: {
    height: 30,
    width: 30
  }
})

export default styles
