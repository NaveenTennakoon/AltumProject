import React from "react";
import { View, Text } from "react-native";

import NavHeader from "../components/NavHeader";

const SettingsScreen = props => {
  return (
    <View>
      <NavHeader navigation={props.navigation} title="Settings"/>
      <Text>This is Settings Screen</Text>
    </View>
  );
};

export default SettingsScreen;