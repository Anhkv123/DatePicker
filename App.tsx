/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Text, View} from 'react-native';
import Home from './src/screen/Home';

const daySeries = [];
function App(): JSX.Element {
  return (
    <View style={{backgroundColor: '#fff'}}>
      <Home />
    </View>
  );
}

export default App;
