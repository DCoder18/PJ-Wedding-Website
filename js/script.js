// Mobile hamburger menu open/close
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  document.body.classList.add('menu-open');
  hamburger.setAttribute('aria-expanded', 'true');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', openMobileMenu);
  mobileMenuClose.addEventListener('click', closeMobileMenu);

  // close menu whenever a link inside it is tapped (before the smooth-scroll fires)
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// Smooth scroll for on-page nav links (RSVP, DETAILS, nav menu items)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // if target section doesn't exist yet (still being built), let the browser
    // do nothing rather than error, so this is safe to leave in as we add sections
  });
});
