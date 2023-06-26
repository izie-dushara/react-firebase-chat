import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9Smqg96w4qZyQVBFIe3-OURnENRq3whY",
  authDomain: "sass-react-chat.firebaseapp.com",
  projectId: "sass-react-chat",
  storageBucket: "sass-react-chat.appspot.com",
  messagingSenderId: "905997602591",
  appId: "1:905997602591:web:58f1caec98b85a02daea2a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();