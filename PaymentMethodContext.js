import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@env';

export const PaymentMethodContext = createContext();

export const PaymentMethodProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment-methods`);
      setPaymentMethods(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethodId) => {
    try {
      const response = await axios.post(`${API_URL}/api/payment-methods`, { paymentMethodId });
      setPaymentMethods([...paymentMethods, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePaymentMethod = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/payment-methods/${id}`);
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PaymentMethodContext.Provider value={{ paymentMethods, addPaymentMethod, deletePaymentMethod, loading }}>
      {children}
    </PaymentMethodContext.Provider>
  );
};
