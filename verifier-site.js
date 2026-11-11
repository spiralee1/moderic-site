#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   site/verifier-site.js — le site est-il vraiment utilisable tel qu'il est ?
   ──────────────────────────────────────────────────────────────────────────
   Neuf familles de contrôles, exécutés sur les fichiers réels du site :

     1. chaque page référence-t-elle des fichiers QUI EXISTENT (css, js, img, vidéo) ?
     2. chaque lien interne mène-t-il à une page existante (et chaque ancre à un id réel) ?
     3. le site charge-t-il quelque chose d'un domaine extérieur ? (doit être : non)
     4. chaque page a-t-elle titre, description, canonical, og:image, viewport ?
     5. le JSON-LD se lit-il comme du JSON valide ?
     6. chaque <img> a-t-il un alt (les images décoratives, un alt vide) ?
     7. les titres suivent-ils une hiérarchie (un seul h1, pas de saut h2 → h4) ?
     8. les boutons de téléchargement sont-ils TOUS pilotés par le fichier de
        configuration (aucun faux bouton en dur, aucun href="#") ?
     9. la page est-elle utilisable sans JavaScript (contenu présent dans le HTML) ?

   Sortie : « NN points de contrôle · 0 échec(s) », code de sortie 1 sinon.
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs'), path = require('path');
const SITE = __dirname;

let points = 0; const echecs = [];
function ok(nom, cond, detail) { points++; if (!cond) echecs.push(nom + (detail ? ' — ' + detail : '')); }

const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html')).sort();
ok('le site contient des pages HTML (' + pages.length + ')', pages.length >= 7, pages.join(', '));

