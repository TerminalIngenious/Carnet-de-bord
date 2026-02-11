import { useState, useEffect } from "react";
import styles from "./Home.module.css";
import { getEntries } from "../services/entries";
import {
  Calendar,
  FileText,
  Target,
  Camera,
  Building2,
  Briefcase,
  BookOpen,
} from "lucide-react";

function Home({ setCurrentPage }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalSkills: 0,
    totalPhotos: 0,
    totalHours: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEntries();
        setEntries(data);

        // Calcule les stats
        const allSkills = new Set();
        let photosCount = 0;
        let hoursCount = 0;

        data.forEach((entry) => {
          // Compétences uniques
          entry.skills?.forEach((skill) => allSkills.add(skill));
          // Photos
          if (entry.imageUrl) photosCount++;
          //Heures
          hoursCount += entry.duration || 0;
        });

        setStats({
          totalEntries: data.length,
          totalSkills: allSkills.size,
          totalPhotos: photosCount,
          totalHours: hoursCount,
        });
      } catch (error) {
        console.error("Erreur:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  //Récupère les 3 dernières entrées
  const recentEntries = entries.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* Section Hero */}
      <section className={styles.hero}>
        <div className={styles.avatar}>
          <img src="/pdp.jpg" alt="" />
        </div>
        <h1 className={styles.name}>Mattéo</h1>
        <p className={styles.formation}>
          Etudiant BUT MMI - Parcours Développement
        </p>
        <p className={styles.dates}>Stage du 20 Avril au 12 Juin 2026</p>
        <div className={styles.heroButtons}>
          <button
            className={styles.buttonPrimary}
            onClick={() => setCurrentPage("journal")}
          >
            Voir le Journal de Bord
          </button>
          <button
            className={styles.buttonSecondary}
            onClick={() => setCurrentPage("entreprise")}
          >
            Découvrir Caplaser
          </button>
        </div>
      </section>
      {/* Section Stats */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Calendar size={28} color="#3b82f6" />
            </div>
            <div className={styles.statValue}>8</div>
            <div className={styles.statLabel}>Semaines de stage</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FileText size={28} color="#3b82f6" />
            </div>
            <div className={styles.statValue}>
              {loading ? "..." : stats.totalEntries}
            </div>
            <div className={styles.statLabel}>Entrées Journal</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Target size={28} color="#3b82f6" />
            </div>
            <div className={styles.statValue}>
              {loading ? "..." : stats.totalSkills}
            </div>
            <div className={styles.statLabel}>Compétences</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Camera size={28} color="#3b82f6" />
            </div>
            <div className={styles.statValue}>
              {loading ? "..." : stats.totalPhotos}
            </div>
            <div className={styles.statLabel}>Photos</div>
          </div>
        </div>
      </section>
      {/* Section Explorer */}
      <section className={styles.explore}>
        <h2 className={styles.sectionTitle}>Explorer</h2>
        <div className={styles.exploreGrid}>
          <div
            className={styles.exploreCard}
            onClick={() => setCurrentPage("entreprise")}
          >
            <div className={styles.exploreIcon}>
              <Building2 size={28} color="#3b82f6" />
            </div>
            <h3 className={styles.exploreCardTitle}>L'entreprise</h3>
            <p className={styles.exploreCardDesc}>
              Découvrez Caplaser, son histoire, ses activités et son équipe.
            </p>
            <span className={styles.exploreLink}>En Savoir Plus →</span>
          </div>
          <div
            className={styles.exploreCard}
            onClick={() => setCurrentPage("metier")}
          >
            <div className={styles.exploreIcon}>
              <Briefcase size={28} color="#3b82f6" />
            </div>
            <h3 className={styles.exploreCardTitle}>Le métier</h3>
            <p className={styles.exploreCardDesc}>
              Fiche complète du métier de développeur web observé durant le
              stage.
            </p>
            <span className={styles.exploreLink}>Découvrir →</span>
          </div>
          <div
            className={styles.exploreCard}
            onClick={() => setCurrentPage("journal")}
          >
            <div className={styles.exploreIcon}>
              <BookOpen size={28} color="#3b82f6" />
            </div>
            <h3 className={styles.exploreCardTitle}>Journal de Bord</h3>
            <p className={styles.exploreCardDesc}>
              Suivi quotidien des activités, apprentissages et réalisations.
            </p>
            <span className={styles.exploreLink}>Consulter →</span>
          </div>
        </div>
      </section>

      {/* Section Dernières Entrées */}
      {recentEntries.length > 0 && (
        <section className={styles.recentEntries}>
          <h2 className={styles.sectionTitle}>Dernières entrées</h2>

          <div className={styles.entriesList}>
            {recentEntries.map((entry) => (
              <div
                className={styles.entryCard}
                onClick={() => setCurrentPage("journal")}
              >
                <div className={styles.entryDay}>J{entry.day}</div>
                <div className={styles.entryInfo}>
                  <h4 className={styles.entryTitle}>{entry.title}</h4>
                  <p className={styles.entryDate}>{entry.date}6</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
