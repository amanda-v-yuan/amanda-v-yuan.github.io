// main.js
import { INGREDIENTS, RECIPES, BOX_WEIGHTS, PREMIUM_WEIGHTS, BOX_COST, PREMIUM_COST, ING_MAP } from './data/ingredients.js';
import { craftRecipe, sellAll, tradeOne } from './data/recipes.js';
import { openFreeBox, openPaidBox, openPremiumBox, startCooldown } from './logic/boxes.js';
import { renderAll, el } from './logic/render.js';

// DOMContentLoaded ensures HTML is fully loaded before JS runs
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderAll();

  // --- Button event listeners ---
  el('openBoxBtn').addEventListener('click', () => openFreeBox());
  el('openPaidBtn').addEventListener('click', () => openPaidBox());
  el('openPremiumBtn').addEventListener('click', () => openPremiumBox());
  el('buyBoxBtn').addEventListener('click', () => openPaidBox());
  el('freeBoxBtn').addEventListener('click', () => openFreeBox());
  el('sellAllBtn').addEventListener('click', () => sellAll());
  el('resetBtn').addEventListener('click', () => {
    if (confirm('Reset all progress?')) {
      localStorage.clear();
      location.reload();
    }
  });

  el('tradeBtn').addEventListener('click', () => {
    const give = el('tradeGive').value;
    const rar = el('tradeRarity').value;
    if (!give) {
      alert('No ingredient selected to trade');
      return;
    }
    tradeOne(give, rar);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'o') openFreeBox();
    if (e.key.toLowerCase() === 'p') openPremiumBox();
  });

  // First-run welcome
  if (!localStorage.getItem('vibeboxes_save_v2')) {
    alert('Welcome! You start with 10 free boxes. After they run out, wait 5s to regenerate 1 free box.');
  }

  // Resume cooldown if active
  const saved = JSON.parse(localStorage.getItem('vibeboxes_save_v2') || '{}');
  if (saved.cooldownActive && saved.cooldownEndsAt > Date.now()) {
    startCooldown();
  }
});
