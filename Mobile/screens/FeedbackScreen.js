import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';

import FB from '../components/FB';

export default class ProfileScreen extends Component {

  constructor(props) {
    super(props)
    // state variables  
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

  async componentDidMount() {
    let tempItems = [];
    // get profile image
    const ref = FB.storage().ref('profilePics/' + FB.auth().currentUser.uid)
    const url = await ref.getDownloadURL()
    this.setState({ avatarSource: url })
    let userdetails = FB.database().ref('users/' + FB.auth().currentUser.uid);
    userdetails.on('value', function (snapshot) {
      if (snapshot.val().type != 'salesperson') {
        alert("This email is not registered to a Salesperson");
      }
      else {
        global.firstname = snapshot.val().firstName;
        global.lastname = snapshot.val().lastName;
      }
    });

    FB.database().ref("orders").once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        if (childSnapshot.val().salesperson == FB.auth().currentUser.uid) {
          if (childSnapshot.val().Feedback) {
            // push feedback data to array
            tempItems.push({
              id: childSnapshot.key,
              orderId: childSnapshot.val().orderId,
              customer: childSnapshot.val().Customer,
              feedback: childSnapshot.val().Feedback,
              dr: childSnapshot.val().deliveryRating,
              pr: childSnapshot.val().productRating,
            });
          }
        }
      });
    }).then(() => {
      // set state variable
      this.setState({ items: tempItems });
    });
  }

  // if no feedback to be shown
  ListEmpty = () => {
    return (
      //View to show when list is empty
      <View style={styles.container}>
        <Text style={styles.noData}>No Orders With Feedback</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.avatar} source={{ uri: this.state.avatarSource }} />
          <Text style={styles.name}>{global.username}</Text>
          <Text style={styles.info}>Salesperson</Text>
        </View>
        <Text style={styles.heading}>Feedback</Text>
        <FlatList
          data={this.state.items}
          //Item Separator View
          renderItem={({ item }) => (
            // Single Comes here which will be repetative for the FlatListItems
            <View style={styles.itemsContainer}>
              <View style={styles.headingContainer}>
                <Text
                  style={styles.item}>
                  ORDER NO : {item.orderId}
                </Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.itemText}>Delivery rating :  {item.dr}</Text>
                <Text style={styles.itemText}>Product Rating :  {item.pr}</Text>
                <Text style={styles.itemText}>Feedback :  {item.feedback}</Text>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={this.ListEmpty}
        />
      </View>
    );
  }
}

// styles for the components in the render screen
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#000000",
    height: 100,
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
    marginBottom: 10,
    alignSelf: 'flex-start',
    position: 'absolute',
    margin: 10
  },
  heading: {
    fontSize: 19,
    color: "#000000",
    fontWeight: '700',
    marginVertical: 5,
    marginHorizontal: 15,
  },
  name: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: '700',
    marginLeft: 70,
  },
  noData: {
    textAlign: 'center',
    marginTop: 100,
    color: "#aaaaaa",
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    marginTop: 10,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  info: {
    fontSize: 18,
    color: "#AAAAAA",
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    color: "#FFF",
    marginTop: 3,
    textAlign: 'center'
  },
  headingContainer: {
    backgroundColor: "#000000",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.50,
    shadowRadius: 12.35,
    elevation: 19,
    marginTop: 10,
    marginHorizontal: 10,
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
    height: 200,
    borderTopEndRadius: 6,
    borderTopStartRadius: 6,
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: 5,
  },
  item: {
    padding: 7,
    fontSize: 22,
    fontWeight: '700',
    color: "#ffffff",
  },
  itemText: {
    paddingLeft: 20,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});