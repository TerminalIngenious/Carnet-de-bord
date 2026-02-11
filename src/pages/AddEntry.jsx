import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addEntry } from "../services/entries";
import styles from "./AddEntry.module.css";
import Modal from "../components/Modal";

function AddEntry({ setCurrentPage }) {
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day: "",
    date: "",
    title: "",
    description: "",
    duration: 7,
    skills: "",
    imageUrl: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    onConfirm: () => {},
  });

  // Redirige si non connecté
  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.notAllowed}>
          <h2>🔒 Accès refusé</h2>
          <p>Tu dois être connecté pour ajouter une entrée.</p>
          <button
            className={styles.button}
            onClick={() => setCurrentPage("login")}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Transforme les skills en tableau
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      await addEntry({
        day: parseInt(formData.day),
        date: formData.date,
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        skills: skillsArray,
        imageUrl: formData.imageUrl || null,
      });

      setModalConfig({
        title: "Entrée ajoutée !",
        message: "Ton entrée a été enregistrée avec succès.",
        type: "success",
        onConfirm: () => setCurrentPage("journal"),
      });
      setModalOpen(true);
    } catch (error) {
      setModalConfig({
        title: "Erreur",
        message: "Une erreur est survenue : " + error.message,
        type: "error",
        onConfirm: () => setModalOpen(false),
      });
      setModalOpen(true);
    }

    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Ajouter une entrée</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Jour n°</label>
              <input
                type="number"
                name="day"
                className={styles.input}
                value={formData.day}
                onChange={handleChange}
                placeholder="1"
                min="1"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                type="date"
                name="date"
                className={styles.input}
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Durée (heures)</label>
              <input
                type="number"
                name="duration"
                className={styles.input}
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="12"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Titre</label>
            <input
              type="text"
              name="title"
              className={styles.input}
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Développement de la page d'accueil"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              name="description"
              className={styles.textarea}
              value={formData.description}
              onChange={handleChange}
              placeholder="Décris ce que tu as fait aujourd'hui..."
              rows={6}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Compétences (séparées par des virgules)
            </label>
            <input
              type="text"
              name="skills"
              className={styles.input}
              value={formData.skills}
              onChange={handleChange}
              placeholder="Ex: React, CSS, API REST"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>URL de l'image (optionnel)</label>
            <input
              type="url"
              name="imageUrl"
              className={styles.input}
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/uc?export=view&id=..."
            />
            <small className={styles.hint}>
              💡 Pour Google Drive : transforme le lien en
              https://drive.google.com/uc?export=view&id=TON_ID
            </small>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "💾 Enregistrer"}
            </button>
            <button
              type="button"
              className={styles.buttonSecondary}
              onClick={() => setCurrentPage("journal")}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}

export default AddEntry;
