import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageStyle
} from 'react-native'

import RF from 'react-native-responsive-fontsize'

import { material, materialColors, webWeights } from 'react-native-typography'

interface Style {
  appCell: ViewStyle
  mainRow: ViewStyle
  mainRowLeftColumn: ViewStyle
  iconBox: ViewStyle
  logoText: TextStyle
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconBox: {
    height: 50,
    width: 50,
    borderWidth: 0,
    backgroundColor: materialColors.blackPrimary,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    ...material.display2Object,
    color: materialColors.whitePrimary,
    textAlign: 'left',
    lineHeight: RF(3.8),
    fontSize: RF(3.6),
    zIndex: 3
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
    fontSize: RF(1.8)
  },
  userName: {
    ...material.display2Object,
    color: materialColors.blackPrimary,
    textAlign: 'left',
    lineHeight: 24,
    fontSize: RF(2.2)
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
    flex: 1,
    height: 4
  },
  displayNone: {display: 'none'}
})

export default styles
