import React from 'react';  
import { View } from 'react-native';  
import { createBottomTabNavigator, createAppContainer} from 'react-navigation';  
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';  
import Icon from 'react-native-vector-icons/Ionicons';  

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsNavigator from './SettingsNavigator';
import EnterScreen from '../screens/EnterScreen'

const TabNavigator = createMaterialBottomTabNavigator(  
    {  
      Home: { screen: HomeScreen,  
        navigationOptions:{  
          tabBarLabel:'Home',  
          tabBarIcon: ({ tintColor }) => (  
            <View>  
              <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
            </View>),
            activeColor: '#615af6',  
            inactiveColor: '#46f6d7',  
            barStyle: { backgroundColor: '#67baf6' },    
        }  
      },  
      Profile: { screen: ProfileScreen,  
        navigationOptions:{  
          tabBarLabel:'Profile',  
          tabBarIcon: ({ tintColor }) => (  
            <View>  
              <Icon style={[{color: tintColor}]} size={25} name={'ios-person'}/>  
            </View>), 
            activeColor: '#615af6',  
            inactiveColor: '#46f6d7',  
            barStyle: { backgroundColor: '#67baf6' },     
        }  
      },  
      Settings: { screen: SettingsNavigator,  
        navigationOptions:{  
          tabBarLabel:'Options',  
          tabBarIcon: ({ tintColor }) => (  
            <View>  
              <Icon style={[{color: tintColor}]} size={25} name={'ios-settings'}/>  
            </View>),  
          activeColor: '#615af6',  
          inactiveColor: '#46f6d7',  
          barStyle: { backgroundColor: '#67baf6' },  
        }  
      },  
      location: { screen: EnterScreen,  
        navigationOptions:{  
          tabBarLabel:'Location',  
          tabBarIcon: ({ tintColor }) => (  
            <View>  
              <Icon style={[{color: tintColor}]} size={25} name={'ios-send'}/>  
            </View>),  
          activeColor: '#615af6',  
          inactiveColor: '#46f6d7',  
          barStyle: { backgroundColor: '#67baf6' },  
        }  
      },  
    },  
    {  
      initialRouteName: "Home",  
      activeColor: '#f0edf6',  
      inactiveColor: '#226557',  
      barStyle: { backgroundColor: '#3BAD87' },  
    },  
);  
  
export default createAppContainer(TabNavigator);