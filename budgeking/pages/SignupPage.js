import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colours from "../config/colours";
import { BlackButton, AddButton } from "../config/reusableButton";
import { Footer, BrownTextInput } from "../config/reusableText";
import { auth, db } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";

export default class SignupPage extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      email: "",
      password: "",
      imageSource: "",
      uploading: false,
      isLoading: false,
      cameraPermission: false,
    };
  }

  // async componentDidMount() {
  //   if (Platform.OS !== "web") {
  //     const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  //     console.log(status);
  //     if (status !== "granted") {
  //       alert("Sorry, we need camera roll permissions to make this work!");
  //     }
  //   }
  // }

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
        <View>
          {this.maybeRenderImage()}
          <View style={styles.button}>
            <AddButton onPress={() => this.addImageButton()} />
          </View>
        </View>

        <BrownTextInput
          placeholder={"Email"}
          onChangeText={(val) => this.updateInputVal(val, "email")}
          value={this.state.email}
        />
        <BrownTextInput
          placeholder={"First name"}
          onChangeText={(val) => this.updateInputVal(val, "firstName")}
          value={this.state.username}
        />
        <BrownTextInput
          placeholder={"Password"}
          onChangeText={(val) => this.updateInputVal(val, "password")}
          value={this.state.password}
          // maxLength={15}
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

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  /**
   * Navigate to Login page
   */
  onFooterLinkPress = () => {
    this.props.navigation.navigate("Login");
  };

  /**
   * Renders profile picture depending on whether user added one.
   * Otherwise, add default profile picture.
   *
   * @returns profile picture that users add, default picture otherwise
   */
  maybeRenderImage = () => {
    if (this.state.imageSource === "") {
      return (
        <Image
          style={styles.image}
          source={require("../assets/loginsignup/profile.png")}
        />
      );
    }

    return (
      <Image style={styles.image} source={{ uri: this.state.imageSource }} />
    );
  };

  /**
   * Calls pick Image function
   */
  addImageButton = async () => {
    this.pickImage();
  };

  /**
   * Allows user to pick image from gallery and updates state accordingly
   */
  pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    }).catch((err) => console.log(error));

    if (!pickerResult.cancelled) {
      this.setState({ imageSource: pickerResult.uri });
    }
  };

  /**
   * Handles errors in filling up of fields.
   * Handles logic of updating firebase authentication and details in firestore
   */
  handleSignUp = () => {
    // If any of the necessary fields are empty, alert user
    if (
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.firstName === ""
    ) {
      alert("Enter details to sign up!");
    } else {
      this.setState({
        isLoading: true,
      });

      // Create new account for user
      auth
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          // Add in user details in firestore
          db.collection("users").doc(res.user.uid).set({
            name: this.state.firstName,
            email: this.state.email,
            budgetValue: 0.0,
            dateTo: new Date(),
            dateFrom: new Date(),
            timeUserWants: "This Month",
          });

          email = this.state.email;
          db.doc("userLookup").set({
            email: res.user.uid,
          });

          // Update details in firebase authentication
          res.user.updateProfile({
            displayName: this.state.firstName,
            photoURL: this.state.imageSource,
          });

          // Alerts user to log in with new account
          alert("Log in with your new account");

          // Reset state on sign up page
          this.setState({
            isLoading: false,
            username: "",
            email: "",
            password: "",
          });

          // Navigates to login page for user to log in with new account
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
}

const styles = StyleSheet.create({
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
    borderRadius: 999,
  },
});
