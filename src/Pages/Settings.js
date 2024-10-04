import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../Context/Authcontext';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadImage = () => {
  const { user } = useAuth();
  const [imageUri, setImageUri] = useState(null);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      uploadImage(result.assets[0]);
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (asset) => {
    if (!user) return;

    const storage = getStorage();
    const response = await fetch(asset.uri);
    const blob = await response.blob();

    // Create a unique filename for the image
    const imageRef = ref(storage, `users/${user.uid}/${asset.fileName || 'image.jpg'}`);

    try {
      // Upload the image to Firebase Storage
      await uploadBytes(imageRef, blob);

      // Get the download URL
      const url = await getDownloadURL(imageRef);

      // Save the URL in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        imageUrl: url,
      }, { merge: true });

      console.log('Image uploaded to:', url);
    } catch (error) {
      console.error('Upload falhou:', error.code, error.message, error.stack);
      console.error('Upload failed:', error);
    }
  };

  return (
    <View>
      <Button title="Selecionar Imagem" onPress={selectImage} />
      <Button title="Capturar Imagem" onPress={captureImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
    </View>
  );
};

export default UploadImage;
