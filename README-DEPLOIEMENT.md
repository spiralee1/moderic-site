# ModEric Software — le site

Site institutionnel de **ModEric Software** : l'entreprise, ses deux logiciels (Stockia,
D.D- Spirity), leurs dossiers produit, et les téléchargements.

**En ligne :** https://spiralee1.github.io/moderic-site/
**Dépôt :** `spiralee1/moderic-site` (branche `main`, GitHub Pages)
**Poids :** 4,4 Mo dont 0,76 Mo de film — 2 requêtes CSS/JS, 4 fichiers de police.

---

## 1. La direction artistique, en une page

Le site s'appelle **REGISTRE**. L'idée : un éditeur de logiciels se doit de documenter son
travail comme il documente ses programmes — avec des registres, des filets, des marges, une
typographie d'imprimerie et une encre de contrôle.

**Trois matières, et rien d'autre**

| | Rôle | Valeur |
|---|---|---|
| `--os` | le papier : le monde institutionnel, la lecture | `#EFE9DC` |
| `--encre` | le noir franc : le monde des machines et des interfaces | `#0D0D0F` |
| `--signal` | le vermillon : une encre de **contrôle**, jamais décorative — elle pointe, souligne, signale un état | `#E23A16` |

**Deux voix, jamais trois**

- **Instrument Serif** — la voix éditoriale : monumentale, italique pour les phrases qui
  engagent (« *qui tiennent debout.* », « *là où le travail se fait.* »).
- **Instrument Sans** — la lecture : neutre, précise.
- **JetBrains Mono** — les étiquettes techniques. Elle remplace les faux numéros de section
  par de l'information réelle : `ATELIER OUVERT · HORS LIGNE`, `4° 20′ S — 15° 18′ E`,
  `FILM EN LECTURE`, `DÉPÔT EN COURS`. **Aucun 01 / 02 / 03 sur ce site.**

Les quatre fichiers de police sont des sous-ensembles latins embarqués (14 à 21 Ko chacun,
74 Ko au total) : aucune requête vers Google, aucune dépendance.

**Ce qui n'existe pas ici, volontairement :** titres de section numérotés, trois cartes
alignées, badges, chiffres inventés, témoignages, animations gratuites, dégradés violets.

---

## 2. Les pages

| Page | Composition |
|---|---|
| `index.html` | **L'entrée** : le film en plein écran, le titre monumental posé dessus, l'index des deux logiciels en bas à droite (cliquable) — **Le manifeste** — une **bande** de mots qui défile — **le chapitre Stockia** (plaque de la caisse, fiche technique, registre des métiers) — **le parcours D.D- Spirity** (scène collante : l'étape lue change l'image) + la carte d'élève posée en travers — **ce que nous refusons** (les mots barrés au défilement) — **la sortie** (contact) |
| `stockia.html` | Le dossier : entrée monumentale, le logiciel, les écrans (3 emplacements en attente, dessinés et légendés), le registre des fonctions, le téléchargement, la suite |
| `dd-spirity.html` | Le dossier : entrée monumentale **sur une vraie capture**, 4 captures réelles en pleine largeur, le registre des fonctions, le téléchargement |
| `contact.html` | Écrire, copier l'adresse (vraie fonction), ce qu'il faut nous dire, trois réponses, l'atelier |
| `mentions-legales.html` | Éditeur, hébergement, propriété, données personnelles, intégrité des fichiers |
| `404.html` | Page d'erreur dans la même langue graphique |

**Navigation :** Accueil · Les logiciels · Stockia · D.D- Spirity · Contact, plus un bouton
« Nous écrire ». La barre prend son fond au défilement, un volet d'encre balaie l'écran
entre les pages, et un menu plein écran (typographie monumentale) remplace tout sur téléphone.

---

## 3. Le mouvement — ce qui bouge, et pourquoi

| Effet | Où | Pourquoi |
|---|---|---|
| Le film se lit en boucle, sans son, dès l'arrivée | Entrée | il raconte l'entreprise sans un mot à lire |
| Le titre se démasque (clip-path) | Entrée, dossiers | l'entrée en matière |
| Une cascade d'apparitions par section | partout | hiérarchie de lecture |
| **La scène collante** : l'étape la plus proche du milieu de l'écran change l'image | Parcours D.D- Spirity | lire le logiciel en le regardant |
| Les mots de la liste « ce que nous refusons » se barrent | Accueil | un refus doit se voir |
| Un volet d'encre entre les pages | tous les liens internes | la continuité, pas le rechargement |
| Le curseur : un point + un anneau qui s'ouvre sur les images | ordinateur | dit ce qui est cliquable |
| Une jauge de 2 px en haut | partout | savoir où on en est dans la page |

Tout est en `transform` / `opacity` / `clip-path`, piloté par `requestAnimationFrame`, et
**`prefers-reduced-motion` coupe tout** (y compris le volet et le curseur).

---

## 4. Remplacer le film

Le film est **assets/video/entreprise.mp4** : 17 s, 1280 × 720, 0,76 Mo, sans parole, en
boucle. Il présente la marque, l'entreprise, les trois métiers et les deux logiciels.

