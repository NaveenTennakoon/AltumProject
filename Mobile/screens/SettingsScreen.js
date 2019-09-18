import React, { Component } from 'react';
import { View, Text } from "react-native";
import ToggleSwitch from 'toggle-switch-react-native'
import SettingsList from 'react-native-settings-list';

import NavHeader from "../components/NavHeader";

export default class SettingsScreen extends Component {
  
  constructor(){
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switchValue: false};
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
        <NavHeader navigation={this.props.navigation} title="Settings"/>
          <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
            <SettingsList.Item
              // icon={
              //     <Image style={styles.imageStyle} source={require('./images/airplane.png')}/>
              // }
              hasSwitch={true}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title='Airplane Mode'
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/wifi.png')}/>}
              title='Wi-Fi'
              titleInfo='Bill Wi The Science Fi'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Wifi Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/blutooth.png')}/>}
              title='Bluetooth'
              titleInfo='Off'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route to Bluetooth Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/cellular.png')}/>}
              title='Cellular'
              onPress={() => alert('Route To Cellular Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/hotspot.png')}/>}
              title='Personal Hotspot'
              titleInfo='Off'
              // titleInfoStyle={styles.titleInfoStyle}
              onPress={() => alert('Route To Hotspot Page')}
            />
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/notifications.png')}/>}
              title='Notifications'
              onPress={() => alert('Route To Notifications Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/control.png')}/>}
              title='Control Center'
              onPress={() => alert('Route To Control Center Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/dnd.png')}/>}
              title='Do Not Disturb'
              onPress={() => alert('Route To Do Not Disturb Page')}
            />
            <SettingsList.Header headerStyle={{marginTop:15}}/>
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/general.png')}/>}
              title='General'
              onPress={() => alert('Route To General Page')}
            />
            <SettingsList.Item
              // icon={<Image style={styles.imageStyle} source={require('./images/display.png')}/>}
              title='Display & Brightness'
              onPress={() => alert('Route To Display Page')}
            />
          </SettingsList>
        </View>
      </View>
    );
  }
  onValueChange(value){
    this.setState({switchValue: value});
  }

}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#EFEFF4',
    flex:1,
  },
});