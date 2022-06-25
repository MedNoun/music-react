import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";

import { withNavigation } from "react-navigation";
// import { Axios } from "axios";
import axios, * as others from "axios"; // correct way to import axios
import base64 from "react-native-base64";

const baseURL = "http://192.168.1.6:5000";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});
const Recorder = ({ navigation }) => {
  const [recording, setRecording] = React.useState();
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [wait, setWait] = React.useState(false);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
          android: {
            extension: ".mp4",
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
          },
          ios: {
            extension: ".wav",
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        };
        const { recording } = await Audio.Recording.createAsync(
          RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        const callback = (status) => {
          console.log();
        };

        // ✨✨✨set the callback
        recording.setOnRecordingStatusUpdate(callback);
        setRecording(recording);
      } else {
        setMessage("Please grant permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function sendData(recording) {

    var apiResponse = '';
    // utitlity function to convert BLOB to BASE64
    const blobToBase64 = (blob) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };

    // Fetch audio binary blob data

    const audioURI = recording;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", audioURI, true);
      xhr.send(null);
    });

    const audioBase64 = await blobToBase64(blob);

    const response = await axios
      .post(`${baseURL}/api/transcribe`, { audio: base64.encode(audioBase64) })
      .then(function (response) {
        console.log(response.status); // use response.data to send to Sheet component
        apiResponse = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    // We're done with the blob and file uploading, close and release it
    blob.close();
    return apiResponse;
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  async function handleSend(recording) {
    setWait(true);
    const response = await sendData(recording);
    setWait(false);
    // console.log(response.data)
    navigation.navigate("Sheet", {
      response: response,
    });
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>

          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          ></Button>
          <Button title="Send" onPress={() => handleSend(recordingLine.file)} />
          <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Share"
          ></Button>
        </View>
      );
    });
  }
  if (wait) {
    return (
      <View
        style={{
          dispay: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            marginTop: 300,
            width: 200,
            height: 200,
          }}
          source={require("../../assets/splash.png")}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>{message}</Text>
        <Button
          title={recording ? "Stop Recording" : "Start Recording"}
          onPress={recording ? stopRecording : startRecording}
        />
        {getRecordingLines()}
        <StatusBar style="auto" />
      </View>
    );
  }
};
export default withNavigation(Recorder);
