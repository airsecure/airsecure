import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageStyle
} from 'react-native'

import { material, materialColors, webWeights } from 'react-native-typography'

interface Style {
  appCell: ViewStyle
  mainRow: ViewStyle
  mainRowLeftColumn: ViewStyle
  appIcon: ImageStyle
  mainRowMiddleColumn: ViewStyle
  appName: TextStyle
  userName: TextStyle
  mainRowRightColumn: ViewStyle
  toggleRow: TextStyle
  codeRow: ViewStyle
  spacer: ViewStyle
  code: TextStyle
  seconds: TextStyle
  progressRow: ViewStyle
  displayNone: ViewStyle
}

const styles = StyleSheet.create<Style>({

  appCell: {
    // flex: 1
    marginTop: 40,
    borderBottomColor: '#EFEFFE',
    borderBottomWidth: 0.25
  },
  mainRow: {
    height: 50,
    flexDirection: 'row',
    marginBottom: 20
  },
  mainRowLeftColumn: {
    flex: 0.2,
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  appIcon: {
    height: 30,
    width: 30
  },
  mainRowMiddleColumn: {
    flex: 0.7,
    paddingHorizontal: 10
  },
  appName: {
    ...material.display2Object,
    color: materialColors.blackSecondary,
    textAlign: 'left',
    textTransform: 'uppercase',
    lineHeight: 18,
    fontSize: 14
  },
  userName: {
    ...material.display2Object,
    color: materialColors.blackPrimary,
    textAlign: 'left',
    lineHeight: 24,
    fontSize: 16
  },
  mainRowRightColumn: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toggleRow: {
    ...webWeights.thin,
    color: materialColors.blackTertiary,
    textAlign: 'center',
    fontSize: 34
  },
  codeRow: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20
  },
  spacer: {
    flex: 0.2
  },
  code: {
    flex: 0.7,
    ...material.display2Object,
    color: materialColors.blackPrimary,
    textAlign: 'left',
    lineHeight: 40,
    fontSize: 40,
    paddingHorizontal: 10
  },
  seconds: {
    flex: 0.1
  },
  progressRow: {
    flex: 1
  },
  displayNone: {display: 'none'}
})

export default styles
