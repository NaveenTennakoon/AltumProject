import React from 'react';
import { View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsNavigator from './SettingsNavigator';
import EnterScreen from '../screens/EnterScreen'

// Create the tab navigator for the main bottom tab navigation
const TabNavigator = createMaterialBottomTabNavigator(
  {
    // include home
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-home'} />
          </View>),
        activeColor: '#ffffff',
        inactiveColor: '#999999',
        barStyle: { backgroundColor: '#000000' },
      }
    },
    // include profile
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-person'} />
          </View>),
        activeColor: '#ffffff',
        inactiveColor: '#999999',
        barStyle: { backgroundColor: '#000000' },
      }
    },
    // include settings 
    Settings: {
      screen: SettingsNavigator,
      navigationOptions: {
        tabBarLabel: 'Options',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-settings'} />
          </View>),
        activeColor: '#ffffff',
        inactiveColor: '#999999',
        barStyle: { backgroundColor: '#000000' },
      }
    },
    // include location enter screen
    location: {
      screen: EnterScreen,
      navigationOptions: {
        tabBarLabel: 'Location',
        tabBarIcon: ({ tintColor }) => (
          <View>
            <Icon style={[{ color: tintColor }]} size={25} name={'ios-send'} />
          </View>),
        activeColor: '#ffffff',
        inactiveColor: '#999999',
        barStyle: { backgroundColor: '#000000' },
      }
    },
  },
  {
    initialRouteName: "Home",
    activeColor: '#f0edf6',
    inactiveColor: '#999999',
    barStyle: { backgroundColor: '#000000' },
  },
);

export default createAppContainer(TabNavigator);