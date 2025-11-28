// recipes.js
import { state, tryAddIngredient, addPoints, pushLog } from '../logic/boxes.js';
import { ING_MAP, RECIPES } from './data/ingredients.js';
import { renderAll } from '../logic/render.js';

export function craftRecipe(recipeId){
  const recipe = RECIPES.find(r=>r.id===recipeId);
  if(!recipe) return;
  const missing = [];
  for(const [rid,c] of Object.entries(recipe.requires)){
    if((state.inventory[rid]||0)<c) missing.push(`${ING_MAP[rid]?.name || rid} x${c-(state.inventory[rid]||0)}`);
  }
  if(missing.length){ pushLog('Missing ingredients: '+missing.join(', ')); renderAll(); return; }
 
