/* ══════════════════════════════════════════════════════════════════════════════
   MODERIC SOFTWARE — le mouvement du site
   ──────────────────────────────────────────────────────────────────────────────
   Le mouvement sert la lecture, il ne la remplace pas. Tout est écrit en
   transform / opacity / clip-path (jamais de layout), piloté par
   requestAnimationFrame, et s'arrête net si le système demande moins d'animation.

     1. la barre prend son fond au défilement, et le fil de progression avance ;
     2. le volet : les liens internes partent sous un balayage d'azur ;
     3. l'apparition : on observe chaque section, puis on révèle ses enfants ;
     4. l'entrée : les halos et le cadre du film bougent doucement (parallaxe),
        et le cadre s'incline légèrement sous le curseur ;
     5. l'emplacement du film : si un vrai film est déposé, il remplace la
        composition ; sinon la composition reste, et rien ne fait semblant ;
     6. les téléchargements : lus dans assets/js/telechargements.js ;
     7. l'heure de Kinshasa, et le menu de téléphone.
   ══════════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var precis = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ───────── 1. la barre et le fil de progression ───────── */
  var barre = $('.barre');
  var fil = document.createElement('div');
  fil.id = 'fil';
  document.body.appendChild(fil);
  function auDefilement() {
    var y = window.scrollY || window.pageYOffset;
    if (barre) barre.classList.toggle('barre--posee', y > 30);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    fil.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    parallaxe(y);
  }
  window.addEventListener('scroll', auDefilement, { passive: true });

  /* ───────── 2. le volet entre les pages ───────── */
  var volet = document.createElement('div');
  volet.id = 'volet';
  document.body.appendChild(volet);
  function partir(vers) {
    if (calme) { window.location.href = vers; return; }
    volet.classList.add('actif');
    setTimeout(function () { window.location.href = vers; }, 430);
  }
  $$('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || /^(https?:|mailto:|tel:|#|javascript:)/.test(h)) return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (a.target && a.target !== '_self') return;
      var cible = h.split('#')[0];
      var ici = location.pathname.split('/').pop() || 'index.html';
      if (!cible || cible === ici) return;         /* même page : on laisse le navigateur */
      e.preventDefault();
      partir(h);
    });
  });
  window.addEventListener('pageshow', function () { volet.classList.remove('actif'); });

  /* ───────── 3. l'apparition ─────────
     On observe la SECTION, puis on révèle ses enfants. Observer l'élément lui-même
     ne marche pas : un texte masqué ou un trait à l'échelle 0 n'a aucune surface
     d'intersection — l'observateur ne le verrait jamais arriver. */
  var aReveler = $$('[data-monter],[data-ligne],[data-trait],.principe');
  var groupes = [];
  aReveler.forEach(function (el) {
    /* on remonte jusqu'à la SECTION (ou la porte, ou un bloc de page produit) ;
       .porte est déjà une section, on s'arrête donc au premier conteneur trouvé. */
    var section = el.closest('section, .bloc, .produit-entree, .pied') || el.parentElement;
    var g = null;
    for (var i = 0; i < groupes.length; i++) if (groupes[i].el === section) { g = groupes[i]; break; }
    if (!g) { g = { el: section, enfants: [] }; groupes.push(g); }
    g.enfants.push(el);
  });
  function reveler(g) {
    g.enfants.forEach(function (el) {
      var rang = Number(el.getAttribute('data-rang') || 0);
      el.style.setProperty('--retard', (rang * 90) + 'ms');
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
    }, { rootMargin: '12% 0px 6% 0px', threshold: 0 });
    groupes.forEach(function (g) { obs.observe(g.el); });
  } else {
    groupes.forEach(reveler);
  }
  /* le premier écran entre tout de suite, en cascade */
  $$('.entree [data-monter], .entree [data-ligne], .produit-entree [data-monter], .produit-entree [data-ligne]')
    .forEach(function (el, i) {
      el.style.setProperty('--retard', (120 + i * 110) + 'ms');
      requestAnimationFrame(function () { el.classList.add('vu'); });
    });

  /* ───────── 4. l'entrée : parallaxe douce et inclinaison du cadre ───────── */
  var haloA = $('.halo--a'), haloB = $('.halo--b'), cadre = $('.cadre-film');
  function parallaxe(y) {
    if (calme) return;
    if (haloA) haloA.style.transform = 'translate3d(0,' + (y * 0.06).toFixed(1) + 'px,0)';
    if (haloB) haloB.style.transform = 'translate3d(0,' + (y * -0.045).toFixed(1) + 'px,0)';
  }
  if (cadre && precis && !calme) {
    var plaque = $('.cadre-film__plaque', cadre);
    cadre.addEventListener('mousemove', function (e) {
      var r = cadre.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5;
      var dy = (e.clientY - r.top) / r.height - 0.5;
      plaque.style.transform = 'rotate(-1.4deg) rotateY(' + (dx * 7).toFixed(2) + 'deg) rotateX(' +
        (-dy * 7).toFixed(2) + 'deg) translateY(-3px)';
    });
    cadre.addEventListener('mouseleave', function () { plaque.style.transform = ''; });
  }

  /* ───────── 5. l'emplacement du film ─────────
     Le site ne fabrique AUCUNE image d'entreprise. Si une vidéo est réellement
     déposée (assets/video/institutionnel.mp4), elle remplace la composition et
     reçoit des commandes natives. Sinon la composition reste : c'est un cadre
     réservé, dit comme tel, et il n'y a aucun bouton qui ne fait rien. */
  var emplacementFilm = $('.cadre-film');
  if (emplacementFilm) {
    var essai = document.createElement('video');
    essai.preload = 'metadata';
    essai.muted = true;
    essai.src = 'assets/video/institutionnel.mp4';
    essai.addEventListener('loadedmetadata', function () {
      essai.controls = true;
      essai.playsInline = true;
      essai.loop = calme ? false : true;
      var poster = $('.cadre-film__interieur .emplacement');
      if (poster) poster.parentNode.insertBefore(essai, poster);
      emplacementFilm.classList.add('avec-film');
      if (!calme) {
        var p = essai.play();
        if (p && p.catch) p.catch(function () { /* le navigateur refuse : les commandes restent */ });
      }
    });
    essai.addEventListener('error', function () { /* pas de film : la composition tient le cadre */ });
  }

  /* ───────── 6. les téléchargements ───────── */
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
        b.className = 'bouton bouton--ligne';
        b.href = pf.secondaire.url;
        b.rel = 'noopener';
        b.innerHTML = '<span>' + (pf.secondaire.libelle || 'Autre format') + '</span>';
        zone.appendChild(b);
      }
      if (etat) { etat.className = 'jauge-etat jauge-etat--pret'; etat.innerHTML = '<i></i>Disponible' + (pf.version ? ' · v' + pf.version : ''); }
    } else {
      var s = document.createElement('span');
      s.className = 'bouton bouton--attente';
      s.setAttribute('role', 'status');
      s.innerHTML = '<span>Bientôt disponible</span>';
      zone.appendChild(s);
      if (etat) { etat.className = 'jauge-etat'; etat.innerHTML = '<i></i>Dépôt en cours'; }
    }
    var ligne = $('[data-tele-sha]', bloc);
    if (ligne) {
      if (pf.sha256) { $('code', ligne).textContent = pf.sha256; ligne.hidden = false; }
      else ligne.hidden = true;
    }
  });

  /* ───────── 7. l'heure de l'atelier, et le menu de téléphone ───────── */
  var horloges = $$('[data-heure]');
  if (horloges.length) {
    var peindre = function () {
      var v = '';
      try {
        v = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Africa/Kinshasa', hour: '2-digit', minute: '2-digit' }).format(new Date());
      } catch (e) { v = ''; }
      horloges.forEach(function (el) { el.textContent = v; });
    };
    peindre(); setInterval(peindre, 30000);
  }
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
    window.addEventListener('resize', function () { if (window.innerWidth > 920) basculer(false); });
  }

  /* le défilement doux pour les ancres : posé en dernier, et seulement si le système
     n'a pas demandé moins de mouvement (sinon il gênerait la lecture). */
  if (!calme) requestAnimationFrame(function () { document.documentElement.classList.add('defilement-doux'); });

  auDefilement();
})();
