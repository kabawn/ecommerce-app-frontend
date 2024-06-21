import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.product._id === product._id);
      if (existingProduct) {
        return prevCart.map(item => 
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Ensure the image field is included here
        return [...prevCart, { product: { ...product, image: product.image }, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.product._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => 
      prevCart.map(item => 
        item.product._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getTotalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
