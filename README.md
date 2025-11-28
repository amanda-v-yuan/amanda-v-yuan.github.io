# amanda-v-yuan.github.io
hello
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Vibe Boxes — Ingredient Crafting Game</title>
<style>
  :root{
    --bg:#0f1724; --panel:#0b1220; --muted:#9aa4b2; --accent:#7dd3fc;
    --card:#111827; --good:#10b981; --bad:#ef4444;
  }
  html,body{height:100%; margin:0; font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:linear-gradient(180deg,#061024 0%, #081426 100%); color:#e6eef6;}
  .app{max-width:1100px;margin:18px auto; padding:18px; display:grid; grid-template-columns: 380px 1fr; gap:18px;}
  header{grid-column:1/-1; display:flex; gap:12px; align-items:center;}
  h1{margin:0; font-size:20px;}
  .top-right{margin-left:auto; text-align:right; font-size:14px; color:var(--muted);}
  .panel{background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent); border-radius:12px; padding:12px; box-shadow: 0 6px 20px rgba(2,6,23,0.6);}
  .left{display:flex; flex-direction:column; gap:12px;}
  .stat-row{display:flex; gap:8px; align-items:center;}
  .stat{background:rgba(255,255,255,0.02); padding:8px 10px; border-radius:8px; font-weight:600;}
  button{background:var(--accent); color:#012; border:0; padding:8px 10px; border-radius:10px; cursor:pointer; font-weight:700;}
  button.ghost{background:transparent; color:var(--accent); border:1px solid rgba(125,211,252,0.12);}
  .box{padding:14px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;}
  .inventory{display:flex; flex-wrap:wrap; gap:8px;}
  .ing{min-width:86px; padding:8px; border-radius:8px; text-align:center; font-size:13px;}
  .rarity-common{background:#1f2937; border:1px solid rgba(255,255,255,0.03);}
  .rarity-uncommon{background:#042f2e;}
  .rarity-rare{background:#2b1a4a;}
  .rarity-epic{background:#3a1f12;}
  .small{font-size:12px; color:var(--muted);}
  .main{display:flex; flex-direction:column; gap:12px;}
  .boxes-row{display:flex; gap:8px; align-items:center;}
  .log{max-height:180px; overflow:auto; padding:8px; background:rgba(0,0,0,0.12); border-radius:8px; font-size:13px;}
  .recipes{display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:10px;}
  .recipe{background:rgba(255,255,255,0.02); padding:10px; border-radius:10px;}
  .shop{display:flex; gap:10px; align-items:center;}
  .controls{display:flex; gap:8px; flex-wrap:wrap;}
  .big{font-size:18px; font-weight:800;}
  .muted{color:var(--muted);}
  footer{grid-column:1/-1; text-align:center; color:var(--muted); margin-top:8px; font-size:12px;}
  @media (max-width:900px){ .app{grid-template-columns:1fr; padding:12px;} .left{order:2} .main{order:1} }
</style>
</head>
<body>
<div class="app">
  <header>
    <h1>Vibe Boxes</h1>
    <div class="top-right">
      <div id="pointsDisplay" class="big">Points: 0</div>
      <div class="small">Boxes opened: <span id="openedCount">0</span></div>
    </div>
  </header>

  <section class="left panel">
    <div class="stat-row">
      <div class="stat">Inventory</div>
      <div style="margin-left:auto"><button id="freeBoxBtn" class="ghost">Free box</button></div>
    </div>

    <div id="inventory" class="inventory" style="margin-top:8px;"></div>

    <div style="height:8px"></div>

    <div class="stat-row">
      <div class="stat">Shop</div>
      <div style="margin-left:auto" class="small muted">Buy boxes to open</div>
    </div>
    <div style="margin-top:8px" class="shop">
      <div class="panel" style="padding:10px; flex:1">
        <div class="small muted">Standard Box</div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:6px;">
          <div><strong>Cost: <span id="boxCost">100</span> pts</strong><div class="small muted">Contains 3 ingredients</div></div>
          <div>
            <button id="buyBoxBtn">Buy</button>
          </div>
        </div>
      </div>

      <div class="panel" style="padding:10px; width:210px;">
        <div class="small muted">Quick Actions</div>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <button id="sellAllBtn" class="ghost">Sell all</button>
          <button id="resetBtn" class="ghost">Reset</button>
        </div>
      </div>
    </div>

    <div style="height:10px"></div>

    <div class="stat-row">
      <div class="stat">History</div>
    </div>
    <div id="log" class="log" style="margin-top:8px;"></div>
  </section>

  <main class="main panel">
    <div style="display:flex; gap:12px; align-items:center; justify-content:space-between;">
      <div>
        <div class="small muted">Open boxes to get ingredients</div>
        <div style="display:flex; gap:8px; margin-top:8px;" class="boxes-row">
          <div class="box" style="min-width:230px;">
            <div>
              <div style="font-weight:800">Standard Box</div>
              <div class="small muted">3 random ingredients · mixed rarities</div>
            </div>
            <div>
              <button id="openBoxBtn">Open Box</button>
            </div>
          </div>

          <div class="box" style="min-width:220px;">
            <div>
              <div style="font-weight:800">Premium Box</div>
              <div class="small muted">Higher rare chance · costs more</div>
            </div>
            <div>
              <button id="openPremiumBtn" class="ghost">Open (200 pts)</button>
            </div>
          </div>
        </div>
      </div>

      <div style="width:40%; min-width:220px;">
        <div class="stat">Quick Craft</div>
        <div style="margin-top:8px;" id="quickCrafts"></div>
      </div>
    </div>

    <div style="margin-top:12px;">
      <div class="stat-row"><div class="stat">Recipes</div><div class="small muted" style="margin-left:8px">Craft recipes to earn points</div></div>
      <div style="margin-top:10px" class="recipes" id="recipesGrid"></div>
    </div>
  </main>

  <footer class="muted">Built fast with vibes. Save is automatic (localStorage).</footer>
</div>

<script>
/* -------------------------
   Game data and utilities
   ------------------------- */
const STORAGE_KEY = 'vibeboxes_save_v1';

const INGREDIENTS = [
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
];

// Rarity weights for standard box
const BOX_WEIGHTS = {
  common: 70,
  uncommon: 20,
  rare: 8,
  epic: 2
};

// Premium box increases rare+ epic
const PREMIUM_WEIGHTS = {
  common: 50,
  uncommon: 30,
  rare: 15,
  epic: 5
};

// box cost
const BOX_COST = 100;
const PREMIUM_COST = 200;

// Recipes: name, required {ingredientId: count}, points reward
const RECIPES = [
  {id:'salad', name:'Fresh Salad', requires:{lettuce:1,tomato:1}, points:40},
  {id:'omelette', name:'Omelette', requires:{egg:2,cheese:1}, points:80},
  {id:'truffle_pasta', name:'Truffle Pasta', requires:{flour:1,garlic:1,truffle:1}, points:180},
  {id:'saffron_risotto', name:'Saffron Risotto', requires:{rice:1,saffron:1}, points:220}, // note: rice is missing -> will be unavailable until added
  {id:'gold_dessert', name:'Gold Dessert', requires:{flour:1,egg:1,goldleaf:1}, points:400}
];

// Helper: map ingredients by id
const ING_MAP = Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]));

// If recipe refers to missing ingredient ids (like 'rice') we will mark it locked and not show unless ingredients exist.

// Game state
let state = {
  points: 0,
  inventory: {},  // id -> count
  opened: 0,
  log: []
};

// -------------------------
// Persistence
// -------------------------
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){ console.warn('save failed', e); }
}
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){ state = JSON.parse(raw); }
  }catch(e){ console.warn('load failed', e); }
}
function resetState(){
  state = {points:0, inventory:{}, opened:0, log:[]};
  saveState(); renderAll();
}

