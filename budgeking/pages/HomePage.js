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
import { Header, Title } from "../config/reusableText";
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { PieChart } from "react-native-gifted-charts";
import CurrencyInput from "react-native-currency-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ListItem } from "react-native-elements";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

class HomePage extends React.Component {

  constructor() {
    super();
    this.fireStoreRef = db.collection('users').doc(auth.currentUser.uid).collection("expense");
    this.state = {
      displayName: auth.currentUser.displayName,
      timePeriod: ["Your weekly budget", "Your daily budget"],
      // pieData: [
      //   {value: 54, color: '#177AD5', text: '54%'},
      //   {value: 40, color: '#79D2DE', text: '30%'},
      //   {value: 20, color: '#ED6665', text: '26%'},
      // ],
      value: "00.00",
      expenseArr: [],
      isLoading: true,
    };
  }

  updateInputVal(val, prop) {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  componentDidMount() {
    this.unsubscribe = this.fireStoreRef.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const expenseArrPush = [];
    querySnapshot.forEach((res) => {
      const {value, category} = res.data();
      expenseArrPush.push( {
        key: res.id,
        value,
        category
      });
      // console.log(expenseArr, "+>", res.id, "=>", res.data());
    });
    this.setState( {
      expenseArr: expenseArrPush,
      isLoading: false,
    });
    console.log(this.state.expenseArr)
    console.log("piepushed =>", this.updatePieData())
    console.log(auth.currentUser.displayName)
    // console.log(auth.currentUser.uid)
    // console.log(this.fireStoreRef)
  }


  // Scroll from top to refresh changes
  // const [refreshing, setRefreshing] = React.useState(false);

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   setDisplayName(auth.currentUser.displayName);
  //   wait(500).then(() => setRefreshing(false));
  // }, []);

  addExpenses() {
    let sum = 0;
    this.state.expenseArr.map((item, i) => {
      sum += item.value;
      // console.log(sum)
    })
    return sum; //32.12
  }

  percentExpenseOutOfBudget() {
    if (this.state.value == 0.00) {
      return 0;
    } else if (this.state.value <= this.addExpenses()) {
      return 100;
    }
    return (this.addExpenses() / this.state.value) * 100;
  }

  //add color, text + setState limite exceeded render error 
  // render error props.data.foreach is not a function
  updatePieData() {
    var pieDataPush = [
      {category: "food and drinks", value: 0, color: '#177AD5'},
      {category: "transportation", value: 0, color: '#79D2DE'},
      {category: "housing", value: 0, color: '#F7D8B5'},
      {category: "shopping", value: 0, color: '#8F80E4'},
      {category: "health", value: 0, color: '#FB8875'},
      {category: "education", value: 0, color: '#FDE74C'},
      {category: "others", value: 0, color: '#E8E0CE'},
    ];
    this.state.expenseArr.map((item, i) => {
      if (item.category == "food and drinks") {
        const placeholder = pieDataPush[0] 
        placeholder["value"] += item.value;
      } else if (item.category == "transportation") {
        const placeholder = pieDataPush[1] 
        placeholder["value"] += item.value;
      } else if (item.category == "housing") {
        const placeholder = pieDataPush[2] 
        placeholder["value"] += item.value;
      } else if (item.category == "shopping") {
        const placeholder = pieDataPush[3] 
        placeholder["value"] += item.value;
      } else if (item.category == "health") {
        const placeholder = pieDataPush[4] 
        placeholder["value"] += item.value;
      } else if (item.category == "education") {
        const placeholder = pieDataPush[5] 
        placeholder["value"] += item.value;
      } else {
        const placeholder = pieDataPush[6] 
        placeholder["value"] += item.value;
      }
    });
    return pieDataPush;
  }

  putInTextToPie() {
    const pieData = this.updatePieData();
    // pieData.map((item, i)) => {

    // }
  }

  render() {

    const pieData = this.updatePieData();

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

          <Title text={`Welcome, ${this.state.displayName}!`}></Title>

          <View style={styles.weeklyBudgetTab}>
            {/* <Header text={`${"\n"}Your weekly budget`} style={styles.changeLineHeightWeeklyBudget} /> */}
            <SelectDropdown
              data = {this.state.timePeriod}
              onSelect = {(selectedTime, index) => {
                console.log()
              }}
              defaultButtonText={'Select time period for your budget'}
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

          <Image
              style = {styles.logo}
              source = {require("../assets/home/walking.png")}
              resizeMethod={"resize"}
          />

          <View style={styles.progressArea}>
            <View style={styles.progressBar}>
              <Animated.View style={StyleSheet.absoluteFill, 
                {backgroundColor: "#96D3FF", 
                width: `${this.percentExpenseOutOfBudget()}%`, 
                borderRadius: 5}} />
            </View>
            {/* <Text style={styles.whiteInput}>  Left: </Text> */}
            <CurrencyInput
              style={styles.whiteInput}
              keyboardType="numeric"
              value={this.state.value}
              prefix="$"
              unit="$"
              delimiter=","
              separator="."
              precision={2}
              onChangeValue={(val) => this.updateInputVal(val, "value")}
            />
            <Image
              style = {styles.logo}
              source = {require("../assets/home/rip.png")}
              resizeMethod={"resize"}
            />
          </View>
          
          <View style={styles.reportPieChart}>
            <Header text={`${"\n"}  Categories (This Week: ...)`} />
            <PieChart
              style = {styles.pie}
              donut
              innerRadius = {80}
              showText
              textColor = "black"
              radius = {170}
              textSize = {20}
              // showTextBackground
              // textBackgroundRadius = {26}
              data = {pieData}
              centerLabelComponent = {() => {
                return <Title text={`$${this.addExpenses()}`}>
                  </Title>;
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

          <Text style={{fontSize: 20}}>Test</Text>

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
    justifyContent: 'space-between',
    //paddingTop: 10,
  },
  progressBar: {
    flex: 1,
    height: 15,
    width: '80%',
    flexDirection: 'row',
    backgroundColor: '#3F4243',
    borderColor: '#3F4243',
    borderRadius: 5
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