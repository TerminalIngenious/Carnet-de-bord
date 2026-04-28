import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION_NAME = 'entries'

// Récupérer toutes les entrées
export const getEntries = async () => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des entrées:', error)
    throw error
  }
}

// Ajouter une nouvelle entrée
export const addEntry = async (entryData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...entryData,
      createdAt: serverTimestamp()
    })
    return { id: docRef.id, ...entryData }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'entrée:', error)
    throw error
  }
}

// Modifier une entrée existante
export const updateEntry = async (id, entryData) => {
  try {
    const ref = doc(db, COLLECTION_NAME, id)
    await updateDoc(ref, {
      ...entryData,
      updatedAt: serverTimestamp()
    })
    return { id, ...entryData }
  } catch (error) {
    console.error('Erreur lors de la modification de l\'entrée:', error)
    throw error
  }
}

// Supprimer une entrée
export const deleteEntry = async (id) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    throw error
  }
}