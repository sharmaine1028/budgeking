import React, { useState, Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  RefreshControl,
  Animated,
  ActivityIndicator
} from "react-native";
import colours from "../config/colours";
import { auth, db } from "../config/firebase";
import RedLine from "../config/reusablePart";
import { Header, Title, SmallTextInput } from "../config/reusableText";
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PieChart } from "react-native-gifted-charts";
import CurrencyInput from "react-native-currency-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SmallBlackButton } from "../config/reusableButton";
import Icon from 'react-native-vector-icons/AntDesign'
import { color } from "react-native-elements/dist/helpers";
import { TouchableOpacity } from "react-native-gesture-handler";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

class HomePage extends React.Component {

  constructor() {
    super();
    this.fireStoreRef = db.collection('users').doc(auth.currentUser.uid).collection("expense");
    this.state = {
      name: auth.currentUser.displayName,
      email: auth.currentUser.email,
      timePeriod: ["Your monthly budget", "Your daily budget"],
      timeUserWants: "monthly",
      budgetEditable: false,
      budgetValue: 0.00,
      expenseArr: [],
      isLoading: true,
      monthNames: ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"],
    };
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  // editBudget = () => {
  //   this.setState({ budgetEditable: true });
  // };

  // calling budgetValue from firestore
  componentDidMount() {
    this.unsubscribe = this.fireStoreRef.onSnapshot(this.getCollection);
    this.callBudgetValue();
  }

  callBudgetValue() {
    db.collection("users").doc(auth.currentUser.uid).get().then((doc)=> {
      const {budgetValue} = doc.data()
      this.setState({budgetValue: budgetValue})
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const expenseArrPush = [];
    querySnapshot.forEach((res) => {
      const {value, category, date} = res.data();
      expenseArrPush.push( {
        key: res.id,
        value,
        category,
        date
      });
      // console.log(expenseArr, "+>", res.id, "=>", res.data());
    });
    this.setState( {
      expenseArr: expenseArrPush,
      isLoading: false,
    });

    // console.log("time", this.getMonthlyData())
    // console.log("piepushed =>", this.updatePieData())
    // console.log(auth.currentUser.displayName)
    // console.log(new Date().toLocaleDateString())
    // console.log(this.state.budgetValue)
    // console.log(new Date().toLocaleDateString('en-us', {  weekday: 'short' }))
    // console.log(this.putInTextToPie())
    // console.log(auth.currentUser.uid)
  }

  // budgetValue changing immediately when updateInputVal() without invoking tick
  inputBudgetFireStore = () => {
    // console.log(this.state.budgetValue)
    db
      .collection("users")
      .doc(auth.currentUser.uid)
      .update({
        budgetValue: this.state.budgetValue
      });
  }


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
    this.getMonthlyData().map((item, i) => {
      sum += item.value;
    })
    return sum; //255.78
  }

  addExpensesDaily() {
    let sum = 0;
    this.getDailyData().map((item, i) => {
      sum += item.value;
    })
    return sum; //12
  }

  percentExpenseOutOfBudget() {
    if (this.addExpenses() == 0.00) {
      return 0;
    } else if (this.state.budgetValue <= this.addExpenses()) {
      return 100;
    }
    return (this.addExpenses() / this.state.budgetValue) * 100;
  }

  textBesideWalking() {
    var leftExceeded = "";
    if (this.state.budgetValue <= this.addExpenses()) {
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
      {category: "food and drinks", value: 0, color: '#177AD5'},
      {category: "transportation", value: 0, color: '#79D2DE'},
      {category: "housing", value: 0, color: '#F7D8B5'},
      {category: "shopping", value: 0, color: '#8F80E4'},
      {category: "health", value: 0, color: '#FB8875'},
      {category: "education", value: 0, color: '#FDE74C'},
      {category: "others", value: 0, color: '#E8E0CE'},
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
      {category: "food and drinks", value: 0, color: '#177AD5'},
      {category: "transportation", value: 0, color: '#79D2DE'},
      {category: "housing", value: 0, color: '#F7D8B5'},
      {category: "shopping", value: 0, color: '#8F80E4'},
      {category: "health", value: 0, color: '#FB8875'},
      {category: "education", value: 0, color: '#FDE74C'},
      {category: "others", value: 0, color: '#E8E0CE'},
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

  putInTextToPie() {
    var pieData = this.updatePieData();
    this.updatePieData().map((item, i) => {
      pieData[i]["text"] = "$";
      pieData[i]["text"] += pieData[i]["value"];
    });
    return pieData;
  }

  // convertTimeStamp() {
  //   var expenseArrTime = this.state.expenseArr;
  //   this.state.expenseArr.map((item, i) => {
  //     // var dateFirestore = expenseArrTime[i]["date"];
  //     console.log("datefirestore", expenseArrTime[i]["date"].toDate())
  //     // expenseArrTime[i]["date"] = expenseArrTime[i]["date"].toDate();
  //   });
  //   return expenseArrTime;
  // }

  getMonthlyData() {
    const currMonth = new Date().getMonth();
    // console.log("currmonth", currMonth)
    const expenseArrayTimeConverted = this.state.expenseArr;
    const monthlyExpenseArray = [];
    expenseArrayTimeConverted.map((item, i) => {
      const dateItem = expenseArrayTimeConverted[i]["date"];
      // console.log("dateitem", dateItem)
      if (dateItem.toDate().getMonth() == currMonth) {
        monthlyExpenseArray.push(expenseArrayTimeConverted[i])
      };
    });
    return monthlyExpenseArray;
  }

  getDailyData() {
    const currDate = new Date().toLocaleDateString();
    const expenseArrayTimeConverted = this.state.expenseArr;
    const dailyExpenseArray = [];
    expenseArrayTimeConverted.map((item, i) => {
      const dateItem = expenseArrayTimeConverted[i]["date"];
      // console.log("dateitem", dateItem)
      if (dateItem.toDate().toLocaleDateString() == currDate) {
        dailyExpenseArray.push(expenseArrayTimeConverted[i])
      };
    });
    return dailyExpenseArray;
  }

  toggleMonthlyDaily = (val) => {
    if (val === 0) {
      this.setState({timeUserWants: "monthly" });
    } else {
      this.setState({timeUserWants: "daily" });
    }
  }

  textBesideCategories() {
    var dayText = "";
    if (this.state.timeUserWants == "monthly") {
      dayText += this.state.monthNames[new Date().getMonth()];
    } else {
      dayText += new Date().toLocaleDateString();
    }
    return dayText;
  }

  render() {

    const pieData = this.putInTextToPie();



    const renderLegend = (text, color) => {
      return (
        <View style={{flexDirection: 'row', marginBottom: 12}}>
          <View
            style={{
              height: 18,
              width: 18,
              marginRight: 10,
              borderRadius: 4,
              backgroundColor: color || 'white',
            }}
          />
          <Text style={{color: '#444444', fontSize: 16}}>{text || ''}</Text>
        </View>
      );
    };

    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }

    return (
      <KeyboardAwareScrollView>

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
              data = {this.state.timePeriod}
              onSelect = {(selectedItem, index) => {
                return this.toggleMonthlyDaily(index);
              }}
              defaultButtonText={'Your monthly budget'}
              buttonTextAfterSelection = {(selectedTime, index) => {
                return selectedTime;
              }}
              rowTextForSelection = {(time, index) => {
                return time;
              }}
              buttonStyle={styles.dropdownStyle}
              buttonTextStyle={styles.dropdownTxtStyle}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdownDropdownStyle}
              rowStyle={styles.dropdownRowStyle}
              rowTextStyle={styles.dropdownRowTxtStyle}
              renderDropdownIcon={isOpened => {
                return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={colours.red} size={18} />;
              }}
            />
            {/* <View style={styles.dropdownTriangle} /> */}
          </View>

          <RedLine />

          <View style = {{flexDirection: 'row'}}>
            <Image
                style = {styles.logo}
                source = {require("../assets/home/walking.png")}
                resizeMethod={"resize"}
            />
            <Text style = {styles.leftText}>{`${this.textBesideWalking()}: $${this.state.budgetValue - this.addExpenses()}`}</Text>
          </View>

          <View style={styles.progressArea}>

            <View style={styles.progressBar}>
              <Animated.View style = {[StyleSheet.absoluteFill, 
                {backgroundColor: "#96D3FF", 
                width: `${this.percentExpenseOutOfBudget()}%`, 
                borderRadius: 5}]} />
            </View>

            {/* <Text style={styles.whiteInput}>  Left: </Text> */}
            <CurrencyInput
              style={styles.whiteInput}
              keyboardType="numeric"
              value={this.state.budgetValue}
              prefix="$"
              unit="$"
              delimiter=","
              separator="."
              precision={2}
              onChangeValue={(val) => this.updateInputVal(val, "budgetValue")}
            />
            <TouchableOpacity onPress={this.inputBudgetFireStore()}>
              <Icon.Button
                name = "checkcircleo"
                color = {colours.black}
                backgroundColor = {"transparent"}
                iconStyle = {{marginRight: 0}}
              />
            </TouchableOpacity>

            {/* <SmallBlackButton
              text="Done"
              style={styles.smallBlackButton}
              textStyle={styles.buttonTextStyle}
              onPress={() => this.inputBudgetFireStore()}
            /> */}

            {/* <Image
              style = {styles.logo}
              source = {require("../assets/home/rip.png")}
              resizeMethod={"resize"}
            /> */}

          </View>
          
          <View style={styles.reportPieChart}>

            <Header text={`${"\n"} Categories (${this.textBesideCategories()} ${this.state.timeUserWants} expenses)\n\n`} />

            <PieChart
              style = {styles.pie}
              donut
              innerRadius = {80}
              showText
              textColor = "black"
              radius = {170}
              textSize = {15}
              // showTextBackground
              // textBackgroundRadius = {26}
              data = {pieData}
              focusOnPress
              centerLabelComponent = {() => {
                return <Text style = {styles.totalSpentText}>{`Total Spent\n$${this.addExpenses()}`}</Text>
              }}
            />

            <View
              style = {{
                width: "100%",
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}
            >
              {renderLegend('food and drinks', '#177AD5')}
              {renderLegend('transportation', '#79D2DE')}
              {renderLegend('housing', '#F7D8B5')}
              {renderLegend('shopping', '#8F80E4')}
              {renderLegend('health', '#FB8875')}
              {renderLegend('education', '#FDE74C')}
              {renderLegend('others', '#E8E0CE')}
            </View>

          </View>

          <View>
            
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
  },
  weeklyBudgetTab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5
  },
  leftText: {
    // marginVertical: 10,
    marginTop: 20,
    color: "#000",
    fontWeight: "200",
  },
  totalSpentText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "300",
  },
  // changeLineHeightWeeklyBudget: {
  //   lineHeight: 10,
  // },
  // dropdownTriangle: {
  //   width: 0,
  //   height: 0,
  //   backgroundColor: 'transparent',
  //   borderStyle: 'solid',
  //   borderLeftWidth: 8,
  //   borderRightWidth: 8,
  //   borderBottomWidth: 16,
  //   borderLeftColor: 'transparent',
  //   borderRightColor: 'transparent',
  //   borderBottomColor: colours.red,
  //   transform: [{rotate: '180deg'}]
  // },

  dropdownStyle: {
    width: '100%',
    height: 50,
    backgroundColor: 'EFEFEF',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colours.red,
  },
  dropdownTxtStyle: {
    color: '#444', 
    textAlign: 'left', 
    fontSize: 16
  },
  dropdownDropdownStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10
  },
  dropdownRowStyle: {
    backgroundColor: '#EFEFEF', 
    borderBottomColor: '#C5C5C5'
  },
  dropdownRowTxtStyle: {
    color: '#444', 
    textAlign: 'left', 
    fontSize: 16
  },
  progressArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    //paddingTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 15,
    width: '80%',
    flexDirection: 'row',
    backgroundColor: '#3F4243',
    borderColor: '#3F4243',
    borderRadius: 5,
  },
  logo: {
    bottom: 0,
    width: 70,
    height: 35,
    overflow: "visible",
    resizeMode: "contain",
    //borderWidth: 4
  },
  reportPieChart: {
    borderWidth: 2,
    paddingLeft: 20,
    borderColor: colours.red,
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
  pie: {
    justifyContent: "center",
    alignItems: "center",
  }
});

export default HomePage;