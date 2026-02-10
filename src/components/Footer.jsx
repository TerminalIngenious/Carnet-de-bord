import styles from './Footer.module.css'

function Footer ({nom, annee}) {
    return (
        <footer className={styles.footer}>
            <p className={styles.p}>Carnet de Stage - {nom} - {annee}</p>
        </footer>
    )
}

export default Footer