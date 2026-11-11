/* ══════════════════════════════════════════════════════════════════════════════
   MODERIC SOFTWARE — le mouvement du site
   ──────────────────────────────────────────────────────────────────────────────
   Règle de conduite : le mouvement raconte, il ne décore pas. Tout est écrit en
   transform / opacity (jamais de layout), piloté par requestAnimationFrame, et
   coupé net si le système demande moins d'animation.

     1. la barre de tête prend son fond quand on quitte l'entrée ;
     2. le volet : les liens internes partent sous un balayage d'encre ;
     3. l'apparition : on observe le CONTENEUR, puis on révèle ses enfants ;
     4. le récit des interfaces : dans la scène collante, l'étape la plus proche du
        milieu de l'écran décide de l'image affichée ;
     5. le curseur : un point et un anneau, qui s'ouvrent sur ce qu'on peut voir ;
     6. le film de l'entrée : lecture, son, état, en boucle et sans parole ;
     7. les téléchargements : lus dans assets/js/telechargements.js — jamais de
        bouton creux, jamais de faux lien ;
     8. l'heure de l'atelier, et le menu de téléphone.
   ══════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fin = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ───────── 1. la barre de tête et la jauge de lecture ───────── */
  var tete = $('.tete');
  var jauge = document.createElement('div');
  jauge.id = 'jauge';
  document.body.appendChild(jauge);
  function lireDefilement() {
    var y = window.scrollY || window.pageYOffset;
    if (tete) tete.classList.toggle('tete--posee', y > 24);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    jauge.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', lireDefilement, { passive: true });
  lireDefilement();

  /* ───────── 2. le volet entre les pages ───────── */
  var volet = document.createElement('div');
  volet.id = 'volet';
  document.body.appendChild(volet);
  function partir(vers) {
    if (calme) { window.location.href = vers; return; }
    volet.classList.add('actif');
    setTimeout(function () { window.location.href = vers; }, 420);
  }
  $$('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || /^(https?:|mailto:|tel:|#|javascript:)/.test(h)) return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (a.target && a.target !== '_self') return;
      var cible = h.split('#')[0];
      var ici = location.pathname.split('/').pop() || 'index.html';
      if (!cible || cible === ici) return;      /* même page : on laisse le navigateur */
      e.preventDefault();
      partir(h);
    });
  });
  window.addEventListener('pageshow', function () { volet.classList.remove('actif'); });

  /* ───────── 3. l'apparition ─────────
     On observe le conteneur (une section), puis on révèle ses enfants. Observer
     l'élément lui-même ne marche pas : un masque fermé ou un trait à l'échelle 0
     n'a aucune surface d'intersection — l'observateur ne le verrait jamais. */
  var aReveler = $$('[data-vu],[data-masque],[data-filet],[data-refus]');
  var groupes = [];
  aReveler.forEach(function (el) {
    var conteneur = el.closest('section, .sortie, .pied') || el.parentElement;
    var g = null;
    for (var i = 0; i < groupes.length; i++) if (groupes[i].el === conteneur) { g = groupes[i]; break; }
    if (!g) { g = { el: conteneur, enfants: [] }; groupes.push(g); }
    g.enfants.push(el);
  });
  function reveler(g) {
    g.enfants.forEach(function (el) {
      var rang = Number(el.getAttribute('data-rang') || 0);
      el.style.setProperty('--retard', (rang * 110) + 'ms');
      el.classList.add('vu');
    });
  }
  if (!calme && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        for (var i = 0; i < groupes.length; i++) if (groupes[i].el === e.target) reveler(groupes[i]);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    groupes.forEach(function (g) { obs.observe(g.el); });
  } else {
    groupes.forEach(reveler);
  }
  /* le premier écran entre tout de suite, en cascade, sans attendre le défilement */
  $$('.entree [data-vu], .entree [data-masque], .dossier [data-vu], .dossier [data-masque]').forEach(function (el, i) {
    el.style.setProperty('--retard', (150 + i * 130) + 'ms');
    requestAnimationFrame(function () { el.classList.add('vu'); });
  });

  /* ───────── 4. le récit des interfaces (scène collante) ───────── */
  var stage = $('.stage');
  if (stage) {
    var images = $$('.stage__cadre img', stage);
    var etapes = $$('.etape', stage);
    var etiquette = $('.stage__etiquette b', stage);
    var actif = -1;
    function choisir(i) {
      if (i === actif || !images[i]) return;
      actif = i;
      images.forEach(function (img, k) { img.classList.toggle('actif', k === i); });
      etapes.forEach(function (et, k) { et.classList.toggle('est-lue', k === i); });
      if (etiquette) etiquette.textContent = images[i].getAttribute('alt') || '';
    }
    if (images.length) images[0].classList.add('actif');
    var enAttente = false;
    function choisirParPosition() {
      enAttente = false;
      var milieu = window.innerHeight * 0.46, meilleur = 0, ecart = 1e9;
      etapes.forEach(function (et, k) {
        var r = et.getBoundingClientRect();
        var e = Math.abs(r.top + r.height / 2 - milieu);
        if (e < ecart) { ecart = e; meilleur = k; }
      });
      choisir(meilleur);
    }
    function surDefilement() {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(choisirParPosition);
    }
    if (!calme) {
      window.addEventListener('scroll', surDefilement, { passive: true });
      window.addEventListener('resize', surDefilement);
      choisirParPosition();
    } else {
      etapes.forEach(function (et) { et.classList.add('est-lue'); });
    }
  }

  /* ───────── 5. le curseur (ordinateur seulement) ───────── */
  if (fin && !calme) {
    document.body.classList.add('curseur-maison');
    var point = document.createElement('div'); point.id = 'curseur';
    var anneau = document.createElement('div'); anneau.id = 'curseur-anneau';
    var mots = document.createElement('div'); mots.id = 'curseur-mots';
    document.body.appendChild(point); document.body.appendChild(anneau); document.body.appendChild(mots);
    document.addEventListener('mousemove', function (e) {
      var t = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      point.style.transform = t; anneau.style.transform = t; mots.style.transform = t;
      point.style.opacity = 1; anneau.style.opacity = 1;
    }, { passive: true });
    document.addEventListener('mouseleave', function () { point.style.opacity = 0; anneau.style.opacity = 0; });
    $$('a, button, .planche, .vue, .index__lien, .registre__ligne, .chapitre__embleme').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('curseur-voir');
        mots.textContent = el.getAttribute('data-curseur') || '';
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('curseur-voir');
        mots.textContent = '';
      });
    });
  }

  /* ───────── 6. le film de l'entrée ───────── */
  var film = $('.entree__film video');
  if (film) {
    var btn = $('[data-film="lecture"]');
    var btnSon = $('[data-film="son"]');
    var etatFilm = $('[data-film="etat"]');
    function jouer() { var p = film.play(); if (p && p.catch) p.catch(function () {}); }
    function peindre() {
      if (etatFilm) etatFilm.textContent = film.paused ? 'Film en pause' : 'Film en lecture';
      if (btn) btn.innerHTML = film.paused
        ? '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
    }
    if (btn) btn.addEventListener('click', function () { if (film.paused) jouer(); else film.pause(); peindre(); });
    if (btnSon) btnSon.addEventListener('click', function () {
      film.muted = !film.muted;
      btnSon.setAttribute('aria-pressed', film.muted ? 'false' : 'true');
      btnSon.innerHTML = film.muted
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9h3l4-4v14l-4-4H4zM16 9l4 6M20 9l-4 6"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9h3l4-4v14l-4-4H4zM15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/></svg>';
      if (!film.muted) jouer();
    });
    film.addEventListener('play', peindre);
    film.addEventListener('pause', peindre);
    /* le film démarre seul, sans son (les navigateurs l'autorisent dans ce cas) ;
       si le système demande moins d'animation, l'image d'attente tient le premier écran */
    if (!calme) { film.muted = true; jouer(); } else { film.pause(); }
    peindre();
  }

  /* ───────── 7. les téléchargements ───────── */
  var config = window.MODERIC_TELECHARGEMENTS || {};
  var ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7.5 11L12 15.5 16.5 11M5 19h14"/></svg>';
  $$('[data-tele]').forEach(function (bloc) {
    var p = bloc.getAttribute('data-tele').split(':');
    var pf = (config[p[0]] || {})[p[1]] || {};
    var zone = $('[data-tele-actions]', bloc);
    var etat = $('[data-tele-etat]', bloc);
    if (!zone) return;
    if (pf.url) {
      var a = document.createElement('a');
      a.className = 'bouton bouton--plein';
      a.href = pf.url;
      a.rel = 'noopener';
      a.innerHTML = '<span>Télécharger' + (pf.taille ? ' · ' + pf.taille : '') + '</span>' + ICONE;
      zone.appendChild(a);
      if (pf.secondaire && pf.secondaire.url) {
        var b = document.createElement('a');
        b.className = 'bouton bouton--vide';
        b.href = pf.secondaire.url;
        b.rel = 'noopener';
        b.innerHTML = '<span>' + (pf.secondaire.libelle || 'Autre format') + '</span>';
        zone.appendChild(b);
      }
      if (etat) { etat.className = 'ticket ticket--pret'; etat.innerHTML = '<i class="ticket__point"></i>Disponible' + (pf.version ? ' · v' + pf.version : ''); }
    } else {
      var s = document.createElement('span');
      s.className = 'bouton bouton--attente';
      s.setAttribute('role', 'status');
      s.innerHTML = '<span>Bientôt disponible</span>';
      zone.appendChild(s);
      if (etat) { etat.className = 'ticket'; etat.innerHTML = '<i class="ticket__point"></i>Dépôt en cours'; }
    }
    var ligne = $('[data-tele-sha]', bloc);
    if (ligne) {
      if (pf.sha256) { $('code', ligne).textContent = pf.sha256; ligne.hidden = false; }
      else ligne.hidden = true;
    }
  });

  /* ───────── 8. les horloges de l'atelier (barre, pied, contact) ───────── */
  var horloges = $$('[data-heure]');
  if (horloges.length) {
    var peindreHeure = function () {
      var v = '';
      try {
        v = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Africa/Kinshasa', hour: '2-digit', minute: '2-digit' }).format(new Date());
      } catch (e) { v = ''; }
      horloges.forEach(function (el) { el.textContent = v; });
    };
    peindreHeure(); setInterval(peindreHeure, 30000);
  }

  /* ───────── 9. le menu de téléphone ───────── */
  var burger = $('.burger');
  if (burger) {
    var basculer = function (ouvrir) {
      var etat = ouvrir !== undefined ? ouvrir : !document.body.classList.contains('menu-ouvert');
      document.body.classList.toggle('menu-ouvert', etat);
      burger.setAttribute('aria-expanded', etat ? 'true' : 'false');
      document.documentElement.style.overflow = etat ? 'hidden' : '';
      if (etat) $$('.panneau a').forEach(function (a, i) { a.style.transitionDelay = (80 + i * 55) + 'ms'; });
    };
    burger.addEventListener('click', function () { basculer(); });
    $$('.panneau a').forEach(function (a) { a.addEventListener('click', function () { basculer(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') basculer(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) basculer(false); });
  }
})();
