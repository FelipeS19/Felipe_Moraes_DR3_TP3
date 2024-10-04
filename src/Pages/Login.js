import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, TouchableOpacity, Modal } from 'react-native';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login bem-sucedido!');
      navigation.navigate('Perfil');
    } catch (error) {
      const errorMessage = getErrorMessage(error.code);
      Alert.alert('Erro ao Fazer Login', errorMessage);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Email enviado!', 'Verifique sua caixa de entrada para redefinir a senha.');
      setModalVisible(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error.code);
      Alert.alert('Erro ao Enviar Email', errorMessage);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'O email fornecido não é válido.';
      case 'auth/user-not-found':
        return 'Nenhum usuário encontrado com esse email.';
      case 'auth/wrong-password':
        return 'A senha está incorreta.';
      case 'auth/network-request-failed':
        return 'Falha na conexão. Verifique sua internet.';
      case 'auth/email-already-in-use':
        return 'Esse email já está em uso.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image source={require('../../assets/logo.png')} style={styles.image} />
      <KeyboardAvoidingView style={styles.acesso} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Text style={styles.logintext}>Faça seu Login</Text>

        <CustomInput
          placeholder="Email"
          label='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#333', underlineColor: 'transparent', }, roundness: 20, }}
        />
        <CustomInput
          placeholder="Senha"
          label='Senha'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#000', underlineColor: 'transparent', }, roundness: 20, }}
        />
        <CustomButton title="Login" onPress={handleLogin} style={styles.button} />

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView style={styles.acesso} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Redefinir Senha</Text>

              <CustomInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#333', underlineColor: 'transparent', }, roundness: 20, }}
              />
              <CustomButton title="Enviar Email" onPress={() => handleForgotPassword(email)} style={styles.button} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  logintext: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 240,
  },
  acesso: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  button: {
    backgroundColor: '#000',
    width: '80%',
    borderRadius: 20,
  },
  forgotPassword: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#000',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    width: '115%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    padding: 20,
    position: 'absolute',
    bottom: 0,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default Login;
