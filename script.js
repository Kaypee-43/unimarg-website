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
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const form = document.getElementById('enquiry');
if (form) {
  const field  = (n) => form.elements.namedItem(n);
  const okBox  = document.getElementById('form-ok');
  const errBox = document.getElementById('form-err');
  const btn    = form.querySelector('button[type="submit"]');
  const btnLabel = btn.textContent;

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
          topic:        field('topic').value,
          message:      field('msg').value.trim(),
          _subject:     'Website enquiry: ' + field('topic').value
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
