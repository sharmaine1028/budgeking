import React from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import colours from "../../config/colours";
import { BlackButton } from "../../config/reusableButton";
import {
  BudgetInput,
  Title,
  Header,
  ImageTextInput,
} from "../../config/reusableText";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { auth, db } from "../../config/firebase";
import { Picker } from "@react-native-picker/picker";
import CurrencyInput from "react-native-currency-input";

class BudgetPage extends React.Component {
  constructor() {
    super();
    this.expenseCategory = [];
    this.state = {
      address: "",
      budget: "Expense",
      datePicker: false,
      timePicker: false,
      date: new Date(),
      time: new Date(Date.now()),
      value: "0.00",
      category: "",
      notes: "",
      photoURI: "",
      location: null,
      locationPicker: false,
      locationRegion: null,
    };
  }

  render() {
    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {this.budgetButtons()}

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
              <CurrencyInput
                style={styles.whiteInput}
                keyboardType="numeric"
                value={this.state.value}
                prefix="$"
                unit="$"
                delimiter=","
                separator="."
                precision={2}
                onChangeValue={(val) => this.updateInputVal(val, "value")}
                // onChangeText={(formattedValue) => {
                //   this.updateInputVal(formattedValue, "value");
                // }}
              />
            </View>

            <View style={{ flex: 0.4 }}>
              <Header text={"Date"} />
              <ImageTextInput
                source={require("../../assets/calendar.png")}
                onPress={() => this.showDatePicker()}
                value={this.dateFormat()}
                editable={false}
              />
            </View>

            <View style={{ flex: 0.25 }}>
              <Header text={"Time"} />
              <ImageTextInput
                source={require("../../assets/clock.png")}
                onPress={() => this.showTimePicker()}
                value={this.timeFormat()}
                editable={false}
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

          <Header text={"Category"} />
          <View style={styles.whiteInput}>{this.maybeCategories()}</View>
          <BudgetInput
            text={"Notes"}
            onChangeText={(val) => this.updateInputVal(val, "notes")}
            value={this.state.notes}
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
                source={require("../../assets/addphoto.png")}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.withImage}>
            <View>
              <Header text="Add location" />
              {this.maybeLocation()}
              <Text style={{ fontSize: 10 }}>{this.state.address}</Text>
            </View>
            <TouchableOpacity onPress={() => this.showLocationPicker()}>
              <Image
                source={require("../../assets/location.png")}
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
            <BlackButton
              text={"Cancel"}
              style={{ flexGrow: 0.5 }}
              onPress={() => this.reset()}
            />
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

  /**
   * Toggle between expense and income
   */
  budgetButtons = () => {
    return (
      <View style={styles.tabContainer}>
        <BlackButton
          text={"Expense"}
          style={styles.expenseButton}
          textStyle={{ color: colours.black }}
          onPress={() => {
            this.setState({ budget: "Expense" });
          }}
        />
        <BlackButton
          text={"Income"}
          style={styles.incomeButton}
          textStyle={{ color: colours.black }}
          onPress={() => this.setState({ budget: "Income" })}
        />
      </View>
    );
  };

  /**
   * The below four functions handles logic for showing the date and time picker correctly
   */
  showDatePicker = () => {
    this.setState({ datePicker: true });
  };

  showTimePicker = () => {
    this.setState({ timePicker: true });
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

  /**
   * The below two functions ensure that date and time is
   * formatted correctly.
   */
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

  /**
   * Allows user to pick images from gallery
   */
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

  /**
   * Navigates to Location Search page
   */
  showLocationPicker = () => {
    this.setState({ locationPicker: true });
    this.props.navigation.navigate("Location Search");
  };

  /**
   * Updates state if user changes location in
   * location search page
   */
  maybeLocation = () => {
    const address = this.props.route.params?.address;
    const location = this.props.route.params?.location;
    if (this.state.address !== address) {
      this.setState({ address: address, location: location });
    }
  };

  /**
   * Updates categories in dropdown menu according to whether
   * user chooses expense or income
   */
  maybeCategories = () => {
    if (this.state.budget === "Expense") {
      return (
        <Picker
          selectedValue={this.state.category}
          onValueChange={(itemValue, itemIndex) => {
            this.updateInputVal(itemValue, "category");
          }}
          mode="dropdown"
        >
          <Picker.Item label="Please select a category" enabled={false} />
          <Picker.Item label="Food and drinks" value="food and drinks" />
          <Picker.Item label="Transportation" value="transportation" />
          <Picker.Item label="Housing" value="housing" />
          <Picker.Item label="Shopping" value="shopping" />
          <Picker.Item label="Health" value="health" />
          <Picker.Item label="Education" value="education" />
          <Picker.Item label="Others" value="others" />
        </Picker>
      );
    } else {
      return (
        <Picker
          selectedValue={this.state.category}
          onValueChange={(itemValue, itemIndex) => {
            if (!itemValue) {
              this.updateInputVal("salary", "category");
            }
            this.updateInputVal(itemValue, "category");
          }}
        >
          <Picker.Item label="Please select a category" enabled={false} />
          <Picker.Item label="Salary" value="salary" />
          <Picker.Item label="Investment" value="investment" />
          <Picker.Item label="Rental income" value="rental income" />
          <Picker.Item label="Others" value="others" />
        </Picker>
      );
    }
  };

  /**
   * Updates user's expenses or income in firebase and resets fields
   */
  addToGoals = () => {
    // Error handling if user does not fill in necessary fields
    if (this.state.value === "0.00" || this.state.category === "") {
      alert("Please enter both value and category");
      return;
    }

    let currDb = db;

    // Navigate to correct doc in firestore
    if (this.state.budget === "Expense") {
      currDb = db
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("expense")
        .doc();
    } else {
      currDb = db
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("income")
        .doc();
    }

    console.log(this.state.location, this.state.address);
    if (this.state.location === undefined || this.state.address === undefined) {
      this.updateInputVal(null, "location");
      this.updateInputVal("", "address");
    }

    console.log(this.state.location, this.state.address);

    // Set fields accordingly
    currDb.set({
      date: this.state.date,
      time: this.state.time,
      notes: this.state.notes,
      value: this.state.value,
      photo: this.state.photoURI,
      address: this.state.address,
      location: this.state.location,
      category: this.state.category,
    });

    alert("Budget updated");

    this.reset();
  };

  /**
   * Resets all fields in form including location and address in location search page
   */
  reset = () => {
    let budget = this.state.budget;
    this.setState({ budget: budget });
    this.setState({
      datePicker: false,
      timePicker: false,
      date: new Date(),
      time: new Date(Date.now()),
      value: "0.00",
      category: "",
      notes: "",
      photoURI: "",
      location: null,
      locationPicker: false,
      locationRegion: null,
    });
    this.props.navigation.setParams({ address: "", location: null });
  };
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  expenseButton: {
    backgroundColor: "#ffb8ac",
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
  whiteInput: {
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
