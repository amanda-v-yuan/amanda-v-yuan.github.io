import { ING_MAP, INGREDIENTS } from '../data/ingredients.js';
import { tryAddIngredient } from './logic/inventory.js';

export function tradeOne(state, giveId, receiveRarity, pushLog, renderAll){
  if(!state.inventory[giveId] || state.inventory[giveId]<=0){
    pushLog("You don't have that ingredient to trade.");
    renderAll();
    return;
  }
  state.inventory[giveId]-=1;
  if(state.inventory[giveId]<=0) delete state.inventory[giveId];

  const pool = INGREDIENTS.filter(i=>i.rarity===receiveRarity);
  if(pool.length===0){ pushLog('No ingredients for that rarity'); renderAll(); return; }

  const newIng = pool[Math.floor(Math.random()*pool.length)];
  if(!tryAddIngredient(state,newIng.id,1)){
    state.inventory[giveId]=(state.inventory[giveId]||0)+1;
    pushLog('Trade failed — inventory full');
    renderAll();
    return;
  }
  state.inventory[newIng.id]=(state.inventory[newIng.id]||0)+1;
  pushLog(`Traded 1 ${ING_MAP[giveId]?.name||giveId} → 1 ${newIng.name}`);
  renderAll();
}
