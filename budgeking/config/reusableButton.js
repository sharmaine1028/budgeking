import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  TextInput,
  Image,
} from "react-native";
import colours from "./colours";
import fonts from "./fonts";

function reusableButton(props) {
  return <div></div>;
}

export function AddButton({ style, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={require("../assets/loginsignup/add.png")}
        style={[styles.addButton, style]}
      />
    </TouchableOpacity>
  );
}

export function BlackButton({ text, onPress, style, textStyle }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.blackButton, style]}
        onPress={onPress}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </TouchableOpacity>
    </>
  );
}

export function BrownTextInput({
  placeholder,
  onChangeText,
  onChange,
  value,
  maxLength,
  secureTextEntry,
}) {
  return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        autoCapitalize="none"
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 30,
    height: 30,
    position: "absolute",
  },
  blackButton: {
    width: 130,
    height: 50,
    borderRadius: 999,
    margin: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
  },

  text: {
    color: colours.white,
    margin: 1,
  },
});

export default reusableButton;
