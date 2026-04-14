import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis Core
const lenis = new Lenis({
  lerp: 0.08, // Adjust for softer/firmer smooth scrolling
  wheelMultiplier: 1, // scroll speed
  infinite: false,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: false
});

// Sync Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Optional: Provide lenis instance to window for global access/debugging
window.lenis = lenis;

// --- Phase 5: The "Vanguard" Motion (GSAP Logo) ---
let mm = gsap.matchMedia();

mm.add("(min-width: 320px)", () => {
  const logo = document.querySelector('.logo-placeholder');
  const hero = document.querySelector('.section-hero');
  
  // Clear any previous props
  gsap.set(logo, { clearProps: "all" });
  
  let logoRect = logo.getBoundingClientRect();
  
  // Scale factor to make it 85% of window width
  let targetWidth = window.innerWidth * 0.85;
  let scaleFactor = targetWidth / (logoRect.width || 1); 
  
  // Center positions (header is position: fixed, so bounds are relative to viewport)
  let xOffset = (window.innerWidth / 2) - (logoRect.left + logoRect.width / 2);
  let yOffset = (window.innerHeight / 2) - (logoRect.top + logoRect.height / 2);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=100%',
      scrub: 1,
      pin: true,
    }
  });

  // Logo shrinks and moves to header
  tl.fromTo(logo, {
    x: xOffset,
    y: yOffset,
    scale: scaleFactor,
    transformOrigin: "center center",
    willChange: "transform",
  }, {
    x: 0,
    y: 0,
    scale: 1,
    ease: "power2.inOut"
  }, 0);

  // Hero subtitle fades in as logo shrinks
  tl.fromTo('.hero-title', {
    opacity: 0,
    y: 40,
    scale: 0.95,
  }, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    ease: "power2.out"
  }, 0.5);

  // Nav list fades in as logo shrinks
  tl.fromTo('.nav-list', {
    opacity: 0,
    y: -20,
  }, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out"
  }, 0.5);
});

// --- Phase 6: The Long Portfolio (Motion Signature) ---

// 6a. Staggered Parallax
// Each project card carries a [data-speed] attribute (e.g., -0.12, 0.08).
// We translate it vertically by speed * scrollProgress * viewportHeight.
const parallaxCards = document.querySelectorAll('[data-speed]');
parallaxCards.forEach((card) => {
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

// 6b. Section heading reveal — staggered word-by-word slide-up
const revealHeadings = document.querySelectorAll('[data-reveal] .reveal-text');
revealHeadings.forEach((span) => {
  // Wrap with overflow:hidden clip container so text slides up cleanly
  const parent = span.parentElement;
  if (!parent.classList.contains('reveal-clip')) {
    parent.style.overflow = 'hidden';
  }

  gsap.from(span, {
    y: '110%',
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: span,
      start: 'top 90%',
      toggleActions: 'play none none none',
    }
  });
});

// 6c. Batch reveal — project cards slide + blur-in on enter
// "batch" fires once per group of elements visible at the same scroll position
ScrollTrigger.batch('[data-reveal].project-card', {
  start: 'top 88%',
  onEnter: (batch) => {
    gsap.fromTo(
      batch,
      {
        opacity: 0,
        y: 60,
        filter: 'blur(12px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.12,
      }
    );
  },
  once: true, // only animate in once — no re-trigger on scroll up
});

// Refresh ScrollTrigger after initial setup so parallax is accurately measured
ScrollTrigger.refresh();
