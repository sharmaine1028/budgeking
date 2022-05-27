import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  onChangeText,
  onChangeNumber,
} from "react-native";
import colours from "../config/colours";

function LoginPage(props) {
  return (
    <View>
      <View></View>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder="Username/Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        placeholder="Password"
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

export default LoginPage;
