import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dasboard';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  Dashboard: { screen: Dashboard }
},
  {
    initialRouteName: 'Login',
});

export default createAppContainer(AppNavigator);