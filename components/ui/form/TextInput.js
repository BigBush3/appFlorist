import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

import { ValidateInput } from "../../../components/common/Validator.js";
import Colors from "../../../constants/Colors.js";
import { storeData, retrieveData } from '../../../services/Storage.js'


export default class UiTextInput extends React.Component {
  state = {
    inputValidation: true,
    inputValidationVal: "",
    type: 0,
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nProps, nState) {
    if (nProps.clear != undefined && nProps.clear) {
      this.textInput.clear();
      this.setState({ validationType: "" });
      this.props.clearCallBack(false);
    }
    if (
      this.props.inputValue &&
      this.props.inputValue != undefined &&
      nProps.inputValue !== this.props.inputValue
    ) {
      //console.log( nProps.inputValue !== this.props.inputValue, nProps.inputValue , this.props.inputValue)
      this.handlerValidation(
        "inputValidation",
        this.props.validationType,
        nProps.inputValue
      );
    }

    return true;
  }

  handlerFocus = (input) => {
    this.setState({
      [input]: true,
    });

    if(
      this.props.keyboardType == 'numeric' || 
      this.props.keyboardType == 'number-pad' 
    ){
      retrieveData("fl_settings").then((data)=>{ 
        if(data){ 
          if(data !== null && typeof data !==  undefined){  
            this.setState({type: data.keyboardType})
          } 
        }
      })
    }
  };

  handlerBlur = (input) => {
    this.handlerValidation(
      "inputValidation",
      this.props.validationType,
      this.state.inputValidationVal
    );
    this.setState({
      [input]: false,
    });
  };

  handlerValidation = (input, key, value) => {
    this.setState({
      [input]: ValidateInput(key, value),
    });
    //this.props.callBack(value);
  };

  render() {
    return (
      <View style={styles.input}>
        {this.props.label ? (
          <Text style={styles.label}>{this.props.label}</Text>
        ) : null}
        <TextInput
          style={[
            styles.textInput,
            this.state.inputFocus ? styles.textBlured : "",
            !this.state.inputValidation  && !this.props.disabledValidation ? styles.inputDanger : "",
            this.props.multiline ? null : { height: 48 },
          ]}
          ref={(input) => {
            this.textInput = input;
          }}
          autoCapitalize={this.props.autoCapitalize}
          autoFocus={this.props.autoFocus}
          allowFontScaling={false}
          editable={this.props.editable}
          keyboardType={this.props.keyboardType ? 
            this.state.type == 0 ? 'numeric' : 'default' 
            : null}
          maxLength={this.props.maxLength ? this.props.maxLength : 100}
          multiline={this.props.multiline}
          numberOfLines={this.props.numberOfLines}
          placeholder={this.props.placeholder}
          placeholderTextColor={Colors.darkGrayColor}
          secureTextEntry={this.props.secureTextEntry}
          textContentType={this.props.textContentType}
          value={this.props.inputValue}
          onChangeText={(value) => {
            this.setState({
              ["inputValidationVal"]: value,
            });

            if (this.props.callBack) this.props.callBack(value);
            if (this.props.callBackValidation)
              this.props.callBackValidation(this.state.inputValidation);
          }}
          onFocus={() => this.handlerFocus("inputFocus")}
          onBlur={() => this.handlerBlur("inputFocus")}
        />
        {this.props.disabledValidation ? null :
        <Text
          style={[
            styles.warnText,
            this.state.inputValidation ? styles.hideWarnText : "",
          ]}
        >
          {this.state.inputValidationVal.length == 0 ? "Заполните поле" : ""}
        </Text> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
  },
  label: {
    marginBottom: 4,
    color: Colors.blackColor,
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    lineHeight: 20,
  },
  textInput: {
    width: "100%",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderColor: Colors.grayColor,
    borderWidth: 1,
    borderRadius: 8,
    color: Colors.blackColor,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 22,
    backgroundColor: "#fff",
  },
  textBlured: {
    borderColor: Colors.greenColor,
  },
  inputDanger: {
    borderColor: Colors.redColor,
  },
  warnText: {
    color: Colors.redColor,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  hideWarnText: {
    opacity: 0,
  },
});
