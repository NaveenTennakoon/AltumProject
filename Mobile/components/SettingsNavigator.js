import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import SettingsScreen from "../screens/SettingsScreen";
import Locations from "../screens/Locations";
import Profile from "../screens/ProfileScreen";
import Feedback from "../screens/FeedbackScreen";

// Create the stack navigator from the settings page
const SettingsNavigator = createStackNavigator(
  {
    Settings: { screen: SettingsScreen, navigationOptions: { header: null, } },
    Locations: { screen: Locations, navigationOptions: { header: null, } },
    Profile: { screen: Profile, navigationOptions: { header: null, } },
    Feedback: { screen: Feedback, navigationOptions: { header: null, } },
  },
  {
    initialRouteName: 'Settings',
  },
);

export default createAppContainer(SettingsNavigator);