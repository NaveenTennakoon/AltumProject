import React, { Component } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';

export default class Dashboard extends Component {
	constructor(props){
		super(props)
		this.state = {

		}
	} 

  render() {
	return (
	  <KeyboardAvoidingView behavior="padding" style={styles.container}>
		<Text>Hello</Text>
	  </KeyboardAvoidingView>
	);
  }
}

const styles = StyleSheet.create({
	
});

