import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, Button, TouchableHighlight, TouchableOpacity, Pressable } from "react-native";
import TakePicture from './app/screens/TakePicture'
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  const [state, setState] = useState<{ isCameraOpened: boolean }>({ isCameraOpened: false });

  const openCamera = () => {
    setState({
      isCameraOpened: !state.isCameraOpened
    })
  }



  if (state.isCameraOpened) {
    return (
      <View style={{ flex: 1}}>
        <Text style={styles.closeButton} onPress={openCamera}>
          Close
        </Text>
        <TakePicture></TakePicture>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.openCameraContainer}>
      <Pressable style={styles.openButton} onPress={openCamera}>
        <AntDesign name="camera" size={32} color="black" />
        <Text style={styles.buttonText}>Take a photo</Text>
      </Pressable>
      <Pressable style={styles.openButton} onPress={openCamera}>
        <AntDesign name="picture" size={32} color="black" />
        <Text style={styles.buttonText}>Choose a photo</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "dodgerblue",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  closeButton: {
    width: "100%",
    height: 70,
    textAlign: "center",
    backgroundColor: "#ff0000",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center"
  },

  openButton: {
    width: "100%",
    height: 70,
    textAlign: "center",
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginTop: 10,
  },

  openCameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },

  buttonText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold"
  }
});
