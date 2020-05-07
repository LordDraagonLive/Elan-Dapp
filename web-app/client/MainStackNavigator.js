// MainStackNavigator.js

import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { CreateBackup } from './createBackup';
import Backups from './backups';

const Stack = createStackNavigator()

function MainStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='backups'>
        <Stack.Screen name='createBackup' 
        component={CreateBackup} 
        options={{ title: 'Create Backup', headerStyle:{ backgroundColor: '#212121'}, headerTintColor:'#fff', headerLeft: null }}
        />
        <Stack.Screen name='backups' 
        component={Backups} 
        options={{ title: 'Backups', headerStyle:{ backgroundColor: '#212121'}, headerTintColor:'#fff' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainStackNavigator