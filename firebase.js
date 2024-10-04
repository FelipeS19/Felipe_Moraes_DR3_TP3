// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBic3BJODiW7VlFi94p1HIdNKbDPcY-mWU",
  authDomain: "tp-mobile-d2642.firebaseapp.com",
  databaseURL: "https://tp-mobile-d2642-default-rtdb.firebaseio.com",
  projectId: "tp-mobile-d2642",
  storageBucket: "tp-mobile-d2642.appspot.com",
  messagingSenderId: "426317613755",
  appId: "1:426317613755:web:d1f9a26c0132bad79bf79e",
  measurementId: "G-QSZWX0JK1B"
};


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
export { auth, db, storage, database }; 
