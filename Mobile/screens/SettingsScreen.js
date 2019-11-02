import React, { Component } from 'react';
import { View, StyleSheet, PermissionsAndroid, AsyncStorage, Alert, Image } from "react-native";
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
    };
    global.location = 'off';
  }
  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
 
  handleConfirm = () => {
    if(this.state.pwd == global.pwd){
      usersRef.child(firebase.auth().currentUser.uid).remove().then(() => {
        firebase.auth().currentUser.delete().then(() => {
          navigate('Login')
        }).catch(function(error){
          alert(error.message);
        })
      })
    }
    else{
      alert("Wrong password entered")
    }
    this.setState({ dialogVisible: false });
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
            <SettingsList.Item
              icon={
                <Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/material/64/000000/worldwide-location--v1.png"}}/>
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
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => navigate('Locations')}
            />
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/purchase-order.png"}}/>}
              title='Order'
              titleInfo='View Pending order'
              onPress={() => alert('Route To Control Center Page')}
            />
            <SettingsList.Header headerStyle={{marginTop:15}}/>

            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/key--v1.png"}}/>}
              title='Change Password'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Wifi Page')}
            /> 
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/user--v1.png"}}/>}
              title='Profile'
              titleInfo='Edit Info'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => navigate('Edit')}
            />
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
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              icon={<Image style={styles.imageStyle} source={{uri: "https://img.icons8.com/ios-glyphs/64/000000/shutdown.png"}}/>}
              title='Sign out'
              onPress={()=>
                Alert.alert(
                  'Log out',
                  'Are you sure you want to Signout?',
                  [
                    {text: 'Cancel', onPress: () => {return null}},
                    {text: 'Confirm', onPress: () => {
                      this.showDialog()
                    }},
                  ],
                  { cancelable: false }
                ) 
              }
            />
          </SettingsList>
        </View>
        <View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title>Approve Delete</Dialog.Title>
            <Dialog.Description>
              Do you want to delete this account? You cannot undo this action.
            </Dialog.Description>
            <Dialog.Input label="Type Password" onChangeText={(pwd) => this.setState({pwd})}>
            </Dialog.Input>
            <Dialog.Button label="Cancel" onPress={this.handleCancel}/>
            <Dialog.Button label="Confirm" onPress={this.handleConfirm}/>
          </Dialog.Container>
        </View>
      </View>
    );
  }

  onValueChange(value){
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
            alert("Location services are now active")
          }
        } catch (err) {
          console.warn(err);
        }
      }
      requestLocationPermission();
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

  onStop() {
    FB.database().ref("tracking/live/"+FB.auth().currentUser.uid).update({
      status: 'inactive'
    });
    clearInterval(this.state.timer);
    global.location = "off";
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
});