import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../../constants/Colors.js";

export default class UiProductCard extends React.Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity style={styles.card} onPress={this.props.onPress}>
        <Image
          source={this.props.image}
          resizeMode="cover"
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{this.props.title}</Text>
          <View style={styles.cardAbout}>
            <Text style={styles.cardAboutTitle}>Цена букета:</Text>
            <Text style={styles.cardAboutText}>{this.props.price} руб.</Text>
          </View>
          <View style={styles.cardAbout}>
            <Text style={styles.cardAboutTitle}>Дата сборки:</Text>
            <Text style={styles.cardAboutText}>{this.props.date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  cardImage: {
    flexGrow: 0,
    flexShrink: 0,
    width: 80,
    height: 80,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: Colors.grayColor,
  },
  cardInfo: {
    flexGrow: 1,
    flexShrink: 1,
  },
  cardTitle: {
    marginVertical: 8,
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 20,
  },
  cardAbout: {
    flexDirection: "row",
  },
  cardAboutTitle: {
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  cardAboutText: {
    marginLeft: 8,
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 20,
  },
});
