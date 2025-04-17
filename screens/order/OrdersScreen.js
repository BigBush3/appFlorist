import React from "react";
import {
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Loader from "../../components/ui/Loader.js";
import TabBarIcon from "../../components/TabBarIcon.js";
import UiHeader from "../../components/ui/header/Header.js";
import UiModalSelect from "../../components/ui/modal/ModalSelect.js";
import UiProductCard from "../../components/ui/cards/ProductCard.js";
import UiTextInput from "../../components/ui/form/TextInput.js";
import Colors from "../../constants/Colors.js";
import UiDocsCard from "../../components/ui/cards/DocsCard.js";

import { formatDateSQL } from "../../components/common/Date.js";
import { retrieveData, Access } from "../../services/Storage.js";
import { getAvailables } from "../../services/Orders";

export default class OrdersScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loader: false,
    modalAddActive: false,
    access: Access,
    searchLine: "",
    ordersList: [],
    optionList: [
      { value: 0, label: "Продажа" },
      { value: 1, label: "Собрать букет" },
      { value: 2, label: "Оформить заказ" },
    ],
  };

  componentDidMount() {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  }

  handleBackButton() {
    return true;
  }

  load = () => {
    retrieveData("user_access").then((_access) => {
      if (_access) this.setState({ access: _access });
    });
    retrieveData("network").then((net) => {
      this.setState({ network: net });
      if (this.state.ordersList.length == 0) this.setState({ loader: true });

      getAvailables(net.ip).then((res) => {
        //console.log(res);
        if (res.result)
          this.setState({ ordersList: res.result, loader: false });
      });
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("Main");
      return true;
    });
  };

  _search(_arr) {
    let _line = this.state.searchLine;
    let arr = [];

    if (_line.length > 0) {
      _arr.map((item) => {
        if (
          item.ORDERID.includes(_line) ||
          item.RECEIVERADDRESS.includes(_line) ||
          item.CUSTOMER.includes(_line) ||
          item.NUMBER.includes(_line) ||
          item.CUSTOMERPHONE.includes(_line)
        ) {
          arr.push(item);
        }
      });
    } else {
      arr = this.state.ordersList;
    }

    return arr;
  }

  render() {
    const { navigate } = this.props.navigation;

    let list = this._search(this.state.ordersList).map((item, index) => {
      return (
        <UiDocsCard
          key={index}
          onPress={() => {
            navigate("Order", {
              orderid: item.ORDERID,
            });
          }}
          address={item.RECEIVERADDRESS}
          client={item.CUSTOMER}
          date={item.TOTIME}
          delivery={item.DOSTAVKA == 1}
          number={item.NUMBER}
          statusDone={item.ORDERREADY == 1}
          phone={item.CUSTOMERPHONE}
        />
      );
    });

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <UiHeader headerText="Заказы" />
          <View style={{ padding: 5 }}>
            <UiTextInput
              placeholder={"Поиск"}
              inputValue={this.state.searchLine}
              disabledValidation={true}
              callBack={(val) => {
                this.setState({ searchLine: val });
              }}
            />
          </View>
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={{ paddingVertical: 16 }}
              style={styles.scrollView}
            >
              {this.state.access.enter_order == 1 ? (
                list
              ) : (
                <Text>Не достаточно прав</Text>
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => this.setState({ modalAddActive: true })}
              style={styles.buttonAdd}
            >
              <TabBarIcon color={Colors.whiteColor} name="add" />
            </TouchableOpacity>
          </View>
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => navigate("Main")}
              style={styles.tabButton}
            >
              <TabBarIcon
                size={25}
                color={Colors.darkGrayColor}
                name="checkmark-circle-outline"
              />
              <Text
                style={[styles.tabButtonText, { color: Colors.darkGrayColor }]}
              >
                Собранные букеты
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("Orders")}
              style={styles.tabButton}
            >
              <TabBarIcon
                size={25}
                color={Colors.greenColor}
                name="list-outline"
              />
              <Text
                style={[styles.tabButtonText, { color: Colors.greenColor }]}
              >
                Заказы
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate("Settings")}
              style={styles.tabButton}
            >
              <TabBarIcon
                size={25}
                color={Colors.darkGrayColor}
                name="settings"
              />
              <Text
                style={[styles.tabButtonText, { color: Colors.darkGrayColor }]}
              >
                Настройки
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* modals */}
        <UiModalSelect
          list={this.state.optionList}
          modalActive={this.state.modalAddActive}
          modalClose={() => this.setState({ modalAddActive: false })}
          onPress={(val) => {
            console.log(val);
            this.setState({ modalAddActive: false });
            if (val == 0) {
              if (this.state.access.enter_sel == 1)
                this.props.navigation.navigate("Selling");
              else Alert.alert("Не достаточно прав !");
            }
            if (val == 1) {
              if (this.state.access.add_item == 1)
                this.props.navigation.navigate("NewProduct");
              else Alert.alert("Не достаточно прав !");
            }
            if (val == 2) {
              if (this.state.access.enter_order == 1)
                this.props.navigation.navigate("NewOrder");
              else Alert.alert("Не достаточно прав !");
            }
          }}
          title="Добавить:"
        />

        <Loader show={this.state.loader} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  safeArea: {
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
    backgroundColor: Colors.whiteColor,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    width: "100%",
    backgroundColor: Colors.lightGrayColor,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 16,
  },
  buttonAdd: {
    position: "absolute",
    right: 8,
    bottom: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderColor: Colors.whiteColor,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: Colors.greenColor,
  },
  tabs: {
    flexDirection: "row",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
    height: 56,
    borderTopColor: Colors.greenColor,
    borderTopWidth: 1,
    backgroundColor: Colors.whiteColor,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonText: {
    marginTop: 4,
    marginLeft: 0,
    fontFamily: "Roboto-Medium",
    fontSize: 12,
    lineHeight: 20,
  },
});
