import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import EditScreen from "../screens/EditScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Locations from "../screens/Locations";

const SettingsNavigator = createStackNavigator(
  {
  Edit: {screen: EditScreen, navigationOptions: {header: null,}},
  Settings: {screen: SettingsScreen, navigationOptions: {header: null,}},
  Locations: {screen: Locations, navigationOptions: {header: null,}},
  },
  {
    initialRouteName: 'Settings',
  },
);

export default createAppContainer(SettingsNavigator);