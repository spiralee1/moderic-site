# ModEric Software — le site officiel

**En ligne : https://spiralee1.github.io/moderic-site/**
Dépôt `spiralee1/moderic-site` (branche `main`, GitHub Pages).

Le site institutionnel de l'entreprise : ce qu'elle est, ce qu'elle croit, comment elle
travaille. Les logiciels ont leurs propres pages — ils ne sont pas le sujet de l'accueil.

---

## 1. La direction : « AZUR »

| | Rôle | Valeur |
|---|---|---|
| **Blanc** | couleur dominante — une matière de composition, pas un vide | `#FFFFFF` · nuage `#F5FAFD` |
| **Bleu ciel** | couleur identitaire, en gamme continue | `--azur` `#3FA0D8`, 50 → 900 (`#EDF6FC` → `#0A3E58`) |
| **Noir** | secondaire, uniquement pour le contraste | encre `#0C1A24`, texte `#16242E` |

- **Une seule ombre** pour toutes les plaques : très large, très douce, bleutée
  (`0 48px 110px -40px rgba(10,62,88,.30)`). C'est elle qui donne la profondeur.
- **Deux fontes** : *Instrument Serif* (les grandes phrases, italique pour ce qui engage) et
  *Instrument Sans* (la lecture). Aucune police technique, aucun 01/02/03.
- **Polices embarquées** : 3 sous-ensembles latins, 55 Ko au total, zéro requête externe.
- Plus de **92 % de la surface est claire** ; l'azur profond n'apparaît qu'à la porte de
  contact, une fois, comme une signature.

**Formes et mouvement** : halos d'azur flous qui respirent en parallaxe, anneaux d'azur qui
débordent des sections, sphère douce dans l'emplacement du film, grille à six colonnes à
peine visible, cadre du film incliné de 1,4° qui s'oriente sous le curseur. Tout est en
`transform`/`opacity`/`clip-path`, et **tout s'arrête** si le système demande moins
d'animation.

---

## 2. Les pages

| Page | Composition |
|---|---|
| **index.html** | **L'entrée** — le titre monumental, l'emplacement du film institutionnel dans son cadre incliné · **Notre identité** — accordéon de faits à gauche, deux colonnes de texte à droite · **Notre vision** — pleine page d'azur avec ses anneaux, une phrase monumentale en tête · **Notre approche** — six principes en deux colonnes, filets qui se tracent · **Notre univers technologique** — deux entrées discrètes vers les logiciels · **La porte** — contact en azur profond, avec l'heure de l'atelier |
| **stockia.html** | Entrée produit, vitrine, les écrans (3 emplacements prêts), le registre du commerce, configurations, téléchargements |
| **dd-spirity.html** | Entrée produit avec une vraie capture, 4 captures réelles, le registre de l'école, configurations, téléchargements |
| **contact.html** | Écrire, copier l'adresse (vraie fonction), ce qu'il faut nous dire, trois réponses, l'atelier |
| **mentions-legales.html** | Éditeur, hébergement, propriété, données personnelles, intégrité des fichiers |
| **404.html** | Page d'erreur dans la même langue |

**Navigation** : L'entreprise · Notre vision · Stockia · D.D- Spirity · Contact, plus un bouton
« Nous écrire ». Sur téléphone, menu plein écran en blanc, typographie large.

---

## 3. La vidéo institutionnelle

L'accueil réserve un **emplacement** pour votre film, dans un cadre blanc incliné. Il est
dessiné (dégradé, arcs, sphère) et **dit comme réservé** : aucune fausse vidéo d'entreprise
n'est fabriquée.

Pour l'intégrer, il suffit de déposer le fichier :

```
assets/video/institutionnel.mp4     ← votre film (H.264, 16 : 9, sans son conseillé)
```

Le script le détecte au chargement, crée la balise vidéo avec ses **commandes natives**, la
met en boucle (sauf si le système demande moins d'animation) et retire l'emplacement. Si le
fichier est absent ou illisible, la composition reste : **le site ne casse pas**.

---

## 4. Publier une version d'un logiciel

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

- `url` **vide** → bouton grisé « Bientôt disponible », pastille « Dépôt en cours » ;
- `url` **remplie** → bouton « Télécharger · 82,1 Mo », pastille bleue « Disponible · v3.4.2 »,
  empreinte SHA-256 affichée dessous (masquée tant qu'elle est vide).

Les deux états ont été vérifiés en exécution.

---

## 5. Remplacer les captures D.D- Spirity

Tout est dans `assets/medias/`, en deux tailles par vue (`-petit` pour les vignettes) :
`dd-accueil`, `dd-presence`, `dd-horaire`, `dd-calendrier`, `dd-carte`.
Une capture remplacée garde son nom : aucune page à modifier.

Pour Stockia : les trois emplacements sont dessinés dans `stockia.html` ; déposez vos captures
dans `assets/medias/` et remplacez les trois `<figure>` en attente par des `<figure class="capture">`
sur le modèle de `dd-spirity.html`.

---

## 6. Ajouter un troisième logiciel

1. dupliquer `stockia.html` → `kiosque.html`, réécrire le contenu (le gabarit est régulier) ;
2. une entrée dans `.barre__nav` et dans `.panneau` (gabarit : `assets/js`… non, dans le
   générateur `tmp/site_azur_lib.py`, fonction `barre()` — ou directement dans les pages) ;
3. une entrée dans la section **Notre univers technologique** de l'accueil ;
4. une clé dans `assets/js/telechargements.js` ;
5. une ligne dans `sitemap.xml`.

---

## 7. Vérifier avant de publier

```bash
node verifier-site.js
```

**311 points de contrôle, 0 échec**, dont :

- ressources présentes (161 références), liens et ancres (146), aucune ressource extérieure ;
- SEO et partage sur chaque page, JSON-LD valide, `alt` sur chaque image, titres sans saut ;
- téléchargements **tous** pilotés par la configuration (aucun `href="#"`, aucun `.exe` en dur) ;
- contenu lisible sans JavaScript ; polices embarquées ;
- **identité** : fond blanc posé en premier, bleu ciel identitaire, aucun fond sombre dominant,
  aucun faux numéro de section ;
- **accueil institutionnel** : l'entreprise vient avant les logiciels, les logiciels y tiennent
  en moins de six liens, l'emplacement du film est réservé et aucune vidéo n'est fabriquée.

Contrôles au navigateur (Chromium 1440 × 900, 390 × 844, 768, 1024, 1920) :
chargement **2,5 s**, 32 révélations sur 32 déclenchées, **0 débordement horizontal**,
aucune erreur JS.

---

## 8. Ce qui reste à vous

1. **Le film institutionnel** → `assets/video/institutionnel.mp4` (§3).
2. **Le domaine `mod-eric.com`** → l'acheter, puis *Settings → Pages → Custom domain* et le DNS.
   Ne déposez pas de fichier `CNAME` avant que le DNS réponde.
3. **Les mentions légales** : adresse complète, RCCM, responsable de publication — marqués
   « à compléter », jamais inventés.
4. **Téléphone / WhatsApp** : absent tant que le numéro n'est pas arrêté (le bloc est prêt dans
   `contact.html`).
5. **Les captures Stockia** : trois emplacements dessinés.
