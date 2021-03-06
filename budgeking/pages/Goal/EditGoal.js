import React, { useEffect, useState } from "react";
import { BlackButton } from "../../components/reusableButton";
import {
  IconTextInput,
  NewGoalInput,
  YesOrNo,
} from "../../components/reusableText";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import colours from "../../styles/colours";
import CurrencyInput from "react-native-currency-input";
import { auth, db } from "../../config/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function EditGoal({ route, navigation }) {
  const { doc, time, editItem } = route.params;
  const [data, setData] = useState(doc);
  const [datePicker, setDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const frequency = ["Daily", "Weekly", "Monthly", "Yearly"];
  const [sharingEmails, setSharingEmails] = useState(
    doc.sharingEmails.filter((item) => item !== auth.currentUser.email)
  );

  useEffect(
    () => updateFreqAmount(),
    [data.frequency, data.target, data.deadline]
  );

  const showDatePicker = () => {
    setDatePicker(true);
  };

  const onDateSelected = async (event, value) => {
    setDatePicker(false);
    setData({ ...data, deadline: value });
  };

  const dateFormat = (date) => {
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

    const target = data.target - data.currSavingsAmt;

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

    setData({ ...data, freqAmount: format(freqAmount) });
  };

  const format = (num) => {
    return (Math.ceil(num * 100) / 100).toFixed(2);
  };

  const deleteEmail = (tobeRemoved) => {
    const changedEmails = sharingEmails.filter(
      (email) => email !== tobeRemoved
    );
    setSharingEmails(changedEmails);
    if (changedEmails.length === 0) {
      setData({ ...data, isSharing: false });
    }
  };

  const share = (choice) => {
    if (choice.label === "Yes") {
      setData({ ...data, isSharing: true });
    } else {
      setData({
        ...data,
        isSharing: false,
        sharingEmails: [],
      });
    }
  };

  const onSubmitEmail = () => {
    checkEmail(email);
  };

  const onTypingEmail = (e) => {
    var key = e.nativeEvent.key;
    if (key === "Enter" || key === " " || key === ",") {
      const trimEmail = email.trim();
      checkEmail(trimEmail);
    }
  };

  const checkEmail = async (email) => {
    if (email === auth.currentUser.email) {
      alert("You can't add yourself!");
      setEmail("");

      return;
    }

    if (sharingEmails.includes(email)) {
      alert("This email has already been added");
      setEmail("");
      return;
    }

    const sharingUID = await db
      .collection("userLookup")
      .doc(email)
      .get()
      .then((data) => {
        if (data.exists) {
          setSharingEmails([...sharingEmails, email]);
          setEmail("");
          return data.data().uid;
        } else {
          alert("User does not exist");
          setEmail("");

          return null;
        }
      })
      .catch((err) => console.log(err));
  };

  const editGoal = () => {
    if (!data.goalDescription || !data.target || !data.frequency) {
      alert(
        "Please fill in goal description, target amount to save and freqency"
      );
    } else {
      const finalData = data;
      finalData.sharingEmails = sharingEmails;
      finalData.deadline.setHours(23);
      finalData.deadline.setMinutes(59);
      finalData.deadline.setSeconds(59);
      editItem(doc.id, time, finalData);
      navigation.navigate("Goals");
    }
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
          placeholder="$0.00"
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
        <IconTextInput
          icon={
            <MaterialCommunityIcons
              name="calendar-edit"
              size={28}
              color="black"
            />
          }
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
            {sharingEmails.map((email) => (
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

          {data.isSharing && (
            <NewGoalInput
              title={"Add user's email to share the goal with"}
              onChangeText={(val) => {
                setEmail(val);
              }}
              value={email}
              onSubmitEditing={onSubmitEmail}
              onKeyPress={onTypingEmail}
            />
          )}
        </View>
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
