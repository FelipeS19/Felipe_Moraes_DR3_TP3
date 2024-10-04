import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const CustomButton = ({ title, onPress, mode = 'contained', style }) => {
  return (
    <Button 
      mode={mode} 
      onPress={onPress} 
      style={[styles.button, style]} // Adicione style aqui
      contentStyle={styles.buttonContent}>
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default CustomButton;
