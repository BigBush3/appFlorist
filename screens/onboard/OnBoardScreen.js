import React from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";

import * as Font from "expo-font";

import Carousel, { Pagination } from "react-native-snap-carousel";

import { Entries } from "../../components/static/entries.js";
import { isIphoneX } from "../../components/isIphoneX.js";

import { storeData, retrieveData } from "../../services/Storage.js";

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(100);
const imageWidth = wp(65);
const imageHeight = imageWidth * 1.1;

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth;

const statusBarX = isIphoneX() ? 44 : 20;
//const statusBarIndent = Platform.OS === 'ios' ? statusBarX : StatusBar.currentHeight;
const statusBarIndent = Platform.OS === "ios" ? statusBarX : 0;
const statusHeight =
  Platform.OS === "ios" ? statusBarX : StatusBar.currentHeight;
const contentHeight = viewportHeight - statusHeight - 56;

export default class OnBoardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderActiveSlide: 0,
    };
  }
  state = {
    fontsLoaded: false,
    loading: true,
  };
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    Font.loadAsync({
      "Roboto-Medium": require("../../assets/fonts/Roboto-Medium.ttf"),
      "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    }).then(() => this.setState({ fontsLoaded: true }));

    this.setState({ loading: true });
    retrieveData("userProfile").then((res) => {
      console.log(res);

      retrieveData("showOnBoarding").then((showOnBoarding) => {
        //console.log("showOnBoarding",  showOnBoarding);
        retrieveData("userPass").then((code) => {
          console.log("code", res, res != null, code == null || code == "");
          this.setState({ loading: false });
          if (showOnBoarding != true) {
            storeData("showOnBoarding", true);
          } else {
            if (res == null) {
              this.props.navigation.navigate("LogIn");
            } else if (res != null && (code == null || code == "")) {
              this.props.navigation.navigate("Welcome");
            } else if (res != null && (code != null || code != "")) {
              this.props.navigation.navigate("LogInCode");
            }
          }
        });
      });
    });
  }

  nextSlide = (navigate) => {
    let i = this.state.sliderActiveSlide + 1;
    if (Entries.length > i) this.setState({ sliderActiveSlide: i });
    else navigate("IpScreen");
  };

  carouselContent({ item, index }) {
    return (
      <View style={styles.slide}>
        <View style={styles.illustrationView}>
          <Image style={styles.illustration} source={item.illustration} />
        </View>
        <View style={styles.title}>
          <Text style={styles.titleText}>{item.title}</Text>
        </View>
        <View style={styles.subtitle}>
          <Text style={styles.subtitleText}>{item.subtitle}</Text>
        </View>
      </View>
    );
  }

  get pagination() {
    const { sliderActiveSlide } = this.state;

    return (
      <Pagination
        dotsLength={Entries.length}
        activeDotIndex={sliderActiveSlide}
        dotStyle={{
          width: 9,
          height: 9,
          borderRadius: 4.5,
          marginHorizontal: -3,
          backgroundColor: "rgba(16,0,43,1)",
        }}
        inactiveDotStyle={{
          width: 9,
          height: 9,
          borderRadius: 4.5,
          backgroundColor: "rgba(16,0,43,0.2)",
        }}
        containerStyle={{
          height: 64,
          marginTop: 14,
          marginBottom: 18,
          flexGrow: 0,
          flexShrink: 0,
          width: "100%",
        }}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.fontsLoaded) {
      return <View />;
    }
    if (!this.state.loading) {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />

          <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
              <View style={styles.slider}>
                <Carousel
                  data={Entries}
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  renderItem={this.carouselContent}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  firstItem={this.state.sliderActiveSlide}
                  onSnapToItem={(index) =>
                    this.setState({ sliderActiveSlide: index })
                  }
                />
                {this.pagination}
              </View>
              <View style={styles.nextButton}>
                <TouchableOpacity
                  style={styles.blackButton}
                  onPress={() => this.nextSlide(navigate)}
                >
                  {this.state.sliderActiveSlide == 2 ? (
                    <Text style={styles.blackButtonText}>Начать</Text>
                  ) : (
                    <Text style={styles.blackButtonText}>Далее</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },

  nextButton: {
    height: 54,
    flexGrow: 0,
    flexShrink: 0,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  /* Slider */
  slider: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "space-between",
  },
  slide: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  illustrationView: {
    paddingBottom: 20,
    alignItems: "center",
  },
  illustration: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: "contain",
  },
  title: {
    paddingVertical: 16,
    marginHorizontal: 16,
  },
  titleText: {
    color: "rgb(16,0,43)",
    fontSize: 30,
    lineHeight: 36,
    fontFamily: "Roboto-Medium",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginHorizontal: 16,
  },
  subtitleText: {
    color: "rgb(138,149,157)",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  },

  /* => BlackButton Component */
  blackButton: {
    backgroundColor: "#8db63b",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: "100%",
  },
  blackButtonText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.25,
    fontFamily: "Roboto-Medium",
  },
});
