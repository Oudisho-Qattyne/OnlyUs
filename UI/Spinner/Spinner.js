import { View, Image , StyleSheet } from 'react-native'
import Animated , {SlideInDown , SlideOutDown , useAnimatedStyle , withRepeat , withTiming} from 'react-native-reanimated';
import React from 'react'


export default function Spinner() {
  const spinnerAnimation = useAnimatedStyle(() => ({
    transform:[
      {
        scale:withRepeat(withTiming(1.3),-1,true)
      }
    ]
    
  }))
 

  return (
    <Animated.View entering={SlideInDown} exiting={SlideOutDown} style={styles.container}>
      <Animated.Image
      source={require('./../../assets/giphy.gif')}
        style={[styles.Spinner,spinnerAnimation]}
      />
    </Animated.View>
  )
}
const styles = StyleSheet.create({
    Spinner:{
        width: 200,
        height: 200,
       zIndex:1000

    }
    ,
    container:{
      position:'absolute',
       width:'100%',
       height:'100%',
       justifyContent:'center',
       alignItems:'center',
       zIndex:1000
    }
})