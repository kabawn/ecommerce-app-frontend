import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import LottieView from 'lottie-react-native';

const OrderConfirmationScreen = ({ route }) => {
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <LottieView 
        source={require('../assets/animation_lmkatukn.json')} 
        autoPlay 
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.title}>Merci pour votre commande !</Text>
      <Text style={styles.message}>Votre commande a été passée avec succès. Nous vous remercions pour votre achat !</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Détails de la commande</Text>
        <FlatList
          data={order.orderItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItemContainer}>
              <Text style={styles.cartItemText}>{item.name} x {item.qty}</Text>
              <Text style={styles.cartItemText}>{item.price}€</Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Adresse</Text>
        <Text style={styles.value}>
          {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total</Text>
        <Text style={styles.value}>{order.itemsPrice}€</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Frais de port</Text>
        <Text style={styles.value}>{order.shippingPrice}€</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Total avec frais de port</Text>
        <Text style={styles.value}>{order.totalPrice}€</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  animation: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555555',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cartItemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
});

export default OrderConfirmationScreen;
