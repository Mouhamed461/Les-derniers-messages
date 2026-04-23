/**
 * Bouton.jsx
 * Bouton réutilisable avec animation Framer Motion.
 * variante : 'primary' | 'secondary' | 'danger' | 'action' | 'ghost' | 'fin'
 */
import { motion } from 'framer-motion'

const CLASSES = {
  primary:   'bp',
  secondary: 'bs',
  danger:    'bl',
  action:    'ba',
  ghost:     'bret',
  fin:       'bf',
  accuser:   'bpl',
}

export default function Bouton({ children, variante = 'primary', disabled, onClick, style, className }) {
  return (
    <motion.button
      className={`${CLASSES[variante] ?? 'bp'} ${className ?? ''}`}
      disabled={disabled}
      onClick={onClick}
      style={style}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled  ? { scale: 0.97 } : {}}
    >
      {children}
    </motion.button>
  )
}
