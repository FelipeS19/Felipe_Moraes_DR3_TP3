import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../Components/CustomInput';
import CustomButton from '../Components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import { database, storage } from '../../firebase';
import { ref as databaseRef, set, push } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddItem = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [valor, setValor] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [genero, setGenero] = useState('');
    const [categoriaModalVisible, setCategoriaModalVisible] = useState(false);
    const [generoModalVisible, setGeneroModalVisible] = useState(false);

    const handleAddItem = async () => {
        try {
            const uploadedImageUrls = await Promise.all(imageUrls.map(uploadImageToFirebase));
            const validUrls = uploadedImageUrls.filter(url => url !== null);

            const newItem = {
                title,
                description,
                valor,
                categoria,
                genero,
                imageUrls: validUrls,
                createdAt: Date.now(),
                Views: 0,
            };

            const newRef = push(databaseRef(database, 'items'));
            await set(newRef, newItem);

            resetFields();
        } catch (error) {
            console.error('Erro ao adicionar item: ', error);
        }
    };

    const uploadImageToFirebase = async (uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const imageName = uri.substring(uri.lastIndexOf('/') + 1);
            const imageRef = storageRef(storage, `images/${imageName}`);

            const snapshot = await uploadBytes(imageRef, blob);
            return await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Erro ao fazer upload da imagem: ', error);
            return null;
        }
    };

    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('É necessário permitir o acesso à galeria para selecionar imagens!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [4, 4],
            quality: 1,
            selectionLimit: 5,
        });

        if (!result.canceled) {
            const newImageUrls = result.assets.map(asset => asset.uri);
            const uploadedImageUrls = await Promise.all(newImageUrls.map(uploadImageToFirebase));
            const validUrls = uploadedImageUrls.filter(url => url !== null);

            setImageUrls(prevImageUrls => {
                const updatedUrls = [...prevImageUrls, ...validUrls];
                return updatedUrls.slice(0, 5);
            });
        }
    };

    const resetFields = () => {
        setTitle('');
        setDescription('');
        setValor('');
        setImageUrls([]);
        setCategoria('');
        setGenero('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.loginText}>Cadastro de itens</Text>
            <CustomInput placeholder="Título" label="Título" value={title} onChangeText={setTitle} style={styles.input} />
            <CustomInput placeholder="Descrição" label="Descrição" value={description} onChangeText={setDescription} style={styles.input} />
            <CustomInput placeholder="Valor" label="Valor" value={valor} onChangeText={setValor} keyboardType="decimal-pad" style={styles.input} />

            <TouchableOpacity onPress={() => setCategoriaModalVisible(true)} style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Selecionar Categoria: {categoria || 'Nenhuma'}</Text>
            </TouchableOpacity>

            <Modal transparent={true} visible={categoriaModalVisible} animationType="slide" onRequestClose={() => setCategoriaModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione uma Categoria</Text>
                        <Picker selectedValue={categoria} onValueChange={setCategoria} style={styles.picker}>
                            <Picker.Item label="Cabelo" value="Cabelo" />
                            <Picker.Item label="Pele" value="Pele" />
                            <Picker.Item label="Perfumaria" value="Perfumaria" />
                            <Picker.Item label="Maquiagem" value="Maquiagem" />
                        </Picker>
                        <CustomButton title="Confirmar" onPress={() => setCategoriaModalVisible(false)} style={styles.modalButton} />
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={() => setGeneroModalVisible(true)} style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Selecionar Gênero: {genero || 'Nenhum'}</Text>
            </TouchableOpacity>

            <Modal transparent={true} visible={generoModalVisible} animationType="slide" onRequestClose={() => setGeneroModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione um Gênero</Text>
                        <Picker selectedValue={genero} onValueChange={setGenero} style={styles.picker}>
                            <Picker.Item label="Para eles" value="para_eles" />
                            <Picker.Item label="Para elas" value="para_elas" />
                            <Picker.Item label="Infantil" value="Infantil" />
                            <Picker.Item label="Unissex" value="Unissex" />
                        </Picker>
                        <CustomButton title="Confirmar" onPress={() => setGeneroModalVisible(false)} style={styles.modalButton} />
                    </View>
                </View>
            </Modal>

            <CustomButton title="Adicionar Imagens" onPress={pickImages} style={styles.button} />

            <ScrollView horizontal>
                {imageUrls.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </ScrollView>

            <CustomButton title="Cadastrar produto" onPress={handleAddItem} style={[styles.button, styles.cad]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    loginText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    selectButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
    },
    selectButtonText: {
        textAlign: 'center',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        height: 280,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        position: 'absolute',
        bottom: 0,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#000',
        width: '80%',
        borderRadius: 10,
        marginBottom: 60,
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 10,
        marginRight: 10,
        borderRadius: 50,
    },
    button: {
        backgroundColor: '#000',
        width: '80%',
        borderRadius: 20,
    },
    cad: {
        marginTop: 20,
    },
    picker: {
        width: '100%',
    },
});

export default AddItem;
