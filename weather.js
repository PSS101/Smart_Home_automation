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
import { useState,useEffect, use } from 'react';
  import { ThemedButton } from 'react-native-really-awesome-button';

import Checkbox from 'expo-checkbox';
import { Directions } from 'react-native-gesture-handler';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
export default function Weather(){

  const [h,Seth] = useState(50)
  const [t,Sett] = useState(28)
  const[air,Setair] = useState(0)
  const[lpg,SetLpg] = useState(0)
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


    useEffect(()=>{
    const fetchData = async()=>{
      try{
      let link = await retrieve('site')
      let res = await fetch(link+"/weather")
      const d = await res.json()
      const weather =  d.mssg.split(',')
      Seth(Number(weather[1]))
      Sett(Number(weather[0]))
      Setair(Number(weather[2]))
      SetLpg(Number(weather[3]))
     // console.log(link)
      if(link!=null){
        await setSite(link)
       // console.log(link)
      }
    }
      catch (err){
        console.log(err)
      }
      }
      
      const intervalId = setInterval(fetchData, 5000);
       return () => clearInterval(intervalId);
      

},[])

    return(
      <View style={styles.container}>

         <View style={styles.container2}>
        
                <View style={styles.container4}>
                <Text style={styles.txt}>Temperature</Text>
              <AnimatedCircularProgress style={styles.progressbar}
          size={125}
          width={15}
          fill={t}
          tintColor="#FFA500"
          rotation={245}
          backgroundColor="white"
          arcSweepAngle={225}
             >{(fill)=>(<Text style={styles.txt}>{t}°C</Text>)}</AnimatedCircularProgress>
        
        </View>    
        <View style={styles.container4}>
                <Text style={styles.txt}>Humidity</Text>
             <AnimatedCircularProgress style={styles.progressbar}
          size={125}
          width={15}
          fill={h}
          tintColor="#00e0ff"
          rotation={245}
          backgroundColor="white"
          arcSweepAngle={225  
          }
             >{(fill)=>(<Text style={styles.txt}>{h}%</Text>)}</AnimatedCircularProgress>
            </View>
            </View>
          <Text style={styles.txt}>Air Quality(ppm):  {air}</Text>
          <Text style={styles.txt}>LPG(ppm):  {lpg}</Text>
      </View>
        
    )

  }
  const styles = StyleSheet.create({
   txt:{
    color:'#ffffff'
   },
       container:{
      flex: 1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#202125',
      height:'100%',
      width:'100%',
      padding: 10,
    
    
    },
    container2:{
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
      width:'100%',
      marginLeft:10
    },
   container3:{
      display:'flex',
      flexDirection:'row',
      marginRight:'auto',
       alignItems:'center',
       marginLeft:50,
    },
    container4:{
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
    },
    txt:{
      margin:10,
      color:'#ffffff',
    },
     progressbar:{
      margin:10,
      justifyContent:'flex-start',
      
    },
  })