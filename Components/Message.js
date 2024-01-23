import { View, Text, StyleSheet  } from 'react-native'
import React from 'react'

export default function Message({text , created_at , user , messageUser}) {
    const styles = StyleSheet.create({
        message:{
            position:'relative',
            padding:15,
            marginVertical:5,
            backgroundColor:'#171717',
            alignSelf:user==messageUser ? 'flex-end' : 'flex-start',
            maxWidth:'60%',
            minWidth:'30%',
            height:'auto',
            borderRadius:20
            
        }
    })
  return (
        < View style={styles.message}>   
            <Text style={{color:'white' , fontSize:20}}>
                {text}
            </Text>
            <Text style={{color:'gray',justifyContent:"flex-end"}}>
                {created_at}
            </Text>
        </View>
  )
}
