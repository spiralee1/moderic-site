# ModEric Software — le site officiel

**En ligne : https://spiralee1.github.io/moderic-site/**
Dépôt `spiralee1/moderic-site` (branche `main`, GitHub Pages).

Le site institutionnel de l'entreprise. Les logiciels ont leurs propres pages.

---

## 1. Les coordonnées officielles (à ne jamais changer sans tout mettre à jour)

| | |
|---|---|
| **Courriel** | `info.elysafly@gmail.com` |
| **WhatsApp** | `+243 983 009 563` → lien `https://wa.me/243983009563` |
| **Adresse** | Kinshasa, République démocratique du Congo |
| **Pied de page** | © ModEric Software |

Elles apparaissent dans : la barre (bouton), le menu de téléphone, la page contact, les
mentions légales, le pied de page et les données structurées (JSON-LD).

---

## 1 bis. Les pages du site, et ce qu'elles portent

| Page | Ce qu'elle dit | Images |
|---|---|---|
| `index.html` | l'entreprise : entrée, qui nous sommes, vision, philosophie, **nos créations (3)**, technologie, contact | `maquette-stockia-petit` + `maquette-terrain-petit` + `android-accueil` |
| `stockia.html` | le terminal de vente POS pour pharmacies | `maquette-stockia` (comptoir complet), 6 captures (caisse, stock, accueil, histoires, patients, réglages), 2 dessins de périphériques (SVG) |
| `dd-spirity.html` | le poste Windows du Directeur de Discipline | `maquette-dd` (bureau de direction), 6 captures (tableau du jour, appel, horaires, indicateurs, échanges, carte), un bloc « Et le téléphone » |
| **`dd-spirity-terrain.html`** | **Spirity Terrain, l'application Android** — la page dédiée : deux plateformes, une journée, les six écrans, l'échange, le téléchargement | `maquette-terrain` (téléphone sur le bureau), 6 captures du téléphone |

**Spirity Terrain** est le nom de la version Android de D.D- Spirity. Elle a sa page parce qu'elle
a ses gestes, son public et son mode d'installation : le D.D. doit comprendre qu'il installe **le
poste puis l'application** — les deux vont ensemble, et l'application seule ne contient rien.

### Les périphériques, expliqués là où ils comptent

`stockia.html` porte une section **« La douchette et l'imprimante ne sont pas des accessoires »** :
deux dessins au trait (SVG, aucun fichier image) et, pour chacun, ce qu'il change au comptoir, ce
qu'il faut acheter, et ce qui reste possible sans lui (PDF, caméra du téléphone). Une section
**« Windows ou Android »** dit qu'une officine peut choisir l'un ou l'autre — même catalogue, mêmes
prix, mêmes tickets.

---

## 2. La direction : « AZUR »

| | Rôle | Valeur |
|---|---|---|
| **Blanc** | la respiration | `#FFFFFF`, nuage `#F5FAFD` |
| **Bleu ciel** | couleur identitaire | `--azur` `#3FA0D8`, gamme 50 → 900 |
| **Noir** | contraste seulement | encre `#0C1A24` |

- **Deux fontes** : Instrument Serif (les phrases-phares, italique pour ce qui engage) et
  Instrument Sans (la lecture). Embarquées : 55 Ko, aucune requête externe.
- **Aucune numérotation** nulle part : ni 01/02/03, ni liste numérotée. Le client y tient.
- **Toutes les sections de texte sont posées sur des bandes d'azur** (`.bande--1` à
  `.bande--4`), avec de petits décors dessinés en CSS : deux ou trois arcs, un halo, une trame
  de points à 4 %. Aucune image de fond, donc rien à télécharger.

---

## 3. Les textes — d'où ils viennent

Le contenu a été **fourni par le client** (séance du 12/11). Structure retenue, telle quelle :

1. **Accueil** — « Un logiciel ne vaut rien s'il ne change rien. »
2. **Qui sommes-nous ?** — « Derrière chaque logiciel, une idée qui mérite d'exister. »
3. **Notre vision** — « Imaginer au-delà de l'existant. »
4. **Notre philosophie** — « La qualité se construit dans les détails. » — quatre principes
   (réflexion, conception, précision, évolution) **sans numéros**.
5. **Nos créations** — « Des idées transformées en outils concrets. » (Stockia, D.D- Spirity)
6. **Notre rapport à la technologie** — « La technologie n'est pas une fin. C'est un moyen. »
7. **Contact** — « Une idée commence quelque part. » (bouton « Entrer en contact »)
8. **Pied de page**

