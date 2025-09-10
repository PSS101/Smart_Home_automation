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
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import { Directions } from 'react-native-gesture-handler';
export default function Bedroom(){
    const [red,SetRed] = useState(0)
    const [green,SetGreen] = useState(0)
    const [blue,SetBlue] = useState(0)
    const[site,setSite]=useState('')
    const [rgb,setRgb] = useState('')
    const [dim,SetDim] = useState(0)
    
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
 
 function ColorBox({boxcolor,onPress,setcolor}){
  const f = ()=>{
 let x = setcolor
     x = x.replace(')','')
     x = x.replace('rgb(','')
     console.log(x)
     setRgb(x)
     x = x.split(',')
     SetRed(Number(x[0]))
     SetGreen(Number(x[1]))
     SetBlue(Number(x[2]))

  }
 
    return(
      <Pressable onPress={f}>
      <View style={{width:15,height:15,margin:20}}>
        <Text style={{borderRadius:5,borderColor:boxcolor,borderWidth:15}}></Text>
      </View>
      </Pressable>
    )
  }

const setColor = async()=>{
  let mssg =  String(red)+","+String(green)+','+String(blue)
  console.log(mssg)
  console.log(site)
  setRgb(mssg)
      fetch(site+'/bedroom/rgb', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    rgb:  String(red)+","+String(green)+','+String(blue)
  }),})

    }

const setDimness = async()=>{
  let mssg =  dim
  console.log(mssg)
  console.log(site)
      fetch(site+'/bedroom/dim', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
    dim:  String(dim)
  }),})

    }



      useEffect(()=>{
    const fetchData = async()=>{
      try{
      let link = await retrieve('site')
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
      
    
     
     
     fetchData();
      

},[])

    return(
       <View style={styles.container}> 
       <View style={styles.container2}>
       <View style={styles.box}>
       <Text style={styles.txt}>R</Text>
       <Text style={styles.txt}>{red}</Text>
       </View>
       <View  style={styles.box}>
       <Text style={styles.txt}>G</Text>
       <Text style={styles.txt}>{green}</Text>
       </View>
       <View  style={styles.box}>
       <Text style={styles.txt}>B</Text>
       <Text style={styles.txt}>{blue}</Text>
       </View>

       </View>
       <View style={styles.container2}>
       <ColorBox boxcolor="rgb(131,255,245)" setcolor="rgb(131,255,245)"/>
       <ColorBox boxcolor="rgb(0,31,255)" setcolor="rgb(0,31,255)"/>
       <ColorBox boxcolor="rgb(255,255,255)"  setcolor="rgb(155,100,255)"/>
       <ColorBox boxcolor="rgb(255,247,0)" setcolor="rgb(255,247,0)"/>
       </View>
       <View style={styles.container2}>
       <ColorBox boxcolor="rgb(194,0,74)" setcolor="rgb(194,0,74)"/>
       <ColorBox boxcolor="rgb(250,170,0 )" setcolor="rgb(250,170,0 )"/>
       <ColorBox boxcolor="rgb(194,74,74)" setcolor="rgb(194,74,74)"/>
       </View>
       <View style={styles.container2}>
        <Text style={styles.txt}>Red</Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={255}
          step={1}
           onSlidingComplete={(x)=>{SetRed(x)}}
           value={red}
          minimumTrackTintColor="#ff4040ff"
          maximumTrackTintColor="#ff0000ff"
        />
       </View>
       
        <View style={styles.container2}>
        <Text style={styles.txt}>Green</Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={255}
          step={1}
           onSlidingComplete={(x)=>{SetGreen(x)}}
           value={green}
          minimumTrackTintColor="#6afc89ff"
          maximumTrackTintColor="#07ff76ff"
        />
        </View>

        <View style={styles.container2}>
        <Text style={styles.txt}>Blue</Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={255}
          step={1}
          onSlidingComplete={(x)=>{SetBlue(x)}}
          value={blue}
          minimumTrackTintColor="#7fb6f1ff"
          maximumTrackTintColor="#0f75faff"
        />
       </View>
       
        <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#538f6dff" backgroundColor="#5cb984ff" type="primary" onPress={setColor}>Set Color</ThemedButton>
       
       <View style={styles.box2}>
       <Text style={styles.txt}>Light</Text>
        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0}
          maximumValue={255}
          step={1}
          onSlidingComplete={(x)=>{SetDim(x)}}
          value={dim}
          minimumTrackTintColor="#f5f1a5ff"
          maximumTrackTintColor="#f0f00bff"
        />
        <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#538f6dff" backgroundColor="#5cb984ff" type="primary" onPress={setDimness}>Set Dim</ThemedButton>
       </View>
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
      justifyContent:'center',
      width:'100%',
      marginLeft:10
    },
    txt:{
    color:'#ffffff'
   },
   box:{
    margin:10
   },
   box2:{
    marginTop:40
   },
  })