import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log('Loaded token:', userToken); // Log the token
      setToken(userToken);
    };

    loadToken();
  }, []);

  const addAddress = async (newAddress) => {
    if (!token) {
      console.error('No token available'); // Handle case when token is not available
      return;
    }
    try {
      console.log('Adding address:', newAddress); // Log before the request
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

  const updateAddress = async (id, updatedAddress) => {
    if (!token) {
      console.error('No token available'); // Handle case when token is not available
      return;
    }
    try {
      console.log('Updating address:', id, updatedAddress); // Log before the request
      const response = await axios.put(`${API_URL}/api/addresses/${id}`, updatedAddress, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Updated address:', response.data); // Log the response
      setAddresses(addresses.map(addr => addr._id === id ? response.data : addr));
    } catch (error) {
      console.error('Error updating address:', error.response?.data || error.message); // Log the error
    }
  };

  const deleteAddress = async (id) => {
    if (!token) {
      console.error('No token available'); // Handle case when token is not available
      return;
    }
    try {
      console.log('Deleting address:', id); // Log before the request
      await axios.delete(`${API_URL}/api/addresses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Deleted address:', id); // Log the response
      setAddresses(addresses.filter(addr => addr._id !== id));
    } catch (error) {
      console.error('Error deleting address:', error.response?.data || error.message); // Log the error
    }
  };

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, deleteAddress, loading }}>
      {children}
    </AddressContext.Provider>
  );
};
