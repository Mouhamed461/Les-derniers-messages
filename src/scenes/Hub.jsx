/**
 * Hub.jsx — Tableau de bord de l'enquête
 * Affiche les 3 lieux, la progression des indices et le bouton dossier final.
 */
import { motion } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'

const LIEUX = [
  { id: 'chambre',    ecran: 'chambre',    icone: '🛏️', nom: 'CHAMBRE',    statutVide: 'Non explorée' },
  { id: 'casier',     ecran: 'casier',     icone: '🔒', nom: 'CASIER',     statutVide: 'Non exploré'  },
  { id: 'messagerie', ecran: 'messagerie', icone: '💬', nom: 'MESSAGERIE', statutVide: 'Non explorée' },
]

export default function Hub() {
  const { naviguer, zonesDecouvertes, nbZonesDecouvertes, toutesZonesDecouvertes } = useJeu()

  return (
    <div className="ecran-hub">
      {/* En-tête */}
      <div className="hub-hd">
        <span className="hub-logo">LES DERNIERS MESSAGES</span>
        <span className="hub-nav">CHOISISSEZ UN LIEU</span>
      </div>

      <div className="hub-bd">
        {/* Colonne gauche — résumé */}
        <div className="hub-l">
          <div className="hub-enq">
            <span className="hub-ico">🔍</span>
            <h2 className="hub-etit">L'ENQUÊTE<br />DE LUCAS</h2>
          </div>
          <p className="hub-desc">
            La police a conclu à un acte isolé. Lucas refuse cette version.
            La clé USB de Chloé lui indique trois endroits où la vérité se cache.
          </p>
          <div className="hub-obj">
            <span className="lb">Objectif</span>
            <p>Trouver les 3 indices cachés pour débloquer le dossier final et découvrir la vérité sur Chloé.</p>
          </div>

          {/* Indicateurs de progression */}
          <div className="hub-dots-w">
            <span className="lb">INDICES COLLECTÉS</span>
            <div className="hub-dots">
              {LIEUX.map(({ id }) => (
                <motion.div
                  key={id}
                  className={`hd ${zonesDecouvertes[id] ? 'on' : ''}`}
                  animate={zonesDecouvertes[id] ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {zonesDecouvertes[id] ? '✓' : '—'}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne droite — cartes des lieux */}
        <div className="hub-r">
          <div className="hub-clbl">CHOISISSEZ UN LIEU</div>

          <div className="hub-cards">
            {LIEUX.map(({ id, ecran, icone, nom, statutVide }, i) => (
              <motion.div
                key={id}
                className={`lcard ${zonesDecouvertes[id] ? 'done' : ''}`}
                onClick={() => naviguer(ecran)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="lcard-img">{icone}</div>
                <div className="lcard-ft">
                  <span className="lcard-nm">{nom}</span>
                  <span className="lcard-st">
                    {zonesDecouvertes[id] ? '✓ Indice trouvé' : statutVide}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton dossier final */}
          <motion.button
            className={`hub-dos ${toutesZonesDecouvertes ? 'uk' : 'lk'}`}
            onClick={() => toutesZonesDecouvertes && naviguer('inventaire')}
            whileHover={toutesZonesDecouvertes ? { scale: 1.02 } : {}}
          >
            {toutesZonesDecouvertes
              ? '📂 DOSSIER BALTHAZAR — DÉBLOQUÉ'
              : `🔒 DOSSIER BALTHAZAR — ${nbZonesDecouvertes}/3 INDICES`}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
