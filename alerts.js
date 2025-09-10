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
  const add = async (key, item) => {
    try {
      await AsyncStorage.setItem(key, item);
    } catch (err) {
      console.log(err);
    }
  };

const imgset = async()=>{
  let link = await retrieve('site')
          setSite(link)
  console.log('setalert')
  SetAlert(1)
   fetch(link+'/setalert', {
      
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    
  },
  body: JSON.stringify({
    setalert:true
  }),
});
}

const imgreset = async()=>{
  SetImageurl('')
  SetAlert(0)
  console.log(site)
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
       const imgalert = async()=>{
       
   try{   
          let link = await retrieve('site')
          setSite(link)
          let res = await fetch(link+'/pic');
          const img = await res.blob()
          const reader = new FileReader();
          //console.log('alert running')
          reader.onload = () => {
            
          if (reader.result!='data:application/octet-stream;base64,'){  
             SetImageurl(reader.result); 
         }
         else{   
         }
        }
        reader.readAsDataURL(img);
      
      }
        catch(err){
          console.log(err)
        }
   
    }
    let intervalId;
     if(alert==1){
       intervalId = setInterval(imgalert, 5000);
     }
     else if(alert==0){
      clearInterval(intervalId);
     }
       return () => {
        if(intervalId && alert==0){
          clearInterval(intervalId);
     }
    
  }

},[alert])
    return(
      

            <View  style={styles.container}>
                <Text style={{color:imageurl?'#ff0000':'#ffffff', fontSize:20,fontWeight:'bold',}}>{imageurl?"!!!Intruder Alert!!!":'No Alerts'} </Text>
                   <Image alt ="No alert" source={{uri:imageurl}} style={{height:imageurl?200:0,width:imageurl?200:0}}  ></Image>
       
                <Text style={styles.txt}>Set Home Alert</Text>
                 <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#5fbe88ff" backgroundColor="#4ede8dff" type="primary" onPress={imgset}>Set Alert</ThemedButton>
                 <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#e79950ff" backgroundColor="#f3b768ff" type="primary" onPress={imgreset}>Reset Alert</ThemedButton>     
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
img:{
      alignSelf:'center',
      marginBottom:20,
      width:200,
        height:200,   
        borderWidth:1,
        borderColor:'#ff0000',
        borderRadius:10,
},
imgContainer:{
      display:'flex',
      flexDirection:'column',
       alignItems:'center',
       width:'100%',
       justifyContent:'center'

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
txt:{
    fontWeight:'bold',
    fontSize:25,
    margin:10,
    color:'#ffffff'
}


})