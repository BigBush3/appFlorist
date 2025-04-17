import React from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Dialog from "react-native-dialog";
import UiModalRadio from "../../../components/ui/modal/ModalRadio.js";
import UiModalSelect from "../../../components/ui/modal/ModalSelect.js";

import UiHeader from "../../../components/ui/header/Header.js";
import TabBarIcon from "../../../components/TabBarIcon.js";
import UiButtonGreen from "../../../components/ui/button/ButtonGreen.js";
import UiButtonGreenOutline from "../../../components/ui/button/ButtonGreenOutline.js";
import UiSwipeList from "../../../components/ui/list/SwipeList";

import Colors from "../../../constants/Colors";

export default class ModalItemsOrder extends React.Component {
  state = {
    optionList: [{ value: 0, label: "Цена букета" }],

    showModalCount2: false,
    modalAddActive: false,
    showModalTotalPrice: false,
  };

  constructor(props) {
    super(props);
  }

  convertArrToSwipe(_arr) {
    let arr = [];
    if (_arr) {
      _arr.map((item) => {
        arr.push({
          id: item.CHECKITEMID,
          title: `${item.NAME}  `,
          num: item.AMOUNT,
          price: item.PRICE,
        });
      });
    }

    return arr;
  }

  render() {
    return (
      <Modal
        coverSreen={false}
        animationType="fade"
        transparent={true}
        visible={this.props.modalActive}
        onRequestClose={() => {
          this.props.modalClose();
        }}
      >
        <SafeAreaView style={styles.safeArea}>
          <UiHeader
            btnLeft="menu"
            pressLeft={() => this.setState({ showModalTotalPrice: true })}
            pressRight={() => {
              this.props.modalClose();
            }}
            btnRight="close"
            headerText="Редактирование состава"
          />
          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={{ paddingVertical: 16 }}
              style={styles.scrollView}
            >
              <View style={styles.tabContent}>
                <View style={styles.info}>
                  <View style={styles.infoWrap}>
                    <Text style={styles.infoTitle}>Список товаров:</Text>
                    <UiSwipeList
                      swipeList={this.convertArrToSwipe(this.props.list)}
                      onDelete={(id) => this.props.removeFromBouquet(id.id)}
                      onEdit={(item) => {
                        console.log(item);
                        this.setState({
                          selected: item,
                          changeAmount: parseFloat(
                            item.num.toString().replace(",", ".")
                          ),
                          showModalCount2: true,
                        });
                      }}
                    />
                  </View>
                </View>

                <View style={styles.info}>
                  <UiButtonGreenOutline
                    gOButtonText="Завершить редактирование"
                    onPress={() => this.props.modalClose()}
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

        <UiModalRadio
          subtitle="Выбрать букет"
          modalChecked={[]}
          modalItems={this.props.productsBouquetList}
          modalCallBack={(val) => {
            console.log("Выбрать букет", val);
            this.props.insertBouquet(val.CHECKID);
          }}
          selectFunction={() => {
            this.setState({ modalAddActive2: !this.state.modalAddActive2 });
          }}
          modalVisible={this.state.modalAddActive2}
        />

        <UiModalRadio
          subtitle="Выбрать товар:"
          modalChecked={[]}
          modalItems={this.props.productsList}
          modalCallBack={(val) => {
            console.log(val.PRICE, val);
            this.setState({
              selectedProduct: val,
              itemid: val.ITEMID,
              price: parseFloat(val.PRICE.toString().replace(",", ".")),
              showModalCount: true,
            });
          }}
          selectFunction={() => {
            this.setState({ modalAddActive: !this.state.modalAddActive });
          }}
          modalVisible={this.state.modalAddActive}
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
            nSubmitEditing={() => {
              this.setState({ showModalCount: false }, () => {
                this.props.insertProduct(
                  this.state.itemid,
                  this.state.amount,
                  this.state.price
                );
              });
            }}
          />
          <Dialog.Button
            label="Ok"
            onPress={() => {
              this.setState({ showModalCount: false }, () => {
                this.props.insertProduct(
                  this.state.itemid,
                  this.state.amount,
                  this.state.price
                );
              });
            }}
          />
        </Dialog.Container>

        <Dialog.Container visible={this.state.showModalCount2}>
          <Dialog.Title style={{ color: "#000" }}>
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
                this.props.updateProduct(
                  this.state.selected.id,
                  this.state.changeAmount,
                  this.state.selected.price
                );
              });
            }}
          />
          <Dialog.Button
            label="Ok"
            onPress={() => {
              this.setState({ showModalCount2: false }, () => {
                this.props.updateProduct(
                  this.state.selected.id,
                  this.state.changeAmount,
                  this.state.selected.price
                );
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
                this.props.setTotal(this.state.changeAmount2);
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
                this.props.setTotal(this.state.changeAmount2);
              });
            }}
          />
        </Dialog.Container>
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
