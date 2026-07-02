// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

document.getElementById('toTop')?.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

// ===================== CURSOR GLOW =====================
const glow = document.getElementById('cursor-glow');
window.addEventListener('pointermove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ===================== REVEAL ON SCROLL =====================
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, {threshold:0, rootMargin:'0px 0px -10% 0px'});
document.querySelectorAll('.reveal, .reveal-section').forEach(el => io.observe(el));
