import { ING_MAP, RECIPES } from './ingredients.js';
export function renderAll(state, elements) {
  renderInventory(state, elements);
  renderPoints(state, elements);
  renderRecipes(state, elements);
  renderLog(state, elements);
}

function renderInventory(state, {inventory}) {
  inventory.innerHTML='';
  const ids = Object.keys(state.inventory);
  if(!ids.length){ inventory.innerHTML='<div class="small muted">No ingredients yet</div>'; return; }
  ids.sort((a,b)=> rarityRank(ING_MAP[b].rarity)-rarityRank(ING_MAP[a].rarity));
  for(const id of ids){
    const item=ING_MAP[id]; const count=state.inventory[id];
    const d=document.createElement('div');
    d.className='ing rarity-'+item.rarity;
    d.innerHTML=`<div style="font-weight:800">${item.name}</div><div class="small muted">${count} × <span style="font-weight:700">${item.rarity}</span></div>`;
    inventory.appendChild(d);
  }
}

function rarityRank(r){if(r==='epic')return 4;if(r==='rare')return 3;if(r==='uncommon')return 2;return 1;}

function renderPoints(state, {pointsDisplay, openedCount}) {
  pointsDisplay.textContent=`Points: ${state.points}`;
  openedCount.textContent=state.opened;
}

function renderRecipes(state, {recipesGrid}) {
  recipesGrid.innerHTML='';
  for(const r of RECIPES){
    const card=document.createElement('div'); card.className='recipe panel';
    let needHtml=Object.entries(r.requires).map(([id,c])=>{
      return `<div class="small" style="display:flex;justify-content:space-between;"><span>${ING_MAP[id]?.name||id}</span><strong>x${c}</strong></div>`;
    }).join('');
    card.innerHTML=`<div style="display:flex;justify-content:space-between;"><div style="font-weight:800">${r.name}</div><div class="small muted">${r.points} pts</div></div><div style="margin-top:8px">${needHtml}</div><div style="margin-top:8px;display:flex;justify-content:flex-end;"><button data-recipe="${r.id}">Craft</button></div>`;
    recipesGrid.appendChild(card);
  }
}

function renderLog(state, {log}) {
  log.innerHTML=state.log.slice(0,100).map(l=>`<div>${l}</div>`).join('');
}

export {renderAll};
