import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colours from "../../config/colours";
import { auth, db } from "../../config/firebase";

class ReportsPage extends React.Component {
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
      budgetValue: 0.0,
      expenseArr: [],
      incomeArr: [],
    };
  }

  componentDidMount() {
    this.unsubscribeExpenseRef = this.ExpenseRef.onSnapshot(
      this.getCollectionExpense
    );
    this.unsubscribeIncomeRef = this.IncomeRef.onSnapshot(
      this.getCollectionIncome
    );
    this.callBudgetValue();
  }

  callBudgetValue() {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const { budgetValue } = doc.data();
        this.setState({ budgetValue: budgetValue });
      });
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

  addExpensesIncomeAllTime(exIn) {
    let sum = 0;
    exIn.map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2); //255.78
  }

  getOverallBalance() {
    const diff =
      this.addExpensesIncomeAllTime(this.state.incomeArr) -
      this.addExpensesIncomeAllTime(this.state.expenseArr);
    return diff.toFixed(2);
  }

  render() {
    const { navigation } = this.props;

    return (
      <KeyboardAwareScrollView>
        <View style={styles.reportBlocks}>
          <Text style={styles.reportTitle}>OVERALL BALANCE/ TOTAL SAVINGS</Text>
          <Text
            style={styles.reportInText}
          >{`$${this.getOverallBalance()}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.reportBlocks}
          onPress={() => navigation.navigate("Pie Chart View")}
        >
          <Text style={styles.reportTitle}>TOTAL SPENDING</Text>
          <Text style={styles.reportInText}>{`$${this.addExpensesIncomeAllTime(
            this.state.expenseArr
          )}`}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  reportBlocks: {
    backgroundColor: colours.lightBrown,
    borderRadius: 20,
    marginTop: 20,
    height: 100,
    width: 400,
    borderWidth: 0,
    alignSelf: "center",
  },
  reportTitle: {
    color: "#6C757D",
    fontSize: 15,
    marginTop: 20,
    marginLeft: 20,
  },
  reportInText: {
    color: "#000",
    marginTop: 10,
    marginLeft: 20,
    fontSize: 20,
  },
});

export default ReportsPage;