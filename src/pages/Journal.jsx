import { useState, useEffect } from 'react'
import styles from "./Journal.module.css"
import Tag from "../components/Tag"
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { getEntries, deleteEntry } from '../services/entries'

function Journal({ setCurrentPage }) {
  const { isAuthenticated } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // Récupère les entrées au chargement de la page
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries()
        setEntries(data)
      } catch (error) {
        console.error('Erreur:', error)
      }
      setLoading(false)
    }

    fetchEntries()
  }, [])

  // Fonction de suppression
  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Supprimer l'entrée "${title}" ?`)
    
    if (confirmed) {
      try {
        await deleteEntry(id)
        // Met à jour la liste localement (sans recharger depuis Firebase)
        setEntries(entries.filter(entry => entry.id !== id))
      } catch (error) {
        alert('Erreur lors de la suppression: ' + error.message)
      }
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Journal de stage</h1>
              <p className={styles.subtitle}>
                Suivi quotidien de mes activités chez Caplaser
              </p>
            </div>
            
            {isAuthenticated && (
              <button 
                className={styles.addButton}
                onClick={() => setCurrentPage('addEntry')}
              >
                + Ajouter une entrée
              </button>
            )}
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className={styles.loading}>
            <p>Chargement des entrées...</p>
          </div>
        )}

        {/* Liste vide */}
        {!loading && entries.length === 0 && (
          <div className={styles.empty}>
            <p>📝 Aucune entrée pour le moment.</p>
            {isAuthenticated && (
              <button 
                className={styles.addButton}
                onClick={() => setCurrentPage('addEntry')}
              >
                Ajouter ma première entrée
              </button>
            )}
          </div>
        )}

        {/* Liste des entrées */}
        {!loading && entries.length > 0 && (
          <div className={styles.entriesList}>
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className={styles.entryLayout}>
                  <div className={styles.entryDay}>
                    <span>J{entry.day}</span>
                  </div>
                  <div className={styles.entryContent}>
                    <div className={styles.entryHeader}>
                      <h3 className={styles.entryTitle}>{entry.title}</h3>
                      <div className={styles.entryActions}>
                        <span className={styles.entryDuration}>
                          ⏱️ {entry.duration}h
                        </span>
                        {isAuthenticated && (
                          <button 
                            className={styles.deleteButton}
                            onClick={() => handleDelete(entry.id, entry.title)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={styles.entryDate}>{entry.date}</p>
                    <p className={styles.entryDescription}>{entry.description}</p>
                    {entry.imageUrl && (
                      <div className={styles.entryImage}>
                        <img src={entry.imageUrl} alt={entry.title} />
                      </div>
                    )}
                    <div className={styles.entrySkills}>
                      {entry.skills?.map((skill) => (
                        <Tag key={skill}>{skill}</Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Journal