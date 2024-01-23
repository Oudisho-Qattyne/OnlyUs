import { View, Text , StyleSheet, TextInput, TouchableOpacity , Image} from 'react-native'
import Animated , {FadeIn, FadeOut, SlideInLeft , SlideOutRight} from 'react-native-reanimated';
import React , {useState} from 'react'
const styles = StyleSheet.create({
    outer:{
        width:300,
        borderRadius:20,
        backgroundColor:'black',
        alignItems:"center",
        padding:10,
        gap:20
    },
    input:{
        width:290,
        height:30,
        backgroundColor:'white',
        borderRadius:10,
        paddingHorizontal:20,
        alignItems:'center'
    },
    
    myButton:{
        width:100,
        height:30,
        borderRadius:20,
        backgroundColor:"red",
        justifyContent:'center',
        alignItems:'center'
    },
    showPassword:{
        position:'absolute',
        right:0,
        width:30,
        height:30,
        backgroundColor:"red",
    },
    pass:{
        flexDirection:'row',
        borderRadius:10 ,
        overflow:"hidden",
    },
    error:{
        position:'absolute',
        top:275,
        width:300,
        padding:20,
        backgroundColor:'red',
        borderRadius:20
    }
})
export default function SignIn({ signIn , error}) {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(true)

  return (
    <Animated.View entering={SlideInLeft} exiting={SlideOutRight} style={{position:'relative'}}>

    <View style={styles.outer}>
        <Text style={{color:'red' , fontSize:40 , fontWeight:'bold'}}>Sign In</Text>
        <Text style={{color:'white' , fontStyle:'italic'}}>your soulmate misses you...<Text style={{color:'red'}}>&lt;3</Text></Text>
      <TextInput onChangeText={text => setEmail(text)} value={email} placeholder='your e-mail' style={styles.input}/>
      <View style={styles.pass}>
        <TextInput onChangeText={text => setPassword(text)} value={password} placeholder='your password' secureTextEntry={showPassword} style={styles.input}/>
        <TouchableOpacity style={styles.showPassword} onPressOut={() => setShowPassword(true)} onPressIn={() => setShowPassword(false)}>
            <Image style={styles.showPassword} source={require('./../assets/eye.png')}/>
        </TouchableOpacity>
      </View>
      <TouchableOpacity  style={styles.myButton} onPress={() => {
            signIn({
                email:email,
                password:password
            })
      }}>
            <Text style={{color:'white' , fontWeight:'bold'}}>Sign In</Text>
        </TouchableOpacity>
      
    </View>
    {error && <Animated.View style={styles.error} entering={FadeIn} exiting={FadeOut}>
        <Text style={{color:'white'}}>something went wrong</Text>
      </Animated.View> }
    </Animated.View>
  )
}