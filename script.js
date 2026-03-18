/* ============================================================
   scrypt.js — CyberThink Initiative
   ============================================================ */

'use strict';

/* ============================================================
   1. BURGER MENU
   ============================================================ */

const burger  = document.querySelector('.burger');
const navList = document.getElementById('nav-list');

if (burger && navList) {
  burger.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on nav link click
  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !navList.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

function closeMenu() {
  if (!navList) return;
  navList.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}


/* ============================================================
   2. NAVBAR SCROLL EFFECT
   ============================================================ */

const header = document.querySelector('.header');

if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.background = 'rgba(10, 14, 20, 0.98)';
      header.style.borderBottomColor = 'rgba(0, 255, 136, 0.25)';
    } else {
      header.style.background = 'rgba(10, 14, 20, 0.92)';
      header.style.borderBottomColor = 'rgba(0, 255, 136, 0.15)';
    }
  }, { passive: true });
}


/* ============================================================
   3. SCROLL ANIMATIONS (fade-up)
   ============================================================ */

const fadeEls = document.querySelectorAll('.fade-up');

if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeEls.forEach(el => fadeObserver.observe(el));
}


/* ============================================================
   4. ANIMATED COUNTERS
   ============================================================ */

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * `suffix` is appended after the number (e.g. '+', '%').
 */
function animateCounter(el, target, suffix = '', duration = 1800) {
  const start     = performance.now();
  const startVal  = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(startVal + eased * (target - startVal));

    el.textContent = current + suffix;

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }

  requestAnimationFrame(update);
}

// Map each stat card to its numeric value and suffix
const statConfigs = [
  { selector: '.stat-card:nth-child(1) .stat-card__num', value: 60,  suffix: '+'  },
  { selector: '.stat-card:nth-child(2) .stat-card__num', value: 25,  suffix: '%'  },
  { selector: '.stat-card:nth-child(3) .stat-card__num', value: 85,  suffix: '%'  },
  { selector: '.stat-card:nth-child(4) .stat-card__num', value: 4,   suffix: '×'  },
];

const counterTriggered = new WeakSet();

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    if (counterTriggered.has(card)) return;

    const numEl = card.querySelector('.stat-card__num');
    if (!numEl) return;

    // Find config by index
    const allCards = [...document.querySelectorAll('.stat-card')];
    const idx      = allCards.indexOf(card);
    const cfg      = statConfigs[idx];

    if (cfg) {
      counterTriggered.add(card);
      animateCounter(numEl, cfg.value, cfg.suffix);
    }

    counterObserver.unobserve(card);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
  counterObserver.observe(card);
});


/* ============================================================
   5. CONTACT FORM — VALIDATION & SUBMIT
   ============================================================ */

const contactForm = document.getElementById('contactForm');
const formStatus  = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', handleContactSubmit);
}

function handleContactSubmit(e) {
  e.preventDefault();

  const nameEl  = document.getElementById('cName');
  const emailEl = document.getElementById('cEmail');
  const msgEl   = document.getElementById('cMsg');

  clearErrors();

  let valid = true;

  if (!nameEl.value.trim()) {
    showError(nameEl, 'Введите ваше имя');
    valid = false;
  }

  if (!emailEl.value.trim() || !isValidEmail(emailEl.value.trim())) {
    showError(emailEl, 'Введите корректный email');
    valid = false;
  }

  if (!valid) {
    setStatus(formStatus, '⚠ Пожалуйста, заполните обязательные поля.', 'error');
    return;
  }

  // Simulate async send
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled    = true;
  btn.textContent = 'Отправляем…';

  setTimeout(() => {
    setStatus(formStatus, '✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
    contactForm.reset();
    btn.disabled    = false;
    btn.textContent = 'Отправить →';
  }, 1400);
}


/* ============================================================
   6. HELPERS
   ============================================================ */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputEl, message) {
  inputEl.style.borderColor = 'var(--danger)';
  inputEl.style.boxShadow   = '0 0 0 3px rgba(255, 77, 109, 0.15)';

  const err = document.createElement('span');
  err.className   = 'field-error';
  err.textContent = message;
  err.style.cssText = `
    display: block;
    font-size: 0.78rem;
    color: var(--danger);
    margin-top: 0.3rem;
    font-family: var(--mono);
  `;

  const group = inputEl.closest('.form-group');
  if (group) group.appendChild(err);

  inputEl.addEventListener('input', () => {
    inputEl.style.borderColor = '';
    inputEl.style.boxShadow   = '';
    err.remove();
  }, { once: true });
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  });
}

