// CustomInput.js
import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

const CustomInput = ({ label, value, onChangeText, style, theme }) => {
  return (
    <View style={styles.container}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        mode="outlined" 
        style={[styles.input, style]}
        theme={{
          ...theme, // Use o tema passado como prop
          colors: {
            primary: theme?.colors?.primary || '#007bff', // Cor do foco
            background: 'transparent', // Fundo transparente
            placeholder: theme?.colors?.placeholder || '#999', // Cor do placeholder
            text: theme?.colors?.text || '#333', // Cor do texto
            underlineColor: 'transparent', // Remove a linha embaixo
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },
  input: {
    marginBottom: 16,
  },
});

export default CustomInput;
