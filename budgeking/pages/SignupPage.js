import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colours from "../config/colours";
import { BlackButton, BrownTextInput } from "../config/reusableButton";

function SignupPage(props) {
  return (
    <KeyboardAwareScrollView style={styles.container} scrollEnabled={false}>
      <ImageBackground
        style={styles.image}
        source={require("../assets/loginsignup/profile.png")}
      >
        <View style={styles.button}></View>
        <TouchableOpacity onPress={() => alert("Add a profile picture")}>
          <Image
            source={require("../assets/loginsignup/add.png")}
            style={styles.addButton}
          />
        </TouchableOpacity>
      </ImageBackground>

      <BrownTextInput placeholder={"Email"} />
      <BrownTextInput placeholder={"Username"} />
      <BrownTextInput placeholder={"Password"} />
      <BlackButton text="Sign up" />
      <View style={{ height: 60 }} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 30,
    height: 30,
    position: "absolute",
    left: 160,
    top: 160,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: colours.lightBrown,
    position: "absolute",
    left: 160,
    top: 160,
  },
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

export default SignupPage;
