import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomButton from '../Components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const Inicial = () => {
  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={styles.image}
      />
      <View style={styles.acesso}>
        <Text style={styles.welcomeText}>
          Seja bem-vindo
        </Text>
        <CustomButton title="Login" onPress={handleLoginPress} style={styles.button} />

        <TouchableOpacity style={styles.registerContainer} onPress={handleRegisterPress}>
          <Text style={styles.registerText}>
            Registre-se agora
          </Text>
          <Image
            source={require('../../assets/seta.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9fd6d7',
  },
  acesso: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 200,
    padding: 20,
    position: 'absolute',
    bottom: -40,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 250,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 80,
  },
  registerText: {
    color: '#000',
  },
  arrowIcon: {
    width: 50,
    height: 20,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#000',
    width: '80%',
    borderRadius: 20,
  },
});

export default Inicial;
