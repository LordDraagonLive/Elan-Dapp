/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';


import MainStackNavigator from './MainStackNavigator'

// Calll main stack navigator to handle all navigations
export default function App() {
  return <MainStackNavigator />
}
