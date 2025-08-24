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

export default function Home({navigation}){
   const [txt,setTxt] = useState('')
   const [checked,SetChecked] = useState(0)

     const add = async (key, item) => {
    try {
      await AsyncStorage.setItem(key, item);
    } catch (err) {
      console.log(err);
    }
  };
  const retrieve = async (key) => {
    try {
      let val = await AsyncStorage.getItem(key);
      return (val)
    } catch (err) {
      console.log(err);
    }
  };


   const submit = async()=>{
    try{
     if(!checked){
        if(txt.length!=0){
            await add('site',txt)
            console.log(txt)
        setTxt('')
        SetChecked(false)
        navigation.navigate('Living-Room')
        }
     }
        else{
            await add('site','https://4edd36d2b552.ngrok-free.app')
            console.log('added')
        setTxt('')
        SetChecked(false)
        navigation.navigate('Living-Room')
        }
        
    }
    catch(err){
        console.log(err)
    }

   }

    return(
        <View style={styles.container}>
          <View style={styles.container2}>
            <TextInput style={styles.inp} value={txt} onChangeText={setTxt} placeholder='Enter site address'></TextInput> 
          </View>
          <View style={styles.container2}>           
              <Checkbox value={checked} onValueChange={SetChecked}></Checkbox>
              <Text style={styles.txt}>Use default address</Text>
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
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#ecf0f1',
    padding: 5,
    margin:5
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
    },
    txt:{
      margin:10,

    }

    })
