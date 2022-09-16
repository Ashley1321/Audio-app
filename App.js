import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,Button, Image} from 'react-native';
import {Audio} from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import pic from './assets/play.jpg';
import stop from './assets/stop.webp';
import mic from './assets/mic.webp'
import { Hark } from 'hark';
import { ScrollView } from 'react-native';


export default function App() {
  const [recording,setRecoding] = React.useState();
  const [recordings,setRecodings] = React.useState([]);
  const [message,setMessage]= React.useState("")

  async function startRecording(){
    //get access to the mic 
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted'){
        await Audio.setAudioModeAsync({
          allowRecordingIOS: true,
          playInSilentModeIOS: true
        });
        const {recording} = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTION_PRESET_HIGH_QUALITY
        );
        setRecoding(recording);
      } else{
        setMessage("Please grant permission to app to access microphone");

      }

    }catch(err){
      console.error('failed to start recording',err);
    }
     
  }

  async function stopRecording(){
    setRecoding(undefined)
    await recording.stopAndUnloadAsync();

    let updatedRecordings =[...recordings];
    const {sound,status}= await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file:recording.getURI()
    });

    setRecodings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis /1000 /60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay)*60);
    const secondsDisplay = seconds < 10 ? `0${seconds}`: seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  function getRecordingLines(){
    return recordings.map((recordingLine,index)=> {
      return(
       
        <View key={index} style={styles.row}>
          <Text style={styles.recording}>Recording {index + 1}-{recordingLine.duration}</Text>
          <Text style={styles.button} onPress={() => recordingLine.sound.replayAsync()}>Play</Text>
        </View>  
      )
    })
  }
  
  return (
    
       <LinearGradient style={{height:'100%',}} colors={["black","red"]}>
        <ScrollView>
      <View style={styles.container}>
       <Text style={{color:'red',  marginTop:50, fontSize:50,textAlign: 'center'}}>Audio Maker</Text>
       <View style={styles.picView}>
       <Image   style={{height:200,width:200,borderRadius:100,}}
        source={mic}
        />
       </View>
          <Text>{message}</Text>
          <View style={{alignItems:'center',}}>
          <Text style={{padding:20}} onPress={recording ? stopRecording : startRecording}>{recording ?
            <Image source={stop} style={{ height: 55, width: 55,alignItems: 'center',margin:10}} />
            :<Image source={pic} style={{ height: 50, width: 50,alignItems: 'center',margin:10}} />}
          </Text>
          {getRecordingLines()} 
            
          </View>
         
    </View>
    </ScrollView>
    </LinearGradient>
    
   
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row:{
    padding:7,
  },
  recording:{
    color:'black',
    fontSize:20,
    textAlign:'center'
  },
  button:{
    backgroundColor: 'black',
    padding:5,
    textAlign:'center',
    borderRadius:3, 
    color:'red',
    width:300
  },

  picView:{
    alignItems: 'center',
    marginTop:20
  },
  playing:{
  }
});




