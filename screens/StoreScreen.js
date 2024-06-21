import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import HeaderComponent from '../components/HeaderComponent';
import ProductCard from '../components/ProductCard';
import { API_URL } from '@env';

const StoreScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderItem = ({ item }) => (
    <ProductCard 
      product={item} 
      onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent style={styles.header} />

      <Image
        source={require("../assets/imagetore.png")}
        resizeMode="contain"
        style={styles.bannerImage}
      />

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#0000ff']}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bannerImage: {
    width: '100%',
    height: 190, // Adjust height as needed to fit the banner image
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default StoreScreen;
