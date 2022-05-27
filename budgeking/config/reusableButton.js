import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
} from "react-native";
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

export function BrownTextInput({ placeholder, onChangeText }) {
  return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
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
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: colours.lightBrown,
    borderRadius: 25,
    width: 320,
    height: 46,
  },
});

export default reusableButton;
