// useUserData.js
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../Context/Authcontext';
import { Alert } from 'react-native';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { auth } from '../../firebase';

const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setIsAdmin(userDoc.data().role === 'admin');
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [user]);

  const handleSave = async (name, email, dob, avatarUri) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          name: name,
          email: email,
          dob: dob,
          avatarUrl: avatarUri,
        });
        Alert.alert("Sucesso", "Dados salvos com sucesso!");
      } catch (error) {
        Alert.alert("Erro", "Erro ao salvar os dados. Tente novamente.");
      }
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!uri) {
        Alert.alert("Erro", "URI da imagem não é válida.");
        return;
      }

      const response = await fetch(uri);
      const blob = await response.blob();

      if (!user) throw new Error('Usuário não autenticado');

      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);

      Alert.alert("Sucesso", "Imagem carregada com sucesso!");
      return url;
    } catch (error) {
      Alert.alert("Erro", "Erro ao fazer upload da imagem. Tente novamente.");
    }
  };

  const handleRegister = async (name, email, password, dob) => {
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return { error: "Esse e-mail já está em uso. Tente outro." };
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        name,
        email,
        dob,
      });

      return { success: "Registro bem-sucedido!" };
    } catch (error) {
      return { error: getErrorMessage(error.code) };
    }
  };

  const checkEmailExists = async (email) => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.length > 0;
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'O e-mail fornecido não é válido.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/email-already-in-use':
        return 'Esse e-mail já está em uso.';
      case 'auth/missing-email':
        return 'Por favor, forneça um e-mail.';
      case 'auth/operation-not-allowed':
        return 'Operação não permitida.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  };

  return { userData, loading, isAdmin, handleSave, uploadImage, handleRegister };
};

export default useUserData;
