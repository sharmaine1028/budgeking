import React from "react";
import { BlackButton } from "../config/reusableButton";
import { auth, db, storage } from "../config/firebase";
import { Header, IconTextInput, Title } from "../config/reusableText";
import RedLine from "../config/reusablePart";
import {
  StyleSheet,
  View,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AddButton } from "../config/reusableButton";
import colours from "../config/colours";
import * as ImagePicker from "expo-image-picker";
import uuid from "uuid";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class SettingsPage extends React.Component {
  constructor() {
    super();

    this.state = {
      currDisplayName: auth.currentUser.displayName,
      displayName: "",
      password: "",
      photoURL: auth.currentUser.photoURL,
      displayNameEditable: false,
      passwordEditable: false,
      showModal: false,
      passwordConfirmation: "",
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showModal && (
          <View style={styles.modalView}>
            <Modal
              transparent={true}
              visible={this.state.showModal}
              onRequestClose={() => this.setState({ showModal: false })}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPressOut={() => this.setState({ showModal: false })}
              >
                <View style={styles.modalView}>
                  <View style={styles.modal}>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>
                      To verify it's you, enter your password:
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <TextInput
                        value={this.state.passwordConfirmation}
                        style={styles.modalTextInput}
                        onChangeText={(val) =>
                          this.updateInputVal(val, "passwordConfirmation")
                        }
                        secureTextEntry={true}
                      />
                    </View>
                    <BlackButton
                      text={"Verify"}
                      textStyle={styles.buttonTextStyle}
                      onPress={(val) => this.checkPassword(val)}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}
        <Title text={"Profile"} />
        <RedLine />
        <View style={styles.beside}>
          <Header text={"Change profile picture"} />
          <TouchableOpacity onPress={() => this.pickImage()}>
            {this.maybeRenderImage()}
            <View style={styles.button}>
              <AddButton
                // onPress={() => this.pickImage()}
                style={styles.addButton}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Header text={"Change username"} />
        <IconTextInput
          placeholder={this.state.currDisplayName}
          icon={
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={24}
              color="black"
            />
          }
          onPress={() => this.editDisplayName()}
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, "displayName")}
          editable={this.state.displayNameEditable}
        />

        <BlackButton
          text={"Change"}
          style={styles.smallButton}
          textStyle={styles.buttonTextStyle}
          onPress={(val) => this.updateUserDisplayName(val)}
        />

        <Header text={"Change password"} />
        <IconTextInput
          placeholder={"********"}
          icon={
            <MaterialCommunityIcons
              name="square-edit-outline"
              size={24}
              color="black"
            />
          }
          onPress={() => this.editPassword()}
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, "password")}
          editable={this.state.passwordEditable}
        />

        <BlackButton
          text={"Change"}
          style={styles.smallButton}
          textStyle={styles.buttonTextStyle}
          onPress={(val) => this.updateUserPassword(val)}
        />

        {/* <Title text={"Avatar"} />
        <RedLine /> */}

        <BlackButton
          text={"Log out"}
          onPress={() => this.signOut()}
          style={styles.logout}
        />
      </View>
    );
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  editDisplayName = () => {
    this.setState({ displayNameEditable: true });
    this.setState({ displayName: auth.currentUser.displayName });
  };

  updateUserDisplayName = (val) => {
    try {
      if (this.state.displayName === "") {
        if (this.state.displayNameEditable === true) {
          alert("Cannot be empty!");
          return;
        } else {
          alert("No change to username made.");
          return;
        }
      }
      auth.currentUser
        .updateProfile({
          displayName: `${this.state.displayName}`,
        })
        .then((res) => {
          this.setState({ currDisplayName: this.state.displayName });
          this.setState({ displayName: "", displayNameEditable: false });
          alert("Profile updated!");
        });
    } catch (error) {
      alert(error.message);
      console.log(error.message);
    }
  };

  editPassword = () => {
    this.setState({ showModal: true });
  };

  updateUserPassword = () => {
    try {
      auth.currentUser
        .updatePassword(`${this.state.password}`)
        .then((res) => {
          this.setState({ passwordEditable: false });
          db.collection("users")
            .doc(auth.currentUser.uid)
            .update({ password: this.state.password });
          alert("Password updated!");
          this.setState({ password: "" });
        })
        .catch((err) => alert(err.message));
    } catch (error) {
      alert(error.message);
      this.setState({ password: "" });
    }
  };

  checkPassword = async () => {
    const correctPassword = await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => doc.data().password)
      .catch((err) => console.log(err));

    if (this.state.passwordConfirmation !== correctPassword) {
      alert("Wrong password inputted! ");
      this.setState({ passwordEditable: true });
      this.setState({ passwordConfirmation: "" });

      return;
    } else {
      this.setState({ showModal: false });
      this.setState({ passwordEditable: true });
      this.setState({ password: correctPassword });
      this.setState({ passwordConfirmation: "" });
    }
  };

  signOut = () => {
    auth
      .signOut()
      .then(() => {
        this.props.navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  maybeRenderImage = () => {
    if (!this.state.photoURL) {
      return (
        <Image
          style={styles.image}
          source={require("../assets/loginsignup/profile.png")}
        />
      );
    }

    return <Image style={styles.image} source={{ uri: this.state.photoURL }} />;
  };

  pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    }).catch((err) => console.log(error));

    if (!pickerResult.cancelled) {
      this.uploadImage(pickerResult.uri);
    }
  };

  uploadImage = async (uri) => {
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
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = storage.ref().child(uuid.v4());
    const snapshot = await ref.put(blob);
    blob.close();
    snapshot.ref.getDownloadURL().then((url) => {
      this.setState({ photoURL: url });
      auth.currentUser.updateProfile({
        photoURL: url,
      });
    });
    return await snapshot.ref.getDownloadURL();
  };
}

const styles = StyleSheet.create({
  addButton: {
    width: 20,
    height: 20,
  },
  beside: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: 10,
  },
  button: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: colours.lightBrown,
    alignSelf: "flex-end",
    position: "absolute",
    top: 50,
  },
  container: {
    marginHorizontal: 20,
  },
  smallButton: {
    width: 130,
    height: 40,
    alignSelf: "flex-end",
  },
  buttonTextStyle: {
    fontSize: 13,
  },
  logout: { marginTop: 20 },
  image: {
    width: 70,
    height: 70,
    borderRadius: 999,
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000",
  },

  modalTextInput: {
    flex: 0.8,
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: "#251F47",
    borderRadius: 5,
    shadowColor: "#000",
    marginVertical: 5,
    shadowRadius: 1,
    elevation: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },

  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Update user profile
// https://firebase.google.com/docs/auth/web/manage-users

export default SettingsPage;
