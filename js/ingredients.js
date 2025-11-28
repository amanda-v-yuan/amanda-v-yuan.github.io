export const INGREDIENTS = [
  {id:'tomato', name:'Tomato', rarity:'common'},
  {id:'lettuce', name:'Lettuce', rarity:'common'},
  {id:'flour', name:'Flour', rarity:'common'},
  {id:'egg', name:'Egg', rarity:'uncommon'},
  {id:'cheese', name:'Cheese', rarity:'uncommon'},
  {id:'garlic', name:'Garlic', rarity:'uncommon'},
  {id:'truffle', name:'Truffle', rarity:'rare'},
  {id:'saffron', name:'Saffron', rarity:'rare'},
  {id:'dragonfruit', name:'Dragonfruit', rarity:'epic'},
  {id:'goldleaf', name:'Gold Leaf', rarity:'epic'},
  {id:'rice', name:'Rice', rarity:'common'},
];

// Trade value map (used to balance trades)
export const ING_VALUES = {
  tomato:1, lettuce:1, flour:1, rice:1,
  egg:3, cheese:5, garlic:2,
  truffle:20, saffron:18,
  dragonfruit:50, goldleaf:60
};

// Quick map for id → data
export const ING_MAP = Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]));
