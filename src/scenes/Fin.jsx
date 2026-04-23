/**
 * Fin.jsx — Écran de résultat de l'enquête
 *
 * Fin A (bonne) : suspectAccuse === 'balthazar' ET toutesZonesDecouvertes
 * Fin B (mauvaise) : tout autre cas
 */
import { motion } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import Bouton from '../composants/Bouton'
import scenario from '../donnees/scenario.json'

export default function Fin() {
  const { naviguer, suspectAccuse, toutesZonesDecouvertes, rejouer } = useJeu()

  const estFinA   = suspectAccuse === 'balthazar' && toutesZonesDecouvertes
  const finData   = scenario.fins[estFinA ? 'A' : 'B']
  const nomSusp   = scenario.suspects.find(s => s.id === suspectAccuse)?.nom ?? 'personne'

  // Remplace {suspect} dans les paragraphes de la fin B
  const paragraphes = finData.paragraphes.map(p => p.replace('{suspect}', nomSusp))

  return (
    <div className="ecran-fin">
      <motion.div
        className="fin-ey"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        RÉSULTAT DE L'ENQUÊTE
      </motion.div>

      <motion.div
        className={`fin-v ${finData.type}`}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 22 }}
      >
        {finData.titre}
      </motion.div>

      <motion.div
        className="fin-sc"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {finData.icone}
      </motion.div>

      <motion.div
        className="fin-tx"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {paragraphes.map((p, i) => (
          <p
            key={i}
            className="fin-p"
            style={i === paragraphes.length - 1
              ? { color: estFinA ? 'var(--teal)' : 'var(--red)', fontStyle: 'italic' }
              : undefined}
          >
            {p}
          </p>
        ))}
      </motion.div>

      <motion.div
        className="fin-bs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <button className="bf" onClick={() => { rejouer(); naviguer('titre') }}>↺ REJOUER</button>
        <button className="bf" onClick={() => naviguer('tableau')}>EXPLORER LES AUTRES CHOIX</button>
        <button className="bf" onClick={() => naviguer('titre')}>ACCUEIL</button>
      </motion.div>
    </div>
  )
}
