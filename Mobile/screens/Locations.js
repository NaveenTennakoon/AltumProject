import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import FB from '../components/FB';

let items = [];

export default class Locations extends Component {

    constructor(props){
		super(props)
		this.state = {
            markers: [],
            search: '',
		}
    }

    componentDidMount(){
        FB.database().ref("tracking/locations").once("value").then(function(snapshot){
            snapshot.forEach(function(childSnapshot){
                if(childSnapshot.val().salesperson == FB.auth().currentUser.uid){
                    items.push({
                        title: childSnapshot.val().shopname,
                        latlng: {
                            latitude: parseFloat(childSnapshot.val().lat),
                            longitude: parseFloat(childSnapshot.val().lng),
                        },
                        id: childSnapshot.key,
                    });
                }
            });
        }).then(()=>{
            this.setState({ markers: items });
        });
    }

    fitToMarkersToMap() {
        const {markers} = this.state;
        this.map.fitToSuppliedMarkers(markers.map(marker => marker.id), { edgePadding: 
            {
                top: 100,
                right: 120,
                bottom: 140,
                left: 120
            }
          });
    }
    
    render(){
        return (
        <View style={styles.container}>
            <MapView 
            style = {styles.map}
            ref={ref => {this.map = ref;}}
                initialRegion = {{
                latitude: 6.8632038,
                longitude: 79.8944871,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>
                {this.state.markers.map(marker => (
                    <MapView.Marker 
                    coordinate = {marker.latlng}
                    key = {marker.id}
                    identifier = {marker.id}
                    title = {marker.title}
                    pinColor = {'linen'}
                    >
                        <MapView.Callout onPress={() => 
                        FB.database().ref("tracking/locations/"+marker.id).once("value").then(function(snapshot){
                            Alert.alert(
                                snapshot.val().customer,
                                snapshot.val().shopname+"\n"+snapshot.val().address+"\n"+snapshot.val().timestamp,
                                [{text: 'OK'}],
                                {cancelable: false},
                            )
                        })
                            }>
                        </MapView.Callout>
                    </MapView.Marker>
                ))}
            </MapView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => this.fitToMarkersToMap()}
                    style={[styles.bubble, styles.button]}
                >
                    <Text style={styles.btnText}>Fit Locations in Map</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
        marginRight: 20,
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
        marginBottom: 10,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
    }
  });