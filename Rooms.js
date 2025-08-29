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


    const imgalert = async()=>{
  //console.log('pressed')
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
       const imgalert = async()=>{
       
   try{   
          let link = await retrieve('site')
          let res = await fetch(link+'/pic');
          const img = await res.blob()
          const reader = new FileReader();
          //console.log('alert running')
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
     
      const intervalId = setInterval(imgalert, 5000);
       return () => clearInterval(intervalId);

},[])
    return(
        <ScrollView>

            <View  style={styles.container}>
                <Text style={styles.alertText}>{imageurl?"!!!Alert!!!":''}</Text>
                   <Image alt ="No alert" source={{uri:imageurl}}  style={{ width:imageurl?200:0, height: imageurl?200:0 }}></Image>
                 
            <View style={styles.container1}>
            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('Living-Room')}}><Text style={styles.iconText}> Living Room</Text></Pressable>
            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('Living-Room')}}><Text style={styles.iconText}> Bed Room</Text></Pressable>
            </View>

            <View style={styles.container1}>

            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('Living-Room')}}><Text style={styles.iconText}> Living Room</Text></Pressable>
            <Pressable style={styles.icon} onPress={()=>{navigation.navigate('Living-Room')}}><Text style={styles.iconText}> Living Room</Text></Pressable>
             
             </View>
                <Text style={styles.txt}>Home Alert</Text>
                 <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#5fbe88ff" backgroundColor="#4ede8dff" type="primary" onPress={imgalert}>Set Alert</ThemedButton>
                 <ThemedButton style={styles.btn} name="rick"  textColor="white" backgroundDarker="#e79950ff" backgroundColor="#f3b768ff" type="primary" onPress={imgreset}>Reset Alert</ThemedButton>     
             </View>   

        </ScrollView>
       
    )
}

const styles = StyleSheet.create({

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
container1:{
    display:'flex',
    flexDirection:'row',
    
},
container:{
    display:'flex',
    
    width:'100%',
    height:'100%',
    justifyContent:'flex-end',
    alignItems:'center',
   
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
    },
    btn:{
    color:'white',
    justifyContent: 'center', 
    alignItems: 'center', 
    margin:5,
    padding:10,  
    },
    txt:{
        fontWeight:'bold',
        fontSize:25,
        margin:10
    }


})