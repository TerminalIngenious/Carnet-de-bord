import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addEntry, updateEntry } from "../services/entries";
import styles from "./AddEntry.module.css";
import Modal from "../components/Modal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddEntry({ setCurrentPage, entryToEdit }) {
  const { isAuthenticated } = useAuth();
  const isEditing = !!entryToEdit;

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    entryToEdit?.imageUrl || null,
  );
  const [formData, setFormData] = useState({
    day: entryToEdit?.day || "",
    date: entryToEdit?.date || "",
    title: entryToEdit?.title || "",
    description: entryToEdit?.description || "",
    duration: entryToEdit?.duration || 7,
    skills: entryToEdit?.skills?.join(", ") || "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "success",
    onConfirm: () => {},
  });

  if (!isAuthenticated) {
    return (
      <div className={styles.page}>
        <div className={styles.notAllowed}>
          <h2>🔒 Accès refusé</h2>
          <p>
            Tu dois être connecté pour {isEditing ? "modifier" : "ajouter"} une
            entrée.
          </p>
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload nouvelle image si sélectionnée, sinon garde l'ancienne URL
      let imageUrl = entryToEdit?.imageUrl || null;
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `entries/${Date.now()}_${imageFile.name}`,
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }
      // Si l'image a été supprimée manuellement
      if (!imagePreview && !imageFile) {
        imageUrl = null;
      }

      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const payload = {
        day: parseInt(formData.day),
        date: formData.date,
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        skills: skillsArray,
        imageUrl,
      };

      if (isEditing) {
        await updateEntry(entryToEdit.id, payload);
      } else {
        await addEntry(payload);
      }

      setModalConfig({
        title: isEditing ? "Entrée modifiée !" : "Entrée ajoutée !",
        message: isEditing
          ? "Tes modifications ont été enregistrées."
          : "Ton entrée a été enregistrée avec succès.",
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
        <h1 className={styles.title}>
          {isEditing ? "✏️ Modifier l'entrée" : "Ajouter une entrée"}
        </h1>

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
            <label className={styles.label}>
              Photo{" "}
              {isEditing
                ? "(laisse vide pour garder l'actuelle)"
                : "(optionnel)"}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={styles.input}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className={styles.imagePreview}>
                <img src={imagePreview} alt="Prévisualisation" />
                <button
                  type="button"
                  className={styles.removeImage}
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  ✕ Supprimer
                </button>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.buttonPrimary}
              disabled={loading}
            >
              {loading
                ? "Enregistrement..."
                : isEditing
                  ? "💾 Sauvegarder"
                  : "💾 Enregistrer"}
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
