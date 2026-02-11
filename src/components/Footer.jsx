import styles from './Footer.module.css'
import { useAuth } from '../context/AuthContext'

function Footer({ nom, annee, setCurrentPage }) {
  const { logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    await logout()
    setCurrentPage('home')
  }

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>Carnet de Stage - {nom} - {annee}</p>
      
      {isAuthenticated ? (
        <button className={styles.authLink} onClick={handleLogout}>
          Déconnexion
        </button>
      ) : (
        <button className={styles.authLink} onClick={() => setCurrentPage('login')}>
          Admin
        </button>
      )}
    </footer>
  )
}

export default Footer