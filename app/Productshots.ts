// Toutes les prises de vue du produit LUMORA (fichiers dans /public/images).
// w/h = dimensions réelles : utilisez-les pour éviter les décalages de mise en page.
const alt = "زجاجة شامبو LUMORA ضد تساقط الشعر";

export const SHOTS = {
  /** 4:5 — photo complète, produit centré (fiche produit, slide hero mobile) */
  hero:   { src: "/lumora-hero.webp",       w: 1600, h: 2000, alt },
  /** 1:1 — photo carrée avec reflet (galerie produit, réseaux sociaux) */
  square: { src: "/lumora-square.webp",     w: 1600, h: 1600, alt },
  /** 4:5 — gros plan sur l'étiquette : logo, titre, badge « sans sulfates » */
  label:  { src: "/lumora-label.webp",      w: 1000, h: 1250, alt: "ملصق شامبو LUMORA" },
  /** 1:1 — gros plan bouchon + épaule de la bouteille */
  cap:    { src: "/lumora-cap.webp",        w: 1000, h: 1000, alt: "غطاء زجاجة LUMORA" },
  /** 8:3 — base de la bouteille + reflet (bandeau, séparateur de section) */
  base:   { src: "/lumora-base.webp",       w: 1600, h: 600,  alt },
  /** 4:3 — plan moyen, idéal pour les cartes catégories */
  card:   { src: "/lumora-card.webp",       w: 1400, h: 1050, alt },
  /** 16:9 — bannière large, produit à GAUCHE (texte à droite en RTL) */
  wideLeft:  { src: "/lumora-wide-left.webp",  w: 2560, h: 1440, alt },
  /** 16:9 — bannière large, produit à DROITE */
  wideRight: { src: "/lumora-wide-right.webp", w: 2560, h: 1440, alt },
  /** Détouré (fond transparent) — à poser sur n'importe quel fond coloré */
  bottle: { src: "/lumora-bottle.webp",     w: 517,  h: 1700, alt },
} as const;

export type ShotKey = keyof typeof SHOTS;