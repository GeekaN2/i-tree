import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, Button, TouchableHighlight, TouchableOpacity, Pressable, Image, ScrollView } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Camera, CameraCapturedPicture } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

interface AppState {
  isCameraOpened: boolean;
  isPictureTaken: boolean;
  image?: CameraCapturedPicture
}


export default function App() {
  const [state, setState] = useState<AppState>({
    isCameraOpened: false,
    isPictureTaken: false
  });

  const openCamera = () => {
    setState({
      isCameraOpened: true,
      isPictureTaken: false,
    })
  }

  const closeCamera = () => {
    setState({
      isCameraOpened: false,
      isPictureTaken: false,
    })
  }

  const closeShowPicture = () => {
    setState({
      isCameraOpened: false,
      isPictureTaken: false
    })
  }

  const setImage = (image: CameraCapturedPicture) => {
    console.log(image);
    setState({
      isCameraOpened: false,
      isPictureTaken: true,
      image: image
    });
    console.log(state);
  }

  const sendImage = () => {
    const formData = new FormData();
    if (!state.image) {
      return;
    }

    let localUri = state.image.uri;
    let filename = String(localUri.split('/').pop());

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    /*formData.append('photo',  { uri: localUri, name: filename, type });

    return  fetch('http://localhost:3000', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    });*/

  }

  if (state.isCameraOpened) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
          <AntDesign name="close" size={32} color="black" />
          <Text style={styles.closeText}>
            close
          </Text>
        </TouchableOpacity>
        <TakePicture updateData={setImage}></TakePicture>
      </View>
    );
  } else if (state.isPictureTaken) {
    if (!state.image) {
      return (
        <SafeAreaView style={styles.openCameraContainer}>
          <Text style={styles.closeButton} onPress={closeShowPicture}>
            Image not found
        </Text>
        </SafeAreaView>)
    }
    return (
      <SafeAreaView style={styles.showImageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: state.image.uri
          }}
        ></Image>
        <View>
          <Text style={styles.plantInfo}>Plant status: <Text style={styles.bold}>Healthy</Text></Text>
        </View>
        <View style={styles.showImageFooter}>
          <TouchableOpacity style={styles.backToMainScreen} onPress={closeShowPicture}>
            <AntDesign name="arrowleft" size={32} color="black" />
            <Text style={styles.makeAnotherPhoto}>
              Choose another photo
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={styles.openCameraContainer}>
        <TouchableOpacity style={styles.openButton} onPress={openCamera}>
          <AntDesign name="camera" size={32} color="black" />
          <Text style={styles.buttonText}>Take a photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.openButton} onPress={openCamera}>
          <AntDesign name="picture" size={32} color="black" />
          <Text style={styles.buttonText}>Choose a photo</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
}


function ImagePickerExample() {
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

function TakePicture(props: any) {
  const [hasPermission, setHasPermission] = useState<boolean>();
  const [type, setType] = useState(Camera.Constants.Type.back);
  let camera: Camera | null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const snap = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();

      props.updateData(photo);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={(ref) => { camera = ref }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: "space-evenly"
          }}>
          <TouchableOpacity
            style={{
              flex: 0.3,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.4,
              alignSelf: 'flex-end',
              alignItems: 'center'
            }}
            onPress={() => {
              snap();
            }}>
            <Text style={{ fontSize: 30, marginBottom: 10, color: 'white' }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
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
    backgroundColor: "#e6e6e6",
    paddingTop: Platform.OS === "android" ? 25 : 0,
    alignItems: "center",
    flexDirection: "row-reverse"
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

  showImageContainer: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,

  },

  buttonText: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "bold"
  },

  cameraButtons: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },

  image: {
    width: "100%",
    height: "65%"
  },

  backToMainScreen: {
    display: "flex",
    width: "100%",
    height: 70,
    justifyContent: "center",
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    flexDirection: "row",
    fontWeight: "bold",
    borderRadius: 10
  },

  plantInfo: {
    fontSize: 30,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },

  showImageFooter: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-end"
  },

  bold: {
    fontWeight: "bold"
  },

  makeAnotherPhoto: {
    fontSize: 22,
    fontWeight: "bold"
  },

  closeText: {
    fontSize: 22
  }
});
