import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, TextInput, Alert, PermissionsAndroid, ToastAndroid, Platform, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import { Avatar } from 'react-native-elements';

import FB from '../components/FB';

// Prepare Blob support
const Fetch = RNFetchBlob.polyfill.Fetch
// replace built-in fetch
window.fetch = new Fetch({
    auto : true,
    binaryContentTypes : [
        'image/',
        'video/',
        'audio/',
        'foo/',
    ]
}).build()
const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class ProfileScreen extends Component {

    constructor(props){
      super(props)
      this.state = {
        telephone: '',
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        avatarSource: 'empty',
        visible: false,
        editable: false,
      }
      this.toggleEditable = this.toggleEditable.bind(this)
    }
    
  async componentWillMount(){
    const ref = FB.storage().ref('profilePics/'+FB.auth().currentUser.uid)
    const url = await ref.getDownloadURL()
    this.setState({ avatarSource: url })
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

  toggleEditable() {
    this.setState({
      editable: !this.state.editable
    })
  }

  uploadImage(uri, mime = 'image/jpeg') {
    return new Promise((resolve, reject) => {
      this.setState({visible:true});
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      let uploadBlob = null
      const uid = FB.auth().currentUser.uid
      const imageRef = FB.storage().ref('profilePics').child(uid)

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })      
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          this.setState({ avatarSource: url })
          resolve(url)
        })
        .catch((error) => {
          reject(error)
      })
    })
  }

  async pickImage() {
    const hasLibraryPermission = await this.hasLibraryPermission();
    if (!hasLibraryPermission) return;
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo'
    }).then(image => {
      this.uploadImage(image.path)
    });
  }

  hasLibraryPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show('Library permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show('Library permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
  }
    
    render(){
      const {navigate} = this.props.navigation;
        return (
          <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="height" enabled keyboardVerticalOffset={20}>
            <ScrollView>
            <View style={styles.header}></View>
            <Avatar
              style={styles.avatar}
              rounded
              size={120}
              containerStyle={{
                  marginTop: 50,
                  marginBottom: 50,
                  borderWidth: 4,
                  borderColor: "#fff"
              }}
              source={{ uri: this.state.avatarSource }}
              editButton={{
                  name: "camera",
                  type: "material-community",
                  underlayColor: "#4ac959",
                  iconStyle: { fontSize: 30 },
                  color: "#000"
              }}
              onEditPress={() => {
                  this.pickImage();
              }}
              showEditButton
            />
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{this.state.firstName+' '+this.state.lastName}</Text>
                <Text style={styles.info}>Salesperson</Text>
                <TouchableOpacity style={styles.editButton} onPress={this.toggleEditable}>
                  <Icon style={styles.editIcon} size={25} name={'ios-create'}/> 
                  <Text style={styles.btnText} >{this.state.editable ? 'Cancel' : 'Edit'}</Text>  
                </TouchableOpacity> 
                <View style={[styles.inputContainer, { backgroundColor: this.state.editable ? '#ffffff' : '#eeeeee' }]}>
                  <Icon style={styles.inputIcon} size={25} name={'ios-call'}/> 
                    <TextInput style={styles.inputs}
                      placeholder="Telephone"
                      underlineColorAndroid='transparent'
                      onChangeText={(telephone) => this.setState({telephone})}
                      value={this.state.telephone}
                      editable={this.state.editable}
                    />
                </View>
                <View style={[styles.inputContainer, { backgroundColor: this.state.editable ? '#ffffff' : '#eeeeee' }]}>
                  <Icon style={styles.inputIcon} size={25} name={'ios-mail'}/> 
                    <TextInput style={styles.inputs}
                      placeholder="Email"
                      underlineColorAndroid='transparent'
                      onChangeText={(email) => this.setState({email})}
                      value={this.state.email}
                      editable={this.state.editable}
                    />
                </View>   
                <View style={[styles.inputContainer, { backgroundColor: this.state.editable ? '#ffffff' : '#eeeeee' }]}>
                  <Icon style={styles.inputIcon} size={25} name={'ios-home'}/> 
                    <TextInput style={styles.inputs}
                      placeholder="Address"
                      underlineColorAndroid='transparent'
                      onChangeText={(address) => this.setState({address})}
                      value={this.state.address}
                      editable={this.state.editable}
                    />
                </View>    
                <TouchableOpacity 
                style={[styles.buttonContainer, { backgroundColor: this.state.editable ? '#000000' : '#999999' }]} 
                activeOpacity = { .5 } 
                disabled={!this.state.editable}
                onPress={() => 
                  Alert.alert(
                    'Confirm',
                    'Do you want to update the profile?',
                    [
                      {text: 'Cancel', onPress: () => {return null}},
                      {text: 'Confirm', onPress: () => {
                        let telephone = this.state.telephone;
                        let email = this.state.email;
                        let address = this.state.address;
                        let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
                        userdetails.update({
                          telephone: telephone,
                          email: email,
                          address: address,
                        }).then(()=>{
                          this.setState({editable: !this.state.editable })
                          alert("Profile updated successfully")
                        }).catch(function(error){
                          let errorMessage = error.message;
                          alert(errorMessage);
                        })
                        }
                      },
                    ],
                    { cancelable: false }
                  )} 
                >
                  <Text style={styles.btnText}>Save Profile</Text>  
                </TouchableOpacity>
                 
              </View>            
            </View>
            </ScrollView>
          </KeyboardAvoidingView> 
        );
    }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#000000",
    height: 130,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 120,
    borderWidth: 5,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop: 60
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
    marginBottom: 20,
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
  editButton:{
    height: 45,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 110,
    borderRadius: 30,
    backgroundColor: "#000000",
  },
  editIcon:{
    width:30,
    height:30,
    justifyContent: 'center',
    color: '#ffffff'
  }
});