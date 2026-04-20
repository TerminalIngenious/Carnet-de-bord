import { useState, useEffect } from "react";
import styles from "./Journal.module.css";
import Tag from "../components/Tag";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { getEntries, deleteEntry } from "../services/entries";
import { Trash2 } from "lucide-react";

function Journal({ setCurrentPage }) {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // États pour le modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
  });

  // Récupère les entrées au chargement de la page
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries();
        setEntries(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
      setLoading(false);
    };

    fetchEntries();
  }, []);

  // Fonction pour afficher un modal
  const showModal = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  // Fonction de suppression
  const handleDelete = (id, title) => {
    showModal({
      title: "Supprimer cette entrée ?",
      message: `Tu vas supprimer "${title}". Cette action est irréversible.`,
      type: "confirm",
      onConfirm: async () => {
        try {
          await deleteEntry(id);
          setEntries(entries.filter((entry) => entry.id !== id));
          setModalOpen(false);

          // Affiche un modal de succès
          showModal({
            title: "Entrée supprimée",
            message: "L'entrée a été supprimée avec succès.",
            type: "success",
            onConfirm: () => setModalOpen(false),
          });
        } catch (error) {
          setModalOpen(false);
          showModal({
            title: "Erreur",
            message: "Une erreur est survenue lors de la suppression. " + error,
            type: "error",
            onConfirm: () => setModalOpen(false),
          });
        }
      },
    });
  };

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
                onClick={() => setCurrentPage("addEntry")}
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
                onClick={() => setCurrentPage("addEntry")}
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
                          {entry.duration}h
                        </span>
                        {isAuthenticated && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(entry.id, entry.title)}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className={styles.entryDate}>{entry.date}</p>
                    <p className={styles.entryDescription}>
                      {entry.description}
                    </p>

                    {/* Image si elle existe */}
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalOpen(false)}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}

export default Journal;
