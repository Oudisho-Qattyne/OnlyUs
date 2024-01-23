import { View, Text , StyleSheet, TextInput, Button, TouchableHighlight, ScrollView, TouchableOpacity, Image , Vibration} from 'react-native'
import React , {useState , useEffect , useRef}  from 'react'
import Message from '../Components/Message'
import Spinner from '../UI/Spinner/Spinner';
import FullImage from '../Components/FullImage';
import Voice from './../Components/Voice'
import { Audio } from 'expo-av';
import Cam from './Cam';
import ImageMessage from '../Components/ImageMessage';
import * as Notifications from 'expo-notifications'
import { supabase } from '../helper/supabase'

const delay = (seconds) => new Promise(resolve => setTimeout(resolve,seconds*1000)) 

export default function Chat({ user , signOut}) {
    

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

const sendNotefication = (message) => {

    Notifications.scheduleNotificationAsync({
      content: {
        title: message.user,
        body: message.text,
      },
      trigger: null,
    });
}

    const [message , setMessage] = useState('');
    const [messages,setMessages] = useState([]);
    const [loadingMessages,setLoadingMessages] = useState(false);
    const [sound, setSound] = useState();
    const [sendSound, setSendSound] = useState();
    const [showCamera , setShowCamera] = useState(false);
    const [photo , setPhoto] = useState(null);
    const [viewImage , setViewImage] = useState(false);
    const [sendLoading , setSendLoading] = useState(false)
    const scrollViewref = useRef();

    async function playSound() {
      const { sound } = await Audio.Sound.createAsync( require('./../assets/iPHONE-TEXT-NOTIFICATION-SOUND-EFFECT.m4a'));
      setSound(sound);
      await sound.playAsync();
    };
    
    async function playSendSound() {
        const { sound } = await Audio.Sound.createAsync( require('./../assets/BFB-BUBBLE-POPPING-SOUND-EFFECT.m4a'));
        setSendSound(sound);
        await sound.playAsync();
      };
     
    
    React.useEffect(() => {
        return sound
          ? () => {
              sound.unloadAsync();
            }
          : undefined;
      }, [sound]);

      React.useEffect(() => {
        return sendSound
          ? () => {
              sendSound.unloadAsync();
            }
          : undefined;
      }, [sendSound]);

    const fetchMessages = async () => {
        setLoadingMessages(true)
        const { data, error } = await supabase
        .from('chat')
        .select('*')
        setMessages(data)
        setLoadingMessages(false)
    }

    const subscription = supabase
          .channel('chat')
          .on("postgres_changes",{ event: "*", schema: "public", table: "chat" },
          (payload) => {
              setMessages((prevMessages) => [...prevMessages , payload.new]);
              if(payload.new.user!=user.email){
                  Vibration.vibrate(500);
                  playSound();
                  sendNotefication(payload.new)
            }
            else{
                playSendSound();
            }
            }
          )
          .subscribe();
    
    useEffect(() => {
        fetchMessages();
      }, []);
    
      const [recording , setRecording] = useState();

      const startRecording = async () => {
        await delay(1);
        
          try{
              await Audio.requestPermissionsAsync();
              const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
              setRecording(recording);
          }
          catch(err){
              console.log('error in recording...!!',err);
          }
        }
  
        const stopRecording = async (event) => {
          // console.log(recording);
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          const { status } = await Audio.Sound.createAsync({uri : uri})
          const filetype = uri.split(".").pop();
          const filename = uri.split("/").pop();
          const fd = new FormData();
          fd.append("audio-record", {
          uri,
          type: `audio/${filetype}`,
          name: filename,
          });
          const date = new Date();
          const { data, error } = await supabase
          .storage
          .from('VoiceNotes')
          .upload(filename, fd )

          const { error2 } = await supabase
          .from('chat')
          .insert({
              user:user.email,
              created_at:date.getHours() + ":" + date.getMinutes(),
              text:filename,
              type:'voice',
              millis:status.durationMillis
          })
        }
   
    const sendMessage = async () => { 
        setSendLoading(true)
        const date = new Date();
        const { error } = await supabase
        .from('chat')
        .insert({
            user:user.email,
            created_at:date.getHours() + ":" + date.getMinutes(),
            text:message,
            type:'text'
        })
        setMessage('');
        setSendLoading(false)
    }

    


    return (
        <>
        
        <View style={styles.container}>
            {loadingMessages ? <Spinner/> :
            <>
            
        <View style={styles.titleBox}>
            <Text style={styles.title}>Our Chat</Text>
            <TouchableHighlight style={{position:'absolute' , left:5 , bottom:5 }} onPress={() => signOut()}>
                <>
                    <Image source={require('./../assets/log-out.png')} style={{width:35,height:35}}/>
                    <Text>log out</Text>
                </>
            </TouchableHighlight>
            {/* <TouchableHighlight style={{position:'absolute' , right:5 , bottom:5 }} onPress={() => signOut()}>
                <>
                    <Image source={require('./../assets/call.png')} style={{width:35,height:35}}/>
                    <Text>  call</Text>
                </>
            </TouchableHighlight> */}
        </View>
        <Image style={styles.backGround} source={require('./../assets/df0b218269f3cfebb9ec1e13a7e2b1d0.jpg')}/>
        <ScrollView ref={scrollViewref}
        onContentSizeChange={() => scrollViewref.current.scrollToEnd({ animated: true })}
            style={styles.messages}>
             {messages.map(message =>
                {
                    if(message.type=='text')
                    {
                        return(

                            <Message key={message.id} created_at={message.created_at} text={message.text} messageUser={message.user} user={user.email}/>
                        )
                    }
                    if(message.type=="voice")
                    {
                        return(
                            <Voice key={message.id} created_at={message.created_at} text={message.text} messageUser={message.user} user={user.email} millis={message.millis}/>
                        )
                    }
                    if(message.type=="image")
                    {
                        return(
                            <ImageMessage setViewImage={setViewImage} setPhoto={setPhoto} key={message.id} created_at={message.created_at} text={message.text} messageUser={message.user} user={user.email}/>

                        )
                    }
                })
            }
        </ScrollView >

        <View style={styles.message}>
            <TouchableOpacity  style={styles.camera} onPressOut={() => setShowCamera(prev => !prev)} >
               <Image style={styles.mic} source={require('./../assets/camera.png')} />
            </TouchableOpacity>
            <TextInput value={message} onChangeText={text => setMessage(text)} style={styles.input} placeholderTextColor="gray" placeholder="your message"/>
            {message == '' ? 
            <TouchableOpacity  style={styles.myButton} onLongPress={startRecording} onPressOut={stopRecording}>
               <Image style={styles.mic} source={require('./../assets/mic.png')} />
            </TouchableOpacity>
            :
            <TouchableOpacity disabled={message==''||sendLoading} style={styles.myButton} onPressOut={() => sendMessage()}  >
               <Text style={{color:"white"}}>Send</Text>
            </TouchableOpacity>

}
        </View>
            </>}
        
    </View>
    {viewImage && <FullImage url={photo} setViewImage={setViewImage}/>}
    {showCamera ? <Cam user={user} setShowCamera={setShowCamera} showCamera={showCamera}/> : null}
        </>
        
  )
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        flex:1,
        backgroundColor:"#444444",
        zIndex:-5
    },
    backGround:{
        position:'absolute',
        width:"100%",
        height:'100%',
        marginTop:100,
        marginBottom:60,
        zIndex:-1,
    },
    title:{
        color:'white',
        fontSize:20,
        fontWeight:'bold',
        padding:10
    },
    titleBox:{
        position:'absolute',
        top:0,
        width:'100%',
        height:100,
        backgroundColor:'#171717',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    message:{
        position:'absolute',
        bottom:0,
        width:'100%',
        height:"fit-content",
        height:60,
        flexDirection:'row',
        backgroundColor:'#171717'

    },
    input:{
        width:'87%',
        borderColor:'black',
        backgroundColor:'#282828',
        color:'white',
        borderWidth:1,
        padding:10,
        borderRadius:100,
        fontSize:20,
        paddingLeft:70,
    },
    messages:{
        width:"100%",
        height:'100%',
        marginTop:100,
        marginBottom:60,
        zIndex:10,
        flexDirection:"column",
        gap:10,
    },
    myButton:{
        width:60,
        borderRadius:100,
        backgroundColor:'#D21312',
        justifyContent:'center',
        alignItems:'center'
    },
    mic:{
        width:40,
        height:40
    },
    camera:{
        position:'absolute',
        zIndex:10,
        left:5,
        top:10,
        width:50,
        borderRadius:100,
        justifyContent:'center',
        alignItems:'center'

    },

})