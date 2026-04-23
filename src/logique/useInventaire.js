/**
 * useInventaire.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Gestion centralisée de l'état du jeu via useReducer.
 * Ce hook contient TOUTE la logique métier ; les composants visuels
 * n'ont qu'à appeler les actions nommées.
 *
 * Structure de l'état :
 *  - zonesDecouvertes  : indique si chambre/casier/messagerie ont été résolus
 *  - preuves           : tableau des preuves dans l'inventaire
 *  - etatsObjets       : { examine, ajoute } pour chaque objet physique
 *  - etatsMessages     : { collecte } pour chaque conversation
 *  - cadenas           : { ouvert } — mini-jeu du casier
 *  - brouillonsDebloque: débloqué par mot-clé dans la messagerie
 *  - assignations      : preuves assignées à chaque suspect (tableau de déduction)
 *  - suspectAccuse     : suspect avec le plus d'indices assignés
 */

import { useReducer, useCallback, useMemo } from 'react';
import scenario from '../donnees/scenario.json';

// ── Noms des actions (évite les fautes de frappe) ────────────────────────────
export const ACTIONS = {
  EXAMINER:             'EXAMINER',
  AJOUTER_PREUVE:       'AJOUTER_PREUVE',
  COLLECTER_MESSAGE:    'COLLECTER_MESSAGE',
  DEBLOQUER_CADENAS:    'DEBLOQUER_CADENAS',
  DEBLOQUER_BROUILLONS: 'DEBLOQUER_BROUILLONS',
  ASSIGNER_INDICE:      'ASSIGNER_INDICE',
  RETIRER_INDICE:       'RETIRER_INDICE',
  REJOUER:              'REJOUER',
};

// ── Crée un état initial propre (utilisé au démarrage ET pour rejouer) ───────
const creerEtatInitial = () => ({
  zonesDecouvertes: { chambre: false, casier: false, messagerie: false },
  preuves: [],
  etatsObjets: Object.fromEntries(
    Object.keys(scenario.objets).map(id => [id, { examine: false, ajoute: false }])
  ),
  etatsMessages: Object.fromEntries(
    Object.keys(scenario.conversations).map(id => [id, false])
  ),
  cadenas: { ouvert: false },
  brouillonsDebloque: false,
  assignations: { jade: [], nathan: [], balthazar: [] },
  suspectAccuse: null,
});

// ── Calcule le suspect avec le plus d'indices assignés ───────────────────────
function calculerSuspect(assignations) {
  let max = 0;
  let suspect = null;
  for (const [id, indices] of Object.entries(assignations)) {
    if (indices.length > max) { max = indices.length; suspect = id; }
  }
  return suspect;
}

