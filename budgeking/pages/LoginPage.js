import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  onChangeText,
  onChangeNumber,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import colours from "../config/colours";
import { BlackButton } from "../config/reusableButton";

function LoginPage(props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/loginsignup/profile.png")}
      />
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
      <BlackButton text="Login" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
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
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

export default LoginPage;
