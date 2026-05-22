/* ═══════════════════════════════════════════════════════════
   ZENZILE MOLLO — PORTFOLIO SCRIPTS
   Custom cursor · Scroll reveals · Nav · Marquee · Form
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── LOADER ─────────────────────────────────────────────── */
(function initLoader() {
  // Inject loader HTML
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.id = 'loader';
  loader.innerHTML = `
    <div class="loader-logo">
      <span class="logo-z">Z</span><span class="logo-m">M</span>
    </div>
    <div class="loader-bar">
      <div class="loader-progress"></div>
    </div>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero animations after loader
      document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 1500);
  });
})();

/* ── CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const orb = document.getElementById('cursorOrb');
  const dot = document.getElementById('cursorDot');
  if (!orb || !dot) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let orbX = 0, orbY = 0;
  let dotX = 0, dotY = 0;
  let mouseX = 0, mouseY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Dot follows instantly
    dotX = mouseX;
    dotY = mouseY;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
  });

  // Orb follows with lerp (smooth lag)
  function animateCursor() {
    orbX += (mouseX - orbX) * 0.12;
    orbY += (mouseY - orbY) * 0.12;
    orb.style.left = orbX + 'px';
    orb.style.top  = orbY + 'px';
    rafId = requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .tool-item, .service-card, .role-card, input, textarea, select';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();

/* ── NAVIGATION ─────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!nav) return;

  // Scroll state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });

  // Mobile toggle
  let menuOpen = false;
  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    // Animate hamburger → X
    const spans = toggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  toggle?.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) toggleMenu();
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));
})();

/* ── SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  // Skip hero — handled by loader
  const nonHeroReveal = Array.from(revealEls).filter(el => !el.closest('.hero'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  nonHeroReveal.forEach(el => observer.observe(el));
})();

/* ── MARQUEE PAUSE ON HOVER ─────────────────────────────── */
(function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();

/* ── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── TOOL ITEMS — STAGGER REVEAL ────────────────────────── */
(function initToolsReveal() {
  const toolItems = document.querySelectorAll('.tool-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Find index among siblings for stagger
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  toolItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, background 0.3s ease';
    observer.observe(item);
  });
})();

/* ── SERVICE CARDS — TILT EFFECT ────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.service-card');
  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, background 0.4s ease';
    });
  });
})();

/* ── CONTACT FORM ───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;

    // Success state
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>Message Sent!</span>
    `;
    btn.style.background = '#22c55e';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });

  // Floating label effect
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
})();

/* ── HERO PARALLAX ──────────────────────────────────────── */
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  const heroPhoto = document.querySelector('.hero-photo');
  if (!bgText || window.matchMedia('(hover: none)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
        if (scrollY < heroH) {
          const progress = scrollY / heroH;
          bgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`;
          if (heroPhoto) {
            heroPhoto.style.transform = `translateY(${scrollY * 0.08}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── STAT COUNTER ANIMATION ─────────────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text);
      const suffix = text.replace(/[\d.]/g, '');

      if (isNaN(num)) return;

      let start = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * num * 10) / 10;
        el.textContent = (Number.isInteger(num) ? Math.round(current) : current) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();

/* ── SECTION DIAGONAL CLIP ANIMATION ───────────────────── */
(function initSectionClips() {
  // Add subtle clip-path reveal to sections
  const sections = document.querySelectorAll('.about, .work, .tools, .contact');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transition = 'opacity 0.6s ease';
    observer.observe(section);
  });
})();

/* ── ROLE CARDS HOVER GLOW ──────────────────────────────── */
(function initRoleGlow() {
  const roleCards = document.querySelectorAll('.role-card');
  roleCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(30,111,255,0.08), rgba(255,255,255,0.02))`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ── FOOTER YEAR ────────────────────────────────────────── */
(function updateYear() {
  const copy = document.querySelector('.footer-copy');
  if (copy) {
    copy.textContent = copy.textContent.replace('2026', new Date().getFullYear());
  }
})();

/* ── KEYBOARD NAVIGATION ────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu?.classList.contains('open')) {
      document.getElementById('navToggle')?.click();
    }
  }
});

/* ── PERFORMANCE: Reduce motion ─────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--ease-out', 'ease');
  document.querySelectorAll('[style*="animation"]').forEach(el => {
    el.style.animation = 'none';
  });
}