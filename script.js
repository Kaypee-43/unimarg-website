// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Contact form (placeholder handler — connect to CRM/Formspree for real delivery)
const form = document.getElementById('enquiry');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.name.value.trim() || !form.email.value.trim()) {
      alert('Please fill in your name and email.');
      return;
    }
    document.getElementById('form-ok').style.display = 'block';
    form.querySelector('button').disabled = true;
  });
}
