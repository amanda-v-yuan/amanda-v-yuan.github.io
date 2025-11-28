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

export const ING_MAP = Object.fromEntries(INGREDIENTS.map(i => [i.id, i]));
