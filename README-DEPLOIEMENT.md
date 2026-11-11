# ModEric Software — le site

Site institutionnel et de téléchargement de **ModEric Software** : présentation de
l'entreprise, les deux logiciels (Stockia, D.D- Spirity), leurs pages produit, et les
téléchargements.

Rien à installer, rien à compiler : ce sont des fichiers statiques. Un serveur web suffit.
Le site fonctionne même ouvert depuis une clé USB.

---

## 1. Ce que contient le dossier

```
index.html              Le premier écran, le film, l'entreprise, les deux logiciels, la méthode, la philosophie
entreprise.html         Notre entreprise : identité, approche, vision, ce que nous ne faisons pas
logiciels.html          Le catalogue + les deux téléchargements mis en avant + comment se passe une installation
stockia.html            Page produit Stockia : description, avantages, aperçus, fiche technique, téléchargements
dd-spirity.html         Page produit D.D- Spirity : description, avantages, 5 aperçus, fiche technique, téléchargements
contact.html            Coordonnées + formulaire qui prépare un courriel (aucun serveur)
mentions-legales.html   Éditeur, hébergement, propriété intellectuelle, données personnelles
404.html                Page d'erreur
sitemap.xml, robots.txt, CNAME      Référencement et domaine
verifier-site.js        Le contrôle automatique du site (416 points)

assets/css/style.css    Toute la mise en forme (un seul fichier)
assets/js/site.js       Les interactions (entête, menu, apparitions, film, visionneuse, téléchargements)
assets/js/telechargements.js   ⚠️ LE fichier à modifier à chaque publication de logiciel
assets/fonts/*.woff2    La police Manrope (sous licence libre SIL OFL)
assets/img/             Logos, captures du poste D.D- Spirity, image de partage
assets/video/           Le film de présentation (entreprise.mp4) et son image d'attente
sources/film.html       La source du film, image par image (pour le refaire)
```

Total : **4 Mo**, dont 2 Mo pour le film. Aucune requête vers un domaine extérieur :
ni police, ni bibliothèque, ni traceur. Le site s'affiche donc même sur une connexion
lente ou coupée.

---

## 2. Publier le site

### Option A — GitHub Pages (gratuit, le plus rapide)

1. Créer un dépôt **public** (le site ne contient aucun code de vos logiciels) ;
2. y déposer tout le contenu de ce dossier à la racine, sur la branche `main` ;
3. *Settings → Pages → Source : Deploy from a branch → main / (root)* ;
4. le site est en ligne à `https://<compte>.github.io/<dépôt>/` en une à deux minutes.

Le fichier `CNAME` contient déjà `mod-eric.com` : quand le domaine sera acheté et son DNS
pointé (enregistrement `A` vers les quatre IP de GitHub Pages, ou `CNAME` vers
`<compte>.github.io`), GitHub servira le site sur le vrai domaine et le HTTPS se fera tout seul.

### Option B — un hébergement classique

Copier le dossier par FTP dans `public_html/` (ou `www/`). Aucune base de données, aucun PHP.
Pour un hébergement qui exige un fichier d'accueil, `index.html` est déjà là.

### À faire avant l'ouverture publique

- [ ] Compléter les lignes marquées « à compléter » dans `mentions-legales.html`
      (adresse exacte, RCCM / identification nationale, responsable de la publication) ;
- [ ] compléter la page `contact.html` : téléphone / WhatsApp et adresse, actuellement en
      commentaire HTML (à décommenter le jour où les numéros sont arrêtés) ;
- [ ] remplacer `contact@mod-eric.com` partout par l'adresse réellement créée
      (une recherche de ce texte dans les 8 pages suffit) ;
- [ ] déposer les fichiers des logiciels et remplir `assets/js/telechargements.js` (§4).

---

## 3. Remplacer le film

Le film du premier écran est **assets/video/entreprise.mp4** (17 s, 1600 × 900, 2 Mo, sans
parole). Il présente l'entreprise, les métiers, puis les deux logiciels.

Pour mettre **votre** film à la place :

1. exporter en MP4 (H.264, 16/9, 1280 × 720 ou 1600 × 900, sans son ou avec un son discret) ;
2. l'enregistrer sous `assets/video/entreprise.mp4` ;
3. extraire une image du film et l'enregistrer sous `assets/video/poster.jpg`
   (c'est l'image affichée avant la lecture) ;
4. si la durée change, mettre à jour le texte « Film de présentation · 17 s » et
   `0:00 / 0:17` dans `index.html`.

Pour **refaire le film actuel** : `sources/film.html` est la source (une seule fonction
`renderAll(t)` place l'image à l'instant `t`). Un rendu image par image puis `ffmpeg` la
transforme en MP4 — la méthode utilisée est décrite dans l'en-tête du fichier.

Si aucune vidéo n'est disponible, le site reste correct : l'image d'attente s'affiche, et le
texte du premier écran raconte la même chose.

---

## 4. Publier un nouveau logiciel (ou une nouvelle version)

**Un seul fichier par version** : `assets/js/telechargements.js`.

