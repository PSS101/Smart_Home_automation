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
import {LineChart} from "react-native-gifted-charts";

export default function Weather(){

  const [h,Seth] = useState(50)
  const [t,Sett] = useState(28)
  const[air,Setair] = useState(0)
  const[lpg,SetLpg] = useState(0)
  const [humidity,SetHumidity] = useState([{value:50},{value:90},{value:60}])
  const [temp,SetTemp] = useState([{value:24},{value:27},{value:30},{value:22}])
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
      let tempdata = await retrieve('temp')
      let humiditydata = await retrieve('humidity')
      const date = new Date()
      const time = String(date.getDate())+String(date.getMonth)+String(date.getFullYear)
      Seth(Number(weather[1]))
      Sett(Number(weather[0]))
      Setair(Number(weather[2]))
      SetLpg(Number(weather[3]))
      if(tempdata==null){
        let data = [{value:Number(weather[0])},{time:time}]
        await add(data,'temp')
        SetTemp(data)
      }
      else{
        let d = await retrieve('temp')
        let data = JSON.parse(d)
        data.push([{value:Number(weather[0])},{time:time}])
        await add(data,'temp')
        SetTemp(data)
      }
      if(humiditydata==null){
        let data = [{value:Number(weather[1])},{time:time}]
        await add(data,'humidity')
        SetHumidity(data)
      }
      else{
        let d = await retrieve('humidity')
        let data = JSON.parse(d)
        data.push([{value:Number(weather[1])},{time:time}])
        await add(data,'humidity')
        SetHumidity(data)
      }
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
      <ScrollView>
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
            
            <View>
              <LineChart
                data={temp}
                hideRules   
                color="#f56600ff" 
                dataPointsColor="#E91E63"
                dataPointsHeight={10} 
                dataPointsWidth={10}
              />
              </View>
              <LineChart
                data={humidity}
                hideRules   
                color="#2196F3"  
                dataPointsColor="#4c4cebff"
                dataPointsHeight={10} 
                dataPointsWidth={10}
              />
            
          <Text style={styles.txt}>Air Quality(ppm):  {air}</Text>
          <Text style={styles.txt}>LPG(ppm):  {lpg}</Text>
      </View>
      </ScrollView>
        
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