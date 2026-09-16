// ---------- Mobile nav ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  // Close the menu after tapping any link, including same-page #anchor links (Guides, Case Studies)
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// ---------- Scroll reveal ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Contact form ----------
// Each enquiry is written into the HRMS (Business Dev) and an email alert is sent.
const FUNCTION_ENDPOINT = 'https://zpbfztddhneymyvdnyav.supabase.co/functions/v1/bd-capture-lead'; // writes to BD CRM (bd_leads)
const FORM_ENDPOINT     = 'https://formspree.io/f/xgoglqyd'; // email alert to info@unimarg.in

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

  // First-touch attribution: capture once, keep the original source.
  const ATTR_KEY = 'um_attr';
  const attribution = (() => {
    const p = new URLSearchParams(location.search);
    const g = (k) => p.get(k) || '';
    const now = {
      utm_source: g('utm_source'), utm_medium: g('utm_medium'),
      utm_campaign: g('utm_campaign'), utm_term: g('utm_term'),
      utm_content: g('utm_content'), gclid: g('gclid'),
      landing_page: location.pathname, referrer: document.referrer || ''
    };
    if (now.gclid && !now.utm_source) { now.utm_source = 'google'; now.utm_medium = 'cpc'; }
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(ATTR_KEY) || 'null'); } catch (e) {}
    const hasParams = now.utm_source || now.gclid;
    if (!saved || (hasParams && !saved.utm_source && !saved.gclid)) {
      saved = now;
      try { localStorage.setItem(ATTR_KEY, JSON.stringify(saved)); } catch (e) {}
    }
    return saved || now;
  })();

  const fail = (msg) => {
    errBox.innerHTML = msg;
    errBox.style.display = 'block';
  };
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const phoneOk = (v) => v.replace(/[^\d]/g, '').length >= 7;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    okBox.style.display = 'none';
    errBox.style.display = 'none';

    // Honeypot: bots fill hidden fields, people do not.
    if (field('_gotcha').value) return;

    const name    = field('name').value.trim();
    const org     = field('org').value.trim();
    const phone   = field('phone').value.trim();
    const email   = field('email').value.trim();
    const topic   = field('topic').selectedOptions[0].text;
    const message = field('msg').value.trim();
    const consent = field('consent').checked;

    if (!name)           { fail('Please enter your name.'); return; }
    if (!org)            { fail('Please enter your organisation or institution.'); return; }
    if (!phoneOk(phone)) { fail('Please enter a valid phone number.'); return; }
    if (!emailOk(email)) { fail('Please enter a valid email address.'); return; }
    if (!consent)        { fail('Please tick the box to agree to be contacted.'); return; }

    btn.disabled = true;
    btn.textContent = 'Sending\u2026';

    // Email alert (best-effort): keeps the inbox notification even if the CRM call fails.
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name, organisation: org, email: email, phone: phone,
        topic: topic, message: message,
        _subject: 'Website enquiry: ' + topic
      })
    }).catch(() => {});

    // Primary: write the lead into the HRMS (Business Dev).
    try {
      const res = await fetch(FUNCTION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name, org: org, phone: phone, email: email,
          interest: topic, message: message, consent: consent,
          utm_source: attribution.utm_source, utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign, utm_term: attribution.utm_term,
          utm_content: attribution.utm_content, gclid: attribution.gclid,
          landing_page: attribution.landing_page, referrer: attribution.referrer
        })
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error('capture failed');

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
