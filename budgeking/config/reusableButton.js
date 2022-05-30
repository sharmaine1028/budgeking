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

export function AddButton({ moreStyle }) {
  return (
    <TouchableOpacity onPress={() => alert("Add a profile picture")}>
      <Image
        source={require("../assets/loginsignup/add.png")}
        style={[moreStyle, styles.addButton]}
      />
    </TouchableOpacity>
  );
}

export function BlackButton({ text, onPress, moreStyle }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[{ moreStyle }, styles.blackButton]}
        onPress={onPress}
      >
        <Text style={styles.text}>{text}</Text>
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
    fontFamily: fonts.field,
  },
  text: {
    color: colours.white,
  },
});

export default reusableButton;
