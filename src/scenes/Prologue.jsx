/**
 * Prologue.jsx — Introduction narrative avant le hub
 */
import { motion } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import Bouton from '../composants/Bouton'

export default function Prologue() {
  const { naviguer } = useJeu()

  return (
    <div className="ecran-prologue">
      <motion.div
        className="p-eye"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        — PROLOGUE —
      </motion.div>

      <motion.h2
        className="p-h2"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        UNE CLÉ<br />ROUGE
      </motion.h2>

      <motion.p
        className="p-txt"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        Ce matin-là, en ouvrant sa porte,<br />
        Lucas trouve une enveloppe glissée sous le seuil.<br />
        À l'intérieur : une clé USB rouge.<br /><br />
        Il la branche. Une interface sobre et sombre s'ouvre.<br />
        La voix de Chloé commence à parler...
      </motion.p>

      <motion.div
        className="p-btns"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <Bouton variante="primary" onClick={() => naviguer('hub')}>OUVRIR L'INTERFACE →</Bouton>
        <Bouton variante="secondary" onClick={() => naviguer('titre')}>← RETOUR</Bouton>
      </motion.div>
    </div>
  )
}
