import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from '@expo/vector-icons';

import arrowBack from "../../../assets/images/ui/arrowBack-2x.png";
import closeBack from "../../../assets/images/ui/close-2x.png";

import { isIphoneX } from "../../isIphoneX";

import Colors from "../../../constants/Colors";

const statusIOS = isIphoneX() ? 44 : 20;
const statusHeight = Platform.OS === "ios" ? statusIOS : 0;
const heightHeader = 56 + statusHeight;

export default class UiHeader extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.greenColor}
        />
        <TouchableOpacity onPress={this.props.pressLeft} style={styles.button}>
          {this.props.btnLeft == "back" ? (
            <Ionicons name="ios-arrow-back" size={24} color={Colors.whiteColor} />
          ) : null}
          {this.props.btnLeft == "close" ? (
            <Image source={closeBack} style={styles.buttonImage} />
          ) : null}
          {this.props.btnLeft == "menu" ? (
            <Ionicons name="ios-menu" size={24} color={Colors.whiteColor} />
          ) : null}
        </TouchableOpacity>
        <Text style={styles.title}>{this.props.headerText}</Text>
        <TouchableOpacity onPress={this.props.pressRight} style={styles.button}>
          {this.props.btnRight == "close" ? (
            <Ionicons name="md-close" size={24} color={Colors.whiteColor} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
    height: heightHeader,
    paddingTop: statusHeight,
    backgroundColor: Colors.greenColor,
  },
  button: {
    minWidth: 56,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImage: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  title: {
    color: Colors.whiteColor,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: "Roboto-Medium",
  },
});
