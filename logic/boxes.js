import { giveIngredient } from './inventory.js';
import { INGREDIENTS } from '../data/ingredients.js';

const BOX_WEIGHTS = { common:70, uncommon:20, rare:8, epic:2 };
const PREMIUM_WEIGHTS = { common:50, uncommon:30, rare:15, epic:5 };
export const BOX_COST = 100;
export const PREMIUM_COST = 200;
const COOLDOWN_MS = 5000;

function weightedChoice(weights){
  const items = Object.keys(weights);
  const sum = items.reduce((s,k)=>s+weights[k],0);
  let r = Math.random()*sum;
  for(let k of items){ r-=weights[k]; if(r<=0) return k; }
  return items[items.length-1];
}

function pickIngredientByRarity(rarity){
  const pool = INGREDIENTS.filter(i=>i.rarity===rarity);
  if(pool.length===0) return null;
  return pool[Math.floor(Math.random()*pool.length)];
}

export function pickRandomIngredient(weights){
  const rarity = weightedChoice(weights);
  return pickIngredientByRarity(rarity);
}

export function openFreeBox(state, pushLog, renderAll, startCooldown){
  if(state.freeBoxes > 0){
    state.freeBoxes -= 1;
    for(let i=0;i<3;i++){
      const ing = pickRandomIngredient(BOX_WEIGHTS);
      if(ing) giveIngredient(state, ing.id, 1);
    }
    state.opened++;
    pushLog('Opened a free box');
    if(state.freeBoxes <= 0 && !state.cooldownActive) startCooldown(state, pushLog, renderAll);
    renderAll();
    return;
  }
  pushLog(state.cooldownActive ? 'Free box on cooldown — wait' : 'No free boxes — cooldown started');
  if(!state.cooldownActive) startCooldown(state, pushLog, renderAll);
  renderAll();
}

export function openPaidBox(state, pushLog, renderAll){
  if(state.points < BOX_COST){ pushLog('Not enough points'); renderAll(); return; }
  state.points -= BOX_COST;
  pushLog('Bought a standard box');
  for(let i=0;i<3;i++){
    const ing = pickRandomIngredient(BOX_WEIGHTS);
    if(ing) giveIngredient(state, ing.id, 1);
  }
  state.opened++;
  renderAll();
}

export function openPremiumBox(state, pushLog, renderAll){
  if(state.points < PREMIUM_COST){ pushLog('Not enough points'); renderAll(); return; }
  state.points -= PREMIUM_COST;
  pushLog('Bought a premium box');
  for(let i=0;i<4;i++){
    const ing = pickRandomIngredient(PREMIUM_WEIGHTS);
    if(ing) giveIngredient(state, ing.id, 1);
  }
  state.opened++;
  renderAll();
}

export function startCooldown(state, pushLog, renderAll){
  state.cooldownActive = true;
  state.cooldownEndsAt = Date.now() + COOLDOWN_MS;
  const id = setInterval(()=>{
    if(Date.now() >= state.cooldownEndsAt){
      clearInterval(id);
      state.cooldownActive = false;
      state.freeBoxes += 1;
      state.cooldownEndsAt = 0;
      pushLog('A free box has regenerated');
      renderAll();
    }
  }, 100);
}
