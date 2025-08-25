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
    console.log(x)
    setSite(x)
    }
    console.log(site)
  }
  const light = async()=>{
    let lightState=""
    if(s1==false){
      console.log('on')
      lightState='on'
    }
    else{
      console.log('off')
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
      console.log('bedlight on')
      bedLightState='on'
    }
    else{
      console.log('bedlight off')
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

const imgalert = async()=>{
  console.log('pressed')
   try{
         let res = await fetch(site+'/pic');
         
         
          const img = await res.blob()
          const reader = new FileReader();
reader.onload = () => { 
        if (reader.result!='data:application/octet-stream;base64,'){
            SetAlert(1)
         }
         else{
          SetAlert(0)
          SetImageurl(reader.result); 
         }

};
reader.readAsDataURL(img);
        }
        catch(err){
          console.log(err)
        }
}

const imgreset = async()=>{
  SetImageurl('')
  SetAlert(0)
   fetch(site+'/resetalert', {
      
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    
  },
  body: JSON.stringify({
    setalert:false
  }),
});
}


  useEffect(()=>{
    const fetchData = async()=>{
      let link = await retrieve('site')
      console.log(link)
      if(link!=null){
        await setSite(link)
        console.log(link)
      }
    }
     console.log('function')
       const imgalert = async()=>{
       
   try{   
          let link = await retrieve('site')
          let res = await fetch(link+'/pic');
          const img = await res.blob()
          const reader = new FileReader();
          console.log('alert running')
          reader.onload = () => {
            
          if (reader.result!='data:application/octet-stream;base64,'){
            SetAlert(1)
             SetImageurl(reader.result); 
         }
         else{
          SetAlert(0)
         
         }
        }
        reader.readAsDataURL(img);
      }
        catch(err){
          console.log(err)
        }
      
    }
      fetchData()
      const intervalId = setInterval(imgalert, 5000);
       return () => clearInterval(intervalId);

},[])
  return(
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.container2}>
      <AnimatedCircularProgress style={styles.progressbar}
  size={120}
  width={15}
  fill={50}
  tintColor="#FFA500"
  rotation={180}
  backgroundColor="white"
     >{(fill)=>(<Text>Temp</Text>)}</AnimatedCircularProgress>
     <AnimatedCircularProgress style={styles.progressbar}
  size={120}
  width={15}
  fill={50}
  tintColor="#00e0ff"
  rotation={180}
  backgroundColor="white"
     >{(fill)=>(<Text>Humidity</Text>)}</AnimatedCircularProgress>
     </View>
     <Text style={styles.heading}>Devices</Text>
     <View style={styles.container3}>
      <Switch style={styles.inp} value={s1} onValueChange={light} thumbColor={'#45cbe2ff'}> </Switch>
      <Text style={{color:s1==true?'#5cd441ff':'#f75252ff' , fontSize:20, fontWeight:'bold'}}>Light</Text>
     </View>
      <View style={styles.container3}>
      <Switch style={styles.inp} value={s2} onValueChange={bed} thumbColor={'#45cbe2ff'}></Switch>
      <Text style={{color:s2==true?'#5cd441ff':'#f75252ff' , fontSize:20, fontWeight:'bold'}}>Bed Light</Text>
      
     </View>
      
     
    </View>
    <View style={styles.imgContainer}>
      <Text style={styles.alertText}>{alert==1?"!!!Alert!!!":""}</Text>
      <Image stye={styles.img} alt ="No alert" source={{uri:imageurl}}  style={{ width: 200, height: 200 }}></Image>
    
    <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#5fbe88ff" backgroundColor="#4ede8dff" type="primary" onPress={imgalert}>Set Alert</ThemedButton>
    <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#e79950ff" backgroundColor="#f3b768ff" type="primary" onPress={imgreset}>Reset Alert</ThemedButton>
    </View>
    </ScrollView>
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
    backgroundColor: '#ecf0f1',
    padding: 5,
    margin:5
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

    },
    progressbar:{
      margin:10,
      justifyContent:'flex-start'
    },
    inp:{
      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
      margin:10,
    },
    heading:{
      fontSize:30,
      marginTop:40,
      marginBottom:10,
      fontFamily:'Roboto',
      fontWeight:3,
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
    alertText:{
      fontSize:20,
      fontWeight:'bold',
      color:'#ff0000'
    }

    })