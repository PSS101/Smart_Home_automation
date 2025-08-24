
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React,{useState} from 'react';
import { StyleSheet, Text, View,TextInput, TouchableOpacity ,SafeAreaView } from 'react-native';
import {NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './Home.js';
import LivingRoom  from './LivingRoom.js';
const Stack = createNativeStackNavigator();
export default function App() {

      return (
       <NavigationContainer>
             
             
             <Stack.Navigator initialRouteName="Home">
               
               <Stack.Screen name="Home" 
                component={Home} />
               <Stack.Screen name="Living-Room" component={LivingRoom} />
             </Stack.Navigator>
            
             
             
           </NavigationContainer>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
