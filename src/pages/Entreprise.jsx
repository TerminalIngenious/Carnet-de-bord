import styles from "./Entreprise.module.css";
import Tag from "../components/Tag";
import Card from "../components/Card";
import {
  Building2,
  MapPin,
  Users,
  CalendarDays,
  Globe,
  Smartphone,
  Cloud,
  Wrench,
} from "lucide-react";

function Entreprise() {
  // Données de l'entreprise
  const entreprise = {
    name: "Caplaser",
    slogan: "Solutions de développement web et logiciels sur mesure",
    location: "Castres, Occitanie",
    employees: "15 employés",
    founded: "2015",
    description:
      "Caplaser est une entreprise spécialisée dans le développement de solutions numériques sur mesure. Depuis sa création en 2015, l'entreprise accompagne les PME et grands comptes dans leur transformation digitale. L'équipe, composée de développeurs passionnés, travaille avec les technologies les plus récentes pour créer des applications web et mobiles performantes.",
    services: [
      {
        icon: "globe",
        title: "Développement Web",
        description: "Sites vitrines, e-commerce, applications web sur mesure",
      },
      {
        icon: "smartphone",
        title: "Applications Mobiles",
        description: "iOS, Android, React Native, Flutter",
      },
      {
        icon: "cloud",
        title: "Solutions Cloud",
        description: "Infrastructure, hébergement, DevOps",
      },
      {
        icon: "wrench",
        title: "Maintenance",
        description: "Support, évolutions, mises à jour",
      },
    ],
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <Card>
          <div className={styles.header}>
            <div className={styles.logo}>
              <Building2 size={48} color="#3b82f6" />
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{entreprise.name}</h1>
              <p className={styles.slogan}>{entreprise.slogan}</p>
              <div className={styles.tags}>
                <Tag>
                  <MapPin size={14} /> {entreprise.location}
                </Tag>
                <Tag>
                  <Users size={14} /> {entreprise.employees}
                </Tag>
                <Tag>
                  <CalendarDays size={14} /> Fondée en {entreprise.founded}
                </Tag>
              </div>
            </div>
          </div>
        </Card>

        {/* Présentation */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Présentation</h2>
          <Card>
            <p className={styles.description}>{entreprise.description}</p>
          </Card>
        </section>

        {/* Services */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Activités & Services</h2>
          <div className={styles.servicesGrid}>
            {entreprise.services.map((service, index) => {
              const IconComponent = {
                globe: Globe,
                smartphone: Smartphone,
                cloud: Cloud,
                wrench: Wrench,
              }[service.icon];

              return (
                <Card key={index}>
                  <div className={styles.serviceIcon}>
                    <IconComponent size={32} color="#3b82f6" />
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.description}</p>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Entreprise;
