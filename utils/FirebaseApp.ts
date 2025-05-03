// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";
import type { UserModel } from "../models/UserModel";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDanw5EC7BRASKgneXC2OQ1vEo2oqa31lI",
    authDomain: "digibank-33db3.firebaseapp.com",
    projectId: "digibank-33db3",
    storageBucket: "digibank-33db3.firebasestorage.app",
    messagingSenderId: "210480479199",
    appId: "1:210480479199:web:4a93a390637449ddeb226a",
    measurementId: "G-KTWL9EN7YM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

const db = getFirestore(app);

/**
 * Adds a user to Firestore if the username does not already exist.
 * Returns the new document reference or null if duplicate.
 */
export async function addUser(user: UserModel) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", user.username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        // Username already exists
        return null;
    }
    // Add user (let Firestore auto-generate the doc id, but store user.id as a field)
    const docRef = await addDoc(usersRef, user);
    return docRef;
}

export { app, analytics }; 