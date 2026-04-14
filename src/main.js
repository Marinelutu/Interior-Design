import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// Phase 7a — Preloader
// ============================================================

const preloader   = document.getElementById('preloader');
const counterEl   = document.getElementById('preloader-counter');
const progressBar = preloader.querySelector('.preloader-bar');

let progress = 0;
let targetProgress = 0;
let raf;

// Ease toward target value
function tickProgress() {
  progress += (targetProgress - progress) * 0.08;
  const rounded = Math.round(progress);
  counterEl.textContent = rounded;
  progressBar.style.width = rounded + '%';
  raf = requestAnimationFrame(tickProgress);
}

tickProgress();

// Advance quickly to 90% before load fires
const fastInterval = setInterval(() => {
  targetProgress = Math.min(targetProgress + Math.random() * 6, 90);
  if (targetProgress >= 90) clearInterval(fastInterval);
}, 80);

// Snap to 100% on full page load, then animate preloader out
window.addEventListener('load', () => {
  clearInterval(fastInterval);
  targetProgress = 100;

  const checkDone = setInterval(() => {
    if (Math.round(progress) >= 99) {
      clearInterval(checkDone);
      cancelAnimationFrame(raf);
      counterEl.textContent = '100';
      progressBar.style.width = '100%';

      gsap.to(preloader, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.3,
        onComplete: () => {
          preloader.classList.add('is-done');
          preloader.style.display = 'none';
          initSite();
        }
      });
    }
  }, 50);
});

// ============================================================
// Phase 7b — Custom Cursor
// ============================================================

const cursorDot   = document.getElementById('cursor-dot');
const cursorRing  = document.getElementById('cursor-ring');
const cursorLabel = document.getElementById('cursor-label');

let mouseX = -100, mouseY = -100;
let ringX  = -100, ringY  = -100;
const LERP = 0.12;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform  = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  cursorLabel.style.transform = `translate(${mouseX + 16}px, ${mouseY + 16}px)`;
});

// Ring follows with inertia
(function animateRing() {
  ringX += (mouseX - ringX) * LERP;
  ringY += (mouseY - ringY) * LERP;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
})();

// Expand ring on hover targets
document.querySelectorAll('a, button, [data-project], .polaroid-frame').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Invert cursor on dark sections
document.querySelectorAll('.section-atelier, .site-footer').forEach(section => {
  section.addEventListener('mouseenter', () => document.body.classList.add('cursor-inverted'));
  section.addEventListener('mouseleave', () => document.body.classList.remove('cursor-inverted'));
});

// Project label tooltip
document.querySelectorAll('[data-project]').forEach(card => {
  card.addEventListener('mouseenter', () => {
    cursorLabel.textContent = card.dataset.project;
    cursorLabel.classList.add('is-visible');
  });
  card.addEventListener('mouseleave', () => {
    cursorLabel.classList.remove('is-visible');
  });
});

// ============================================================
// Main init — called after preloader exits
// ============================================================

