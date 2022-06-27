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

function EditGoal({ route, navigation }) {
  const { doc, time, editItem } = route.params;
  const [data, setData] = useState(doc);
  const [datePicker, setDatePicker] = useState(false);

  useEffect(
    () => updateFreqAmount(),
    [data.frequency, date.target, data.deadline]
  );

  const showDatePicker = () => {
    setDatePicker(true);
  };

  const onDateSelected = (event, value) => {
    setData({ ...data, deadline: value }, () => updateFreqAmount());
    setDatePicker(false);
  };

  const dateFormat = (seconds) => {
    const date = new Date(seconds * 1000);

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

    console.log(data.deadline, data.target);

    const deadline =
      data.deadline instanceof Date
        ? data.deadline
        : new Date(data.deadline.seconds * 1000);

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

    console.log(freqAmount);

    setData({ ...data, freqAmount: format(freqAmount) });
  };

  const editGoal = () => {
    editItem(doc.id, time, data);
    navigation.navigate("Goals");
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ margin: 5 }}>
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
          <View style={styles.frequencyDropdown}>
            <Picker
              selectedValue={data.frequency}
              onValueChange={(itemValue, itemIndex) => {
                console.log(itemValue);
                setData({ ...data, frequency: itemValue });
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
          source={require("../../assets/calendar.png")}
          onPress={() => showDatePicker()}
          d
          value={dateFormat(data.deadline.seconds)}
          editable={false}
          style={[styles.newGoalInput, { paddingHorizontal: 0, margin: 0 }]}
        />
      </View>

      {datePicker && (
        <RNDateTimePicker
          value={new Date(data.deadline.seconds * 1000)}
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
