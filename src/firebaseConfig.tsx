// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4L27n9mGVRkAzdB8CXfYZoLnbobooLUA",
  authDomain: "drive-clone-ab4c6.firebaseapp.com",
  projectId: "drive-clone-ab4c6",
  storageBucket: "drive-clone-ab4c6.appspot.com",
  messagingSenderId: "841798489358",
  appId: "1:841798489358:web:541aa5cc0367a3689a335f",
  measurementId: "G-6JZWYJPKEZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getFirestore(app);
