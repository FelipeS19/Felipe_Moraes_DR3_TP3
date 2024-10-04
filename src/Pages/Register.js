import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../Components/CustomInput";
import CustomButton from "../Components/CustomButton";
import useUserData from '../Utils/useUserData';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const navigation = useNavigation();
  const { handleRegister } = useUserData();

  const handleDobChange = (text) => {
    const formattedText = text
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

    setDob(formattedText);
  };

  const handleRegisterClick = async () => {
    const response = await handleRegister(name, email, password, dob);
    if (response.error) {
      Alert.alert("Erro", response.error);
    } else {
      Alert.alert("Registro bem-sucedido!");
      navigation.navigate("Login");
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image source={require('../../assets/logo.png')} style={styles.image} />
      <KeyboardAvoidingView style={styles.registro} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Text style={styles.title}>Registre-se</Text>

        <CustomInput
          label="Nome"
          value={name}
          onChangeText={setName}
          theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#333', underlineColor: 'transparent', }, roundness: 20, }}
        />
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#333', underlineColor: 'transparent', }, roundness: 20, }}
        />
        <CustomInput
          label="Data de Nascimento"
          value={dob}
          onChangeText={handleDobChange}
          placeholder="DD/MM/AAAA"
          theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#333', underlineColor: 'transparent', }, roundness: 20, }}
        />
        <CustomInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          theme={{ colors: { primary: '#9fd6d7', background: 'transparent', placeholder: '#999', text: '#333', underlineColor: 'transparent', }, roundness: 20, }}
          secureTextEntry
        />
        <CustomButton title="Criar conta" onPress={handleRegisterClick} style={styles.button} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9fd6d7",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  registro: {
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
  image: {
    width: 250,
    height: 250,
    marginBottom: 350,
  },
  button: {
    backgroundColor: '#000',
    width: '80%',
    borderRadius: 20,
  },
});

export default Register;
