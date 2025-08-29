import {
  Button,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Switch,
  TextInput,
  Image,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState,useEffect, use } from 'react';
import { ThemedButton } from 'react-native-really-awesome-button';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function LivingRoom(){
  const [s1,setS1] = useState(false)
  const [s2,setS2] = useState(false)
  const [s3,setS3] = useState(false)
  const [site,setSite] = useState('')
  const [imageurl,SetImageurl] = useState('')
  const [alert,SetAlert] = useState(0)
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
  const fetchSite = async()=>{
    if(site.length==0){
    let x = await retrieve('site')
    //console.log(x)
    setSite(x)
    }
    //console.log(site)
  }
  const light = async()=>{
    let lightState=""
    if(s1==false){
      lightState='on'
    }
    else{
      lightState='off'
    }
    setS1(s1==true?false:true)
    fetchSite()
    fetch(site+'/room', {
      
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'device':'light'
  },
  body: JSON.stringify({
    Light: lightState,
    device:'light'
  }),
});
  }

const bed = async()=>{
    let bedLightState=""
    if(s2==false){
      bedLightState='on'
    }
    else{
      bedLightState='off'
    }
    setS2(s2==true?false:true)
    fetchSite()
    fetch(site+'/room', {
      
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    
  },
  body: JSON.stringify({
    BedLight: bedLightState,
    device:'bed'
  }),
});
}



  useEffect(()=>{
    const fetchData = async()=>{
      let link = await retrieve('site')
     // console.log(link)
      if(link!=null){
        await setSite(link)
       // console.log(link)
      }
    }
     
     
      fetchData()
      

},[])
  return(
    
    <View style={styles.container}>
      <View style={styles.container2}>
      <AnimatedCircularProgress style={styles.progressbar}
  size={120}
  width={15}
  fill={50}
  tintColor="#FFA500"
  rotation={180}
  backgroundColor="white"
     >{(fill)=>(<Text style={styles.txt}>Temp</Text>)}</AnimatedCircularProgress>
     <AnimatedCircularProgress style={styles.progressbar}
  size={120}
  width={15}
  fill={50}
  tintColor="#00e0ff"
  rotation={180}
  backgroundColor="white"
     >{(fill)=>(<Text style={styles.txt}>Humidity</Text>)}</AnimatedCircularProgress>
     </View>
     <Text style={styles.heading}>Devices</Text>
     <View style={styles.container3}>
      <Switch style={styles.inp} value={s1} onValueChange={light} thumbColor={'#80ccd1ff'}> </Switch>
      <Text style={{color:s1==true?'#5cd441ff':'#f75252ff' , fontSize:20, fontWeight:'bold'}}>Light</Text>
     </View>
      <View style={styles.container3}>
      <Switch style={styles.inp} value={s2} onValueChange={bed} thumbColor={'#80ccd1ff'}></Switch>
      <Text style={{color:s2==true?'#5cd441ff':'#f75252ff' , fontSize:20, fontWeight:'bold'}}>Bed Light</Text>
      
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
    container:{
      flex: 1,
      alignItems:'center',
      backgroundColor: '#202125',
      height:'100%',
      padding: 5,
    
    },
    container2:{
      display:'flex',
      flexDirection:'row',
      alignItems:'center',
    },
   container3:{
      display:'flex',
      flexDirection:'row',
      marginRight:'auto',
       alignItems:'center',
       marginLeft:50,
    },
    txt:{
      margin:10,
      color:'#ffffff',

    },
    heading:{
      fontSize:30,
      marginTop:40,
      marginBottom:10,
      fontFamily:'Roboto',
      fontWeight:3,
      color:'#ffffff',

    },
    progressbar:{
      margin:10,
      justifyContent:'flex-start'
    },
    inp:{
      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
      margin:10,
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

    })