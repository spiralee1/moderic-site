/* ══════════════════════════════════════════════════════════════════════════════
   ModEric Software — les fichiers à télécharger, en un seul endroit
   ──────────────────────────────────────────────────────────────────────────────
   C'EST LE SEUL FICHIER À MODIFIER quand une version paraît. Les pages lisent
   ce tableau et s'affichent en conséquence :

     · url vide        → le bouton affiche « Bientôt disponible » (jamais un faux
                          bouton, jamais un lien mort) ;
     · url remplie     → le bouton « Télécharger » apparaît, avec la version,
                          la taille et le sha256 si vous les écrivez.

   Règles de tenue, à respecter à chaque publication :
     1. déposez le fichier sur votre serveur (ex. /telechargements/…) ou dans une
        Release GitHub, puis écrivez l'adresse complète ici ;
     2. mettez la taille ET le sha256 : c'est ce qui permet à un visiteur de
        vérifier que le fichier reçu est bien le vôtre (Windows : certutil
        -hashfile <fichier> SHA256) ;
     3. une version retirée ne disparaît pas du fichier : elle s'efface de url,
        et le bouton repasse en « Bientôt disponible ».
   ══════════════════════════════════════════════════════════════════════════════ */
window.MODERIC_TELECHARGEMENTS = {

  /* ───────────────────────────── STOCKIA ───────────────────────────── */
  stockia: {
    /* poste Windows (installateur et version sans installation) */
    windows: {
      url: '',                                 // ex. 'https://mod-eric.com/telechargements/Stockia-Caisse-Setup-3.4.2.exe'
      version: '',                             // ex. '3.4.2'
      taille: '',                              // ex. '78,3 Mo'
      sha256: '',                              // ex. 'b0caaa19…' (64 caractères)
      secondaire: { url: '', libelle: 'Version sans installation' }
    },
    /* téléphone Android */
    android: {
      url: '',
      version: '',
      taille: '',
      sha256: ''
    }
  },

  /* ──────────────────────────── D.D- SPIRITY ──────────────────────────── */
  ddSpirity: {
    /* poste Windows */
    windows: {
      url: '',
      version: '',
      taille: '',
      sha256: '',
      secondaire: { url: '', libelle: 'Version sans installation' }
    },
    /* poste en fichier HTML autonome (aucune installation) */
    html: {
      url: '',
      version: '',
      taille: '',
      sha256: ''
    },
    /* application de terrain Android */
    android: {
      url: '',
      version: '',
      taille: '',
      sha256: ''
    }
  }

  /* AJOUTER UN NOUVEAU LOGICIEL : ajoutez ici une clé (ex. `kiosque: { windows: {…} }`),
     puis une section dans logiciels.html et une page kiosque.html sur le modèle de
     stockia.html. Rien d'autre à modifier : la navigation, le catalogue et les
     boutons de téléchargement se nourrissent de ce fichier. */
};
