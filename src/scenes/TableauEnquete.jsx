/**
 * TableauEnquete.jsx — Tableau de déduction (Detective Board)
 *
 * Mécaniques :
 *  - Drag & Drop via @dnd-kit/core : glisser une preuve sur un suspect
 *  - Clic alternatif : cliquer sur un chip puis sur une zone pour assigner
 *  - Framer Motion : animation flottante subtile des suspects
 *  - Condition Fin A : suspectAccuse === 'balthazar' && toutesZonesDecouvertes
 */
import { useState } from 'react'
import { DndContext, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { useJeu } from '../contextes/ContexteJeu'
import Bouton from '../composants/Bouton'
import scenario from '../donnees/scenario.json'

// ── Chip draggable (gauche) ──────────────────────────────────────────────────
function ChipDraggable({ preuve, estPlace, selectionne, onCliquer }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: preuve.id,
    disabled: estPlace,
  })

  return (
    <div
      ref={setNodeRef}
      className={[
        'ind-chip',
        preuve.estCle  ? 'key-ind'  : '',
        estPlace        ? 'placed'   : '',
        isDragging      ? 'dragging' : '',
      ].join(' ')}
      style={{
        transform: CSS.Translate.toString(transform),
        outline: selectionne ? '2px solid var(--teal)' : undefined,
      }}
      onClick={() => !estPlace && onCliquer(preuve.id)}
      {...(estPlace ? {} : listeners)}
      {...(estPlace ? {} : attributes)}
    >
      <div className="ind-chip-ico">{preuve.icone}</div>
      <div className="ind-chip-txt">
        <span className="ind-chip-nm">{preuve.nom}</span>
        <span className="ind-chip-sub">{preuve.estCle ? '● Indice clé' : 'Indice secondaire'}</span>
      </div>
    </div>
  )
}

