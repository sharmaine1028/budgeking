import React from "react";
import { BlackButton } from "../config/reusableButton";
import { ImageTextInput, NewGoalInput, YesOrNo } from "../config/reusableText";
import { View, StyleSheet, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import colours from "../config/colours";
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-gesture-handler";
import CurrencyInput from "react-native-currency-input";
import { auth, db } from "../config/firebase";

class NewGoal extends React.Component {
  constructor() {
    super();
    this.state = {
      datePicker: false,
      goalDescription: "",
      target: "",
      frequency: "",
      freqAmount: "",
      deadline: new Date(),
      notes: "",
      isSharing: false,
      sharingUserEmail: "",
    };
  }
  render() {
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ margin: 5 }}>
        <NewGoalInput
          title={"Goal Description"}
          onChangeText={(val) => this.updateInputVal(val, "goalDescription")}
          value={this.state.goalDescription}
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
            <View style={styles.frequencyDropdown}>
              <Picker
                selectedValue={this.state.frequency}
                onValueChange={(itemValue, itemIndex) => {
                  this.updateInputVal(itemValue, "frequency");
                  this.updateFreqAmount();
                }}
                mode="dialog"
              >
                <Picker.Item label="Select" enabled={false} />
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Yearly" value="yearly" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.newGoalInput}>
          <Text style={styles.newGoalTitle}>Deadline</Text>
          <ImageTextInput
            source={require("../assets/calendar.png")}
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
        />
        <YesOrNo
          title={"Would you like to share the goal with someone else?"}
          selectedBtn={(choice) => this.share(choice)}
        />

        {this.state.isSharing && (
          <NewGoalInput
            title={"Add user's email to share the goal with"}
            onChangeText={(val) => this.updateInputVal(val, "sharingUserEmail")}
            value={this.state.sharingUserEmail}
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

    if (this.state.frequency === "yearly") {
      freqAmount = years === 0 ? target : target / years;
    } else if (this.state.frequency === "monthly") {
      const months =
        years * 12 + deadline.getMonth() - today.getMonth() <= 0
          ? 0
          : years * 12 + deadline.getMonth() - today.getMonth();

      freqAmount = months === 0 ? target : target / months;
    } else if (this.state.frequency === "weekly") {
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
      this.setState({ isSharing: false });
    }
  };

  addNewGoal = () => {
    let timePeriod;

    if (this.state.deadline.getFullYear() - new Date().getFullYear() < 5) {
      timePeriod = "short term";
    } else {
      timePeriod = "long term";
    }

    if (this.state.isSharing) {
      admin
        .auth()
        .getUserByEmail(this.state.sharingUserEmail)
        .then((val) => console.log(val))
        .catch((err) => console.log(err));
    }

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("goals")
      .collection(timePeriod)
      .doc()
      .set({
        goalDescription: this.state.goalDescription,
        target: this.state.target,
        frequency: this.state.frequency,
        freqAmount: this.state.freqAmount,
        deadline: this.state.deadline,
        notes: this.state.notes,
        isSharing: this.state.isSharing,
        sharingUserEmail: this.state.sharingUserEmail,
      });
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
  frequencyDropdown: {
    flex: 0.4,
    backgroundColor: colours.darkBrown,
    borderRadius: 30,
    width: 100,
    height: 40,
    justifyContent: "center",
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
