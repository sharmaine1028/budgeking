import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  Animated,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import colours from "../../styles/colours";
import { auth, db } from "../../config/firebase";
import RedLine from "../../components/reusablePart";
import { Header, Title } from "../../components/reusableText";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { PieChart } from "react-native-gifted-charts";
import CurrencyInput from "react-native-currency-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { GreyLine } from "../../components/reusablePart";
import { BlackButton } from "../../components/reusableButton";
import { Divider } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getMonthlyData, getDailyData } from "../Report/ReportsPageTable";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

class HomePage extends React.Component {
  constructor() {
    super();
    this.fireStoreRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("expense");
    this.fireStoreRefIncome = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("income");
    this.activeGoalsRef = db.collection("active goals");
    this.activeGoalsOri = this.activeGoalsRef.where(
      "createdBy",
      "==",
      auth.currentUser.uid
    );
    this.activeGoalsShared = this.activeGoalsRef.where(
      "sharingEmails",
      "array-contains",
      auth.currentUser.email
    );
    this.state = {
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
      timePeriod: ["Your monthly budget", "Your daily budget"],
      timeUserWants: "monthly",
      budgetEditable: false,
      budgetValue: 0.0,
      budgetValueDaily: 0.0,
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
      showBudgetValueModal: false,
      offTrackGoals: [],
      tempBudgetValue: 0.0,
      showMore: false,
      incomeArr: [],
    };
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  // calling budgetValue from firestore
  componentDidMount() {
    this.unsubscribe = this.fireStoreRef.onSnapshot(this.getCollection);
    this.unsubscribeIncome = this.fireStoreRefIncome.onSnapshot(
      this.getCollectionIncome
    );
    this.unsubscribeActiveGoalsOri = this.activeGoalsOri.onSnapshot(
      this.getOffTrackGoals
    );
    this.unsubscribeActiveGoalsShared = this.activeGoalsShared.onSnapshot(
      this.getOffTrackGoals
    );
    this.callBudgetValue();
  }

  callBudgetValue() {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        const { budgetValue, budgetValueDaily } = doc.data();
        this.setState({
          budgetValue: budgetValue,
          budgetValueDaily: budgetValueDaily,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.unsubscribeIncome();
    this.unsubscribeActiveGoalsOri();
    this.unsubscribeActiveGoalsShared();
  }

  getCollection = (querySnapshot) => {
    const expenseArrPush = [];
    querySnapshot.forEach((res) => {
      const { notes, value, category, date, time, budget } = res.data();
      expenseArrPush.push({
        key: res.id,
        notes,
        value,
        category,
        date,
        time,
        budget,
      });
    });
    this.setState({
      expenseArr: expenseArrPush,
      isLoading: false,
    });
    // console.log("pie", this.addExpensesDaily() == 0);
    // console.log("piepushed =>", this.updatePieData())
    // console.log(auth.currentUser.displayName)
    // console.log(new Date().toLocaleDateString())
    // console.log(this.state.expenseArr);
    // console.log(new Date().toLocaleDateString('en-us', {  weekday: 'short' }))
    // console.log(auth.currentUser.uid)
  };

  getCollectionIncome = (querySnapshot) => {
    const incomeArrPush = [];
    querySnapshot.forEach((res) => {
      const { category, date, notes, value, time, budget } = res.data();
      incomeArrPush.push({
        key: res.id,
        value,
        category,
        notes,
        date,
        time,
        budget,
      });
    });
    this.setState({
      incomeArr: incomeArrPush,
    });
  };

  //input budgetvalue to firestore
  inputBudgetFireStore = () => {
    // console.log(this.state.budgetValue)
    db.collection("users").doc(auth.currentUser.uid).update({
      budgetValue: this.state.budgetValue,
    });
  };

  inputBudgetDailyFireStore = () => {
    // console.log(this.state.budgetValue)
    db.collection("users").doc(auth.currentUser.uid).update({
      budgetValueDaily: this.state.budgetValueDaily,
    });
  };

  // Scroll from top to refresh changes
  // const [refreshing, setRefreshing] = React.useState(false);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   setDisplayName(auth.currentUser.displayName);
  //   wait(500).then(() => setRefreshing(false));
  // }, []);

  addExpenses() {
    if (this.state.timeUserWants === "monthly") {
      return this.addExpensesMonthly();
    } else {
      return this.addExpensesDaily();
    }
  }

  addExpensesMonthly() {
    let sum = 0;
    getMonthlyData(this.state.expenseArr).map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2); //255.78
  }

  addExpensesDaily() {
    let sum = 0;
    getDailyData(this.state.expenseArr).map((item, i) => {
      sum += item.value;
    });
    return sum.toFixed(2); //12
  }

  percentExpenseOutOfBudget() {
    if (this.addExpenses() == 0.0) {
      return 0;
    } else if (this.whichBudgetValue() <= this.addExpenses()) {
      return 100;
    }
    return (this.addExpenses() / this.whichBudgetValue()) * 100;
  }

  percentProfilePicture() {
    if (this.addExpenses() == 0.0) {
      return 0;
    } else if (this.whichBudgetValue() <= this.addExpenses()) {
      return 90;
    }
    return this.percentExpenseOutOfBudget() * 0.8;
  }

  textBesideWalking() {
    var leftExceeded = "";
    if (this.whichBudgetValue() < this.addExpenses()) {
      leftExceeded += "Exceeded";
    } else {
      leftExceeded += "Left";
    }
    return leftExceeded;
  }

  updatePieData() {
    if (this.state.timeUserWants === "monthly") {
      return this.updatePieDataMonthly();
    } else {
      return this.updatePieDataDaily();
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
    getMonthlyData(this.state.expenseArr).map((item, i) => {
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
    getDailyData(this.state.expenseArr).map((item, i) => {
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
      pieData[i]["text"] += pieData[i]["value"].toFixed(2);
    });
    return pieData;
  }

  putExpenseBesideLegend(category) {
    const pieText = this.putInTextToPie();
    var text = "";
    pieText.map((item, i) => {
      if (category == pieText[i]["category"]) {
        text += categoryFormat(category);
        text += ", ";
        text += pieText[i]["text"];
        return text;
      }
    });
    return text;
  }

  toggleMonthlyDaily = (val) => {
    if (val === 0) {
      this.setState({ timeUserWants: "monthly" });
    } else {
      this.setState({ timeUserWants: "daily" });
    }
  };

  textBesideCategories() {
    var dayText = "";
    if (this.state.timeUserWants == "monthly") {
      dayText += this.state.monthNames[new Date().getMonth()];
    } else {
      dayText += new Date().toLocaleDateString();
    }
    return dayText;
  }

  leftAmount() {
    const diff = this.whichBudgetValue() - this.addExpenses();
    return diff.toFixed(2);
  }

  whichBudgetValue() {
    if (this.state.timeUserWants == "monthly") {
      return this.state.budgetValue;
    } else {
      return this.state.budgetValueDaily;
    }
  }

  combineTwoArr(expense, income) {
    const combinedArr = [];
    expense.map((item, i) => combinedArr.push(item));
    income.map((item, i) => combinedArr.push(item));
    return combinedArr;
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

  show3Expenses(arr) {
    var show3Ex = [];
    const sortedEx = this.sortedArr(arr);
    if (arr.length <= 3) {
      for (let i = 0; i < arr.length; i++) {
        show3Ex.push(sortedEx[i]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        show3Ex.push(sortedEx[i]);
      }
    }
    return show3Ex;
  }

  maybePieChart() {
    const dummyPieData = [{ value: 100, color: colours.pieGrey }];
    return (
      <PieChart
        data={dummyPieData}
        donut
        innerRadius={Dimensions.get("window").width * 0.2}
        radius={Dimensions.get("window").width * 0.4}
        centerLabelComponent={() => {
          return (
            <Text
              style={styles.totalSpentText}
            >{`Total Spent\n$${this.addExpenses()}`}</Text>
          );
        }}
      />
    );
  }

  definitelyPieChart() {
    return (
      <PieChart
        style={styles.pie}
        donut
        innerRadius={Dimensions.get("window").width * 0.2}
        // showText
        textColor="black"
        radius={Dimensions.get("window").width * 0.4}
        textSize={15}
        // showTextBackground
        // textBackgroundRadius = {26}
        data={this.putInTextToPie()}
        // focusOnPress={true}
        // toggleFocusOnPress={true}
        centerLabelComponent={() => {
          return (
            <Text
              style={styles.totalSpentText}
            >{`Total Spent\n$${this.addExpenses()}`}</Text>
          );
        }}
      />
    );
  }

  checkEmptyPieData() {
    if (this.state.timeUserWants === "monthly") {
      return getMonthlyData(this.state.expenseArr).length != 0;
    } else {
      return getDailyData(this.state.expenseArr).length != 0;
    }
  }

  editBudgetValue = () => {
    this.setState({ showBudgetValueModal: true });
  };

  updateBudgetVal(val) {
    if (this.state.timeUserWants == "monthly") {
      return this.updateInputVal(Math.abs(val), "budgetValue");
    } else {
      return this.updateInputVal(Math.abs(val), "budgetValueDaily");
    }
  }

  changeBudgetValue() {
    this.updateBudgetVal(this.state.tempBudgetValue);
    this.updateInputVal(0.0, "tempBudgetValue");
    this.inputBudgetFireStore();
    this.inputBudgetDailyFireStore();
    this.setState({ showBudgetValueModal: false });
  }

  notChangeBudgetValue() {
    this.updateInputVal(0.0, "tempBudgetValue");
    this.setState({ showBudgetValueModal: false });
  }

  maybeLegend() {
    return <View></View>;
  }

  emptyPhotoURL() {
    if (this.state.photoURL == null) {
      return (
        <Image
          style={{
            width: 30,
            height: 30,
            left: `${this.percentProfilePicture()}%`,
            borderRadius: 9999,
            justifyContent: "flex-end",
            backgroundColor: colours.white,
          }}
          source={require("../../assets/loginsignup/profile.png")}
        />
      );
    } else {
      return (
        <Image
          style={{
            width: 30,
            height: 30,
            left: `${this.percentProfilePicture()}%`,
            borderRadius: 9999,
            justifyContent: "flex-end",
            backgroundColor: colours.white,
          }}
          source={{ uri: this.state.photoURL }}
        />
      );
    }
  }

  getOffTrackGoals = (querySnapshot) => {
    try {
      querySnapshot.forEach((doc) => {
        if (this.isOffTrack(doc.data())) {
          const newState = this.state.offTrackGoals.filter(
            (item) => item.id !== doc.id
          );
          this.setState({
            offTrackGoals: [...newState, { ...doc.data(), id: doc.id }],
          });
        } else {
          const newState = this.state.offTrackGoals.filter(
            (item) => item.id !== doc.id
          );
          this.setState({ offTrackGoals: [...newState] });
        }
      });
    } catch {
      (err) => console.log(err);
    }
  };

  isOffTrack = (doc) => {
    try {
      const today = new Date();
      const deadline = new Date(doc.deadline.seconds * 1000);
      const dateCreated = new Date(doc.dateCreated.seconds * 1000);

      if (deadline < today) {
        return true;
      }

      // Get supposed amount based on frequency
      const years = today.getFullYear() - dateCreated.getFullYear();
      let supposedAmt;
      if (doc.frequency === "Yearly") {
        supposedAmt = doc.freqAmount * years;
      } else if (doc.frequency === "Monthly") {
        const months =
          years * 12 + today.getMonth() - dateCreated.getMonth() <= 0
            ? 0
            : years * 12 + today.getMonth() - dateCreated.getMonth();
        supposedAmt = doc.freqAmount * months;
      } else if (doc.frequency === "Weekly") {
        const msInWeek = 1000 * 60 * 60 * 24 * 7;
        const weeks = Math.round(Math.abs(today - dateCreated) / msInWeek);
        supposedAmt = doc.freqAmount * weeks;
      } else {
        const msInDay = 1000 * 3600 * 24;
        const days = Math.round(Math.abs(today - dateCreated) / msInDay);
        supposedAmt = doc.freqAmount * days;
      }

      // Compare supposed amount with curramount
      if (doc.currSavingsAmt < supposedAmt) {
        return true;
      } else {
        return false;
      }
    } catch {
      (err) => console.log(err);
    }
  };

  render() {
    const { navigation } = this.props;

    const legendArr = [
      [this.putExpenseBesideLegend("food and drinks"), "#177AD5"],
      [this.putExpenseBesideLegend("transportation"), "#79D2DE"],
      [this.putExpenseBesideLegend("housing"), "#F7D8B5"],
      [this.putExpenseBesideLegend("shopping"), "#8F80E4"],
      [this.putExpenseBesideLegend("health"), "#FB8875"],
      [this.putExpenseBesideLegend("education"), "#FDE74C"],
      [this.putExpenseBesideLegend("others"), "#E8E0CE"],
    ];

    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }

    return (
      <KeyboardAwareScrollView>
        {this.state.showBudgetValueModal && (
          <View style={styles.modalView}>
            <Modal
              transparent={true}
              visible={this.state.showBudgetValueModal}
              onRequestClose={() =>
                this.setState({ showBudgetValueModal: forModalPresentationIOS })
              }
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPressOut={() => this.notChangeBudgetValue()}
              >
                <View style={styles.modalView}>
                  <View style={styles.modal}>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 10,
                        fontWeight: "500",
                      }}
                    >
                      Change {this.state.timeUserWants} allowable budget {"\n"}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        marginBottom: 10,
                        textAlign: "center",
                      }}
                    >
                      Please enter the new value for your{"\n"}
                      {this.state.timeUserWants} allowable budget below. {"\n"}
                    </Text>

                    <CurrencyInput
                      style={styles.whiteInput}
                      keyboardType="numeric"
                      value={this.state.tempBudgetValue}
                      prefix="$"
                      unit="$"
                      delimiter=","
                      separator="."
                      precision={2}
                      minValue={0}
                      onChangeValue={(val) =>
                        this.updateInputVal(Math.abs(val), "tempBudgetValue")
                      }
                      maxValue={9999999999999}
                    />
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => this.changeBudgetValue()}
                    >
                      <Text>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}

        <View style={styles.container}>
          {/* <Text>{this.addExpenses()}</Text>
          <Text>{this.percentExpenseOutOfBudget()}</Text> */}
          {/* <ScrollView
          refreshControl = {
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        > */}
          <Title text={`Welcome, ${this.state.name}!`}></Title>
          <View style={styles.weeklyBudgetTab}>
            {/* <Header text={`${"\n"}Your weekly budget`} style={styles.changeLineHeightWeeklyBudget} /> */}
            <SelectDropdown
              data={this.state.timePeriod}
              onSelect={(selectedItem, index) => {
                return this.toggleMonthlyDaily(index);
              }}
              defaultButtonText={"Your monthly budget"}
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
          <RedLine />

          {this.addExpenses() <= this.whichBudgetValue() ? (
            this.emptyPhotoURL()
          ) : (
            <Image
              style={{
                width: 40,
                height: 30,
                left: `${this.percentProfilePicture()}%`,
                // borderRadius: 9999,
                justifyContent: "flex-end",
                backgroundColor: colours.white,
              }}
              source={require("../../assets/home/rip.png")}
            />
          )}

          <View style={styles.progressArea}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: `${
                      this.addExpenses() <= this.whichBudgetValue()
                        ? "#96D3FF"
                        : colours.tomato
                    }`,
                    width: `${this.percentExpenseOutOfBudget()}%`,
                    borderRadius: 5,
                  },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.raisedEffect}
              onPress={() => this.editBudgetValue()}
            >
              <Text> ${this.whichBudgetValue()} </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => this.editBudgetValue()}>
              <Image
                style={styles.logo}
                source={require("../../assets/edit.jpg")}
                resizeMethod={"resize"}
              />
            </TouchableOpacity> */}
          </View>

