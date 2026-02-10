import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Ta configuration Firebase (remplace par TES valeurs)
const firebaseConfig = {
  apiKey: "AIzaSyDTx2hNpN3e-QRg29BB5cjHIThcvIToXe8",
  authDomain: "carnet-de-bord-192de.firebaseapp.com",
  projectId: "carnet-de-bord-192de",
  storageBucket: "carnet-de-bord-192de.firebasestorage.app",
  messagingSenderId: "805653459347",
  appId: "1:805653459347:web:88f6c38543d4edf2e37866"
};

// Initialise Firebase
const app = initializeApp(firebaseConfig)

// Exporte les services qu'on va utiliser
export const db = getFirestore(app)        // Base de données
export const auth = getAuth(app)           // Authentification
export const storage = getStorage(app)     // Stockage fichiers

export default app