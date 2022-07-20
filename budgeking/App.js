import * as React from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Platform,
  StyleSheet,
  StatusBar,
  LogBox,
  Modal,
  View,
  Text,
} from "react-native";
import colours from "./config/colours";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/Home/HomePage";
import SettingsPage from "./pages/SettingsPage";
import GoalsPage from "./pages/Goal/GoalsPage";
import BudgetPage from "./pages/Budget/BudgetPage";
import ReportsPage from "./pages/Report/ReportsPage";
import LocationSearch from "./pages/Budget/LocationSearch";
import NewGoal from "./pages/Goal/NewGoal";
import SaveToGoal from "./pages/Goal/SaveToGoal";
import EditGoal from "./pages/Goal/EditGoal";
import AllTableView from "./pages/Home/AllTableView";
import ReportsPagePieChart from "./pages/Report/ReportsPagePieChart";
import ChooseCustomDate from "./pages/Report/ChooseCustomDate";
import ReportsPageTable from "./pages/Report/ReportsPageTable";
import GoalHistory from "./pages/Goal/GoalHistory";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Header } from "./config/reusableText";
import { BlackButton } from "./config/reusableButton";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Signup" component={SignupPage} />
      <Stack.Screen name="HomePage" component={MyTabs} />
    </Stack.Navigator>
  );
}

function GoalsAll() {
  return (
    <Stack.Navigator
      initialRouteName="Goals"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Goals"
        component={GoalsPage}
        options={{
          headerLeft: false,
          headerRight: () =>
            Help(
              "1. Add new goals to achieve. Goals are categorised into short-term and long-term.\n\n 2. Once a goal is added, you can edit and delete your goal or add to your savings to complete the goal by clicking on the 3-dotted icon (...), which will then take you to separate pages to fulfill your request. \n\n3. Blue progress bar shows how far you are from your target savings amount.\n\n4. Click on the dropdown arrow to view more details of your goal. \n\n5. Goal box will turn red if your goal deadline has passed. \n\n6. Show goal history shows past goals you have completed."
            ),
        }}
      />
      <Stack.Screen
        name="New Goal"
        component={NewGoal}
        options={{
          headerRight: () =>
            Help(
              "1. Add a goal description and target savings amount. \n\n2. Click on 'Select' dropdown and choose how often you want to save. Then, choose the goal deadline. Frequency amount (amount you have to save) will be automatically displayed beside '$' sign. \n\n4. You can write any notes regarding your goal. \n\n5. If you want to share your goal with someone else, choose 'Yes'. Then, enter the email of user you want to share with. (Note: The user must have signed up on budgeking as well.)\n\n6. Click 'Add' to add the goal and 'Cancel' to go back to Goals page."
            ),
        }}
      />
      <Stack.Screen
        name="Goal History"
        component={GoalHistory}
        options={{
          headerRight: () =>
            Help(
              "Goal history shows an archive all of your past completed goals. For each goal, you can click on dropdown arrow to view the goal's details."
            ),
        }}
      />
      <Stack.Screen
        name="Edit Goal"
        component={EditGoal}
        options={{
          headerRight: () =>
            Help(
              "Add on, remove or edit any details of the goal you have created."
            ),
        }}
      />
      <Stack.Screen
        name="Save to Goal"
        component={SaveToGoal}
        options={{
          headerRight: () =>
            Help(
              "1. 'Target' shows the goal's target savings amount.\n\n2. 'Current Savings' shows how much you have saved towards your goal. \n\n3. Under, 'Add to Savings', key in the amount of money you want to save towards completion of your goal. Amount cannot be more than what is left towards your target amount."
            ),
        }}
      />
    </Stack.Navigator>
  );
}

function BudgetAll() {
  return (
    <Stack.Navigator
      initialRouteName="Budget"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Budget"
        component={BudgetPage}
        options={{
          headerLeft: false,
          headerRight: () =>
            Help(
              "1. Toggle between 'Expense' and 'Income' button to input in data for your expenses or income.\n\n2. Input value spent, date and time, category and notes (optional).\n\n3. Attach a photo of your receipt and add a location by clicking on the camera icon and location icon repectively. (optional) \n\n4. Click 'Add' to add to budget. You can see details of what you added in Home Page under 'Last records' for a quick glance. \n\n5. Click on 'Cancel' to remove all details keyed in currently and start over."
            ),
        }}
      />
      <Stack.Screen
        name="Location Search"
        component={LocationSearch}
        options={{
          headerRight: () =>
            Help(
              "1. In the 'Search' bar, search for your desired location by inputting in the name of your desired location. Or, you can click on 'Current location' to get your approximate current location. \n\n2. Choose the option that is most fitting to the location you want. \n\n3. Click on the tick button to confirm your location and go back to Budget Page."
            ),
        }}
      />
    </Stack.Navigator>
  );
}

