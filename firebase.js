import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyAOcDDIIMXwWB0RbwnvheunKCKrfKj2R2M",
  authDomain: "demoduri.firebaseapp.com",
  projectId: "demoduri",
  storageBucket: "demoduri.appspot.com",
  messagingSenderId: "708616521913",
  appId: "1:708616521913:web:8fd535719cbd1f22e2f368",
  measurementId: "G-5B2YDXSDJ8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

