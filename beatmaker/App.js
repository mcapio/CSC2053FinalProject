import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Audio } from 'expo-av';
import { SoundList } from './SoundList';

export default function App() {

  const soundData = [
    { sound: require('./assets/soundpack/3_10_120bpm_Em.wav'), label: 'Sound 1' },
    { sound: require('./assets/soundpack/4_1_160bpm_Cm.wav'), label: 'Sound 2' },
    { sound: require('./assets/soundpack/5_2_165bpm_Am.wav'), label: 'Sound 3' },
    { sound: require('./assets/soundpack/6_3_165bpm_Gm.wav'), label: 'Sound 4' },
    { sound: require('./assets/soundpack/7_4_149bpm_Cm.wav'), label: 'Sound 5' },
    { sound: require('./assets/soundpack/9_6_155bpm_Gm.wav'), label: 'Sound 6' },
    { sound: require('./assets/soundpack/10_7_155bpm_Fm.wav'), label: 'Sound 7' },
    { sound: require('./assets/soundpack/12_8_160bpm_Cm.wav'), label: 'Sound 8' },
    { sound: require('./assets/soundpack/13_9_120bpm_Am.wav'), label: 'Sound 9' },
    { sound: require('./assets/soundpack/15_Bonus_1_120bpm_Em.wav'), label: 'Sound 10' },
    { sound: require('./assets/soundpack/16_Bonus_2_125bpm_Gm.wav'), label: 'Sound 11' },
    { sound: require('./assets/soundpack/17_Bonus_3_125bpm_Cm.wav'), label: 'Sound 12' },
    { sound: require('./assets/soundpack/18_Bonus_4_139bpm_Am.wav'), label: 'Sound 13' },
    { sound: require('./assets/soundpack/19_Bonus_5_155bpm_Am.wav'), label: 'Sound 14' },
  ];

  const [soundObjects, setSoundObjects] = useState([]);

  const playSound = async (sound) => {
    const { sound: newSoundObject, status } = await Audio.Sound.createAsync(
      sound,
      { shouldPlay: true, isLooping: true }
    );

    setSoundObjects((prevSoundObjects) => [...prevSoundObjects, newSoundObject]);
  };

  const stopAllSounds = async () => {
    soundObjects.forEach(async (soundObject) => {
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    });
    setSoundObjects([]);
  };

  // Function to render a single button
  const renderButton = (item, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => playSound(item.sound)}
      style={styles.button}
    >
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {soundData.map(renderButton)}
      </View>
      <StatusBar style="auto" />
      <TouchableOpacity onPress={stopAllSounds} style={styles.button}>
        <Text>Stop All Sounds</Text>
      </TouchableOpacity>
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
  button: {
    padding: 10,
    margin: 10,
    backgroundColor: 'lightgray',
  },
});
