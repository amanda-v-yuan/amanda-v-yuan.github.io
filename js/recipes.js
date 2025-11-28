export const RECIPES = [
  {id:'salad', name:'Fresh Salad', requires:{lettuce:1,tomato:1}, points:40},
  {id:'omelette', name:'Omelette', requires:{egg:2,cheese:1}, points:80},
  {id:'truffle_pasta', name:'Truffle Pasta', requires:{flour:1,garlic:1,truffle:1}, points:180},
  {id:'saffron_risotto', name:'Saffron Risotto', requires:{rice:1,saffron:1}, points:220},
  {id:'gold_dessert', name:'Gold Dessert', requires:{flour:1,egg:1,goldleaf:1}, points:400}
];

export function craftRecipe(recipe, state, tryAddIngredient, addPoints, pushLog) {
  const missing = [];
  for(const [rid,c] of Object.entries(recipe.requires)){
    if((state.inventory[rid]||0) < c) missing.push(`${rid} x${c - (state.inventory[rid]||0)}`);
  }
  if(missing.length){ pushLog('Missing ingredients: '+missing.join(', ')); return; }

  for(const [rid,c] of Object.entries(recipe.requires)){
    state.inventory[rid]-=c; if(state.inventory[rid]<=0) delete state.inventory[rid];
  }

  addPoints(recipe.points, `for crafting ${recipe.name}`);
  pushLog(`Crafted ${recipe.name}`);
}
