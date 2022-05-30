import React, { useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../config/firebase";
import { BlackButton, BrownTextInput } from "../config/reusableButton";
import { Footer } from "../config/reusableText";

export default class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  onFooterLinkPress = () => {
    this.props.navigation.navigate("Signup");
  };

  handleLogin = () => {
    if (this.state.email === "" || this.state.password === "") {
      alert("Enter details to log in!");
    } else {
      this.setState({
        isLoading: true,
      });
      auth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log("User logged in successfully!");
          this.setState({
            isLoading: false,
            email: "",
            password: "",
          });
          this.props.navigation.navigate("Home");
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            alert("Invalid email");
          }

          if (error.code === "auth/user-not-found") {
            alert("User not found.");
          }

          if (error.code === "auth/wrong-password") {
            alert("Wrong password");
          }

          this.setState({
            isLoading: false,
            email: "",
            password: "",
          });

          console.log(error.message);
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Login");
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#9E9E9E" alignItems="center" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/crown.png")}
          resizeMethod={"resize"}
        />
        <View style={styles.buttonContainer}>
          <BrownTextInput
            placeholder={"Email"}
            onChangeText={(val) => this.updateInputVal(val, "email")}
            value={this.state.email}
          />
          <BrownTextInput
            placeholder={"Password"}
            onChangeText={(val) => this.updateInputVal(val, "password")}
            value={this.state.password}
            maxLength={15}
            secureTextEntry={true}
          />
          <BlackButton text="Login" onPress={this.handleLogin} />
          <Footer
            desc={"Don't have an account yet?"}
            text={"Sign up"}
            onPress={this.onFooterLinkPress}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: { top: 50 },
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    bottom: 20,
    width: 223,
    height: 146,
    overflow: "visible",
    resizeMode: "contain",
  },
});
