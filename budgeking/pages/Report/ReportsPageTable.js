import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Header, Title } from "../../config/reusableText";
import colours from "../../config/colours";
import Icon from "react-native-vector-icons/AntDesign";
import { auth, db } from "../../config/firebase";
import { BlackButton } from "../../config/reusableButton";
import { GreyLine } from "../../config/reusablePart";
import { Image } from "react-native";

// dateFormat, timeFormat() to localdatestring() and localtimestring()

import { dateFormat, categoryFormat, timeFormat } from "../Home/HomePage";
import { renderNoRecords } from "../Home/HomePage";

class ReportsPageTable extends React.Component {
  constructor() {
    super();
    this.ExpenseRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("expense");
    this.IncomeRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("income");
    this.state = {
      expenseArr: [],
      incomeArr: [],
      budget: "Expense",
      timeUserWants: "This Month",
      dateTo: new Date(),
      dateFrom: new Date(),
    };
  }

  componentDidMount() {
    this.unsubscribeExpenseRef = this.ExpenseRef.onSnapshot(
      this.getCollectionExpense
    );
    this.unsubscribeIncomeRef = this.IncomeRef.onSnapshot(
      this.getCollectionIncome
    );
    this.callChooseTimeValue();
    this.callDateValue();
  }

  componentWillUnmount() {
    this.unsubscribeExpenseRef();
    this.unsubscribeIncomeRef();
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

  callDateValue() {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const { dateTo, dateFrom } = doc.data();
        // console.log("calldatetovalues", dateTo, dateFrom);
        this.setState({ dateTo: dateTo, dateFrom: dateFrom });
      });
  }

  getCollectionExpense = (querySnapshot) => {
    const expenseArrPush = [];
    querySnapshot.forEach((res) => {
      const { notes, value, category, date, time, photoURL, address } =
        res.data();
      expenseArrPush.push({
        key: res.id,
        value,
        notes,
        category,
        date,
        time,
        photoURL,
        address,
      });
    });
    this.setState({
      expenseArr: expenseArrPush,
    });
  };

  getCollectionIncome = (querySnapshot) => {
    const incomeArrPush = [];
    querySnapshot.forEach((res) => {
      const { category, date, notes, value, time, photoURL, address } =
        res.data();
      incomeArrPush.push({
        key: res.id,
        value,
        category,
        notes,
        date,
        time,
        photoURL,
        address,
      });
    });
    this.setState({
      incomeArr: incomeArrPush,
    });
  };

  getCustomData(doc) {
    // console.log("dateto", this.state.dateTo.seconds);
    // console.log("datef", this.state.dateFrom.seconds);
    let end = this.state.dateTo.seconds;
    let start = this.state.dateFrom.seconds;
    const arrayTimeConverted = doc;
    const customArray = [];
    arrayTimeConverted.map((item, i) => {
      const dateItem = arrayTimeConverted[i]["date"];
      // console.log(dateItem);
      if (dateItem.seconds >= start && dateItem.seconds <= end) {
        customArray.push(arrayTimeConverted[i]);
      }
    });
    return customArray;
  }

  sortedArr(arr) {
    let sortedArr = arr.sort((a, b) => {
      if (dateFormat(a.date.seconds) == dateFormat(b.date.seconds)) {
        return b.time.seconds - a.time.seconds;
      } else {
        return b.date.seconds - a.date.seconds;
      }
    });
    return sortedArr;
  }

  generatePhotoAttached(doc) {
    return (
      <View>
        <TouchableOpacity>
          <Text
            onPress={() => {
              Linking.openURL(doc.photoURL);
            }}
            style={{ marginTop: 5, fontWeight: "300", fontSize: 14 }}
          >
            Click here to view
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  generateExpensesIncome = (doc) => {
    return (
      <View key={doc.key} style={styles.row}>
        <View style={styles.dateRow}>
          <Icon.Button
            name={this.state.budget == "Expense" ? "arrowright" : "arrowleft"}
            size={20}
            color={
              this.state.budget == "Expense" ? colours.tomato : colours.green
            }
            backgroundColor={"transparent"}
            iconStyle={{ marginLeft: 5, marginRight: 0 }}
          />
          <Header
            text={`${dateFormat(doc.date.seconds)}`}
            style={{ fontWeight: "bold", marginTop: 12 }}
          />

          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={[styles.timeText, { alignSelf: "flex-end", marginTop: 8 }]}
            >
              {timeFormat(doc.time.seconds)}
            </Text>
          </View>
        </View>
        <GreyLine />

        <View style={styles.categoryRow}>
          <Header
            text={categoryFormat(doc.category)}
            style={styles.expenseCategory}
          />

          <Text style={styles.valueText}>{`$${doc.value}`}</Text>
        </View>

        {doc.notes ? (
          <View style={styles.notesRow}>
            <Text style={styles.noteText}>{doc.notes}</Text>
          </View>
        ) : (
          <View style={{ marginBottom: 5 }} />
        )}
        <GreyLine />
        <View style={styles.dateRow}>
          <Image
            source={require("../../assets/addphoto.png")}
            style={styles.image}
          />
          {doc.photoURL != "" ? (
            this.generatePhotoAttached(doc)
          ) : (
            <Text style={{ marginTop: 5, fontWeight: "300", fontSize: 14 }}>
              No photo attached
            </Text>
          )}
        </View>
        <View style={[styles.dateRow, { marginBottom: 5 }]}>
          <Image
            source={require("../../assets/location.png")}
            style={styles.image}
          />
          {doc.address != "" ? (
            <Text style={{ marginTop: 8, fontSize: 14, color: colours.black }}>
              {doc.address}
            </Text>
          ) : (
            <Text style={{ marginTop: 8, fontWeight: "300", fontSize: 14 }}>
              No location
            </Text>
          )}
        </View>
      </View>
    );
  };

  whichExpense() {
    if (this.state.timeUserWants === "This Month") {
      return getMonthlyData(this.state.expenseArr);
    } else if (this.state.timeUserWants == "Today") {
      return getDailyData(this.state.expenseArr);
    } else if (this.state.timeUserWants == "This Year") {
      return getYearlyData(this.state.expenseArr);
    } else {
      return this.getCustomData(this.state.expenseArr);
    }
  }

  whichIncome() {
    if (this.state.timeUserWants === "This Month") {
      return getMonthlyData(this.state.incomeArr);
    } else if (this.state.timeUserWants == "Today") {
      return getDailyData(this.state.incomeArr);
    } else if (this.state.timeUserWants == "This Year") {
      return getYearlyData(this.state.incomeArr);
    } else {
      return this.getCustomData(this.state.incomeArr);
    }
  }

  whatBudget() {
    if (this.state.budget == "Expense" && this.state.expenseArr.length !== 0) {
      const whichEx = this.whichExpense();
      if (whichEx.length == 0) {
        return this.noRecordsFound();
      }
      return this.sortedArr(this.whichExpense()).map((doc) =>
        this.generateExpensesIncome(doc)
      );
    } else if (
      this.state.budget == "Income" &&
      this.state.incomeArr.length !== 0
    ) {
      const whichIn = this.whichIncome();
      if (whichIn.length == 0) {
        return this.noRecordsFound();
      }
      return this.sortedArr(this.whichIncome()).map((doc) =>
        this.generateExpensesIncome(doc)
      );
    } else {
      return renderNoRecords();
    }
  }

  noRecordsFound = () => {
    return (
      <Text style={{ alignSelf: "center", marginTop: 20 }}>
        No Records Found
      </Text>
    );
  };

  budgetButtons = () => {
    return (
      <View style={styles.tabContainer}>
        <BlackButton
          text={"Expenses"}
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.transactionTitle}>
            <Icon.Button
              name="profile"
              size={30}
              color={colours.black}
              backgroundColor={"transparent"}
              iconStyle={{ alignSelf: "center" }}
            />
            <Title
              style={styles.transactionText}
              text={"Transaction History"}
            />
          </View>
          {this.budgetButtons()}
          {this.whatBudget()}
        </ScrollView>
      </View>
    );
  }
}

