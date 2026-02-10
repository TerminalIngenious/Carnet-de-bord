import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

function Login({ setCurrentPage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()  // Empêche le rechargement de la page
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      setCurrentPage('home')  // Redirige vers l'accueil
    } else {
      setError('Email ou mot de passe incorrect')
    }
    
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.icon}>🔐</div>
        <h1 className={styles.title}>Connexion Admin</h1>
        <p className={styles.subtitle}>Accès réservé à l'administrateur</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mot de passe</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login