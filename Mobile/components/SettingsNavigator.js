import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import SettingsScreen from "../screens/SettingsScreen";
import Locations from "../screens/Locations";
import Profile from "../screens/ProfileScreen";

const SettingsNavigator = createStackNavigator(
  {
  Settings: {screen: SettingsScreen, navigationOptions: {header: null,}},
  Locations: {screen: Locations, navigationOptions: {header: null,}},
  Profile: {screen: Profile, navigationOptions: {header: null,}},
  },
  {
    initialRouteName: 'Settings',
  },
);

export default createAppContainer(SettingsNavigator);