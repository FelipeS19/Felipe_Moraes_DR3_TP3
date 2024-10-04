// ../my-app/Components/Avatar.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Avatar = ({ uri, style }) => { // Valores padrão
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={[styles.avatar, style]} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 100, 
    borderWidth: 2,
    borderColor: '#9fd6d7',
  },
});

export default Avatar;
