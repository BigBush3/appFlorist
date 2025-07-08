import React from "react";
import {
  Alert,
  BackHandler,
  Image,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Dialog from "react-native-dialog";

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import demoImage from "../../assets/images/icon.png";

import Loader from "../../components/ui/Loader.js";
import TabBarIcon from "../../components/TabBarIcon.js";
import UiButtonGreen from "../../components/ui/button/ButtonGreen.js";
import UiTextInput from "../../components/ui/form/TextInput.js";
import UiHeader from "../../components/ui/header/Header.js";
import UiModalSelect from "../../components/ui/modal/ModalSelect.js";
import UiModalRadio from "../../components/ui/modal/ModalRadio.js";
import UiModalRadioPay from "../../components/ui/modal/ModalRadioPay.js";

import Colors from "../../constants/Colors.js";
import UiSwipeList from "../../components/ui/list/SwipeList";

import { retrieveData, uploadImageAsync } from "../../services/Storage.js";
import {
  newCheck,
  discountList,
  setDiscount,
  bouquetList,
  insertProduct,
  insertBouquet,
  removeProduct,
  updateProduct,
  setTotal,
  dontSave,
  save,
  setClient,
  getPaymentsType,
  addPayment,
  refrashList,
  close,
} from "../../services/Check";
import { getClients, searchClient, refreshInfo } from "../../services/Orders";
import { getProductsList } from "../../services/Bouquet";

export default class SellingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    delivery: true,
    loader: false,
    modalAddActive: false,
    modalAddActive2: false,
    modalCategoryVisible: false,
    showModalTotalPrice: false,
    modalAdditionalActive: false,
    modalUserVisible: false,
    modalPayTypeVisible: false,
    modalDiscountVisible: false,

    userId: 0,
    activeTab: 0,

    totalPrice: 0,
    CheckName: "Чек",
    checkid: null,
    totalUserPrice: null,
    komplektcheckitemid: 0,
    itemid: null,
    amount: 1,
    price: 1,
    changeAmount: 1,
    changeAmount2: 1000,

    clientName: "Нет",
    clientId: null,
    discount: 0,

    discountId: 0,
    discountName: null,

    optionList: [
      { value: 0, label: "Цена букета" },
      { value: 1, label: "Удалить все товары" },
      { value: 2, label: "Добавить клиента" },
      { value: 3, label: "Добавить скидку" },
    ],

    swipeList: [],
    bouquetList: [],
    productsList: [],
    productsBouquetList: [],
    usersItemList: [],
    paymentsList: [],
    discountList: [],

    settings: {
      keyboardType: 0,
      leftItems: 0,
    },
  };

  componentDidMount() {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  }

  handleBackButton() {
    return true;
  }

  load = () => {
    retrieveData("fl_settings").then((data) => {
      if (data) {
        if (data !== null && typeof data !== undefined)
          this.setState({ settings: data });
      }
    });

    retrieveData("user").then((_user) => {
      console.log("user", _user);
      if (_user) {
        this.setState({
          userId: _user.USERSID,
        });
      }
    });

    retrieveData("network").then((net) => {
      this.setState({ loader: true, network: net });

      newCheck(net.ip, this.state.userId).then((res) => {
        console.log(res);
        if (res.findDay) {
          if (res.findDay[0]["1"] == 0) {
            Alert.alert(
              "Внимание",
              "смена еще не открыта",
              [
                {
                  text: "OK",
                  onPress: () => this.props.navigation.navigate("Main"),
                },
              ],
              { cancelable: false }
            );
          } else {
            this.setState({
              checkid: res.result[0]["CHECKID"],
              incomePayments: 0,
              totalUserPrice: null,
              clientName: "",
              CheckName: "Чек",
              discount: 0,
              totalPrice: 0,
              discountName: null,
            });
            if (res.result[0]["CHECKID"] == "")
              Alert.alert("Внимание CHECKID пустой");

            getPaymentsType(net.ip, res.result[0]["CHECKID"]).then((res) => {
              console.log("getPaymentsType", res);
              if (res.result) {
                res.result.map((item) => {
                  item.label = `${item.NAME}`;
                });
                this.setState({ paymentsList: res.result });
              }
            });
          }
        } else {
          Alert.alert(
            "Внимание",
            "смена еще не открыта",
            [
              {
                text: "OK",
                onPress: () => this.props.navigation.navigate("Main"),
              },
            ],
            { cancelable: false }
          );
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
          this.setState({ productsBouquetList: res.result, loader: false });
        }
      });

      discountList(net.ip).then((res) => {
        console.log("discountList", res);
        if (res.result) {
          res.result.map((item) => {
            item.label = `${item.NAME}`;
          });
          this.setState({ discountList: res.result });
        }
      });

      getClients(net.ip).then((res) => {
        let arr = [];
        res.map((item) => {
          item.label = `${item.CLIENT}`;
          item.value = item.CLIENTID;
        });
        this.setState({ usersItemList: res });
      });
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

  _exitWOS() {
    this.setState({ loader: true });
    dontSave(this.state.network.ip, this.state.checkid, this.state.userId).then(
      (res) => {
        this.setState({ bouquetList: [], loader: false });
        this.props.navigation.navigate("Main");
      }
    );
  }

  _save() {
    this.setState({ loader: true });
    save(this.state.network.ip, this.state.checkid, this.state.CheckName).then(
      (res) => {
        this.setState({ bouquetList: [], loader: false });
        this.props.navigation.navigate("Main");
      }
    );
  }

  _close() {
    this.setState({ loader: true });
    close(this.state.network.ip, this.state.checkid, this.state.userId).then(
      (res) => {
        this.setState({ bouquetList: [], loader: false });
        this.props.navigation.navigate("Main");
      }
    );
  }

  _insertProduct() {
    insertProduct(
      this.state.network.ip,
      this.state.checkid,
      this.state.komplektcheckitemid,
      this.state.itemid,
      this.state.amount,
      this.state.price,
      this.state.amount * this.state.price
    ).then((res) => {
      console.log("insertProduct VAL", res);
      let _CHECKITEMID = this.state.selectedProduct.CHECKID;
      if (res.result) {
        _CHECKITEMID = res.result[0].CHECKITEMID;
      }
      let arr = this.state.bouquetList;
      let tPrice = 0;
      arr.push({
        id: _CHECKITEMID,
        title: this.state.selectedProduct.NAME,
        num: this.state.amount,
        price: this.state.price,
      });
      arr.map((item) => {
        tPrice =
          parseFloat(tPrice.toString().replace(",", ".")) +
          parseFloat(item.price.toString().replace(",", ".")) *
            parseFloat(item.num.toString().replace(",", "."));
      });

      this.setState({
        bouquetList: arr,
        totalPrice: tPrice,
        changeAmount: 0,
        changeAmount2: 0,
      });
    });
  }

  _insertBouquet() {
    insertBouquet(
      this.state.network.ip,
      this.state.checkid,
      this.state.bouquetcheckid
    ).then((res) => {
      console.log("insertProduct", res);
      let arr = this.state.bouquetList;
      let tPrice = 0;
      arr.push({
        id: this.state.selectedProduct.CHECKID,
        title: `${this.state.selectedProduct.NAME} #${this.state.selectedProduct.CHECKID}`,
        num: 1,
        price: this.state.price,
      });
      arr.map((item) => {
        tPrice =
          parseFloat(tPrice.toString().replace(",", ".")) +
          parseFloat(item.price.toString().replace(",", ".")) *
            parseFloat(item.num.toString().replace(",", "."));
      });

      this.setState({
        bouquetList: arr,
        totalPrice: tPrice,
        changeAmount: 0,
        changeAmount2: 0,
      });
    });
  }

  _removeFromCheck(_item) {
    removeProduct(this.state.network.ip, _item.id).then((res) => {
      console.log("removeProduct", res);
      let arr = this.state.bouquetList;
      let _index = 0;
      let tPrice = 0;

      arr.map((item, index) => {
        if (item.id == _item.id) _index = index;
      });
      arr.splice(_index, 1);
      arr.map((item) => {
        tPrice =
          parseFloat(tPrice) + parseFloat(item.price) * parseFloat(item.num);
      });
      this.setState({ bouquetList: arr, totalPrice: tPrice });
    });
  }

  _removeAll() {
    this.state.bouquetList.map((item) => {
      this._removeFromCheck(item);
    });
  }

  _updateProduct() {
    console.log(
      "_updateProduct",
      this.state.selected.id,
      this.state.changeAmount,
      this.state.selected.price,
      this.state.changeAmount * this.state.selected.price
    );
    updateProduct(
      this.state.network.ip,
      this.state.selected.id,
      this.state.changeAmount,
      this.state.selected.price,
      this.state.changeAmount * this.state.selected.price
    ).then((res) => {
      console.log("_updateProduct", res);

      let arr = this.state.bouquetList;
      let _index = 0;
      let tPrice = 0;

      arr.map((item, index) => {
        if (item.id == this.state.selected.id) _index = index;
      });
      arr[_index].num = this.state.changeAmount;
      arr.map((item) => {
        tPrice =
          parseFloat(tPrice) + parseFloat(item.price) * parseFloat(item.num);
      });
      this.setState({
        bouquetList: arr,
        totalPrice: tPrice,
        changeAmount: 0,
        changeAmount2: 0,
      });
    });
  }

  _addClient() {
    setClient(
      this.state.network.ip,
      this.state.checkid,
      this.state.clientId
    ).then((res) => {
      console.log("setClient", res);

      refreshInfo(this.state.network.ip, this.state.checkid).then((inf) => {
        console.log("info", inf);
        if (inf.result) {
          let arr = [];
          inf.result.map((item) => {
            arr.push({
              id: item.CHECKITEMID,
              title: item.NAME,
              num: item.AMOUNT,
              price: item.PRICE,
            });
          });
          this.setState({
            bouquetList: arr,
          });
        }
      });
    });
  }

  _addDiscount() {
    setDiscount(
      this.state.network.ip,
      this.state.checkid,
      this.state.discountId
    ).then((res) => {
      console.log("setDiscount", res);

      refreshInfo(this.state.network.ip, this.state.checkid).then((inf) => {
        console.log("info", inf);
        if (inf.result) {
          let arr = [];
          inf.result.map((item) => {
            arr.push({
              id: item.CHECKITEMID,
              title: item.NAME,
              num: item.AMOUNT,
              price: item.PRICE,
            });
          });
          this.setState({
            bouquetList: arr,
          });
        }
      });
    });
  }

  _addPayment(changeAmount3) {
    addPayment(
      this.state.network.ip,
      this.state.checkid,
      this.state.paymentid,
      changeAmount3
    ).then((res) => {
      let current = this.state.incomePayments;
      current = parseFloat(current) + parseFloat(changeAmount3);
      if (current >= this.state.totalPrice) {
        Alert.alert("Внимание", "Чек полностью оплачен");
        this._close();
        this.setState({ modalPayTypeVisible: false });
      } else {
        this.setState({ incomePayments: current });
      }

      console.log("addPayment", res);
    });
  }

  _getItemsInCheck() {
    refrashList(this.state.network.ip, this.state.checkid).then((res) => {
      console.log("refrashList", res);
    });
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <UiHeader
          btnLeft="menu"
          pressLeft={() => this.setState({ modalAdditionalActive: true })}
          pressRight={() => {
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
          btnRight="close"
          headerText="Оформление продажи"
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={{ paddingVertical: 16 }}
              style={styles.scrollView}
            >
              <View style={styles.tabContent}>
                <View style={styles.info}>
                  <View style={styles.infoWrap}>
                    <Text style={styles.infoText}>
                      Чек №{" "}
                      <Text style={styles.infoTextMark}>
                        {this.state.checkid}
                      </Text>
                    </Text>
                    <Text style={styles.infoText}>Имя чека </Text>
                    <UiTextInput
                      inputValue={this.state.CheckName}
                      callBack={(val) => {
                        this.setState({ CheckName: val });
                      }}
                    />

                    <Text style={styles.infoText}>
                      Клиент:{" "}
                      <Text style={styles.infoTextMark}>
                        {this.state.clientName}
                      </Text>
                    </Text>

                    <Text style={styles.infoText}>
                      Кол-во позиций в чеке:{" "}
                      <Text style={styles.infoTextMark}>
                        {this.state.bouquetList.length}
                      </Text>
                    </Text>
                    <Text style={styles.infoText}>
                      Сумма:{" "}
                      <Text style={styles.infoTextMark}>
                        {this.state.totalUserPrice
                          ? this.state.totalUserPrice
                          : this.state.totalPrice}{" "}
                        руб.
                      </Text>
                    </Text>
                    {this.state.discountName ? (
                      <Text style={styles.infoText}>
                        Скидка:{" "}
                        <Text style={styles.infoTextMark}>
                          {this.state.discountName
                            ? this.state.discountName
                            : this.state.discountName}{" "}
                        </Text>
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.info}>
                  <View style={styles.infoWrap}>
                    <Text style={styles.infoTitle}>
                      Список товаров в букете
                    </Text>
                    <UiSwipeList
                      swipeList={this.state.bouquetList}
                      onDelete={(id) => this._removeFromCheck(id)}
                      onEdit={(item) =>
                        this.setState({
                          selected: item,
                          changeAmount: item.num,
                          showModalCount2: true,
                        })
                      }
                    />
                  </View>
                </View>

                <View style={styles.info}>
                  <UiButtonGreen
                    gButtonText="Добавить букет"
                    o
                    onPress={() => this.setState({ modalAddActive2: true })}
                  />
                </View>

                <View style={styles.info}>
                  <UiButtonGreen
                    gButtonText="Оплатить"
                    onPress={() => this.setState({ modalPayTypeVisible: true })}
                  />
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => this.setState({ modalAddActive: true })}
              style={styles.buttonAdd}
            >
              <TabBarIcon color={Colors.whiteColor} name="add" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* modals */}
        <Loader show={this.state.loader} />

        <UiModalRadio
          subtitle="Выбрать букет"
          modalChecked={[]}
          modalItems={this.state.productsBouquetList}
          modalCallBack={(val) => {
            console.log(val.PRICE, val);
            this.setState(
              {
                selectedProduct: val,
                bouquetcheckid: val.CHECKID,
                price: parseFloat(val.TOTAL),
              },
              () => {
                this._insertBouquet();
              }
            );
          }}
          selectFunction={() => {
            this.setState({ modalAddActive2: !this.state.modalAddActive2 });
          }}
          modalVisible={this.state.modalAddActive2}
        />

        <UiModalRadio
          subtitle="Выбрать товар:"
          modalChecked={[]}
          modalItems={this.state.productsList}
          modalCallBack={(val) => {
            console.log(val.PRICE, val);
            val.id = val.ITEMID;
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
          modalCallBack={(val) =>
            this.setState(
              { clientName: val.CLIENT, clientId: val.CLIENTID },
              () => this._addClient()
            )
          }
          selectFunction={() => {
            this.setState({ modalUserVisible: !this.state.modalUserVisible });
          }}
          modalVisible={this.state.modalUserVisible}
        />

        <UiModalRadio
          subtitle="Выберите скидку:"
          modalChecked={this.state.discountId}
          modalItems={this.state.discountList}
          modalCallBack={(val) =>
            this.setState(
              { discountName: val.NAME, discountId: val.DISCOUNTID },
              () => this._addDiscount()
            )
          }
          selectFunction={() => {
            this.setState({ modalDiscountVisible: false });
          }}
          modalVisible={this.state.modalDiscountVisible}
        />

        <UiModalRadioPay
          subtitle="Выберите способ оплаты:"
          modalChecked={[]}
          modalItems={this.state.paymentsList}
          totalPrice={this.state.totalPrice}
          incomePayments={this.state.incomePayments}
          modalCallBack={(val) => this.setState({ paymentid: val.PAYMENTID })}
          selectFunction={() => {}}
          addPayment={(val) => {
            this._addPayment(val);
          }}
          modalClose={() => {
            this.setState({ modalPayTypeVisible: false });
          }}
          modalVisible={this.state.modalPayTypeVisible}
        />

        <UiModalSelect
          list={this.state.optionList}
          modalActive={this.state.modalAdditionalActive}
          modalClose={() => this.setState({ modalAdditionalActive: false })}
          onPress={(val) => {
            this.setState({ modalAdditionalActive: false });
            if (val == 0) this.setState({ showModalTotalPrice: true });
            if (val == 1) this._removeAll();
            if (val == 2) this.setState({ modalUserVisible: true });
            if (val == 3) this.setState({ modalDiscountVisible: true });
          }}
          title=""
        />

        <Dialog.Container visible={this.state.showModalCount}>
          <Dialog.Title style={{ color: "#000" }}>
            Введите кол-во товара
          </Dialog.Title>
          <Dialog.Input
            style={{ color: "#000" }}
            keyboardType="numeric"
            o
            onChangeText={(value) => {
              this.setState({ amount: value });
            }}
            nSubmitEditing={() => {
              this.setState({ showModalCount: false }, () => {
                this._insertProduct();
              });
            }}
          />
          <Dialog.Button
            label="Ok"
            onPress={() => {
              this.setState({ showModalCount: false }, () => {
                this._insertProduct();
              });
            }}
          />
        </Dialog.Container>

        <Dialog.Container visible={this.state.showModalCount2}>
          <Dialog.Title style={{ color: "#ccc" }}>
            Введите кол-во товара
          </Dialog.Title>
          <Dialog.Input
            style={{ color: "#000" }}
            keyboardType="numeric"
            value={this.state.changeAmount}
            onChangeText={(value) => {
              console.log(value);
              this.setState({ changeAmount: value });
            }}
            onSubmitEditing={() => {
              this.setState({ showModalCount2: false }, () => {
                this._updateProduct();
              });
            }}
          />
          <Dialog.Button
            label="Ok"
            onPress={() => {
              this.setState({ showModalCount2: false }, () => {
                this._updateProduct();
              });
            }}
          />
        </Dialog.Container>

        <Dialog.Container visible={this.state.showModalTotalPrice}>
          <Dialog.Title style={{ color: "#000" }}>
            Введите цену букета
          </Dialog.Title>
          <Dialog.Input
            style={{ color: "#000" }}
            keyboardType="numeric"
            value={this.state.changeAmount2}
            onSubmitEditing={() => {
              this.setState({ showModalTotalPrice: false }, () => {
                setTotal(
                  this.state.network.ip,
                  this.state.checkid,
                  this.state.changeAmount2
                ).then((val) => {
                  console.log("setTotal val", val);
                  this.setState({
                    totalUserPrice: this.state.changeAmount2,
                    totalPrice: this.state.changeAmount2,
                  });

                  refreshInfo(this.state.network.ip, this.state.checkid).then(
                    (inf) => {
                      console.log("info", inf);
                      if (inf.result) {
                        let arr = [];
                        inf.result.map((item) => {
                          arr.push({
                            id: item.CHECKITEMID,
                            title: item.NAME,
                            num: item.AMOUNT,
                            price: item.PRICE,
                          });
                        });
                        this.setState({
                          bouquetList: arr,
                        });
                      }
                    }
                  );
                });
              });
            }}
            onChangeText={(value) => {
              this.setState({ changeAmount2: value });
            }}
          />
          <Dialog.Button
            label="Ok"
            onPress={() => {
              this.setState({ showModalTotalPrice: false }, () => {
                setTotal(
                  this.state.network.ip,
                  this.state.checkid,
                  this.state.changeAmount2
                ).then((val) => {
                  console.log("setTotal", val);
                  this.setState({
                    totalUserPrice: this.state.changeAmount2,
                    totalPrice: this.state.changeAmount2,
                  });

                  refreshInfo(this.state.network.ip, this.state.checkid).then(
                    (inf) => {
                      console.log("info", inf);
                      if (inf.result) {
                        let arr = [];
                        inf.result.map((item) => {
                          arr.push({
                            id: item.CHECKITEMID,
                            title: item.NAME,
                            num: item.AMOUNT,
                            price: item.PRICE,
                          });
                        });
                        this.setState({
                          bouquetList: arr,
                        });
                      }
                    }
                  );
                });
              });
            }}
          />
        </Dialog.Container>

        <Dialog.Container visible={this.state.showModalInsertPay}>
          <Dialog.Title style={{ color: "#000" }}>
            Введите сумму оплаты:
          </Dialog.Title>
          <Dialog.Description style={{ color: "#000" }}>
            Оплачено: {this.state.incomePayments}p {"\n"}К оплате:{" "}
            {this.state.totalPrice - this.state.incomePayments}p
          </Dialog.Description>
          <Dialog.Input
            placeholder={"Внесение"}
            keyboardType="numeric"
            style={{ color: "#000" }}
            value={this.state.changeAmount3}
            onSubmitEditing={() => {}}
            onChangeText={(value) => {
              if (value <= this.state.totalPrice - this.state.incomePayments) {
                this.setState({ changeAmount3: value });
              }
            }}
          />
          <Dialog.Button
            label="Оплатить"
            onPress={() => {
              this._addPayment();
            }}
          />
          <Dialog.Button
            label="Сменить тип оплаты"
            onPress={() => {
              this.setState(
                { showModalInsertPay: false, modalPayTypeVisible: true },
                () => {}
              );
            }}
          />
          <Dialog.Button
            label="Закрыть"
            onPress={() => {
              this.setState({ showModalInsertPay: false }, () => {});
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
