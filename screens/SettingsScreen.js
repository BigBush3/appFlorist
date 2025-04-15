import React from 'react';
import {
  BackHandler,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import UiButtonGreen from '../components/ui/button/ButtonGreen.js';
import UiButtonGreenOutline from '../components/ui/button/ButtonGreenOutline.js';
import UiHeader from '../components/ui/header/Header.js';
import UiTextInput from '../components/ui/form/TextInput.js';
import TabBarIcon from "../components/TabBarIcon.js";
import { isIphoneX } from '../components/isIphoneX.js';

import Colors from '../constants/Colors.js';

import { storeData, retrieveData } from '../services/Storage.js'


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const statusBarX = isIphoneX() ? 44 : 20;
//const statusBarIndent = Platform.OS === 'ios' ? statusBarX : StatusBar.currentHeight;
const statusBarIndent = Platform.OS === 'ios' ? statusBarX : 0;
const statusHeight = Platform.OS === 'ios' ? statusBarX : StatusBar.currentHeight;
const contentHeight = viewportHeight - statusHeight - 56 - 56;

export default class SettingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    settings: {
      keyboardType: 0,
      leftItems: 0
    }
  }

  componentDidMount() {
 
    this.load();
    this.props.navigation.addListener("willFocus", this.load);
  }

  load = () => {
    retrieveData("fl_settings").then((data)=>{ 
      if(data){ 
        if(data !== null && typeof data !==  undefined) this.setState({settings: data})
      }
    })
  }

  save(_k, _v){
    let d = this.state.settings;
    d[_k] = _v ;
    this.setState({ settings: d});
    storeData("fl_settings", d);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <UiHeader
            headerText="Настройки"
          />
          <KeyboardAvoidingView
            style={styles.content}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            enabled={Platform.OS === 'ios'}
          >
            {this.state.settings ? 
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.message}>Тип отображаемой клавиатуры</Text>
              <View style={styles.form}>

              {/*  <UiTextInput keyboardType="numeric" /> */}
              {this.state.settings.keyboardType == 0 ?
                  <UiButtonGreen gButtonText="Показывать цифровую" onPress={() => this.save("keyboardType", 0)} />
                  :
                  <UiButtonGreenOutline gOButtonText="Показывать цифровую" onPress={() => this.save("keyboardType", 0)}/>
                }
                 {this.state.settings.keyboardType == 1 ?
                  <UiButtonGreen gButtonText="Показывать  полную клавиатуру" onPress={() => this.save("keyboardType", 1)} />
                  :
                  <UiButtonGreenOutline gOButtonText="Показывать  полную клавиатуру" onPress={() => this.save("keyboardType", 1)}/>
                }

              </View>
              <Text style={styles.message}></Text>
              <View style={styles.form}>
                {this.state.settings.leftItems == 0 ?
                  <UiButtonGreen gButtonText="Показывать остаток товара" onPress={() => this.save("leftItems", 0)} />
                  :
                  <UiButtonGreenOutline gOButtonText="Показывать остаток товара" onPress={() => this.save("leftItems", 0)}/>
                }
                 {this.state.settings.leftItems == 1 ?
                  <UiButtonGreen gButtonText="Показывать товар только с остатком" onPress={() => this.save("leftItems", 1)} />
                  :
                  <UiButtonGreenOutline gOButtonText="Показывать товар только с остатком" onPress={() => this.save("leftItems", 1)}/>
                }
                 {/*this.state.settings.leftItems == 2 ?
                  <UiButtonGreen gButtonText="Показывать резерв товара" onPress={() => this.save("leftItems", 2)} />
                  :
                  <UiButtonGreenOutline gOButtonText="Показывать резерв товара" onPress={() => this.save("leftItems", 2)}/>
              */}
              </View>
            </ScrollView> : null}
          </KeyboardAvoidingView>

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
              <TabBarIcon size={25} color={Colors.darkGrayColor} name="md-list-outline" />
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
              <TabBarIcon size={25} color={Colors.greenColor} name="settings" />
              <Text
                style={[styles.tabButtonText, { color: Colors.greenColor }]}
              >
                Настройки
              </Text>
            </TouchableOpacity>

          </View>

        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.greenColor,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.greenColor,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollContent: {
    width: '100%',
    minHeight: contentHeight,
    paddingVertical: 16,
  },

  message: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    color: Colors.darkGrayColor,
    fontFamily: 'Roboto-Regular',
  },

  form: {
    paddingRight: 16,
    marginLeft: 16,
    paddingTop: 8,
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