// ── Zone de dépôt (droite, dans chaque bloc suspect) ────────────────────────
function ZoneDepot({ suspect, chipSelectionne, onAssignerParClic }) {
  const { preuves, assignations, retirerIndice } = useJeu()
  const { setNodeRef, isOver } = useDroppable({ id: suspect.id })
  const indicesIci = assignations[suspect.id] ?? []

  return (
    <div
      ref={setNodeRef}
      className={`drop-zone ${isOver ? 'over' : ''}`}
      data-placeholder="↓ Déposez un indice ici"
      onClick={() => chipSelectionne && onAssignerParClic(chipSelectionne, suspect.id)}
    >
      {indicesIci.map(pid => {
        const p = preuves.find(x => x.id === pid)
        if (!p) return null
        return (
          <motion.div
            key={pid}
            className="placed-chip"
            title="Cliquer pour retirer"
            onClick={e => { e.stopPropagation(); retirerIndice(pid, suspect.id) }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <span className="placed-chip-ico">{p.icone}</span>
            <span className="placed-chip-nm">{p.nom}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

// ── Portrait : image du personnage, ou initiale si l'image est absente ───
// Déposer le fichier dans public/sources/assets/images/suspects/<id>.png
function PortraitSuspect({ suspect }) {
  const [absent, setAbsent] = useState(false)
  if (absent) return <span className="susp-initiale">{suspect.nom.replace(/^M.s*/, '')[0]}</span>
  return (
    <img
      className="susp-portrait"
      src={`${import.meta.env.BASE_URL}sources/assets/images/suspects/${suspect.id}.png`}
      alt={suspect.nom}
      onError={() => setAbsent(true)}
    />
  )
}

// ── Bloc suspect avec animation flottante ───────────────────────────────────
function BlocSuspect({ suspect, chipSelectionne, onAssignerParClic, delaiAnim }) {
  const { assignations } = useJeu()
  const nbIndices = (assignations[suspect.id] ?? []).length

  return (
    <motion.div
      className={`susp-block ${nbIndices > 0 ? 'has-indices' : ''}`}
      // Animation flottante douce — chaque suspect a un délai différent
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: delaiAnim }}
    >
      <div className="susp-top">
        <motion.div
          className="susp-emo"
          style={{ background: suspect.couleurFond }}
          whileHover={{ scale: 1.1 }}
        >
          <PortraitSuspect suspect={suspect} />
        </motion.div>
        <div className="susp-info">
          <div className="susp-nm">{suspect.nom}</div>
          <div className="susp-desc">{suspect.description}</div>
        </div>
        {nbIndices > 0 && (
          <motion.div
            className="susp-accused"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            ACCUSÉ
          </motion.div>
        )}
      </div>

      <ZoneDepot
        suspect={suspect}
        chipSelectionne={chipSelectionne}
        onAssignerParClic={onAssignerParClic}
      />
    </motion.div>
  )
}

// ── Écran principal ──────────────────────────────────────────────────────────
export default function TableauEnquete() {
  const {
    naviguer,
    preuves,
    assignations,
    suspectAccuse,
    toutesZonesDecouvertes,
    assignerIndice,
  } = useJeu()

  const [chipSelectionne, setChipSelectionne] = useState(null) // mode clic alternatif
  const [activeId, setActiveId]               = useState(null) // pour DragOverlay

  // Fin A : bon suspect + les 3 zones découvertes
  const conditionFinA = suspectAccuse === 'balthazar' && toutesZonesDecouvertes

  // Drag & Drop — fin du glisser
  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (over && active.id !== over.id) {
      assignerIndice(active.id, over.id)
    }
  }

  // Clic alternatif : sélectionner chip puis cliquer sur zone suspect
  const handleCliquerChip = (preuveId) => {
    setChipSelectionne(prev => prev === preuveId ? null : preuveId)
  }

  const handleAssignerParClic = (preuveId, suspectId) => {
    assignerIndice(preuveId, suspectId)
    setChipSelectionne(null)
  }

  const peutAccuser = Boolean(suspectAccuse)
  const nomSuspect  = scenario.suspects.find(s => s.id === suspectAccuse)?.nom ?? ''
  const activeDrag  = preuves.find(p => p.id === activeId)

  return (
    <DndContext
      onDragStart={({ active }) => setActiveId(active.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="ecran-choix">
        {/* En-tête */}
        <div className="ch-hd">
          <div className="ch-tit">QUI ÉTAIT AU CENTRE DE TOUT, LUCAS ?</div>
          <div className="ch-hint">
            Glissez un indice sur un suspect, ou cliquez sur un indice puis sur une zone.
          </div>
        </div>

        <div className="ch-layout">
          {/* Pool d'indices (gauche) */}
          <div className="ch-pool">
            <div className="ch-pool-hd">
              <span className="ch-pool-lbl">VOS INDICES</span>
              <span className="ch-pool-sub">
                {chipSelectionne
                  ? `Cliquez maintenant sur un suspect`
                  : 'Glissez ou cliquez pour assigner'}
              </span>
            </div>
            <div className="ch-pool-list">
              {preuves.length === 0 ? (
                <p style={{ padding: '20px', color: 'var(--dim)', fontFamily: "'Special Elite',serif", fontSize: '11px', fontStyle: 'italic', textAlign: 'center' }}>
                  Aucune preuve collectée. Retournez enquêter.
                </p>
              ) : (
                preuves.map(p => {
                  const estPlace = Object.values(assignations).some(arr => arr.includes(p.id))
                  return (
                    <ChipDraggable
                      key={p.id}
                      preuve={p}
                      estPlace={estPlace}
                      selectionne={chipSelectionne === p.id}
                      onCliquer={handleCliquerChip}
                    />
                  )
                })
              )}
            </div>
          </div>

          {/* Suspects (droite) */}
          <div className="ch-suspects">
            {scenario.suspects.map((s, i) => (
              <BlocSuspect
                key={s.id}
                suspect={s}
                chipSelectionne={chipSelectionne}
                onAssignerParClic={handleAssignerParClic}
                delaiAnim={i * 1.2}
              />
            ))}

            {/* Voix de Chloé */}
            <AnimatePresence>
              {peutAccuser && (
                <motion.div
                  className="vbox"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{    opacity: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Lucas cherche celui qui avait tout à perdre. Regarde les connexions entre les indices.
                  <div className="vattr">— Voix de Chloé</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="ch-ft">
          <Bouton variante="ghost" onClick={() => naviguer('inventaire')}>← VOIR LES PREUVES</Bouton>

          <span className="ch-ft-status">
            {peutAccuser
              ? `Suspect désigné : ${nomSuspect}`
              : 'Assignez au moins un indice à un suspect pour accuser.'}
          </span>

          <Bouton
            variante="accuser"
            disabled={!peutAccuser}
            onClick={() => naviguer('fin')}
          >
            LANCER L'ACCUSATION
          </Bouton>
        </div>
      </div>

      {/* Fantôme de drag */}
      <DragOverlay>
        {activeDrag && (
          <div className="ind-chip key-ind" style={{ opacity: 0.85, pointerEvents: 'none', width: '220px' }}>
            <div className="ind-chip-ico">{activeDrag.icone}</div>
            <div className="ind-chip-txt">
              <span className="ind-chip-nm">{activeDrag.nom}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
