import styles from "./Modal.module.css";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "confirm",
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>
          {type === "confirm" && <AlertTriangle size={48} color="#f59e0b" />}
          {type === "success" && <CheckCircle size={48} color="#10b981" />}
          {type === "error" && <XCircle size={48} color="#ef4444" />}
          {type === "info" && <Info size={48} color="#3b82f6" />}
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.buttons}>
          {type === "confirm" ? (
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
  );
}

export default Modal;
