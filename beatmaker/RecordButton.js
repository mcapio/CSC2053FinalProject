import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getDatabase, ref, push } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

export default function RecordButton({ recordingsRef }) {
  const [recording, setRecording] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('idle');
  const [audioPermission, setAudioPermission] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

  useEffect(() => {
    async function getPermission() {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        console.log('Permission Granted: ' + granted);
        setAudioPermission(granted);
      } catch (error) {
        console.error(error);
      }
    }

    getPermission();

    return () => {
      if (recordingStatus === 'recording') {
        stopRecording();
      }
    };
  }, [recordingStatus]);

  async function startRecording() {
    try {
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }

      const newRecording = new Audio.Recording();
      console.log('Starting Recording');
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    try {
      if (recordingStatus === 'recording' && recording) {
        console.log('Stopping recording');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
  
        // Upload the recording to Firebase Storage
        const storage = getStorage();
        const storageReference = storageRef(storage, `recordings/${Date.now()}.m4a`);
        const response = await fetch(uri);
        const blob = await response.blob();
  
        await uploadBytes(storageReference, blob);
  
        // Reset states to record again
        setRecording(null);
        setRecordingStatus('stopped');
      } else {
        console.log('Recording is not in progress or already stopped');
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  }
  

  async function handleRecordingButtonPress() {
    if (recording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRecordingButtonPress}>
        <FontAwesome name={recording ? 'stop-circle' : 'circle'} size={20} color="white" />
      </TouchableOpacity>
      <Text style={styles.recordingStatusText}>{`Recording status: ${recordingStatus}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'red',
    marginBottom: 10,
  },
  recordingStatusText: {
    marginTop: 16,
  },
});

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyDMuTeUMrkbjwO-9u-hsgF92ZAqs1SrB8I",
    authDomain: "beatmaker-app.firebaseapp.com",
    projectId: "beatmaker-app",
    storageBucket: "beatmaker-app.appspot.com",
    messagingSenderId: "327103737329",
    appId: "1:327103737329:web:8da4cf338476321b52a850",
    measurementId: "G-EEK9DZ86TL"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const recordingsRef = ref(database, 'recordings');
