import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  RectButton,
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../../constants/Colors";

const Separator = () => <View style={styles.itemSeparator} />;

const RightSwipeActions = (props) => {
  return (
    <View style={styles.swipeRightWrap}>
      <TouchableOpacity
        onPress={props.onEdit}
        style={[styles.swipeButton, { backgroundColor: Colors.grayColor }]}
      >
        <Ionicons name="pencil" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.onDelete}
        style={[styles.swipeButton, { backgroundColor: Colors.redColor }]}
      >
        <Ionicons name="trash-outline" size={24} color={Colors.whiteColor} />
      </TouchableOpacity>
    </View>
  );
};

const swipeFromRightOpen = () => {
  console.log("Swipe from right");
};

const ListItem = (props) => (
  <Swipeable
    renderRightActions={() => (
      <RightSwipeActions onEdit={props.onEdit} onDelete={props.onDelete} />
    )}
    onSwipeableRightOpen={swipeFromRightOpen}
  >
    <View style={styles.item}>
      <View style={styles.titleWrap}>
        <Text style={styles.itemText}>{props.title}</Text>
      </View>
      <Text style={[styles.itemText, { marginLeft: 8 }]}>{props.num} шт.</Text>
      <Text style={[styles.itemText, { marginLeft: 8 }]}>
        {parseFloat(props.price.toString().replace(",", "."))} р
      </Text>
      <Text style={[styles.itemText, { marginLeft: 8 }]}>
        {parseFloat(props.num.toString().replace(",", ".")) *
          parseFloat(props.price.toString().replace(",", "."))}{" "}
        р
      </Text>
    </View>
  </Swipeable>
);

const UiSwipeList = (props) => {
  return (
    <FlatList
      data={props.swipeList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ListItem
          onEdit={() => props.onEdit(item)}
          onDelete={() => props.onDelete(item)}
          {...item}
        />
      )}
      ItemSeparatorComponent={() => <Separator />}
    />
  );
};

export default UiSwipeList;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height: 48,
    backgroundColor: Colors.whiteColor,
  },
  titleWrap: {
    flexGrow: 1,
    flexShrink: 1,
  },
  itemText: {
    flexGrow: 0,
    flexShrink: 0,
    color: Colors.blackColor,
    fontFamily: "Roboto-Regular",
    fontSize: 12,
    lineHeight: 20,
  },
  itemSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.grayColor,
  },

  swipeRightWrap: {
    flexDirection: "row",
  },
  swipeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 64,
    height: 48,
    paddingHorizontal: 20,
  },
});
