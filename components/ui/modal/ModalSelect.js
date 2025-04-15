import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../../constants/Colors";

export default class UiModalSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let list = this.props.list.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.props.onPress(index)}
          style={styles.button}
        >
          <View style={styles.buttonDot}></View>
          <Text style={styles.buttonText}>{item.label}</Text>
        </TouchableOpacity>
      );
    });

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalActive}
        onRequestClose={() => {
          this.props.modalClose();
        }}
      >
        <SafeAreaView style={styles.modal}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => this.props.modalClose()}
          ></TouchableOpacity>
          <View style={styles.modalInner}>
            {!this.props.title ? null : (
              <Text style={styles.title}>{this.props.title}</Text>
            )}
            {!this.props.subtitle ? null : (
              <Text style={styles.subtitle}>{this.props.subtitle}</Text>
            )}
            {list}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalClose: {
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
  },
  modalInner: {
    width: "100%",
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.whiteColor,
  },
  title: {
    marginBottom: 8,
    paddingHorizontal: 20,
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    lineHeight: 22,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    color: Colors.darkGrayColor,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonDot: {
    width: 6,
    height: 6,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: Colors.greenColor,
  },
  buttonText: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 22,
  },
});