// -------------------------
// Random helpers
// -------------------------
function weightedChoice(weights){
  // weights: {key: weight}
  const items = Object.keys(weights);
  const sum = items.reduce((s,k)=>s+weights[k],0);
  let r = Math.random()*sum;
  for(let k of items){
    r -= weights[k];
    if(r <= 0) return k;
  }
  return items[items.length-1];
}

function pickIngredientByRarity(rarity){
  const pool = INGREDIENTS.filter(i=>i.rarity===rarity);
  if(pool.length===0) return null;
  return pool[Math.floor(Math.random()*pool.length)];
}

function pickRandomIngredient(weights){
  const rarity = weightedChoice(weights);
  return pickIngredientByRarity(rarity);
}

/* -------------------------
   Gameplay actions
   ------------------------- */
function giveIngredient(id, count=1){
  if(!ING_MAP[id]) return;
  state.inventory[id] = (state.inventory[id]||0)+count;
  pushLog(`Gained ${count} × ${ING_MAP[id].name}`);
  saveState();
  renderAll();
}

function addPoints(n, reason){
  state.points += n;
  pushLog(`+${n} pts ${reason?('— '+reason):''}`);
  saveState();
  renderAll();
}

function pushLog(text){
  const t = `${new Date().toLocaleTimeString()} · ${text}`;
  state.log.unshift(t);
  if(state.log.length>200) state.log.pop();
  saveState();
}

