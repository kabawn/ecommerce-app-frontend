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
import Oauth from "../components/forms/Oauth";

const Inscription = ({ navigation }) => {
  const handleRegister = async (values) => {
    const { email, password, firstName, lastName, phone } = values;

    try {
      const response = await axios.post(`${API_URL}/api/users`, {
        email,
        password,
        firstName,
        lastName,
        phone,
        role: "pharmacy",
      });
      Alert.alert(
        "Succès",
        "Enregistrement réussi. Veuillez vérifier votre email.",
        [{ text: "OK", onPress: () => navigation.navigate("login") }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      Alert.alert("Erreur", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Image source={require("../assets/inscription.png")} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Formik
          initialValues={{
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
          }}
          onSubmit={handleRegister}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                label="Prénom"
                mode="outlined"
                onChangeText={handleChange("firstName")}
                onBlur={handleBlur("firstName")}
                value={values.firstName}
                error={touched.firstName && errors.firstName}
                style={styles.input}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.error}>{errors.firstName}</Text>
              )}
              <TextInput
                label="Nom"
                mode="outlined"
                onChangeText={handleChange("lastName")}
                onBlur={handleBlur("lastName")}
                value={values.lastName}
                error={touched.lastName && errors.lastName}
                style={styles.input}
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.error}>{errors.lastName}</Text>
              )}
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
              <TextInput
                label="Mot de passe"
                mode="outlined"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                error={touched.password && errors.password}
                style={styles.input}
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <TextInput
                label="Téléphone"
                mode="outlined"
                keyboardType="phone-pad"
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                value={values.phone}
                error={touched.phone && errors.phone}
                style={styles.input}
              />
              {touched.phone && errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                S'inscrire
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
        <TouchableOpacity onPress={() => navigation.navigate("login")}>
          <Text style={styles.nouveauCompte}>j'ai deja un compte ?</Text>
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
    backgroundColor: "#64A962",
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
});

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email requis").email("Email invalide").label("Email"),
  password: Yup.string()
    .required("Mot de passe requis")
    .min(6, "Mot de passe: minimum 6 caractères")
    .label("Mot de passe"),
  firstName: Yup.string()
    .required("Prénom requis")
    .min(2, "Prénom: minimum 2 caractères")
    .max(50, "Prénom: maximum 50 caractères")
    .label("Prénom"),
  lastName: Yup.string()
    .required("Nom requis")
    .min(2, "Nom: minimum 2 caractères")
    .max(50, "Nom: maximum 50 caractères")
    .label("Nom"),
  phone: Yup.string()
    .required("Téléphone requis")
    .matches(/^[0-9]{10}$/, "Téléphone: 10 chiffres requis")
    .label("Téléphone"),
});

export default Inscription;