```js
ddSpirity: {
  windows: {
    url: 'https://mod-eric.com/telechargements/DD-Spirity-Poste-Setup-1.7.0.exe',
    version: '1.7.0',
    taille: '78,3 Mo',
    sha256: 'b0caaa1925f48982…',        // certutil -hashfile <fichier> SHA256
    secondaire: { url: '…zip', libelle: 'Version sans installation' }
  },
  …
}
```

- `url` **vide** → le bouton affiche « Bientôt disponible » (grisé, sans lien). Il n'y a donc
  jamais de faux bouton de téléchargement sur le site ;
- `url` **remplie** → le bouton « Télécharger · 78,3 Mo » apparaît, avec la version et
  l'empreinte publiées à côté ;
- on n'efface jamais une version du fichier sans raison : on vide son `url`, et le bouton
  repasse en « Bientôt disponible ».

Pour **ajouter un troisième logiciel** :

1. dupliquer `stockia.html` sous un nouveau nom (ex. `kiosque.html`) et réécrire le contenu ;
2. ajouter une ligne dans `logiciels.html` (modèle du catalogue) et une section dans
   `index.html` si c'est un produit phare ;
3. ajouter la clé dans `assets/js/telechargements.js` ;
4. ajouter la page au `sitemap.xml` et aux liens du pied de page.

Rien d'autre : la mise en forme, les boutons, les aperçus et les empreintes viennent des mêmes
briques.

---

## 5. Remplacer les captures

Les aperçus sont dans `assets/img/` :

| Fichier | Ce qu'il montre | Où |
|---|---|---|
| `dd-accueil.jpg` | le tableau du jour du poste D.D- Spirity | accueil + page D.D- Spirity |
| `dd-presence.jpg` | l'appel d'une classe | page D.D- Spirity |
| `dd-horaire.jpg` | les horaires et les conflits | page D.D- Spirity |
| `dd-calendrier.jpg` | le calendrier de l'année | page D.D- Spirity |
| `dd-carte.jpg` | une carte d'élève imprimée | accueil + page D.D- Spirity |
| `apercu-a-venir.svg` | l'emplacement en attente | page Stockia (à remplacer par de vraies captures) |
| `og.jpg` | l'image des partages (WhatsApp, réseaux) | toutes les pages |

Format pratique : 1600 × 900 (JPEG, qualité 86), ce qui suffit pour un écran et pour
l'agrandissement au clic. Une capture remplacée garde le même nom : aucune page à modifier.

Pour Stockia : déposez les captures dans `assets/img/`, puis remplacez dans `stockia.html`
les trois `<img src="assets/img/apercu-a-venir.svg" …>` par vos fichiers.

---

## 6. Vérifier le site avant de publier

```bash
node verifier-site.js
```

Le contrôle examine les fichiers réels et répond sur **416 points** :

1. chaque ressource référencée existe (249 références) ;
2. chaque lien interne et chaque ancre mène quelque part (226 liens) ;
3. le site ne charge **rien** d'un domaine extérieur ;
4. chaque page a titre, description, canonical, image de partage, viewport, langue ;
5. les données structurées (JSON-LD) sont du JSON valide ;
6. chaque image a un `alt` ;
7. la hiérarchie des titres est propre (un seul `h1`, pas de saut de niveau) ;
8. les téléchargements passent **tous** par le fichier de configuration (aucun `href="#"`,
   aucun `.exe` écrit à la main) ;
9. le contenu utile est présent dans le HTML même sans JavaScript.

À lancer après chaque modification de page. Code de sortie 1 s'il y a un échec : utilisable
tel quel dans une vérification automatique.

---

## 7. Choix techniques, et pourquoi

- **Aucune dépendance** : ni framework, ni CDN, ni police distante. Le site s'ouvre en
  double-clic sur un poste hors ligne, et ne casse pas quand un service extérieur change.
- **Un seul fichier CSS, un seul fichier JS** : deux requêtes, un cache simple, et une
  identité visuelle qui ne se disperse pas.
- **Polices embarquées** (Manrope, SIL OFL) : la typographie est la même partout, y compris
  sur un poste sans Internet, avec un sous-ensemble latin de 12 Ko par graisse.
- **Images décrites, visionneuse au clavier** (Échap, flèches), **respect de
  `prefers-reduced-motion`** : si le système demande moins d'animation, tout arrive sans
  mouvement.
- **Formulaire sans serveur** : il compose un courriel, la page le dit, et rien n'est collecté.
  C'est écrit dans les mentions légales aussi.
- **Le mouvement est une seule courbe** (`--sortie`) pour tout le site : c'est ce qui donne
  l'impression de cohérence plutôt qu'une collection d'effets.

---

## 8. Conventions d'écriture

- Français, vouvoiement, phrases courtes ; pas de superlatifs vides.
- On ne promet jamais une fonctionnalité non vérifiée, on n'invente jamais un prix, un taux
  ou un numéro d'immatriculation : la page dit « à compléter » quand l'information manque.
- Les deux logiciels sont décrits **tels qu'ils fonctionnent** ; leurs pages sont faites pour
  recevoir une description plus longue, de nouvelles captures et une nouvelle version sans
  refonte.