function openStandardBox(){
  // give 3 ingredients
  for(let i=0;i<3;i++){
    const ing = pickRandomIngredient(BOX_WEIGHTS);
    if(ing) giveIngredient(ing.id,1);
  }
  state.opened++;
  saveState();
  renderAll();
}
function openPremiumBox(){
  for(let i=0;i<4;i++){
    const ing = pickRandomIngredient(PREMIUM_WEIGHTS);
    if(ing) giveIngredient(ing.id,1);
  }
  state.opened++;
  pushLog('Opened premium box');
  saveState();
  renderAll();
}

function buyBox(){
  if(state.points < BOX_COST){ pushLog('Not enough points to buy a box'); return; }
  state.points -= BOX_COST;
  pushLog('Bought a box for ' + BOX_COST + ' pts');
  openStandardBox();
  saveState();
  renderAll();
}
function buyPremium(){
  if(state.points < PREMIUM_COST){ pushLog('Not enough points for premium'); return; }
  state.points -= PREMIUM_COST;
  pushLog('Bought a premium box for ' + PREMIUM_COST + ' pts');
  openPremiumBox();
  saveState();
  renderAll();
}

function craftRecipe(recipeId){
  const recipe = RECIPES.find(r=>r.id===recipeId);
  if(!recipe) return;
  // check availability
  const missing = [];
  for(const [rid, c] of Object.entries(recipe.requires)){
    if((state.inventory[rid]||0) < c) missing.push(`${ING_MAP[rid]?.name || rid} x${c - (state.inventory[rid]||0)}`);
  }
  if(missing.length) {
    pushLog('Missing ingredients: ' + missing.join(', '));
    renderAll();
    return;
  }
  // consume
  for(const [rid, c] of Object.entries(recipe.requires)){
    state.inventory[rid] -= c;
    if(state.inventory[rid] <= 0) delete state.inventory[rid];
  }
  addPoints(recipe.points, `for crafting ${recipe.name}`);
  pushLog(`Crafted ${recipe.name}`);
  saveState();
  renderAll();
}

// Sell all ingredients at small value by rarity
function sellAll(){
  let gained = 0;
  for(const id in state.inventory){
    const count = state.inventory[id];
    const r = ING_MAP[id]?.rarity || 'common';
    let unit = 5;
    if(r==='uncommon') unit = 12;
    if(r==='rare') unit = 40;
    if(r==='epic') unit = 140;
    gained += unit * count;
  }
  if(gained === 0){ pushLog('No ingredients to sell'); return; }
  state.inventory = {};
  addPoints(gained, 'for selling all ingredients');
  pushLog(`Sold everything for ${gained} pts`);
  saveState();
  renderAll();
}

/* -------------------------
   Rendering UI
   ------------------------- */
const el = id=>document.getElementById(id);

function renderInventory(){
  const wrap = el('inventory');
  wrap.innerHTML = '';
  const ids = Object.keys(state.inventory);
  if(ids.length === 0){
    wrap.innerHTML = `<div class="small muted">No ingredients yet — open a box to start</div>`;
    return;
  }
  ids.sort((a,b)=> rarityRank(ING_MAP[b]?.rarity) - rarityRank(ING_MAP[a]?.rarity) );
  for(const id of ids){
    const item = ING_MAP[id] || {name:id, color:'#999', rarity:'common'};
    const count = state.inventory[id];
    const d = document.createElement('div');
    d.className = 'ing rarity-' + (item.rarity||'common');
    d.style.background = `linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))`;
    d.innerHTML = `<div style="font-weight:800">${item.name}</div><div class="small muted">${count} × <span style="font-weight:700">${item.rarity}</span></div>`;
    wrap.appendChild(d);
  }
}

function rarityRank(r){
  if(r==='epic') return 4;
  if(r==='rare') return 3;
  if(r==='uncommon') return 2;
  return 1;
}

