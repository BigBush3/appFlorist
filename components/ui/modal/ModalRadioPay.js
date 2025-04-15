import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import check from '../../../assets/images/ui/check.png';
import UiTextInput from "../../../components/ui/form/TextInput.js";
import UiButtonGreen from "../../../components/ui/button/ButtonGreen.js";
import UiButtonGreenOutline from "../../../components/ui/button/ButtonGreenOutline.js";

import { isIphoneX } from '../../isIphoneX';
const bottomX = isIphoneX() ? 34 : 0;

export default class ModalRadioPay extends React.Component {

  state = {
    result: [],
    modalChecked: null,
    changeAmount3: 0,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  _search(_line) {
    let arr = [];
    this.props.modalItems.map((item) => {
      if (item.label.toLowerCase().includes(_line.toLowerCase())) {
        if (arr.length < 100) arr.push(item);
      }
    })
    this.setState({ result: arr })
  }

  render() {

    var list = this.state.result.map((item, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            this.setState({ modalChecked: item });
            this.props.selectFunction();
            this.props.modalCallBack(item);
          }}
          style={[styles.option]}
        >
          <Text style={styles.optionText}>{item.label.toString()}</Text>
          <View style={styles.radioCheck}>
            {this.state.modalChecked === item ? <Image source={check} style={styles.checkImage} /> : null}
          </View>
        </TouchableOpacity>
      );
    });


    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onShow={() => {
          this._search("");
        }}
        onRequestClose={() => {
          this.props.selectFunction();
        }}
      >
        <View style={styles.modal}>

          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => {
              if (this.props.modalClose) this.props.modalClose(); else this.props.selectFunction();
            }}
          >

          </TouchableOpacity>
          <View style={styles.modalInner}>
            <Text style={styles.subtitleText}>{this.props.subtitle}</Text>

            <ScrollView style={styles.radio}>
              {list}
            </ScrollView>

            <View style={styles.modalContent}>

              <Text style={styles.lineText}>Оплачено: {this.props.incomePayments} р</Text>
              <Text style={styles.lineText}>К оплате: {this.props.totalPrice - this.props.incomePayments}  р</Text>

              <UiTextInput
                placeholder="Размер внесения"
                disabledValidation
                keyboardType='numeric'
                value={this.state.changeAmount3}
                onSubmitEditing={() => {
                  this.props.addPayment(this.state.changeAmount3);
                }}
                callBack={(value) => {
 
                    this.setState({ changeAmount3: value });
             
                }}
              />

              <View style={{ margin: 5 }}>
                <UiButtonGreen
                  disabled={
                    this.state.changeAmount3 == 0 || this.state.modalChecked == null || parseFloat(this.state.changeAmount3.toString().replace(',', '.')) > (parseFloat(this.props.totalPrice.toString().replace(',', '.')) - parseFloat(this.props.incomePayments.toString().replace(',', '.')))
                  }
                  gButtonText="Внести оплату"
                  onPress={() => {
                    console.log("Внести оплату", this.state.changeAmount3);
                    this.props.addPayment(this.state.changeAmount3);
                  }}
                />
              </View>
              <View style={{ margin: 5 }}>
                <UiButtonGreenOutline
                  gOButtonText="Закрыть"
                  onPress={() => this.props.modalClose()}
                />
              </View>
            </View>



          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.68)',
    justifyContent: 'flex-end',
  },
  modalClose: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
  },
  modalInner: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
    flexGrow: 0,
    flexShrink: 0,
    maxHeight: '70%',
    paddingBottom: bottomX,
  },
  subtitleText: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.13,
    color: 'rgb(22,22,22)',
    fontFamily: 'Roboto-Regular',
    flexGrow: 0,
    flexShrink: 0,
  },
  lineText: {
    paddingHorizontal: 5,
    paddingVertical: 11,
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: 0.13,
    color: 'rgb(0,0,0)',
    fontFamily: 'Roboto-Regular',
    flexGrow: 0,
    flexShrink: 0,
  },
  modalContent: {
    padding: 16,

  },
  search: {
    paddingHorizontal: 16,

  },
  radio: {
    paddingBottom: 8,
    backgroundColor: 'rgb(245,245,245)',
  },
  option: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  optionActive: {
    backgroundColor: 'rgb(245,245,245)',
  },
  optionText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: 'rgb(16,0,43)',
  },
  radioCheck: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkImage: {
    width: 32,
    height: 32,
  },

});