// Firebasedata.js
import { ref, set, onValue, update } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, database } from '../../firebase';

const storage = getStorage();

export const checkAdminRole = async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data().role === 'admin';
    }
  }
  return false;
};

export const fetchItems = (setGroupedItems, setAllItems) => {
  const itemsRef = ref(database, 'items');
  return onValue(itemsRef, (snapshot) => {
    const data = snapshot.val();
    const parsedItems = data
      ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      : [];

    const groupedByArea = parsedItems.reduce((result, item) => {
      const categoria = item.categoria || 'Outros';
      if (!result[categoria]) {
        result[categoria] = [];
      }
      result[categoria].push(item);
      return result;
    }, {});

    setGroupedItems(groupedByArea);
    setAllItems(parsedItems);
  });
};

export const fetchBannerImages = (setBannerImages) => {
  const bannerRef = ref(database, 'banner');
  return onValue(bannerRef, (snapshot) => {
    const data = snapshot.val();
    setBannerImages(data?.images || []);
  });
};

export const saveBannerImages = async (newImages, bannerImages) => {
  const urls = [];

  for (const imageUri of newImages) {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageRef = storageRef(storage, `banner/${Date.now()}`);

    const snapshot = await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    urls.push(downloadURL);
  }

  const updatedImages = [...bannerImages, ...urls];
  const bannerRef = ref(database, 'banner');
  await set(bannerRef, { images: updatedImages });

  return updatedImages;
};


export const deleteBannerImage = async (imageToDelete, bannerImages) => {
  const updatedImages = bannerImages.filter(image => image !== imageToDelete);
  const bannerRef = ref(database, 'banner');
  await set(bannerRef, { images: updatedImages });

  return updatedImages;
};

export const updateItem = async (itemId, updatedItem) => {
  const itemRef = ref(database, `items/${itemId}`);
  try {
    await update(itemRef, updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
  }
};