import { View, Text  , StyleSheet, TouchableOpacity, Image} from 'react-native'
import { Camera, CameraType } from 'expo-camera';
import React , { useEffect, useRef, useState } from 'react'
import ImageView from '../Components/ImageView';
import * as ImageManipulator from 'expo-image-manipulator';
import {Slider} from '@miblanchard/react-native-slider';



export default function Cam({setShowCamera , showCamera , user}) {
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [type, setType] = useState(CameraType.back);
    const [photo , setPhoto] = useState(null)
    const [zoom , setZoom] = useState(0)
    const [counter , setCounter] = useState(0);
    const MyCamera = useRef(); 

    let flashModes = [
        {Mode:Camera.Constants.FlashMode.on , Type:'on'},
        {Mode:Camera.Constants.FlashMode.off , Type:'off'},
        {Mode:Camera.Constants.FlashMode.auto , Type:'auto'},
        {Mode:Camera.Constants.FlashMode.torch , Type:'torch'}
    ]

    let flash = <></>
    switch(flashModes[counter%4].Type){
        case 'on':{
            flash=<Image style={styles.flipCamera}  source={require('./../assets/flash.png')}/>
            break;
        }
        case 'off':{
            flash = <Image style={styles.flipCamera}  source={require('./../assets/flashOff.png')}/>
            break;
        }
        case 'torch':{
            flash = <Image style={styles.flipCamera}  source={require('./../assets/torch.png')}/>
            break;
        }
        case 'auto':{
            flash = <Image style={styles.flipCamera}  source={require('./../assets/flashAuto.png')}/>
            break;
        }
        default:{
            flash = <Image style={styles.flipCamera}  source={require('./../assets/flashAuto.png')}/>
        }
    }
    

    useEffect(() => {
       getCameraPermission();
    },[showCamera])

    const getCameraPermission = async () => {
        req = await Camera.requestCameraPermissionsAsync()
        requestPermission(req)
    }

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
      }

    const takePic = async () => {
        let options = {
            quality:1,
            base64:true,
            exif:false
        };
        let newPhoto = await MyCamera.current.takePictureAsync({ skipProcessing: true });
        const manipResult = await ImageManipulator.manipulateAsync(
            newPhoto.uri,
            [],
            { compress: 0.2, format: ImageManipulator.SaveFormat.JPEG }
      );
        setPhoto(manipResult)
        console.log(newPhoto.uri);
    }

  return (
      <View style={styles.theCamera}>
      {photo!=null ? <ImageView setShowCamera={setShowCamera} user={user} photo={photo} setPhoto={setPhoto}/> : 
      <>
        <TouchableOpacity style={styles.Buttons2} onPressOut={() => setCounter(counter+1)} >
            {flash}
        </TouchableOpacity>
      <View style={styles.Slider}>

       <Slider
        value={zoom}
        onValueChange={value => setZoom(...value)}
        maximumValue={1}
        minimumValue={0}
        step={0.1}/>
      </View>
        {/* <VerticalSlider
            style={styles.Slider}
            value={zoom}
            onChange={(value) => setZoom(value)}
            height={200}
            width={40}
            step={0.1}
            min={0}
            max={1}
            borderRadius={5}
            minimumTrackTintColor="#2979FF"
            maximumTrackTintColor="#D1D1D6"
            ballIndicatorColor="#2979FF"
            ballIndicatorTextColor="#fff"
            /> */}
        <Camera flashMode={flashModes[counter%4].Mode} zoom={zoom} ref={MyCamera} style={styles.camera} type={type}/>
            <View style={styles.Buttons}>
                <TouchableOpacity style={styles.flipCamera} onPressOut={toggleCameraType}>
                    <Image style={styles.flipCamera} source={require('./../assets/flipCamera.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.takePicture} onPressOut={takePic}>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exitCamera} onPressOut={() => setShowCamera(false) }>
                    <Image style={styles.exitCamera} source={require('./../assets/x.png')}/>
                </TouchableOpacity>
                
            </View>
      </>}
        
    </View>
  )
}

const styles = StyleSheet.create({
    theCamera:{
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%',
        backgroundColor:'black'
    },
    camera:{
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'70%',
        
    },
    flipCamera:{
        width:40,
        height:40,
                
        
    },
    exitCamera:{
        width:40,
        height:40,
    },
    Buttons:{
        position:'absolute',
        bottom:40,
        width:'100%',
        height:'auto',
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    Buttons2:{
        position:'absolute',
        top:70,
        left:50
    },
    takePicture:{
        minWidth:80,
        minHeight:80,
        backgroundColor:'#777',
        borderRadius:100,
        top:-20
    },
    Slider:{
        width:'60%',
        height:'100%',
        position:'absolute',
        bottom:200,
        zIndex:100,
        justifyContent:'flex-end'
    }
    
})