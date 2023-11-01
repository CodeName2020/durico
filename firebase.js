import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyB_yFRgE9QG79z-Z2-Tfc-jQC4Btes9B2E",
  authDomain: "durico-demo.firebaseapp.com",
  projectId: "durico-demo",
  storageBucket: "durico-demo.appspot.com",
  messagingSenderId: "1092171012422",
  appId: "1:1092171012422:web:5bd9f0175948c08ad7ad47",
  measurementId: "G-Z5EV82XK4L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

