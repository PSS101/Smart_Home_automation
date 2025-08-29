import {
  Button,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect } from 'react';
  import { ThemedButton } from 'react-native-really-awesome-button';

import Checkbox from 'expo-checkbox';
import { Directions } from 'react-native-gesture-handler';

export default function Login({navigation}){
   const [txt,setTxt] = useState('')
   const [checked,SetChecked] = useState(0)

     const add = async (key, item) => {
    try {
      await AsyncStorage.setItem(key, item);
    } 
    catch (err) {
      console.log(err);
    }
  };
  const retrieve = async (key) => {
    try {
      let val = await AsyncStorage.getItem(key);
      return (val)
    } 
    catch (err) {
      console.log(err);
    }
  };


   const submit = async()=>{
    try{
        if(txt.length!=0){
            await add('site',txt)
            console.log(txt)
        setTxt('')
        SetChecked(false)
        navigation.navigate('Rooms')
        }
    }
    catch(err){
        console.log(err)
    }

   }
 useEffect(()=>{
    const fetchData = async()=>{
      let link = await retrieve('site')
      console.log(link)
      if(link!=null){
        await setTxt(link)
        //console.log(link)
      }
    }
   
     
      fetchData()
      

},[])
    return(
        <View style={styles.container}>
          <Text style={styles.txt}>Server link:</Text>
          <View style={styles.container2}>
            <TextInput style={styles.inp} value={txt} onChangeText={setTxt} placeholder='Enter site address'></TextInput> 
          </View>
          <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#5fbe88ff" backgroundColor="#4ede8dff" type="primary" onPress={submit}>Submit</ThemedButton>
       
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
  container:{
      flex: 1,
    justifyContent: 'flex-start',
    alignItems:'flex-start',
    backgroundColor: '#ecf0f1',
    padding: 50,
    backgroundColor: '#202125',
  },
  container2:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
       alignItems:'center',
  },
  inp:{
      width:200,
      height:40,
      borderWidth:1,
      borderRadius:10,
      margin:10,
      borderColor:'#ffffff',
      color:'#ffffff'
  },
  txt:{
      margin:10,
      color:'#ffffff'

  }

    })
