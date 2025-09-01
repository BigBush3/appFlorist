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

  getImageUrl = () => {
    if (this.props.photo && this.props.host) {
      return `http://${this.props.host}/ibm/public/images/${this.props.photo}`;
    }
    return null;
  };

  formatAmount = (amount) => {
    if (!amount || amount === "") return "0";
    return parseFloat(amount).toFixed(2);
  };

  render() {
    const imageUrl = this.getImageUrl();
    const totalItem = this.formatAmount(this.props.totalItem);
    const totalPay = this.formatAmount(this.props.totalPay);
    const ostatok = this.formatAmount(this.props.ostatok);

    return (
      <TouchableOpacity onPress={this.props.onPress} style={styles.docsCard}>
        <View style={styles.leftSection}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                this.props.orderReady == "1"
                  ? { backgroundColor: Colors.greenColor }
                  : { backgroundColor: Colors.redColor },
              ]}
            >
              <Text style={styles.statusText}>
                {this.props.orderReady == "1" ? "Собран" : "Не собран"}
              </Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.orderImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialCommunityIcons
                  name="image-outline"
                  size={40}
                  color={Colors.grayColor}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.orderTitle}>Заказ № {this.props.orderId}</Text>
          <Text style={styles.orderNumber}>{this.props.number}</Text>
          <Text style={styles.customerName}>{this.props.customer?.trim()}</Text>
          <Text style={styles.address} numberOfLines={2}>
            {this.props.receiverAddress}
          </Text>

          <View style={styles.financialInfo}>
            <Text style={styles.financialText}>
              Сумма: <Text style={styles.financialValue}>{totalItem} руб.</Text>
            </Text>
            <Text style={styles.financialText}>
              Предоплата:{" "}
              <Text style={styles.financialValue}>{totalPay} руб.</Text>
            </Text>
            <Text style={styles.financialText}>
              Остаток: <Text style={styles.financialValue}>{ostatok} руб.</Text>
            </Text>
          </View>
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
    minHeight: 120,
  },
  leftSection: {
    flexGrow: 0,
    flexShrink: 0,
    width: 80,
    marginRight: 12,
  },
  statusContainer: {
    marginBottom: 8,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 70,
    alignItems: "center",
  },
  statusText: {
    color: Colors.whiteColor,
    fontFamily: "Roboto-Medium",
    fontSize: 10,
    textAlign: "center",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: Colors.lightGrayColor,
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: Colors.lightGrayColor,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderStyle: "dashed",
  },
  rightSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  orderTitle: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 2,
  },
  orderNumber: {
    color: Colors.greenColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  customerName: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  address: {
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  financialInfo: {
    marginTop: "auto",
  },
  financialText: {
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 2,
  },
  financialValue: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
  },
});
