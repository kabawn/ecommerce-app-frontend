import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Platform
} from "react-native";
import React from "react";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CartIcon from './CartIcon';

const HeaderComponent = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const navigation = useNavigation();

  // Function to call the API with the new text entry
  const queryAPI = async (newSearchPhrase) => {
    console.log("queryAPI Input: " + newSearchPhrase);
    // Make the API call with the new text entry
  };

  // Text input change handler
  const handleTextChange = (newSearchPhrase) => {
    console.log("handleTextChange Input: " + newSearchPhrase);
    setSearchPhrase(newSearchPhrase);
    // Call the queryAPI function with the new text entry
    queryAPI(newSearchPhrase);
  };

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.headerContainer}>
        <SearchBar
          searchPhrase={searchPhrase}
          handleTextChange={handleTextChange}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <CartIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});

export default HeaderComponent;
