import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colours from "../config/colours";

function LoginSignupPage(props) {
  return (
    <View style={styles.container}>
      <View style={styles.logo} />
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.loginButton}
        title="Login"
        onPress={console.log("Login")}
      >
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.signUpButton}
        onPress={console.log("Sign up")}
      >
        <Text style={styles.text}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logo: {
    position: "relative",
    top: 20,
    width: 196,
    height: 172,
    backgroundColor: "#D9D9D9",
  },
  loginButton: {
    width: 134,
    height: 50,
    backgroundColor: colours.black,
    borderRadius: 999,
    top: 10,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpButton: {
    width: 134,
    height: 50,
    backgroundColor: colours.black,
    borderRadius: 999,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    bottom: 50,
  },
  text: {
    color: colours.white,
  },
});

export default LoginSignupPage;
