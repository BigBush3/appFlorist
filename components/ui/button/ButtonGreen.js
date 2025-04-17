import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import * as Font from "expo-font";

export default class UiButtonGreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.button, this.props.disabled ? styles.disButton : null]}
        disabled={this.props.disabled}
        onPress={this.props.onPress}
      >
        <Text
          style={[
            styles.buttonText,
            this.props.disabled ? styles.disButtonText : null,
          ]}
        >
          {this.props.gButtonText}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#8db63b",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: "100%",
  },
  disButton: {
    backgroundColor: "#e8f0d8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontFamily: "Roboto-Medium",
  },
  disButtonText: {
    color: "#8db63b",
  },
});
