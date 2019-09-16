import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";

import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";

const AppNavigator = createDrawerNavigator(
  {
  Home: {screen: HomeScreen},
  Settings: {screen: SettingsScreen},
  Login: {screen: LoginScreen}
  },
  {
    initialRouteName: 'Login',
  }
);

export default createAppContainer(AppNavigator);