          <Text
            style={styles.leftText}
          >{`${this.textBesideWalking()}: $${this.leftAmount()}`}</Text>

          <View style={styles.reportPieChart}>
            <Header
              style={{ fontWeight: "500" }}
              text={`${"\n"} Categories (${this.textBesideCategories()} ${categoryFormat(
                this.state.timeUserWants
              )} Expenses)\n\n`}
            />
            {this.checkEmptyPieData()
              ? this.definitelyPieChart()
              : this.maybePieChart()}
            <View
              style={{
                width: "100%",
                // justifyContent: "space-evenly",
                // marginTop: 20,
                marginHorizontal: 10,
                marginBottom: 10,
              }}
            >
              {this.checkEmptyPieData() ? (
                this.state.showMore ? (
                  <TouchableOpacity
                    onPress={() => this.setState({ showMore: false })}
                    style={{ alignSelf: "flex-end", paddingRight: 20 }}
                  >
                    <MaterialCommunityIcons
                      name="chevron-up"
                      size={30}
                      color={colours.darkgrey}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => this.setState({ showMore: true })}
                    style={{ alignSelf: "flex-end", paddingRight: 20 }}
                  >
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={30}
                      color={colours.darkgrey}
                    />
                  </TouchableOpacity>
                )
              ) : null}

              {this.state.showMore && this.checkEmptyPieData()
                ? legendArr.map((legend) => renderLegend(legend[0], legend[1]))
                : this.maybeLegend()}
            </View>
          </View>

          {this.state.offTrackGoals.length === 0 ? null : (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Goal")}
            >
              <View style={styles.notifContainer}>
                <Text style={{ color: colours.darkgrey }}>Notifications</Text>
                <Divider
                  orientation="horizontal"
                  color={colours.darkgrey}
                  width={0.5}
                  style={{ marginVertical: 3 }}
                />
                {this.state.offTrackGoals.map((item) => (
                  <View key={item.id}>
                    <View style={{ padding: 10 }}>
                      <Text>Attention! Goal</Text>
                      <Text style={{ color: colours.darkgrey }}>
                        You went off track for a goal: Save for{" "}
                        {item.goalDescription}
                      </Text>
                      <Divider
                        orientation="horizontal"
                        color={colours.darkgrey}
                        width={0.5}
                        style={{ marginVertical: 3 }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.lastRecordTitle}>
            <Header style={styles.lastRecordText} text={"Last records"} />
            <RedLine />
            {this.combineTwoArr(this.state.expenseArr, this.state.incomeArr)
              .length !== 0
              ? this.show3Expenses(
                  this.combineTwoArr(
                    this.state.expenseArr,
                    this.state.incomeArr
                  )
                ).map((doc) => generate3ExpensesLR(doc))
              : renderNoRecords()}
            <BlackButton
              text={"Show more"}
              style={{ flexGrow: 0.5, marginTop: 10, marginBottom: 10 }}
              onPress={() => navigation.navigate("All Table View")}
            />
          </View>
          {/* </ScrollView> */}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

// export to test
export const dateFormat = (seconds) => {
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

// export to test
export function categoryFormat(category) {
  if (category == "food and drinks") {
    return "Food & Drinks";
  } else {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

// export to test
export function timeFormat(seconds) {
  var t = new Date(seconds * 1000);
  var hours = t.getHours();
  var minutes = t.getMinutes();
  var newFormat = t.getHours() >= 12 ? "PM" : "AM";

  hours = hours % 12;

  hours = hours != 0 ? hours : 12;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  var formatted = hours + ":" + minutes + " " + newFormat;
  return formatted;
}

export const renderNoRecords = () => {
  return (
    <Text style={{ alignSelf: "center", marginTop: 20 }}>No Records Yet</Text>
  );
};

export const generate3ExpensesLR = (doc) => {
  return (
    <View key={doc.key} style={styles.row}>
      <View style={styles.dateRow}>
        {doc.budget == "Expense" ? (
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color={colours.tomato}
            backgroundColor={"transparent"}
            style={{ marginLeft: 5, marginRight: 5, marginTop: 7 }}
          />
        ) : (
          <MaterialCommunityIcons
            name="arrow-left"
            size={20}
            color={colours.green}
            backgroundColor={"transparent"}
            style={{ marginLeft: 5, marginRight: 5, marginTop: 7 }}
          />
        )}

        <Header
          text={`${doc.date.seconds ? dateFormat(doc.date.seconds) : ""}`}
          style={{ fontWeight: "bold", marginTop: 12 }}
        />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={[styles.timeText, { alignSelf: "flex-end", marginTop: 12 }]}
          >
            {timeFormat(doc.time.seconds)}
          </Text>
        </View>
      </View>

      <View style={styles.categoryRow}>
        <Header
          text={categoryFormat(doc.category)}
          style={styles.expenseCategory}
        />

        <Text style={styles.valueText}>{`$${doc.value}`}</Text>
      </View>

      <View style={styles.notesRow}>
        <Text style={styles.noteText}>{doc.notes}</Text>
      </View>
      <GreyLine />
    </View>
  );
};

export const renderLegend = (text, color) => {
  return (
    <View key={text} style={{ flexDirection: "row", marginBottom: 12 }}>
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

// const win = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    marginHorizontal: 20,
    backgroundColor: colours.white,
  },
  weeklyBudgetTab: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
  },
  leftText: {
    // marginVertical: 10,
    // marginTop: 20,
    color: "#000",
    fontWeight: "300",
  },
  totalSpentText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "300",
  },
  notifContainer: {
    marginTop: 20,
    backgroundColor: colours.lightBrown,
    borderRadius: 10,
    padding: 10,
  },
  dropdownStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "EFEFEF",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colours.red,
  },
  dropdownTxtStyle: {
    color: "#444",
    textAlign: "left",
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
    textAlign: "left",
    fontSize: 16,
  },
  progressArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  progressBar: {
    flex: 1,
    height: 15,
    width: "80%",
    flexDirection: "row",
    backgroundColor: "#3F4243",
    borderColor: "#3F4243",
    borderRadius: 5,
    marginBottom: 0,
  },
  logo: {
    bottom: 0,
    width: 35,
    height: 15,
    overflow: "visible",
    resizeMode: "contain",
    //borderWidth: 4
  },
  reportPieChart: {
    borderWidth: 2,
    paddingLeft: 20,
    borderColor: colours.red,
    marginTop: 10,
  },
  whiteInput: {
    backgroundColor: "#fff",
    borderWidth: 0.8,
    borderColor: "#251F47",
    borderRadius: 5,
    shadowColor: "#000",
    marginVertical: 5,
    shadowRadius: 1,
    elevation: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  pie: {
    justifyContent: "center",
    alignItems: "center",
  },
  lastRecordTitle: {
    marginTop: 20,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colours.red,
    borderRadius: 10,
    marginBottom: 20,
  },
  lastRecordText: {
    marginLeft: 10,
  },
  row: {
    // backgroundColor: colours.beige,
    // borderWidth: 2,
    // borderColor: colours.lightBrown,
    borderRadius: 10,
  },
  dateRow: {
    flexDirection: "row",
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
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
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
  modalButton: {
    marginTop: 20,
    borderRadius: 20,
    padding: 10,
    backgroundColor: colours.lightBrown,
    borderWidth: 1,
    borderColor: "#000",
  },
  raisedEffect: {
    // shadowColor: colours.black,
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    // shadowRadius: 1, //IOS
    backgroundColor: colours.white,
    elevation: 2, // Android
    // height: 50,
    // width: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 10,
  },
  // photoURLImage: {
  //   width: 30,
  //   height: 30,
  //   left: `${percent}`,
  //   borderRadius: 9999,
  //   justifyContent: "flex-end",
  //   backgroundColor: colours.white,
  // },
});

export default HomePage;
