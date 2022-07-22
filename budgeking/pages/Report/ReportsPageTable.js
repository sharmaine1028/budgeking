import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Header, Title } from "../../config/reusableText";
import colours from "../../config/colours";
import Icon from "react-native-vector-icons/AntDesign";
import { auth, db } from "../../config/firebase";
import { BlackButton } from "../../config/reusableButton";
import { GreyLine } from "../../config/reusablePart";
<<<<<<< HEAD
<<<<<<< HEAD
import { Image } from "react-native";

// dateFormat, timeFormat() to localdatestring() and localtimestring()
=======
import { dateFormat, categoryFormat, timeFormat } from "../Home/HomePage";
import { renderNoRecords } from "../Home/HomePage";
>>>>>>> origin
=======
import { dateFormat, categoryFormat, timeFormat } from "../Home/HomePage";
import { renderNoRecords } from "../Home/HomePage";
>>>>>>> origin

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
      const { notes, value, category, date, time, photoURL } = res.data();
      expenseArrPush.push({
        key: res.id,
        value,
        notes,
        category,
        date,
        time,
        photoURL,
      });
    });
    this.setState({
      expenseArr: expenseArrPush,
    });
  };

  getCollectionIncome = (querySnapshot) => {
    const incomeArrPush = [];
    querySnapshot.forEach((res) => {
      const { category, date, notes, value, time } = res.data();
      incomeArrPush.push({
        key: res.id,
        value,
        category,
        notes,
        date,
        time,
      });
    });
    this.setState({
      incomeArr: incomeArrPush,
    });
  };

  getMonthlyData(doc) {
    const currMonth = new Date().getMonth();
    const currYear = new Date().getFullYear();
    // console.log("currmonth", currMonth)
    const arrayTimeConverted = doc;
    const monthlyArray = [];
    arrayTimeConverted.map((item, i) => {
      const dateItem = arrayTimeConverted[i]["date"];
      // console.log("dateitem", dateItem)
      if (
        dateItem.toDate().getMonth() == currMonth &&
        dateItem.toDate().getFullYear() == currYear
      ) {
        monthlyArray.push(arrayTimeConverted[i]);
      }
    });
    return monthlyArray;
  }

  getDailyData(doc) {
    const currDate = new Date().toLocaleDateString();
    const arrayTimeConverted = doc;
    const dailyArray = [];
    arrayTimeConverted.map((item, i) => {
      const dateItem = arrayTimeConverted[i]["date"];
      if (dateItem.toDate().toLocaleDateString() == currDate) {
        dailyArray.push(arrayTimeConverted[i]);
      }
    });
    return dailyArray;
  }

  getYearlyData(doc) {
    const currYear = new Date().getFullYear();
    const arrayTimeConverted = doc;
    const yearlyArray = [];
    arrayTimeConverted.map((item, i) => {
      const dateItem = arrayTimeConverted[i]["date"];
      if (dateItem.toDate().getFullYear() == currYear) {
        yearlyArray.push(arrayTimeConverted[i]);
      }
    });
    return yearlyArray;
  }

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
        </View>
        <Image
          source={{ uri: doc.photoURL }}
          style={{ width: 200, height: 200 }}
        />
        {/* <Text>{doc.photoURL}</Text> */}
        <GreyLine />

        <View style={styles.categoryRow}>
          <Header
            text={categoryFormat(doc.category)}
            style={styles.expenseCategory}
          />

          <Text style={styles.valueText}>{`$${doc.value}`}</Text>
        </View>

        <View style={styles.notesRow}>
          <Text style={styles.noteText}>{doc.notes}</Text>
          <Text style={styles.timeText}>{timeFormat(doc.time.seconds)}</Text>
        </View>
      </View>
    );
  };

  whichExpense() {
    if (this.state.timeUserWants === "This Month") {
      return this.getMonthlyData(this.state.expenseArr);
    } else if (this.state.timeUserWants == "Today") {
      return this.getDailyData(this.state.expenseArr);
    } else if (this.state.timeUserWants == "This Year") {
      return this.getYearlyData(this.state.expenseArr);
    } else {
      return this.getCustomData(this.state.expenseArr);
    }
  }

  whichIncome() {
    if (this.state.timeUserWants === "This Month") {
      return this.getMonthlyData(this.state.incomeArr);
    } else if (this.state.timeUserWants == "Today") {
      return this.getDailyData(this.state.incomeArr);
    } else if (this.state.timeUserWants == "This Year") {
      return this.getYearlyData(this.state.incomeArr);
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
});

export default ReportsPageTable;
