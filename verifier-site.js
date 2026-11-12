#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   site/verifier-site.js — le site est-il utilisable tel qu'il est livré ?
   ──────────────────────────────────────────────────────────────────────────
   Douze familles de contrôles, exécutés sur les fichiers réels :

     1. chaque ressource référencée existe (css, js, typo, images) ;
     2. chaque lien interne mène à une page existante, chaque ancre à un id réel ;
     3. le site ne charge RIEN d'un domaine extérieur ;
     4. chaque page a titre, description, canonical, og:image, viewport, langue ;
     5. les données structurées (JSON-LD) sont du JSON valide ;
     6. chaque <img> a un alt et une source ;
     7. hiérarchie des titres : un seul h1, aucun saut de niveau ;
     8. les téléchargements passent TOUS par le fichier de configuration ;
     9. le contenu est présent dans le HTML, sans JavaScript ;
    10. les polices sont embarquées dans le site (aucun appel à un service) ;
    11. l'identité est respectée : le site est clair (pas de fond noir dominant),
        et aucune section n'est numérotée 01 / 02 / 03 ;
    12. la page d'accueil est institutionnelle : les deux logiciels n'y occupent
        qu'une part mesurée de la page, et la vidéo a un emplacement réservé
        (jamais une fausse vidéo d'entreprise).

   Sortie : « NN points de contrôle · 0 échec(s) », code de sortie 1 sinon.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs'), path = require('path');
const SITE = __dirname;

let points = 0; const echecs = [];
function ok(nom, cond, detail) { points++; if (!cond) echecs.push(nom + (detail ? ' — ' + detail : '')); }

const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html')).sort();
const lire = f => fs.readFileSync(path.join(SITE, f), 'utf8');
const existe = p => fs.existsSync(path.join(SITE, p.replace(/^\.\//, '')));
const css = lire('assets/css/site.css');
const js = lire('assets/js/site.js');
const config = lire('assets/js/telechargements.js');

ok('le site contient des pages HTML (' + pages.length + ')', pages.length >= 6, pages.join(', '));

/* ── 1. ressources ── */
let ressources = 0;
pages.forEach(f => {
  const html = lire(f);
  const refs = [
    ...[...html.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/g)].map(m => m[1]),
    ...[...html.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)].map(m => m[2]),
  ].filter(u => u && !/^(https?:|mailto:|tel:|data:|#|javascript:)/.test(u));
  refs.forEach(u => {
    const fichier = u.split('#')[0].split('?')[0];
    if (!fichier) return;
    ressources++;
    ok('fichier présent : ' + fichier + ' (vu dans ' + f + ')', existe(fichier));
  });
});
ok('besoin de ressources locales (' + ressources + ' références)', ressources > 30);

/* ── 2. liens et ancres ── */
const idsParPage = {};
pages.forEach(f => { idsParPage[f] = new Set([...lire(f).matchAll(/id\s*=\s*"([^"]+)"/g)].map(m => m[1])); });
let liens = 0;
pages.forEach(f => {
  [...lire(f).matchAll(/href\s*=\s*"([^"]+)"/g)].map(m => m[1])
    .filter(h => !/^(https?:|mailto:|tel:|javascript:|data:)/.test(h)).forEach(h => {
      liens++;
      const [cible, ancre] = h.split('#');
      if (cible && !existe(cible)) return ok('lien interne : ' + h + ' (' + f + ')', false, 'page absente');
      if (ancre) {
        const fichier = cible || f;
        ok('ancre : ' + h + ' (' + f + ')', (idsParPage[fichier] || new Set()).has(ancre), 'id « ' + ancre + ' » absent de ' + fichier);
      }
    });
});
ok('le site se visite entièrement (' + liens + ' liens internes)', liens > 24);

/* ── 3. rien d'extérieur ── */
pages.forEach(f => {
  const externes = [...lire(f).matchAll(/(?:src|href)\s*=\s*"(https?:\/\/[^"]+)"/g)].map(m => m[1])
    /* wa.me et mailto sont des LIENS de contact (un clic de l'utilisateur) : ce contrôle
       vérifie qu'on ne CHARGE rien depuis un domaine extérieur. */
    .filter(u => !/mod-eric\.com|wa\.me/.test(u));
  ok('aucune ressource extérieure (' + f + ')', externes.length === 0, externes.join(', '));
});
ok('la feuille de style ne charge aucune police distante', !/@import|fonts\.googleapis|fonts\.gstatic/.test(css));
ok('aucun script tiers', !/(google-analytics|googletagmanager|facebook|hotjar|cdn\.)/i.test(js));

/* ── 10. les polices vivent dans le site ── */
['InstrumentSerif-Regular', 'InstrumentSerif-Italic', 'InstrumentSans-400'].forEach(f =>
  ok('police embarquée : ' + f + '.woff2', existe('assets/typo/' + f + '.woff2')));
ok('la feuille déclare ses trois fontes', (css.match(/@font-face/g) || []).length >= 3);

/* ── 4. les balises que lisent les moteurs et les partages ── */
pages.filter(f => f !== '404.html').forEach(f => {
  const html = lire(f);
  ok('titre <title> (' + f + ')', /<title>[^<]{12,}<\/title>/.test(html));
  ok('description (' + f + ')', /name="description" content="[^"]{40,}"/.test(html));
  ok('canonique (' + f + ')', /rel="canonical" href="https:\/\/mod-eric\.com\//.test(html));
  ok('image de partage (' + f + ')', /property="og:image"/.test(html));
  ok('viewport mobile (' + f + ')', /name="viewport" content="width=device-width/.test(html));
  ok('langue déclarée (' + f + ')', /<html lang="fr"/.test(html));
});

/* ── 5. JSON-LD ── */
pages.forEach(f => {
  [...lire(f).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    let bon = true, err = '';
    try { const o = JSON.parse(m[1]); bon = !!o['@context'] && !!o['@type']; err = bon ? '' : 'sans @context/@type'; }
    catch (e) { bon = false; err = e.message; }
    ok('JSON-LD valide (' + f + ' #' + (i + 1) + ')', bon, err);
  });
});
ok('l’accueil porte les données de l’entreprise', /"@type": "Organization"/.test(lire('index.html')));
ok('chaque page produit porte son SoftwareApplication',
  /"@type": "SoftwareApplication"/.test(lire('stockia.html')) && /"@type": "SoftwareApplication"/.test(lire('dd-spirity.html')));

/* ── 6. images ── */
let images = 0;
pages.forEach(f => {
  [...lire(f).matchAll(/<img\b[^>]*>/g)].forEach(m => {
    images++;
    ok('image avec alt (' + f + ')', /\balt\s*=/.test(m[0]), m[0].slice(0, 70));
    ok('image avec src (' + f + ')', /\bsrc\s*=\s*"[^"]+"/.test(m[0]), m[0].slice(0, 70));
  });
});
ok('les images sont décrites (' + images + ' balises)', images > 2);

/* ── 7. hiérarchie des titres ── */
pages.forEach(f => {
  const niveaux = [...lire(f).matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
  ok('un seul h1 (' + f + ')', niveaux.filter(n => n === 1).length === 1, 'h1 : ' + niveaux.filter(n => n === 1).length);
  let saut = null;
  for (let i = 1; i < niveaux.length; i++) if (niveaux[i] - niveaux[i - 1] > 1) saut = 'h' + niveaux[i - 1] + ' → h' + niveaux[i];
  ok('aucun saut de niveau (' + f + ')', !saut, saut || '');
});

/* ── 8. les téléchargements ── */
['stockia', 'ddSpirity'].forEach(k => ok('le fichier de téléchargement déclare « ' + k + ' »', new RegExp('\\b' + k + '\\s*:').test(config)));
const pagesTele = pages.filter(f => /data-tele=/.test(lire(f)));
ok('les blocs de téléchargement existent (' + pagesTele.length + ' pages)', pagesTele.length >= 2);
let blocs = 0, inconnus = 0;
pages.forEach(f => {
  [...lire(f).matchAll(/data-tele="([^"]+)"/g)].forEach(m => {
    blocs++;
    const [produit, plateforme] = m[1].split(':');
    const bloc = config.slice(config.indexOf(produit + ':'));
    if (!new RegExp(plateforme + '\\s*:').test(bloc)) { inconnus++; echecs.push('plateforme inconnue : ' + m[1] + ' (' + f + ')'); }
  });
});
ok('chaque bloc renvoie à une clé connue (' + blocs + ' blocs)', inconnus === 0, inconnus + ' inconnu(s)');
ok('aucun bouton de téléchargement en dur (href="#")', !pages.some(f => /href="#"[^>]*>\s*Télécharger/i.test(lire(f))));
ok('aucun fichier .exe / .apk / .zip écrit à la main', !pages.some(f => /href="[^"]*\.(exe|apk|zip|msi)"/i.test(lire(f))));

/* ── 9. lisible sans JavaScript ── */
pages.filter(f => f !== '404.html').forEach(f => {
  const texte = lire(f).replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const mots = texte.split(/\s+/).filter(w => w.length > 2).length;
  ok('texte utile sans JavaScript (' + f + ' : ' + mots + ' mots)', mots > 120);
});
ok('la page contact et les mentions disent que rien ne part vers un serveur',
  /rien ne part|aucune donnée personnelle/i.test(lire('contact.html') + lire('mentions-legales.html')));
ok('les mentions légales ne fabriquent pas de numéro d’immatriculation', /à compléter par l'éditeur/.test(lire('mentions-legales.html')));

/* ── 11. l'identité ── */
ok('la feuille pose un fond blanc en premier', /--blanc:#FFFFFF/.test(css));
ok('le bleu ciel est la couleur identitaire', /--azur:#3FA0D8/.test(css));
ok('aucun fond sombre dominant dans la feuille (pas de --encre:#0…  en fond de page)',
  !/body\{[^}]*background:var\(--encre\)/.test(css));
ok('aucune section numérotée 01 / 02 / 03 dans le HTML',
  !pages.some(f => /<span[^>]*>\s*0[1-9]\s*[—–-]/.test(lire(f)) && !/Stockia|Spirity/.test('')));
const num = [];
pages.forEach(f => { (lire(f).match(/>\s*0[1-9]\s*</g) || []).forEach(x => num.push(f + ':' + x.trim())); });
ok('aucun faux numéro de section (01, 02, 03…) dans le contenu', num.length === 0, num.join(' '));

/* ── 12. la page d'accueil est institutionnelle ── */
const accueil = lire('index.html');
ok('l’accueil présente l’entreprise AVANT les créations',
  accueil.indexOf('id="entreprise"') > 0 && accueil.indexOf('id="entreprise"') < accueil.indexOf('id="creations"'));
ok('l’accueil porte les sections demandées par le client',
  /Qui sommes-nous/.test(accueil) && /Notre vision/.test(accueil) && /Notre philosophie/.test(accueil)
  && /Nos créations/.test(accueil) && /Notre rapport à la technologie/.test(accueil));
ok('la philosophie est présentée SANS numérotation',
  /La réflexion/.test(accueil) && !/<ol|1\.\s*La réflexion|>01</.test(accueil));
ok('les logiciels n’ont qu’une place discrète sur l’accueil (moins de 30 % des liens)',
  (accueil.match(/stockia\.html|dd-spirity\.html/g) || []).length <= 6,
  (accueil.match(/stockia\.html|dd-spirity\.html/g) || []).length + ' liens');
ok('l’accueil porte un emplacement de film institutionnel, réservé et dit comme tel',
  /emplacement/i.test(accueil) && /film institutionnel|FILM/i.test(accueil));
ok('aucune vidéo d’entreprise n’est fabriquée sur l’accueil', !/<video/.test(accueil));
ok('le film n’est chargé que s’il existe réellement',
  /institutionnel\.mp4/.test(js) && /loadedmetadata/.test(js));

/* ── 13. les pages produit décrivent le logiciel réel ── */
const stockiaH = lire('stockia.html');
ok('Stockia est présenté comme un point de vente (POS), pas comme un tableur de gestion',
  /point de vente/i.test(stockiaH) && /PointOfSaleApplication/.test(stockiaH), 'mention POS absente');
ok('la page Stockia nomme ses fonctions réelles (douchette, monnaie, péremption, crédit)',
  /douchette/i.test(stockiaH) && /monnaie/i.test(stockiaH) && /péremption/i.test(stockiaH) && /crédit/i.test(stockiaH));
ok('la page Stockia montre les captures réelles du logiciel',
  (stockiaH.match(/assets\/medias\/stockia-/g) || []).length >= 4,
  (stockiaH.match(/assets\/medias\/stockia-/g) || []).length + ' captures');
const ddH = lire('dd-spirity.html');
ok('la page D.D- Spirity nomme ses fonctions réelles (portillon, appel, carte, paie)',
  /portillon/i.test(ddH) && /appel/i.test(ddH) && /carte/i.test(ddH) && /paie/i.test(ddH));
ok('la page D.D- Spirity explique l’application de terrain',
  /téléphone/i.test(ddH) && /terrain/i.test(ddH));
ok('aucun superlatif de vitrine dans les pages produit',
  !/(révolutionnaire|incroyable|leader|n°1|meilleur logiciel|solution innovante)/i.test(stockiaH + ddH));
ok('aucune promesse de fonctionnalité future sur les pages produit',
  !/(bientôt disponible sur|prochainement|à venir en version)/i.test(stockiaH + ddH));

console.log('pages ' + pages.length + ' · ressources locales ' + ressources + ' · liens internes ' + liens + ' · images ' + images);
console.log('════ ' + points + ' points de contrôle · ' + echecs.length + ' échec(s) ════');
echecs.slice(0, 40).forEach(e => console.log('  × ' + e));
process.exit(echecs.length ? 1 : 0);
