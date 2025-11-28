// boxes.js
import { INGREDIENTS, ING_MAP, BOX_WEIGHTS, PREMIUM_WEIGHTS, BOX_COST, PREMIUM_COST } from '../data/ingredients.js';
import { renderAll, updateCooldownVisual, el } from './render.js';

export let state = {
  points:0, inventory:{}, opened:0, log:[],
  freeBoxes:10, cooldownActive:false, cooldownEndsAt:0, level:1
};

export function inventoryTotal(){
  return Object.values(state.inventory).reduce((a,b)=>a+(b||0),0);
}

export function inventoryCap(){ return 20 + (state.level - 1) * 20; }
export function nextLevelPoints(){ return 100 * state.level; }

export function tryAddIngredient(id,count=1){
  if(inventoryTotal() + count > inventoryCap()){
    pushLog('Inventory full — cannot add ' + (ING_MAP[id]?.name || id));
    return false;
  }
  state.inventory[id] = (state.inventory[id]||0)+count;
  return true;
}

export function giveIngredient(id,count=1){
  if(!ING_MAP[id]) return;
  if(!tryAddIngredient(id,count)){ renderAll(); return; }
  state.inventory[id] = (state.inventory[id]||0)+count;
  pushLog(`Gained ${count} × ${ING_MAP[id].name}`);
  renderAll();
}

export function addPoints(n,reason=''){ state.points+=n; pushLog(`+${n} pts ${reason}`); renderAll(); }

export function pushLog(text){
  const t = `${new Date().toLocaleTimeString()} · ${text}`;
  state.log.unshift(t);
  if(state.log.length>400) state.log.pop();
}

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

function pickRandomIngredient(weights){
  const rarity = weightedChoice(weights);
  return pickIngredientByRarity(rarity);
}

export function openFreeBox(){
  if(state.freeBoxes>0){
    state.freeBoxes--;
    for(let i=0;i<3;i++){
      const ing = pickRandomIngredient(BOX_WEIGHTS);
      if(ing) giveIngredient(ing.id,1);
    }
    state.opened++;
    pushLog('Opened a free box');
    if(state.freeBoxes<=0 && !state.cooldownActive) startCooldown();
    renderAll();
    return;
  }
  if(state.cooldownActive){ pushLog('Free box on cooldown'); renderAll(); return; }
  startCooldown();
  pushLog('No free boxes — cooldown started'); renderAll();
}

export function openPaidBox(){
  if(state.points<BOX_COST){ pushLog('Not enough points'); renderAll(); return; }
  state.points-=BOX_COST;
  pushLog('Bought standard box');
  for(let i=0;i<3;i++){ const ing=pickRandomIngredient(BOX_WEIGHTS); if(ing) giveIngredient(ing.id,1); }
  state.opened++;
  renderAll();
}

export function openPremiumBox(){
  if(state.points<PREMIUM_COST){ pushLog('Not enough points'); renderAll(); return; }
  state.points-=PREMIUM_COST;
  pushLog('Bought premium box');
  for(let i=0;i<4;i++){ const ing=pickRandomIngredient(PREMIUM_WEIGHTS); if(ing) giveIngredient(ing.id,1); }
  state.opened++;
  renderAll();
}

export function startCooldown(){
  state.cooldownActive = true;
  state.cooldownEndsAt = Date.now() + 5000;
  renderAll();
  const id = setInterval(()=>{
    if(Date.now()>=state.cooldownEndsAt){ clearInterval(id); state.cooldownActive=false; state.freeBoxes++; renderAll(); pushLog('A free box has regenerated'); return; }
    updateCooldownVisual();
  },100);
}

export function elSafe(id){ return el(id); }
