import styles from './Modal.module.css'

function Modal ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmer", cancelText = "Annuler", type = "confirm"}){
    if (!isOpen) return null

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.icon}>
                    {type === 'confirm' && '⚠️'}
                    {type === 'success' && '✅'}
                    {type === 'error' && '❌'}
                    {type === 'info' && 'ℹ️'}
                </div>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>

                <div className={styles.buttons}>
                    {type === 'confirm' ? (
                        <>
                            <button className={styles.cancelButton} onClick={onCancel}>
                                {cancelText}
                            </button>
                            <button className={styles.confirmButton} onClick={onConfirm}>
                                {confirmText}
                            </button>
                        </>
                    ) : (
                        <button className={styles.confirmButton} onClick={onConfirm}>
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Modal