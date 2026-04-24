import { db } from './firebase'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'

const COLLECTION_NAME = 'weekRecaps'

// Récupère le récap d'une semaine
export const getWeekRecap = async (weekNumber) => {
  try {
    const ref = doc(db, COLLECTION_NAME, `week_${weekNumber}`)
    const snap = await getDoc(ref)
    if (snap.exists()) return snap.data()
    return null
  } catch (error) {
    console.error('Erreur récupération récap:', error)
    throw error
  }
}

// Sauvegarde ou met à jour le récap d'une semaine
export const saveWeekRecap = async (weekNumber, text) => {
  try {
    const ref = doc(db, COLLECTION_NAME, `week_${weekNumber}`)
    await setDoc(ref, {
      weekNumber,
      text,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Erreur sauvegarde récap:', error)
    throw error
  }
}