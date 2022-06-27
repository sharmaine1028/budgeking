import React, { useState, Component } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import DatePicker from "react-native-date-ranges";
import colours from "../config/colours";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from "../config/firebase";
import { BlackButton } from "../config/reusableButton";

// choose custom date

class ChooseCustomDate extends React.Component {
  constructor() {
    super();
    this.state = {
      dateTo: new Date(),
      dateFrom: new Date(),
      timeUserWants: "This Month",
    };
  }

  // update pie chart based on update on dateTo and dateFrom
  // componentDidUpdate(prevProps) {
  //   if (
  //     this.props.dateFrom !== prevProps.dateFrom ||
  //     this.props.dateTo !== prevProps.dateTo
  //   ) {
  //     this.fetchData(this.props.dateTo);
  //     this.fetchData(this.props.dateFrom);
  //   }
  // }

  updateInputVal(val, prop1, prop2) {
    // console.log(this.state.dateFrom);
    // console.log(this.state.dateTo);
    const state = this.state;
    state[prop1] = new Date(val["endDate"]);
    state[prop2] = new Date(val["startDate"]);
    this.setState(state);
    this.inputStartEndDateFireStore();
    // console.log("datefrom", this.state.dateFrom);
    // console.log("dateto", this.state.dateTo);
  }

  updateInputVal1(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  inputStartEndDateFireStore = () => {
    // console.log("helllo", this.state.dateFrom);
    db.collection("users").doc(auth.currentUser.uid).update({
      dateTo: this.state.dateTo,
      dateFrom: this.state.dateFrom,
    });
  };

  inputChooseTimeFireStore = () => {
    // console.log(this.state.timeUserWants)
    db.collection("users").doc(auth.currentUser.uid).update({
      timeUserWants: this.state.timeUserWants,
    });
  };

  confirmBlackButton() {
    console.log("before", this.state.timeUserWants);
    this.updateInputVal1("Choose custom dates", "timeUserWants");
    console.log("after", this.state.timeUserWants);
    this.inputChooseTimeFireStore();
    this.props.navigation.navigate("Pie Chart View");
  }

  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../assets/calendar.png")}
          />
          <View style={styles.datepicker}>
            <DatePicker
              style={styles.blackButton}
              customStyles={{
                placeholderText: {
                  fontSize: 17,
                  color: colours.white,
                  textAlign: "center",
                },
                headerStyle: {
                  height: 100,
                  backgroundColor: colours.whiteRock,
                },
                headerMarkTitle: {},
                headerDateTitle: { color: "#444", fontSize: 20 },
                contentInput: {},
                contentText: {
                  fontSize: 17,
                  color: colours.white,
                  textAlign: "center",
                },
              }}
              centerAlign
              allowFontScaling={false}
              placeholder={"Choose custom date"}
              markText={" "}
              mode={"range"}
              onConfirm={(val) =>
                this.updateInputVal(val, "dateTo", "dateFrom")
              }
              selectedTextColor={"white"}
              selectedBgColor={colours.whiteRock}
              ButtonStyle={styles.blackButton}
              ButtonTextStyle={styles.blackButtonText}
              outFormat={"YYYY/MM/DD"}
              headFormat={"YYYY/MM/DD"}
            />
          </View>
          <BlackButton
            text={"Confirm"}
            onPress={() => this.confirmBlackButton()}
          ></BlackButton>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    marginHorizontal: 20,
    backgroundColor: colours.white,
    marginTop: 50,
  },
  dropdownStyle: {
    width: "80%",
    alignSelf: "center",
    height: 50,
    backgroundColor: "EFEFEF",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colours.red,
  },
  blackButton: {
    width: "80%",
    height: 50,
    borderRadius: 999,
    margin: 2,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.black,
  },
  blackButtonText: {
    color: colours.white,
    fontSize: 17,
    textAlign: "center",
  },
  logo: {
    alignSelf: "center",
    marginBottom: 50,
  },
  datepicker: {
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default ChooseCustomDate;
