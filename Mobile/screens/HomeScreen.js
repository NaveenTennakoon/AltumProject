import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Image, AsyncStorage } from 'react-native';
import Dialog from "react-native-dialog";

import FB from '../components/FB';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class ProfileScreen extends Component {

    constructor(props){
      super(props)

      this.state = {
        items: [],
        dialogVisible: false,
        selectedID: '',
        selectedCustomer: '',
        selectedProducts: [],
        pwd: '',
        avatarSource: 'empty',
      },
      global.firstname = '';
      global.lastname = '';
    }
    
    async componentDidMount(){
      let tempItems = [];
      let tempProducts = [];
      let date = new Date();
      const ref = FB.storage().ref('profilePics/'+FB.auth().currentUser.uid)
      const url = await ref.getDownloadURL()
      this.setState({ avatarSource: url })
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
        
      FB.database().ref("orders").once('value', function(snapshot) {
        snapshot.forEach(function (childSnapshot){
          if (childSnapshot.val().salesperson == FB.auth().currentUser.uid && childSnapshot.val().Status == 'Assigned') {
            tempItems.push({
              id: childSnapshot.key,
              orderId: childSnapshot.val().orderId,
              customer: childSnapshot.val().Customer,
              total: childSnapshot.val().Total,
              orderDate: childSnapshot.val().orderDate,
            });
          }
        });
      }).then(() => {
        this.setState({ items: tempItems });
      });
    }

    ListEmpty = () => {
      return (
        //View to show when list is empty
        <View style={styles.container}>
          <Text style={styles.noData}>No Orders Pending</Text>
        </View>
      );
    };

    showDialog = (id, customer) => {
      this.setState({ dialogVisible: true, selectedID: id});
      let name;
      FB.database().ref('users/'+customer).once('value', function(userSnap){
        name = userSnap.val().company;
      });
      FB.database().ref('orders/'+id+"/Products").once('value', function(snapshot){
        tempProducts = [];
        snapshot.forEach(function(childSnapshot){
          tempProducts.push({
            id: childSnapshot.key,
            amount: childSnapshot.val(),
          });
        });
      }).then(() => {
          this.setState({ selectedCustomer: name, selectedProducts: tempProducts });
        })
    };
   
    handleCancel = () => {
      this.setState({ dialogVisible: false });
    };

    handleSave = (id) => {
      const value = AsyncStorage.getItem('password');
      alert(this.state.pwd+" "+value)
      if(this.state.pwd == global.pwd){
        FB.database().ref('orders/').child(id).update({
          Status: 'Completed',
          paymentDate: date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate(),
        }).then(() => {
          FB.database().ref("orders").once('value', function(snapshot) {
            snapshot.forEach(function (childSnapshot){
              if (childSnapshot.val().salesperson == FB.auth().currentUser.uid && childSnapshot.val().Status == 'Assigned') {
                tempItems = [];
                tempItems.push({
                  id: childSnapshot.key,
                  orderId: childSnapshot.val().orderId,
                  customer: childSnapshot.val().Customer,
                  total: childSnapshot.val().Total,
                  orderDate: childSnapshot.val().orderDate,
                });
              }
            });
          }).then(() => {
            this.setState({ items: tempItems });
          });
          alert("Correct Password. Transaction completed successfully")
        }).catch(function(error){
          // Handle Errors here.
          alert(error);
        });
      }
      else{
        alert(this.state.pwd+" and "+global.pwd)
        // alert("Password incorrect");
      }
      this.setState({ dialogVisible: false });
    };
    
    render(){
      return (
      <View style={styles.container}>
        <View style={styles.header}>
        <Image style={styles.avatar} source={{uri: this.state.avatarSource}}/>
        <Text style={styles.name}>{global.username}</Text>
          <Text style={styles.info}>Salesperson</Text>
        </View>
        <Text style={styles.heading}>Pending Orders</Text>
        <FlatList
          data={this.state.items}
          //Item Separator View
          renderItem={({ item }) => (
            // Single Comes here which will be repeatative for the FlatListItems
            <View style={styles.itemsContainer}>
              <View style={styles.itemContainer}>
                <Text
                  style={styles.item}>
                  ORDER NO : {item.orderId}
                </Text>
                <View
                  style={{
                    borderBottomColor: '#cccccc',
                    borderBottomWidth: 1,
                    marginBottom: 15,
                  }}
                />
                <Text style={styles.itemText}>Order Date :  {item.orderDate}</Text>
                <Text style={styles.itemText}>Total          :  {item.total}</Text>
              </View>
              <TouchableOpacity style={styles.btnContainer} onPress={() => this.showDialog(item.id, item.customer)}>
                <Text style={styles.btnText}>Complete This Order</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.ListEmpty}
        />
        <View>
          <Dialog.Container visible={this.state.dialogVisible}>
            <Dialog.Title style={styles.popupHead}>Customer: {this.state.selectedCustomer}</Dialog.Title>
            <Dialog.Description>
              Click Save after the completion of delivery and payment of the listed products
            </Dialog.Description>
            {
              this.state.selectedProducts.map((item, index) => (
              <Text style={styles.productTxt}>{item.id} : {item.amount}</Text>             
              ))
            }
            <Dialog.Input style={styles.popupInput} placeholder="Your password" wrapperStyle="password" onChangeText={(pwd) => this.setState({pwd})}/>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Save" onPress={() => this.handleSave(this.state.selectedID)} />
          </Dialog.Container>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#000000",
    height:100,
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
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
  heading: {
    fontSize:19,
    color:"#000000",
    fontWeight:'700',
    marginVertical: 5,
    marginHorizontal: 15,
  },
  name:{
    fontSize:24,
    color:"#FFFFFF",
    fontWeight:'700',
    marginLeft: 70,
  },
  noData: {
    textAlign: 'center', 
    marginTop: 100, 
    color:"#aaaaaa", 
    fontSize: 20,
    fontWeight: '600',
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
    color: "#AAAAAA",
    fontWeight: '700',
  },
  description:{
    fontSize:16,
    color: "#FFF",
    marginTop: 3,
    textAlign: 'center'
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,
    elevation: 19,
    borderWidth: 1,
    borderColor: "#000000",
    marginHorizontal: 10,
    height: 150,
    borderTopEndRadius: 6,
    borderTopStartRadius: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
  item: {
    padding: 10,
    fontSize: 22,
    fontWeight: '700',
    color: "#aaaaaa",
  },
  itemText: {
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  btnContainer: {
    backgroundColor: "#000000",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',    
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowOpacity: 0.50,
    shadowRadius: 12.35,
    elevation: 19,
    marginHorizontal: 10,
    marginVertical: 2,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  popupHead:{
    fontWeight: '700',
    marginBottom: 15,
  },
  productTxt: {
    fontSize: 21,
    marginVertical: 5,
    alignSelf: 'center',
    fontWeight: '700',
  },
  popupInput:{
    marginTop: 15,
    borderBottomWidth: 1,
    borderColor: "#009988",
  },
  customerHead:{
    margin: 10,
    marginBottom: 0,
    fontSize: 16,
    fontWeight: '700',
  },
  customerName:{
    paddingTop: 0,
    padding: 12,
    fontSize: 22,
    fontWeight: '700',
    color: "#aaaaaa",
  },
});