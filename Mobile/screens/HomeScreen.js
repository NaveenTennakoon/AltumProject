import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';

import FB from '../components/FB';

export default class ProfileScreen extends Component {

    constructor(props){
		super(props)
		this.state = {
      pending: [{id: 1}, {id: 2}, {id: 3}],
		},
      global.firstname = '';
      global.lastname = '';
    }
    
    loadDetails=()=>{
        let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
        userdetails.on('value', function(snapshot) {
          if (snapshot.val().type != 'salesperson'){
            alert("This email is not registered to a Salesperson");
          }
          else{
            global.firstname = snapshot.val().firstName;
            global.lastname = snapshot.val().lastName;
          }	
        });
        let items = [];
        FB.database().ref("orders").once('value', function(snapshot) {
          snapshot.forEach(function (childSnapshot){
            if (childSnapshot.val().salesperson == FB.auth().currentUser.uid && childSnapshot.val().Status == 'Pending') {
              items.push({
                id: childSnapshot.key,
                customer: childSnapshot.val().Customer,
                total: childSnapshot.val().Total,
              });
            }
          });
        })
    }
    
    render(){
      this.loadDetails();
      return (
      <View style={styles.container}>
        <View style={styles.header}>
        <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
        <Text style={styles.name}>{global.username}</Text>
          <Text style={styles.info}>Salesperson</Text>
        </View>
        <FlatList
          data={this.state.pending}
          //Item Separator View
          renderItem={({ item }) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <View>
              <Text
                style={styles.item}>
                {item.id}
              </Text>
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BBFF",
    height:100,
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'flex-start',
    position: 'absolute',
    margin:10
  },
  name:{
    fontSize:24,
    color:"#000066",
    fontWeight:'700',
    marginLeft: 70,
  },
  body:{
    marginTop:10,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  info:{
    fontSize:18,
    color: "#FFF",
    fontWeight: '700',
  },
  description:{
    fontSize:16,
    color: "#FFF",
    marginTop: 3,
    textAlign: 'center'
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },
 
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});