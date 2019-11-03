import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

import FB from '../components/FB';

export default class EditScreen extends Component {

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
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
                <View style={styles.body}>
                <View style={styles.bodyContent}>
                    <View style={styles.inputContainer}>
                    <Icon style={styles.inputIcon} size={25} name={'ios-person'}/> 
                        <TextInput style={styles.inputs}
                            placeholder="First Name"
                            underlineColorAndroid='transparent'
                            onChangeText={(firstName) => this.setState({firstName})}
                            value={this.state.firstName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                    <Icon style={styles.inputIcon} size={25} name={'ios-person'}/> 
                        <TextInput style={styles.inputs}
                            placeholder="Last Name"
                            underlineColorAndroid='transparent'
                            onChangeText={(lastName) => this.setState({lastName})}
                            value={this.state.lastName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                    <Icon style={styles.inputIcon} size={25} name={'ios-call'}/> 
                        <TextInput style={styles.inputs}
                            placeholder="Telephone"
                            underlineColorAndroid='transparent'
                            onChangeText={(telephone) => this.setState({telephone})}
                            value={this.state.telephone}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                    <Icon style={styles.inputIcon} size={25} name={'ios-mail'}/> 
                        <TextInput style={styles.inputs}
                            placeholder="Email"
                            underlineColorAndroid='transparent'
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                        />
                    </View>   
                    <View style={styles.inputContainer}>
                    <Icon style={styles.inputIcon} size={25} name={'ios-home'}/> 
                        <TextInput style={styles.inputs}
                            placeholder="Address"
                            underlineColorAndroid='transparent'
                            onChangeText={(address) => this.setState({address})}
                            value={this.state.address}
                        />
                    </View>    
                    <TouchableOpacity style={styles.buttonContainer} 
                        onPress={() => 
                            Alert.alert(
                                'Confirm',
                                'Do you want to update the profile?',
                                [
                                  {text: 'Cancel', onPress: () => {return null}},
                                  {text: 'Confirm', onPress: () => {
                                    let fname = this.state.firstName;
                                    let lname = this.state.lastName;
                                    let telephone = this.state.telephone;
                                    let email = this.state.email;
                                    let address = this.state.address;
                                    let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
                                    userdetails.update({
                                        firstName: fname,
                                        lastName: lname,
                                        telephone: telephone,
                                        email: email,
                                        address: address,
                                    }).then(()=>{
                                        alert("Profile updated successfully")
                                    }).catch(function(error){
                                        let errorMessage = error.message;
                                        alert(errorMessage);
                                    })
                                    }
                                  },
                                ],
                                { cancelable: false }
                              ) 
                        }>
                    <Text style={styles.btnText}>Save</Text>  
                    </TouchableOpacity>  
                </View>            
            </View>
        </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    }, 
    header:{
        backgroundColor: "#000000",
        height:90,
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
        marginTop:20
    },
    body:{
        marginTop:100,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    buttonContainer: {
        marginTop:30,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
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
        marginBottom:10,
        flexDirection: 'row',
        alignItems:'center'
    },
    inputs:{
        height: 45,
        marginLeft: 16,
        flex: 1,
        color: "#555555",
    },
    inputIcon:{
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
});