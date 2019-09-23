import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';

import FB from '../components/FB';

export default class Login extends Component {

	constructor(props){
		super(props)
		this.state = {
			username : '',
		}
	}

	reset(){
		let user = this.state.username;
		firebase.auth().sendPasswordResetEmail(user).then(function() {
            // Email sent.
            alert("Link is successfully sent to your email address. Check your inbox");
            navigate('Login');
          }).catch(function(error) {
            // An error happened.
            let errorMessage = error.message;
            alert(errorMessage);
          });
	} 

  render() {
    const {navigate} = this.props.navigation;
	return (
		<KeyboardAvoidingView behaviour="padding" style={styles.container}>
				<Image style={styles.bgImage} source={{ uri: "https://lorempixel.com/900/1400/nightlife/2/" }}/>
				<Text style={styles.textByReset}>We get it. Things do happen. Have you forgot your password? Enter the email address below and we will email a password reset link</Text>   
				<View style={styles.inputContainer}>
					<TextInput style={styles.inputs}
						placeholder="Email Address"
						underlineColorAndroid='transparent'
						returnKeyType="go"
						onChangeText={(username) => this.setState({username})}></TextInput>
					<Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/key.png'}}/>
				</View>
				<TouchableOpacity style={[styles.buttonContainer, styles.resetButton]} onPress={()=>this.reset()}>
				<Text style={styles.loginText}>Submit Request</Text>
				</TouchableOpacity>
                <TouchableOpacity style={styles.btnRevert} onPress={() => navigate('Login')}>
					<Text style={styles.btnText}>back to Login</Text>
				</TouchableOpacity>
      	</KeyboardAvoidingView>
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
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:340,
    height:50,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
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
    marginRight:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:340,
    borderRadius:30,
    backgroundColor:'transparent'
  },
  btnRevert: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom:10,
    width:300,
    backgroundColor:'transparent'
  },
  resetButton: {
    backgroundColor: "#00b5ec",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: 'white',
  },
  bgImage:{
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btnText:{
    color:"white",
	fontSize: 15,
  },
  textByReset:{
    color:"white",
    textAlign:'center',
    marginHorizontal: 30,
    marginBottom: 30,
    fontSize: 18,

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
}); 

