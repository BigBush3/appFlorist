import React from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";

import Colors from "../../constants/Colors.js";

import { isIphoneX } from "../../components/isIphoneX.js";

import {
  checkLoginCourier,
  checkLicense,
  checkAccess,
} from "../../services/SignIn.js";
import { getAll } from "../../services/User.js";
import { storeData } from "../../services/Storage.js";

import Loader from "../../components/ui/Loader.js";
import UiButtonGreen from "../../components/ui/button/ButtonGreen.js";
import UiHeader from "../../components/ui/header/Header.js";
import UiLinkButton from "../../components/ui/button/LinkButton.js";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
const statusBarX = isIphoneX() ? 44 : 20;
const statusBarIndent =
  Platform.OS === "ios" ? statusBarX : StatusBar.currentHeight;
const statusHeight =
  Platform.OS === "ios" ? statusBarX : StatusBar.currentHeight;
const contentHeight = viewportHeight - statusHeight - 56 - 56;
const imageHeight = viewportHeight * 0.35;

export default class LogInScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    isLoading: true,
    loginProgress: false,
    nameInputFocusValidation: true,
    passwordInputFocusValidation: true,
    passwordVisible: true,
    modalUserVisible: false,
    modalDateVisible: false,
    usersItemList: [],

    login: "",
    password: "",
  };

  componentDidMount() {
    //100 111
    this.props.navigation.addListener("willFocus", this.load);
  }

  load = () => {
    this.setState({
      fontsLoaded: false,
      isLoading: true,
      loginProgress: false,
      nameInputFocusValidation: true,
      passwordInputFocusValidation: true,
      login: "",
      password: "",
    });
  };

  handlerFocus = (input) => {
    this.setState({
      [input]: true,
    });
  };

  handlerBlur = (input) => {
    this.setState({
      [input]: false,
    });
  };

  LogIn = (navigate) => {
    console.log("SS", this.state.login.length, this.state.password.length);

    if (this.state.login.length < 2 && this.state.password.length < 2) {
      this.setState({
        passwordInputFocusValidation: false,
        nameInputFocusValidation: false,
      });
    } else {
      if (this.state.password.length > 1) {
        this.setState({ loader: true });

        checkLicense(
          this.props.navigation.state.params.ip,
          Device.deviceName.replace(/ /i, "-")
        )
          .then((lic) => {
            if (lic.includes("<result>OK</result>")) {
              checkLoginCourier(
                this.props.navigation.state.params.ip,
                this.state.login,
                this.state.password
              )
                .then((res) => {
                  console.log(
                    "checkLoginCourier",
                    this.props.navigation.state.params.ip,
                    this.state.login,
                    this.state.password,
                    res.length,
                    res
                  );

                  if (res.length > 0) {
                    console.log("GO GO GO");
                    storeData("user", res[0]);

                    checkAccess(
                      this.props.navigation.state.params.ip,
                      res[0].USERSID
                    ).then((vls) => {
                      if (vls.result) {
                        let obj = {
                          enter_app: 1,
                          enter_sel: 1,
                          enter_assembly: 1,
                          enter_order: 1,
                          add_item: 1,
                          rem_item: 1,
                          add_sel: 1,
                          select_client: 1,
                          add_price: 1,
                        };
                        vls.result.map((item) => {
                          if (item.ACCESSID == 1) obj.enter_app = item.CAN;
                          if (item.ACCESSID == 8) obj.enter_sel = item.CAN;
                          if (item.ACCESSID == 82)
                            obj.enter_assembly = item.CAN;
                          if (item.ACCESSID == 83) obj.enter_order = item.CAN;
                          if (item.ACCESSID == 10) obj.add_item = item.CAN;
                          if (item.ACCESSID == 12) obj.rem_item = item.CAN;
                          if (item.ACCESSID == 22) obj.add_sel = item.CAN;
                          if (item.ACCESSID == 19) obj.select_client = item.CAN;
                          if (item.ACCESSID == 11) obj.add_price = item.CAN;
                        });
                        storeData("user_access", obj);
                        if (obj.enter_app == 1) {
                          this.setState({ loader: false });
                          this.props.navigation.navigate("Main");
                        } else {
                          this.setState({ loader: false });
                          Alert.alert("Внимание", "Нет прав на вход !");
                        }
                      }
                    });
                  } else {
                    this.setState({ loader: false });
                    Alert.alert("Внимание", "Пользователь не найден !");
                  }
                })
                .catch((error) => {
                  this.setState({ loader: true });
                  console.log(error);
                  Alert.alert(
                    "Внимание",
                    "Нет свободных лицензий ! Повторите вход"
                  );
                });
            } else {
              this.setState({ loader: false });
              Alert.alert("Внимание", "Нет свободных лицензий !");
            }
          })
          .catch((error) => {
            this.setState({ loader: true });
            console.log(error);
            Alert.alert("Внимание", "Нет свободных лицензий ! Повторите вход");
          });
        /*
       
        */
      } else {
        this.setState({
          passwordInputFocusValidation: false,
        });
      }
    }
  };

  changePasswordVisible = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <UiHeader
            headerText="Авторизация"
            btnLeft="back"
            pressLeft={() => this.props.navigation.navigate("Home")}
          />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            <KeyboardAvoidingView
              style={styles.content}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 16}
            >
              <View style={styles.loginBar}>
                <View style={styles.logoContainer}>
                  <Image
                    style={styles.logo}
                    source={require("../../assets/images/logo_florapoint_mobile.png")}
                  ></Image>
                </View>
                <View style={styles.form}>
                  <View style={styles.input}>
                    <TextInput
                      style={[
                        styles.textInput,
                        !this.state.nameInputFocusValidation
                          ? styles.inputDanger
                          : "",
                        this.state.nameInputFocus ? styles.textBlured : "",
                      ]}
                      placeholder="Код сотрудника"
                      placeholderTextColor="rgb(138,149,157)"
                      onChangeText={(value) => this.setState({ login: value })}
                      onFocus={() => this.handlerFocus("passwordInputFocus")}
                      onBlur={() => this.handlerBlur("passwordInputFocus")}
                      secureTextEntry={this.state.passwordVisible}
                    />
                    <Text
                      style={[
                        styles.warnText,
                        this.state.nameInputFocusValidation
                          ? styles.hideWarnText
                          : "",
                      ]}
                    >
                      Неверные данные
                    </Text>
                  </View>
                  <View style={styles.input}>
                    <TextInput
                      style={[
                        styles.textInput,
                        !this.state.passwordInputFocusValidation
                          ? styles.inputDanger
                          : "",
                        this.state.passwordInputFocus ? styles.textBlured : "",
                      ]}
                      placeholder="Пароль"
                      placeholderTextColor="rgb(138,149,157)"
                      onChangeText={(value) =>
                        this.setState({ password: value })
                      }
                      onFocus={() => this.handlerFocus("passwordInputFocus")}
                      onBlur={() => this.handlerBlur("passwordInputFocus")}
                      secureTextEntry={this.state.passwordVisible}
                    />
                    <Text
                      style={[
                        styles.warnText,
                        this.state.passwordInputFocusValidation
                          ? styles.hideWarnText
                          : "",
                      ]}
                    >
                      Неверные данные
                    </Text>
                    <TouchableOpacity
                      onPress={() => this.changePasswordVisible()}
                      style={styles.buttonTop}
                    >
                      <Ionicons
                        style={styles.backIcon}
                        name="eye"
                        size={22}
                        color="rgba(138,149,157,0.54)"
                      />
                    </TouchableOpacity>
                  </View>
                  <UiButtonGreen
                    gButtonText="Войти"
                    disabled={this.state.loginProgress}
                    onPress={() => {
                      this.LogIn(navigate);
                    }}
                  />
                </View>
              </View>
              <View style={styles.regLink}>
                <UiLinkButton
                  linkPress={() => navigate("Ip")}
                  linkText="Нет соединения? "
                  linkLink="Настройки"
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>

        {/* modals */}
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
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollContent: {
    width: "100%",
    minHeight: contentHeight,
    paddingVertical: 16,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 280,
    height: 280,
  },
  linksBar: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  linkBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  regLink: {
    width: "100%",
    paddingBottom: 15,
  },

  /* => TextInput Component */
  form: {
    paddingHorizontal: 16,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 22,
    height: 48,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    fontFamily: "Roboto-Regular",
  },
  textBlured: {
    borderColor: "#8db63b",
  },
  textUnBlured: {
    borderColor: "#e0e0e0",
  },
  inputDanger: {
    borderColor: "rgb(252,63,63)",
  },
  warnText: {
    color: "rgb(252,63,63)",
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
    lineHeight: 18,
    letterSpacing: 0.19,
  },
  hideWarnText: {
    opacity: 0,
    marginTop: -8,
    height: 0,
  },
  buttonTop: {
    position: "absolute",
    height: 48,
    width: 36,
    right: 0,
    top: 0,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  /* => SmallLink Component */
  smallLink: {
    marginTop: -2,
    marginBottom: 16,
    alignItems: "flex-end",
  },
  smallLinkText: {
    color: "rgb(138,149,157)",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.22,
    fontFamily: "Roboto-Regular",
  },

  /* Link Bar */
  linksBar: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  linkBlock: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  linkBlockText: {
    color: "rgb(138, 149, 157)",
    fontSize: 14,
    flexWrap: "wrap",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },
  borderAfter: {
    borderRightWidth: 1,
    borderRightColor: "rgb(226, 224, 229)",
  },
});
