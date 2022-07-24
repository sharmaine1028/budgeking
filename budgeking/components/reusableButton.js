import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Image,
} from "react-native";
import colours from "../styles/colours";

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

export function BlackButton({ text, onPress, style, textStyle, onFocus }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.blackButton, style]}
        onPress={onPress}
        onFocus={onFocus}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </TouchableOpacity>
    </>
  );
}

export function SmallBlackButton({ text, onPress, style, textStyle, onFocus }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.smallBlackButton, style]}
        onPress={onPress}
        onFocus={onFocus}
      >
        <Text style={{ fontSize: 10, color: colours.white }}>{text}</Text>
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
    height: 40,
    borderRadius: 999,
    margin: 2,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
  },
  smallBlackButton: {
    width: 30,
    height: 20,
    borderRadius: 999,
    margin: 2,
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
