import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import EditScreen from "../screens/EditScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Locations from "../screens/Locations";
import Profile from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";

const SettingsNavigator = createStackNavigator(
  {
  Settings: {screen: SettingsScreen, navigationOptions: {header: null,}},
  Edit: {screen: EditScreen, navigationOptions: {header: null,}},
  Locations: {screen: Locations, navigationOptions: {header: null,}},
  Profile: {screen: Profile, navigationOptions: {header: null,}},
  Home: {screen: HomeScreen, navigationOptions: {header: null}},
  },
  {
    initialRouteName: 'Settings',
  },
);

export default createAppContainer(SettingsNavigator);