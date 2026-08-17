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


function initMeetScrollColor() {
  const wraps = document.querySelectorAll('.meet-photo-wrap');
  if (!wraps.length || !('IntersectionObserver' in window)) return;

  const isMobile = () => window.matchMedia('(max-width: 720px)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!isMobile()) {
        entry.target.classList.remove('is-colored');
        return;
      }
      entry.target.classList.toggle('is-colored', entry.isIntersecting);
    });
  }, { threshold: 0.8 }); // mostly in viewport before it colors in

  wraps.forEach(wrap => observer.observe(wrap));
}
initMeetScrollColor();

// =====================================================
// RSVP GUEST COUNTERS
// =====================================================

document.querySelectorAll('.guest-counter').forEach(counter => {

  const minusButton = counter.querySelector('.counter-minus');
  const plusButton = counter.querySelector('.counter-plus');
  const display = counter.querySelector('.counter-value');
  const hiddenInput = counter.querySelector('input[type="hidden"]');

  let value = 0;

  plusButton.addEventListener('click', () => {
    value++;

    display.textContent = value;
    hiddenInput.value = value;
  });

  minusButton.addEventListener('click', () => {

    if (value > 0) {
      value--;

      display.textContent = value;
      hiddenInput.value = value;
    }

  });

});

// =====================================================
// FAQ ACCORDION
// =====================================================

document.querySelectorAll('.faq-question').forEach(button => {

  button.addEventListener('click', () => {

    const item = button.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');

    const isOpen = answer.classList.contains('is-open');

    // close all FAQ items first
    document.querySelectorAll('.faq-answer').forEach(otherAnswer => {
      otherAnswer.classList.remove('is-open');
    });

    document.querySelectorAll('.faq-icon').forEach(otherIcon => {
      otherIcon.textContent = '+';
    });

    // open selected item if it wasn't already open
    if (!isOpen) {
      answer.classList.add('is-open');
      icon.textContent = '−';
    }

  });

});


// =====================================================
// WEDDING RSVP SUBMISSION
// =====================================================

const rsvpForm = document.getElementById('wedding-rsvp');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = rsvpForm.querySelector('.rsvp-submit');

    const formData = new FormData(rsvpForm);

    const attendance = formData.get('attendance');

    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      attendance: attendance,
      adults:
        attendance === 'Regretfully Declines'
          ? 0
          : Number(formData.get('adults') || 0),
      children:
        attendance === 'Regretfully Declines'
          ? 0
          : Number(formData.get('children') || 0)
    };

    submitButton.disabled = true;
    submitButton.textContent = 'SUBMITTING...';

    try {

      await fetch(
        'https://script.google.com/macros/s/AKfycbxrcixk_NFXtTu9uHkX2TihABrEdip-Q0xfPX9o-KpdOfp-EAhOUCh6PHp6hMXJz9iH/exec',
        {
          method: 'POST',
          body: JSON.stringify(data),
          mode: 'no-cors'
        }
      );

      rsvpForm.innerHTML = `
        <div class="rsvp-success">
          <h3>Thank You!</h3>
          <p>Your RSVP has been received.</p>
          <p>We can't wait to celebrate with you.</p>
        </div>
      `;

    } catch (error) {

      console.error(error);

      submitButton.disabled = false;
      submitButton.textContent = 'RSVP';

      alert(
        'Something went wrong while submitting your RSVP. Please try again.'
      );

    }
  });
}