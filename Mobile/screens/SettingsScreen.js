import React, { Component } from 'react';
import { View, StyleSheet, PermissionsAndroid, AsyncStorage, Alert, Image, Text, Platform, ToastAndroid } from "react-native";
import SettingsList from 'react-native-settings-list';
import Geolocation, { clearWatch, stopObserving } from 'react-native-geolocation-service';
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
      updatesEnabled: false,
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

  hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }

  getLocationUpdates = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) return;
    this.setState({ updatesEnabled: true }, () => {
      global.location = 'on';
      this.watchId = Geolocation.watchPosition(
        (position) => {
          this.setState({ lat: position.coords.latitude, lng: position.coords.longitude, });
          FB.database().ref("tracking/live/"+FB.auth().currentUser.uid).update({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            status: 'active'
          });
        },
        (error) => {
          this.setState({ location: error });
          console.log(error);
        },
        { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000 }
      );
    });
  }

  removeLocationUpdates = () => {
      if (this.watchId !== null) {
          Geolocation.clearWatch(this.watchId);
          global.location = 'off';
          this.setState({ updatesEnabled: false })
          FB.database().ref("tracking/live/"+FB.auth().currentUser.uid).update({
            status: 'inactive'
          });
      }
  }

  onValueChange = (value) => {
    this.setState({switchValue: value});
    if(!this.state.switchValue) {
      ToastAndroid.show('Location services are now active', ToastAndroid.LONG);
      this.getLocationUpdates();
    }
    else {
      ToastAndroid.show('GPS Tracking deactivated', ToastAndroid.LONG);
      this.removeLocationUpdates();
    }
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