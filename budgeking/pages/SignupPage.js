import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colours from "../config/colours";
import { BlackButton, AddButton } from "../config/reusableButton";
import { Footer, BrownTextInput } from "../config/reusableText";
import { auth } from "../config/firebase";

export default class SignupPage extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
    };
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  onFooterLinkPress = () => {
    this.props.navigation.navigate("Login");
  };

  handleSignUp = () => {
    if (
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.user === ""
    ) {
      alert("Enter details to sign up!");
    } else {
      this.setState({
        isLoading: true,
      });

      auth
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          res.user.updateProfile({ displayName: this.state.username });
          alert("Log in with your new account");
          console.log("User registered successfully");
          this.setState({
            isLoading: false,
            username: "",
            email: "",
            password: "",
          });
          this.props.navigation.navigate("Login");
        })
        .catch((error) => {
          if (error.code === "auth/email-already-in-use") {
            alert("That email address is already in use!");
          } else if (error.code === "auth/invalid-email") {
            alert("Invalid email");
          } else {
            alert(error.message);
          }
          console.log(error.message);
          this.setState({ isLoading: false });
          this.props.navigation.navigate("Signup");
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={(styles.container, styles.center)}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <KeyboardAwareScrollView
        style={styles.container}
        scrollEnabled={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <ImageBackground
          style={styles.image}
          source={require("../assets/loginsignup/profile.png")}
        >
          <View style={styles.button}></View>
          <AddButton style={styles.addButton} />
        </ImageBackground>

        <BrownTextInput
          placeholder={"Email"}
          onChangeText={(val) => this.updateInputVal(val, "email")}
          value={this.state.email}
        />
        <BrownTextInput
          placeholder={"Username"}
          onChangeText={(val) => this.updateInputVal(val, "username")}
          value={this.state.username}
        />
        <BrownTextInput
          placeholder={"Password"}
          onChangeText={(val) => this.updateInputVal(val, "password")}
          value={this.state.password}
          maxLength={15}
          secureTextEntry={true}
        />

        <BlackButton text="Sign up" onPress={this.handleSignUp} />
        <Footer
          desc={"Already have an account?"}
          text={"Log in"}
          onPress={this.onFooterLinkPress}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
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
  center: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});
