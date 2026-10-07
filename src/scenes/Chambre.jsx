/**
 * Chambre.jsx — Scène d'exploration de la chambre de Chloé
 *
 * Mécaniques :
 *  - 3 hotspots : journal, photo, note (note cachée jusqu'à l'examen du journal)
 *  - Panneau latéral d'objet avec EXAMINER + AJOUTER AUX PREUVES
 *  - Barre de dialogue Lucas en bas
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import PointInteractif from '../composants/PointInteractif'
import Bouton from '../composants/Bouton'
import scenario from '../donnees/scenario.json'

// Position absolue de chaque hotspot dans la scène
const POSITIONS = {
  journal: { top: '57%', left: '9%' },
  photo:   { top: '53%', left: '44%' },
  note:    { top: '37%', right: '7%' },
}

export default function Chambre() {
  const { naviguer, etatsObjets, zonesDecouvertes, examiner, ajouterPreuve, afficherToast } = useJeu()
  const [objetOuvert, setObjetOuvert] = useState(null) // id de l'objet affiché dans le panneau

  const obj = objetOuvert ? scenario.objets[objetOuvert] : null
  const flags = objetOuvert ? etatsObjets[objetOuvert] : null

  // La note n'apparaît que si le journal a été examiné
  const noteRevele = etatsObjets.journal?.examine

  // Nombre d'objets examinés parmi les accessibles
  const nbExamines = ['journal', 'photo', ...(noteRevele ? ['note'] : [])]
    .filter(id => etatsObjets[id]?.examine).length
  const totalAccessibles = noteRevele ? 3 : 2

  // Ouvrir le panneau latéral
  const ouvrir = (id) => {
    setObjetOuvert(id)
  }

  // Examiner → révèle l'indice + si journal → révèle la note
  const handleExaminer = () => {
    if (!objetOuvert) return
    examiner(objetOuvert)
    if (objetOuvert === 'journal') {
      setTimeout(() => afficherToast('DÉCOUVERTE', 'Un fragment dépasse derrière la plinthe...'), 600)
    }
  }

  // Ajouter la preuve à l'inventaire
  const handleAjouter = () => {
    if (!objetOuvert) return
    if (!flags.examine) { handleExaminer(); return }
    ajouterPreuve(objetOuvert)
    const nbZ = Object.values(zonesDecouvertes).filter(Boolean).length + (obj.debloqueZone ? 1 : 0)
    afficherToast(obj.debloqueZone ? `INDICE ${nbZ}/3 COLLECTÉ` : 'PREUVE COLLECTÉE', obj.nom)
  }

  // Dialogue de Lucas selon l'état d'examen
  const dialogue = obj
    ? (flags?.examine ? obj.dialogueApreExamen : obj.dialogueInitial)
    : "C'est ici qu'elle passait tout son temps. Chaque objet raconte quelque chose..."

  return (
    <div className="ecran-lieu">
      {/* En-tête */}
      <div className="l-hd">
        <Bouton variante="ghost" onClick={() => { setObjetOuvert(null); naviguer('hub') }}>← RETOUR</Bouton>
        <div className="l-tits">
          <div className="l-sub">Exploration</div>
          <div className="l-tit">La chambre de Chloé</div>
        </div>
        <div className="l-ct">{nbExamines}/{totalAccessibles} objets examinés</div>
      </div>

      {/* Zone principale */}
      <div className={`l-main ${objetOuvert ? 'po' : ''}`}>
        {/* Scène */}
        <div className="l-scene">
          <div className="ch-room">
            <img
              src={`${import.meta.env.BASE_URL}sources/assets/images/decors/La-chambre-de-chloe.png`}
              alt="La chambre de Chloé"
              className="w-full h-full object-cover"
            />
          </div>

          <PointInteractif label="JOURNAL" visite={etatsObjets.journal?.examine} visible style={POSITIONS.journal} onClick={() => ouvrir('journal')} />
          <PointInteractif label="PHOTO"   visite={etatsObjets.photo?.examine}   visible style={POSITIONS.photo}   onClick={() => ouvrir('photo')} />
          <PointInteractif label="NOTE CACHÉE" visite={etatsObjets.note?.examine} visible={noteRevele} style={POSITIONS.note} onClick={() => ouvrir('note')} />
        </div>

        {/* Panneau objet */}
        <AnimatePresence>
          {objetOuvert && obj && (
            <motion.div
              className="opanel"
              initial={{ x: 294 }}
              animate={{ x: 0 }}
              exit={{    x: 294 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="op-hd">
                <div className="op-nm">{obj.nom}</div>
                <button className="op-cl" onClick={() => setObjetOuvert(null)}>✕</button>
              </div>
              <div className="op-img">{obj.icone}</div>
              <div className="op-body">
                <p className="op-desc">{obj.description}</p>
                <div className={`op-clue ${flags?.examine ? 'on' : ''}`}>{obj.indice}</div>
              </div>
              <div className="op-acts">
                <button className="be" onClick={handleExaminer} disabled={flags?.examine}>
                  {flags?.examine ? '✓ EXAMINÉ' : 'EXAMINER'}
                </button>
                <button className="ba" onClick={handleAjouter} disabled={flags?.ajoute}>
                  {flags?.ajoute ? '✓ AJOUTÉ AUX PREUVES' : 'AJOUTER AUX PREUVES'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dialogue Lucas */}
      <div className="dial">
        <div className="dial-av">L</div>
        <motion.div
          className="dial-t"
          key={dialogue}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {dialogue}
        </motion.div>
      </div>
    </div>
  )
}
