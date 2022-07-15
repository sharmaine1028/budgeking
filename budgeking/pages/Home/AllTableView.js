import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Header, Title } from "../../config/reusableText";
import colours from "../../config/colours";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../../config/firebase";
import { BlackButton } from "../../config/reusableButton";
import { GreyLine } from "../../config/reusablePart";

class AllTableView extends React.Component {
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
    };
  }

  componentDidMount() {
    this.unsubscribeExpenseRef = this.ExpenseRef.onSnapshot(
      this.getCollectionExpense
    );
    this.unsubscribeIncomeRef = this.IncomeRef.onSnapshot(
      this.getCollectionIncome
    );
  }

  componentWillUnmount() {
    this.unsubscribeExpenseRef();
    this.unsubscribeIncomeRef();
  }

  getCollectionExpense = (querySnapshot) => {
    const expenseArrPush = [];
    querySnapshot.forEach((res) => {
      const { notes, value, category, date } = res.data();
      expenseArrPush.push({
        key: res.id,
        value,
        notes,
        category,
        date,
      });
    });
    this.setState({
      expenseArr: expenseArrPush,
    });
  };

  getCollectionIncome = (querySnapshot) => {
    const incomeArrPush = [];
    querySnapshot.forEach((res) => {
      const { category, date, notes, value } = res.data();
      incomeArrPush.push({
        key: res.id,
        value,
        category,
        notes,
        date,
      });
    });
    this.setState({
      incomeArr: incomeArrPush,
    });
  };

  // locale date string????
  dateFormat = (seconds) => {
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

  categoryFormat(category) {
    if (category == "food and drinks") {
      return "Food & Drinks";
    } else {
      return category.charAt(0).toUpperCase() + category.slice(1);
    }
  }

  // locale time string????
  timeFormat(seconds) {
    var t = new Date(seconds * 1000);
    // console.log("t", t.getHours());
    var hours = t.getHours();
    var minutes = t.getMinutes();
    var newFormat = t.getHours() > 12 ? "PM" : "AM";

    hours = hours % 12;

    hours = hours != 0 ? hours : 12;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    var formatted = hours + ":" + minutes + " " + newFormat;
    return formatted;
  }

  sortedArr(arr) {
    const sortedArr = arr.sort((a, b) => b.date.seconds - a.date.seconds);
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
            text={`${this.dateFormat(doc.date.seconds)}`}
            style={{ fontWeight: "bold", marginTop: 12 }}
          />
        </View>
        <GreyLine />

        <View style={styles.categoryRow}>
          <Header
            text={this.categoryFormat(doc.category)}
            style={styles.expenseCategory}
          />

          <Text style={styles.valueText}>{`$${doc.value}`}</Text>
        </View>

        <View style={styles.notesRow}>
          <Text style={styles.noteText}>{doc.notes}</Text>
          <Text style={styles.timeText}>
            {this.timeFormat(doc.date.seconds)}
          </Text>
        </View>
      </View>
    );
  };

  whatBudget() {
    if (this.state.budget == "Expense" && this.state.expenseArr.length !== 0) {
      return this.sortedArr(this.state.expenseArr).map((doc) =>
        this.generateExpensesIncome(doc)
      );
    } else if (
      this.state.budget == "Income" &&
      this.state.incomeArr.length !== 0
    ) {
      return this.sortedArr(this.state.incomeArr).map((doc) =>
        this.generateExpensesIncome(doc)
      );
    } else {
      return this.renderNoRecords();
    }
  }

  renderNoRecords = () => {
    return (
      <Text style={{ alignSelf: "center", marginTop: 20 }}>No Records Yet</Text>
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

export default AllTableView;
