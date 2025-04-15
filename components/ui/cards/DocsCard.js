import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import docIcon from "../../../assets/images/medcard/doc-2x.png";
import Colors from "../../../constants/Colors";
import TabBarIcon from "../../TabBarIcon";

export default class UiDocsCard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.docsCard}>
        <View style={styles.docsCardText}>
          <Text style={styles.textTitle}>Заказ № {this.props.number}</Text>
          <Text style={styles.textDate}>
            Дата получения заказа:{" "}
            <Text style={styles.textDateText}>{this.props.date}</Text>
          </Text>
          <View style={styles.status}>
            <Text style={styles.statusTitle}>Статус сборки: </Text>
            <View
              style={[
                styles.statusText,
                this.props.statusDone
                  ? { backgroundColor: Colors.greenColor }
                  : { backgroundColor: Colors.redColor },
              ]}
            >
              {this.props.statusDone ? (
                <Text style={styles.statusTextText}>собран</Text>
              ) : (
                <Text style={styles.statusTextText}>не собран</Text>
              )}
            </View>
          </View>
          <View style={styles.person}>
            <Text style={styles.personTitle}>Заказчик:</Text>
            <Text style={styles.personText}>{this.props.client}</Text>
            <Text style={styles.personText}>{this.props.phone}</Text>
          </View>
          {this.props.delivery ? (
            <View style={styles.person}>
              <Text style={styles.personTitle}>Адрес доставки:</Text>
              <Text style={styles.personText}>{this.props.address}</Text>
            </View>
          ) : null}
          <View></View>
        </View>
        <View style={styles.docsCardInfo}>
          <TabBarIcon color={Colors.grayColor} name="enter-outline" />
          {this.props.delivery ? (
            <MaterialCommunityIcons
              name="truck-delivery"
              size={42}
              color={Colors.greenColor}
            />
          ) : (
            <MaterialCommunityIcons
              name="shopping"
              size={42}
              color={Colors.grayColor}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  docsCard: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  docsCardText: {
    flexGrow: 1,
    flexShrink: 1,
  },
  textTitle: {
    marginBottom: 6,
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 22,
  },
  textDate: {
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
  },
  textDateText: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 16,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginVertical: 3,
  },
  statusTitle: {
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
  },
  statusText: {
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  statusTextText: {
    color: Colors.whiteColor,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  person: {
    width: "100%",
    marginBottom: 4,
  },
  personTitle: {
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
  },
  personText: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 16,
  },

  docsCardInfo: {
    flexGrow: 0,
    flexShrink: 0,
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: 48,
  },
});
