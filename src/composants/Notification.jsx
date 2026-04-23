/**
 * Toast.jsx
 * Notification temporaire animée (apparaît en bas à droite).
 * Reçoit { toast: { titre, sousTitre } | null } depuis le contexte.
 */
import { AnimatePresence, motion } from 'framer-motion'

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="toast"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{    y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <span>{toast.titre}</span>
          {toast.sousTitre && <span className="toast-sous">{toast.sousTitre}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
