import { ING_MAP } from '../data/ingredients.js';

export function inventoryTotal(state){
  return Object.values(state.inventory).reduce((a,b)=>a+(b||0),0);
}

export function inventoryCap(state){
  return 20 + (state.level - 1) * 20;
}

export function tryAddIngredient(state, id, count = 1){
  const total = inventoryTotal(state);
  const cap = inventoryCap(state);
  if(total + count > cap){
    return false;
  }
  state.inventory[id] = (state.inventory[id]||0) + count;
  return true;
}

export function giveIngredient(state, id, count = 1){
  if(!ING_MAP[id]) return false;
  return tryAddIngredient(state, id, count);
}