function initSite() {

  // --- Phase 4: Lenis Smooth Scroll ---
  const lenis = new Lenis({
    lerp: 0.08,
    wheelMultiplier: 1,
    infinite: false,
    gestureOrientation: 'vertical',
    normalizeWheel: false,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;

  // --- Phase 5: Vanguard Logo Motion ---
  const mm = gsap.matchMedia();

  mm.add('(min-width: 320px)', () => {
    const logo = document.querySelector('.logo-placeholder');
    const hero = document.querySelector('.section-hero');

    gsap.set(logo, { clearProps: 'all' });

    const logoRect    = logo.getBoundingClientRect();
    const targetWidth = window.innerWidth * 0.85;
    const scaleFactor = targetWidth / (logoRect.width || 1);
    const xOffset     = (window.innerWidth  / 2) - (logoRect.left + logoRect.width  / 2);
    const yOffset     = (window.innerHeight / 2) - (logoRect.top  + logoRect.height / 2);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=450%', // Significantly increased for a more gradual, tactile feel
        scrub: 1.2,    // Slightly more lag for a "heavier", premium feel
        pin: true,
      }
    });

    // Phase 1: Logo & Title Intro (0 to 1.5)
    tl.fromTo(logo,
      { x: xOffset, y: yOffset, scale: scaleFactor, transformOrigin: 'center center', willChange: 'transform' },
      { x: 0, y: 0, scale: 1, ease: 'power2.inOut', duration: 1.5 },
      0
    );

    tl.fromTo('.hero-title',
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out' },
      0.6
    );

    tl.fromTo('.nav-list',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
      0.6
    );

    // Phase 2: Hero Image Zoom-Out (1.5 to 4.5)
    // Elongated zoom phase to make it feel deeply tied to scrolling
    tl.to('.hero-image-wrapper', {
      scale: 0.5,
      borderRadius: '3rem',
      boxShadow: '0 60px 120px rgba(0,0,0,0.18)',
      ease: 'none', // Linear zoom feels more tactile with the scroll
      duration: 3
    }, 1.5);

    // Phase 3: Text Fade-out (End of section)
    tl.to('.hero-content', {
      opacity: 0,
      y: -60,
      ease: 'power2.in',
      duration: 0.8
    }, 4);
  });

  // --- Atmospheric Trilogy (Philosophy Transitions) ---
  const phSection = document.querySelector('.section-philosophy');
  
  if (phSection) {
    const phTl = gsap.timeline({
      scrollTrigger: {
        trigger: phSection,
        start: 'top top',
        end: '+=300%', // 3 pages worth of scroll for 3 items
        pin: true,
        scrub: 1,
      }
    });

    // Transition Item 1 Out / Item 2 In
    phTl.to('.philosophy-item.item-1', { opacity: 0, y: -80, duration: 1 }, 0.5);
    phTl.to('.texture-bg.bg-1', { opacity: 0, duration: 1 }, 0.5);
    
    phTl.fromTo('.philosophy-item.item-2', 
      { opacity: 0, y: 80 }, 
      { opacity: 1, y: 0, duration: 1, pointerEvents: 'auto' }, 1);
    phTl.to('.texture-bg.bg-2', { opacity: 0.3, duration: 1 }, 1);
    phTl.to(phSection, { backgroundColor: '#E8E4D8', duration: 1 }, 1); // Slight color shift

    // Transition Item 2 Out / Item 3 In
    phTl.to('.philosophy-item.item-2', { opacity: 0, y: -80, duration: 1, pointerEvents: 'none' }, 2);
    phTl.to('.texture-bg.bg-2', { opacity: 0, duration: 1 }, 2);

    phTl.fromTo('.philosophy-item.item-3', 
      { opacity: 0, y: 80 }, 
      { opacity: 1, y: 0, duration: 1, pointerEvents: 'auto' }, 2.5);
    phTl.to('.texture-bg.bg-3', { opacity: 0.3, duration: 1 }, 2.5);
    phTl.to(phSection, { backgroundColor: '#DED9C8', duration: 1 }, 2.5); // Warm sand shift
    
    // Final fade out buffer to smooth transition to portfolio
    phTl.to({}, { duration: 0.5 }); 
  }

  // --- Phase 6a: Staggered Parallax ---
  document.querySelectorAll('[data-speed]').forEach((card) => {
    const speed = parseFloat(card.dataset.speed) || 0;
    gsap.to(card, {
      y: () => speed * window.innerHeight,
      ease: 'none',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      }
    });
  });

  // --- Phase 6b: Heading Reveal ---
  document.querySelectorAll('[data-reveal] .reveal-text').forEach((span) => {
    const parent = span.parentElement;
    if (!parent.classList.contains('reveal-clip')) parent.style.overflow = 'hidden';
    gsap.from(span, {
      y: '110%', opacity: 0, duration: 1.2, ease: 'power4.out',
      scrollTrigger: { trigger: span, start: 'top 90%', toggleActions: 'play none none none' }
    });
  });

  // --- Phase 6c: Batch Card Reveal ---
  ScrollTrigger.batch('[data-reveal].project-card', {
    start: 'top 88%',
    onEnter: (batch) => {
      gsap.fromTo(batch,
        { opacity: 0, y: 60, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', stagger: 0.12 }
      );
    },
    once: true,
  });

  // --- Phase 7c: Dynamic Background Color Shift ---
  const portfolioSection = document.querySelector('.section-portfolio');
  ScrollTrigger.create({
    trigger: portfolioSection,
    start: 'center 60%',
    end: 'bottom 40%',
    onEnter:     () => portfolioSection.classList.add('bg-warm'),
    onLeaveBack: () => portfolioSection.classList.remove('bg-warm'),
  });

  ScrollTrigger.refresh();
}
