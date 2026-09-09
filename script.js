// ---------- Mobile nav ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Contact form ----------
// SETUP: replace YOUR_FORM_ID below with the ID from your Formspree dashboard.
// To move to another provider later, only this one line needs to change.
const FORM_ENDPOINT = 'https://formspree.io/f/xgoglqyd';

const form = document.getElementById('enquiry');
if (form) {
  const field  = (n) => form.elements.namedItem(n);
  const okBox  = document.getElementById('form-ok');
  const errBox = document.getElementById('form-err');
  const btn    = form.querySelector('button[type="submit"]');
  const btnLabel = btn.textContent;

  // Pre-select the topic when arriving from a service page (contact.html?topic=slug)
  const tParam = new URLSearchParams(location.search).get('topic');
  if (tParam) {
    const opt = [...field('topic').options].find(o => o.value === tParam);
    if (opt) opt.selected = true;
  }

  const fail = (msg) => {
    errBox.innerHTML = msg;
    errBox.style.display = 'block';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    okBox.style.display = 'none';
    errBox.style.display = 'none';

    // Honeypot: bots fill hidden fields, people do not.
    if (field('_gotcha').value) return;

    const name  = field('name').value.trim();
    const email = field('email').value.trim();

    if (!name || !email) {
      fail('Please enter your name and email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      fail('Please enter a valid email address.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending\u2026';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:         name,
          organisation: field('org').value.trim(),
          email:        email,
          phone:        field('phone').value.trim(),
          topic:        field('topic').selectedOptions[0].text,
          message:      field('msg').value.trim(),
          _subject:     'Website enquiry: ' + field('topic').selectedOptions[0].text
        })
      });

      if (!res.ok) throw new Error('Status ' + res.status);

      form.reset();
      okBox.style.display = 'block';
      btn.textContent = 'Enquiry Sent';
    } catch (err) {
      btn.disabled = false;
      btn.textContent = btnLabel;
      fail('Something went wrong sending your enquiry. Please email <a href="mailto:info@unimarg.in">info@unimarg.in</a> or call <a href="tel:+917935821805">079 3582 1805</a>.');
    }
  });
}

// ---------- Header shadow on scroll ----------
(() => {
  const hdr = document.querySelector('header');
  if (!hdr) return;
  const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ---------- Reveal service rows for the underline sweep ----------
(() => {
  const rows = document.querySelectorAll('.svc');
  if (!rows.length) return;
  const ro = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
  }, { threshold: 0.15 });
  rows.forEach(r => ro.observe(r));
})();
// ---------- Cookie consent (Consent Mode v2) ----------
(() => {
  const KEY = 'um_consent';
  const saved = localStorage.getItem(KEY);
  const grant = () => { if (window.gtag) gtag('consent', 'update', { 'analytics_storage': 'granted' }); };
  if (saved === 'granted') { grant(); return; }
  if (saved === 'denied') { return; }
  const bar = document.createElement('div');
  bar.className = 'cookie-banner';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie consent');
  bar.innerHTML =
    '<p>We use Google Analytics cookies to see how visitors use this site. No analytics cookies are set unless you accept. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
    '<div class="cookie-actions"><button type="button" class="btn btn-blue" data-c="accept">Accept</button><button type="button" class="btn btn-ghost" data-c="decline">Decline</button></div>';
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (!b) return;
    const choice = b.dataset.c === 'accept' ? 'granted' : 'denied';
    localStorage.setItem(KEY, choice);
    if (choice === 'granted') grant();
    bar.remove();
  });
  document.body.appendChild(bar);
})();

// ---------- Hero animated field (progressive enhancement) ----------
(() => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (matchMedia('(prefers-contrast: more)').matches) return; // keep static fallback
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = document.createElement('canvas');
  cv.className = 'hero-field';
  cv.setAttribute('aria-hidden', 'true');
  const ctx = cv.getContext('2d');
  if (!ctx) return;                       // no 2D context: keep CSS path field
  hero.insertBefore(cv, hero.firstChild);
  hero.classList.add('has-field');        // hide the static field now the canvas is live

  let W = 0, H = 0, raf = 0, running = false, lines = [];
  const build = () => {
    const N = innerWidth < 920 ? 8 : 13;
    lines = [];
    for (let i = 0; i < N; i++) lines.push({
      base: (i + 0.5) / N, amp: 12 + Math.random() * 40, freq: 0.9 + Math.random() * 2,
      phase: Math.random() * 6.28, speed: 0.09 + Math.random() * 0.3,
      gold: (i % 6 === 4), w: 0.6 + Math.random() * 1.4, a: 0.04 + Math.random() * 0.10
    });
  };
  const size = () => {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    W = r.width; H = r.height; build();
  };
  const draw = (t) => {
    ctx.clearRect(0, 0, W, H);
    for (const L of lines) {
      ctx.beginPath();
      for (let x = -20; x <= W + 20; x += 8) {
        const y = L.base * H
          + Math.sin((x / W) * L.freq * 6.28 + L.phase + (reduce ? 0 : t * 0.001 * L.speed)) * L.amp
          + Math.sin((x / W) * 4 + (reduce ? 0 : t * 0.0004)) * 7;
        x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = L.gold ? `rgba(217,172,0,${L.a})` : `rgba(24,159,218,${L.a})`;
      ctx.lineWidth = L.w; ctx.stroke();
    }
    if (!reduce) raf = requestAnimationFrame(draw);
  };
  const start = () => { if (running || reduce) return; running = true; raf = requestAnimationFrame(draw); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  size();
  addEventListener('resize', size, { passive: true });
  if (reduce) { requestAnimationFrame(draw); return; }  // one static frame, no loop
  new IntersectionObserver(
    (es) => es.forEach(e => e.isIntersecting ? start() : stop()),
    { threshold: 0 }
  ).observe(hero);
})();
