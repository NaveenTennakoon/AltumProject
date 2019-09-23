import React, { Component } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid } from "react-native";
import SettingsList from 'react-native-settings-list';
import Geolocation from 'react-native-geolocation-service';

import NavHeader from "../components/NavHeader";
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
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
        <NavHeader navigation={this.props.navigation} title="Settings"/>
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
              title='Password'
              titleInfo='Change the Password'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Wifi Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
              title='Profile'
              titleInfo='Edit Info'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Bluetooth Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/cellular.png')}/>}
              title='Cellular'
              onPress={() => alert('Route To Cellular Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/hotspot.png')}/>}
              title='Personal Hotspot'
              titleInfo='Off'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route To Hotspot Page')}
            />
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/notifications.png')}/>}
              title='Notifications'
              onPress={() => alert('Route To Notifications Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
              title='Control Center'
              onPress={() => alert('Route To Control Center Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/dnd.png')}/>}
              title='Do Not Disturb'
              onPress={() => alert('Route To Do Not Disturb Page')}
            />
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/general.png')}/>}
              title='General'
              onPress={() => alert('Route To General Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/display.png')}/>}
              title='Display & Brightness'
              onPress={() => alert('Route To Display Page')}
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
          alert("Latitude : " + this.state.lat+" Longitude : " + this.state.lng);
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
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#EFEFF4',
    flex:1,
  },
});