function renderPoints(){
  el('pointsDisplay').textContent = `Points: ${state.points}`;
  el('openedCount').textContent = state.opened;
  el('boxCost').textContent = BOX_COST;
}

function renderLog(){
  const node = el('log');
  node.innerHTML = state.log.slice(0,80).map(l => `<div>${l}</div>`).join('');
}

function renderRecipes(){
  const grid = el('recipesGrid');
  grid.innerHTML = '';
  for(const r of RECIPES){
    // check whether all ingredient ids exist in ING_MAP
    const missingIds = Object.keys(r.requires).filter(id=>!ING_MAP[id]);
    if(missingIds.length) continue; // hide recipes that require unknown ingredients
    const card = document.createElement('div');
    card.className = 'recipe';
    const needHtml = Object.entries(r.requires).map(([id,c])=>{
      const name = ING_MAP[id]?.name || id;
      return `<div class="small" style="display:flex; justify-content:space-between;"><span>${name}</span><strong>x${c}</strong></div>`;
    }).join('');
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:800">${r.name}</div><div class="small muted">${r.points} pts</div>
      </div>
      <div style="margin-top:8px">${needHtml}</div>
      <div style="margin-top:8px; display:flex; justify-content:flex-end;">
        <button data-recipe="${r.id}">Craft</button>
      </div>
    `;
    grid.appendChild(card);
  }
  // attach handlers
  grid.querySelectorAll('button[data-recipe]').forEach(b=>{
    b.addEventListener('click', ()=>craftRecipe(b.getAttribute('data-recipe')));
  });
}

function renderQuickCrafts(){
  const quick = el('quickCrafts');
  quick.innerHTML = '';
  // show up to 3 craftable recipes (if player has any required ingredients)
  const craftable = RECIPES.filter(r=>{
    const missing = Object.entries(r.requires).some(([rid,c])=> (state.inventory[rid]||0) < c );
    return !missing && Object.keys(r.requires).every(id=>ING_MAP[id]);
  }).slice(0,3);
  if(craftable.length === 0){
    quick.innerHTML = `<div class="small muted">No quick crafts available — collect ingredients</div>`;
    return;
  }
  for(const r of craftable){
    const box = document.createElement('div');
    box.className = 'panel';
    box.style.padding = '8px';
    box.style.marginBottom = '6px';
    box.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:center;"><div><strong>${r.name}</strong><div class="small muted">${r.points} pts</div></div><div><button data-q="${r.id}">Craft</button></div></div>`;
    quick.appendChild(box);
  }
  quick.querySelectorAll('button[data-q]').forEach(b=>b.addEventListener('click', ()=>craftRecipe(b.getAttribute('data-q'))));
}

function renderAll(){
  renderInventory();
  renderPoints();
  renderLog();
  renderRecipes();
  renderQuickCrafts();
}

// -------------------------
// Init & UI events
// -------------------------
loadState();
renderAll();

el('openBoxBtn').addEventListener('click', ()=>{ openStandardBox(); });
el('openPremiumBtn').addEventListener('click', ()=>{ buyPremium(); }); // use buyPremium to deduct cost
el('buyBoxBtn').addEventListener('click', ()=>{ buyBox(); });
el('freeBoxBtn').addEventListener('click', ()=>{ openStandardBox(); pushLog('Free box used'); saveState(); renderAll(); });
el('sellAllBtn').addEventListener('click', ()=>{ sellAll(); });
el('resetBtn').addEventListener('click', ()=>{ if(confirm('Reset all progress?')) resetState(); });

// small UX: keyboard 'o' opens a box
document.addEventListener('keydown', e=>{
  if(e.key.toLowerCase()==='o') openStandardBox();
  if(e.key.toLowerCase()==='p') buyPremium();
});

// small helpful message on first run
if((state.points||0)===0 && state.opened===0 && Object.keys(state.inventory).length===0){
  pushLog('Welcome! Press "Open Box" to get ingredients. Press "Buy" to buy boxes once you have enough points.');
  saveState();
  renderAll();
}

/* -------------------------
   Extensibility notes:
   - To add ingredients: push to INGREDIENTS and update ING_MAP.
   - To adjust rarities or weights: change BOX_WEIGHTS / PREMIUM_WEIGHTS.
   - To add recipes: add to RECIPES (ensure required ingredient ids exist).
   ------------------------- */
</script>
</body>
</html>
