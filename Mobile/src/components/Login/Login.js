import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, TouchableOpacity, KeyboardAvoidingView} from 'react-native';
import FBconfig from '../../firebase/fbconf';

export default class Login extends Component {
	constructor(props){
		super(props)
		this.state = {
			username : '',
			password : ''
		}
	}

	login(){
		let user = this.state.username;
		let pwd = this.state.password;
		FBconfig.auth().signInWithEmailAndPassword(user, pwd).then(function(){
			alert(this.state.username);
		  }).catch(function(error){
			  // Handle Errors here.
			  var errorMessage = error.message;
			  window.alert(errorMessage);
		  });
	} 

	alertf(){
		alert("fuck");
	}

  render() {
	return (
	  <KeyboardAvoidingView behavior="padding" style={styles.container}>
		<View style={styles.logoContainer}>
			<Image style={styles.logo} source={require('../../images/logo.png')}></Image>
		</View>
		<View style={styles.formContainer}>
			<TextInput
				placeholder="Username" 
				returnKeyType="next"
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
				onChangeText={username => this.setState({username})}
				onSubmitEditing={() => this.passwordInput.focus()}
				style={styles.input}></TextInput>
			<TextInput
				placeholder="Password" 
				secureTextEntry
				returnKeyType="go"
				ref={(input) => this.passwordInput = input}
				style={styles.input}></TextInput>
			<TouchableOpacity
				onPress={()=>alertf()} 
				style={styles.buttonContainer}>
				<Text style={styles.buttonText}>LOGIN</Text>
			</TouchableOpacity>
		</View>
	  </KeyboardAvoidingView>
	);
  }
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#3498db',
		flex: 1
	},
	logoContainer: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	},
	logo: {
		width: 330,
		height: 200
	},
	formContainer: {
		padding: 20
	},
	input: {
		height: 50,
		backgroundColor: 'rgba(255,255,255,0.2)',
		marginBottom: 20,
		paddingHorizontal: 10,
		color: '#FFF'
	},
	buttonContainer: {
		backgroundColor: '#2980b9',
		paddingVertical: 15
	},
	buttonText: {
		textAlign: 'center',
		color: '#FFF',
		fontWeight: '700'
	}
});

