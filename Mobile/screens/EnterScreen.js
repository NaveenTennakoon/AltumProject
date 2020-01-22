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
        let now = new Date()
        let nowstamp = now.getFullYear()+(now.getMonth()+1)+now.getDate()+now.getHours()+now.getMinutes()+now.getSeconds()
        let timestamp = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()
        let str = firebase.auth().currentUser.uid+date.getTime()
        let hash = str.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a&a}, 0)
        Geolocation.getCurrentPosition(
          position => {
            FB.database().ref("tracking/locations/").push({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              shopname: this.state.shop_name,
              customer: this.state.customer_name,
              address : this.state.address,
              salesperson: FB.auth().currentUser.uid,
              dateString: nowstamp,
              timestamp: timestamp,
              id: hash,
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
        <View style={styles.header}></View>
        <Image style={styles.logo} source={{uri: "https://img.icons8.com/material-rounded/480/000000/user-location.png"}}/>
        <View style={styles.body}>
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

          <TouchableHighlight style={[styles.buttonContainer, styles.sendButton]} onPress={() => {
              Alert.alert(
                'Confirm',
                'Do you want to record the location?',
                [
                  {text: 'Cancel', onPress: () => {return null}},
                  {text: 'Confirm', onPress: () => {
                    this.enterLocation();
                  }},
                ],
                { cancelable: false }
              ) 
            }}>
            <Text style={styles.buttonText}>Enter Location</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  header:{
    backgroundColor: "#000000",
    height: 160,
    width: '100%',
  },
  logo:{
    width:120,
    height:120,
    justifyContent: 'center',
    marginBottom:20,
    alignSelf:'center',
    position: 'absolute',
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 45,
    backgroundColor: "white",
    marginTop: 100,
  },
  body:{
    marginTop: 90,
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
      alignItems:'center',
      alignSelf: 'center',
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
    marginTop: 60,
    width: 200,
    borderRadius: 30,
    alignSelf: 'center',
  },
  sendButton: {
    backgroundColor: "#000000",
  },
  buttonText: {
    color: 'white',
  }
}); 