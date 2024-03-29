import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import FB from '../components/FB';

export default class Login extends Component {

  constructor(props) {
    super(props)
    // state variables
    this.state = {
      username: '',
      password: '',
      hidePassword: true,
      spinner: true,
    }
  }

  async componentDidMount() {
    // check for current user and navigate to home if a current session is present
    let user = FB.auth().currentUser;
    if (user) {
      this.setState({ spinner: false })
      this.props.navigation.navigate('tNav');
    }
    else
      this.setState({ spinner: false });
  }

  login() {
    let user = this.state.username;
    let pwd = this.state.password;
    // login using credentials provided
    FB.auth().signInWithEmailAndPassword(user, pwd).then(() => {
      // Successful sign in
      this.updateDetails();
    }).catch((error) => {
      // Handle Errors here.
      var errorMessage = error.message;
      this.setState({ spinner: false })
      alert(errorMessage);
    });
  }

  updateDetails = async () => {
    let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
    userdetails.on('value', async (snapshot) => {
      // show error if user is not a salesperson
      if (snapshot.val().type != 'salesperson') {
        this.setState({ spinner: false })
        alert("This email is not registered to a Salesperson");
      }
      else {
        // if salesperson account is active successful login
        if (snapshot.val().status == 'active') {
          // set password to async storage
          await AsyncStorage.setItem('password', this.state.password.toString());

          let username = snapshot.val().firstName + " " + snapshot.val().lastName;
          await AsyncStorage.setItem('username', username.toString());
          alert("Welcome" + " " + snapshot.val().firstName + " " + snapshot.val().lastName);
          this.setState({ spinner: false })
          this.props.navigation.navigate('tNav');
        }
        // if inactive show error
        else {
          this.setState({ spinner: false })
          alert("This account has been deactivated by Altum")
        }
      }
    })
  }

  // password visibility toggle
  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behaviour="padding" style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <Image style={styles.bgImage} source={{ uri: "https://cdn2.f-cdn.com/contestentries/68791/9261050/5337f7fab2996_thumb900.jpg" }} />
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../img/logo.png')} />
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
            onChangeText={(username) => this.setState({ username })}></TextInput>
          <Image style={styles.inputIcon} source={{ uri: "https://img.icons8.com/nolan/64/000000/filled-message.png" }} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="Password"
            secureTextEntry={this.state.hidePassword}
            underlineColorAndroid='transparent'
            returnKeyType="go"
            ref={(input) => this.passwordInput = input}
            onChangeText={(password) => this.setState({ password })}>
          </TextInput>
          <TouchableOpacity activeOpacity={0.8} style={styles.visibilityBtn} onPress={this.managePasswordVisibility}>
            <Image source={(this.state.hidePassword) ? { uri: 'https://img.icons8.com/nolan/64/000000/sleepy-eyes.png' } : { uri: 'https://img.icons8.com/nolan/64/000000/visible.png' }} style={styles.inputIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnForgotPassword} onPress={() => navigate('Reset')}>
          <Text style={styles.fgtText}>Forgot your password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={() => {
          this.setState({ spinner: true });
          this.login()
        }}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

// styles for the components in the render screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  logoContainer: {
    justifyContent: 'center',
    marginBottom: 120,
  },
  logo: {
    width: 200,
    height: 120,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: 340,
    height: 50,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 340,
    borderRadius: 30,
    backgroundColor: 'transparent'
  },
  btnForgotPassword: {
    height: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 10,
    width: 300,
    backgroundColor: 'transparent'
  },
  loginButton: {
    backgroundColor: "#000000",

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
    fontSize: 16,
    fontWeight: '700',
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  fgtText: {
    color: "white",
    fontSize: 15,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

