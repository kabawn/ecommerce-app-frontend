import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { Button } from 'react-native-paper';
import { CartContext } from '../CartContext';
import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';

const CheckoutScreen = ({ navigation, route }) => {
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const { address } = route.params; // Get the address from route params
  const { selectedPaymentMethod } = route.params; // Get the selectedPaymentMethod from route params
  const [userToken, setUserToken] = useState('');
  const [user, setUser] = useState(null);
  const deliveryFee = 5.99;
  const stripe = useStripe();

  useEffect(() => {
    const getTokenAndUser = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const userData = JSON.parse(await AsyncStorage.getItem('userData'));
      setUserToken(token);
      setUser(userData);
    };
    getTokenAndUser();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Erreur', 'Veuillez sélectionner une méthode de paiement.');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image || (item.product.images && item.product.images[0]),
        price: item.product.price,
        product: item.product._id,
      }));

      const itemsPrice = getTotalPrice();
      const totalPrice = itemsPrice + deliveryFee;

      const orderData = {
        orderItems,
        shippingAddress: address,
        paymentMethod: 'Stripe',
        itemsPrice,
        taxPrice: 0,
        shippingPrice: deliveryFee,
        totalPrice,
      };

      const orderResponse = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const order = orderResponse.data;

      const paymentIntentResponse = await axios.post(
        `${API_URL}/api/payments/create-payment-intent`,
        { order_id: order._id, amount: Math.round(totalPrice * 100) },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const { clientSecret, customerId } = paymentIntentResponse.data;

      try {
        const confirmPaymentResponse = await axios.post(
          `${API_URL}/api/payments/confirm-payment`,
          {
            paymentIntentId: paymentIntentResponse.data.paymentIntentID,
            paymentMethodId: selectedPaymentMethod.id,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (confirmPaymentResponse.data.paymentIntent.status === 'succeeded') {
          clearCart();
          navigation.navigate('OrderConfirmation', { order: order });
        } else {
          Alert.alert('Erreur', 'Le paiement a échoué. Veuillez réessayer.');
        }
      } catch (confirmError) {
        Alert.alert('Erreur', 'La confirmation du paiement a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'La commande a échoué. Veuillez réessayer.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <Text style={styles.cartItemText}>{item.product.name} x {item.quantity}</Text>
      <Text style={styles.cartItemText}>{item.product.price}€</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirmation de Commande</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails de la commande</Text>
        <FlatList
          data={cart}
          keyExtractor={(item) => item.product._id.toString()}
          renderItem={renderCartItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Adresse</Text>
        <Text style={styles.value}>
          {address.address}, {address.city}, {address.postalCode}, {address.country}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Méthode de Paiement</Text>
        <Text style={styles.value}>
          {selectedPaymentMethod ? `**** **** **** ${selectedPaymentMethod.card.last4}` : 'Aucune méthode sélectionnée'}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{getTotalPrice().toFixed(2)}€</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Frais de port</Text>
        <Text style={styles.value}>5.99€</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total avec frais de port</Text>
        <Text style={styles.value}>{(getTotalPrice() + deliveryFee).toFixed(2)}€</Text>
      </View>
      <Button mode="contained" onPress={handlePlaceOrder} style={styles.button}>
        Confirmer et Payer
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    marginTop: 20,

  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#4CAF50',
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  value: {
    fontSize: 18,
    marginTop: 5,
    color: '#666666',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#64A962',
    padding: 10,
    borderRadius: 5,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartItemText: {
    fontSize: 18,
    color: '#333333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default CheckoutScreen;
