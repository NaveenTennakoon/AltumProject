import React, { Component } from 'react';
import { View, StyleSheet, PermissionsAndroid, AsyncStorage, Alert, Image, Text, TouchableOpacity } from "react-native";
import SettingsList from 'react-native-settings-list';
import Geolocation from 'react-native-geolocation-service';
import Dialog from "react-native-dialog";

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
      dialogVisible: false,
      pwd: '',
      newPwd: '',
      cNewPwd: '',
    };
    global.location = 'off';
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
 
  handleSave = () => {
    let user = FB.auth().currentUser;
    if(this.state.pwd == global.pwd && this.state.newPwd == this.state.cNewPwd){
      user.updatePassword(this.state.newPwd).then(function() {
        alert("Password updated successfully")
      }).catch(function(error) {
        alert(error.message);
      });
    }
    else{
      alert("Something wrong with the details you entered");
    }

    this.setState({ dialogVisible: false });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
          <SettingsList.Item
            icon={
              <Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/material/24/000000/worldwide-location--v1.png"}}/>
            }
            hasSwitch={true}
            
            switchState={this.state.switchValue}
            switchOnValueChange={this.onValueChange}
            hasNavArrow={false}
            title='GPS Location'
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/material/64/000000/point-objects.png"}}/>}
            title='My Locations'
            onPress={() => navigate('Locations')}
          />
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/purchase-order.png"}}/>}
            title='Orders'
            titleInfo='Record a transaction'
            onPress={() => alert('Route To Control Center Page')}
          />
          <SettingsList.Header headerStyle={{marginTop:15}}/>

          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/key--v1.png"}}/>}
            title='Change Password'
            onPress={() => this.showDialog()}
          /> 
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/user--v1.png"}}/>}
            title='Profile'
            titleInfo='Edit Info'
            onPress={() => navigate('Edit')}
          />
          <SettingsList.Header headerStyle={{marginTop:15}}/>
          <SettingsList.Item
            icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/material/64/000000/exit.png"}}/>}
            title='Log out'
            onPress={()=>
              Alert.alert(
                'Log out',
                'Do you want to logout?',
                [
                  {text: 'Cancel', onPress: () => {return null}},
                  {text: 'Confirm', onPress: () => {
                    AsyncStorage.clear();
                    navigate('Login')
                  }},
                ],
                { cancelable: false }
              )  
            }
          />
        </SettingsList>
        <View style={styles.footer}>
          <Text>&#9400;Altum Inc</Text>
        </View>
        <View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title style={styles.popupHead}>Change Password</Dialog.Title>
            <Dialog.Description>
              Enter below info to save a new password
            </Dialog.Description>
            <Dialog.Input  style={styles.popupInput} label="Current password" onChangeText={(pwd) => this.setState({pwd})}/>
            <Dialog.Input style={styles.popupInput} label="New password" onChangeText={(newPwd) => this.setState({newPwd})}/>
            <Dialog.Input style={styles.popupInput} label="Confirm new password" onChangeText={(cNewPwd) => this.setState({cNewPwd})}/>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Save" onPress={this.handleSave} />
          </Dialog.Container>
        </View>
      </View>
    );
  }

  onStart = () => {
    this.state.timer = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          FB.database().ref("tracking/live/"+FB.auth().currentUser.uid).update({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            status: 'active'
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

  onStop = () => {
    FB.database().ref("tracking/live/"+FB.auth().currentUser.uid).update({
      status: 'inactive'
    });
    clearInterval(this.state.timer);
    global.location = "off";
  }

  onValueChange = (value) => {
    this.setState({switchValue: value});
    if(!this.state.switchValue) {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                'title': 'Location Access Required',
                'message': 'This App needs to Access your location'
            }
        );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            alert("Location services are now active");
          }
        } catch (err) {
          alert(err)
        }
      }
      requestLocationPermission();
      this.onStart();
    }
    else this.onStop();
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#EFEFF4',
    flex:1,
  },
  imageStyle:{
    width: 25,
    height: 25,
    alignSelf: 'center',
    marginLeft: 15,
  },
  footer:{
    alignSelf: 'center',
    marginBottom: 20,
  },
  popupHead:{
    fontWeight: '700',
    marginBottom: 15,
  },
  popupInput:{
    borderBottomWidth: 1,
    borderColor: "#009988",
  },
});