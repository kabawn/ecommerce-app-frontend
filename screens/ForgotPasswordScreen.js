import React from "react";
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

const ForgotPasswordScreen = ({ navigation }) => {
  const handleForgotPassword = async (values) => {
    const { email } = values;

    try {
      const response = await axios.post(`${API_URL}/api/users/forgotpassword`, {
        email,
      });
      console.log(response.data);
      Alert.alert(
        "Succès",
        "Si un compte avec cet e-mail existe, vous recevrez un lien pour réinitialiser votre mot de passe.",
        [{ text: "OK", onPress: () => navigation.navigate("login") }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erreur lors de l'envoi de l'e-mail de réinitialisation";
      Alert.alert("Erreur", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Image source={require("../assets/inscription.png")} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Mot de passe oublié</Text>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={handleForgotPassword}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                label="Email"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                error={touched.email && errors.email}
                style={styles.input}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Envoyer
              </Button>
            </>
          )}
        </Formik>
        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text style={styles.retourConnexion}>Retour à la connexion</Text>
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
  button: {
    backgroundColor: "#266B39",
    width: "90%",
    marginVertical: 20,
  },
  error: {
    color: "red",
    width: "90%",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  retourConnexion: {
    fontSize: 15,
    color: "green",
    marginVertical: 20,
  },
});

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email requis").email("Email invalide").label("Email"),
});

export default ForgotPasswordScreen;
