import React from "react";
import { BlackButton } from "../../config/reusableButton";
import {
  ImageTextInput,
  NewGoalInput,
  YesOrNo,
} from "../../config/reusableText";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import colours from "../../config/colours";
import { TextInput } from "react-native-gesture-handler";
import CurrencyInput from "react-native-currency-input";
import { auth, db } from "../../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

class NewGoal extends React.Component {
  constructor() {
    super();
    this.frequency = ["Daily", "Weekly", "Monthly", "Yearly"];
    this.state = {
      datePicker: false,
      goalDescription: "",
      target: "",
      frequency: "",
      freqAmount: "",
      deadline: new Date(),
      notes: "",
      isSharing: false,
      email: "",
      sharingEmails: [],
      sharingUIDs: [],
    };
  }
  render() {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{ margin: 5, paddingBottom: 20 }}
      >
        <NewGoalInput
          title={"Goal Description"}
          onChangeText={(val) => this.updateInputVal(val, "goalDescription")}
          value={this.state.goalDescription}
          maxLength={30}
        />
        <View style={styles.newGoalInput}>
          <Text style={styles.newGoalTitle}>Target Amount to Save</Text>
          <CurrencyInput
            keyboardType="numeric"
            value={this.state.target}
            prefix="$"
            unit="$"
            delimiter=","
            separator="."
            precision={2}
            minValue={0}
            maxValue={9999999999999}
            onChangeValue={(val) => this.updateInputVal(val, "target")}
            placeholder="Type Here"
          />
        </View>

