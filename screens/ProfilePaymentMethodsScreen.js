import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Switch,
  Image,
  ImageBackground,
} from "react-native";
import { Button } from "react-native-paper";
import { StripeProvider, useStripe, CardField } from "@stripe/stripe-react-native";
import { API_URL } from "@env";
import axios from "axios";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const ProfilePaymentMethodsScreen = ({ navigation }) => {
  const stripe = useStripe();
  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [userToken, setUserToken] = useState("");
  const [cardDetails, setCardDetails] = useState({});
  const [saveCard, setSaveCard] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
      if (token) {
        fetchPaymentMethods(token);
      } else {
        Alert.alert('Erreur', 'Le jeton utilisateur est manquant. Veuillez vous reconnecter.');
        navigation.navigate('login'); // Redirect to login if token is missing
      }
    };

    getToken();
  }, []);

  const fetchPaymentMethods = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/payment-methods`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentMethods(response.data);
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
        navigation.navigate('login'); // Redirect to login if session is expired
      }
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!cardDetails.complete) {
      Alert.alert("Erreur", "Veuillez entrer des détails de carte complets");
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        paymentMethodType: "Card",
        card: cardDetails,
      });

      if (error) {
        console.error("Erreur de Stripe:", error);
        Alert.alert("Erreur", error.message);
        return;
      }

      if (saveCard) {
        await axios.post(
          `${API_URL}/api/payment-methods`,
          {
            paymentMethodId: paymentMethod.id,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        fetchPaymentMethods(userToken);
      }
      setModalVisible(false);
      Alert.alert("Succès", "Méthode de paiement ajoutée avec succès");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Échec de l'ajout de la méthode de paiement");
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    Alert.alert("Supprimer la méthode de paiement", "Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/api/payment-methods/${id}`, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            });
            fetchPaymentMethods(userToken);
          } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Échec de la suppression de la méthode de paiement");
          }
        },
      },
    ]);
  };

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
    >
      <ImageBackground
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRkETvWa6dBuO9BqTBnOVjQWx5DnYNuH6Rw-mxzeGHKX5_YjBKorxQckzXezFdxX4sUnA&usqp=CAU' }}
        style={styles.cardImage}
      >
        <BlurView
          intensity={80}
          style={styles.blurView}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'transparent']}
            style={styles.linearGradient}
          >
            <Text style={styles.cardNumber}>**** **** **** {item.card.last4}</Text>
            <Text style={styles.cardExpiry}>Exp: {item.card.exp_month}/{item.card.exp_year}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.cardHolder}>Titulaire de la carte</Text>
              <Text style={styles.cardBrand}>VISA</Text>
            </View>
          </LinearGradient>
        </BlurView>
      </ImageBackground>
      <Button onPress={() => handleDeletePaymentMethod(item.id)}>Supprimer</Button>
    </TouchableOpacity>
  );

  return (
    <StripeProvider publishableKey="pk_test_51NVYfRCBIO0uHHLf1X0Wo3qFfEcniwKQPNIMTq2nq9KT5gFbughpbgpzbuljS6ph3LQdWRzmmKLJdFyzhjuNgUx700GSffMUCh">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSaveCard(true)}>
            <Image
              source={require("../assets/credit-card.png")}
              style={styles.paymentIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardsContainer}>
          {paymentMethods.length === 0 ? (
            <View style={styles.emptyContainer}>
              <LottieView
                source={require("../assets/emptyCart.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text style={styles.emptyMessageText}>
                Aucune méthode de paiement trouvée. Veuillez ajouter une méthode de paiement pour continuer.
              </Text>
              <Button mode="contained" onPress={() => setModalVisible(true)}>
                Ajouter une méthode de paiement
              </Button>
            </View>
          ) : (
            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id}
              renderItem={renderPaymentMethod}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}

          <View style={styles.addCardButtonContainer}>
            <Button mode="contained" onPress={() => setModalVisible(true)}>
              Ajouter une nouvelle carte
            </Button>
          </View>

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ajouter une méthode de paiement</Text>
                <CardField
                  postalCodeEnabled={false}
                  placeholders={{ number: "4242 4242 4242 4242" }}
                  cardStyle={styles.cardInput}
                  style={styles.cardInputContainer}
                  onCardChange={(cardDetails) => setCardDetails(cardDetails)}
                />
                <View style={styles.saveCardSwitchContainer}>
                  <Text>Enregistrer cette carte pour les paiements futurs</Text>
                  <Switch value={saveCard} onValueChange={(value) => setSaveCard(value)} />
                </View>
                <Button mode="contained" onPress={handleAddPaymentMethod}>
                  Ajouter la carte
                </Button>
                <Button onPress={() => setModalVisible(false)}>Annuler</Button>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    paddingVertical: 30,
  },
  paymentIcon: {
    width: 100,
    height: 100,
  },
  cardsContainer: {
    flex: 1,
  },
  cardContainer: {
    width: 340,
    height: 250,
    borderRadius: 10,
  },
  cardImage: {
    width: 320,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurView: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  linearGradient: {
    height: '100%',
    width: '100%',
    padding: 20,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardExpiry: {
    fontSize: 16,
    color: "#fff",
    marginTop: 10,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cardHolder: {
    fontSize: 16,
    color: "#fff",
  },
  cardBrand: {
    fontSize: 16,
    color: "#fff",
  },
  addCardButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessageText: {
    fontSize: 18,
    marginBottom: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  cardInput: {
    backgroundColor: "#efefef",
    borderRadius: 8,
  },
  cardInputContainer: {
    height: 50,
    marginVertical: 30,
  },
  saveCardSwitchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
});

export default ProfilePaymentMethodsScreen;
