import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "./screens/LoginScreen";
import DrawerNavigator from "./components/DrawerNavigator";
// import HomeScreen from "./screens/HomeScreen";

const AppNavigator = createStackNavigator(
  {
  Login: {screen: LoginScreen, navigationOptions: {header: null,}},
  dNav: {screen: DrawerNavigator, navigationOptions: {header: null,}}
  },
  {
    initialRouteName: 'Login',
  },
);

export default createAppContainer(AppNavigator);