export function getMonthlyData(doc) {
  const currMonth = new Date().getTime() / 1000;
  const currYear = new Date().getFullYear().toString();
  const arrayTimeConverted = doc;
  const monthlyArray = [];
  arrayTimeConverted.map((item, i) => {
    const dateItem = arrayTimeConverted[i]["date"];
    if (
      dateFormat(dateItem.seconds).slice(-8, -5) ==
        dateFormat(currMonth).slice(-8, -5) &&
      dateFormat(dateItem.seconds).slice(-4) == currYear
    ) {
      monthlyArray.push(arrayTimeConverted[i]);
    }
  });
  return monthlyArray;
}

export function getDailyData(doc) {
  const currDate = new Date().getTime() / 1000;
  const arrayTimeConverted = doc;
  const dailyArray = [];
  arrayTimeConverted.map((item, i) => {
    const dateItem = arrayTimeConverted[i]["date"];
    if (dateFormat(dateItem.seconds) == dateFormat(currDate)) {
      dailyArray.push(arrayTimeConverted[i]);
    }
  });
  return dailyArray;
}

export function getYearlyData(doc) {
  const currYear = new Date().getFullYear().toString();
  const arrayTimeConverted = doc;
  const yearlyArray = [];
  arrayTimeConverted.map((item, i) => {
    const dateItem = arrayTimeConverted[i]["date"];
    if (dateFormat(dateItem.seconds).slice(-4) == currYear) {
      yearlyArray.push(arrayTimeConverted[i]);
    }
  });
  return yearlyArray;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    marginHorizontal: 20,
    backgroundColor: colours.white,
  },
  transactionTitle: {
    marginTop: 20,
    flexDirection: "row",
    // borderWidth: 4,
    justifyContent: "center",
  },
  transactionText: {
    marginTop: 15,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseButton: {
    backgroundColor: "#ffb8ac",
    flexGrow: 0.5,
  },
  incomeButton: {
    backgroundColor: colours.green,
    flexGrow: 0.5,
  },
  row: {
    backgroundColor: colours.beige,
    borderWidth: 2,
    borderColor: colours.lightBrown,
    marginTop: 15,
    borderRadius: 10,
  },
  dateRow: {
    flexDirection: "row",
    marginBottom: 0,
  },
  categoryRow: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },
  notesRow: {
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "space-between",
  },
  expenseCategory: { marginLeft: 10, marginTop: 1 },
  valueText: {
    marginRight: 10,
    marginTop: 1,
    color: colours.black,
    textAlign: "right",
  },
  noteText: {
    fontWeight: "200",
    marginLeft: 10,
    marginBottom: 10,
  },
  timeText: {
    fontWeight: "200",
    marginRight: 10,
    marginBottom: 10,
  },
  image: {
    width: 20,
    height: 20,
    margin: 5,
    marginLeft: 20,
    overflow: "visible",
    resizeMode: "contain",
  },
  logo: {
    paddingLeft: 310,
    margin: 5,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ReportsPageTable;
