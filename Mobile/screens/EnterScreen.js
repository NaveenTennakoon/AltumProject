import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

export default class EnterScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      shop_name: '',
      customer_name: '',
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
              onChangeText={(shop_name) => this.setState({shop_name})}/>
        </View>      
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} size={25} name={'ios-peron'}/>
          <TextInput style={styles.inputs}
              placeholder="Customer Name"
              underlineColorAndroid='transparent'
              onChangeText={(customer_name) => this.setState({customer_name})}/>
        </View>     
        <View style={styles.inputContainer}>
        <Icon style={styles.inputIcon} size={25} name={'ios-pin'}/>
          <TextInput style={[ styles.inputs]}
              placeholder="Address"
              underlineColorAndroid='transparent'
              multiline = {true}
              onChangeText={(address) => this.setState({address})}/>
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
    backgroundColor: '#DCDCDC',
  },
  logo:{
    width:120,
    height:120,
    justifyContent: 'center',
    marginBottom:20,
  },
  inputContainer: {
      borderBottomColor: '#F5FCFF',
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
      borderBottomColor: '#FFFFFF',
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
    backgroundColor: "#6199f6",
  },
  buttonText: {
    color: 'white',
  }
}); 