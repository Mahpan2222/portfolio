/* ==============================================
   PORTFOLIO — Mahdi Panahi
   main.js

   Four features in this file:
   1. Navbar: hide on scroll down, show on scroll up
   2. Dark mode: toggle + save preference to localStorage
   3. Typing effect: animated text in the hero
   4. Scroll animations: fade elements in as they enter viewport
   5. Active nav link: highlight current section in navbar
============================================== */


/* ==============================================
   FEATURE 1: NAVBAR — HIDE ON SCROLL
   ─────────────────────────────────────────────
   How it works:
   - We track the last scroll position (lastScrollY).
   - On every scroll event, compare current position to last.
   - If scrolled DOWN past 60px → add .navbar--hidden class.
   - If scrolled back UP → remove .navbar--hidden class.
   - CSS handles the smooth slide animation via:
       transition: transform 0.35s ease
       transform: translateY(-100%)   ← what .navbar--hidden does
============================================== */

const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 60 && currentScrollY > lastScrollY) {
    // Scrolling down and past threshold → hide
    navbar.classList.add('navbar--hidden');
  } else {
    // Scrolling up or near top → show
    navbar.classList.remove('navbar--hidden');
  }

  lastScrollY = currentScrollY;
});


/* ==============================================
   FEATURE 2: DARK MODE TOGGLE
   ─────────────────────────────────────────────
   How it works:
   - The <html> tag has a data-theme attribute: "light" or "dark".
   - CSS variables in style.css are defined per theme:
       html[data-theme="light"] { --bg: #FFFFFF; ... }
       html[data-theme="dark"]  { --bg: #141417; ... }
   - Clicking the toggle button flips the attribute.
   - localStorage saves the user's choice so it persists
     across page reloads (browser remembers it).
   - On page load, we read localStorage first before rendering.
     This runs BEFORE the page is painted (script at bottom of body)
     so there's no flash of wrong theme.
============================================== */

const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const htmlEl      = document.documentElement; // the <html> element

// On page load: apply saved theme (or default to light)
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Button click: flip the theme
themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next); // remember choice
});

// applyTheme: sets the data-theme attribute and updates the icon
function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);

  // Moon icon in dark mode → switch to sun. Sun in light → moon.
  if (theme === 'dark') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}


/* ==============================================
   FEATURE 3: TYPING EFFECT (HERO)
   ─────────────────────────────────────────────
   How it works:
   - An array of strings (roles) is defined below.
   - We type one character at a time using setTimeout.
   - After fully typing a string:
       → wait (pauseAfterType ms)
       → delete one character at a time
       → wait (pauseBeforeNext ms)
       → move to next string in array
   - The cursor (blinking |) is a separate <span> in HTML,
     animated purely in CSS with @keyframes blink.
   - #typed-text is the <span> we write into.

   To change the roles shown → edit the `roles` array below.
============================================== */

const typedTextEl = document.getElementById('typed-text');

const roles = [
  'Embedded Systems Developer',
  'V2X Security Researcher',
  'Real-Time Systems Engineer',
  'Computer Engineering Student',
];

const typeSpeed      = 65;   // ms per character typed
const deleteSpeed    = 35;   // ms per character deleted (faster feels natural)
const pauseAfterType = 1800; // ms to wait after fully typing a string
const pauseBeforeNext = 400; // ms to wait before typing the next string

let roleIndex  = 0;  // which string in roles[] we're currently on
let charIndex  = 0;  // how many characters of that string are visible
let isDeleting = false;

function runTypingEffect() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    // Remove last character
    typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    // Add next character
    typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  // Decide what to do next
  if (!isDeleting && charIndex === currentRole.length) {
    // Finished typing → pause then start deleting
    setTimeout(() => {
      isDeleting = true;
      runTypingEffect();
    }, pauseAfterType);
    return;
  }

  if (isDeleting && charIndex === 0) {
    // Finished deleting → move to next role
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length; // loop back to start
    setTimeout(runTypingEffect, pauseBeforeNext);
    return;
  }

  // Still mid-word → continue
  const speed = isDeleting ? deleteSpeed : typeSpeed;
  setTimeout(runTypingEffect, speed);
}

// Start the typing effect after a short initial delay
setTimeout(runTypingEffect, 800);


/* ==============================================
   FEATURE 4: SCROLL FADE-IN ANIMATIONS
   ─────────────────────────────────────────────
   How it works:
   - Elements with class .fade-in-up start in CSS as:
       opacity: 0;
       transform: translateY(20px);   ← slightly below position
   - IntersectionObserver watches them.
   - When an element enters the viewport, observer fires
     and we add class .visible:
       opacity: 1;
       transform: translateY(0);
   - CSS transition handles the smooth animation.
   - Once visible, we stop observing (unobserve) to avoid
     re-triggering on scroll up/down.

   Why IntersectionObserver instead of scroll events?
   → Much more efficient. Scroll events fire ~60 times/sec.
     Observer only fires when elements cross the threshold.
============================================== */

const fadeElements = document.querySelectorAll('.fade-in-up');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // stop watching once visible
      }
    });
  },
  {
    threshold: 0.12, // trigger when 12% of the element is visible
    rootMargin: '0px 0px -30px 0px', // trigger slightly before fully in view
  }
);

fadeElements.forEach((el) => observer.observe(el));


/* ==============================================
   FEATURE 5: ACTIVE NAV LINK HIGHLIGHT
   ─────────────────────────────────────────────
   How it works:
   - Each section has an id (about, research, projects…).
   - Another IntersectionObserver watches all sections.
   - When a section is ≥ 40% visible, we find the nav link
     pointing to that section's id and add class .active.
   - .active in CSS just changes the link colour to accent.
   - All other links get .active removed.
============================================== */

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navAnchors.forEach((link) => {
          link.classList.remove('active');
          // href="#about" → strip the # → compare to section id
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  {
    threshold: 0.4, // section must be 40% visible to be "current"
  }
);

sections.forEach((section) => sectionObserver.observe(section));
