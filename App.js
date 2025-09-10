
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
enableScreens();
import React,{useState} from 'react';
import { StyleSheet, Text, View,TextInput, TouchableOpacity ,SafeAreaView } from 'react-native';
import { createStaticNavigation, NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Settings from './Settings.js';
import LivingRoom  from './LivingRoom.js';
import Alerts from './alerts.js'
import Room from './Rooms.js'
import Bedroom from './BedRoom.js';
import Weather from './weather.js';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
function Tabs(){
  return(
    <Tab.Navigator initialRouteName="Rooms" 
             screenOptions={({route})=>({ headerShown: false, 
              
                tabBarIcon:()=>{
                  let iconName=''
                  if(route.name=='Rooms'){
                    iconName = 'home'
                  }
                  if(route.name=='Settings'){
                    iconName = 'settings'
                  }
                  if(route.name =='Alerts'){
                    iconName = 'warning'
                  }  
                  if(route.name =='Weather'){
                    iconName = 'cloud'
                  }         
                return <Ionicons name = {iconName} size={20} color={'#ffffff'}/>
                },
                
                tabBarStyle: {
                backgroundColor: '#202125',
                },
                
              })}>

                <Tab.Screen name="Alerts" component={Alerts} screenOptions={{}}/>
                <Tab.Screen name="Weather" component={Weather} screenOptions={{}}/>
                <Tab.Screen name="Rooms" 
                component={Room} />

                <Tab.Screen name="Settings" component={Settings} />
             </Tab.Navigator>
  )
}



export default function App() {
    let TabOptions={
      headerStyle: {backgroundColor:'#202125'}, headerTintColor:'#ffffff'
    }
      return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Home" component={Tabs}  options={{ headerShown: false }}/>
        <Stack.Screen name="LivingRoom" component={LivingRoom} options={TabOptions}/>
        <Stack.Screen name="BedRoom" component={Bedroom} options={TabOptions}/>
      </Stack.Navigator>
    </NavigationContainer>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
