/**
 * ContexteJeu.jsx
 * ──────────────────────────────────────────────────────────────────────────────
 * Fournit l'état du jeu et les actions à tous les composants enfants via le
 * contexte React. Utilise le hook useInventaire pour la logique métier.
 *
 * Usage dans n'importe quel composant :
 *   const { ecran, naviguer, preuves, examiner, ... } = useJeu();
 */

import { createContext, useContext, useState, useCallback } from 'react';
import { useInventaire } from '../logique/useInventaire';

const ContexteJeu = createContext(null);

// ── Fournisseur de contexte ───────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [ecran, setEcran]   = useState('titre');
  const [toast, setToast]   = useState(null);   // { titre, sousTitre } | null
  const inventaire          = useInventaire();
  let   _toastTimer         = null;

  // Navigation entre les écrans
  const naviguer = useCallback((nouvelEcran) => {
    setEcran(nouvelEcran);
  }, []);

  // Affiche une notification temporaire (3,2 s)
  const afficherToast = useCallback((titre, sousTitre = '') => {
    clearTimeout(_toastTimer);
    setToast({ titre, sousTitre });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    _toastTimer = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ContexteJeu.Provider value={{ ecran, naviguer, toast, afficherToast, ...inventaire }}>
      {children}
    </ContexteJeu.Provider>
  );
}

// ── Hook raccourci ────────────────────────────────────────────────────────────
export const useJeu = () => {
  const ctx = useContext(ContexteJeu);
  if (!ctx) throw new Error('useJeu doit être utilisé à l\'intérieur de <GameProvider>');
  return ctx;
};
