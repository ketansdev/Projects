/* ================================
   SUDIKSHA NURSERY — script.js
   ================================ */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────
  let currentLang = 'en';

  // ── DOM References ─────────────────────────────────────
  const navbar      = document.getElementById('navbar');
  const langToggle  = document.getElementById('langToggle');
  const langLabel   = document.getElementById('langLabel');
  const navMenu     = document.getElementById('navMenu');
  const hamburger   = document.getElementById('hamburger');

  // ── Language Toggle ────────────────────────────────────
  function setLanguage(lang) {
    currentLang = lang;
    const isMarathi = lang === 'mr';

    // Update all elements with data-en / data-mr attributes
    document.querySelectorAll('[data-en]').forEach(el => {
      const text = isMarathi ? el.getAttribute('data-mr') : el.getAttribute('data-en');
      if (!text) return;

      // Handle elements that contain HTML (like <br> in titles)
      if (text.includes('<br>') || text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Update toggle button label
    langLabel.textContent = isMarathi ? 'English' : 'मराठी';

    // Update html lang attribute
    document.documentElement.lang = isMarathi ? 'mr' : 'en';

    // Add/remove Marathi font class
    document.body.classList.toggle('lang-marathi', isMarathi);
  }

  langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'mr' : 'en');

    // Pulse animation on toggle
    langToggle.style.transform = 'scale(0.92)';
    setTimeout(() => { langToggle.style.transform = ''; }, 200);
  });

  // ── Navbar Scroll Effect ───────────────────────────────
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
  }, { passive: true });

  // ── Mobile Hamburger Menu ──────────────────────────────
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });

  // ── Smooth Scroll for Navigation ──────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  // ── Reveal on Scroll (IntersectionObserver) ────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children)
          : [];
        const index = siblings.indexOf(entry.target);
        const delay = Math.min(index * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Active Nav Link Highlighting ───────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ── Button Ripple Effect ───────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: ${size}px;
        height: ${size}px;
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
      `;

      // Inject ripple keyframes once
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(1); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ── Stat Counter Animation ─────────────────────────────
  function animateCounter(el, target, suffix, duration = 1500) {
    const start = 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    let startTime = null;
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(num => {
          const raw = num.textContent.trim();
          const value = parseInt(raw);
          const suffix = raw.replace(/[0-9]/g, '');
          animateCounter(num, value, suffix);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statObserver.observe(aboutStats);

  // ── Hamburger CSS Transition ───────────────────────────
  const hamStyle = document.createElement('style');
  hamStyle.textContent = `
    .hamburger.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .hamburger.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .hamburger.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
    .hamburger span {
      transition: all 0.3s ease;
    }
    .nav-menu a.active {
      color: var(--gold);
    }
    .nav-menu a.active::after {
      width: 100%;
    }
    .lang-marathi {
      letter-spacing: 0.01em;
    }
  `;
  document.head.appendChild(hamStyle);

  // ── Parallax on Hero Leaves ────────────────────────────
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const leaves = document.querySelectorAll('.leaf');
    leaves.forEach((leaf, i) => {
      const speed = 0.05 + (i * 0.02);
      leaf.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ── Product Card Tilt Effect ───────────────────────────
  document.querySelectorAll('.product-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;

      this.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  // ── Initial Setup ──────────────────────────────────────
  setLanguage('en');

})();