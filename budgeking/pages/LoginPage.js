import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  onChangeText,
  onChangeNumber,
  StatusBar,
  Image,
} from "react-native";
import colours from "../config/colours";
import { BlackButton, BrownTextInput } from "../config/reusableButton";

function LoginPage(props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/loginsignup/profile.png")}
      />
      <BrownTextInput placeholder={"Username/Email"} />
      <BrownTextInput placeholder={"Password"} />
      <BlackButton text="Login" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

export default LoginPage;
