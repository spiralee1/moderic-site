/* ══════════════════════════════════════════════════════════════════════════════
   ModEric Software — interactions du site
   ──────────────────────────────────────────────────────────────────────────────
   Cinq choses, et rien d'autre. Aucune bibliothèque, aucun script tiers.

     1. l'entête se pose au défilement (et se retire quand on remonte) ;
     2. le menu de téléphone (ouvert au clic, fermé au clavier) ;
     3. les apparitions au défilement — une IntersectionObserver, pas un
        écouteur de scroll par élément ;
     4. le film du premier écran : lecture, son, reprise, barre de temps ;
     5. la visionneuse des captures, et les boutons de téléchargement qui
        lisent assets/js/telechargements.js (jamais de faux bouton).

   Tout est écrit pour être lu : si une page n'a pas de film ou pas de
   galerie, le code correspondant ne s'exécute simplement pas.
   ══════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ───────────────────────── 1. l'entête ───────────────────────── */
  var entete = $('.entete');
  var dernier = 0;
  function poserEntete() {
    if (!entete) return;
    var y = window.scrollY || window.pageYOffset;
    entete.classList.toggle('entete--pose', y > 40);
    /* on ne cache jamais l'entête : un site institutionnel doit toujours
       laisser une porte de sortie. Seule la taille et le fond changent. */
    dernier = y;
  }
  window.addEventListener('scroll', poserEntete, { passive: true });
  poserEntete();

  /* ───────────────────────── 2. le menu de téléphone ───────────────────────── */
  var burger = $('.burger');
  if (burger) {
    var basculer = function (ouvrir) {
      var etat = ouvrir !== undefined ? ouvrir : !document.body.classList.contains('menu-ouvert');
      document.body.classList.toggle('menu-ouvert', etat);
      burger.setAttribute('aria-expanded', etat ? 'true' : 'false');
      document.documentElement.style.overflow = etat ? 'hidden' : '';
      if (etat) {
        $$('.panneau a').forEach(function (a, i) { a.style.transitionDelay = (60 + i * 45) + 'ms'; });
      }
    };
    burger.addEventListener('click', function () { basculer(); });
    $$('.panneau a').forEach(function (a) { a.addEventListener('click', function () { basculer(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') basculer(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) basculer(false); });
  }

  /* ───────────────────────── 3. les apparitions ───────────────────────── */
  var aApparaitre = $$('[data-apparait], [data-trait]');
  if (!calme && 'IntersectionObserver' in window && aApparaitre.length) {
    var observateur = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var rang = Number(el.dataset.rang || 0);
        el.style.setProperty('--retard', (rang * 90) + 'ms');
        el.classList.add('vu');
        observateur.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    aApparaitre.forEach(function (el) { observateur.observe(el); });
  } else {
    aApparaitre.forEach(function (el) { el.classList.add('vu'); });
  }

  /* le premier écran entre tout de suite, sans attendre le défilement */
  $$('.hero [data-apparait]').forEach(function (el, i) {
    el.style.setProperty('--retard', (120 + i * 120) + 'ms');
    requestAnimationFrame(function () { el.classList.add('vu'); });
  });

  /* ───────────────────────── 4. le film ───────────────────────── */
  var film = $('.film');
  if (film) {
    var video = $('video', film);
    var bouton = $('.film__bouton', film);
    var barre = $('.film__barre i', film);
    var minuteur = $('.minuteur', film);
    var btnSon = $('[data-film="son"]', film);
    var btnReprise = $('[data-film="reprise"]', film);

    function duree(sec) {
      sec = Math.max(0, Math.round(sec || 0));
      return '0:' + (sec < 10 ? '0' : '') + sec;
    }
    function jouer() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* le navigateur refuse : le bouton reste */ });
    }
    if (bouton) bouton.addEventListener('click', function () { jouer(); });
    if (video) {
      video.addEventListener('play', function () { film.classList.add('lecture'); });
      video.addEventListener('pause', function () { film.classList.remove('lecture'); });
      video.addEventListener('ended', function () { film.classList.remove('lecture'); });
      video.addEventListener('timeupdate', function () {
        if (barre && video.duration) barre.style.width = (video.currentTime / video.duration * 100) + '%';
        if (minuteur) minuteur.textContent = duree(video.currentTime) + ' / ' + duree(video.duration);
      });
      video.addEventListener('click', function () {
        if (video.paused) jouer(); else video.pause();
      });
      /* sur téléphone, une vidéo ne se lance pas seule : la plaque reste
         sur son image d'attente jusqu'au geste du visiteur. */
    }
    if (btnSon) {
      btnSon.addEventListener('click', function () {
        video.muted = !video.muted;
        btnSon.setAttribute('aria-pressed', video.muted ? 'false' : 'true');
        btnSon.innerHTML = video.muted
          ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9h3l4-4v14l-4-4H4zM16 9l4 6M20 9l-4 6"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 9h3l4-4v14l-4-4H4zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/></svg>';
        if (video.muted) return;
        jouer();
      });
    }
    if (btnReprise) {
      btnReprise.addEventListener('click', function () { video.currentTime = 0; jouer(); });
    }
  }

  /* ───────────────────────── 5. la visionneuse ───────────────────────── */
  var zone = document.createElement('div');
  zone.className = 'visionneuse';
  zone.innerHTML = '<button class="visionneuse__fermer" aria-label="Fermer l’aperçu">' +
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button><img alt=""><div class="visionneuse__legende"></div>';
  document.body.appendChild(zone);
  var imgZone = $('img', zone), legendeZone = $('.visionneuse__legende', zone);
  var derniereSource = null;

  function fermerZone() { zone.classList.remove('ouverte'); document.documentElement.style.overflow = ''; }
  $$('[data-zoom]').forEach(function (fig) {
    fig.addEventListener('click', function () {
      var img = $('img', fig);
      if (!img) return;
      derniereSource = fig;
      imgZone.src = img.src;
      imgZone.alt = img.alt || '';
      legendeZone.textContent = img.alt || '';
      zone.classList.add('ouverte');
      document.documentElement.style.overflow = 'hidden';
    });
  });
  zone.addEventListener('click', function (e) { if (e.target === zone || e.target.closest('.visionneuse__fermer')) fermerZone(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && zone.classList.contains('ouverte')) fermerZone();
    /* les flèches passent d'une capture à l'autre, dans l'ordre de la page */
    if (!zone.classList.contains('ouverte') || !derniereSource) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var toutes = $$('[data-zoom]');
    var i = toutes.indexOf(derniereSource) + (e.key === 'ArrowRight' ? 1 : -1);
    if (i < 0 || i >= toutes.length) return;
    toutes[i].click();
  });

  /* ───────────────────────── 6. les téléchargements ─────────────────────────
     La source de vérité est assets/js/telechargements.js : un fichier qu'on
     modifie à la main, sans toucher aux pages. Un lien vide ne produit JAMAIS
     un bouton qui ne fait rien : il affiche « Bientôt disponible » et dit où
     le fichier sera déposé. */
  var config = window.MODERIC_TELECHARGEMENTS || {};
  $$('[data-telechargement]').forEach(function (bloc) {
    var cle = bloc.getAttribute('data-telechargement');       // ex. « dd-spirity:poste »
    var morceaux = cle.split(':');
    var produit = config[morceaux[0]] || {};
    var plateforme = (produit[morceaux[1]]) || {};
    var actions = $('[data-actions-telechargement]', bloc);
    var etat = $('[data-etat-telechargement]', bloc);
    if (!actions) return;

    function bouton(url, libelle, secondaire) {
      var a = document.createElement('a');
      a.className = 'btn ' + (secondaire ? 'btn--papier' : 'btn--primaire');
      a.href = url;
      a.setAttribute('rel', 'noopener');
      a.innerHTML = libelle + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.5 11L12 15.5 16.5 11M5 19h14"/></svg>';
      return a;
    }
    function indisponible(libelle) {
      var s = document.createElement('span');
      s.className = 'btn btn--bientot';
      s.setAttribute('role', 'status');
      s.innerHTML = libelle;
      return s;
    }

    if (plateforme.url) {
      actions.appendChild(bouton(plateforme.url, 'Télécharger' + (plateforme.taille ? ' · ' + plateforme.taille : '')));
      if (plateforme.secondaire && plateforme.secondaire.url) {
        actions.appendChild(bouton(plateforme.secondaire.url, plateforme.secondaire.libelle || 'Autre format', true));
      }
      if (etat) {
        etat.textContent = 'Disponible' + (plateforme.version ? ' · version ' + plateforme.version : '');
        etat.className = 'telechargement__etat telechargement__etat--pret';
      }
    } else {
      actions.appendChild(indisponible('Bientôt disponible'));
      if (etat) {
        etat.textContent = 'Dépôt en cours';
        etat.className = 'telechargement__etat telechargement__etat--attente';
      }
    }

    /* l'empreinte de contrôle, si elle est connue : c'est ce qui permet à un
       visiteur de vérifier que le fichier reçu est bien le nôtre */
    var empreinte = $('[data-sha]', bloc);
    if (empreinte) {
      if (plateforme.sha256) { empreinte.textContent = plateforme.sha256; empreinte.closest('[data-ligne-sha]').hidden = false; }
      else empreinte.closest('[data-ligne-sha]').hidden = true;
    }
  });

  /* l'image de partage et les données structurées n'ont pas besoin de JS :
     elles sont écrites dans chaque page, en clair, pour les robots. */

  /* ───────────────────────── 7. un détail : l'heure de l'atelier ─────────────────────────
     Le pied de page porte l'heure de Kinshasa : un visiteur qui écrit à une
     entreprise aime savoir si elle est à son bureau. */
  var horloge = $('[data-heure-kinshasa]');
  if (horloge) {
    var maj = function () {
      try {
        horloge.textContent = new Intl.DateTimeFormat('fr-FR', {
          timeZone: 'Africa/Kinshasa', hour: '2-digit', minute: '2-digit'
        }).format(new Date());
      } catch (e) { horloge.textContent = ''; }
    };
    maj(); setInterval(maj, 30000);
  }
})();
