import React from "react";
import { Icon } from "react-native-elements";

const MenuIcon = props => {
  return (
    <Icon
      color="#fff"
      name="menu"
      onPress={() => props.navigation.toggleDrawer()}
    />
  );
};

export default MenuIcon;