const lire = f => fs.readFileSync(path.join(SITE, f), 'utf8');
const existe = p => fs.existsSync(path.join(SITE, p.replace(/^\.\//, '')));

/* ── 1. ressources référencées ── */
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
ok('besoin de ressources locales (' + ressources + ' références vérifiées)', ressources > 20);

/* ── 2. liens internes et ancres ── */
const idsParPage = {};
pages.forEach(f => { idsParPage[f] = new Set([...lire(f).matchAll(/id\s*=\s*"([^"]+)"/g)].map(m => m[1])); });
let liens = 0;
pages.forEach(f => {
  const html = lire(f);
  const hrefs = [...html.matchAll(/href\s*=\s*"([^"]+)"/g)].map(m => m[1]);
  hrefs.filter(h => !/^(https?:|mailto:|tel:|javascript:|data:)/.test(h)).forEach(h => {
    liens++;
    const [cible, ancre] = h.split('#');
    if (cible && !existe(cible)) return ok('lien interne valide : ' + h + ' (' + f + ')', false, 'page absente');
    if (ancre) {
      const fichier = cible || f;
      const bons = idsParPage[fichier] || new Set();
      ok('ancre valide : ' + h + ' (' + f + ')', bons.has(ancre), 'id « ' + ancre + ' » introuvable dans ' + fichier);
    }
  });
});
ok('le site se visite entièrement (' + liens + ' liens internes)', liens > 40);

/* ── 3. aucune ressource extérieure (le site doit vivre sans réseau) ── */
pages.forEach(f => {
  const html = lire(f);
  const externes = [...html.matchAll(/(?:src|href)\s*=\s*"(https?:\/\/[^"]+)"/g)]
    .map(m => m[1]).filter(u => !/mod-eric\.com/.test(u));
  ok('aucune ressource chargée depuis un domaine extérieur (' + f + ')', externes.length === 0, externes.join(', '));
});
const css = lire('assets/css/style.css');
ok('la feuille de style ne charge aucune police extérieure',
  !/@import|fonts\.googleapis|fonts\.gstatic/.test(css));
ok('aucun script tiers dans les scripts du site',
  !/(google-analytics|googletagmanager|facebook|hotjar|cdn\.)/i.test(lire('assets/js/site.js')));

/* ── 4. les balises que les moteurs et les partages lisent ── */
pages.filter(f => f !== '404.html').forEach(f => {
  const html = lire(f);
  ok('titre <title> présent (' + f + ')', /<title>[^<]{12,}<\/title>/.test(html));
  ok('description présente (' + f + ')', /name="description" content="[^"]{40,}"/.test(html));
  ok('lien canonique (' + f + ')', /rel="canonical" href="https:\/\/mod-eric\.com\//.test(html));
  ok('image de partage og:image (' + f + ')', /property="og:image"/.test(html));
  ok('viewport mobile (' + f + ')', /name="viewport" content="width=device-width/.test(html));
  ok('langue déclarée (' + f + ')', /<html lang="fr"/.test(html));
});

/* ── 5. les données structurées ── */
pages.forEach(f => {
  const html = lire(f);
  const blocs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
  blocs.forEach((b, i) => {
    let bon = true, err = '';
    try { const o = JSON.parse(b); bon = !!o['@context'] && !!o['@type']; err = bon ? '' : 'sans @context/@type'; }
    catch (e) { bon = false; err = e.message; }
    ok('JSON-LD valide (' + f + ' #' + (i + 1) + ')', bon, err);
  });
});
ok('l’accueil porte les données structurées de l’entreprise',
  /"@type": "Organization"/.test(lire('index.html')));
ok('chaque page de logiciel porte son SoftwareApplication',
  /"@type": "SoftwareApplication"/.test(lire('stockia.html')) && /"@type": "SoftwareApplication"/.test(lire('dd-spirity.html')));

/* ── 6. images et équivalents textuels ── */
let images = 0;
pages.forEach(f => {
  const html = lire(f);
  [...html.matchAll(/<img\b[^>]*>/g)].forEach(m => {
    images++;
    const balise = m[0];
    ok('image avec attribut alt (' + f + ')', /\balt\s*=/.test(balise), balise.slice(0, 70));
    ok('image avec source (' + f + ')', /\bsrc\s*=\s*"[^"]+"/.test(balise), balise.slice(0, 70));
  });
});
ok('les images sont décrites (' + images + ' balises <img>)', images > 5);

/* ── 7. hiérarchie des titres ── */
pages.forEach(f => {
  const html = lire(f);
  const niveaux = [...html.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
  ok('un seul h1 par page (' + f + ')', niveaux.filter(n => n === 1).length === 1,
    'h1 : ' + niveaux.filter(n => n === 1).length);
  let saut = null;
  for (let i = 1; i < niveaux.length; i++) if (niveaux[i] - niveaux[i - 1] > 1) saut = 'h' + niveaux[i - 1] + ' → h' + niveaux[i];
  ok('aucun saut de niveau de titre (' + f + ')', !saut, saut || '');
});

/* ── 8. les téléchargements passent par le fichier de configuration ── */
const config = lire('assets/js/telechargements.js');
['stockia', 'ddSpirity'].forEach(k =>
  ok('le fichier de téléchargement déclare « ' + k + ' »', new RegExp('\\b' + k + '\\s*:').test(config)));
const telechargementsPages = pages.filter(f => /data-telechargement=/.test(lire(f)));
ok('les blocs de téléchargement existent (' + telechargementsPages.length + ' pages)', telechargementsPages.length >= 3);
let blocs = 0, faux = 0;
pages.forEach(f => {
  const html = lire(f);
  [...html.matchAll(/data-telechargement="([^"]+)"/g)].forEach(m => {
    blocs++;
    const [produit, plateforme] = m[1].split(':');
    const bloc = config.slice(config.indexOf(produit + ':'));
    if (!new RegExp(plateforme + '\\s*:').test(bloc)) { faux++; echecs.push('plateforme inconnue : ' + m[1] + ' (' + f + ')'); }
  });
});
ok('chaque bloc renvoie à une clé connue du fichier (' + blocs + ' blocs)', faux === 0, faux + ' inconnu(s)');
ok('aucun bouton de téléchargement en dur (href="#") dans les pages',
  !pages.some(f => /href="#"[^>]*>\s*Télécharger/i.test(lire(f))));
ok('aucun lien « .exe » écrit à la main dans les pages',
  !pages.some(f => /href="[^"]*\.(exe|apk|zip|msi)"/i.test(lire(f))));

/* ── 9. lisible sans JavaScript ── */
pages.filter(f => f !== '404.html').forEach(f => {
  const html = lire(f);
  const texte = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const mots = texte.split(/\s+/).filter(w => w.length > 2).length;
  ok('du texte utile dans le HTML, sans JavaScript (' + f + ' : ' + mots + ' mots)', mots > 120);
});
ok('le formulaire de contact dit qu’il prépare un courriel',
  /compose un courriel|courriel dans votre logiciel de messagerie/i.test(lire('contact.html')));
ok('les mentions légales ne fabriquent pas de numéro d’immatriculation',
  /à compléter par l'éditeur/.test(lire('mentions-legales.html')));

/* ── 10. le film et ses commandes ── */
const accueil = lire('index.html');
ok('le premier écran porte une balise <video>', /<video\b[^>]*poster=/.test(accueil));
ok('le film a une solution de repli (texte si la vidéo ne se lit pas)', /ne lit pas la vidéo MP4/.test(accueil));
ok('le film porte ses commandes (son, reprise)', /data-film="son"/.test(accueil) && /data-film="reprise"/.test(accueil));
ok('le film est chargé en métadonnées seulement (pas 2 Mo au premier écran)', /preload="metadata"/.test(accueil));

console.log('pages ' + pages.length + ' · ressources locales ' + ressources + ' · liens internes ' + liens + ' · images ' + images);
console.log('════ ' + points + ' points de contrôle · ' + echecs.length + ' échec(s) ════');
echecs.slice(0, 40).forEach(e => console.log('  × ' + e));
process.exit(echecs.length ? 1 : 0);
