import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { Router, Scene } from 'react-native-router-flux';
import Login from './src/components/Login/Login';
import Dashboard from './src/components/Dashboard/Dasboard';

class App extends Component {
  render(){
    return (
      <Router hideNavBar= "true">
        <Scene key="root">
          <Scene key="login" component={Login} hideNavBar="true" initial={true} />
          <Scene key="dashboard" component={Dashboard} title="Dashboard" />
        </Scene>
      </Router>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;