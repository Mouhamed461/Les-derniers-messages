/**
 * Inventaire.jsx — Dossier Chloé Marchand : liste des preuves collectées
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import Bouton from '../composants/Bouton'

const MAX_PREUVES = 9

export default function Inventaire() {
  const { naviguer, preuves } = useJeu()
  const [selection, setSelection] = useState(null)

  const preuveSel = selection !== null ? preuves[selection] : null
  const progression = Math.round((preuves.length / MAX_PREUVES) * 100)

  return (
    <div className="ecran-inv">
      {/* En-tête avec barre de progression */}
      <div className="inv-hd">
        <div className="inv-tit">DOSSIER CHLOÉ MARCHAND — ÉVIDENCES</div>
        <div className="inv-pw">
          <div className="inv-pb">
            <motion.div
              className="inv-pf"
              initial={{ width: 0 }}
              animate={{ width: `${progression}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="inv-pt">{preuves.length}/{MAX_PREUVES} indices</div>
        </div>
      </div>

      <div className="inv-bd">
        {/* Grille des preuves */}
        <div className="inv-left">
          <span className="inv-ll">PREUVES COLLECTÉES</span>
          <p className="inv-note">Les indices marqués ● sont essentiels pour l'accusation finale.</p>

          <div className="inv-grid">
            {preuves.map((p, i) => (
              <motion.div
                key={p.id}
                className={`ii ${p.estCle ? 'key' : ''} ${selection === i ? 'sel' : ''}`}
                onClick={() => setSelection(i)}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="ii-ico">{p.icone}</div>
                <div className="ii-nm">{p.nom}</div>
              </motion.div>
            ))}

            {/* Emplacements vides */}
            {Array.from({ length: Math.max(0, 6 - preuves.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="ii empty">
                <div className="ii-ico" style={{ fontSize: '16px', color: 'rgba(106,13,173,.28)' }}>?</div>
                <div className="ii-nm">—</div>
              </div>
            ))}
          </div>
        </div>

        {/* Détail + boutons */}
        <div className="inv-right">
          <div className="inv-det">
            <div className="inv-det-ico">{preuveSel?.icone ?? '🔍'}</div>
            <div className="inv-dtit">{preuveSel?.nom ?? 'Sélectionnez une preuve'}</div>
            <div className="inv-dtxt">
              {preuveSel?.desc ?? 'Cliquez sur un élément à gauche pour voir les détails.'}
            </div>
            {preuveSel?.estCle && <div className="inv-dtag">● INDICE CLÉ</div>}
          </div>

          <div className="inv-acts">
            <Bouton variante="danger" onClick={() => naviguer('tableau')}>
              ⚖️ &nbsp;LANCER L'ACCUSATION
            </Bouton>
            <Bouton variante="ghost" style={{ textAlign: 'center', padding: '11px' }} onClick={() => naviguer('hub')}>
              ← RETOURNER À L'ENQUÊTE
            </Bouton>
          </div>
        </div>
      </div>
    </div>
  )
}
