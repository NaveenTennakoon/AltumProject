import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid } from "react-native";
import SettingsList from 'react-native-settings-list';
import Geolocation from 'react-native-geolocation-service';

import FB from '../components/FB'

export default class SettingsScreen extends Component {
  
  constructor(){
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {
      switchValue: false,
      lat: 0,
      lng: 0,
      timer: 0,
    };
    global.location = 'off';
  }
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
            <SettingsList.Item
              // icon={
              //     <Image style={styles.imageStyle} source={require('./images/airplane.png')}/>
              // }
              hasSwitch={true}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title='GPS Location'
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
              title='My Locations'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Wifi Page')}
            /> 
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
              title='Order'
              titleInfo='View Pending order'
              onPress={() => alert('Route To Control Center Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
              title='Change Password'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Wifi Page')}
            /> 
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
              title='Profile'
              titleInfo='Edit Info'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => navigate('Edit')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/notifications.png')}/>}
              title='Log out'
              onPress={() => alert('Route To Notifications Page')}
            />
          </SettingsList>
        </View>
      </View>
    );
  }

  onValueChange(value){
    this.setState({switchValue: value});
    if(!this.state.switchValue) {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
            }
        );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
      requestCameraPermission();
      this.onStart();
    }
    else this.onStop();
  }

  onStart() {
    this.state.timer = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          FB.database().ref("tracking/live/"+FB.auth().currentUser.uid).update({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          global.location = "on";
        },
        error => alert(error.message),
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 1
        }
      );
    }, 5000);
  }

  onStop() {
    clearInterval(this.state.timer);
    global.location = "off";
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#EFEFF4',
    flex:1,
  },
});