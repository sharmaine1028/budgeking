import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colours from "../styles/colours";
import {
  BlackButton,
  AddButton,
  ModalOptions,
} from "../components/reusableButton";
import { Footer, BrownTextInput } from "../components/reusableText";
import { auth, db, storage } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";

export default class SignupPage extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      email: "",
      password: "",
      photoURL: "",
      isLoading: false,
      showModal: false,
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
        {this.state.showModal && (
          <View>
            <Modal
              transparent={true}
              visible={this.state.showModal}
              onRequestClose={() => this.setState({ showModal: false })}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPressOut={() => this.setState({ showModal: false })}
              >
                <View style={styles.modalView}>
                  <ModalOptions
                    text={"Take photo"}
                    onPress={() => this.takePhoto()}
                  />
                  <ModalOptions
                    text={"Your photos"}
                    onPress={() => this.pickImage()}
                  />
                  <ModalOptions
                    text={"Remove photo"}
                    onPress={() => this.removePhoto()}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
        <View>
          {this.maybeRenderImage()}
          <View style={styles.button}>
            <AddButton onPress={() => this.setState({ showModal: true })} />
          </View>
        </View>

        <BrownTextInput
          placeholder={"Email"}
          onChangeText={(val) => this.updateInputVal(val, "email")}
          value={this.state.email}
        />
        <BrownTextInput
          placeholder={"First name"}
          maxLength={15}
          onChangeText={(val) => this.updateInputVal(val, "firstName")}
          value={this.state.firstName}
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
    if (this.state.photoURL === "") {
      return (
        <Image
          style={styles.image}
          source={require("../assets/loginsignup/profile.png")}
        />
      );
    }

    return <Image style={styles.image} source={{ uri: this.state.photoURL }} />;
  };

  takePhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      } else {
        let pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
        }).catch((err) => console.log(error));

        if (!pickerResult.cancelled) {
          this.setState({ photoURL: pickerResult.uri });
        }
      }
    }
    this.setState({ showModal: false });
  };

  /**
   * Asks for user permission for gallery first
   * Allows user to pick image from gallery and updates state accordingly
   */
  pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need gallery permissions to make this work!");
      } else {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
        }).catch((err) => console.log(error));

        if (!pickerResult.cancelled) {
          this.setState({ photoURL: pickerResult.uri });
        }
      }
    }
    this.setState({ showModal: false });
  };

  removePhoto = () => {
    this.setState({ photoURL: "" });
    this.setState({ showModal: false });
  };

  uploadImage = async (uid) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", this.state.photoURL, true);
      xhr.send(null);
    });

    const ref = storage.ref().child(uid).child("profilePhoto");
    const snapshot = await ref.put(blob);
    blob.close();
    snapshot.ref.getDownloadURL().then((url) => {
      this.setState({ photoURL: url });
    });
    return await snapshot.ref.getDownloadURL();
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
            password: this.state.password,
            budgetValue: 0.0,
            budgetValueDaily: 0.0,
            dateTo: new Date(),
            dateFrom: new Date(),
            timeUserWants: "This Month",
            customExpenseArr: [],
          });

          db.collection("userLookup").doc(this.state.email).set({
            uid: res.user.uid,
          });

          this.uploadImage(res.user.uid);

          res.user.updateProfile({
            displayName: this.state.firstName,
            photoURL: this.state.photoURL,
          });

          // Alerts user to log in with new account
          alert("Log in with your new account");

          // Reset state on sign up page
          this.setState({
            isLoading: false,
            firstName: "",
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

  modalOptions: {
    marginVertical: 2,
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