// ── Réducteur pur (sans effets de bord) ──────────────────────────────────────
function reducteur(etat, action) {
  switch (action.type) {

    // Examiner un objet physique → révèle l'indice dans le panneau
    case ACTIONS.EXAMINER: {
      const { objetId } = action.payload;
      if (etat.etatsObjets[objetId]?.examine) return etat;
      return {
        ...etat,
        etatsObjets: {
          ...etat.etatsObjets,
          [objetId]: { ...etat.etatsObjets[objetId], examine: true },
        },
      };
    }

    // Ajouter une preuve à l'inventaire + déverrouiller une zone si besoin
    case ACTIONS.AJOUTER_PREUVE: {
      const { objetId } = action.payload;
      if (etat.etatsObjets[objetId]?.ajoute) return etat;
      const objet = scenario.objets[objetId];
      const nouvellePreuve = {
        id: objetId,
        nom: objet.nom,
        icone: objet.icone,
        desc: objet.indice,
        estCle: objet.estCle,
      };
      const nouvellesZones = { ...etat.zonesDecouvertes };
      if (objet.debloqueZone && !etat.zonesDecouvertes[objet.debloqueZone]) {
        nouvellesZones[objet.debloqueZone] = true;
      }
      return {
        ...etat,
        etatsObjets: {
          ...etat.etatsObjets,
          [objetId]: { ...etat.etatsObjets[objetId], ajoute: true },
        },
        preuves: [...etat.preuves, nouvellePreuve],
        zonesDecouvertes: nouvellesZones,
      };
    }

    // Collecter un indice depuis la messagerie
    case ACTIONS.COLLECTER_MESSAGE: {
      const { convId } = action.payload;
      if (etat.etatsMessages[convId]) return etat;
      const conv = scenario.conversations[convId];
      const nouvellePreuve = {
        id: 'msg_' + convId,
        nom: 'Messages ' + conv.nom,
        icone: '💬',
        desc: conv.indice,
        estCle: conv.estCle,
      };
      const nouvellesZones = { ...etat.zonesDecouvertes };
      if (conv.debloqueZone && !etat.zonesDecouvertes[conv.debloqueZone]) {
        nouvellesZones[conv.debloqueZone] = true;
      }
      return {
        ...etat,
        etatsMessages: { ...etat.etatsMessages, [convId]: true },
        preuves: [...etat.preuves, nouvellePreuve],
        zonesDecouvertes: nouvellesZones,
      };
    }

    // Mini-jeu cadenas résolu → révèle l'agenda
    case ACTIONS.DEBLOQUER_CADENAS:
      return { ...etat, cadenas: { ouvert: true } };

    // Mot-clé trouvé dans la messagerie → déverrouille les brouillons
    case ACTIONS.DEBLOQUER_BROUILLONS:
      return { ...etat, brouillonsDebloque: true };

    // Glisser-déposer : assigner une preuve à un suspect
    case ACTIONS.ASSIGNER_INDICE: {
      const { preuveId, suspectId } = action.payload;
      // Retirer la preuve de tout autre suspect
      const nouvelles = {};
      for (const [k, v] of Object.entries(etat.assignations)) {
        nouvelles[k] = v.filter(id => id !== preuveId);
      }
      nouvelles[suspectId] = [...nouvelles[suspectId], preuveId];
      return {
        ...etat,
        assignations: nouvelles,
        suspectAccuse: calculerSuspect(nouvelles),
      };
    }

    // Retirer une preuve d'un suspect (clic sur la chip placée)
    case ACTIONS.RETIRER_INDICE: {
      const { preuveId, suspectId } = action.payload;
      const nouvelles = {
        ...etat.assignations,
        [suspectId]: etat.assignations[suspectId].filter(id => id !== preuveId),
      };
      return {
        ...etat,
        assignations: nouvelles,
        suspectAccuse: calculerSuspect(nouvelles),
      };
    }

    // Réinitialiser complètement le jeu
    case ACTIONS.REJOUER:
      return creerEtatInitial();

    default:
      return etat;
  }
}

// ── Hook public ───────────────────────────────────────────────────────────────
export function useInventaire() {
  const [etat, dispatch] = useReducer(reducteur, undefined, creerEtatInitial);

  // Sélecteurs mémorisés (recalculés seulement si les dépendances changent)
  const nbZonesDecouvertes = useMemo(
    () => Object.values(etat.zonesDecouvertes).filter(Boolean).length,
    [etat.zonesDecouvertes]
  );

  const toutesZonesDecouvertes = useMemo(
    () => Object.values(etat.zonesDecouvertes).every(Boolean),
    [etat.zonesDecouvertes]
  );

  // Actions nommées mémorisées (évitent des re-renders inutiles)
  const examiner             = useCallback(id   => dispatch({ type: ACTIONS.EXAMINER,             payload: { objetId: id } }), []);
  const ajouterPreuve        = useCallback(id   => dispatch({ type: ACTIONS.AJOUTER_PREUVE,       payload: { objetId: id } }), []);
  const collecterMessage     = useCallback(id   => dispatch({ type: ACTIONS.COLLECTER_MESSAGE,    payload: { convId: id } }), []);
  const debloquerCadenas     = useCallback(()   => dispatch({ type: ACTIONS.DEBLOQUER_CADENAS }), []);
  const debloquerBrouillons  = useCallback(()   => dispatch({ type: ACTIONS.DEBLOQUER_BROUILLONS }), []);
  const assignerIndice       = useCallback((pId, sId) => dispatch({ type: ACTIONS.ASSIGNER_INDICE, payload: { preuveId: pId, suspectId: sId } }), []);
  const retirerIndice        = useCallback((pId, sId) => dispatch({ type: ACTIONS.RETIRER_INDICE,  payload: { preuveId: pId, suspectId: sId } }), []);
  const rejouer              = useCallback(()   => dispatch({ type: ACTIONS.REJOUER }), []);

  return {
    ...etat,
    nbZonesDecouvertes,
    toutesZonesDecouvertes,
    examiner,
    ajouterPreuve,
    collecterMessage,
    debloquerCadenas,
    debloquerBrouillons,
    assignerIndice,
    retirerIndice,
    rejouer,
  };
}