        <View style={styles.newGoalInput}>
          <Text style={styles.newGoalTitle}>Frequency</Text>
          <View style={{ flexDirection: "row" }}>
            <TextInput style={{ flex: 0.6 }} editable={false}>
              ${this.state.freqAmount}
            </TextInput>
            <View style={{ flex: 0.8 }}>
              <SelectDropdown
                buttonStyle={styles.frequencyDropdown}
                buttonTextStyle={{ fontSize: 15 }}
                data={this.frequency}
                onSelect={(itemValue, itemIndex) => {
                  this.updateInputVal(itemValue, "frequency");
                  this.updateFreqAmount();
                }}
                defaultButtonText={"Select"}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <FontAwesome
                      name={isOpened ? "chevron-up" : "chevron-down"}
                      color={colours.black}
                      size={18}
                    />
                  );
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.newGoalInput}>
          <Text style={styles.newGoalTitle}>Deadline</Text>
          <ImageTextInput
            source={require("../../assets/calendar.png")}
            onPress={() => this.showDatePicker()}
            d
            value={this.dateFormat()}
            editable={false}
            style={[styles.newGoalInput, { paddingHorizontal: 0, margin: 0 }]}
          />
        </View>

        {this.state.datePicker && (
          <RNDateTimePicker
            value={this.state.deadline}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            is24Hour={true}
            minimumDate={new Date()}
            onChange={this.onDateSelected}
          />
        )}

        <NewGoalInput
          title={"Notes"}
          onChangeText={(val) => this.updateInputVal(val, "notes")}
          value={this.state.notes}
          maxLength={50}
        />
        <YesOrNo
          title={"Would you like to share the goal with someone else?"}
          selectedBtn={(choice) => this.share(choice)}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {this.state.sharingEmails.map((email) => (
            <View key={email} style={styles.emailsContainer}>
              <Text key={email} style={styles.emails}>
                {email}
              </Text>
              <TouchableOpacity
                style={{ justifyContent: "center" }}
                onPress={() => this.deleteEmail(email)}
              >
                <MaterialCommunityIcons
                  name="close-box"
                  color={colours.black}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {this.state.isSharing && (
          <NewGoalInput
            title={"Add user's email to share the goal with"}
            onChangeText={(val) => {
              this.updateInputVal(val, "email");
            }}
            value={this.state.email}
            onKeyPress={this.checkEmail}
          />
        )}
        <View style={styles.beside}>
          <BlackButton
            text={"Add"}
            style={styles.buttons}
            onPress={() => this.addNewGoal()}
          />
          <BlackButton
            text={"Cancel"}
            style={styles.buttons}
            onPress={() => this.props.navigation.navigate("Goals")}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  /**
   * The below two functions handle logic for showing datepicker correctly
   */
  showDatePicker = () => {
    this.setState({ datePicker: true });
  };

  onDateSelected = (event, value) => {
    this.setState({
      deadline: value,
      datePicker: false,
    });
    this.updateFreqAmount();
  };

  /**
   * Returns date in format of DD MMM YYYY
   *
   * @returns The date selected correctly formatted
   */
  dateFormat = () => {
    const [day, month, year] = [
      this.state.deadline.getDate(),
      this.state.deadline.getMonth(),
      this.state.deadline.getFullYear(),
    ];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return day.toString() + " " + months[month] + " " + year.toString();
  };

  /**
   * Updates state of amount per time period according to
   * target, frequency and deadline
   */
  updateFreqAmount = () => {
    if (this.state.target === "") return;

    const today = new Date();
    const deadline = this.state.deadline;
    const target = this.state.target;

    const years = deadline.getFullYear() - today.getFullYear();
    let freqAmount;

    if (this.state.frequency === "Yearly") {
      freqAmount = years === 0 ? target : target / years;
    } else if (this.state.frequency === "Monthly") {
      const months =
        years * 12 + deadline.getMonth() - today.getMonth() <= 0
          ? 0
          : years * 12 + deadline.getMonth() - today.getMonth();

      freqAmount = months === 0 ? target : target / months;
    } else if (this.state.frequency === "Weekly") {
      const msInWeek = 1000 * 60 * 60 * 24 * 7;
      const weeks = Math.round(Math.abs(deadline - today) / msInWeek);
      freqAmount = weeks === 0 ? target : target / weeks;
    } else {
      const msInDay = 1000 * 3600 * 24;
      const days = Math.round(Math.abs(deadline - today) / msInDay);
      freqAmount = days === 0 ? target : target / days;
    }

    const format = (num) => {
      return (Math.ceil(num * 100) / 100).toFixed(2);
    };

    this.setState({ freqAmount: format(freqAmount) });
  };

  /**
   * Shows or hide panel to add user email depending on whether user chooses to share or not
   */
  share = (choice) => {
    if (choice.label === "Yes") {
      this.setState({ isSharing: true });
    } else {
      this.setState({ isSharing: false, sharingUserEmail: "" });
    }
  };

  checkEmail = async (e) => {
    var key = e.nativeEvent.key;
    if (key === "Enter" || key === " ") {
      const email = this.state.email.trim();

      if (email) {
        if (email === auth.currentUser.email) {
          alert("You can't add yourself!");
          this.setState({ email: "" });
          return;
        }

        if (this.state.sharingEmails.includes(email)) {
          alert("This email has already been added");
          this.setState({ email: "" });
          return;
        }

        const sharingUID = await db
          .collection("userLookup")
          .doc(email)
          .get()
          .then((data) => {
            if (data.exists) {
              this.setState({
                sharingEmails: [...this.state.sharingEmails, email],
                email: "",
              });
              this.setState({
                sharingUIDs: [...this.state.sharingUIDs, data.data().uid],
              });
              return data.data().uid;
            } else {
              alert("User does not exist");
              this.setState({ email: "" });
              return null;
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  deleteEmail = (tobeRemoved) => {
    this.setState({
      sharingEmails: this.state.sharingEmails.filter(
        (email) => email != tobeRemoved
      ),
    });
  };

  addNewGoal = async () => {
    try {
      let timePeriod;

      if (this.state.deadline.getFullYear() - new Date().getFullYear() < 5) {
        timePeriod = "short term";
      } else {
        timePeriod = "long term";
      }

      if (this.state.isSharing) {
        if (this.state.sharingEmails.length === 0) {
          alert("Please enter user email to share with");
          return;
        }
      }

      if (
        !this.state.goalDescription ||
        !this.state.target ||
        !this.state.frequency
      ) {
        alert(
          "Please fill in goal description, target amount to save and freqency"
        );
        return;
      }

      db.collection("active goals").doc().set({
        createdBy: auth.currentUser.uid,
        goalDescription: this.state.goalDescription,
        target: this.state.target,
        frequency: this.state.frequency,
        freqAmount: this.state.freqAmount,
        deadline: this.state.deadline,
        notes: this.state.notes,
        isSharing: this.state.isSharing,
        sharingEmails: this.state.sharingEmails,
        sharingUIDs: this.state.sharingUIDs,
        currSavingsAmt: 0,
      });

      this.props.navigation.navigate("Goals");
    } catch {
      (err) => console.log(err);
    }
  };
}

const styles = StyleSheet.create({
  beside: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttons: {
    flexGrow: 1,
    height: 40,
  },
  emailsContainer: {
    flexDirection: "row",
    backgroundColor: colours.lightBrown,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    margin: 2,
    marginLeft: 3,
    padding: 5,
  },
  emails: {
    borderRadius: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  frequencyDropdown: {
    backgroundColor: colours.darkBrown,
    borderRadius: 30,
  },
  newGoalInput: {
    backgroundColor: colours.lightBrown,
    borderRadius: 15,
    margin: 5,
    padding: 10,
    borderWidth: 0,
    elevation: 0,
  },
  newGoalTitle: {
    color: "#6C757D",
    fontSize: 12,
  },
});
export default NewGoal;
