import React from "react";
import { StyleSheet, ScrollView, View, Text } from "react-native";
import { Header, Title } from "../../config/reusableText";
import colours from "../../config/colours";
import Icon from "react-native-vector-icons/AntDesign";
import { auth, db } from "../../config/firebase";
import { BlackButton } from "../../config/reusableButton";
import { GreyLine } from "../../config/reusablePart";
import { dateFormat, categoryFormat, timeFormat } from "../Home/HomePage";
import { renderNoRecords } from "../Home/HomePage";

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
    console.log("photo", doc.photoURL);
    return (
      <View>
        <Text>{doc.photoURL}</Text>
        <Image
          source={{ uri: doc.photoURL }}
          style={{ width: 200, height: 200 }}
        />
        <TouchableOpacity onPress={() => this.toggleModal()}>
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={{ uri: doc.photoURL }}
          />
        </TouchableOpacity>

        <View style={styles.modalView}>
          <Modal visible={this.state.showModal} animated>
            <View style={styles.modalView}>
              <View style={styles.modal}>
                <TouchableOpacity onPress={() => this.toggleModal()}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={30}
                    color="black"
                    style={styles.logo}
                  />
                </TouchableOpacity>

                <Image
                  style={{
                    resizeMode: "contain",
                    width: 350,
                    height: 350,
                  }}
                  source={{ uri: doc.photoURL }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </View>
    );
  }

  generatePhotoAttached(doc) {
    console.log("photo", doc.photoURL);
    return (
      <View>
        <Text>{doc.photoURL}</Text>
        <Image
          source={{ uri: doc.photoURL }}
          style={{ width: 200, height: 200 }}
        />
        <TouchableOpacity onPress={() => this.toggleModal()}>
          <Image
            style={{
              width: 50,
              height: 50,
            }}
            source={{ uri: doc.photoURL }}
          />
        </TouchableOpacity>

        <View style={styles.modalView}>
          <Modal visible={this.state.showModal} animated>
            <View style={styles.modalView}>
              <View style={styles.modal}>
                <TouchableOpacity onPress={() => this.toggleModal()}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={30}
                    color="black"
                    style={styles.logo}
                  />
                </TouchableOpacity>

                <Image
                  style={{
                    resizeMode: "contain",
                    width: 350,
                    height: 350,
                  }}
                  source={{ uri: doc.photoURL }}
                />
              </View>
            </View>
          </Modal>
        </View>
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
        </View>
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

        <GreyLine />
        <View style={styles.dateRow}>
          <Image
            source={require("../../assets/addphoto.png")}
            style={styles.image}
          />
          {doc.photoURL != "" ? (
            this.generatePhotoAttached(doc)
          ) : (
            <Text style={{ marginTop: 8, fontWeight: "200", fontSize: 14 }}>
              No photo attached
            </Text>
          )}
        </View>
        <View style={styles.dateRow}>
          <Image
            source={require("../../assets/location.png")}
            style={styles.image}
          />
          {doc.address != "" ? (
            <Text style={{ marginTop: 8, fontSize: 14, color: colours.black }}>
              {doc.address}
            </Text>
          ) : (
            <Text style={{ marginTop: 8, fontWeight: "200", fontSize: 14 }}>
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