function ReportsPageAll() {
  return (
    <Stack.Navigator
      initialRouteName="Report"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Report"
        component={ReportsPage}
        options={{
          headerLeft: false,
          headerRight: () =>
            Help(
              "1. Overall balance shows the total savings you have. It is a difference between your all-time total expenses and income.\n\n2. Total spending shows your all-time total expenses. Upon clicking on 'TOTAL SPENDING' box, you will be taken to a 'Pie Chart View' of all your expenses that can be filtered by different time periods."
            ),
        }}
      />
      <Stack.Screen
        name="Pie Chart View"
        component={ReportsPagePieChart}
        options={{
          headerRight: () =>
            Help(
              "1. Scroll down to see the dropdown box. Then, select the time period to filter your expenses by. \n\n2. Pie chart will change to show expenses broken down by category according to the time period you selected. Read the legends for the categories and amount of spent for each category. \n\n 3. 'Show more' button navigates to 'Table View' where you can see more detailed logs of expenses and income filtered by the current time period you have selected."
            ),
        }}
      />
      <Stack.Screen
        name="Custom Date"
        component={ChooseCustomDate}
        options={{
          headerRight: () =>
            Help(
              "1. Click on 'Choose custom date' to choose custom dates for the time period to filter expenses and income by. \n\n2. Select a start date and an end date on the calendar for the custom time period. \n\n3. Click on 'Save' button. \n\n4. Check the dates chosen are correct and click on 'Confirm' button to confirm your choice and go back to 'Pie Chart View'."
            ),
        }}
      />
      <Stack.Screen
        name="Table View"
        component={ReportsPageTable}
        options={{
          headerRight: () =>
            Help(
              "All records are sorted in chronological order. You can toggle between red 'Expenses' button and green 'Income' button to view details of all your expenses and income of the time period you have filtered this by."
            ),
        }}
      />
    </Stack.Navigator>
  );
}

function HomePageAll() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        cardStyle: { backgroundColor: colours.white },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerLeft: false,
          headerRight: () =>
            Help(
              "1. Choose monthly/ daily mode by clicking on the pink dropdown.\n\n2. Fill in your allowable budget in the currency textbox (beside blue progress bar) for the month or day depending on the mode you have chosen.\n\n3. Blue progress bar shows how much money you can still spend before you reach your allowable budget limit.\n\n4. Pie chart shows a breakdown of all expenses by categories for the month or day depending on the mode you have chosen.\n\n5. Last records show a more detailed view of all expenses. Upon clicking 'Show more', you will be taken to a page with a detailed view of all your records.\n\n6. Notifications will also appear on the Home Page. Upon clicking on the notification, you will be taken to the page requiring your attention."
            ),
        }}
      />
      <Stack.Screen
        name="All Table View"
        component={AllTableView}
        options={{
          headerRight: () =>
            Help(
              "All records are sorted in chronological order. You can toggle between red 'Expenses' button and green 'Income' button to view details of all your expenses and income of all time."
            ),
        }}
      />
    </Stack.Navigator>
  );
}

const Help = (text) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modal}>
            <Header
              text={"\nHelp"}
              style={{
                fontSize: 18,
                fontWeight: "500",
              }}
            />
            <Text style={styles.modalText}>{text}</Text>
            <BlackButton
              text={"Okay"}
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={24}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

const screenOptions = (route, color) => {
  let iconName;
  switch (route.name) {
    case "Home":
      iconName = "home";

      break;
    case "Goal":
      iconName = "piggy-bank-outline";
      break;

    case "Budget":
      iconName = "plus-circle";
      break;

    case "Report":
      iconName = "file-document-outline";
      break;
    case "Settings":
      iconName = "cog";
      break;
    default:
      break;
  }
  return <MaterialCommunityIcons name={iconName} color={color} size={28} />;
};

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: colours.whiteRock,
        },
        unmountOnBlur: true,
        tabBarActiveTintColor: colours.tomato,
        tabBarStyle: {
          backgroundColor: colours.whiteRock,
          height: 60,
          paddingBottom: 2,
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color }) => screenOptions(route, color),
      })}
      sceneContainerStyle={{ backgroundColor: colours.white }}
    >
      <Tab.Screen
        name="Home"
        component={HomePageAll}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Goal"
        component={GoalsAll}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetAll}
        options={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportsPageAll}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          headerRight: () =>
            Help(
              "1. Change your profile picture by tapping on the current profile picture and choosing a new picture.\n\n2. Click on edit button beside your current username. Now, you can key in the new username in the textbox. Click 'Change' button to update your username.\n\n3. Click on edit button beside the asterisks. Key in your current password in the pop-up window to verify it is you. Click on 'Verify' button. Now, your current password is unmasked and you can key in the new password in the textbox. Click 'Change' button to update your password.\n\n4. 'Log out' button logs you out of your account and takes you back to Login page."
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={{ colors: colours.black }}>
      <MyStack />
    </NavigationContainer>
  );
}

// export default function App() {
//   return (
//     <NavigationContainer theme={{ colors: colours.black }}>
//       <MyTabs />
//     </NavigationContainer>
//   );
// }

const styles = StyleSheet.create({
  bottomTabIcon: {
    width: 30,
    height: 30,
    overflow: "visible",
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: colours.brown,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
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
  modalText: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "300",
    textAlign: "justify",
  },
});
