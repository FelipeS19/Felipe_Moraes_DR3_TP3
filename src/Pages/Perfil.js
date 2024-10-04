import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import Avatar from '../Components/Avatar';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../Context/Authcontext';
import useUserData from '../Utils/useUserData';
import CustomButton from '../Components/CustomButton';
const Perfil = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { userData, loading, handleSave, uploadImage } = useUserData();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (userData) {
      setIsAdmin(userData.role === 'admin');
      setName(userData.name);
      setEmail(userData.email);
      setDob(userData.dob);
      setAvatarUri(userData.avatarUrl || '');
    }
  }, [userData]);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
      Alert.alert('Permissão de câmera ou galeria não concedida!');
    }
  };

  const handleImagePicker = async () => {
    requestPermissions();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      console.log("Seleção de imagem cancelada");
      return;
    }

    const uri = result.assets[0].uri;
    const url = await uploadImage(uri);
    if (url) {
      setAvatarUri(url);
    }
  };

  const handleCamera = async () => {
    requestPermissions();
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) {
      console.log("Captura de imagem cancelada");
      return;
    }

    const uri = result.assets[0].uri;
    const url = await uploadImage(uri);
    if (url) {
      setAvatarUri(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dados}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.username}>Olá,{'\n'} {name}!</Text>
          </TouchableOpacity>
          <Avatar style={styles.Avatar} uri={avatarUri || 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'} />
        </View>
        <View style={styles.separator} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isAdmin && (
          <TouchableOpacity onPress={() => navigation.navigate('AddItem')} style={styles.OpcaoContainer}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.Text}>Adicionar novo item</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={logout} style={styles.OpcaoContainer}>
          <Ionicons name="log-out" size={24} color="black" />
          <Text style={styles.Text}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Avatar uri={avatarUri || 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png'} />

            <View style={styles.image}>
              <TouchableOpacity onPress={handleImagePicker} style={styles.galeria}>
                <Ionicons name="images" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCamera} style={styles.camera}>
                <Ionicons name="camera" size={26} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Digite seu nome"
              placeholderTextColor="#888"
            />
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu email"
              keyboardType="email-address"
              placeholderTextColor="#888"
            />
            <Text style={styles.inputLabel}>Data de Nascimento:</Text>
            <TextInput
              style={styles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="Digite sua data de nascimento"
              placeholderTextColor="#888"
            />
            <CustomButton title="Salvar" onPress={() => handleSave(name, email, dob, avatarUri)} style={styles.saveButton} />

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 130,

  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    height: 110,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: '#9fd6d7',
    zIndex: 1,
  },
  dados: {
    position: 'absolute',
    top: -30,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    padding: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  Avatar: {
    width: 60,
    height: 60,
  },
  username: {
    fontFamily: 'Boston-Angel-Regular',
    fontSize: 30,
  },
  separator: {
    marginTop: 80,
    height: 2,
    backgroundColor: 'white',
    width: '100%',
  },
  OpcaoContainer: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Text: {
    color: '#000',
    fontSize: 16,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#9fd6d7',
    marginBottom: 10,
    paddingHorizontal: 0,
    color: 'black',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#9fd6d7',
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#9fd6d7',
    fontSize: 16,
  },
  camera: {
    marginRight: 90,
  },
  galeria: {
    marginLeft: 70,
    top: -1,
  },
  image: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'space-between',
    gap: 130,
  },
});

export default Perfil;
