/**
 * Messagerie.jsx — Interface de messagerie de Chloé
 *
 * Mécaniques :
 *  - Barre de recherche activée UNIQUEMENT si le journal a été examiné
 *  - Taper un mot-clé du journal débloque la conversation "Brouillons"
 *  - Brouillons affichent un message verrouillé tant qu'ils ne sont pas débloqués
 */
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import Bouton from '../composants/Bouton'
import scenario from '../donnees/scenario.json'

export default function Messagerie() {
  const {
    naviguer,
    etatsObjets,
    etatsMessages,
    brouillonsDebloque,
    collecterMessage,
    debloquerBrouillons,
    afficherToast,
  } = useJeu()

  const [convActive, setConvActive] = useState('jade')
  const [recherche,  setRecherche]  = useState('')
  const messsagesRef = useRef(null)

  const journalExamine = etatsObjets.journal?.examine ?? false

  // Tester si la recherche contient un mot-clé débloquant
  const handleRecherche = (e) => {
    const val = e.target.value
    setRecherche(val)
    if (!brouillonsDebloque && journalExamine) {
      const match = scenario.motsClesDeblocage.some(kw => val.toLowerCase().includes(kw))
      if (match) {
        debloquerBrouillons()
        afficherToast('🔓 BROUILLONS DÉBLOQUÉS', 'Un message non envoyé trouvé dans les archives')
        setTimeout(() => setConvActive('brouillons'), 350)
      }
    }
  }

  const conv = scenario.conversations[convActive]

  const handleCollecterMessage = () => {
    collecterMessage(convActive)
    const nbZ = Object.values(useJeu()).filter !== undefined ? 0 : 0
    afficherToast(
      conv.debloqueZone ? 'INDICE COLLECTÉ' : 'PREUVE COLLECTÉE',
      'Messages ' + conv.nom
    )
  }

  // Texte du hint sous la barre de recherche
  const kwHint = brouillonsDebloque
    ? '✓ Brouillons débloqués'
    : journalExamine
      ? '💡 Tapez un mot du journal pour débloquer des messages secrets'
      : '🔒 Explorez la chambre pour débloquer la recherche'

  return (
    <div className="ecran-msg">
      {/* Barre de titre façon macOS */}
      <div className="msg-tb">
        <div className="chr">
          <div className="cd r" /><div className="cd y" /><div className="cd g" />
        </div>
        <span className="msg-at">Messagerie de Chloé — Interface USB</span>
      </div>

      <div className="msg-lay">
        {/* Sidebar contacts */}
        <div className="msg-sb">
          {/* Barre de recherche */}
          <div className="msg-sr">
            <input
              type="text"
              placeholder="Rechercher un mot-clé..."
              disabled={!journalExamine}
              value={recherche}
              onChange={handleRecherche}
            />
            <div className={`kw-hint ${journalExamine && !brouillonsDebloque ? 'active' : ''}`}>
              {kwHint}
            </div>
          </div>

          {/* Liste des contacts */}
          <div className="msg-cts">
            {Object.entries(scenario.conversations).map(([id, c]) => {
              const estVerr = id === 'brouillons' && !brouillonsDebloque
              return (
                <div
                  key={id}
                  className={`msg-ct ${convActive === id ? 'act' : ''} ${estVerr ? 'verr' : ''}`}
                  onClick={() => setConvActive(id)}
                >
                  <div
                    className="ct-av"
                    style={{
                      background: estVerr ? 'rgba(106,13,173,.25)' : c.couleur,
                      color:      estVerr ? 'var(--dim)'           : c.couleurTexte,
                    }}
                  >
                    {estVerr ? '🔒' : c.nom[0]}
                  </div>
                  <div>
                    <div className="ct-nm">{c.nom}</div>
                    <div className="ct-pv">
                      {estVerr ? 'Accès restreint' : c.messages[0].texte.slice(0, 34) + '...'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="msg-ret">
            <Bouton variante="ghost" style={{ width: '100%', textAlign: 'center' }} onClick={() => naviguer('hub')}>
              ← RETOUR AU HUB
            </Bouton>
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="msg-chat">
          <div className="msg-ch">{conv.nom}</div>

          <div className="msg-ms" ref={messsagesRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={convActive}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'contents' }}
              >
                {/* Brouillons verrouillés */}
                {convActive === 'brouillons' && !brouillonsDebloque ? (
                  <div className="mind" style={{ margin: '24px', fontSize: '11px', lineHeight: '1.9' }}>
                    🔒 Cette messagerie est protégée.<br /><br />
                    Utilisez la barre de recherche et tapez un mot trouvé dans le journal de Chloé.
                  </div>
                ) : (
                  <>
                    {/* Messages de la conversation */}
                    {conv.messages.map((msg, i) => {
                      const envoye = msg.de === 'chloe'
                      const brouillon = msg.de === 'brou'
                      return (
                        <div key={i} style={{ display: 'contents' }}>
                          {msg.date && <div className="msep">{msg.date}</div>}
                          <div className={`bw ${envoye ? 'sent' : ''}`}>
                            <div
                              className="bav"
                              style={{
                                background: envoye ? '#6A0DAD' : brouillon ? '#3d1060' : conv.couleur,
                                color: envoye ? '#fff' : brouillon ? '#ccc' : conv.couleurTexte,
                              }}
                            >
                              {envoye ? 'C' : brouillon ? '✏' : conv.nom[0]}
                            </div>
                            <div
                              className={`bub ${envoye ? 'sent' : brouillon ? 'brou' : 'recv'}`}
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {msg.texte}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Bouton collecter */}
                    {!etatsMessages[convActive] ? (
                      <button className="mcb" onClick={handleCollecterMessage}>
                        + COLLECTER CET INDICE
                      </button>
                    ) : (
                      <div className="mind">✓ {conv.indice}</div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="msg-fh">Lisez les conversations pour trouver des indices clés.</div>
        </div>
      </div>
    </div>
  )
}
