import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import { TextInput } from "react-native-gesture-handler";
import CurrencyInput from "react-native-currency-input";
import { auth } from "../../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function EditGoal({ route, navigation }) {
  const { doc, time, editItem } = route.params;
  doc.deadline = new Date(doc.deadline.seconds * 1000);
  const [data, setData] = useState(doc);
  const [datePicker, setDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const frequency = ["Daily", "Weekly", "Monthly", "Yearly"];

  useEffect(
    () => updateFreqAmount(),
    [data.frequency, data.target, data.deadline]
  );

  const showDatePicker = () => {
    setDatePicker(true);
  };

  const onDateSelected = (event, value) => {
    value.setHours(23);
    value.setMinutes(59);
    value.setSeconds(59);
    setDatePicker(false);
    setData({ ...data, deadline: value });
  };

  const dateFormat = () => {
    const date = data.deadline;

    const [day, month, year] = [
      date.getDate(),
      date.getMonth(),
      date.getFullYear(),
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
  const updateFreqAmount = () => {
    if (data.target === "") return;
    const today = new Date();

    const deadline = data.deadline;

    const target = data.target;

    const years = deadline.getFullYear() - today.getFullYear();

    let freqAmount;

    if (data.frequency === "yearly") {
      freqAmount = years === 0 ? target : target / years;
    } else if (data.frequency === "monthly") {
      const months =
        years * 12 + deadline.getMonth() - today.getMonth() <= 0
          ? 0
          : years * 12 + deadline.getMonth() - today.getMonth();

      freqAmount = months === 0 ? target : target / months;
    } else if (data.frequency === "weekly") {
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

    setData({ ...data, freqAmount: format(freqAmount) });
  };

  const share = (choice) => {
    if (choice.label === "Yes") {
      setData({ ...data, isSharing: true });
    } else {
      setData({
        ...data,
        isSharing: false,
        sharingEmails: [],
        sharingUIDs: [],
      });
    }
  };

  onSubmitEmail = () => {
    this.checkEmail(this.state.email);
  };

  onTypingEmail = (e) => {
    var key = e.nativeEvent.key;
    if (key === "Enter" || key === " " || key === ",") {
      const email = this.state.email.trim();
      this.checkEmail(email);
    }
  };

  checkEmail = async (email) => {
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
  };

  const editGoal = () => {
    // time period check
    navigation.navigate("Goals");
    editItem(doc.id, time, data);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ margin: 5, paddingBottom: 20 }}
    >
      <NewGoalInput
        title={"Goal Description"}
        onChangeText={(val) => setData({ ...data, goalDescription: val })}
        value={data.goalDescription}
        maxLength={30}
      />
      <View style={styles.newGoalInput}>
        <Text style={styles.newGoalTitle}>Target Amount to Save</Text>
        <CurrencyInput
          keyboardType="numeric"
          value={data.target}
          prefix="$"
          unit="$"
          delimiter=","
          separator="."
          precision={2}
          minValue={0}
          maxValue={9999999999999}
          onChangeValue={(val) => setData({ ...data, target: val })}
          placeholder="Type Here"
        />
      </View>

      <View style={styles.newGoalInput}>
        <Text style={styles.newGoalTitle}>Frequency</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput style={{ flex: 0.6 }} editable={false}>
            ${data.freqAmount}
          </TextInput>

          <View style={{ flex: 0.8 }}>
            <SelectDropdown
              buttonStyle={styles.frequencyDropdown}
              buttonTextStyle={{ fontSize: 15 }}
              data={frequency}
              onSelect={(itemValue, itemIndex) => {
                setData({ ...data, frequency: itemValue });
                updateFreqAmount();
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
              dropdownStyle={styles.dropdownStyle}
              rowTextStyle={{ fontSize: 14 }}
            />
          </View>
        </View>
      </View>

      <View style={styles.newGoalInput}>
        <Text style={styles.newGoalTitle}>Deadline</Text>
        <ImageTextInput
          source={require("../../assets/calendar.png")}
          onPress={() => showDatePicker()}
          value={dateFormat(data.deadline)}
          editable={false}
          style={[styles.newGoalInput, { paddingHorizontal: 0, margin: 0 }]}
        />
      </View>

      {datePicker && (
        <RNDateTimePicker
          value={data.deadline}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          minimumDate={new Date()}
          onChange={onDateSelected}
        />
      )}

      <NewGoalInput
        title={"Notes"}
        onChangeText={(val) => setData({ ...data, notes: val })}
        value={data.notes}
        maxLength={50}
      />

      {data.createdBy === auth.currentUser.uid && (
        <View>
          <YesOrNo
            title={"Would you like to share the goal with someone else?"}
            initial={data.isSharing ? 1 : 2}
            selectedBtn={(choice) => share(choice)}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {data.sharingEmails.map((email) => (
              <View key={email} style={styles.emailsContainer}>
                <Text key={email} style={styles.emails}>
                  {email}
                </Text>
                <TouchableOpacity
                  style={{ justifyContent: "center" }}
                  onPress={() => deleteEmail(email)}
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
        </View>
      )}

      {data.isSharing && (
        <NewGoalInput
          title={"Add user's email to share the goal with"}
          onChangeText={(val) => {
            this.updateInputVal(val, "email");
          }}
          value={this.state.email}
          onSubmitEditing={this.onSubmitEmail}
          onKeyPress={this.onTypingEmail}
        />
      )}

      <View style={styles.beside}>
        <BlackButton
          text={"Edit"}
          style={styles.buttons}
          onPress={() => editGoal()}
        />
        <BlackButton
          text={"Cancel"}
          style={styles.buttons}
          onPress={() => navigation.navigate("Goals")}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

export default EditGoal;

const styles = StyleSheet.create({
  beside: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  buttons: {
    flexGrow: 1,
    height: 40,
  },
  dropdownStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
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
