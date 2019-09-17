import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

const DNavigator = createDrawerNavigator(
  {
  Home: {screen: HomeScreen},
  Settings: {screen: SettingsScreen},
  }
);

export default createAppContainer(DNavigator);