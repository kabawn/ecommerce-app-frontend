import React, { useContext } from "react";
import {
   View,
   Text,
   Image,
   StyleSheet,
   FlatList,
   TouchableOpacity,
   SafeAreaView,
} from "react-native";
import { Button } from "react-native-paper";
import LottieView from "lottie-react-native"; // Import Lottie
import { CartContext } from "../CartContext";
import { API_URL } from "@env";
import AppButton from "../components/AppButton"; // Ensure you have an AppButton component

const CartScreen = ({ navigation }) => {
   const { cart, removeFromCart, updateQuantity, getTotalPrice } = useContext(CartContext);

   const renderItem = ({ item }) => {
      const imageUrl =
         item.product.images && item.product.images.length > 0
            ? `${API_URL}/${item.product.images[0].replace(/\\/g, "/")}`
            : "https://via.placeholder.com/300";

      return (
         <View style={styles.productContainer}>
            <View style={styles.imageContainer}>
               <Image source={{ uri: imageUrl }} style={styles.productImage} />
            </View>
            <View style={styles.productDetails}>
               <View style={styles.productHeader}>
                  <Text style={styles.productName}>{item.product.name}</Text>
                  <TouchableOpacity onPress={() => removeFromCart(item.product._id)}>
                     <Text style={styles.removeButton}>X</Text>
                  </TouchableOpacity>
               </View>
               <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{item.product.price}€</Text>
                  <View style={styles.quantityControls}>
                     <TouchableOpacity
                        onPress={() => updateQuantity(item.product._id, item.quantity - 1)}
                        style={styles.quantityButton}
                     >
                        <Text style={styles.quantityButtonText}>-</Text>
                     </TouchableOpacity>
                     <Text style={styles.quantityText}>{item.quantity}</Text>
                     <TouchableOpacity
                        onPress={() => updateQuantity(item.product._id, item.quantity + 1)}
                        style={styles.quantityButton}
                     >
                        <Text style={styles.quantityButtonText}>+</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </View>
      );
   };

   const ListFooter = () => (
      <View style={styles.pricesContainer}>
         <View style={styles.price}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>{getTotalPrice().toFixed(2)}€</Text>
         </View>
         <View style={styles.price}>
            <Text style={styles.label}>Livraison</Text>
            <Text style={styles.value}>5.99€</Text>
         </View>
         <View style={styles.price}>
            <Text style={styles.label}>Total avec livraison</Text>
            <Text style={styles.value}>{(getTotalPrice() + 5.99).toFixed(2)}€</Text>
         </View>
         <AppButton
            title="PASSER À LA CAISSE"
            onPress={() => navigation.navigate("Address")}
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
   );

   return (
      <SafeAreaView style={styles.container}>
         <Text style={styles.panierText}>Panier</Text>
         {cart.length > 0 ? (
            <FlatList
               data={cart}
               keyExtractor={(item) => item.product._id.toString()}
               renderItem={renderItem}
               contentContainerStyle={styles.list}
               ListFooterComponent={ListFooter}
            />
         ) : (
            <View style={styles.emptyContainer}>
               <LottieView
                  source={require("../assets/emptyCart.json")}
                  autoPlay
                  loop
                  style={styles.lottie}
               />
               <Text style={styles.emptyPanierText}>Votre panier est vide</Text>
               <Text style={styles.emptyMessageText}>
                  Ajoutez des produits à votre panier pour commencer vos achats.
               </Text>
               <Button
                  mode="contained"
                  onPress={() => navigation.navigate("Store")}
                  style={styles.storeButton}
               >
                  Retourner au magasin
               </Button>
            </View>
         )}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "white",
   },
   list: {
      paddingBottom: 20,
   },
   pricesContainer: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
   },
   promoContainer: {
      borderColor: "#D9D9D9",
      borderWidth: 1,
      borderRadius: 10,
      padding: 30,
      marginVertical: 10,
      width: "90%",
      alignSelf: "center",
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
   panierText: {
      fontSize: 35,
      color: "green",
      textAlign: "center",
      marginTop: 60,
      marginBottom: 20,
   },
   emptyPanierText: {
      fontSize: 20,
      color: "grey",
      textAlign: "center",
      marginTop: 20,
   },
   emptyMessageText: {
      fontSize: 16,
      color: "grey",
      textAlign: "center",
      marginTop: 10,
   },
   emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 300,
   },
   lottie: {
      width: 200,
      height: 200,
   },
   storeButton: {
      marginTop: 20,
      backgroundColor: "#64A962",
   },
   productContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginVertical: 5,
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderColor: "#ccc",
   },
   imageContainer: {
      width: 127,
      height: 114,
      backgroundColor: "#ECECEC",
      borderRadius: 19,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 10,
   },
   productImage: {
      width: 104,
      height: 106,
      borderRadius: 19,
   },
   productDetails: {
      flex: 1,
      justifyContent: "center",
   },
   productHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   productName: {
      fontSize: 20,
      flex: 1,
   },
   productFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   productPrice: {
      fontSize: 20,
      color: "black",
      marginTop: 50,
   },
   quantityControls: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 50,
   },
   quantityButton: {
      backgroundColor: "#FFFFFF",
      borderColor: "#64A962",
      borderWidth: 1,
      borderRadius: 5,
      width: 36,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
   },
   quantityButtonText: {
      fontSize: 20,
      color: "#64A962",
      fontWeight: "bold",
   },
   quantityText: {
      marginHorizontal: 20,
      fontSize: 16,
      color: "black",
   },
   removeButton: {
      fontSize: 20,
      color: "grey",
      marginRight: 10,
   },
});

export default CartScreen;
