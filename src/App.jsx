/**
 * App.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Composant racine. Enveloppe l'application dans le GameProvider et rend
 * l'écran actif avec une transition Framer Motion.
 */

import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider, useJeu }    from './contextes/ContexteJeu'
import Notification                  from './composants/Notification'

// Scènes
import Titre          from './scenes/Titre'
import Prologue       from './scenes/Prologue'
import Hub            from './scenes/Hub'
import Chambre        from './scenes/Chambre'
import Casier         from './scenes/Casier'
import Messagerie     from './scenes/Messagerie'
import Inventaire     from './scenes/Inventaire'
import TableauEnquete from './scenes/TableauEnquete'
import Fin            from './scenes/Fin'

// Table de correspondance écran → composant
const ECRANS = {
  titre:    Titre,
  prologue: Prologue,
  hub:      Hub,
  chambre:  Chambre,
  casier:   Casier,
  messagerie: Messagerie,
  inventaire: Inventaire,
  tableau:  TableauEnquete,
  fin:      Fin,
}

// Variantes d'animation partagées par tous les écrans
const variantesEcran = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

function Jeu() {
  const { ecran, toast } = useJeu()
  const Ecran = ECRANS[ecran] ?? Titre

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={ecran}
          variants={variantesEcran}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}
        >
          <Ecran />
        </motion.div>
      </AnimatePresence>

      {/* Toast global — rendu en dehors d'AnimatePresence pour ne pas être coupé */}
      <Notification toast={toast} />
    </>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Jeu />
    </GameProvider>
  )
}
