import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import FB from '../components/FB';

export default class Login extends Component {

  constructor(props) {
    super(props)
    // state variables
    this.state = {
      fog_username: '',
    }
  }

  reset() {
    // navigation object from props
    const { navigate } = this.props.navigation;
    let fog_user = this.state.fog_username;
    // send password reset mail
    FB.auth().sendPasswordResetEmail(fog_user).then(function () {
      // Email sent
      alert("Link is successfully sent to your email address. Check your inbox");
      navigate('Login');
    }).catch(function (error) {
      // An error happened
      let errorMessage = error.message;
      alert(errorMessage);
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView behaviour="padding" style={styles.container}>
        <Image style={styles.bgImage} source={{ uri: "https://cdn2.f-cdn.com/contestentries/68791/9261050/5337f7fab2996_thumb900.jpg" }} />
        <Text style={styles.textByReset}>We get it. Things do happen. Have you forgot your password? Enter the email address below and we will email a password reset link</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="Email Address"
            underlineColorAndroid='transparent'
            returnKeyType="go"
            onChangeText={(fog_username) => this.setState({ fog_username })}></TextInput>
          <Image style={styles.inputIcon} source={{ uri: "https://img.icons8.com/nolan/64/000000/filled-message.png" }} />
        </View>
        <TouchableOpacity style={[styles.buttonContainer, styles.resetButton]} onPress={() => this.reset()}>
          <Text style={styles.loginText}>Submit Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRevert} onPress={() => navigate('Login')}>
          <Text style={styles.btnText}>back to Login</Text>
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
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 340,
    height: 50,
    marginBottom: 20,
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
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 340,
    borderRadius: 30,
    backgroundColor: 'transparent'
  },
  btnRevert: {
    height: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
    width: 300,
    backgroundColor: 'transparent'
  },
  resetButton: {
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
  btnText: {
    color: "white",
    fontSize: 15,
  },
  textByReset: {
    color: "white",
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
    fontSize: 18,

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  }
});

