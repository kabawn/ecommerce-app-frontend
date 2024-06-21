import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, Alert, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddressContext } from '../AddressContext';
import { CartContext } from '../CartContext';
import AppButton from '../components/AppButton';

const AddressScreen = ({ navigation }) => {
  const { updateAddress, deleteAddress } = useContext(AddressContext);
  const { getTotalPrice } = useContext(CartContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [token, setToken] = useState(null);
  const deliveryPrice = 5.99;

  useEffect(() => {
    const loadTokenAndFetchAddresses = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Loaded token:', userToken); // Log the token
      setToken(userToken);
      if (userToken) {
        fetchAddresses(userToken);
      } else {
        setLoading(false);
      }
    };

    loadTokenAndFetchAddresses();
  }, []);

  const fetchAddresses = async (token) => {
    try {
      console.log('Fetching addresses with token:', token); // Log before the request
      const response = await axios.get(`${API_URL}/api/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Fetched addresses:', response.data); // Log the response
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error.response?.data || error.message); // Log the error
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (newAddress) => {
    if (!token) {
      console.error('No token available'); // Handle case when token is not available
      return;
    }
    try {
      console.log('Adding address with token:', token); // Log before the request
      const response = await axios.post(`${API_URL}/api/addresses`, newAddress, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Added address:', response.data); // Log the response
      setAddresses([...addresses, response.data]);
    } catch (error) {
      console.error('Error adding address:', error.response?.data || error.message); // Log the error
    }
  };

  const handleAddAddress = () => {
    if (selectedAddress) {
      handleUpdateAddress(selectedAddress._id);
    } else {
      addAddress(newAddress);
      setNewAddress({ address: '', city: '', postalCode: '', country: '' });
      setModalVisible(false);
    }
  };

  const handleUpdateAddress = (id) => {
    updateAddress(id, newAddress);
    setNewAddress({ address: '', city: '', postalCode: '', country: '' });
    setSelectedAddress(null);
    setModalVisible(false);
  };

  const handleDeleteAddress = (id) => {
    Alert.alert(
      "Supprimer l'adresse",
      "Êtes-vous sûr de vouloir supprimer cette adresse?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: () => deleteAddress(id)
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedAddress(item)} style={styles.addressContainer}>
      <View style={styles.addressTextContainer}>
        <Text style={styles.addressText}>{item.address}, {item.city}, {item.postalCode}, {item.country}</Text>
        {selectedAddress && selectedAddress._id === item._id && (
          <Icon name="check-circle" size={24} color="green" style={styles.checkIcon} />
        )}
      </View>
      <View style={styles.addressActions}>
        <Button onPress={() => {
          setSelectedAddress(item);
          setNewAddress(item);
          setModalVisible(true);
        }}>Modifier</Button>
        <Button onPress={() => handleDeleteAddress(item._id)}>Supprimer</Button>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Adresses de livraison</Text>
      {loading ? (
        <Text>Chargement...</Text>
      ) : addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LottieView
            source={require('../assets/no_address.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.emptyText}>Aucune adresse trouvée. Veuillez ajouter une adresse pour terminer la commande.</Text>
          <Button mode="contained" onPress={() => setModalVisible(true)}>Ajouter une adresse</Button>
        </View>
      ) : (
        <View style={styles.addressListContainer}>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderItem}
          />
          <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>Ajouter une adresse</Button>
        </View>
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedAddress(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Adresse"
              value={newAddress.address}
              onChangeText={(text) => setNewAddress({ ...newAddress, address: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Ville"
              value={newAddress.city}
              onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Code Postal"
              value={newAddress.postalCode}
              onChangeText={(text) => setNewAddress({ ...newAddress, postalCode: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Pays"
              value={newAddress.country}
              onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddAddress}>
              {selectedAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </Button>
            <Button onPress={() => {
              setModalVisible(false);
              setSelectedAddress(null);
              setNewAddress({ address: '', city: '', postalCode: '', country: '' });
            }}>Annuler</Button>
          </View>
        </View>
      </Modal>
      {addresses.length > 0 && (
        <View style={styles.pricesContainer}>
          <View style={styles.price}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>{getTotalPrice().toFixed(2)}€</Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.label}>Livraison</Text>
            <Text style={styles.value}>{deliveryPrice.toFixed(2)}€</Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.label}>Total avec livraison</Text>
            <Text style={styles.value}>{(getTotalPrice() + deliveryPrice).toFixed(2)}€</Text>
          </View>
          <AppButton
            title="PASSER À LA CAISSE"
            onPress={() => navigation.navigate('Payment', { address: selectedAddress })}
            style={{
              button: {
                width: "90%",
                backgroundColor: "#64A962",
                borderRadius: 13,
                paddingVertical: 10,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              },
              text: {
                color: "white",
                fontSize: 20,
              },
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingVertical:30
  },
  addressListContainer: {
    flex: 1,
  },
  addressContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  addressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  pricesContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  price: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 5,
  },
  label: {
    fontSize: 20,
  },
  value: {
    fontSize: 20,
    textAlign: "right",
  },
});

export default AddressScreen;
