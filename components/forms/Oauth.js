// components/OauthButtons.js

import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const OauthButtons = ({ onGoogleSignIn, onFacebookSignIn }) => {
  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="google"
        onPress={onGoogleSignIn}
        style={[styles.button, styles.googleButton]}
      >
        Se connecter avec Google
      </Button>
      <Button
        mode="contained"
        icon="facebook"
        onPress={onFacebookSignIn}
        style={[styles.button, styles.facebookButton]}
      >
        Se connecter avec Facebook
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: '90%',
    marginVertical: 10,
  },
  googleButton: {
    backgroundColor: "#DB4437",
  },
  facebookButton: {
    backgroundColor: "#3b5998",
  },
});

export default OauthButtons;
