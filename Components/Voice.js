import { View, Text , StyleSheet, TouchableOpacity, Image} from 'react-native'
import React , {useState} from 'react'
import { Audio } from 'expo-av';
import { supabase } from '../helper/supabase';
import {Slider} from '@miblanchard/react-native-slider';
import { set } from 'react-native-reanimated';

export default function Voice({text , created_at , user , messageUser,millis}) {
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
            
        },
        myButton:{
            width:50,
            height:50,
            borderRadius:100,
            backgroundColor:'gray',
            justifyContent:'center',
            alignItems:'center',
            flexDirection:'row'
        },
        play:{
            width:40,
            height:40,
            borderRadius:100,
        },
        Slider:{
            width:150,
            paddingHorizontal:5
        }
    })
    const [time , setTime] = useState(0);
    const [fullTime , setFullTime] = useState(0);
    const [didJustFinish , setDidJustFinish] = useState(false);
    const [sound , setSound] = useState(new Audio.Sound());
    const [isPlaying , setIsPlaying ] = useState(false)
    const [downloadLoading , setDownloadLoading] = useState(false);
    const playSound = async () => {
        setDownloadLoading(true)
        const { sound , status  } = await Audio.Sound.createAsync({uri : 'https://gxhrzxsrvbiuvolhytvw.supabase.co/storage/v1/object/public/VoiceNotes/'+text},
        { shouldPlay: true , positionMillis: time },
        (status ) => {
            setFullTime(status.playableDurationMillis);
            setTime(status.positionMillis);
            setDidJustFinish(status.didJustFinish);
            setIsPlaying(status.isPlaying);
            if(status.didJustFinish){
                setTime(0);
            }
        },);
        setSound(sound);
        await sound.playAsync();
        setDownloadLoading(false)
        }


        const stopSound = () => {
            sound.stopAsync();
        }

        
        function msToTime(s) {
            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;
            if(hrs==0){

                return mins + ':' + secs;
            }
            else{
                
                return hrs + ':' + mins + ':' + secs;
            }
          }

  return (
    < View style={styles.message}>   
    <View style={{flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity style={styles.myButton} onPress={isPlaying ? stopSound : playSound}>
                {downloadLoading ? <Image style={styles.play} source={require('./../assets/giphy.gif')}/> : isPlaying ? <Image style={styles.play} source={require('./../assets/pause.png')}/> : <Image style={styles.play} source={require('./../assets/play.png')}/>}
            </TouchableOpacity>
            <View style={styles.Slider}>
                <Slider
                value={time}
                onValueChange={value => setTime(...value)}
                maximumValue={fullTime}
                minimumValue={0}
                step={0.01}/>
            </View>
                <Text style={{color:'white' , paddingHorizontal:20}}>{downloadLoading ?  msToTime(millis) : isPlaying ? msToTime(time) : msToTime(fullTime)}  </Text>
    </View>
            <Text style={{color:'gray',justifyContent:"flex-end"}}>
                {created_at}
            </Text>
        </View>
  )
}


// {"androidImplementation": "SimpleExoPlayer", "audioPan": 0, "didJustFinish": true, "durationMillis": 28907, "isBuffering": false, "isLoaded": true, "isLooping": false, "isMuted": false, "isPlaying": false, "playableDurationMillis": 28907, "positionMillis": 28907, "progressUpdateIntervalMillis": 500, "rate": 1, "shouldCorrectPitch": false, "shouldPlay": true, "uri": "/storage/v1/object/public/VoiceNotes/recording-e534cc14-27e2-45af-be7e-58845960fa16.m4a", "volume": 1}