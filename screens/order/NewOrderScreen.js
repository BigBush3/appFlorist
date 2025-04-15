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
import UiButtonGreen from "../../components/ui/button/ButtonGreen.js";
import UiHeader from "../../components/ui/header/Header.js";
import UiModalSelect from "../../components/ui/modal/ModalSelect.js";
import ModalItemsOrder from "../../components/ui/modal/ModalItemsOrder.js";
import UiModalRadio from '../../components/ui/modal/ModalRadio.js';
import UiTextInput from '../../components/ui/form/TextInput.js';
import UiModalBirthPicker from '../../components/ui/modal/ModalBirthPiker.js';
import UiModalTimePicker from '../../components/ui/modal/ModalTimePicker.js';

import Colors from "../../constants/Colors.js";
import UiSwipeList from "../../components/ui/list/SwipeList";

import { formatDateLine } from "../../components/common/Date";
import { retrieveData, uploadImageAsync } from '../../services/Storage.js';
import { getClients, searchClient } from "../../services/Orders";
import { openOrder, getOrdersStatus, refreshInfo, refreshPrepay, getOrdersStatusSell, getOrdersStatusDelivery, getOrdersStatusCurier, addUserToOrder, orderPhotos, addPhoto, saveOrder } from "../../services/Orders";
import { insertProduct, removeProduct,  bouquetList,  save, setTotal, insertBouquet, updateProduct } from "../../services/Check";
import { getProductsList } from "../../services/Bouquet";
import { newOrder } from "../../services/Orders";

export default class NewOrderScreen extends React.Component {
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
    modalUserVisible: false,
    modalDate1Visible: false,
    modalTimeVisible: false,
    modalTimeVisible2: false,
    modalItemsEditActive: false,
    showModalCount: false,
    modalStatusDeliveryActive: false,
    activeTab: 0,
    userId: 0,

    CHECKID: null,
    ORDERID: null,


    dostavka: 1,
    DeliveryStatusId: "null",
    receiver: "",
    receiveraddress: "",
    receiverphone: "",

    usersItemList: [],
    bouquetList: [],
    ordersList: [],
    productsList: [],
    productsBouquetList: [],
    ordersStatusDelivery: [],

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

  _getStatusName(_arr, _id) {
    let val = null;
    _arr.map((item, index) => {
      if (item.STATUSID == _id) val = item.NAME;
    })
    return val;
  }

  _promisedSetState = (newState) => {
    return new Promise((resolve) => { this.setState(newState, () => { resolve(); }); });
  }


