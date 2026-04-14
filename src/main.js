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
