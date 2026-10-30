document.documentElement.classList.add('js');
const menu = document.querySelector('#menu');
const navigation = document.querySelector('#navigation');
const mobileLayout = window.matchMedia('(max-width: 760px)');
function closeMenu() {
  navigation.classList.remove('is-open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation menu');
}
menu.hidden = false;
menu.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menu.setAttribute('aria-expanded', String(isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a') && mobileLayout.matches) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menu.focus();
  }
});
mobileLayout.addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

// Motion is progressive enhancement: static content is never hidden while waiting.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const runningAnimations = new Set();
function playMotion(element, keyframes, options) {
  if (reducedMotion.matches || typeof element.animate !== 'function') return;
  const animation = element.animate(keyframes, options);
  runningAnimations.add(animation);
  animation.finished.catch(() => {}).finally(() => runningAnimations.delete(animation));
}

const revealTargets = document.querySelectorAll('.metrics > div, .section .heading, .about > div, details, .project-card, .skill, .education, .certifications, .contact-layout > div');
let revealObserver;
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach((entry, index) => {
      playMotion(entry.target, [
        { opacity: 0, transform: 'translateY(26px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 700, delay: Math.min(index * 75, 225), easing: 'cubic-bezier(.2,.7,.25,1)', fill: 'backwards' });
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealTargets.forEach(element => revealObserver.observe(element));
}

// Native details retain keyboard behavior; animate their content on expansion.
document.querySelectorAll('details').forEach(details => {
  details.addEventListener('toggle', () => {
    if (details.open) playMotion(details.querySelector('.job-body'), [
      { opacity: 0, transform: 'translateY(-8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 350, easing: 'ease-out' });
  });
});

const particles = document.createElement('div');
particles.className = 'motion-particles';
particles.setAttribute('aria-hidden', 'true');
for (let index = 0; index < 16; index++) {
  const particle = document.createElement('span');
  particle.style.left = `${(index * 37 + 7) % 100}%`;
  particle.style.top = `${(index * 23 + 20) % 100}%`;
  particle.style.setProperty('--duration', `${10 + index % 7}s`);
  particle.style.setProperty('--delay', `${-index * 1.3}s`);
  particles.appendChild(particle);
}
document.querySelector('.hero').appendChild(particles);

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
  });
});

reducedMotion.addEventListener('change', event => {
  if (event.matches) {
    runningAnimations.forEach(animation => animation.cancel());
    runningAnimations.clear();
  }
});
