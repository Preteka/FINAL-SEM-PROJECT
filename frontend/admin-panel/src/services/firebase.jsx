import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBaLwbJ_EtuNHVp9pIsSB3astul-j8nYOI",
    authDomain: "viniyaga-plywoods.firebaseapp.com",
    projectId: "viniyaga-plywoods",
    storageBucket: "viniyaga-plywoods.firebasestorage.app",
    messagingSenderId: "103185229272",
    appId: "1:103185229272:web:34429f8fbac7b51b0fbead",
    measurementId: "G-5671FX7BL1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
