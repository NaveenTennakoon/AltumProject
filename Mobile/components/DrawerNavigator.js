import React from 'react';
import { View, SafeAreaView, TouchableOpacity, StyleSheet, Image, Text, Alert, AsyncStorage } from "react-native";
import { Icon } from 'react-native-vector-icons';
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerNavigatorItems } from "react-navigation-drawer";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const DNavigator = createDrawerNavigator(
  {
  Home: {screen: HomeScreen},
  Settings: {screen: SettingsScreen},
  Profile: {screen: ProfileScreen},
  },
  {
  contentComponent: props => (
    <View style={{flex: 1}}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerNavigatorItems {...props} />
      <View style={styles.container}>
        <Icon name="home"/>
        <TouchableOpacity onPress={()=>
          Alert.alert(
            'Log out',
            'Do you want to logout?',
            [
              {text: 'Cancel', onPress: () => {return null}},
              {text: 'Confirm', onPress: () => {
                AsyncStorage.clear();
                props.navigation.navigate('Login')
              }},
            ],
            { cancelable: false }
          )  
        }>     
        <Text style={{margin: 16, fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
</View>
  ),
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle'
},
);

const styles = StyleSheet.create({
  container:{
    borderTopColor: "#808080",
    borderTopWidth: 3,
    flex: 1,
    padding: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    marginTop:130
  },
});

export default createAppContainer(DNavigator);