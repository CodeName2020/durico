import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyACtdmk0_ogGlOdgjW2ObrGCm_FIF1nvxU",
  authDomain: "durico-web.firebaseapp.com",
  projectId: "durico-web",
  storageBucket: "durico-web.appspot.com",
  messagingSenderId: "529669283956",
  appId: "1:529669283956:web:6541f80cd54b9ac17bb121",
  measurementId: "G-Q7TDYCLCBP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

