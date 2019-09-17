import React from "react";
import { View, Text } from "react-native";

import NavHeader from "../components/NavHeader";

const HomeScreen = props => {
    return (
      <View>
        <NavHeader navigation={props.navigation} title="Home"/>
        <Text>This is Home Screen</Text>
      </View>
    );
  };

export default HomeScreen;