import React from 'react';
import { Header } from "react-native-elements";

import MenuIcon from "./MenuIcon";

const NavHeader = props => {
  return (
    <Header
      leftComponent={<MenuIcon navigation={props.navigation} />}
      centerComponent={{
        text: props.title,
        style: { color: "#fff", fontWeight: "bold" }
      }}
      statusBarProps={{ barStyle: "light-content" }}
    />
  );
};

export default NavHeader;