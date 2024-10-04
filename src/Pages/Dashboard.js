import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  Text,
  Dimensions,
  Image,
  Button,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../Components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../Context/Authcontext';
import {
  checkAdminRole,
  fetchItems,
  fetchBannerImages,
  saveBannerImages,
  deleteBannerImage,
  updateItem,
} from '../Utils/Firebasedata';
import { database } from '../../firebase';
import { ref as databaseRef, update } from 'firebase/database';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const { user } = useAuth();
  const [groupedItems, setGroupedItems] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bannerImages, setBannerImages] = useState([]);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const init = async () => {
      const adminStatus = await checkAdminRole(user);
      setIsAdmin(adminStatus);
      fetchItems(setGroupedItems, setAllItems);
      fetchBannerImages(setBannerImages);
    };

    init();
  }, [user]);

  const Registrarvizu = async (itemId) => {
    try {
      const viewedItems = await AsyncStorage.getItem('views');
      const items = viewedItems ? JSON.parse(viewedItems) : {};
      items[itemId] = (items[itemId] || 0) + 1;
      await AsyncStorage.setItem('views', JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar a visualização:', error);
    }
  };

  const sincdatabase = async () => {
    try {
      const viewedItems = await AsyncStorage.getItem('views');
      if (viewedItems) {
        const items = JSON.parse(viewedItems);
        const updates = {};

        for (const [itemId, count] of Object.entries(items)) {
          updates[itemId] = { views: count };
        }

        await Promise.all(
          Object.keys(updates).map(async (itemId) => {
            const itemRef = databaseRef(database, `items/${itemId}`);
            await update(itemRef, updates[itemId]);
          })
        );

        await AsyncStorage.removeItem('views');
      }
    } catch (error) {
      console.error('Erro ao sincronizar views:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={async () => {
        await Registrarvizu(item.id);
        setSelectedItem(item);
        setEditTitle(item.title);
        setEditDescription(item.description);
        setEditValue(item.valor.toString());
        setModalVisible(true);
        setActiveIndex(0);
      }}
      style={styles.itemContainer}
    >
      <Image
        source={{ uri: item.imageUrls[0] }}
        style={styles.imagelist}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
        <Text style={styles.value}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const Maisvisto = () => {
    return allItems
      .filter(item => item.view != null)
      .sort((a, b) => b.view - a.view)
      .slice(0, 12);
  };

  const maisrecente = () => {
    return allItems
      .filter(item => item.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12);
  };

  const mostViewedItems = Maisvisto();
  const mostRecentItems = maisrecente();

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      const updatedImages = await saveBannerImages(selectedImages, bannerImages);
      setBannerImages(updatedImages);
    }
    setImagePickerVisible(false);
  };

  const handleDeleteImage = async (image) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir", onPress: async () => {
            const updatedImages = await deleteBannerImage(image, bannerImages);
            setBannerImages(updatedImages);
          }
        }
      ]
    );
  };

  const handleEditItem = async () => {
    const updatedItem = {
      ...selectedItem,
      title: editTitle,
      description: editDescription,
      valor: parseFloat(editValue),
    };

    await updateItem(selectedItem.id, updatedItem);
    setSelectedItem(updatedItem);
    setEditMode(false);
  };

  useEffect(() => {
    const syncData = async () => {
      await sincdatabase();
    };

    syncData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        {isAdmin && (
          <TouchableOpacity onPress={() => setImagePickerVisible(true)} style={styles.backButton}>
            <Icon name="pencil-sharp" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <FlatList
          data={bannerImages}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.bannerImage} resizeMode="cover" />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={event => {
            const index = Math.floor(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
        />
        <View style={styles.pagination}>
          {bannerImages.map((_, index) => (
            <View
              key={index}
              style={[styles.paginationDot, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
            />
          ))}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={imagePickerVisible}
        onRequestClose={() => setImagePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha suas imagens para o banner</Text>
            <Button title="Selecionar Imagens" onPress={pickImages} />
            <FlatList
              data={bannerImages}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item }} style={styles.modalBannerImage} resizeMode="cover" />
                  <TouchableOpacity onPress={() => handleDeleteImage(item)}>
                    <Icon name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
            <Button title="Fechar" onPress={() => setImagePickerVisible(false)} />
          </View>
        </View>
      </Modal>

      <View style={styles.listContainer}>
        <Text style={styles.title}>Mais Vistos</Text>
        <FlatList
          data={mostViewedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.title}>Mais Recentes</Text>
        <FlatList
          data={mostRecentItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {Object.keys(groupedItems).map((categoria) => (
          <View key={categoria}>
            <Text style={styles.title}>{categoria}</Text>
            <FlatList
              data={groupedItems[categoria]}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.modalContent}>
              {selectedItem && (
                <>
                  <TouchableOpacity onPress={() => {
                    setModalVisible(false),
                      setEditMode(false);
                  }} style={styles.backButton}>

                    <Icon name="close" size={24} color="#333" />

                  </TouchableOpacity>
                  <FlatList
                    data={selectedItem.imageUrls}
                    renderItem={({ item }) => (
                      <Image
                        source={{ uri: item }}
                        style={styles.detailImage}
                        onError={() => console.error('Erro ao carregar a imagem')}
                      />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={event => {
                      const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                      setActiveIndex(index);
                    }}
                  />
                  <View style={styles.pagination2}>
                    {selectedItem.imageUrls.map((_, index) => (
                      <View
                        key={index}
                        style={[styles.paginationDot2, activeIndex === index ? styles.activeDot : styles.inactiveDot]}
                      />
                    ))}
                  </View>
                  <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                  <Text style={styles.modaldescrição}>{selectedItem.description}</Text>
                  <Text style={styles.modalValor}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedItem.valor)}
                  </Text>
                  {isAdmin && (
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
                      <Icon name="pencil" size={24} color="black" />
                    </TouchableOpacity>
                  )}
                  {editMode && (
                    <View >
                      <TextInput
                        style={styles.input}
                        placeholder="Título"
                        value={editTitle}
                        onChangeText={setEditTitle}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Descrição"
                        value={editDescription}
                        onChangeText={setEditDescription}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Valor"
                        value={editValue}
                        onChangeText={setEditValue}
                        keyboardType="numeric"
                      />
                      <CustomButton title="Salvar" onPress={handleEditItem} style={styles.saveButton} />
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    height: 200,
  },
  bannerImage: {
    width: width,
    height: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  modalBannerImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  backButton: {
    position: 'absolute',
    zIndex: 200,
    top: 20,
    left: 30,
    width: 100,
  },
  saveButton: {
    backgroundColor: '#9fd6d7',
    padding: 5,
    borderRadius: 10,
  },
  editButton: {
    position: 'absolute',
    zIndex: 200,
    top: 20,
    right: -50,
    width: 100,
  },
  imagelist: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  description: {
    maxWidth: '50%',
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    width: width * 0.8,
    marginRight: -80,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 0,
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    height: 390,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    position: 'absolute',
    bottom: 0,
  },
  modalTitle: {
    fontSize: 30,
    marginTop: 20,
    marginLeft: 30,
  },
  modalValor: {
    fontSize: 20,
    marginBottom: 20,
  },
  modaldescrição: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  detailImage: {
    width: '50%',
    height: 150,
    borderRadius: 10,
    marginTop: 20,
    marginLeft: 122,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#2196F3',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  },
  pagination2: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot2: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },

});

export default Dashboard;
