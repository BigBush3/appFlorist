import React from "react";
import {
  Alert,
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

import Colors from "../../constants/Colors.js";

import { formatDateSQL } from "../../components/common/Date.js";
import { retrieveData, Access, storeData } from "../../services/Storage.js";
import { getList, open } from "../../services/Bouquet";

export default class MainScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    loader: false,
    modalAddActive: false,
    network: null,
    access: Access,
    optionList: [
      { value: 0, label: "Продажа" },
      { value: 1, label: "Собрать букет" },
      { value: 2, label: "Оформить заказ" },
    ],
    bouquetList: [],
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
      if (this.state.bouquetList.length == 0) this.setState({ loader: true });
      getList(net.ip).then((res) => {
        //console.log(res.result.sort((a, b) =>  new Date(a.OPENTIME) - new Date(b.OPENTIME)));
        if (res.result)
          this.setState({
            bouquetList: res.result.sort(
              (a, b) => new Date(a.OPENTIME) - new Date(b.OPENTIME)
            ),
            loader: false,
          });
      });
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.navigate("Main");
      return true;
    });
  };

  openBouquet(_id, _photo) {
    open(this.state.network.ip, _id).then((res) => {
      console.log("OPEN", res.result[0], res.result[0]["KOMPLEKTCHECKITEMID"]);

      if (res.result[0]["OPERATIONID"] == 133)
        Alert.alert("Букет уже добавлен в чек");
      else if (res.result[0]["OPERATIONID"] == 132) {
        Alert.alert("Букет уже продан");
      } else if (res.result[0]["OPERATIONID"] == 513)
        Alert.alert("Букет расформирован");
      else {
        storeData("productItem", {
          checkid: _id,
          komplektcheckitemid: res.result[0]["KOMPLEKTCHECKITEMID"],
          name: res.result[0]["CHECKNAME"],
          photo: _photo,
        });
        this.props.navigation.navigate("Product");
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    let list = this.state.bouquetList.map((item, index) => {
      return (
        <UiProductCard
          key={index}
          onPress={() => this.openBouquet(item.CHECKID, item.FOTO)}
          image={{
            uri: `http://${this.state.network.ip}/ibm/public/images/${item.FOTO}`,
          }}
          date={
            formatDateSQL(item.OPENTIME)[0] +
            " " +
            formatDateSQL(item.OPENTIME)[1]
          }
          price={item.TOTAL}
          title={item.NAME}
        />
      );
    });
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <UiHeader headerText="Собранные букеты" />
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={{ paddingVertical: 16 }}
              style={styles.scrollView}
            >
              {this.state.access.enter_assembly == 1 ? (
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
                color={Colors.greenColor}
                size={25}
                name="checkmark-circle-outline"
              />
              <Text
                style={[styles.tabButtonText, { color: Colors.greenColor }]}
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
                color={Colors.darkGrayColor}
                name="list-outline"
              />
              <Text
                style={[styles.tabButtonText, { color: Colors.darkGrayColor }]}
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
        <Loader show={this.state.loader} />
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
