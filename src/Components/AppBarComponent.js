import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Icone from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../Context/Authcontext'; // Ajuste o caminho conforme necessário

const Navbar = () => {
  const navigation = useNavigation();
  const { user } = useAuth(); // Acessa o contexto de autenticação

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate('Perfil');
    } else {
      navigation.navigate('Inicial'); // Redireciona para a página inicial se não estiver logado
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfilePress} style={styles.button}>
        <Icon name="user" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.button}>
        <Icone name="text-search" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.button}>
        <Icon name="home" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#9fd6d7',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Navbar;
