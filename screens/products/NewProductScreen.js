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
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import demoImage from "../../assets/images/icon.png";

import Loader from "../../components/ui/Loader.js";
import TabBarIcon from "../../components/TabBarIcon.js";
import UiTextInput from '../../components/ui/form/TextInput.js';
import UiButtonGreen from "../../components/ui/button/ButtonGreen.js";
import UiHeader from "../../components/ui/header/Header.js";
import UiModalSelect from "../../components/ui/modal/ModalSelect.js";
import UiModalRadio from '../../components/ui/modal/ModalRadio.js';

import Colors from "../../constants/Colors.js";
import UiSwipeList from "../../components/ui/list/SwipeList";

import { retrieveData, uploadImageAsync } from '../../services/Storage.js'
import { getProductsList, newBouquet, insertProduct, removeProduct, updateProduct, dontSave, save, setTotal, addPhoto , getProductsInBouquet } from "../../services/Bouquet";

export default class NewProductScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    delivery: true,
    loader: false,
    modalAddActive: false,
    modalCategoryVisible: false,
    showModalTotalPrice: false,
    modalAdditionalActive: false,
    activeTab: 0,
    userId: 0,

    totalPrice: 0,
    CheckName: "Букет",
    checkid: null,
    komplektcheckitemid: null,
    itemid: null,
    amount: 1,
    price: 1,
    changeAmount: 1,
    changeAmount2: 1000,

    optionList: [
      { value: 0, label: "Цена букета" },
      { value: 1, label: "Удалить все товары" },
      { value: 2, label: "Добавить фото букета" },
    ],
    swipeList: [
      { id: "1", title: "Learn JavaScript", num: 1, price: 2000 },
      { id: "2", title: "Learn React", num: 2, price: 1500 },
      { id: "3", title: "Learn TypeScript", num: 1, price: 1000 },
    ],
    bouquetList: [],
    productsList: [],
    settings: {
      keyboardType: 0,
      leftItems: 0
    }
  };

  componentDidMount() {
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  }

  handleBackButton() {
    return true;
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };


  _promisedSetState = (newState) => {
    return new Promise((resolve) => { this.setState(newState, () => { resolve(); }); });
  }


  load = () => {
    this.getPermissionAsync();

    retrieveData('user').then((_user) => {
      console.log('user', _user)
      if (_user) {
        this.setState({
          userId: _user.USERSID
        })
      }
    })
    retrieveData("fl_settings").then((data)=>{ 
      if(data){ 
        if(data !== null && typeof data !==  undefined) this.setState({settings: data})
      }
    })
    
    retrieveData('network').then((net) => {
      this.setState({ loader: true, network: net });

      newBouquet(net.ip, this.state.userId ).then((res) => {
        console.log("newBouquet", res.findDay, res.findDay[0]['1'])
        if (res.findDay) {
          if (res.findDay[0]['1'] == 0) {
            Alert.alert(
              "Внимание",
              "смена еще не открыта ",
              [
                { text: "OK", onPress: () => this.props.navigation.navigate("Main") }
              ],
              { cancelable: false }
            );
          } else {
            this.setState({
              checkid: res.result[0]['1'],
              komplektcheckitemid: res.result[0]['2'],
              CheckName: res.result[0]['3'],
              ordersPhotos: null,
            })
          }
        } else {
          Alert.alert(
            "Внимание",
            "смена еще не открыта ",
            [
              { text: "OK", onPress: () => this.props.navigation.navigate("Main") }
            ],
            { cancelable: false }
          );
        }

      })

      getProductsList(net.ip, this.state.settings.leftItems).then((res) => {
        //console.log("getProductsList", res)
        if (res.result) {
          res.result.map((item) => {
            item.label = `${item.NAME} руб.`;
          })
          this.setState({ productsList: res.result, loader: false });
        }
      })
    })


    BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert(
        "Внимание",
        "Сохранить изменения ?",
        [
          { text: "Нет", onPress: () => this._exitWOS() },
          { text: "Да", onPress: () => this._save() }
        ],
        { cancelable: false }
      );

      return true;
    });
  };

  _insertBouquet() {
    insertProduct(
      this.state.network.ip,
      this.state.checkid,
      this.state.komplektcheckitemid,
      this.state.itemid,
      this.state.amount,
      this.state.price,
      this.state.amount * this.state.price
    ).then((res) => {
      console.log("insertProduct", res);
      let arr = this.state.bouquetList;
      let _CHECKITEMID = this.state.selectedProduct.ITEMID;
      if(res.result){
        _CHECKITEMID = res.result[0].CHECKITEMID;
      }

      let tPrice = 0;
      arr.push({
        id: _CHECKITEMID,
        itemId: this.state.selectedProduct.ITEMID,
        title: this.state.selectedProduct.NAME,
        num: this.state.amount,
        price: this.state.price
      });
      arr.map((item) => {
        tPrice = tPrice + (item.price * item.num);
      })

      this.setState({ bouquetList: arr, totalPrice: tPrice });
    })
  }

  _removeFromBouquet(_item) {

    removeProduct(
      this.state.network.ip, _item.id).then((res) => {
        console.log("removeProduct", res);
        let arr = this.state.bouquetList;
        let _index = 0;
        arr.map((item, index) => {
          if (item.id == _item.id) _index = index;
        })
        arr.splice(_index, 1);
        this.setState({ bouquetList: arr })
      })
  }

  _updateBouquet() {

    updateProduct(
      this.state.network.ip,
      this.state.selected.id, 
      this.state.changeAmount, 
      this.state.selected.price, (this.state.changeAmount * this.state.selected.price)).then((res) => {
        console.log("updateProduct", res);

        let arr = this.state.bouquetList;
        let _index = 0;
        let tPrice = 0;

        arr.map((item, index) => {
          if (item.itemId == this.state.selected.itemId) _index = index;
        })
        console.log(arr[_index])
        arr[_index].num =  this.state.changeAmount;
        //arr[_index].price = (this.state.changeAmount * this.state.selected.price) ;

        arr.map((item) => {
          tPrice = tPrice + (item.price * item.num);
        })
        this.setState({ 
          bouquetList: arr, 
          totalPrice: tPrice
        })

      })
  }

  _pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!result.cancelled) {
      await this._promisedSetState({ loader: true });
      let uri = Platform.OS === "android" ? result.uri : result.uri.replace("file://", "");
      console.log(result);

      uploadImageAsync(this.state.network.ip, result.uri).then((res) => {
        console.log("avatart", res)
        this._promisedSetState({ loader: false });
        if (res.image) {
          this.setState({ ordersPhotos: res.image.image_name });
          addPhoto(this.state.network.ip, this.state.komplektcheckitemid, res.image.image_name).then((result) => {
            console.log(result);
          })

        }
      }).catch((res) => {
        console.log("err", res);
        this._promisedSetState({ loader: false });
      });


    } else {
      this.setState({ modalAlertAddVisible: !this.state.modalAlertAddVisible });
    }
  };



  _exitWOS() {
    this.setState({ loader: true });
    dontSave(
      this.state.network.ip,
      this.state.checkid,
      this.state.userId
    ).then((res) => {
      this.setState({ bouquetList: [], loader: false });
      this.props.navigation.navigate("Main");
    })
  }

  _save() {
    this.setState({ loader: true });
    save(
      this.state.network.ip,
      this.state.checkid,
      this.state.CheckName
    ).then((res) => {
      this.setState({ bouquetList: [], loader: false });
      this.props.navigation.navigate("Main");
    })
  }

  _removeAll() {
    let arr = this.state.bouquetList;
    arr.map((item) => {
      removeProduct(this.state.network.ip, item.id).then((res) => {
        console.log("removeProduct", res);
      })
    })
    this.setState({ bouquetList: [] })
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
          { text: "Нет", onPress: () => this._exitWOS() }
              ],
              { cancelable: false }
            );

          }}
          btnRight="close"
          headerText="Собрать букет"
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
                      Название :{" "}
                    </Text>
                    <UiTextInput
                      inputValue={this.state.CheckName}
                      callBack={(val) => {
                        this.setState({ CheckName: val })
                      }}
                    />

                    <Text style={styles.infoText}>
                      Кол-во позиций в букете:{" "}
                      <Text style={styles.infoTextMark}>{this.state.bouquetList.length}</Text>
                    </Text>
                    <Text style={styles.infoText}>
                      Сумма:{" "}
                      <Text style={styles.infoTextMark}>{this.state.totalPrice} руб.</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.info}>
                  <View style={styles.infoWrap}>
                    <Text style={styles.infoTitle}>Список товаров в букете</Text>
                    <UiSwipeList
                      swipeList={this.state.bouquetList}
                      onDelete={(id) => this._removeFromBouquet(id)}
                      onEdit={(item) => { 
                        console.log(item)
                        this.setState({ selected: item, changeAmount: item.num, showModalCount2: true })
                      }}
                    />
                  </View>
                </View>

                {this.state.ordersPhotos ?
                  <View style={styles.info}>
                    <View style={styles.infoPhoto}>
                      <Image
                        resizeMode="cover"
                        source={{ uri: `http://${this.state.network.ip}/ibm/public/images/${this.state.ordersPhotos}` }}
                        style={styles.infoPhotoImage}
                      />
                    </View>
                  </View> : null}


                <View style={styles.info}>
                  <UiButtonGreen gButtonText="Собрать букет" onPress={() => this._save()} />
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
          subtitle="Выбрать товар"
          modalChecked={[]}
          modalItems={this.state.productsList}
          modalCallBack={(val) => {
            console.log(val.PRICE, val)
            this.setState({ selectedProduct: val, itemid: val.ITEMID, price: parseFloat(val.PRICE), showModalCount: true });
          }}
          selectFunction={() => { this.setState({ modalAddActive: !this.state.modalAddActive }); }}
          modalVisible={this.state.modalAddActive}
        />

        <UiModalSelect
          list={this.state.optionList}
          modalActive={this.state.modalAdditionalActive}
          modalClose={() => this.setState({ modalAdditionalActive: false })}
          onPress={(val) => {

            this.setState({ modalAdditionalActive: false });
            if (val == 0) this.setState({ showModalTotalPrice: true })
            if (val == 1) this._removeAll();
            if (val == 2) this._pickImage();
          }}
          title=""
        />

        <Dialog.Container visible={this.state.showModalCount}>
          <Dialog.Title style={{ color: "#000" }}>Введите кол-во товара</Dialog.Title>
          <Dialog.Input style={{ color: "#000" }} keyboardType='numeric' onChangeText={(value) => {
            this.setState({ amount: value });
          }} />
          <Dialog.Button label="Ok" onPress={() => {
            this.setState({ showModalCount: false }, () => {
              this._insertBouquet();
            });
          }} />
        </Dialog.Container>

        <Dialog.Container visible={this.state.showModalCount2}>
          <Dialog.Title style={{ color: "#000" }}>Введите кол-во товара</Dialog.Title>
          <Dialog.Input style={{ color: "#000" }} keyboardType='numeric' value={this.state.changeAmount} onChangeText={(value) => {
            this.setState({ changeAmount: value });
          }} />
          <Dialog.Button label="Ok" onPress={() => {
            this.setState({ showModalCount2: false }, () => {
              this._updateBouquet();
            });
          }} />
        </Dialog.Container>

        <Dialog.Container visible={this.state.showModalTotalPrice}>
          <Dialog.Title style={{ color: "#000" }}>Введите цену букета</Dialog.Title>
          <Dialog.Input style={{ color: "#000" }} keyboardType='numeric' value={this.state.changeAmount2} onChangeText={(value) => {
            this.setState({ changeAmount2: value });
          }} />
          <Dialog.Button label="Ok" onPress={() => {
            this.setState({ showModalTotalPrice: false }, () => {
              //this.setState({ totalPrice: this.state.changeAmount2 })
              setTotal(this.state.network.ip, this.state.checkid, this.state.changeAmount2).then((val) => {
                getProductsInBouquet(
                  this.state.network.ip, 
                  this.state.checkid,
                  this.state.komplektcheckitemid,
                ).then((res) => {
                  
                  if (res.result) {
                    let arr = [];
                    let tPrice = 0;
                    res.result.map((item) => {
                      console.log(item)
                      arr.push({
                        id: item.CHECKITEMID,
                        title: item.NAME,
                        num: parseFloat(item.AMOUNT.replace(',', '.')),
                        price: parseFloat(item.PRICE.replace(',', '.')),

                       

                      });
                    })
                    arr.map((item) => {
                      tPrice = tPrice + (item.price * item.num);
                    })
                    this.setState({ bouquetList: arr, totalPrice: tPrice });
                  }
                })
              })

              
            });
          }} />
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
