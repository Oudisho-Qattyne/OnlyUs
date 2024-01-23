import { StatusBar } from 'expo-status-bar';
import { StyleSheet,View } from 'react-native';
import Chat from './Pages/Chat';
import { useEffect, useState } from 'react';
import SignIn from './Pages/SignIn';
import{supabase} from './helper/supabase'
import Spinner from './UI/Spinner/Spinner';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {


const [user , setUser] = useState(null)
const [error , setError] = useState(null)
const [signInLoading , setSignInLoading] = useState(false)

 

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  setSignInLoading(true);
  setUser(null)
  setError(null)
  setSignInLoading(false);
  AsyncStorage.removeItem('email')
  AsyncStorage.removeItem('password')

}

const signIn = async (user) =>{
  setSignInLoading(true);
  setError(null)
  AsyncStorage.setItem('email',''+user.email);
  AsyncStorage.setItem('password',''+user.password);
  const { data, error } = await supabase.auth.signInWithPassword(user)
  if(error==null){
    setUser(user)
  }
  else{
    setError(error)
  }
  setSignInLoading(false);
}

const getUserFromAsyncStorage = async () => { 
  const email = await AsyncStorage.getItem('email');
  const password = await AsyncStorage.getItem('password');
  if(email!=null&&password!=null){
    signIn({
      email:email,
      password:password
    })
  }
}

useEffect(() => {
  getUserFromAsyncStorage();
},[])


  return (
    <View style={styles.container}>
       <StatusBar
        animated={true}
        backgroundColor="#171717"
      />
      {user==null && !signInLoading? <SignIn error={error} signIn={signIn} setUser={setUser}/>:signInLoading ? <Spinner/> : <Chat signOut={signOut} setUser={setUser} user={user}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#444444', 
    alignItems: 'center',
    justifyContent: 'center',
  },
   textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
});
