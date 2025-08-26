import React from "react";
import {
  Alert,
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import Dialog from "react-native-dialog";

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import demoImage from "../../assets/images/icon.png";

import Loader from "../../components/ui/Loader.js";
import TabBarIcon from "../../components/TabBarIcon.js";
import UiButtonGreen from "../../components/ui/button/ButtonGreen.js";
import UiHeader from "../../components/ui/header/Header.js";
import UiModalSelect from "../../components/ui/modal/ModalSelect.js";
import ModalItemsOrder from "../../components/ui/modal/ModalItemsOrder.js";
import UiModalRadio from "../../components/ui/modal/ModalRadio.js";
import UiTextInput from "../../components/ui/form/TextInput.js";
import UiModalBirthPicker from "../../components/ui/modal/ModalBirthPiker.js";
import UiModalTimePicker from "../../components/ui/modal/ModalTimePicker.js";

import Colors from "../../constants/Colors.js";

import { formatDateLine } from "../../components/common/Date";
import { formatDateSQL } from "../../components/common/Date.js";
import {
  addImageItem,
  uploadImageAsync,
  retrieveData,
  Access,
} from "../../services/Storage.js";
import {
  openOrder,
  getOrdersStatus,
  refreshInfo,
  refreshPrepay,
  getOrdersStatusSell,
  getOrdersStatusDelivery,
  getOrdersStatusCurier,
  addUserToOrder,
  orderPhotos,
  addPhoto,
  saveOrder,
} from "../../services/Orders";
import {
  insertProduct,
  removeProduct,
  bouquetList,
  save,
  setTotal,
  insertBouquet,
  updateProduct,
} from "../../services/Check";
import { getProductsList } from "../../services/Bouquet";
import { getClients, searchClient } from "../../services/Orders";
import { getPricelist } from "../../services/Check";
import { getProductsByPricelist, updateProduct as updateBouquetProduct } from "../../services/Bouquet";

export default class OrderScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    access: Access,
    delivery: true,
    loader: false,
    modalAddActive: false,
    modalUserVisible: false,
    modalDate1Visible: false,
    modalTimeVisible: false,
    modalTimeVisible2: false,
    modalItemsEditActive: false,
    modalStatusDeliveryActive: false,

    activeTab: 0,
    orderid: 0,
    photoNum: 11,

    otkydaid: 24,
    statusid: -3,
    DeliveryStatusId: "",
    DeliveryManId: "",

    usersItemList: [],
    prepayList: [],
    productsList: [],
    ordersList: [],
    ordersStatus: [],
    ordersStatusSell: [],
    ordersStatusDelivery: [],
    ordersStatusCurier: [],
    productsBouquetList: [],
    pricelistList: [],
    selectedPricelistId: null,
    selectedPricelistName: "Основной",

    data: null,

    optionList: [
      { value: 0, label: "Продажа", page: "Selling" },
      { value: 1, label: "Собрать букет", page: "" },
      { value: 2, label: "Оформить заказ", page: "" },
    ],

    settings: {
      keyboardType: 0,
      leftItems: 0,
    },
  };

  componentDidMount() {
    //this.load();
    this.props.navigation.addListener("willFocus", this.load);
  }

  handleBackButton() {
    return true;
  }

  getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    }
  };

  _promisedSetState = (newState) => {
    return new Promise((resolve) => {
      this.setState(newState, () => {
        resolve();
      });
    });
  };

  getPhotos(net) {
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 11).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos11: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 12).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos12: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 13).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos13: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 14).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos14: res.result[0]["NAME"] });
        }
      }
    );

    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 21).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos21: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 22).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos22: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 23).then(
      (res) => {
        console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos23: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 24).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos24: res.result[0]["NAME"] });
        }
      }
    );

    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 31).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos31: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 32).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos32: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 33).then(
      (res) => {
        //console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos33: res.result[0]["NAME"] });
        }
      }
    );
    orderPhotos(net.ip, this.props.navigation.state.params.orderid, 34).then(
      (res) => {
        // console.log("orderPhotos", res);
        if (res.result.length > 0) {
          this.setState({ ordersPhotos34: res.result[0]["NAME"] });
        }
      }
    );
  }

  load = () => {
    this.getPermissionAsync();

    retrieveData("fl_settings").then((data) => {
      if (data) {
        if (data !== null && typeof data !== undefined)
          this.setState({ settings: data });
      }
    });

    retrieveData("user_access").then((_access) => {
      if (_access) this.setState({ access: _access });
    });

    retrieveData("network").then((net) => {
      this.setState({ network: net, loader: true });

      this.getPhotos(net);

      getOrdersStatus(net.ip).then((res) => {
        //console.log("getOrdersStatus", res);
        if (res.result) {
          this.setState({ ordersStatus: res.result });
        }
      });
      getOrdersStatusSell(net.ip).then((res) => {
        //console.log(res);
        if (res.result) {
          this.setState({ ordersStatusSell: res.result });
        }
      });
      getOrdersStatusDelivery(net.ip).then((res) => {
        //console.log("ordersStatusDelivery", res);
        if (res.result) {
          res.result.map((item) => {
            item.label = `${item.NAME}`;
          });

          this.setState({ ordersStatusDelivery: res.result });
        }
      });
      getOrdersStatusCurier(net.ip).then((res) => {
        //console.log(res);
        if (res.result) {
          this.setState({ ordersStatusCurier: res.result });
        }
      });

      getProductsList(net.ip, this.state.settings.leftItems).then((res) => {
        if (res.result) {
          res.result.map((item) => {
            item.label = `${item.NAME} руб.`;
          });
          this.setState({ productsList: res.result, loader: false });
        }
      });

      bouquetList(net.ip).then((res) => {
        if (res.result) {
          res.result.map((item) => {
            item.label = `${item.NAME} #${item.CHECKID}`;
          });
          this.setState({ productsBouquetList: res.result });
        }
      });

      getPricelist(net.ip).then((res) => {
        console.log("getPricelist", res);
        if (res.result && res.result.length > 0) {
          res.result.map((item) => {
            item.label = `${item.NAME}`;
            item.value = item.PRICELISTID;
          });

          const firstPricelist = res.result[0];
          this.setState({
            pricelistList: res.result,
            selectedPricelistId: firstPricelist.PRICELISTID || firstPricelist.value,
            selectedPricelistName: firstPricelist.NAME,
          });
        }
      });

      getClients(net.ip).then((res) => {
        let arr = [];
        //console.log(res)
        res.map((item) => {
          item.label = `${item.CLIENT}`;
          item.value = item.CLIENTID;
        });
        this.setState({ usersItemList: res });
      });

      openOrder(net.ip, this.props.navigation.state.params.orderid).then(
        (res) => {
          console.log(res);
          if (res.result) {
            this.setState({
              loader: false,
              data: res.result[0],
              activeTab: 0,
              DeliveryManId: res.result[0]["DELIVERYMANID"],
              CHECKID: res.result[0]["CHECKID"],
            });

            refreshInfo(net.ip, res.result[0]["CHECKID"]).then((info) => {
              //console.log("refreshInfo", info)
              this.setState({ ordersList: info.result ? info.result : [] });
            });

            refreshPrepay(
              net.ip,
              this.props.navigation.state.params.orderid
            ).then((info) => {
              //console.log("refreshPrepay", info)
              this.setState({ prepayList: info.result });
            });
          } else {
            this.props.navigation.navigate("Orders");
          }
        }
      );
    });

    BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert(
        "Внимание",
        "Сохранить изменения ?",
        [
          { text: "Да", onPress: () => this._save() },
          { text: "Нет", onPress: () => this._exitWOS() },
        ],
        { cancelable: false }
      );
      return true;
    });
  };

  _changeData(_line, _val) {
    let _data = this.state.data;
    _data[_line] = _val;
    this.setState({ data: _data });
  }

  _exitWOS() {
    this.props.navigation.navigate("Orders");
  }

  _save() {
    this.setState({ loader: true });

    let DeliveryStatusId = this.state.DeliveryStatusId;
    if (DeliveryStatusId == "") {
      this.state.ordersStatusDelivery.map((item) => {
        if (item.NAME == this.state.data.DELIVERYSTATUS)
          DeliveryStatusId = item.STATUSID;
      });
    }

    saveOrder(
      this.state.network.ip,
      this.props.navigation.state.params.orderid,
      this.state.data.TOTIME,
      this.state.data.STARTTIME,
      this.state.data.ENDTIME,
      this.state.data.CUSTOMER,
      this.state.data.CUSTOMERPHONE != ""
        ? this.state.data.CUSTOMERPHONE
        : "null",
      this.state.data.DOSTAVKA,
      this.state.data.RECEIVER,
      this.state.data.RECEIVERPHONE != ""
        ? this.state.data.RECEIVERPHONE
        : "null",
      this.state.data.RECEIVERADDRESS != ""
        ? this.state.data.RECEIVERADDRESS
        : "null",
      this.state.data.COMMENT != "" ? this.state.data.COMMENT : "null",
      this.state.data.SITENUM != "" ? this.state.data.SITENUM : "null",
      this.state.otkydaid != "" ? this.state.otkydaid : "null",
      this.state.statusid != "" ? this.state.statusid : "null",
      this.state.data.CREATINGBY != "" ? this.state.data.CREATINGBY : "null",
      this.state.DeliveryStatusId != "" ? this.state.DeliveryStatusId : "null",
      this.state.DeliveryManId != "" ? this.state.DeliveryManId : "null",
      this.state.data.ORDERNAME ? this.state.data.ORDERNAME : "null"
    )
      .then((res) => {
        this.setState({ bouquetList: [], loader: false });
        this.props.navigation.navigate("Orders");
      })
      .catch((err) => {
        console.log("err", err);
        this.setState({ bouquetList: [], loader: false });
        this.props.navigation.navigate("Orders");
      });
  }

  _insertProduct(itemid, amount, price) {
    insertProduct(
      this.state.network.ip,
      this.state.CHECKID,
      0,
      itemid,
      amount,
      price,
      amount * price
    ).then((res) => {
      console.log("insertProduct", res);

      refreshInfo(this.state.network.ip, this.state.CHECKID).then((info) => {
        console.log("refreshInfo", info);
        this.setState({ ordersList: info.result });
      });
    });
  }

  _insertBouquet(checkid, bouquetcheckid) {
    insertBouquet(this.state.network.ip, checkid, bouquetcheckid).then(
      (res) => {
        console.log("insertProduct", res);

        refreshInfo(this.state.network.ip, this.state.CHECKID).then((info) => {
          console.log("refreshInfo", info);
          this.setState({ ordersList: info.result });
        });
      }
    );
  }

  _setTotal(checkid, changeAmount2) {
    setTotal(this.state.network.ip, checkid, changeAmount2).then((val) => {
      console.log("setTotal", val);

      refreshInfo(this.state.network.ip, checkid).then((inf) => {
        console.log("info", inf);
        if (inf.result) {
          this.setState({
            ordersList: inf.result,
          });
        }
      });
    });
  }

  _updateProduct(id, changeAmount, price) {
    updateProduct(
      this.state.network.ip,
      id,
      changeAmount,
      parseFloat(price),
      parseFloat(changeAmount.toString().replace(",", ".")) *
        parseFloat(price.toString().replace(",", "."))
    ).then((res) => {
      refreshInfo(this.state.network.ip, this.state.data.CHECKID).then(
        (info) => {
          //console.log("refreshInfo", info)
          this.setState({ ordersList: info.result });
        }
      );
      console.log("_updateProduct", res);
    });
  }

  _removeFromBouquet(_id) {
    console.log("removeProduct", _id);
    removeProduct(this.state.network.ip, _id).then((res) => {
      //console.log("removeProduct", res);

      refreshInfo(this.state.network.ip, this.state.data.CHECKID).then(
        (info) => {
          //console.log("refreshInfo", info)
          this.setState({ ordersList: info.result });
        }
      );
    });
  }

  updatePricelist = (pricelist, shouldUpdatePrices = false) => {
    console.log("updatePricelist вызван с параметрами:", { pricelist, shouldUpdatePrices });
    console.log("Текущее состояние ordersList:", this.state.ordersList);
    
    this.setState({ 
      loader: true,
      selectedPricelistId: pricelist.PRICELISTID || pricelist.value,
      selectedPricelistName: pricelist.NAME,
    });

    this._loadProductsByPricelist(
      this.state.network.ip, 
      pricelist.PRICELISTID || pricelist.value,
      shouldUpdatePrices
    );
  }

  _loadProductsByPricelist = (host, pricelistId, shouldUpdatePrices = false) => {
    console.log("_loadProductsByPricelist вызван с параметрами:", { host, pricelistId, shouldUpdatePrices });
    console.log("Текущие товары в заказе:", this.state.ordersList);
    
    getProductsByPricelist(host, pricelistId)
      .then((res) => {
        console.log("getProductsByPricelist response:", res.result ? res.result[0] : res);
        if (res && res.result) {
          res.result.map((item) => {
            item.label = `${item.NAME} руб.`;
          });
          this.setState({
            productsList: res.result,
            loader: false,
          });

          console.log("shouldUpdatePrices:", shouldUpdatePrices, "ordersList.length:", this.state.ordersList.length);
          
          if (shouldUpdatePrices && this.state.ordersList.length > 0) {
            console.log("Показываем диалог пересчета цен");
            Alert.alert(
              "Смена прайслиста",
              "Пересчитать цены уже добавленных товаров согласно новому прайслисту?",
              [
                {
                  text: "Нет",
                  onPress: () => {
                    console.log("Пользователь отказался от пересчета цен");
                  },
                  style: "cancel",
                },
                {
                  text: "Да", 
                  onPress: () => {
                    console.log("Пользователь согласился на пересчет цен");
                    this._updateAllOrderPrices(res.result);
                  }
                },
              ],
              { cancelable: false }
            );
          } else {
            console.log("Пересчет цен не требуется");
          }
        } else {
          console.log("No result in response:", res);
          Alert.alert(
            "Внимание",
            "Не удалось загрузить товары для выбранного прайслиста"
          );
          this.setState({ loader: false });
        }
      })
      .catch((error) => {
        console.log("Error loading products by pricelist:", error);
        Alert.alert(
          "Ошибка",
          "Не удалось загрузить товары по прайслисту. Проверьте подключение к серверу."
        );
        this.setState({ loader: false });
      });
  }

  _updateAllOrderPrices = async (newProductsList) => {
    if (this.state.ordersList.length === 0) return;

    console.log("Начинаем пересчет цен для товаров:", this.state.ordersList);
    console.log("Новый прайслист:", newProductsList);

    const updatePromises = [];

    for (let i = 0; i < this.state.ordersList.length; i++) {
      const orderItem = this.state.ordersList[i];
      console.log("Обрабатываем товар:", orderItem);
      
      // Ищем товар в новом прайслисте по названию
      const updatedProduct = newProductsList.find(
        (product) => product.NAME === orderItem.NAME
      );

      console.log("Найден товар в прайслисте:", updatedProduct);

      if (updatedProduct) {
        const newPrice = parseFloat(updatedProduct.PRICE.toString().replace(",", "."));
        const currentPrice = parseFloat(orderItem.PRICE.toString().replace(",", "."));
        
        console.log(`Сравнение цен для ${orderItem.NAME}: текущая=${currentPrice}, новая=${newPrice}`);
        
        if (newPrice !== currentPrice) {
          console.log(`Обновляем цену товара ${orderItem.NAME}: ${currentPrice} -> ${newPrice}`);

          const amount = parseFloat(orderItem.AMOUNT.toString().replace(",", "."));
          const total = amount * newPrice;

          console.log(`Параметры для updateProduct: CHECKITEMID=${orderItem.CHECKITEMID}, amount=${amount}, price=${newPrice}, total=${total}`);

          const updatePromise = updateProduct(
            this.state.network.ip,
            orderItem.CHECKITEMID,
            amount,
            newPrice,
            total
          ).then((res) => {
            console.log("updateProduct успешно выполнен для", orderItem.NAME, res);
            return res;
          }).catch((error) => {
            console.log("Ошибка обновления товара на сервере:", orderItem.NAME, error);
            throw error;
          });

          updatePromises.push(updatePromise);
        } else {
          console.log(`Цена товара ${orderItem.NAME} не изменилась`);
        }
      } else {
        console.log(`Товар ${orderItem.NAME} не найден в новом прайслисте`);
      }
    }

    try {
      // Ждем завершения всех обновлений
      await Promise.all(updatePromises);
      console.log("Все товары обновлены, обновляем информацию о заказе");

      // Обновляем информацию о заказе после всех изменений
      refreshInfo(this.state.network.ip, this.state.data.CHECKID).then((info) => {
        console.log("refreshInfo after price update", info);
        this.setState({ ordersList: info.result || [] });
      });
    } catch (error) {
      console.log("Ошибка при пересчете цен:", error);
      Alert.alert("Ошибка", "Не удалось пересчитать цены некоторых товаров");
      
      // Все равно обновляем информацию о заказе
      refreshInfo(this.state.network.ip, this.state.data.CHECKID).then((info) => {
        console.log("refreshInfo after error", info);
        this.setState({ ordersList: info.result || [] });
      });
    }
  }

  _pickImage = async (_photoNum) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!result.canceled) {
      await this._promisedSetState({ loader: true });
      let uri = result.assets[0].uri;
      uri = Platform.OS === "android" ? uri : uri.replace("file://", "");
      console.log(result);

      uploadImageAsync(this.state.network.ip, uri)
        .then((res) => {
          console.log("avatart", res);
          this._promisedSetState({ loader: false });
          if (res.image) {
            addPhoto(
              this.state.network.ip,
              this.props.navigation.state.params.orderid,
              res.image.image_name,
              _photoNum
            ).then((result) => {
              console.log(result);
              this.getPhotos(this.state.network);
            });
          }
        })
        .catch((res) => {
          console.log("err", res);
          this._promisedSetState({ loader: false });
        });
    } else {
      this.setState({ modalAlertAddVisible: !this.state.modalAlertAddVisible });
    }
  };

  _getStatusName(_arr, _id) {
    let val = null;
    _arr.map((item, index) => {
      if (item.STATUSID == _id) val = item.NAME;
    });
    return val;
  }

  render() {
    const { navigate } = this.props.navigation;

    let totalSum = 0;
    let ordersList = this.state.ordersList.map((item, index) => {
      const amount = parseFloat(item.AMOUNT.toString().replace(",", "."));
      const price = parseFloat(item.PRICE.toString().replace(",", "."));
      const itemTotal = amount * price;
      totalSum += itemTotal;
      
      return (
        <Text style={styles.infoText} key={index}>
          {item.NAME}:{" "}
          <Text style={styles.infoTextMark}>{amount} шт.</Text>
          {" x "}
          <Text style={styles.infoTextMark}>{price} руб.</Text>
          {" = "}
          <Text style={styles.infoTextMark}>{itemTotal.toFixed(2)} руб.</Text>
          {this.state.showEdit ? (
            <Text
              style={styles.infoTextRedMark}
              onPress={() => this._removeFromBouquet(item.CHECKITEMID)}
            >
              {" "}
              X{" "}
            </Text>
          ) : null}
        </Text>
      );
    });

    let prepayList = this.state.prepayList.map((item, index) => {
      return (
        <Text style={styles.infoText} key={index}>
          {item.NAME}:{" "}
          <Text style={styles.infoTextMark}>{item.TOTAL} руб.</Text>
        </Text>
      );
    });

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <UiHeader
            btnLeft="back"
            pressLeft={() => {
              Alert.alert(
                "Внимание",
                "Сохранить изменения ?",
                [
                  { text: "Да", onPress: () => this._save() },
                  { text: "Нет", onPress: () => this._exitWOS() },
                ],
                { cancelable: false }
              );
            }}
            headerText={
              this.state.data ? `Заказ №${this.state.data.CHECKID}` : null
            }
          />
          {this.state.data ? (
            <View>
              <View style={styles.content}>
                <ScrollView
                  contentContainerStyle={{ paddingVertical: 16 }}
                  style={styles.scrollView}
                >
                  {this.state.activeTab == 0 ? (
                    <View style={styles.tabContent}>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          {/*
                        <Text style={styles.infoText}   >
                          Дата заказа:{" "}
                          <Text style={styles.infoTextMark}>{(this.state.data.TOTIME)}</Text>
                        </Text>
                        */}

                          <Text
                            style={styles.infoText}
                            onPress={() =>
                              this.setState({ modalDate1Visible: true })
                            }
                          >
                            Дата получения заказа:{" "}
                            <Text style={styles.infoTextMark}>
                              {this.state.data.TOTIME}
                            </Text>
                          </Text>

                          <Text
                            style={styles.infoText}
                            onPress={() =>
                              this.setState({ modalTimeVisible: true })
                            }
                          >
                            Интервал получения заказа:{" "}
                            <Text style={styles.infoTextMark}>
                              C {this.state.data.STARTTIME}{" "}
                            </Text>
                          </Text>

                          <Text
                            style={styles.infoText}
                            onPress={() =>
                              this.setState({ modalTimeVisible2: true })
                            }
                          >
                            Интервал получения заказа:{" "}
                            <Text style={styles.infoTextMark}>
                              ПО {this.state.data.ENDTIME}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Заказчик</Text>
                          <Text style={styles.infoText}>ФИО заказчика: </Text>

                          <UiTextInput
                            placeholder={this.state.data.CUSTOMER}
                            inputValue={this.state.data.CUSTOMER}
                            callBack={(val) => {
                              this._changeData("CUSTOMER", val);
                              this.setState({ customer: val });
                            }}
                          />

                          <Text style={styles.infoText}>
                            Телефон заказчика:{" "}
                          </Text>

                          <UiTextInput
                            placeholder={this.state.data.CUSTOMERPHONE}
                            inputValue={this.state.data.CUSTOMERPHONE}
                            keyboardType="number-pad"
                            callBack={(val) => {
                              this._changeData("CUSTOMERPHONE", val);
                              this.setState({ customerphone: val });
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          {this.state.data.DOSTAVKA == 1 ? (
                            <MaterialCommunityIcons
                              name="truck-delivery"
                              size={32}
                              color={Colors.greenColor}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="shopping"
                              size={32}
                              color={Colors.grayColor}
                            />
                          )}

                          <Text style={styles.infoTitle}>
                            Способ получения :{" "}
                            {this.state.data.DOSTAVKA == 1
                              ? "Доставка"
                              : "Самовывоз"}
                          </Text>

                          {this.state.data.DOSTAVKA == 0 ? (
                            <UiButtonGreen
                              gButtonText="Установить Доставка"
                              onPress={() => this._changeData("DOSTAVKA", 1)}
                            />
                          ) : (
                            <UiButtonGreen
                              gButtonText="Установить Самовывоз"
                              onPress={() => this._changeData("DOSTAVKA", 0)}
                            />
                          )}
                        </View>
                      </View>
                      {this.state.data.DOSTAVKA == 1 ? (
                        <View style={styles.info}>
                          <View style={styles.infoWrap}>
                            <Text style={styles.infoTitle}>Получатель</Text>

                            <UiTextInput
                              inputValue={this.state.data.RECEIVER}
                              callBack={(val) => {
                                this._changeData("RECEIVER", val);
                              }}
                            />
                            <UiTextInput
                              placeholder={
                                this.state.data.RECEIVERPHONE
                                  ? this.state.data.RECEIVERPHONE
                                  : "Телефон получателя"
                              }
                              inputValue={this.state.data.RECEIVERPHONE}
                              callBack={(val) => {
                                this._changeData("RECEIVERPHONE", val);
                              }}
                            />
                            <UiTextInput
                              placeholder={
                                this.state.data.RECEIVERADDRESS
                                  ? this.state.data.RECEIVERADDRESS
                                  : "Адрес доставки"
                              }
                              inputValue={this.state.data.RECEIVERADDRESS}
                              callBack={(val) => {
                                this._changeData("RECEIVERADDRESS", val);
                              }}
                            />
                          </View>
                        </View>
                      ) : null}
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Состав заказа</Text>
                          {ordersList}
                          {this.state.ordersList && this.state.ordersList.length > 0 ? (
                            <Text style={[styles.infoText, { marginTop: 12, fontWeight: 'bold' }]}>
                              Общая сумма товаров: <Text style={styles.infoTextMark}>{totalSum.toFixed(2)} руб.</Text>
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      <View style={styles.info}>
                        <UiButtonGreen
                          gButtonText="Изменить состав"
                          onPress={() => {
                            if (
                              this.state.access.rem_item == 1 &&
                              this.state.access.add_item == 1
                            )
                              this.setState({
                                modalItemsEditActive: true,
                                //modalAddActive: true
                              });
                            else Alert.alert("Не достаточно прав !");
                          }}
                        />
                      </View>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Предоплаты</Text>
                          {prepayList}
                        </View>
                      </View>
                      {/*
                  <View style={styles.info}>
                    <View style={styles.infoWrap}>
                      <Text style={styles.infoTitle}>Доп. инфо</Text>
                      <Text style={styles.infoText}>
                        Дополнительная информация
                      </Text>
                    </View>
                  </View>
                  */}
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Комментарий</Text>
                          <UiTextInput
                            placeholder={
                              this.state.data.COMMENT
                                ? this.state.data.COMMENT
                                : "Комментарий"
                            }
                            inputValue={this.state.data.COMMENT}
                            callBack={(val) => {
                              this._changeData("COMMENT", val);
                            }}
                          />
                        </View>
                      </View>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Канал продаж</Text>
                          <Text style={styles.infoText}>
                            {this.state.data.OTKYDAID
                              ? this._getStatusName(
                                  this.state.ordersStatusSell,
                                  this.state.data.OTKYDAID
                                )
                              : "Не указан"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {this.state.activeTab == 1 ? (
                    <View style={styles.tabContent}>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Статус заказа</Text>
                          <Text style={styles.infoText}>
                            {this._getStatusName(
                              this.state.ordersStatus,
                              this.state.data.STATUSORDERID
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>
                            Кто выполняет заказ
                          </Text>

                          {this.state.data.STATUSDELIVERYID != -17 &&
                          this.state.DeliveryManId != "" ? (
                            <Text style={styles.infoText}>
                              {this.state.DeliveryManName
                                ? this.state.DeliveryManName
                                : this.state.data.DELIVERYMAN}
                            </Text>
                          ) : (
                            <UiButtonGreen
                              gButtonText="Взять в работу"
                              onPress={() =>
                                this.setState({
                                  modalStatusDeliveryActive: true,
                                })
                              }
                            />
                          )}
                        </View>
                      </View>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>Статус доставка</Text>
                          <Text style={styles.infoText}>
                            {this._getStatusName(
                              this.state.ordersStatusDelivery,
                              this.state.data.STATUSDELIVERYID
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : null}
                  {this.state.activeTab == 2 ? (
                    <View style={styles.tabContent}>
                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>
                            Пожелания клиента
                          </Text>
                          <View style={styles.infoPhotos}>
                            {this.state.ordersPhotos11 ? (
                              <TouchableOpacity
                                onPress={() => {}}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos11}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                style={styles.infoPhotoAdd}
                                onPress={() => this._pickImage(11)}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos12 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(12)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos12}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(12)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos13 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(13)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos13}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(13)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos14 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(14)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos14}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(14)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>

                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>
                            Выполненный заказ
                          </Text>
                          <View style={styles.infoPhotos}>
                            {this.state.ordersPhotos21 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(21)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos21}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(21)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos22 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(22)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos22}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(22)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos23 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(23)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos23}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(23)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos24 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(24)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos24}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(24)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>

                      <View style={styles.info}>
                        <View style={styles.infoWrap}>
                          <Text style={styles.infoTitle}>
                            Выполненная доставка
                          </Text>
                          <View style={styles.infoPhotos}>
                            {this.state.ordersPhotos31 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(31)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos31}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(31)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos32 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(32)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos32}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(32)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos33 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(33)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos33}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(33)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                            {this.state.ordersPhotos34 ? (
                              <TouchableOpacity
                                onPress={() => this._pickImage(34)}
                                style={styles.infoPhoto}
                              >
                                <Image
                                  resizeMode="cover"
                                  source={{
                                    uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos34}`,
                                  }}
                                  style={styles.infoPhotoImage}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => this._pickImage(34)}
                                style={styles.infoPhotoAdd}
                              >
                                <Ionicons
                                  name="add"
                                  size={24}
                                  color={Colors.darkGrayColor}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </ScrollView>
              </View>
              <View style={styles.tabs}>
                <TouchableOpacity
                  onPress={() => this.setState({ activeTab: 0 })}
                  style={styles.tabButton}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={32}
                    color={
                      this.state.activeTab == 0
                        ? Colors.greenColor
                        : Colors.darkGrayColor
                    }
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      this.state.activeTab == 0
                        ? { color: Colors.greenColor }
                        : { color: Colors.darkGrayColor },
                    ]}
                  >
                    Инфо
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ activeTab: 1 })}
                  style={styles.tabButton}
                >
                  <Ionicons
                    name="bookmarks-outline"
                    size={26}
                    color={
                      this.state.activeTab == 1
                        ? Colors.greenColor
                        : Colors.darkGrayColor
                    }
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      this.state.activeTab == 1
                        ? { color: Colors.greenColor }
                        : { color: Colors.darkGrayColor },
                    ]}
                  >
                    Статусы
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ activeTab: 2 })}
                  style={styles.tabButton}
                >
                  <Ionicons
                    name="image-outline"
                    size={28}
                    color={
                      this.state.activeTab == 2
                        ? Colors.greenColor
                        : Colors.darkGrayColor
                    }
                  />
                  <Text
                    style={[
                      styles.tabButtonText,
                      this.state.activeTab == 2
                        ? { color: Colors.greenColor }
                        : { color: Colors.darkGrayColor },
                    ]}
                  >
                    Фото
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </SafeAreaView>
        {/* modals */}
        <Loader show={this.state.loader} />

        <ModalItemsOrder
          list={this.state.ordersList}
          productsList={this.state.productsList}
          productsBouquetList={this.state.productsBouquetList}
          pricelistList={this.state.pricelistList}
          selectedPricelistId={this.state.selectedPricelistId}
          updatePricelist={this.updatePricelist}
          modalActive={this.state.modalItemsEditActive}
          modalClose={() => this.setState({ modalItemsEditActive: false })}
          removeFromBouquet={(val) => {
            this._removeFromBouquet(val);
          }}
          insertBouquet={(bouquetcheckid) => {
            this._insertBouquet(this.state.CHECKID, bouquetcheckid);
          }}
          insertProduct={(itemid, amount, price) => {
            this._insertProduct(itemid, amount, price);
          }}
          updateProduct={(id, changeAmount, price) => {
            this._updateProduct(id, changeAmount, price);
          }}
          setTotal={(changeAmount2) => {
            this._setTotal(this.state.CHECKID, changeAmount2);
          }}
          title="Состав заказа:"
        />

        {/*
        <UiModalSelect
          list={this.state.optionList}
          modalActive={this.state.modalAddActive}
          modalClose={() => this.setState({ modalAddActive: false })}
          onPress={(val) => {
            this.setState({ modalAddActive: false }, () =>
              console.log(this.state.optionList[val].page)
              //navigate(this.state.optionList[val].page)
            );
          }}
          title="Добавить:"
        />
          */}
        <UiModalRadio
          subtitle="Выбрать"
          modalChecked={[]}
          modalItems={this.state.ordersStatusDelivery}
          modalCallBack={(val) => {
            console.log(val.USERSID, val);
            this.setState(
              {
                DeliveryManId: val.USERSID,
                DeliveryManName: val.NAME,
              },
              () => {
                this._save();
              }
            );
          }}
          selectFunction={() => {
            this.setState({ modalStatusDeliveryActive: false });
          }}
          modalVisible={this.state.modalStatusDeliveryActive}
        />

        <UiModalRadio
          subtitle="Выбрать товар"
          modalChecked={[]}
          modalItems={this.state.productsList}
          modalCallBack={(val) => {
            console.log(val.PRICE, val);
            this.setState({
              selectedProduct: val,
              itemid: val.ITEMID,
              price: parseFloat(val.PRICE),
              showModalCount: true,
            });
          }}
          selectFunction={() => {
            this.setState({ modalAddActive: !this.state.modalAddActive });
          }}
          modalVisible={this.state.modalAddActive}
        />

        <UiModalRadio
          subtitle="Выберите пользователя:"
          modalChecked={this.state.clientId}
          modalItems={this.state.usersItemList}
          modalCallBack={(val) => {
            this._changeData("CUSTOMER", val.CLIENT);
            this.setState({
              CUSTOMER: val.CLIENT,
              //CUSTOMER: val.CLIENTID
            });
          }}
          selectFunction={() => {
            this.setState({ modalUserVisible: !this.state.modalUserVisible });
          }}
          modalVisible={this.state.modalUserVisible}
        />

        <UiModalBirthPicker
          modalText="Выберите дату"
          modalCallBack={(val) => {
            console.log(val);
            this._changeData("TOTIME", formatDateLine(val));
            this.setState({ date: formatDateLine(val) });
          }}
          modalCancelFunction={() => {
            this.setState({ modalDate1Visible: !this.state.modalDate1Visible });
          }}
          modalOkFunction={() => {
            this.setState({ modalDate1Visible: !this.state.modalDate1Visible });
          }}
          modalVisible={this.state.modalDate1Visible}
        />

        <UiModalTimePicker
          subtitle="Выберите"
          modalCallBack={(val) => {
            console.log(val);
            this._changeData("STARTTIME", val.hh + ":" + val.mm + ":00");
            this.setState({
              StartTime: val.hh + ":" + val.mm + ":00",
            });
          }}
          modalCancelFunction={() => this.setState({ modalTimeVisible: false })}
          modalOkFunction={() => this.setState({ modalTimeVisible: false })}
          selectFunction={() => this.setState({ modalTimeVisible: false })}
          modalVisible={this.state.modalTimeVisible}
        />

        <UiModalTimePicker
          subtitle="Выберите"
          modalCallBack={(val) => {
            console.log(val);
            this._changeData("ENDTIME", val.hh + ":" + val.mm + ":00");
            this.setState({
              EndTime: val.hh + ":" + val.mm + ":00",
            });
          }}
          modalCancelFunction={() =>
            this.setState({ modalTimeVisible2: false })
          }
          modalOkFunction={() => this.setState({ modalTimeVisible2: false })}
          selectFunction={() => this.setState({ modalTimeVisible2: false })}
          modalVisible={this.state.modalTimeVisible2}
        />

        <Dialog.Container visible={this.state.showModalCount}>
          <Dialog.Title style={{ color: "#000" }}>
            Введите кол-во товара
          </Dialog.Title>
          <Dialog.Input
            style={{ color: "#000" }}
            keyboardType="numeric"
            onChangeText={(value) => {
              this.setState({ amount: value });
            }}
          />
          <Dialog.Button
            label="Ok"
            onPress={() => {
              this.setState({ showModalCount: false }, () => {
                //this._insertBouquet(this.state.itemid, this.state.amount);
                this._insertProduct(
                  this.state.itemid,
                  this.state.amount,
                  this.state.price
                );
              });
            }}
          />
        </Dialog.Container>
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

  tabContent: {
    width: "100%",
  },
  info: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  infoWrap: {
    flexGrow: 1,
    flexShrink: 1,
  },
  infoTitle: {
    marginBottom: 4,
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 22,
  },
  infoText: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    lineHeight: 22,
  },
  infoTextMark: {
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 22,
  },
  infoTextRedMark: {
    color: Colors.redColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 22,
  },
  infoPhotos: {
    flexDirection: "row",
    width: "100%",
  },
  infoPhotoAdd: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.grayColor,
    margin: 5,
  },
  infoPhoto: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 64,
    marginRight: 8,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoPhotoImage: {
    width: "100%",
    height: "100%",
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
    marginLeft: 8,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 20,
  },
});
