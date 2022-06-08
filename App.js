import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import Recorder from "./components/recorder/Recorder";

export default function App() {
  return <Recorder />;
}
