import React from "react";
import * as Icon from "@expo/vector-icons";

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={this.props.size ? this.props.size : 32}
        style={{ marginBottom: -3 }}
        color={this.props.color}
      />
    );
  }
}
