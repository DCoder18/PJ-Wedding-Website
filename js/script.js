// Mobile hamburger menu open/close
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  document.body.classList.add('menu-open');
  hamburger.setAttribute('aria-expanded', 'true');
}

// =====================================================
// NAVBAR BACKGROUND ON SCROLL
// =====================================================

const navbar = document.querySelector('.nav');

function updateNavbarBackground() {

  if (!navbar) return;

  if (window.scrollY > 50) {
    navbar.classList.add('nav-scrolled');
  } else {
    navbar.classList.remove('nav-scrolled');
  }

}

window.addEventListener('scroll', updateNavbarBackground);

updateNavbarBackground();

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

  const guestError =
    document.getElementById('guest-error');

  const guestCounts =
    rsvpForm.querySelector('.guest-counts');

  const attendanceRadios =
    rsvpForm.querySelectorAll('input[name="attendance"]');


  // =====================================================
  // SHOW / HIDE GUEST ERROR
  // =====================================================

  function showGuestError() {

    if (guestError) {
      guestError.classList.add('show');
    }

    if (guestCounts) {
      guestCounts.classList.add('has-error');
    }

  }


  function clearGuestError() {

    if (guestError) {
      guestError.classList.remove('show');
    }

    if (guestCounts) {
      guestCounts.classList.remove('has-error');
    }

  }


  // =====================================================
  // DISABLE GUEST COUNTERS WHEN NOT ATTENDING
  // =====================================================

  function updateGuestControls() {

    const selected =
      rsvpForm.querySelector(
        'input[name="attendance"]:checked'
      );

    if (!selected || !guestCounts) return;

    const declining =
      selected.value === "I won't be attending";


    // Disable / enable plus and minus buttons
    guestCounts
      .querySelectorAll('button')
      .forEach(button => {

        button.disabled = declining;

      });


    // If declining, reset guest counts to zero
    if (declining) {

      guestCounts
        .querySelectorAll('.counter-value')
        .forEach(counter => {

          counter.textContent = '0';

        });


      guestCounts
        .querySelectorAll('input[type="hidden"]')
        .forEach(input => {

          input.value = '0';

        });


      clearGuestError();

    }

  }


  // =====================================================
  // ATTENDANCE CHANGE
  // =====================================================

  attendanceRadios.forEach(radio => {

    radio.addEventListener(
      'change',
      updateGuestControls
    );

  });


  // Set initial state when page loads
  updateGuestControls();


  // =====================================================
  // CLEAR ERROR WHEN GUEST COUNT CHANGES
  // =====================================================

  rsvpForm
    .querySelectorAll('.counter-plus, .counter-minus')
    .forEach(button => {

      button.addEventListener('click', () => {

        // Run after your existing counter code updates the values
        setTimeout(() => {

          const adults = Number(
            rsvpForm.querySelector(
              'input[name="adults"]'
            ).value || 0
          );

          const children = Number(
            rsvpForm.querySelector(
              'input[name="children"]'
            ).value || 0
          );

          if (adults + children > 0) {
            clearGuestError();
          }

        }, 0);

      });

    });


  // =====================================================
  // FORM SUBMISSION
  // =====================================================

  rsvpForm.addEventListener(
    'submit',
    async (event) => {

      event.preventDefault();

      const submitButton =
        rsvpForm.querySelector('.rsvp-submit');

      const formData =
        new FormData(rsvpForm);

      const attendance =
        formData.get('attendance');

      const adults =
        Number(formData.get('adults') || 0);

      const children =
        Number(formData.get('children') || 0);

      const isDeclining =
        attendance === "I won't be attending";


      // =====================================================
      // VALIDATE GUEST COUNT
      // =====================================================

      if (
        !isDeclining &&
        adults + children === 0
      ) {

        showGuestError();

        guestCounts.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        return;

      }


      clearGuestError();


      // =====================================================
      // PREPARE RSVP DATA
      // =====================================================

      const data = {

        firstName:
          formData.get('firstName'),

        lastName:
          formData.get('lastName'),

        email:
          formData.get('email'),

        attendance:
          attendance,

        adults:
          isDeclining ? 0 : adults,

        children:
          isDeclining ? 0 : children

      };


      // =====================================================
      // SUBMIT
      // =====================================================

      submitButton.disabled = true;

      submitButton.textContent =
        'SUBMITTING...';


      try {

        await fetch(
          'https://script.google.com/macros/s/AKfycbxrcixk_NFXtTu9uHkX2TihABrEdip-Q0xfPX9o-KpdOfp-EAhOUCh6PHp6hMXJz9iH/exec',
          {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors'
          }
        );


        // =====================================================
        // SUCCESS MESSAGE
        // =====================================================

        if (isDeclining) {

          rsvpForm.innerHTML = `
            <div class="rsvp-success">

              <h3>Thank You!</h3>

              <p>
                Your RSVP has been received.
              </p>

              <p>
                Thank you for letting us know.
              </p>

            </div>
          `;

        } else {

          rsvpForm.innerHTML = `
            <div class="rsvp-success">

              <h3>Thank You!</h3>

              <p>
                Your RSVP has been received.
              </p>

              <p>
                We can't wait to celebrate with you.
              </p>

            </div>
          `;

        }


      } catch (error) {

        console.error(error);

        submitButton.disabled = false;

        submitButton.textContent =
          'RSVP';

        alert(
          'Something went wrong while submitting your RSVP. Please try again.'
        );

      }

    }
  );

}