  load = () => {
    this.getPermissionAsync();

    retrieveData("fl_settings").then((data)=>{ 
      if(data){ 
        if(data !== null && typeof data !==  undefined) this.setState({settings: data})
      }
    })

    retrieveData('user').then((_user) => {
      console.log('user', _user)
      if (_user) {
        this.setState({
          userId: _user.USERSID
        })

        retrieveData('network').then((net) => {
          this.setState({ loader: true, network: net });
          newOrder(net.ip, _user.USERSID).then((res) => {
            console.log("newOrder newOrder", res.result[0].CHECKID , res)
            this.setState({
              CHECKID: res.result[0].CHECKID,
              ORDERID: res.result[0].ORDERID,
              date: null,
              StartTime: null,
              EndTime: null,
              clientId: "",
              customer: "",
              customerphone: "",
              dostavka: 1,
              receiver: "",
              receiveraddress: "",
              receiverphone: "",
              comment: "",

              loader: false
            });
          })

          getOrdersStatusDelivery(net.ip).then((res) => {
            //console.log("ordersStatusDelivery", res);
            if (res.result) {
              res.result.map((item) => {
                item.label = `${item.NAME}`;
              })

              this.setState({ ordersStatusDelivery: res.result, });
            }
          });

          getClients(net.ip).then((res) => {
            let arr = [];
            //console.log(res)
            res.map((item) => {
              item.label = `${item.CLIENT}`;
              item.value = item.CLIENTID;
            })
            this.setState({ usersItemList: res });
          });

          getProductsList(net.ip, this.state.settings.leftItems).then((res) => {
            if (res.result) {
              res.result.map((item) => {
                item.label = `${item.NAME} руб.`;
              })
              this.setState({ productsList: res.result, loader: false });
            }
          })

          bouquetList(net.ip).then((res) => {

            if (res.result) {
              res.result.map((item) => {
                item.label = `${item.NAME} #${item.CHECKID}`;
              })
              this.setState({ productsBouquetList: res.result, loader: false });
            }
          })



        })

      }
    })




    BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert(
        "Внимание",
        "Сохранить изменения ?",
        [
          { text: "Да", onPress: () => this._save() },
          { text: "Нет", onPress: () => this._exitWOS() }
        ],
        { cancelable: false }
      );

      return true;
    });
  };



  _exitWOS() {
    this.props.navigation.navigate("Orders");
  }

  _save() {

    if(
      this.state.date != null &&
      this.state.StartTime != null &&
      this.state.EndTime  != null
    ){
      this.setState({ loader: true });
      saveOrder(
        this.state.network.ip,
        this.state.ORDERID,
        this.state.date,
        this.state.StartTime,
        this.state.EndTime,
        this.state.customer,
        this.state.customerphone,
        this.state.dostavka,
        this.state.receiver,
        this.state.receiverphone,
        this.state.receiveraddress,
        this.state.comment,
        'null',
        'null',
        'null',
        'null',
        this.state.DeliveryStatusId,
        'null',
      ).then((res) => {
        console.log("SAVE", res);
        this.setState({ bouquetList: [], loader: false });
        this.props.navigation.navigate("Orders");
      }).catch( (res) => {
        console.log("NOT SAVE", res);
        Alert.alert("Внимание ошибка на сервере")
        this.setState({   loader: false });
        
      } )
    } else {
      Alert.alert("Заполните поля дату , время");
    }


  }

  
  _insertProduct(itemid, amount, price) {
    insertProduct(
      this.state.network.ip,
      this.state.CHECKID,
      0,
       itemid,
      amount,
      price,
       amount *  price
    ).then((res) => {
      console.log("insertProduct", res);

      refreshInfo(this.state.network.ip, this.state.CHECKID).then((info) => {
        console.log("refreshInfo", info)
        this.setState({ ordersList: info.result  });
      })

    })
  }

  _insertBouquet(checkid, bouquetcheckid) {
    insertBouquet(
      this.state.network.ip,
      checkid,
      bouquetcheckid,
    ).then((res) => {
      console.log("insertProduct", res);

      refreshInfo(this.state.network.ip, this.state.CHECKID).then((info) => {
        console.log("refreshInfo", info)
        this.setState({ ordersList: info.result });
      })

    })
  }

  _setTotal(checkid, changeAmount2){
    setTotal(this.state.network.ip, checkid,  changeAmount2).then((val) => {
      console.log("setTotal", val);
      

      refreshInfo(this.state.network.ip,  checkid).then((inf) => {
        console.log("info",inf)
        if(inf.result){
           
          this.setState({ 
            ordersList: inf.result, 
          })
         
        }
      })

    })
  }

  _updateProduct(id,  changeAmount, price) {

    updateProduct(
      this.state.network.ip,  id,  changeAmount, parseFloat(price.toString().replace(',', '.')), ( parseFloat(changeAmount.toString().replace(',', '.')) *   parseFloat(price.toString().replace(',', '.')) )).then((res) => {
        console.log("_updateProduct", res);

        let arr = this.state.ordersList;
        let _index = 0;
   
        arr.map((item, index) => {
          if (item.id == id) _index = index;
        })
        arr[_index].num = changeAmount;
 
        this.setState({ 
          ordersList: arr, 
           
        })
      })
  }



  _removeFromBouquet(_id) {

    removeProduct(
      this.state.network.ip, _id).then((res) => {
        console.log("removeProduct", res);

        refreshInfo(this.state.network.ip, this.state.CHECKID).then((info) => {
          console.log("refreshInfo", info)
          this.setState({ ordersList: info.result });
        })

      })
  }



  render() {
    const { navigate } = this.props.navigation;

    let ordersList = this.state.ordersList.map((item, index) => {
      return (
        <Text style={styles.infoText} key={index}>
          {item.NAME}:{" "}
          <Text style={styles.infoTextMark}>{parseFloat(item.AMOUNT.toString().replace(',', '.'))} шт.</Text>
          {this.state.showEdit ? <Text style={styles.infoTextRedMark} onPress={() => this._removeFromBouquet(item.CHECKITEMID)}> X </Text> : null}
        </Text>
      )
    })

    return (
      <View style={styles.container}>
        <UiHeader

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
          headerText="Новый заказ"
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
                    <Text style={styles.infoTitle}>Дата</Text>
                    <TouchableOpacity
                      onPress={() => this.setState({ modalDate1Visible: true })}
                    >
                      <UiTextInput
                        placeholder={this.state.date ? this.state.date : "Дата"}
                        inputValue={this.state.date}
                        editable={false}
                        callBack={() => {

                        }}
                      />
                    </TouchableOpacity>

                    <Text style={styles.infoTitle}>Интервал получения</Text>
                    <TouchableOpacity
                      onPress={() => this.setState({ modalTimeVisible: true })}
                    >
                      <UiTextInput
                        placeholder={this.state.StartTime ? this.state.StartTime : "C"}
                        inputValue={this.state.StartTime}
                        editable={false}
                        callBack={() => {

                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ modalTimeVisible2: true })}
                    >
                      <UiTextInput
                        placeholder={this.state.EndTime ? this.state.EndTime : "По"}
                        inputValue={this.state.EndTime}
                        editable={false}
                        callBack={() => {

                        }}
                      />
                    </TouchableOpacity>


                    <Text style={styles.infoTitle}>Заказчик</Text>

                    <UiTextInput
                      placeholder={ "Заказчик"}
                      inputValue={this.state.customer}
                      
                      callBack={(val) => {
                        this.setState({ customer: val })
                      }}
                    />

                    <UiTextInput
                      placeholder={"Телефон заказчика"}
                      inputValue={this.state.customerphone}
                      keyboardType='number-pad'

                      callBack={(val) => {
                        this.setState({ customerphone: val })
                      }}
                    />



                  </View>
                </View>


                <View style={styles.info}>
                  <View style={styles.infoWrap}>

                    <Text style={styles.infoTitle}>Выбраный Тип : {this.state.dostavka == 1 ? "Доставка" : "Самовывоз"}</Text>

                    {this.state.dostavka == 0 ?
                      <UiButtonGreen
                        gButtonText="Доставка" onPress={() => this.setState({ dostavka: 1 })} />
                      :
                      <UiButtonGreen
                        gButtonText="Самовывоз" onPress={() => this.setState({ dostavka: 0 })} />
                    }
                  </View>
                </View>


                {this.state.dostavka == 1 ?
                  <View style={styles.info}>
                    <View style={styles.infoWrap}>

                      <Text style={styles.infoTitle}>Получатель</Text>
                      <UiTextInput
                        placeholder={"Получатель"}
                        inputValue={this.state.receiver}

                        callBack={(val) => {
                          this.setState({ receiver: val })
                        }}
                      />
                      <UiTextInput
                        placeholder={"Телефон получателя"}
                        inputValue={this.state.receiverphone}
                        keyboardType='number-pad'

                        callBack={(val) => {
                          this.setState({ receiverphone: val })
                        }}
                      />
                      <UiTextInput
                        placeholder={"адрес доставки"}
                        inputValue={this.state.receiveraddress}
                      
                        callBack={(val) => {
                          this.setState({ receiveraddress: val })
                        }}
                      />

                    </View>
                  </View> : null}

                <View style={styles.info}>
                  <View style={styles.infoWrap}>
                    <Text style={styles.infoTitle}>Состав заказа</Text>
                    {ordersList}
                  </View>
                </View>
                <View style={styles.info}>

                  <UiButtonGreen
                    gButtonText="Изменить состав"
                    onPress={() => {
                      this.setState({
                        modalItemsEditActive: true
                      });
                    }}
                  />

                </View>

                <View style={styles.info}>
                  <View style={styles.infoWrap}>

                    <Text style={styles.infoTitle}>Комментарий</Text>
                    <UiTextInput
                      placeholder={"Комментарий"}
                      inputValue={this.state.comment}
                      callBack={(val) => {
                        this.setState({ comment: val })
                      }}
                    />

                    <Text style={styles.infoTitle}>Статус доставки:  {this._getStatusName(this.state.ordersStatusDelivery, this.state.DeliveryStatusId)}</Text>

                    <UiButtonGreen
                      gButtonText="Изменить статус доставки" onPress={() => this.setState({ modalStatusDeliveryActive: true })} />



                  </View>
                </View>

                <View style={styles.info}>
                  <UiButtonGreen gButtonText="Создать" onPress={() => this._save()} />
                </View>

              </View>
            </ScrollView>

          </View>


        </SafeAreaView>

        {/* modals */}
        <Loader show={this.state.loader} />



        <ModalItemsOrder
          list={this.state.ordersList}
          productsList={this.state.productsList}
          productsBouquetList={this.state.productsBouquetList}
          modalActive={this.state.modalItemsEditActive}
          modalClose={() => this.setState({ modalItemsEditActive: false })}
          removeFromBouquet={(val) => {
            this._removeFromBouquet(val);
          }}
          insertBouquet={(  bouquetcheckid ) => {
            this._insertBouquet( this.state.CHECKID, bouquetcheckid )
          }}
          insertProduct={( itemid, amount, price ) => {
            this._insertProduct( itemid, amount, price )
          }}
          updateProduct={( id,  changeAmount, price ) => {
            this._updateProduct(id,  changeAmount, price )
          }}
          setTotal={(changeAmount2) => {
            this._setTotal(this.state.CHECKID, changeAmount2)
          }}
          title="Состав заказа:"
        />

        <UiModalRadio
          subtitle="Выбрать товар"
          modalChecked={[]}
          modalItems={this.state.productsList}
          modalCallBack={(val) => {
            console.log(val.PRICE, val)
            this.setState({ selectedProduct: val, itemid: val.ITEMID, price: parseFloat(val.PRICE.toString().replace(',', '.')), showModalCount: true });
          }}
          selectFunction={() => { this.setState({ modalAddActive: !this.state.modalAddActive }); }}
          modalVisible={this.state.modalAddActive}
        />

        <UiModalRadio
          subtitle="Выберите пользователя:"
          modalChecked={this.state.clientId}
          modalItems={this.state.usersItemList}
          modalCallBack={(val) => this.setState({ customer: val.CLIENT, clientId: val.CLIENTID })}
          selectFunction={() => { this.setState({ modalUserVisible: !this.state.modalUserVisible }); }}
          modalVisible={this.state.modalUserVisible}
        />


        <UiModalRadio
          subtitle="Выбрать"
          modalChecked={[]}
          modalItems={this.state.ordersStatusDelivery}
          modalCallBack={(val) => {
            console.log(val)
            this.setState({
              DeliveryStatusId: val.STATUSID,

            });
          }}
          selectFunction={() => { this.setState({ modalStatusDeliveryActive: false }); }}
          modalVisible={this.state.modalStatusDeliveryActive}
        />

        <UiModalBirthPicker
          modalText="Выберите дату"
          modalCallBack={(val) => {
            console.log(val);
            this.setState({ date: formatDateLine(val) })
          }}
          modalCancelFunction={() => { this.setState({ modalDate1Visible: !this.state.modalDate1Visible }) }}
          modalOkFunction={() => { this.setState({ modalDate1Visible: !this.state.modalDate1Visible }) }}
          modalVisible={this.state.modalDate1Visible}
        />

        <UiModalTimePicker
          subtitle="Выберите"
          modalCallBack={(val) => {
            console.log(val);
            this.setState({
              StartTime: val.hh + ':' + val.mm + ":00",
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
            this.setState({
              EndTime: val.hh + ':' + val.mm + ":00",
            });
          }}
          modalCancelFunction={() => this.setState({ modalTimeVisible2: false })}
          modalOkFunction={() => this.setState({ modalTimeVisible2: false })}
          selectFunction={() => this.setState({ modalTimeVisible2: false })}
          modalVisible={this.state.modalTimeVisible2}
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
