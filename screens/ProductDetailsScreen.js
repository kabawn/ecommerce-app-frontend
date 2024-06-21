import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import { Button } from 'react-native-paper';
import { CartContext } from '../CartContext';
import HeaderComponent from '../components/HeaderComponent';

const ProductDetailsScreen = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (increment) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + increment;
      return newQuantity > 0 ? newQuantity : 1; // Ensure quantity is at least 1
    });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log('Added to cart');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (!product) {
    return <Text style={styles.errorText}>Produit introuvable</Text>;
  }

  const imageUrl = product.images && product.images.length > 0 
    ? `${API_URL}/${product.images[0]}` 
    : 'https://via.placeholder.com/300';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderComponent style={styles.header} />

      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price} €</Text>
        </View>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.size}>Taille: {product.size}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleQuantityChange(-1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" style={styles.addButton} onPress={handleAddToCart}>
          Ajouter au panier
        </Button>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginTop:20
  },
  detailsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding:5

  },
  price: {
    fontSize: 20,
    color: '#888',
    padding:5

  },
  description: {
    fontSize: 16,
    marginVertical: 10,
    padding:5
  },
  size: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 50,
  },
  quantityButtonText: {
    fontSize: 20,
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#64A962',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'white',
  },
  fullImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default ProductDetailsScreen;
