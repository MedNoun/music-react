import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Button, View } from "react-native";
import { withNavigation } from "react-navigation"
const HomePage = ({ navigation }) => {
  return (
    <View>
      <Button
        title="go to parking"
        onPress={() => navigation.navigate("parkingComponent")}
      />
      <Button
        title="go to authentification"
        onPress={() => navigation.navigate("auth")}
      />
      <Button
        title="go to flipped"
        onPress={() => navigation.navigate("flipped")}
      />
      <Button
        title="go to first Page"
        onPress={() => navigation.navigate("firstRendred")}
      />
    </View>
  );
};
export default withNavigation(HomePage);
