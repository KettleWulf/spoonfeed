import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { createCollection } from "../helpers/createCollection";
import type { NewPlace, Place } from "../types/Place.types";
import type { User } from "../types/User.types";


// Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth Instance
export const auth = getAuth(app);

// Get Firestore Instance
export const db = getFirestore(app);

// Get Storage Instance
export const storage = getStorage(app);


// Collections
export const placesCol = createCollection<Place>("places");
export const newPlacesCol = createCollection<NewPlace>("places");

export const usersCol = createCollection<User>("users")


export default app;