import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

function Header({ currentPage, setCurrentPage }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { logout, isAuthenticated } = useAuth()

  const handleNavClick = (page) => {
    setCurrentPage(page)
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setCurrentPage('home')
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>Carnet de Stage</div>

      {/* Bouton burger - visible seulement sur mobile */}
      <button
        className={styles.burger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Navigation */}
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        
         <a href="#"
          className={currentPage === 'home' ? styles.navLinkActive : styles.navLink}
          onClick={() => handleNavClick('home')}
        >
          Accueil
        </a>
        
        <a
          href="#"
          className={currentPage === 'journal' ? styles.navLinkActive : styles.navLink}
          onClick={() => handleNavClick('journal')}
        >
          Journal
        </a>
        
        <a
          href="#"
          className={currentPage === 'entreprise' ? styles.navLinkActive : styles.navLink}
          onClick={() => handleNavClick('entreprise')}
        >
          Entreprise
        </a>
        
        <a
          href="#"
          className={currentPage === 'metier' ? styles.navLinkActive : styles.navLink}
          onClick={() => handleNavClick('metier')}
        >
          Métier
        </a>

        {/* Bouton Connexion / Déconnexion */}
        {isAuthenticated ? (
          <button className={styles.authButton} onClick={handleLogout}>
            Déconnexion
          </button>
        ) : (
          <button 
            className={styles.authButton} 
            onClick={() => handleNavClick('login')}
          >
            Se connecter
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header