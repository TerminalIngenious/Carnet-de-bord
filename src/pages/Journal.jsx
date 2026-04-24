import { useState, useEffect } from "react";
import styles from "./Journal.module.css";
import Tag from "../components/Tag";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";
import { getEntries, deleteEntry } from "../services/entries";
import { getWeekRecap, saveWeekRecap } from "../services/weekRecaps";
import { Trash2, ChevronDown, ChevronUp, Clock, Zap, BookOpen, Pencil, Check, X } from "lucide-react";

// Calcule le numéro de semaine de stage à partir du 20 avril 2026
const getWeekNumber = (dateStr) => {
  const stageStart = new Date("2026-04-20");
  const entryDate = new Date(dateStr);
  const diffDays = Math.floor((entryDate - stageStart) / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
};

// Groupe les entrées par semaine
const groupByWeek = (entries) => {
  const weeks = {};
  entries.forEach((entry) => {
    const week = getWeekNumber(entry.date);
    if (!weeks[week]) weeks[week] = [];
    weeks[week].push(entry);
  });
  return weeks;
};

// Calcule les dates de début et fin d'une semaine de stage
const getWeekDates = (weekNumber) => {
  const stageStart = new Date("2026-04-20");
  const weekStart = new Date(stageStart);
  weekStart.setDate(stageStart.getDate() + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);
  const fmt = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${fmt(weekStart)} – ${fmt(weekEnd)}`;
};

function WeekRecap({ weekNumber, entries, isAuthenticated }) {
  const [open, setOpen] = useState(false);
  const [recap, setRecap] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  const totalHours = entries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const allSkills = [...new Set(entries.flatMap((e) => e.skills || []))];
  const weekDates = getWeekDates(weekNumber);

  useEffect(() => {
    if (!open) return;
    getWeekRecap(weekNumber).then((data) => {
      setRecap(data);
      setEditText(data?.text || "");
    });
  }, [open, weekNumber]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveWeekRecap(weekNumber, editText);
      setRecap({ text: editText });
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditText(recap?.text || "");
    setEditing(false);
  };

  return (
    <div className={styles.weekRecap}>
      <button className={styles.weekRecapHeader} onClick={() => setOpen(!open)}>
        <div className={styles.weekRecapLeft}>
          <span className={styles.weekBadge}>S{weekNumber}</span>
          <div>
            <span className={styles.weekTitle}>Semaine {weekNumber}</span>
            <span className={styles.weekDates}>{weekDates}</span>
          </div>
        </div>
        <div className={styles.weekRecapMeta}>
          <span className={styles.weekStat}><Clock size={14} /> {totalHours}h</span>
          <span className={styles.weekStat}><BookOpen size={14} /> {entries.length} jour{entries.length > 1 ? "s" : ""}</span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className={styles.weekRecapBody}>

          {/* Stats */}
          <div className={styles.weekStats}>
            <div className={styles.weekStatCard}>
              <Clock size={20} color="#3b82f6" />
              <span className={styles.weekStatValue}>{totalHours}h</span>
              <span className={styles.weekStatLabel}>Heures travaillées</span>
            </div>
            <div className={styles.weekStatCard}>
              <BookOpen size={20} color="#3b82f6" />
              <span className={styles.weekStatValue}>{entries.length}</span>
              <span className={styles.weekStatLabel}>Jours renseignés</span>
            </div>
            <div className={styles.weekStatCard}>
              <Zap size={20} color="#3b82f6" />
              <span className={styles.weekStatValue}>{allSkills.length}</span>
              <span className={styles.weekStatLabel}>Compétences utilisées</span>
            </div>
          </div>

          {/* Compétences */}
          {allSkills.length > 0 && (
            <div className={styles.weekSkills}>
              <p className={styles.weekSkillsTitle}>Compétences de la semaine</p>
              <div className={styles.weekSkillsTags}>
                {allSkills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </div>
          )}

          {/* Résumé journées */}
          <div className={styles.weekDaysList}>
            <p className={styles.weekSkillsTitle}>Résumé des journées</p>
            {entries
              .slice()
              .sort((a, b) => a.day - b.day)
              .map((entry) => (
                <div key={entry.id} className={styles.weekDayItem}>
                  <span className={styles.weekDayBadge}>J{entry.day}</span>
                  <div style={{ flex: 1 }}>
                    <span className={styles.weekDayTitle}>{entry.title}</span>
                  </div>
                  <span className={styles.weekDayDuration}>{entry.duration}h</span>
                </div>
              ))}
          </div>

          {/* Récap textuel */}
          <div className={styles.weekTextRecap}>
            <div className={styles.weekTextRecapHeader}>
              <p className={styles.weekSkillsTitle}>📝 Récap de la semaine</p>
              {isAuthenticated && !editing && (
                <button className={styles.editRecapBtn} onClick={() => setEditing(true)}>
                  <Pencil size={14} />
                  {recap?.text ? "Modifier" : "Rédiger"}
                </button>
              )}
            </div>

            {editing ? (
              <div className={styles.editRecapArea}>
                <textarea
                  className={styles.recapTextarea}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Résume ici ta semaine pour ta prof..."
                  rows={6}
                />
                <div className={styles.editRecapActions}>
                  <button className={styles.saveRecapBtn} onClick={handleSave} disabled={saving}>
                    <Check size={14} />
                    {saving ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                  <button className={styles.cancelRecapBtn} onClick={handleCancel}>
                    <X size={14} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.recapTextDisplay}>
                {recap?.text ? (
                  <p>{recap.text}</p>
                ) : (
                  <p className={styles.recapEmpty}>
                    {isAuthenticated
                      ? "Aucun récap rédigé pour cette semaine."
                      : "Le récap de cette semaine n'a pas encore été rédigé."}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

function Journal({ setCurrentPage }) {
  const { isAuthenticated } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("journal");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
  });

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

  const showModal = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

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

  const weekGroups = groupByWeek(entries);
  const sortedWeeks = Object.keys(weekGroups).map(Number).sort((a, b) => b - a);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Journal de stage</h1>
              <p className={styles.subtitle}>Suivi quotidien de mes activités chez Caplaser</p>
            </div>
            {isAuthenticated && (
              <button className={styles.addButton} onClick={() => setCurrentPage("addEntry")}>
                + Ajouter une entrée
              </button>
            )}
          </div>

          {!loading && entries.length > 0 && (
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${view === "journal" ? styles.tabActive : ""}`}
                onClick={() => setView("journal")}
              >
                📋 Entrées
              </button>
              <button
                className={`${styles.tab} ${view === "recap" ? styles.tabActive : ""}`}
                onClick={() => setView("recap")}
              >
                📊 Récap hebdo
              </button>
            </div>
          )}
        </div>

        {loading && <div className={styles.loading}><p>Chargement des entrées...</p></div>}

        {!loading && entries.length === 0 && (
          <div className={styles.empty}>
            <p>📝 Aucune entrée pour le moment.</p>
            {isAuthenticated && (
              <button className={styles.addButton} onClick={() => setCurrentPage("addEntry")}>
                Ajouter ma première entrée
              </button>
            )}
          </div>
        )}

        {/* Vue Journal */}
        {!loading && entries.length > 0 && view === "journal" && (
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
                        <span className={styles.entryDuration}>{entry.duration}h</span>
                        {isAuthenticated && (
                          <button className={styles.deleteButton} onClick={() => handleDelete(entry.id, entry.title)}>
                            <Trash2 size={18} />
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

        {/* Vue Récap hebdo */}
        {!loading && entries.length > 0 && view === "recap" && (
          <div className={styles.recapList}>
            {sortedWeeks.map((week) => (
              <WeekRecap
                key={week}
                weekNumber={week}
                entries={weekGroups[week]}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>

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