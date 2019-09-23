import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import FB from '../components/FB';

export default class ProfileScreen extends Component {

    constructor(props){
		super(props)
		this.state = {

		},
        global.firstname = '';
        global.lastname = '';
        global.telephone = '';
        global.address = '';
    }
    
    loadDetails(){
        let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
        userdetails.on('value', function(snapshot) {
            if (snapshot.val().type != 'salesperson'){
                alert("This email is not registered to a Salesperson");
            }
            else{
                global.firstname = snapshot.val().firstName;
                global.lastname = snapshot.val().lastName;
                global.telephone = snapshot.val().telephone;
                global.address = snapshot.val().address;
            }	
        });
    }
    
    render(){
        this.loadDetails();
        return (
        <View style={styles.container}>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                  <Text style={styles.name}>{global.username}</Text>
                  <Text style={styles.info}>Salesperson</Text>
                  <Text style={styles.description}>{global.telephone}</Text>
                  <Text style={styles.description}>{global.address}</Text>      
              </View>
              <TouchableOpacity style={styles.buttonContainer}>
              <Text>Edit Profile</Text>  
              </TouchableOpacity>              
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});