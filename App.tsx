/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import DatePicker from "./src/screen/DatePicker";

function App(): JSX.Element {
  return (
    <View style={{backgroundColor: '#fff'}}>
      <DatePicker />
    </View>
  );
}

export default App;
