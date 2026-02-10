import {
    collection, 
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore'

import { db } from './firebase'

// Nom de la collection dans Firestore
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
    }catch (error){
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

        return{ id: docRef.id, ...entryData }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'entrée:, error')
        throw error
    }
}

// Supprimer une entrée
export const deleteEntry = async (id) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
        return { success : true }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        throw error
    }
}
