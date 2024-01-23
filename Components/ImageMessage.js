import { View, Text , StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import FullImage from './FullImage';


export default function ImageMessage({text , user , created_at , messageUser , setPhoto ,setViewImage }) {
    const styles = StyleSheet.create({
        message:{
            position:'relative',
            padding:15,
            marginVertical:5,
            backgroundColor:'#171717',
            alignSelf:user==messageUser ? 'flex-end' : 'flex-start',
            minWidth:'30%',
            height:'auto',
            borderRadius:20
            
        },
        Image:{
            width:300,
            height:400,
            borderRadius:10
        },
        

    })

    

  return (
    <>
        < View style={styles.message}>  
        <TouchableOpacity onPress={() => {setPhoto(text);setViewImage(true)}}>
            <Image style={styles.Image}  source={{uri:'https://gxhrzxsrvbiuvolhytvw.supabase.co/storage/v1/object/public/Images/'+text}}/>
        </TouchableOpacity> 
            <Text style={{color:'gray',justifyContent:"flex-end"}}>
                {created_at}
            </Text>
        </View>
    </>
  )
}