/* ══════════════════════════════════════════════════════════════════════════════
   MODERIC SOFTWARE — les fichiers à télécharger, en un seul endroit
   ──────────────────────────────────────────────────────────────────────────────
   C'EST LE SEUL FICHIER À MODIFIER quand une version paraît. Les pages lisent ce
   tableau et s'affichent en conséquence :

     · url vide    → le bouton affiche « Bientôt disponible » (grisé, sans lien) ;
     · url remplie → le bouton « Télécharger · 82,1 Mo » apparaît, le ticket passe
                      au vert avec la version, et l'empreinte SHA-256 s'affiche.

   Trois règles de tenue, à respecter à chaque publication :
     1. déposez le fichier sur votre serveur (ex. /telechargements/…) ou dans une
        Release GitHub, puis écrivez l'adresse complète ici ;
     2. écrivez la taille ET le sha256 : c'est ce qui permet à un visiteur de
        vérifier que le fichier reçu est bien le vôtre — Windows :
        certutil -hashfile <fichier> SHA256 ;
     3. pour retirer une version, videz son url : le bouton repasse en « Bientôt
        disponible ». On n'efface pas la ligne, on la vide.
   ══════════════════════════════════════════════════════════════════════════════ */
window.MODERIC_TELECHARGEMENTS = {

  /* ───────────────────────────── STOCKIA ───────────────────────────── */
  stockia: {
    windows: {
      url: '',              // ex. 'https://mod-eric.com/telechargements/Stockia-Caisse-Setup-3.4.2.exe'
      version: '',          // ex. '3.4.2'
      taille: '',           // ex. '82,1 Mo'
      sha256: '',           // 64 caractères hexadécimaux
      secondaire: { url: '', libelle: 'Version sans installation' }
    },
    android: {
      url: '',
      version: '',
      taille: '',
      sha256: ''
    }
  },

  /* ──────────────────────────── D.D- SPIRITY ──────────────────────────── */
  ddSpirity: {
    windows: {
      url: '',
      version: '',
      taille: '',
      sha256: '',
      secondaire: { url: '', libelle: 'Version sans installation' }
    },
    html: {
      url: '',
      version: '',
      taille: '',
      sha256: ''
    },
    android: {
      url: '',
      version: '',
      taille: '',
      sha256: ''
    }
  }

  /* AJOUTER UN LOGICIEL : ajoutez une clé ici (ex. `kiosque: { windows: {…} }`), puis une
     page sur le modèle de stockia.html et une entrée dans la navigation. Rien d'autre :
     les boutons se nourrissent de ce fichier. */
};