Chaque section porte un **titre-phare** (`.phare`) : un filet d'azur, une étiquette, une phrase
en serif avec une seconde moitié en italique bleu. C'est le rythme du site.

---

## 4. Publier une version d'un logiciel

**Un seul fichier :** `assets/js/telechargements.js`.

```js
stockia: {
  windows: {
    url: '…/Stockia-Caisse-Setup-3.4.2.exe',
    version: '3.4.2',
    taille: '82,1 Mo',
    sha256: 'e655bb142b235fea…',      // certutil -hashfile <fichier> SHA256
    secondaire: { url: '…zip', libelle: 'Version sans installation' }
  }
}
```

- `url` **vide** → bouton grisé « Bientôt disponible », pastille « Dépôt en cours » ;
- `url` **remplie** → bouton « Télécharger · 82,1 Mo », pastille bleue avec la version,
  empreinte SHA-256 affichée dessous.

Les deux états ont été vérifiés en exécution.

---

## 5. Le film institutionnel

L'accueil réserve un emplacement dessiné dans un cadre blanc incliné (aucune fausse vidéo).

Pour l'activer : déposer **`assets/video/institutionnel.mp4`** (H.264, 16:9). Le script le
détecte au chargement, crée la vidéo avec ses commandes natives, la met en boucle et retire
l'emplacement. Absent : la composition reste, le site ne casse pas.

---

## 5 bis. Les MAQUETTES produit (séance du 12/11)

Deux maquettes sont générées, pas photographiées : elles sont rendues par un vrai Chrome
(`/home/user/tmp/maquettes.py`) puis aplaties en JPEG.

| Fichier | Ce qu'elle montre |
|---|---|
| `assets/medias/maquette-stockia.jpg` | Stockia dans un **iMac vu de trois quarts**, sur un bureau clair, avec une **douchette USB sur son support** à côté |
| `assets/medias/maquette-dd.jpg` | D.D- Spirity dans une **fenêtre macOS** (trois feux, barre de titre), avec le tableau du jour et **le rail replié** |

Le texte des pages produit suit un ordre voulu : **le problème d'abord** (ce qui coûte du temps
au comptoir / au bureau), **puis la réponse du logiciel**, geste par geste. Stockia est présenté
comme le **terminal de vente des pharmacies** (Windows et Android) — les autres fonctions sont
annoncées comme venant **avec** lui, pas comme la raison d'acheter.

Les captures ne sont plus une liste d'images nues : chacune est posée dans une **fenêtre de
bureau** (`.fenetre-mac`, barre de titre + trois feux + légende).

## 6. Remplacer les captures

`assets/medias/`, deux tailles par vue (`-petit` pour les vignettes) :
`dd-accueil`, `dd-presence`, `dd-horaire`, `dd-calendrier`, `dd-carte`,
`stockia-caisse`, `stockia-stock`, `stockia-rayon`, `stockia-patients`,
`stockia-histoires`, `stockia-reglages`.
Même nom, même cadrage : aucune page à modifier.

---

## 7. Vérifier avant de publier

```bash
node verifier-site.js
```

**344 points de contrôle, 0 échec** : ressources présentes, liens et ancres, aucune ressource
extérieure (les liens `wa.me` et `mailto:` sont des contacts, pas des chargements), SEO et
partage, JSON-LD, `alt`, hiérarchie des titres, téléchargements pilotés par la configuration,
lisibilité sans JavaScript, polices embarquées, **identité** (fond clair, bleu ciel
identitaire, aucune numérotation) et **caractère institutionnel** de l'accueil.

Contrôles au navigateur : 0 débordement à **390 / 768 / 1024 / 1920** sur les six pages,
toutes les images chargent, aucune erreur JavaScript.

---

## 8. Ce qui reste à vous

1. **Le film institutionnel** → `assets/video/institutionnel.mp4`.
2. **Le domaine `mod-eric.com`** (achat + DNS + *Settings → Pages*). Ne pas déposer de `CNAME`
   avant que le DNS réponde.
3. **Les mentions légales** : adresse postale complète, RCCM, responsable de publication —
   marqués « à compléter », jamais inventés.
4. **Les captures Stockia** : trois emplacements dessinés dans la section « Les écrans ».
5. **Les conditions de licence** des deux logiciels.
