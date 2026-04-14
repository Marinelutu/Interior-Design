import './style.css';

document.querySelector('#app').innerHTML = `
  <main style="padding: var(--page-padding); min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
    <h1 style="font-size: clamp(3rem, 8vw, 8rem); text-align: center; margin-bottom: 2rem; text-transform: uppercase;">
      Vanguard<br/>Studio
    </h1>
    <p style="font-size: 1.125rem; max-width: 450px; text-align: center; color: var(--color-accent); font-family: var(--font-sans);">
      Phase 1 complete. Core environment, design tokens, and grainy texture overlay are initialized.
    </p>
  </main>
`;
