
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React,{useState} from 'react';
import { StyleSheet, Text, View,TextInput, TouchableOpacity ,SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings.js';
import LivingRoom  from './LivingRoom.js';
import Room from './Rooms.js'
const Tab = createBottomTabNavigator();
export default function App() {

      return (
  <NavigationContainer>
             <Tab.Navigator initialRouteName="Rooms" screenOptions={{ headerShown: false,   }}>
                <Tab.Screen name="Living-Room" 
                component={LivingRoom}   options={{ tabBarButton:()=> false}}/>

                <Tab.Screen name="Rooms" 
                component={Room} />

                <Tab.Screen name="Settings" component={Settings} />
                
             </Tab.Navigator>
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
