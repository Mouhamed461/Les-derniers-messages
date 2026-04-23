/**
 * Casier.jsx — Scène d'exploration du casier au lycée
 *
 * Mécaniques :
 *  - Hotspot CADENAS → ouvre le mini-jeu ModaleCadenas
 *  - Hotspot AGENDA CACHÉ → révélé après résolution du cadenas
 *  - MOT de Sergio contient l'indice du code (6·4·2)
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import PointInteractif from '../composants/PointInteractif'
import ModaleCadenas from '../composants/ModaleCadenas'
import Bouton from '../composants/Bouton'
import scenario from '../donnees/scenario.json'

const POSITIONS = {
  mot:     { top: '21%', left: '50%' },
  rapport: { top: '45%', left: '38%' },
  cadenas: { top: '74%', left: '47%' },
  agenda:  { top: '57%', left: '59%' },
}

export default function Casier() {
  const { naviguer, etatsObjets, zonesDecouvertes, cadenas, examiner, ajouterPreuve, afficherToast } = useJeu()
  const [objetOuvert,    setObjetOuvert]    = useState(null)
  const [cadenasVisible, setCadenasVisible] = useState(false)

  const obj   = objetOuvert ? scenario.objets[objetOuvert] : null
  const flags = objetOuvert ? etatsObjets[objetOuvert] : null

  const agendaRevele = cadenas.ouvert

  const nbExamines = ['mot', 'rapport', ...(agendaRevele ? ['agenda'] : [])]
    .filter(id => etatsObjets[id]?.examine).length
  const totalAccessibles = agendaRevele ? 3 : 2

  const handleExaminer = () => {
    if (!objetOuvert) return
    examiner(objetOuvert)
  }

  const handleAjouter = () => {
    if (!objetOuvert) return
    if (!flags.examine) { handleExaminer(); return }
    ajouterPreuve(objetOuvert)
    const nbZ = Object.values(zonesDecouvertes).filter(Boolean).length + (obj.debloqueZone ? 1 : 0)
    afficherToast(obj.debloqueZone ? `INDICE ${nbZ}/3 COLLECTÉ` : 'PREUVE COLLECTÉE', obj.nom)
  }

  const dialogue = obj
    ? (flags?.examine ? obj.dialogueApreExamen : obj.dialogueInitial)
    : "C'était déjà cassé. Quelqu'un a tout fouillé. Il reste peut-être quelque chose..."

  return (
    <div className="ecran-lieu">
      <div className="l-hd">
        <Bouton variante="ghost" onClick={() => { setObjetOuvert(null); naviguer('hub') }}>← RETOUR</Bouton>
        <div className="l-tits">
          <div className="l-sub">Scène de crime</div>
          <div className="l-tit">Le casier au lycée</div>
        </div>
        <div className="l-ct">{nbExamines}/{totalAccessibles} objets examinés</div>
      </div>

      <div className={`l-main ${objetOuvert ? 'po' : ''}`}>
        <div className="l-scene">
          <img
            src="/sources/assets/images/decors/Casier.png"
            alt="Le casier au lycée"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Hotspots */}
          <PointInteractif label="MOT"    visite={etatsObjets.mot?.examine}    visible style={POSITIONS.mot}    onClick={() => setObjetOuvert('mot')} />
          <PointInteractif label="RAPPORT" visite={etatsObjets.rapport?.examine} visible style={POSITIONS.rapport} onClick={() => setObjetOuvert('rapport')} />

          {/* Cadenas — visible jusqu'à résolution, puis cache/agenda */}
          <PointInteractif
            label="CADENAS"
            visible={!agendaRevele}
            couleur="var(--yellow)"
            style={POSITIONS.cadenas}
            onClick={() => setCadenasVisible(true)}
          />
          <PointInteractif
            label="AGENDA CACHÉ"
            visite={etatsObjets.agenda?.examine}
            visible={agendaRevele}
            style={POSITIONS.agenda}
            onClick={() => setObjetOuvert('agenda')}
          />
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

      {/* Mini-jeu cadenas */}
      <ModaleCadenas visible={cadenasVisible} onFermer={() => setCadenasVisible(false)} />
    </div>
  )
}
