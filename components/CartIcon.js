// CartIcon.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CartContext } from '../CartContext';

const CartIcon = ({ onPress }) => {
  const { cart } = useContext(CartContext);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.container}>
      <MaterialIcons name="shopping-cart" size={28} color="black" onPress={onPress} />
      {cartItemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartItemCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 5,
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CartIcon;
