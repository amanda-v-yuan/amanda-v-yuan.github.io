// ingredients.js
export const INGREDIENTS = [
  {id:'tomato', name:'Tomato', color:'#ef4444', rarity:'common'},
  {id:'lettuce', name:'Lettuce', color:'#16a34a', rarity:'common'},
  {id:'flour', name:'Flour', color:'#f3f4f6', rarity:'common'},
  {id:'egg', name:'Egg', color:'#f59e0b', rarity:'uncommon'},
  {id:'cheese', name:'Cheese', color:'#fbbf24', rarity:'uncommon'},
  {id:'garlic', name:'Garlic', color:'#f8fafc', rarity:'uncommon'},
  {id:'truffle', name:'Truffle', color:'#7c3aed', rarity:'rare'},
  {id:'saffron', name:'Saffron', color:'#f97316', rarity:'rare'},
  {id:'dragonfruit', name:'Dragonfruit', color:'#ec4899', rarity:'epic'},
  {id:'goldleaf', name:'Gold Leaf', color:'#fcd34d', rarity:'epic'},
  {id:'rice', name:'Rice', color:'#fff', rarity:'common'},
];

export const BOX_WEIGHTS = { common: 70, uncommon: 20, rare: 8, epic: 2 };
export const PREMIUM_WEIGHTS = { common: 50, uncommon: 30, rare: 15, epic: 5 };
export const BOX_COST = 100;
export const PREMIUM_COST = 200;

export const RECIPES = [
  {id:'salad', name:'Fresh Salad', requires:{lettuce:1,tomato:1}, points:40},
  {id:'omelette', name:'Omelette', requires:{egg:2,cheese:1}, points:80},
  {id:'truffle_pasta', name:'Truffle Pasta', requires:{flour:1,garlic:1,truffle:1}, points:180},
  {id:'saffron_risotto', name:'Saffron Risotto', requires:{rice:1,saffron:1}, points:220},
  {id:'gold_dessert', name:'Gold Dessert', requires:{flour:1,egg:1,goldleaf:1}, points:400}
];

export const ING_MAP = Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]));
