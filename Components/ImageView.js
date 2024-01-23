import { View, Image  , StyleSheet, TouchableOpacity , Text} from 'react-native'
import { supabase } from '../helper/supabase';
import React, { useState } from 'react'
import Spinner from '../UI/Spinner/Spinner';


export default function ImageView({photo , setPhoto , user , setShowCamera}) {

    const [loading,setLoading] = useState(false);
    const sendPhoto = async () => {
        setLoading(true);
        const uri = photo.uri;

        const filetype = uri.split(".").pop();
        const filename = uri.split("/").pop();

          const fd = new FormData();
          fd.append("photo", {
          uri,
          type: `photo/${filetype}`,
          name: filename,
          });
          const date = new Date();
          const { data, error } = await supabase
          .storage
          .from('Images')
          .upload(filename,fd )

          const { error2 } = await supabase
          .from('chat')
          .insert({
              user:user.email,
              created_at:date.getHours() + ":" + date.getMinutes(),
              text:filename,
              type:'image',
          })
          setLoading(false);
          setPhoto(null);
          setShowCamera(false)
          
    }

  return (
    <View style={styles.container}> 
    <TouchableOpacity style={styles.cancelPhoto} onPressOut={() => setPhoto(null)}>
        <Image style={{width:50,height:50}} source={require('./../assets/x.png')}/>
    </TouchableOpacity>
    <TouchableOpacity style={styles.sendPhoto} disabled={loading} onPressOut={sendPhoto}>
        <Image style={{width:50,height:50,top:3,right:2}} source={require('./../assets/send.png')}/>
    </TouchableOpacity>
    <Image style={styles.Image} source={{uri : photo.uri}}/>
    {loading && <Spinner/>}
    </View>
  )
}
const styles = StyleSheet.create({
    Image:{
        width:'100%',
        height:'70%',

    },
    container:{
        width:'100%',
        flex:1,
        justifyContent:'center',
        alignItems:'center'
        },
    cancelPhoto:{
        position:'absolute',
        top:50,
        left:20,
        width:50,
        height:50,
        zIndex:10
    },
    sendPhoto:{
        position:'absolute',
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        bottom:50,
        right:50,
        width:60,
        height:60,
        zIndex:10
    }
})