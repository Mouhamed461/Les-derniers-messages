/**
 * Titre.jsx — Écran d'accueil du jeu
 */
import { motion } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import Bouton from '../composants/Bouton'

export default function Titre() {
  const { naviguer } = useJeu()

  return (
    <div className="ecran-titre">
      <span className="t-eye">— Une enquête narrative —</span>

      <motion.h1
        className="t-h1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        LES<br /><span>DERNIERS</span>MESSAGES
      </motion.h1>

      <motion.p
        className="t-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Il y a six jours, Chloé s'est donné la mort.<br />
        La police a conclu à un acte isolé.<br />
        Lucas, lui, refuse cette version.
      </motion.p>

      <motion.div
        className="t-btns"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <Bouton variante="primary" onClick={() => naviguer('prologue')}>▶ &nbsp;COMMENCER</Bouton>
        <Bouton variante="secondary" onClick={() => naviguer('hub')}>↺ &nbsp;REPRENDRE</Bouton>
      </motion.div>

      <motion.div
        className="t-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="t-meta-i"><label>Genre</label><span>ENQUÊTE · NARRATION</span></div>
        <div className="t-meta-i"><label>Durée</label><span>~15 À 45 MIN</span></div>
        <div className="t-meta-i"><label>Fins</label><span>TOUT EST POSSIBLE</span></div>
      </motion.div>

      <motion.div
        className="postit"
        initial={{ opacity: 0, rotate: 0, x: 30 }}
        animate={{ opacity: 1, rotate: 2.5, x: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="postit-pin" />
        <span className="postit-h">📨 LES DERNIERS MESSAGES</span>
        "La vérité est là.<br />Il suffit de bien regarder."<br /><br />
        <strong>INTERFACE CHLOÉ</strong><br />3 DESTINATIONS DÉBLOQUÉES
      </motion.div>
    </div>
  )
}
