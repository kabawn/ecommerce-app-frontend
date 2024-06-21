import React, { useState } from "react";
import {
   SafeAreaView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   ScrollView,
   Alert,
   Image,
} from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { API_URL } from "@env";
import { TextInput, Button } from "react-native-paper";
import Oauth from "../components/forms/Oauth";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = ({ navigation }) => {
   const [showPassword, setShowPassword] = useState(false);
   const [showCodeField, setShowCodeField] = useState(false); // State for showing code field

   const handleUserProPress = () => {
      setShowCodeField(true); // Show code field for UserPro
   };
   const handleUserPress = () => {
      setShowCodeField(false); // Hide code field for User
   };

   const handleLogin = async (values) => {
    const { identifier, password } = values;
  
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email: identifier,
        password,
      });
      const { token } = response.data; // Assuming the response contains the token
      await AsyncStorage.setItem('userToken', token); // Save the token
      console.log(response.data);
      navigation.navigate("store");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      Alert.alert("Erreur", errorMessage);
    }
  };

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.banner}>
            <Image source={require("../assets/inscription.png")} />
         </View>
         <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.headerText}>Connexion</Text>
            <Formik
               initialValues={{
                  identifier: "",
                  password: "",
                  code: "",
               }}
               onSubmit={handleLogin}
               validationSchema={validationSchema}
            >
               {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                     <TextInput
                        label="Email"
                        mode="outlined"
                        onChangeText={handleChange("identifier")}
                        onBlur={handleBlur("identifier")}
                        value={values.identifier}
                        error={touched.identifier && errors.identifier}
                        style={styles.input}
                     />
                     {touched.identifier && errors.identifier && (
                        <Text style={styles.error}>{errors.identifier}</Text>
                     )}
                     <View style={styles.passwordContainer}>
                        <TextInput
                           label="Mot de passe"
                           mode="outlined"
                           secureTextEntry={!showPassword}
                           onChangeText={handleChange("password")}
                           onBlur={handleBlur("password")}
                           value={values.password}
                           error={touched.password && errors.password}
                           style={[styles.input, styles.passwordInput]}
                        />
                        <TouchableOpacity
                           style={styles.eyeIcon}
                           onPress={() => setShowPassword(!showPassword)}
                        >
                           <Icon name={showPassword ? "eye-off" : "eye"} size={24} />
                        </TouchableOpacity>
                     </View>
                     {touched.password && errors.password && (
                        <Text style={styles.error}>{errors.password}</Text>
                     )}
                     {showCodeField && (
                        <TextInput
                           label="Code"
                           mode="outlined"
                           onChangeText={handleChange("code")}
                           onBlur={handleBlur("code")}
                           value={values.code}
                           error={touched.code && errors.code}
                           style={styles.input}
                        />
                     )}
                     {touched.code && errors.code && (
                        <Text style={styles.error}>{errors.code}</Text>
                     )}
                     <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                        <Text style={styles.Mpdoublie}>Mot de passe oublié ?</Text>
                     </TouchableOpacity>

                     <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                        Se connecter
                     </Button>
                  </>
               )}
            </Formik>
            <View style={styles.connexion}>
               <View style={styles.LineViewlayout} />
               <Text style={styles.textConnexion}>Ou se connecter avec</Text>
               <View style={styles.LineViewlayout} />
            </View>
            <Oauth
               onGoogleSignIn={() => console.log("Google Sign-In")}
               onFacebookSignIn={() => console.log("Facebook Sign-In")}
            />
            <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
               <Text style={styles.nouveauCompte}>je n'ai pas encore de compte ?</Text>
            </TouchableOpacity>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   scrollContainer: {
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
   },
   banner: {
      marginTop: 30,
   },
   input: {
      width: "90%",
      marginVertical: 10,
   },
   passwordContainer: {
      width: "90%",
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
   },
   passwordInput: {
      flex: 1,
   },
   eyeIcon: {
      position: "absolute",
      right: 15,
   },
   button: {
      backgroundColor: "#266B39",
      width: "90%",
      marginVertical: 20,
   },
   connexion: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 20,
   },
   LineViewlayout: {
      height: 1,
      width: 110,
      backgroundColor: "black",
   },
   textConnexion: {
      fontSize: 18,
      marginHorizontal: 10,
   },
   nouveauCompte: {
      fontSize: 15,
      color: "green",
      marginVertical: 20,
   },
   error: {
      color: "red",
      width: "90%",
   },
   Mpdoublie: {
      color: "blue",
      marginTop: 10,
      marginBottom: 20,
      alignSelf: "flex-end",
   },
   headerText: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
   },
});

const validationSchema = Yup.object().shape({
   identifier: Yup.string()
      .required("Email ou nom d'utilisateur requis")
      .test("isEmailOrUsername", "Email/nom d'utilisateur invalide", (value) => {
         const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
         const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
         return emailRegex.test(value) || usernameRegex.test(value);
      })
      .label("Identifier"),
   password: Yup.string()
      .required("Mot de passe requis")
      .min(6, "Mot de passe: minimum 6 caractères")
      .label("Mot de passe"),
   code: Yup.string()
      .matches(/^[A-Z0-9]{8}$/, "Code: 8 caractères, majuscules et chiffres.")
      .label("Code abonnement"),
});

export default LoginScreen;
