import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { API_URL } from '@env';

const ProductCard = ({ product, onPress }) => {
  const imageUrl = product.images && product.images.length > 0 
    ? `${API_URL}/${product.images[0]}` 
    : 'https://via.placeholder.com/150';

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
      <Card>
        <Card.Cover source={{ uri: imageUrl }} style={styles.image} />
        <Card.Content>
          <Title style={styles.title}>{product.name}</Title>
          <Paragraph style={styles.price}>{product.price} €</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    height: 150,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProductCard;
