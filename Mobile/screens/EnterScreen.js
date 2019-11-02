import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import Geolocation from 'react-native-geolocation-service';

import FB from '../components/FB';

export default class EnterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: null,
      shop_name: null,
      customer_name: null,
    }
  }

  enterLocation() {
    if(!global.location){
      global.location = "off";
    }
    const {navigate} = this.props.navigation;
    if(global.location == "off"){
      alert("Please turn on GPS location");
      navigate('Settings');
    }   
    else{
      if(!this.state.address || !this.state.shop_name || !this.state.customer_name){
        alert("All fields are required");
      }
      else{
        Geolocation.getCurrentPosition(
          position => {
            FB.database().ref("tracking/locations/").push({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              shopname: this.state.shop_name,
              customer: this.state.customer_name,
              address : this.state.address,
              salesperson: FB.auth().currentUser.uid,
            });
            Alert.alert("Success", "Location entered successfully");
            this.setState({
              address: null,
              shop_name: null,
              customer_name: null
            })
            this.shopInput.focus()
          },
          error => alert(error.message),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 1
          }
        );  
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={{uri: 'https://png.icons8.com/google/color/120'}}/>

        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} size={25} name={'ios-cart'}/> 
          <TextInput style={styles.inputs}
              placeholder="Shop Name"
              underlineColorAndroid='transparent'
              ref={(input) => this.shopInput = input}
              returnKeyType="next"
              onChangeText={(shop_name) => this.setState({shop_name})}
              value={this.state.shop_name}
              onSubmitEditing={() => this.customerInput.focus()}/>
        </View>      
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} size={25} name={'ios-person'}/>
          <TextInput style={styles.inputs}
              placeholder="Customer Name"
              underlineColorAndroid='transparent'
              ref={(input) => this.customerInput = input}
              returnKeyType="next"
              onChangeText={(customer_name) => this.setState({customer_name})}
              value={this.state.customer_name}
              onSubmitEditing={() => this.addressInput.focus()}/>
        </View>     
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} size={25} name={'ios-pin'}/>
          <TextInput style={[ styles.inputs]}
              placeholder="Address"
              underlineColorAndroid='transparent'
              multiline = {true}
              ref={(input) => this.addressInput = input}
              onChangeText={(address) => this.setState({address})}
              value={this.state.address}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]} onPress={() => this.enterLocation()}>
          <Text style={styles.buttonText}>Enter Location</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo:{
    width:120,
    height:120,
    justifyContent: 'center',
    marginBottom:20,
  },
  inputContainer: {
      borderBottomColor: '#777777',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:340,
      height:50,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:200,
    borderRadius:30,
  },
  sendButton: {
    backgroundColor: "#000000",
  },
  buttonText: {
    color: 'white',
  }
}); 