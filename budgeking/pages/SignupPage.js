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
import {
  BlackButton,
  BrownTextInput,
  AddButton,
} from "../config/reusableButton";
import { Footer } from "../config/reusableText";
import { auth, db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

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

      const collectionRef = collection(db, "users");

      addDoc(collectionRef, {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.username,
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
          }
        });
    }
  };

  render() {
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
        <ImageBackground
          style={styles.image}
          source={require("../assets/loginsignup/profile.png")}
        >
          <View style={styles.button}></View>
          <AddButton moreStyle={styles.addButton} />
        </ImageBackground>

        <BrownTextInput
          placeholder={"Email"}
          onChangeText={(val) => this.updateInputVal(val, "email")}
          value={this.state.email}
        />
        <BrownTextInput
          placeholder={"First Name"}
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

        <BlackButton text="Sign up" />
        <Footer
          desc={"Already have an account yet?"}
          text={"Login"}
          onPress={this.onFooterLinkPress}
        />
        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>
    );
  }
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
