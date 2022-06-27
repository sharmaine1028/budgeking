import React from "react";
import { BlackButton } from "../config/reusableButton";
import { auth } from "../config/firebase";
import {
  Header,
  ImageTextInput,
  Title,
  WhiteTextInput,
} from "../config/reusableText";
import RedLine from "../config/reusablePart";
import { StyleSheet, View, Image } from "react-native";
import { AddButton } from "../config/reusableButton";
import colours from "../config/colours";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity } from "react-native-gesture-handler";

class SettingsPage extends React.Component {
  constructor() {
    super();
    this.state = {
      currDisplayName: auth.currentUser.displayName,
      displayName: "",
      password: "",
      uri: auth.currentUser.photoURL,
      displayNameEditable: false,
      passwordEditable: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
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
        <ImageTextInput
          placeholder={this.state.currDisplayName}
          source={require("../assets/edit.jpg")}
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
        <ImageTextInput
          placeholder={"At least 6 characters"}
          source={require("../assets/edit.jpg")}
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
  };

  updateUserDisplayName = (props) => {
    try {
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
    this.setState({ passwordEditable: true });
  };

  updateUserPassword = (props) => {
    try {
      auth.currentUser.updatePassword(`${this.state.password}`).then((res) => {
        this.setState({ passwordEditable: false });
        alert("Password updated!");
      });
    } catch (error) {
      alert(error.message);
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
    if (!this.state.uri) {
      return (
        <Image
          style={styles.image}
          source={require("../assets/loginsignup/profile.png")}
        />
      );
    }

    return <Image style={styles.image} source={{ uri: this.state.uri }} />;
  };

  pickImage = async () => {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!pickerResult.cancelled) {
        this.setState({ imageSource: pickerResult.uri });
      }

      auth.currentUser.updateProfile({ photoURL: this.state.uri });
    } catch (err) {
      console.log(err);
    }
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
  logout: {
    width: 180,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 999,
    justifyContent: "flex-end",
  },
});

// Update user profile
// https://firebase.google.com/docs/auth/web/manage-users

export default SettingsPage;
