import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';

import FB from '../components/FB';

export default class Login extends Component {

	constructor(props){
		super(props)
		this.state = {
			username : '',
      password : '',
      hidePassword: true,
		},
		global.username = '';
	}

	login(){
		const {navigate} = this.props.navigation;
		let user = this.state.username;
		let pwd = this.state.password;
		FB.auth().signInWithEmailAndPassword(user, pwd).then(function(){
			let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
			userdetails.on('value', function(snapshot) {
				if (snapshot.val().type != 'salesperson'){
					alert("This email is not registered to a Salesperson");
				}
				else{
					global.username = snapshot.val().firstName+" "+snapshot.val().lastName;
					alert("Welcome"+" "+snapshot.val().firstName+" "+snapshot.val().lastName);
					navigate('tNav');
				}	
			});
		  }).catch(function(error){
			  // Handle Errors here.
			  var errorMessage = error.message;
			  window.alert(errorMessage);
		  });
  } 
  
  managePasswordVisibility = () =>
  {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  render() {
	const {navigate} = this.props.navigation;
	return (
		<KeyboardAvoidingView behaviour="padding" style={styles.container}>
				<Image style={styles.bgImage} source={{ uri: "https://cdn2.f-cdn.com/contestentries/68791/9261050/5337f7fab2996_thumb900.jpg" }}/>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../img/logo.png')}/>
        </View>
				<View style={styles.inputContainer}>
					<TextInput style={styles.inputs}
						placeholder="Email"
						keyboardType="email-address"
						underlineColorAndroid='transparent'
						autoCapitalize="none"
						returnKeyType="next"
						autoCorrect={false}
						onSubmitEditing={() => this.passwordInput.focus()}
						onChangeText={(username) => this.setState({username})}></TextInput>
					<Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/email.png'}}/>
				</View>       
				<View style={styles.inputContainer}>
					<TextInput style={styles.inputs}
						placeholder="Password"
						secureTextEntry={this.state.hidePassword}
						underlineColorAndroid='transparent'
						returnKeyType="go"
						ref={(input) => this.passwordInput = input}
						onChangeText={(password) => this.setState({password})}>
          </TextInput>
          <TouchableOpacity activeOpacity = { 0.8 } style = { styles.visibilityBtn } onPress = { this.managePasswordVisibility }>
            <Image source = { ( this.state.hidePassword ) ? {uri: 'https://img.icons8.com/nolan/64/000000/sleepy-eyes.png'} : {uri: 'https://img.icons8.com/nolan/64/000000/visible.png'} } style = { styles.inputIcon } />
          </TouchableOpacity>
					{/* <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/key.png'}}/> */}
				</View>
				<TouchableOpacity style={styles.btnForgotPassword} onPress={() => navigate('Reset')}>
					<Text style={styles.btnText}>Forgot your password?</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={()=>this.login()}>
				<Text style={styles.loginText}>Login</Text>
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
  logoContainer:{
    justifyContent: 'center',
    marginBottom: 120,
  },
  logo:{
    width: 200,
    height: 120,
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
  btnForgotPassword: {
    height:15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom:10,
    width:300,
    backgroundColor:'transparent'
  },
  loginButton: {
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
  }
}); 

