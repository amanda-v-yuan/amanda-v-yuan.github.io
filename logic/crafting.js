import { ING_MAP } from '../data/ingredients.js';

export function craftRecipe(state, RECIPES, recipeId, addPoints, pushLog, renderAll){
  const recipe = RECIPES.find(r=>r.id===recipeId);
  if(!recipe) return;
  const missing = [];
  for(const [rid,c] of Object.entries(recipe.requires)){
    if((state.inventory[rid]||0) < c) missing.push(`${ING_MAP[rid]?.name || rid} x${c-(state.inventory[rid]||0)}`);
  }
  if(missing.length){ pushLog('Missing ingredients: '+missing.join(', ')); renderAll(); return; }

  for(const [rid,c] of Object.entries(recipe.requires)){
    state.inventory[rid]-=c;
    if(state.inventory[rid]<=0) delete state.inventory[rid];
  }
  addPoints(recipe.points, `for crafting ${recipe.name}`);
  pushLog(`Crafted ${recipe.name}`);
  renderAll();
}

export function sellAll(state, addPoints, pushLog, renderAll){
  let gained=0;
  for(const id in state.inventory){
    const count=state.inventory[id];
    let unit=5;
    const r = ING_MAP[id]?.rarity || 'common';
    if(r==='uncommon') unit=12;
    if(r==='rare') unit=40;
    if(r==='epic') unit=140;
    gained+=unit*count;
  }
  if(gained===0){ pushLog('No ingredients to sell'); renderAll(); return; }
  state.inventory={};
  addPoints(gained,'for selling all ingredients');
  pushLog(`Sold everything for ${gained} pts`);
  renderAll();
}
