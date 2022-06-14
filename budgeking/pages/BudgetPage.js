import React, { useEffect } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import colours from "../config/colours";
import { BlackButton } from "../config/reusableButton";
import {
  BudgetInput,
  Title,
  Header,
  ImageTextInput,
} from "../config/reusableText";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class BudgetPage extends React.Component {
  constructor() {
    super();
    this.state = {
      address: "",
      budget: "Expense",
      datePicker: false,
      timePicker: false,
      date: new Date(),
      time: new Date(Date.now()),
      value: "",
      category: "",
      notes: "",
      photoURI: "",
      location: null,
      locationPicker: false,
      locationRegion: null,
    };
  }

  render() {
    const address = this.props.route.params?.address;
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <BlackButton
              text={"Expense"}
              style={styles.expenseButton}
              textStyle={{ color: colours.black }}
              onPress={() => this.setState({ budget: "Expense" })}
            />
            <BlackButton
              text={"Income"}
              style={styles.incomeButton}
              textStyle={{ color: colours.black }}
              onPress={() => this.setState({ budget: "Income" })}
            />
          </View>

          <Title text={this.state.budget} style={{ marginVertical: 5 }} />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 0.3 }}>
              <Header text={"Value"} />
              <MaskedTextInput
                type="currency"
                options={{
                  prefix: "$",
                  decimalSeparator: ".",
                  groupSeparator: ",",
                  precision: 2,
                }}
                onChangeText={(text, rawText) => {
                  this.setState({ value: text });
                }}
                style={styles.value}
                keyboardType="numeric"
              />
            </View>

            <View style={{ flex: 0.4 }}>
              <Header text={"Date"} />
              <ImageTextInput
                source={require("../assets/calendar.png")}
                onPress={() => this.showDatePicker()}
                value={this.dateFormat()}
              />
            </View>

            <View style={{ flex: 0.25 }}>
              <Header text={"Time"} />
              <ImageTextInput
                source={require("../assets/clock.png")}
                onPress={() => this.showTimePicker()}
                value={this.timeFormat()}
              />
            </View>
          </View>

          {this.state.datePicker && (
            <RNDateTimePicker
              value={this.state.date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={this.onDateSelected}
            />
          )}

          {this.state.timePicker && (
            <RNDateTimePicker
              mode="time"
              value={this.state.time}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              is24Hour={true}
              onChange={this.onTimeSelected}
            />
          )}

          <BudgetInput text={"Category"} />
          <BudgetInput
            text={"Notes"}
            onChangeText={(val) => this.updateInputVal(val, "notes")}
          />

          <View style={styles.withImage}>
            <View>
              <Header text={"Attach photo"} />
              {this.state.photoURI ? (
                <Text style={{ fontSize: 10 }}>Photo updated</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => this.pickImage()}>
              <Image
                source={require("../assets/addphoto.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.withImage}>
            <View>
              <Header text="Add location" />
              {address ? this.maybeLocation(address) : null}
            </View>
            <TouchableOpacity onPress={() => this.showLocationPicker()}>
              <Image
                source={require("../assets/location.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <BlackButton
              text={"Add"}
              style={{ flexGrow: 0.5 }}
              onPress={() => this.addToGoals()}
            />
            <BlackButton text={"Cancel"} style={{ flexGrow: 0.5 }} />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  showDatePicker = () => {
    this.setState({ datePicker: true });
  };

  showTimePicker = () => {
    this.setState({ timePicker: true });
  };

  showLocationPicker = () => {
    this.setState({ locationPicker: true });
    this.props.navigation.navigate("Location Search");
  };

  onDateSelected = (event, value) => {
    this.setState({
      date: value,
      datePicker: false,
    });
  };

  onTimeSelected = (event, value) => {
    this.setState({
      time: value,
      timePicker: false,
    });
  };

  dateFormat = () => {
    const [day, month, year] = [
      this.state.date.getDate(),
      this.state.date.getMonth(),
      this.state.date.getFullYear(),
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

  timeFormat = () => {
    const [hour, minute] = [
      this.state.time.getHours(),
      this.state.time.getMinutes() < 10
        ? "0" + this.state.time.getMinutes()
        : this.state.time.getMinutes(),
    ];

    return hour.toString() + ":" + minute.toString();
  };

  pickImage = async () => {
    try {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      this.setState({ photoURI: pickerResult.uri });
    } catch (err) {
      console.log(err);
    }
  };

  maybeLocation = (address) => {
    if (this.state.address !== address) {
      this.setState({ address: address });
    }
    return <Text style={{ fontSize: 10 }}>{this.state.address}</Text>;
  };

  addToGoals = () => {
    // TODO
    console.log(this.state);
  };
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  expenseButton: {
    backgroundColor: "#FFB8AC",
    flexGrow: 0.5,
  },
  image: {
    width: 50,
    height: 50,
    overflow: "visible",
    resizeMode: "contain",
  },
  incomeButton: {
    backgroundColor: colours.green,
    flexGrow: 0.5,
  },
  mapContainer: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height * 0.2,
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  withImage: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    alignItems: "center",
  },
  value: {
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: "#251F47",
    borderRadius: 5,
    shadowColor: "#000",
    marginVertical: 5,
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
});
export default BudgetPage;
