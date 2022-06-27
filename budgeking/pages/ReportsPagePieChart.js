import React, { useState, Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
} from "react-native";
import colours from "../config/colours";
import { auth, db } from "../config/firebase";
import { Header, Title, SmallTextInput } from "../config/reusableText";
import { PieChart } from "react-native-gifted-charts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BlackButton } from "../config/reusableButton";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// **************custom date choosing - chart only changes after refreshing (idk how to refresh)

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

class ReportsPagePieChart extends React.Component {
  constructor() {
    super();
    this.fireStoreRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("expense");
    this.state = {
      timePeriod: ["Today", "This Month", "This Year", "Choose custom dates"],
      timeUserWants: "This Month",
      expenseArr: [],
      isLoading: true,
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      dateTo: new Date(),
      dateFrom: new Date(),
      refreshing: false,
      setRefreshing: false,
    };
  }

  updateInputValCurrExpenseArr(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  // onRefresh = () => {
  //   this.setState({ setRefreshing: true });
  //   wait(2000).then(() => this.setState({ setRefreshing: false }));
  // };

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  // calling budgetValue from firestore
  componentDidMount() {
    this.unsubscribe = this.fireStoreRef.onSnapshot(this.getCollection);
    this.callDatesValue();
    this.callChooseTimeValue();
    // this.focusListener = this.props.navigation.addListener("focus", () => {
    //   this.getCustomData();
    // });
  }

  componentWillUnmount() {
    this.unsubscribe();
    // this.focusListener();
  }

  inputChooseTimeFireStore = () => {
    // console.log(this.state.timeUserWants)
    db.collection("users").doc(auth.currentUser.uid).update({
      timeUserWants: this.state.timeUserWants,
    });
  };

  // update pie chart based on update on dateTo and dateFrom
  // componentDidUpdate(prevProps) {
  //   console.log("componentdidupdatedateto", this.state.dateTo);
  //   console.log("componentdidupdatedatef", this.state.dateFrom);
  //   if (
  //     this.props.dateFrom !== prevProps.dateFrom ||
  //     this.props.dateTo !== prevProps.dateTo
  //   ) {
  //     this.fetchData(this.props.dateTo);
  //     this.fetchData(this.props.dateFrom);
  //   }
  //   console.log("componentdidupdatedateto", this.state.dateTo);
  //   console.log("componentdidupdatedatef", this.state.dateFrom);
  // }

  getCollection = (querySnapshot) => {
    const expenseArrPush = [];
    querySnapshot.forEach((res) => {
      const { value, category, date } = res.data();
      expenseArrPush.push({
        key: res.id,
        value,
        category,
        date,
      });
    });
    this.setState({
      expenseArr: expenseArrPush,
      isLoading: false,
    });
  };

  callDatesValue() {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const { dateTo, dateFrom } = doc.data();
        this.setState({ dateTo: dateTo, dateFrom: dateFrom });
      });
  }

  callChooseTimeValue() {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const { timeUserWants } = doc.data();
        this.setState({ timeUserWants: timeUserWants });
      });
  }

  addExpenses() {
    if (this.state.timeUserWants === "This Month") {
      return this.addExpensesMonthly();
    } else if (this.state.timeUserWants == "Today") {
      return this.addExpensesDaily();
    } else if (this.state.timeUserWants == "This Year") {
      return this.addExpensesYearly();
    } else {
      return this.addExpensesCustom();
    }
  }

  addExpensesMonthly() {
    let sum = 0;
    this.getMonthlyData().map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2);
  }

  addExpensesDaily() {
    let sum = 0;
    this.getDailyData().map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2);
  }

  addExpensesYearly() {
    let sum = 0;
    this.getYearlyData().map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2);
  }

  addExpensesCustom() {
    let sum = 0;
    this.getCustomData().map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2);
  }

  updatePieData() {
    if (this.state.timeUserWants === "This Month") {
      return this.updatePieDataMonthly();
    } else if (this.state.timeUserWants == "Today") {
      return this.updatePieDataDaily();
    } else if (this.state.timeUserWants == "This Year") {
      return this.updatePieDataYearly();
    } else {
      return this.updatePieDataCustom();
    }
  }

  updatePieDataMonthly() {
    var pieDataPush = [
      { category: "food and drinks", value: 0, color: "#177AD5" },
      { category: "transportation", value: 0, color: "#79D2DE" },
      { category: "housing", value: 0, color: "#F7D8B5" },
      { category: "shopping", value: 0, color: "#8F80E4" },
      { category: "health", value: 0, color: "#FB8875" },
      { category: "education", value: 0, color: "#FDE74C" },
      { category: "others", value: 0, color: "#E8E0CE" },
    ];
    this.getMonthlyData().map((item, i) => {
      if (item.category == "food and drinks") {
        pieDataPush[0]["value"] += item.value;
      } else if (item.category == "transportation") {
        pieDataPush[1]["value"] += item.value;
      } else if (item.category == "housing") {
        pieDataPush[2]["value"] += item.value;
      } else if (item.category == "shopping") {
        pieDataPush[3]["value"] += item.value;
      } else if (item.category == "health") {
        pieDataPush[4]["value"] += item.value;
      } else if (item.category == "education") {
        pieDataPush[5]["value"] += item.value;
      } else {
        pieDataPush[6]["value"] += item.value;
      }
    });
    return pieDataPush;
  }

  updatePieDataDaily() {
    var pieDataPush = [
      { category: "food and drinks", value: 0, color: "#177AD5" },
      { category: "transportation", value: 0, color: "#79D2DE" },
      { category: "housing", value: 0, color: "#F7D8B5" },
      { category: "shopping", value: 0, color: "#8F80E4" },
      { category: "health", value: 0, color: "#FB8875" },
      { category: "education", value: 0, color: "#FDE74C" },
      { category: "others", value: 0, color: "#E8E0CE" },
    ];
    this.getDailyData().map((item, i) => {
      if (item.category == "food and drinks") {
        pieDataPush[0]["value"] += item.value;
      } else if (item.category == "transportation") {
        pieDataPush[1]["value"] += item.value;
      } else if (item.category == "housing") {
        pieDataPush[2]["value"] += item.value;
      } else if (item.category == "shopping") {
        pieDataPush[3]["value"] += item.value;
      } else if (item.category == "health") {
        pieDataPush[4]["value"] += item.value;
      } else if (item.category == "education") {
        pieDataPush[5]["value"] += item.value;
      } else {
        pieDataPush[6]["value"] += item.value;
      }
    });
    return pieDataPush;
  }

  updatePieDataYearly() {
    var pieDataPush = [
      { category: "food and drinks", value: 0, color: "#177AD5" },
      { category: "transportation", value: 0, color: "#79D2DE" },
      { category: "housing", value: 0, color: "#F7D8B5" },
      { category: "shopping", value: 0, color: "#8F80E4" },
      { category: "health", value: 0, color: "#FB8875" },
      { category: "education", value: 0, color: "#FDE74C" },
      { category: "others", value: 0, color: "#E8E0CE" },
    ];
    this.getYearlyData().map((item, i) => {
      if (item.category == "food and drinks") {
        pieDataPush[0]["value"] += item.value;
      } else if (item.category == "transportation") {
        pieDataPush[1]["value"] += item.value;
      } else if (item.category == "housing") {
        pieDataPush[2]["value"] += item.value;
      } else if (item.category == "shopping") {
        pieDataPush[3]["value"] += item.value;
      } else if (item.category == "health") {
        pieDataPush[4]["value"] += item.value;
      } else if (item.category == "education") {
        pieDataPush[5]["value"] += item.value;
      } else {
        pieDataPush[6]["value"] += item.value;
      }
    });
    return pieDataPush;
  }

  updatePieDataCustom() {
    var pieDataPush = [
      { category: "food and drinks", value: 0, color: "#177AD5" },
      { category: "transportation", value: 0, color: "#79D2DE" },
      { category: "housing", value: 0, color: "#F7D8B5" },
      { category: "shopping", value: 0, color: "#8F80E4" },
      { category: "health", value: 0, color: "#FB8875" },
      { category: "education", value: 0, color: "#FDE74C" },
      { category: "others", value: 0, color: "#E8E0CE" },
    ];
    this.getCustomData().map((item, i) => {
      if (item.category == "food and drinks") {
        pieDataPush[0]["value"] += item.value;
      } else if (item.category == "transportation") {
        pieDataPush[1]["value"] += item.value;
      } else if (item.category == "housing") {
        pieDataPush[2]["value"] += item.value;
      } else if (item.category == "shopping") {
        pieDataPush[3]["value"] += item.value;
      } else if (item.category == "health") {
        pieDataPush[4]["value"] += item.value;
      } else if (item.category == "education") {
        pieDataPush[5]["value"] += item.value;
      } else {
        pieDataPush[6]["value"] += item.value;
      }
    });
    return pieDataPush;
  }

  putInTextToPie() {
    var pieData = this.updatePieData();
    this.updatePieData().map((item, i) => {
      pieData[i]["text"] = "$";
      pieData[i]["text"] += pieData[i]["value"];
    });
    return pieData;
  }

  getMonthlyData() {
    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();
    // console.log("currmonth", currMonth)
    const expenseArrayTimeConverted = this.state.expenseArr;
    const monthlyExpenseArray = [];
    expenseArrayTimeConverted.map((item, i) => {
      const dateItem = expenseArrayTimeConverted[i]["date"];
      // console.log("dateitem", dateItem)
      if (
        dateItem.toDate().getMonth() == currMonth &&
        dateItem.toDate().getFullYear() == currYear
      ) {
        monthlyExpenseArray.push(expenseArrayTimeConverted[i]);
      }
    });
    return monthlyExpenseArray;
  }

  getDailyData() {
    const currDate = new Date().toLocaleDateString();
    const expenseArrayTimeConverted = this.state.expenseArr;
    const dailyExpenseArray = [];
    expenseArrayTimeConverted.map((item, i) => {
      const dateItem = expenseArrayTimeConverted[i]["date"];
      if (dateItem.toDate().toLocaleDateString() == currDate) {
        dailyExpenseArray.push(expenseArrayTimeConverted[i]);
      }
    });
    return dailyExpenseArray;
  }

  getYearlyData() {
    const currYear = new Date().getFullYear();
    const expenseArrayTimeConverted = this.state.expenseArr;
    const yearlyExpenseArray = [];
    expenseArrayTimeConverted.map((item, i) => {
      const dateItem = expenseArrayTimeConverted[i]["date"];
      if (dateItem.toDate().getFullYear() == currYear) {
        yearlyExpenseArray.push(expenseArrayTimeConverted[i]);
      }
    });
    return yearlyExpenseArray;
  }

  getCustomData() {
    // console.log("dateto", this.state.dateTo.toDate());
    // console.log("datef", this.state.dateFrom.toDate());
    let end = this.state.dateTo.seconds;
    let start = this.state.dateFrom.seconds;
    const expenseArrayTimeConverted = this.state.expenseArr;
    const customExpenseArray = [];
    expenseArrayTimeConverted.map((item, i) => {
      const dateItem = expenseArrayTimeConverted[i]["date"];
      if (dateItem.seconds >= start && dateItem.seconds <= end) {
        customExpenseArray.push(expenseArrayTimeConverted[i]);
      }
    });
    return customExpenseArray;
  }

  toggleMonthlyDailyYearly = (val) => {
    if (val === 1) {
      this.updateInputVal("This Month", "timeUserWants");
      this.inputChooseTimeFireStore();
    } else if (val == 0) {
      this.updateInputVal("Today", "timeUserWants");
      this.inputChooseTimeFireStore();
    } else if (val == 2) {
      this.updateInputVal("This Year", "timeUserWants");
      this.inputChooseTimeFireStore();
    } else {
      this.props.navigation.navigate("Custom Date");
    }
  };

  textBesideCategories() {
    var dayText = "";
    if (this.state.timeUserWants == "This Month") {
      dayText += this.state.monthNames[new Date().getMonth()];
    } else if (this.state.timeUserWants == "Today") {
      dayText += new Date().toLocaleDateString();
    } else if (this.state.timeUserWants == "This Year") {
      dayText += new Date().getFullYear();
    } else {
      dayText += this.state.dateFrom.toDate().toLocaleDateString();
      dayText += " - ";
      dayText += this.state.dateTo.toDate().toLocaleDateString();
    }
    return dayText;
  }

  timeUserWantText() {
    if (this.state.timeUserWants == "This Month") {
      return "monthly";
    } else if (this.state.timeUserWants == "Today") {
      return "daily";
    } else if (this.state.timeUserWants == "This Year") {
      return "yearly";
    } else {
      return "custom";
    }
  }

  onDateSelected = (event, value) => {
    this.setState({
      date: value,
      datePicker: false,
    });
  };

  render() {
    const { navigation } = this.props;

    const pieData = this.putInTextToPie();

    const renderLegend = (text, color) => {
      return (
        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          <View
            style={{
              height: 18,
              width: 18,
              marginRight: 10,
              borderRadius: 4,
              backgroundColor: color || "white",
            }}
          />
          <Text style={{ color: "#444444", fontSize: 16 }}>{text || ""}</Text>
        </View>
      );
    };

    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          {/* <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh()}
              />
            }
          > */}
          <View style={styles.reportPieChart}>
            <Header
              text={`${"\n"}Categories (${this.textBesideCategories()} ${this.timeUserWantText()} expenses)\n\n`}
            />

            <PieChart
              style={styles.pie}
              donut
              innerRadius={Dimensions.get("window").width * 0.2}
              showText
              textColor="black"
              radius={Dimensions.get("window").width * 0.4}
              textSize={15}
              data={pieData}
              focusOnPress
              centerLabelComponent={() => {
                return (
                  <Text
                    style={styles.totalSpentText}
                  >{`Total Spent\n$${this.addExpenses()}`}</Text>
                );
              }}
            />

            <View
              style={{
                width: "100%",
                justifyContent: "space-evenly",
                marginTop: 20,
              }}
            >
              {renderLegend("food and drinks", "#177AD5")}
              {renderLegend("transportation", "#79D2DE")}
              {renderLegend("housing", "#F7D8B5")}
              {renderLegend("shopping", "#8F80E4")}
              {renderLegend("health", "#FB8875")}
              {renderLegend("education", "#FDE74C")}
              {renderLegend("others", "#E8E0CE")}
            </View>
          </View>

          <BlackButton
            text={"Show more"}
            style={{ flexGrow: 0.5 }}
            onPress={() => navigation.navigate("Table View")}
          />

          <View style={styles.chooseTime}>
            <SelectDropdown
              data={this.state.timePeriod}
              onSelect={(selectedItem, index) => {
                // console.log(selectedItem, index);
                return this.toggleMonthlyDailyYearly(index);
              }}
              defaultButtonText={this.state.timeUserWants}
              buttonTextAfterSelection={(selectedTime, index) => {
                return selectedTime;
              }}
              rowTextForSelection={(time, index) => {
                return time;
              }}
              buttonStyle={styles.dropdownStyle}
              buttonTextStyle={styles.dropdownTxtStyle}
              dropdownIconPosition={"right"}
              dropdownStyle={styles.dropdownDropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              rowTextStyle={styles.dropdownRowTxtStyle}
              renderDropdownIcon={(isOpened) => {
                return (
                  <FontAwesome
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    color={colours.red}
                    size={18}
                  />
                );
              }}
            />
          </View>
          {/* </ScrollView> */}
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
    marginTop: 20,
  },
  totalSpentText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "300",
  },
  reportPieChart: {
    borderWidth: 2,
    paddingLeft: 20,
    borderColor: colours.red,
    marginBottom: 20,
  },
  pie: {
    justifyContent: "center",
    alignItems: "center",
  },
  chooseTime: {
    marginTop: 20,
    marginBottom: 20,
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
  dropdownTxtStyle: {
    color: "#444",
    textAlign: "center",
    fontSize: 16,
  },
  dropdownDropdownStyle: {
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
  },
  dropdownRowStyle: {
    backgroundColor: "#EFEFEF",
    borderBottomColor: "#C5C5C5",
  },
  dropdownRowTxtStyle: {
    color: "#444",
    textAlign: "center",
    fontSize: 16,
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  blackButton: {
    width: 130,
    height: 40,
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
});
export default ReportsPagePieChart;
