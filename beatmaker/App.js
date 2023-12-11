// App.js
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SoundList } from './SoundList';
import RecordButton from './RecordButton';
import { onValue, off, getDatabase, ref, getStorage, initializeApp, uploadBytes } from 'firebase/database';
import { initializeApp as initializeFirebaseApp } from 'firebase/app';
import { getStorage as getFirebaseStorage } from 'firebase/storage';

export default function App() {
  const { soundData, renderButton, playSound, stopAllSounds } = SoundList();
  const recordingsRef = useRef(null);
  const storageRef = useRef(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: "AIzaSyDMuTeUMrkbjwO-9u-hsgF92ZAqs1SrB8I",
      authDomain: "beatmaker-app.firebaseapp.com",
      projectId: "beatmaker-app",
      storageBucket: "beatmaker-app.appspot.com",
      messagingSenderId: "327103737329",
      appId: "1:327103737329:web:8da4cf338476321b52a850",
      measurementId: "G-EEK9DZ86TL"
    };

    const app = initializeFirebaseApp(firebaseConfig);
    const database = getDatabase(app);
    const storage = getFirebaseStorage(app);

    recordingsRef.current = ref(database, 'recordings');
    storageRef.current = storage;

    return () => {
      off(recordingsRef.current, 'value', recordingsListener);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {soundData.map((item, index) => renderButton(item, index, playSound))}
      </View>
      <View style={styles.buttonsContainer}>
        <RecordButton recordingsRef={recordingsRef.current} storageRef={storageRef.current} />
        <TouchableOpacity onPress={stopAllSounds} style={styles.button}>
          <Text>Stop All Sounds</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '80%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: 'lightgray',
  },
});
