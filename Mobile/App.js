import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "./screens/LoginScreen";
import ForgotPassword from "./screens/ForgotPassword";
import DrawerNavigator from "./components/DrawerNavigator";

const AppNavigator = createStackNavigator(
  {
  Login: {screen: LoginScreen, navigationOptions: {header: null,}},
  dNav: {screen: DrawerNavigator, navigationOptions: {header: null,}},
  Reset: {screen: ForgotPassword, navigationOptions: {header: null,}},
  },
  {
    initialRouteName: 'Login',
  },
);

export default createAppContainer(AppNavigator);