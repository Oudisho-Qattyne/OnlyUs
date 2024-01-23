import { View, Text ,Image , TouchableOpacity , StyleSheet , Dimensions} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom';
// import { supabase } from '../helper/supabase'

import React, { useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library';

export default function FullImage({url , setViewImage}) {
    // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    
    const styles = StyleSheet.create({
        container:{
            position:'absolute',
            width:'100%',
            height:'100%',
            backgroundColor:'black'
        },
        image:{
            top:200,
            width:'100%',
            height:'70%',
        },
        close:{
            position:'absolute',
            justifyContent:'space-between',
            flexDirection:'row',
            top:70,
            width:'90%',
            flex:1,
            left:30,
            zIndex:10
        },
        logo:{
            width:40,
            height:40,
        }
    })
    // useEffect(() => {
    //     requestPermission()
    // } ,[])
    // const savePhoto = async () => {
    // const { data, error } = await supabase.storage.from('Images').download(url)
    //     console.log(data);
    //     MediaLibrary.saveToLibraryAsync(data)
    // }
  return (
    <View style={styles.container}>
        <View style={styles.close}>
            <TouchableOpacity  onPress={() => setViewImage(false)}>
                <Image style={styles.logo} source={require('./../assets/x.png')}/>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={savePhoto}>
                <Image style={styles.logo} source={require('./../assets/download.png')}/>
            </TouchableOpacity> */}
        </View>
    <ImageZoom 
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={Dimensions.get('window').width}
        imageHeight={Dimensions.get('window').height}>

        <Image style={styles.image} source={{uri:'https://gxhrzxsrvbiuvolhytvw.supabase.co/storage/v1/object/public/Images/'+url}}/>

    </ImageZoom>
</View>
  )
}