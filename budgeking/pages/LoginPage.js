import React, { useState } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../config/firebase";
import { BlackButton } from "../config/reusableButton";
import { Footer, BrownTextInput } from "../config/reusableText";

export default class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      isLoading: false,
    };
  }

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

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  onFooterLinkPress = () => {
    this.props.navigation.navigate("Signup");
  };

  /**
   * Handles login  with firebase authentication
   */
  handleLogin = () => {
    // If necessary fields are empty, alert users
    if (this.state.email === "" || this.state.password === "") {
      alert("Enter details to log in!");
    } else {
      this.setState({
        isLoading: true,
      });

      // Handle log in with firebase authentication
      auth
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          // Reset state
          this.setState({
            isLoading: false,
            email: "",
            password: "",
          });

          // Navigate to homepage with successful login
          this.props.navigation.navigate("HomePage");
        })
        .catch((error) => {
          // Error handling
          if (error.code === "auth/invalid-email") {
            alert("Invalid email");
          }

          if (error.code === "auth/user-not-found") {
            alert("User not found.");
          }

          if (error.code === "auth/wrong-password") {
            alert("Wrong password");
          }

          // Reset state
          this.setState({
            isLoading: false,
            email: "",
            password: "",
          });

          this.setState({ isLoading: false });

          // Navigate to page again for user to reenter details
          this.props.navigation.navigate("Login");
        });
    }
  };
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
