import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import colours from "../config/colours";
import { auth, db } from "../config/firebase";

class ReportsPage extends React.Component {
  constructor() {
    super();
    this.fireStoreRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("expense");
    this.state = {
      budgetValue: 0.0,
      expenseArr: [],
    };
  }

  componentDidMount() {
    this.unsubscribe = this.fireStoreRef.onSnapshot(this.getCollection);
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
    this.unsubscribe();
  }

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

  addExpensesAllTime() {
    let sum = 0;
    this.state.expenseArr.map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2); //255.78
  }

  render() {
    const { navigation } = this.props;

    return (
      <KeyboardAwareScrollView>
        {/* change to OVERALL BALANCE (total savings = total budget value - total spending) */}
        {/* <View style={styles.reportBlocks}>
          <Text style={styles.reportTitle}>OVERALL BALANCE</Text>
          <Text
            style={styles.reportInText}
          >{`$${this.state.budgetValue}`}</Text>
        </View> */}
        <TouchableOpacity
          style={styles.reportBlocks}
          onPress={() => navigation.navigate("Pie Chart View")}
        >
          <Text style={styles.reportTitle}>TOTAL SPENDING</Text>
          <Text
            style={styles.reportInText}
          >{`$${this.addExpensesAllTime()}`}</Text>
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
