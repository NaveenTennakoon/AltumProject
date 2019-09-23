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
        FB.database().ref("orders").once('value', function(snapshot) {
          snapshot.forEach(function (childSnapshot){
            if (childSnapshot.val().Salesperson == global.username) {
              // Code to pending orders will be shown here
            }
          });
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
                  <View style={styles.ordersContainer}>
                    <View style={styles.orders}>
                      <Text>Pending Orders</Text>
                    </View>
                  </View>       
                </View>        
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
    marginTop:10,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#595959",
    fontWeight: "600"
  },
  info:{
    fontSize:20,
    color: "#00BFFF",
    marginTop:5
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  ordersContainer: {
    marginTop:35,
    height:150,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:300,
    borderRadius:5,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderColor: "#999999",
  },
  orders: {
    alignItems: 'center',
  },
});