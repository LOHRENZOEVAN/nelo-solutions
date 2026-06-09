/* ═══════════════════════════════════════════════
   NELO SOLUTIONS — main.js
   Handles: language, nav, stars, animations,
   ticker, forms, scroll, interactions
   ══════════════════════════════════════════════ */

/* ─── 1. LANGUAGE SWITCHER ─────────────────────── */
function setLang(lang) {
  document.body.className = lang;
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-fr').classList.toggle('active', lang === 'fr');
  try { localStorage.setItem('nelo-lang', lang); } catch (e) {}
}

(function initLang() {
  let saved = 'en';
  try { saved = localStorage.getItem('nelo-lang') || 'en'; } catch (e) {}
  setLang(saved);
})();


/* ─── 2. STICKY NAV (scroll class) ─────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ─── 3. HAMBURGER / MOBILE MENU ───────────────── */
(function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mob-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // close when any link inside is clicked
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
})();


/* ─── 4. SMOOTH SCROLL for anchor links ─────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('nav')?.offsetHeight || 66;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── 5. SCROLL REVEAL (fade / reveal classes) ──── */
(function initReveal() {
  const els = document.querySelectorAll('.fade, .reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ─── 6. STARFIELD CANVAS ───────────────────────── */
(function initStars() {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function buildStars(n) {
    stars = Array.from({ length: n }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.1 + 0.2,
      a:  Math.random(),
      da: (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(46,204,113,${s.a * 0.55})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  buildStars(160);
  draw();

  window.addEventListener('resize', () => {
    resize();
    buildStars(160);
  }, { passive: true });
})();


/* ─── 7. TICKER — duplicate content for seamless loop */
(function initTicker() {
  const inner = document.getElementById('ticker');
  if (!inner) return;
  // The HTML already has items duplicated; just make sure animation runs.
  // Pause on hover for accessibility / readability.
  const wrap = inner.closest('.ticker-track');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => inner.style.animationPlayState = 'paused');
    wrap.addEventListener('mouseleave', () => inner.style.animationPlayState = 'running');
  }
})();


/* ─── 8. HERO EMAIL FORM ────────────────────────── */
(function initHeroForm() {
  const form = document.getElementById('hero-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const emailEl = document.getElementById('hero-email');
    const email   = emailEl ? emailEl.value.trim() : '';
    if (!email) return;

    // Build WhatsApp pre-fill with the email
    const lang = document.body.classList.contains('fr') ? 'fr' : 'en';
    const msg  = lang === 'fr'
      ? `Bonjour Nelo Solutions ! Je souhaite démarrer un projet. Mon email : ${email}`
      : `Hi Nelo Solutions! I'd like to start a project. My email: ${email}`;

    window.open(`https://wa.me/237677487982?text=${encodeURIComponent(msg)}`, '_blank');
    emailEl.value = '';
  });
})();


/* ─── 9. PORTFOLIO CARD CLICK ───────────────────── */
function openSite(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}


/* ─── 10. CONTACT FORM ──────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const data   = new FormData(form);
    const name   = data.get('name')    || '';
    const email  = data.get('email')   || '';
    const service = data.get('service') || '';
    const message = data.get('message') || '';

    const lang = document.body.classList.contains('fr') ? 'fr' : 'en';
    const serviceLabel = service
      ? (lang === 'fr'
          ? { website: 'Site Web (125 000 FCFA)', webapp: 'App Web (250 000 FCFA)', mobile: 'App Mobile (700 000 FCFA)', other: 'Autre' }
          : { website: 'Website (125,000 FCFA)', webapp: 'Web App (250,000 FCFA)', mobile: 'Mobile App (700,000 FCFA)', other: 'Other' }
        )[service] || service
      : '';

    const wa = lang === 'fr'
      ? `Bonjour Nelo Solutions !\n\nNom : ${name}\nEmail : ${email}\nService : ${serviceLabel}\n\n${message}`
      : `Hello Nelo Solutions!\n\nName: ${name}\nEmail: ${email}\nService: ${serviceLabel}\n\n${message}`;

    window.open(`https://wa.me/237677487982?text=${encodeURIComponent(wa)}`, '_blank');

    // Show success message
    const successEn = document.getElementById('cform-success');
    const successFr = document.getElementById('cform-success-fr');
    if (successEn) successEn.classList.add('show');
    if (successFr) successFr.classList.add('show');

    form.reset();

    setTimeout(() => {
      if (successEn) successEn.classList.remove('show');
      if (successFr) successFr.classList.remove('show');
    }, 5000);
  });
})();


/* ─── 11. ACTIVE NAV LINK on scroll ─────────────── */
(function initActiveNav() {
  const sections = ['about', 'services', 'work', 'process', 'testimonials', 'contact'];
  const navLinks  = document.querySelectorAll('.nav-center a');
  if (!navLinks.length) return;

  const navH = document.getElementById('nav')?.offsetHeight || 66;

  function setActive() {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - navH - 80) {
        current = id;
      }
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href')?.replace('#', '');
      a.style.color = href === current ? 'var(--green)' : '';
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ─── 12. PROCESS STEP — animate active state ───── */
(function initProcessSteps() {
  const steps = document.querySelectorAll('.step');
  if (!steps.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const num = entry.target.querySelector('.step-num');
        if (num) {
          setTimeout(() => num.classList.add('active'), i * 150);
        }
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  steps.forEach(s => io.observe(s));
})();


/* ─── 13. COUNTER ANIMATION for stats ───────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-n');
  if (!stats.length) return;

  function animateCount(el) {
    const raw    = el.textContent.trim();
    const num    = parseInt(raw);
    const suffix = raw.replace(/\d/g, '');
    if (isNaN(num)) return;

    let start  = 0;
    const step = Math.ceil(num / 40);
    const interval = setInterval(() => {
      start = Math.min(start + step, num);
      el.textContent = start + suffix;
      if (start >= num) clearInterval(interval);
    }, 35);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  stats.forEach(s => io.observe(s));
})();


/* ─── 14. REDUCED MOTION RESPECT ────────────────── */
(function respectReducedMotion() {
  const pref = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (pref.matches) {
    document.querySelectorAll('.fade, .reveal').forEach(el => {
      el.classList.add('visible');
    });
    const canvas = document.getElementById('stars');
    if (canvas) canvas.style.display = 'none';
  }
})();