import React from "react";
import { StyleSheet, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StripeProvider } from '@stripe/stripe-react-native';
import { CartProvider } from "./CartContext";
import { AddressProvider } from "./AddressContext";
import { PaymentMethodProvider } from "./PaymentMethodContext";

import HomeScreen from "./screens/homeScreen";
import LoginScreen from "./screens/LoginScreen";
import StoreScreen from "./screens/StoreScreen";
import Inscription from "./screens/InscriptionScreen";
import StartScreen from "./screens/startScreen";
import PanierScreen from "./screens/Panier";
import StockScreen from "./screens/StockScreen";
import ProfileScreen from "./screens/Profile";
import Scan from "./screens/Scan";
import PersonanInformation from "./screens/PersonanInformation";
import Loginandsecurity from "./screens/Loginandsecurity";
import HisrotiCommande from "./screens/HisrotiCommande";
import TermsOflegal from "./screens/TermsOflegal";
import DetailsProduct from "./screens/DetailsProduct";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import CartScreen from "./screens/CartScreen";
import AddressScreen from "./screens/AddressScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import OrderConfirmationScreen from "./screens/OrderConfirmation";
import ProfilePaymentMethodsScreen from "./screens/ProfilePaymentMethodsScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
   return (
      <Tab.Navigator screenOptions={{ headerShown: false }}>
         <Tab.Screen
            name="Store"
            component={StoreScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Image
                     source={require("./assets/icons/Call.png")}
                     style={{ width: size, height: size, tintColor: color }}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Panier"
            component={CartScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Image
                     source={require("./assets/icons/panier.png")}
                     style={{ width: size, height: size, tintColor: color }}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Scan"
            component={Scan}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Image
                     source={require("./assets/icons/scan.png")}
                     style={{ width: size, height: size, tintColor: color }}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Stock"
            component={StockScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Image
                     source={require("./assets/icons/Stock.png")}
                     style={{ width: size, height: size, tintColor: color }}
                  />
               ),
            }}
         />
         <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Image
                     source={require("./assets/icons/Profile.png")}
                     style={{ width: size, height: size, tintColor: color }}
                  />
               ),
            }}
         />
      </Tab.Navigator>
   );
}

export default function App() {
   return (
      <StripeProvider
         publishableKey="pk_test_51NVYfRCBIO0uHHLf1X0Wo3qFfEcniwKQPNIMTq2nq9KT5gFbughpbgpzbuljS6ph3LQdWRzmmKLJdFyzhjuNgUx700GSffMUCh"
      >
         <CartProvider>
            <AddressProvider>
                  <NavigationContainer>
                     <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="login" component={LoginScreen} />
                        <Stack.Screen name="store" component={TabNavigator} />
                        <Stack.Screen name="Inscription" component={Inscription} />
                        <Stack.Screen name="start" component={StartScreen} />
                        <Stack.Screen name="personalInf" component={PersonanInformation} />
                        <Stack.Screen name="LoginSecurity" component={Loginandsecurity} />
                        <Stack.Screen name="ProfilePaymentMethodsScreen" component={ProfilePaymentMethodsScreen} />
                        <Stack.Screen name="HistoriCommande" component={HisrotiCommande} />
                        <Stack.Screen name="TermOflegal" component={TermsOflegal} />
                        <Stack.Screen name="productDetail" component={DetailsProduct} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
                        <Stack.Screen name="Cart" component={CartScreen} />
                        <Stack.Screen name="Address" component={AddressScreen} />
                        <Stack.Screen name="Payment" component={PaymentMethodScreen} />
                        <Stack.Screen name="Checkout" component={CheckoutScreen} />
                        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />

                     </Stack.Navigator>
                  </NavigationContainer>
            </AddressProvider>
         </CartProvider>
      </StripeProvider>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
   },
});
