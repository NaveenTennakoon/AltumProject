import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

import FB from '../components/FB';

export default class ProfileScreen extends Component {

    constructor(props){
      super(props)
      this.state = {
        telephone: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
      }
    }
    
  componentDidMount(){
    let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
    userdetails.once('value').then((snapshot) => {
        if (snapshot.val().type != 'salesperson'){
            alert("This email is not registered to a Salesperson");
        }
        else{
          this.setState({telephone: snapshot.val().telephone})
          this.setState({firstName: snapshot.val().firstName})
          this.setState({lastName: snapshot.val().lastName})
          this.setState({address: snapshot.val().address})
          this.setState({email: snapshot.val().email})
        }	
    });
  }
    
    render(){
      const {navigate} = this.props.navigation;
        return (
        <View>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{this.state.firstName+' '+this.state.lastName}</Text>
                <Text style={styles.info}>Salesperson</Text>
                <View style={styles.inputContainer}>
                  <Icon style={styles.inputIcon} size={25} name={'ios-call'}/> 
                    <TextInput style={styles.inputs}
                      placeholder="Telephone"
                      underlineColorAndroid='transparent'
                      onChangeText={(telephone) => this.setState({telephone})}
                      value={this.state.telephone}
                      editable={false}
                    />
                </View>
                <View style={styles.inputContainer}>
                  <Icon style={styles.inputIcon} size={25} name={'ios-mail'}/> 
                    <TextInput style={styles.inputs}
                      placeholder="Email"
                      underlineColorAndroid='transparent'
                      onChangeText={(email) => this.setState({email})}
                      value={this.state.email}
                      editable={false}
                    />
                </View>   
                <View style={styles.inputContainer}>
                  <Icon style={styles.inputIcon} size={25} name={'ios-home'}/> 
                    <TextInput style={styles.inputs}
                      placeholder="Address"
                      underlineColorAndroid='transparent'
                      onChangeText={(address) => this.setState({address})}
                      value={this.state.address}
                      editable={false}
                    />
                </View>    
                <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate('Edit')}>
                  <Text style={styles.btnText}>Edit Profile</Text>  
                </TouchableOpacity>  
              </View>            
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#000000",
    height: 180,
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
    marginTop: 110
  },
  body:{
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name:{
    fontSize: 28,
    color: "#555555",
    fontWeight: "700"
  },
  info:{
    fontSize: 17,
    color: "#999999",
    marginTop: 10,
    marginBottom: 30,
    fontWeight: "700"
  },
  buttonContainer: {
    marginTop: 20,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#000000",
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: '700',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    width:340,
    height:50,
    marginBottom:15,
    flexDirection: 'row',
    alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      flex:1,
      color: "#555555"
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
});