function setStatus(el, message, type) {
  el.textContent = message;
  el.style.color = type === 'success' ? 'var(--accent)' : 'var(--danger)';

  if (type === 'success') {
    setTimeout(() => { el.textContent = ''; }, 6000);
  }
}


/* ============================================================
   7. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id  = anchor.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    closeMenu();

    const headerH = header ? header.offsetHeight : 0;
    const top     = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ============================================================
   8. ACTIVE NAV LINK ON SCROLL
   ============================================================ */

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navAnchors.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    });
  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(s => navObserver.observe(s));
}


/* ============================================================
   9. THREAT CARDS — TILT EFFECT (subtle, desktop only)
   ============================================================ */

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.threat-card, .impact-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
  });
}

function handleTilt(e) {
  const card   = e.currentTarget;
  const rect   = card.getBoundingClientRect();
  const x      = e.clientX - rect.left;
  const y      = e.clientY - rect.top;
  const cx     = rect.width  / 2;
  const cy     = rect.height / 2;
  const rotateX = ((y - cy) / cy) * -4;
  const rotateY = ((x - cx) / cx) *  4;

  card.style.transform  = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  card.style.transition = 'transform 0.1s ease';
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transform  = '';
  card.style.transition = 'transform 0.4s ease';
}


/* ============================================================
   10. GLITCH TEXT — hero heading (one-time on load)
   ============================================================ */

const heroH1 = document.querySelector('.hero h1');

if (heroH1) {
  setTimeout(() => {
    heroH1.classList.add('glitch-once');
    heroH1.addEventListener('animationend', () => {
      heroH1.classList.remove('glitch-once');
    }, { once: true });
  }, 800);
}


/* ============================================================
   11. TYPING EFFECT — hero__pre
   ============================================================ */

const heroPre = document.querySelector('.hero__pre');

if (heroPre) {
  const fullText  = heroPre.textContent.trim();
  heroPre.textContent = '';
  heroPre.style.opacity = '1';

  let i = 0;
  const typingSpeed = 48;

  function typeChar() {
    if (i < fullText.length) {
      heroPre.textContent += fullText[i];
      i++;
      setTimeout(typeChar, typingSpeed);
    }
  }

  // Start after a short delay so page has rendered
  setTimeout(typeChar, 400);
}


/* ============================================================
   12. MISSION VISUAL — blinking cursor
   ============================================================ */

const lastMvLine = document.querySelector('.mission__visual .mv-line:last-child');

if (lastMvLine) {
  const cursor = document.createElement('span');
  cursor.textContent = '█';
  cursor.style.cssText = `
    color: var(--accent);
    animation: blink 1s step-end infinite;
    margin-left: 4px;
    font-size: 0.9em;
  `;
  lastMvLine.appendChild(cursor);

  // Inject keyframes if not already present
  if (!document.getElementById('blink-style')) {
    const style = document.createElement('style');
    style.id = 'blink-style';
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
      .glitch-once {
        animation: glitch 0.4s linear;
      }
      @keyframes glitch {
        0%   { text-shadow: none; transform: none; }
        20%  { text-shadow: 2px 0 var(--accent), -2px 0 var(--accent2); transform: translateX(-2px); }
        40%  { text-shadow: -2px 0 var(--danger), 2px 0 var(--accent);  transform: translateX(2px);  }
        60%  { text-shadow: 2px 0 var(--accent2), -2px 0 var(--accent); transform: translateX(-1px); }
        80%  { text-shadow: none; transform: none; }
        100% { text-shadow: none; transform: none; }
      }
    `;
    document.head.appendChild(style);
  }
}


/* ============================================================
   13. SCROLL-TO-TOP BUTTON (auto-inject)
   ============================================================ */

const scrollTopBtn = document.createElement('button');
scrollTopBtn.setAttribute('aria-label', 'Наверх');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: rgba(10, 14, 20, 0.9);
  color: var(--accent);
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.3s ease, transform 0.3s ease, border-color 0.3s ease;
  z-index: 99;
  backdrop-filter: blur(8px);
`;

document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollTopBtn.addEventListener('mouseenter', () => {
  scrollTopBtn.style.borderColor = 'var(--accent)';
  scrollTopBtn.style.boxShadow   = '0 0 16px rgba(0,255,136,0.25)';
});
scrollTopBtn.addEventListener('mouseleave', () => {
  scrollTopBtn.style.borderColor = 'var(--border)';
  scrollTopBtn.style.boxShadow   = 'none';
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.style.opacity   = '1';
    scrollTopBtn.style.transform = 'translateY(0)';
  } else {
    scrollTopBtn.style.opacity   = '0';
    scrollTopBtn.style.transform = 'translateY(12px)';
  }
}, { passive: true });
