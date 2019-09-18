import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const DNavigator = createDrawerNavigator(
  {
  Home: {screen: HomeScreen},
  Settings: {screen: SettingsScreen},
  Profile: {screen: ProfileScreen},
  }
);

export default createAppContainer(DNavigator);