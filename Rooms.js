import {
  Button,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect } from 'react';
  import { ThemedButton } from 'react-native-really-awesome-button';

import Checkbox from 'expo-checkbox';
import { Directions } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings({navigation}){
      const [site,setSite] = useState('')
  const [imageurl,SetImageurl] = useState('')
  const [alert,SetAlert] = useState(0)

  const retrieve = async (key) => {
    try {
      let val = await AsyncStorage.getItem(key);
      return (val)
    } catch (err) {
      console.log(err);
    }
  };
  
    return(
      

            <View  style={styles.container}>
            <View style={styles.container1}>
            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('LivingRoom')}}>
              <View>
                <Ionicons name = {'home'} size={20} color={'#ffffff'}/>
                <Text style={styles.iconText}> Living Room</Text>
              </View>
            </Pressable>

            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('BedRoom')}}>
              <View>
                <Ionicons name = {'bed'} size={20} color={'#ffffff'}/>
                <Text style={styles.iconText}>Bed Room</Text>
              </View>
            </Pressable>
            </View>

            <View style={styles.container1}>
            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('Living-Room')}}>
              <View>
                <Ionicons name = {'home'} size={20} color={'#ffffff'}/>
                <Text style={styles.iconText}> Living Room</Text>
              </View>
            </Pressable>

            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('Living-Room')}}>
              <View>
                <MaterialCommunityIcons  name = {'shovel'} size={20} color={'#ffffff'}/>
                <Text style={styles.iconText}>Garden</Text>
              </View>
            </Pressable>
            
             </View>
              </View>
            

       
    )
}

const styles = StyleSheet.create({
btn:{
    color:'white',
    justifyContent: 'center', 
    alignItems: 'center', 
    margin:5,
    padding:10,  
    },
container1:{
    display:'flex',
    flexDirection:'row',
    
},
container:{
    display:'flex',
    
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#202125',
   
},
icon:{
    width:100,
    height:100,
    display:'flex',
    borderRadius:50,
    backgroundColor:'#53ccebff',
    textAlign:'center',
    justifyContent:'center',
    padding:10,
    margin:10,
   
},
iconText:{
    fontWeight:'bold',
    color:'white',
    width:100
},
img:{
      alignSelf:'center',
      marginBottom:20
    },
    imgContainer:{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      width:'100%',
      justifyContent:'center'

    },
    txt:{
        fontWeight:'bold',
        fontSize:25,
        margin:10
    }
})