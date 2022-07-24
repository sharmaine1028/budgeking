import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Header, Title } from "../../components/reusableText";
import colours from "../../styles/colours";
import Icon from "react-native-vector-icons/AntDesign";
import { auth, db } from "../../config/firebase";
import { BlackButton } from "../../components/reusableButton";
import { GreyLine } from "../../components/reusablePart";
import { dateFormat, categoryFormat, timeFormat } from "../Home/HomePage";
import { renderNoRecords } from "../Home/HomePage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
      showModal: false,
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

  toggleModalTrue() {
    this.setState({ showModal: true });
  }

  toggleModalFalse() {
    this.setState({ showModal: false });
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
      return renderNoRecords();
    }
  }

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
    marginTop: 10,
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
    fontWeight: "300",
    marginLeft: 10,
    marginBottom: 10,
  },
  timeText: {
    fontWeight: "300",
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

export default AllTableView;