1. exporter en MP4 (H.264, 16/9, 1280 × 720 ou 1600 × 900) ;
2. écraser `assets/video/entreprise.mp4` ;
3. extraire une image et l'écraser sur `assets/video/poster.jpg` (l'image d'attente) ;
4. si la durée change, mettre à jour `Boucle · 17 s · sans parole` dans `index.html`.

S'il n'y a pas de vidéo : l'image d'attente tient le premier écran, le texte raconte la même
chose, et les boutons lecture/son restent sans effet visible — **c'est le seul endroit du
site où un bouton peut ne rien faire**, et c'est pour cela que le film est livré avec le site.

---

## 5. Publier une version d'un logiciel

**Un seul fichier :** `assets/js/telechargements.js`.

```js
stockia: {
  windows: {
    url: 'https://mod-eric.com/telechargements/Stockia-Caisse-Setup-3.4.2.exe',
    version: '3.4.2',
    taille: '82,1 Mo',
    sha256: 'e655bb142b235fea…',        // certutil -hashfile <fichier> SHA256
    secondaire: { url: '…zip', libelle: 'Version sans installation' }
  }
}
```

- `url` **vide** → bouton grisé « Bientôt disponible », ticket « Dépôt en cours » ;
- `url` **remplie** → bouton « Télécharger · 82,1 Mo », ticket vert « Disponible · v3.4.2 »,
  empreinte SHA-256 affichée dessous (elle se masque tant qu'elle est vide).

Les deux états ont été vérifiés en exécution (voir §8).

---

## 6. Remplacer les captures

Tout est dans `assets/medias/`, en deux tailles par vue (2400 px et 1200 px de large) :

| Fichier | Ce qu'il montre |
|---|---|
| `dd-accueil` | le tableau du jour du poste |
| `dd-presence` | l'appel d'une classe |
| `dd-horaire` | les horaires et les conflits |
| `dd-calendrier` | le calendrier de l'année |
| `dd-carte` | une carte d'élève imprimée |

Une capture remplacée garde son nom : aucune page à modifier. Pour Stockia, la page affiche
trois emplacements dessinés (`planche--attente`) : déposez les fichiers et remplacez les trois
`<div class="planche planche--attente">` par des `<figure class="vue">` sur le modèle de
`dd-spirity.html`.

---

## 7. Ajouter un troisième logiciel

1. dupliquer `stockia.html` → `kiosque.html`, réécrire le contenu (le gabarit est régulier) ;
2. une entrée dans la barre de navigation et dans le menu (`tete__nav`, `.panneau`) ;
3. un chapitre sur l'accueil (`<section class="chapitre">`) et une entrée dans l'index des
   logiciels de l'entrée ;
4. une clé dans `assets/js/telechargements.js` ;
5. une ligne dans `sitemap.xml`.

---

## 8. Vérifier avant de publier

```bash
node verifier-site.js
```

**278 points de contrôle, 0 échec** : ressources présentes (154 références), liens et ancres
(132), aucune ressource extérieure, balises SEO et de partage, JSON-LD valide, `alt` sur
chaque image, hiérarchie des titres, téléchargements pilotés par la configuration, contenu
lisible sans JavaScript, polices embarquées, film et ses commandes.

Contrôles faits au navigateur (Chromium, 1440 × 900 et 390 × 844) :

- lecture du film au chargement (`muted`, `loop`, 1280 × 720) ✔
- la scène collante change bien d'image le long du récit (0 → 1 → 2) ✔
- les deux états de téléchargement (vide / rempli) rendus correctement ✔
- 0 débordement horizontal à 390, 768, 1024 et 1920 px ✔
- menu plein écran, boutons de la barre, horloge de l'atelier ✔

---

## 9. Ce qui reste à compléter (décisions de l'éditeur)

1. **Domaine `mod-eric.com`** : l'acheter, puis *Settings → Pages → Custom domain* et le DNS
   chez le registraire. Ne déposez pas de fichier `CNAME` à la main avant que le DNS réponde :
   GitHub redirigerait tout le site vers un domaine qui ne répond pas encore.
2. **Mentions légales** : adresse complète, RCCM / identification nationale, responsable de la
   publication — marqués « à compléter » (jamais inventés).
3. **Téléphone / WhatsApp** : absent du site tant que le numéro n'est pas arrêté ; le bloc est
   prêt dans `contact.html`.
4. **`contact@mod-eric.com`** : l'adresse est utilisée partout, elle doit exister.
5. **Captures Stockia** : trois emplacements en attente.

## 10. Idées d'animation non faites (et pourquoi)

- **WebGL / shaders** : inutile ici, et lourd sur les machines modestes de nos écoles.
- **Défilement horizontal forcé** : spectaculaire, mais il casse l'accessibilité au clavier et
  sur téléphone.
- **Curseur qui suit les images** : nous gardons un anneau qui s'ouvre — plus lisible.

Chacune reste possible : l'architecture (un fichier CSS, un fichier JS, un gabarit de page)
est faite pour en accueillir une sans toucher au reste.
