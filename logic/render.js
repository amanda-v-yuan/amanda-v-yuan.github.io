import { ING_MAP } from '../data/ingredients.js';

export function rarityRank(r){
  if(r==='epic') return 4;
  if(r==='rare') return 3;
  if(r==='uncommon') return 2;
  return 1;
}

export function renderInventory(state, el){
  const wrap=el('inventory');
  wrap.innerHTML='';
  const ids = Object.keys(state.inventory);
  if(ids.length===0){ wrap.innerHTML='<div class="small muted">No ingredients yet</div>'; return; }
  ids.sort((a,b)=>rarityRank(ING_MAP[b]?.rarity)-rarityRank(ING_MAP[a]?.rarity));
  for(const id of ids){
    const item=ING_MAP[id]||{name:id,color:'#999',rarity:'common'};
    const count=state.inventory[id];
    const d=document.createElement('div');
    d.className='ing rarity-'+(item.rarity||'common');
    d.style.background='linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))';
    d.innerHTML=`<div style="font-weight:800">${item.name}</div><div class="small muted">${count} × <span style="font-weight:700">${item.rarity}</span></div>`;
    wrap.appendChild(d);
  }
}

export function renderPoints(state, el, BOX_COST, inventoryCapFn, nextLevelPointsFn){
  el('pointsDisplay').textContent=`Points: ${state.points}`;
  el('openedCount').textContent=state.opened;
  el('boxCost').textContent=BOX_COST;
  el('levelDisplay').textContent=state.level;
  el('capDisplay').textContent=inventoryCapFn(state);
  el('nextLevelPts').textContent=nextLevelPointsFn(state);
  el('freeBoxesDisplay').textContent=state.freeBoxes;
  el('cooldownDisplay').textContent=state.cooldownActive ? `in ${Math.max(0,Math.ceil((state.cooldownEndsAt-Date.now())/1000))}s` : 'ready';
}

export function renderLog(state, el){
  const node=el('log');
  node.innerHTML=state.log.slice(0,160).map(l=>`<div>${l}</div>`).join('');
}
