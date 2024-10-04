// Components/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Essência do Mar</Text> 
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#9fd6d7', // Azul
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Boston-Angel-Regular', // Fonte personalizada
    marginTop: 10,
    color: '#000',
    fontSize: 20,
  },
});

export default Header;
