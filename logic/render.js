// render.js
import { state, inventoryCap, nextLevelPoints, el } from './logic/boxes.js';
import { ING_MAP, RECIPES } from '../data/ingredients.js';
import { craftRecipe } from '../data/recipes.js';

export function renderAll(){
  renderInventory();
  renderPoints();
  renderLog();
  renderRecipes();
  renderQuickCrafts();
  renderMarketplaceGiveOptions();
  updateCooldownVisual();
}

export function renderInventory(){
  const wrap = el('inventory');
  wrap.innerHTML = '';
  const ids = Object.keys(state.inventory);
  if(ids.length === 0){
    wrap.innerHTML = `<div class="small muted">No ingredients yet — open a box to start</div>`;
    return;
  }
  ids.sort((a,b)=> rarityRank(ING_MAP[b]?.rarity) - rarityRank(ING_MAP[a]?.rarity));
  for(const id of ids){
    const item = ING_MAP[id] || {name:id, color:'#999', rarity:'common'};
    const count = state.inventory[id];
    const d = document.createElement('div');
    d.className = 'ing rarity-' + (item.rarity||'common');
    d.style.background = `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))`;
    d.innerHTML = `<div style="font-weight:800">${item.name}</div><div class="small muted">${count} × <span style="font-weight:700">${item.rarity}</span></div>`;
    wrap.appendChild(d);
  }
}

export function renderPoints(){
  el('pointsDisplay').textContent = `Points: ${state.points}`;
  el('openedCount').textContent = state.opened;
  el('boxCost').textContent = 100;
  el('levelDisplay').textContent = state.level;
  el('capDisplay').textContent = inventoryCap();
  el('nextLevelPts').textContent = nextLevelPoints();
  el('freeBoxesDisplay').textContent = state.freeBoxes;
  el('cooldownDisplay').textContent = state.cooldownActive ? `in ${Math.max(0, Math.ceil((state.cooldownEndsAt - Date.now())/1000))}s` : 'ready';
}

export function renderLog(){
  const node = el('log');
  node.innerHTML = state.log.slice(0,160).map(l => `<div>${l}</div>`).join('');
}

export function renderRecipes(){
  const grid = el('recipesGrid');
  grid.innerHTML = '';
  for(const r of RECIPES){
    const card = document.createElement('div');
    card.className = 'recipe';
    const needHtml = Object.entries(r.requires).map(([id,c])=>{
      const name = ING_MAP[id]?.name || id;
      return `<div class="small" style="display:flex; justify-content:space-between;"><span>${name}</span><strong>x${c}</strong></div>`;
    }).join('');
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:800">${r.name}</div><div class="small muted">${r.points} pts</div>
      </div>
      <div style="margin-top:8px">${needHtml}</div>
      <div style="margin-top:8px; display:flex; justify-content:flex-end;">
        <button data-recipe="${r.id}">Craft</button>
      </div>
    `;
    grid.appendChild(card);
  }
  grid.querySelectorAll('button[data-recipe]').forEach(b=>{
    b.addEventListener('click', ()=>craftRecipe(b.getAttribute('data-recipe')));
  });
}

export function renderQuickCrafts(){
  const quick = el('quickCrafts');
  quick.innerHTML = '';
  const craftable = RECIPES.filter(r=>{
    const missing = Object.entries(r.requires).some(([rid,c])=> (state.inventory[rid]||0) < c );
    return !missing;
  }).slice(0,3);
  if(craftable.length === 0){
    quick.innerHTML = `<div class="small muted">No quick crafts available — collect ingredients</div>`;
    return;
  }
  for(const r of craftable){
    const box = document.createElement('div');
    box.className = 'panel';
    box.style.padding = '8px';
    box.style.marginBottom = '6px';
    box.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;"><div><strong>${r.name}</strong><div class="small muted">${r.points} pts</div></div><div><button data-q="${r.id}">Craft</button></div></div>`;
    quick.appendChild(box);
  }
  quick.querySelectorAll('button[data-q]').forEach(b=>b.addEventListener('click', ()=>craftRecipe(b.getAttribute('data-q'))));
}

export function renderMarketplaceGiveOptions(){
  const sel = el('tradeGive');
  sel.innerHTML = '';
  const ids = Object.keys(state.inventory);
  if(ids.length === 0){
    sel.innerHTML = `<option value="">(no ingredients)</option>`;
    return;
  }
  ids.sort((a,b)=> rarityRank(ING_MAP[b]?.rarity) - rarityRank(ING_MAP[a]?.rarity));
  for(const id of ids){
    const name = ING_MAP[id]?.name || id;
    const count = state.inventory[id];
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${name} x${count} (${ING_MAP[id]?.rarity||'common'})`;
    sel.appendChild(opt);
  }
}

export function el(id){ return document.getElementById(id); }

function rarityRank(r){
  if(r==='epic') return 4;
  if(r==='rare') return 3;
  if(r==='uncommon') return 2;
  return 1;
}

export function updateCooldownVisual(){
  const fill = el('cooldownFill');
  if(!state.cooldownActive || state.cooldownEndsAt <= Date.now()){
    fill.style.width = '0%';
    return;
  }
  const left = state.cooldownEndsAt - Date.now();
  const pct = Math.max(0, Math.min(100, (1 - left / 5000) * 100));
  fill.style.width = pct + '%';
}
