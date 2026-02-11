import styles from "./Metier.module.css";
import Tag from "../components/Tag";
import Card from "../components/Card";
import { Briefcase, Coins, GraduationCap, UserCircle } from "lucide-react";

function Metier() {
  const metier = {
    title: "Développeur Web",
    description:
      "Le développeur web est responsable de la création et de la maintenance des sites et applications web. Il travaille en étroite collaboration avec les designers, les chefs de projet et les autres développeurs pour assurer une expérience utilisateur optimale.",
    contractType: "CDI / Freelance",
    salary: "35k€ - 50k€ par an",
    education: "Bac +2 à Bac +5",
    missions: [
      "Analyser les besoins et rédiger les spécifications techniques",
      "Développer les interfaces utilisateur (React, Vue.js)",
      "Concevoir et développer les API backend",
      "Gérer les bases de données et optimiser les performances",
      "Effectuer les tests et corriger les bugs",
      "Participer aux revues de code et à l'amélioration continue",
    ],
    technicalSkills: [
      "JavaScript",
      "React",
      "Node.js",
      "SQL",
      "Git",
      "API REST",
      "TypeScript",
    ],
    softSkills: [
      "Autonomie",
      "Rigueur",
      "Communication",
      "Curiosité",
      "Travail d'équipe",
    ],

    interview: {
      name: "Jean Dupont",
      role: "Lead Developer chez Caplaser",
      questions: [
        {
          question: "Qu'est-ce qui vous plaît le plus dans ce métier ?",
          answer:
            "La diversité des projets et le fait de pouvoir créer des solutions concrètes qui aident les utilisateurs au quotidien.",
        },
        {
          question: "Quels conseils donneriez-vous à un étudiant ?",
          answer:
            "Pratiquez régulièrement, faites des projets personnels et n'ayez pas peur de vous tromper. C'est en faisant des erreurs qu'on apprend le plus.",
        },
      ],
    },
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{metier.title}</h1>
          <div className={styles.tags}>
            <Tag>
              <Briefcase size={14} /> {metier.contractType}
            </Tag>
            <Tag>
              <Coins size={14} /> {metier.salary}
            </Tag>
            <Tag>
              <GraduationCap size={14} /> {metier.education}
            </Tag>
          </div>
        </div>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Description du métier</h2>
          <Card>
            <p className={styles.description}>{metier.description}</p>
          </Card>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Missions Principales</h2>
          <Card>
            <ul className={styles.missionsList}>
              {metier.missions.map((mission, index) => (
                <li key={index} className={styles.missionItem}>
                  <span className={styles.missionNumber}>{index + 1}</span>
                  <span>{mission}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Compétences requises</h2>
          <div className={styles.skillsGrid}>
            <Card>
              <h3 className={styles.skillsLabel}>Compétences techniques</h3>
              <div className={styles.skillsTags}>
                {metier.technicalSkills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className={styles.skillsLabel}>Soft skills</h3>
              <div className={styles.skillsTags}>
                {metier.softSkills.map((skill) => (
                  <Tag key={skill}>{skill}</Tag>
                ))}
              </div>
            </Card>
          </div>
        </section>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interviews</h2>
          <Card>
            <div className={styles.interviewHeader}>
              <div className={styles.interviewAvatar}>
                <UserCircle size={40} color="#3b82f6" />
              </div>
              <div className={styles.interviewInfo}>
                <div className={styles.interviewName}>
                  {metier.interview.name}
                </div>
                <div className={styles.interviewRole}>
                  {metier.interview.role}
                </div>
              </div>
            </div>

            <div className={styles.interviewQuestions}>
              {metier.interview.questions.map((item, index) => (
                <div key={index} className={styles.questionBlock}>
                  <p className={styles.question}>{item.question}</p>
                  <p className={styles.answer}>"{item.answer}"</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default Metier;
