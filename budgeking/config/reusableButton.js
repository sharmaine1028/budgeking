import React from "react";
import { TouchableOpacity, StyleSheet, Dimensions, Text } from "react-native";
import colours from "./colours";

function reusableButton(props) {
  return <div></div>;
}

export function BlackButton({ text, handlePress, moreStyle }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[{ moreStyle }, styles.blackButton]}
        onPress={handlePress}
      >
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colours.white,
  },
  blackButton: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").height * 0.07,
    borderRadius: 999,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
  },
});

export default reusableButton;
