/**
 * ModaleCadenas.jsx
 * Mini-jeu de cadenas à 3 molettes numériques.
 * Le code correct (défini dans scenario.json) débloque l'agenda caché.
 *
 * Props :
 *   visible   - boolean pour afficher / masquer
 *   onFermer  - callback quand on annule
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import scenario from '../donnees/scenario.json'

export default function ModaleCadenas({ visible, onFermer }) {
  const { debloquerCadenas, afficherToast } = useJeu()

  const [chiffres, setChiffres] = useState([0, 0, 0])
  const [erreur,   setErreur]   = useState('')
  const [secoue,   setSecoue]   = useState(false)

  // Fait tourner une molette (+1 ou -1)
  const tourner = (index, direction) => {
    setChiffres(prev => {
      const copie = [...prev]
      copie[index] = (copie[index] + direction + 10) % 10
      return copie
    })
    setErreur('')
  }

  // Vérifie si le code est bon
  const verifier = () => {
    if (chiffres.join('') === scenario.codeCadenas) {
      debloquerCadenas()
      afficherToast('CADENAS OUVERT ✓', "L'agenda caché est maintenant accessible")
      setChiffres([0, 0, 0])
      onFermer()
    } else {
      setErreur('Combinaison incorrecte — cherchez un indice...')
      setSecoue(true)
      setTimeout(() => setSecoue(false), 400)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          onClick={onFermer}
        >
          {/* Boîte : stopPropagation évite de fermer en cliquant dedans */}
          <motion.div
            className="modal-box"
            onClick={e => e.stopPropagation()}
            animate={secoue ? { x: [-7, 7, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="modal-tit">🔒 FOND DU CASIER</div>
            <p className="modal-sub">
              Un cadenas à 3 chiffres bloque l'accès.<br />
              Trouvez la combinaison.
            </p>

            {/* Molettes */}
            <div className="lock-dials">
              {chiffres.map((val, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <div className="lock-dial">
                    <button className="dial-btn" onClick={() => tourner(i, 1)}>▲</button>

                    {/* Animation de changement de chiffre */}
                    <motion.div
                      className="dial-val"
                      key={`${i}-${val}`}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0,   opacity: 1 }}
                      transition={{ duration: 0.12 }}
                    >
                      {val}
                    </motion.div>

                    <button className="dial-btn" onClick={() => tourner(i, -1)}>▼</button>
                  </div>
                  {i < 2 && <div className="lock-sep">·</div>}
                </div>
              ))}
            </div>

            <div className="lock-hint">
              Indice : <span>examinez attentivement le mot de Sergio.</span>
            </div>

            <div className="lock-err">{erreur}</div>

            <div className="modal-btns">
              <button className="ba" onClick={verifier}>OUVRIR</button>
              <button className="bret" onClick={onFermer}>ANNULER</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
