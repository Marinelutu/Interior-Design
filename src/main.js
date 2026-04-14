import './style.css';
import Lenis from 'lenis';

// Initialize Lenis Core
const lenis = new Lenis({
  lerp: 0.08, // Adjust for softer/firmer smooth scrolling
  wheelMultiplier: 1, // scroll speed
  infinite: false,
  gestureOrientation: 'vertical',
  normalizeWheel: false,
  smoothTouch: false
});

// Optional: Provide lenis instance to window for global access/debugging
window.lenis = lenis;

// Request Animation Frame loop for Lenis
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
