/**
 * PointInteractif.jsx
 * Point pulsant cliquable sur les scènes d'exploration.
 *
 * Props :
 *   label     - texte affiché sous le point
 *   onClick   - callback au clic
 *   visite    - true si l'objet a déjà été examiné (point vert statique)
 *   visible   - false = invisible + non-cliquable (objet caché à révéler)
 *   couleur   - couleur optionnelle du point (défaut : var(--red))
 *   style     - style inline pour le positionnement absolu
 */
import { motion, AnimatePresence } from 'framer-motion'

export default function PointInteractif({ label, onClick, visite = false, visible = true, couleur, style }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`hs ${visite ? 'vis' : ''}`}
          style={style}
          onClick={onClick}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{    scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="hsd" style={couleur ? { background: couleur } : undefined} />
          <div className="hs-lb">{label}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
