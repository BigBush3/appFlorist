import {
  createStackNavigator,
  createBottomTabNavigator,
} from "react-navigation";
import bottomContentComponents from "../navigation/BottomContentComponent";

import IpScreen from "../screens/login/IpScreen";
import LogInScreen from "../screens/login/LogInScreen";

import MainScreen from "../screens/main/MainScreen";
import ProductScreen from "../screens/products/ProductScreen";
import NewProductScreen from "../screens/products/NewProductScreen";
import OrdersScreen from "../screens/order/OrdersScreen";
import OrderScreen from "../screens/order/OrderScreen";
import NewOrderScreen from "../screens/order/NewOrderScreen";
import SellingScreen from "../screens/order/SellingScreen";
import SettingsScreen from "../screens/SettingsScreen";

const HomeStack = createStackNavigator({
  Home: IpScreen,
  ///Home: MainScreen,
});
HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const IpStack = createStackNavigator({
  Ip: IpScreen,
});
IpStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const LogInStack = createStackNavigator({
  LogIn: LogInScreen,
});
LogInStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const MainStack = createStackNavigator({
  Main: MainScreen,
});
MainStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const ProductStack = createStackNavigator({
  Product: ProductScreen,
});
ProductStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const NewProductStack = createStackNavigator({
  NewProduct: NewProductScreen,
});
NewProductStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};


const OrdersStack = createStackNavigator({
  Orders: OrdersScreen,
});
OrdersStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const OrderStack = createStackNavigator({
  Order: OrderScreen,
});
OrderStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const NewOrderStack = createStackNavigator({
  NewOrder: NewOrderScreen,
});
NewOrderStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};


const SellingStack = createStackNavigator({
  Selling: SellingScreen,
});
SellingStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});
SettingsStack.navigationOptions = {
  tabBarLabel: "",
  tabBarVisible: false,
  tabBarComponent: bottomContentComponents,
};


export default createBottomTabNavigator({
  HomeStack,
  IpStack,
  LogInStack,
  MainStack,
  ProductStack,
  NewProductStack,
  NewOrderStack,
  OrdersStack,
  OrderStack,
  SellingStack,
  SettingsStack
});
