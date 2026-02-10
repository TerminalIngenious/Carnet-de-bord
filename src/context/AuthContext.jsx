import { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth } from '../services/firebase'

// Crée le contexte
const AuthContext = createContext()

// eslint-disable-next-line no-unused-vars
export function useAuth() {
  return useContext(AuthContext)
}

// Provider qui englobe l'application
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Écoute les changements d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    // Nettoyage quand le composant est démonté
    return unsubscribe
  }, [])

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user  // true si user existe, false sinon
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}