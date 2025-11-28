<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Vibe Boxes — Ingredient Crafting Game (Upgraded)</title>
<style>
  :root{
    --bg:#071022; --panel:#0b1220; --muted:#9aa4b2; --accent:#7dd3fc;
    --card:#111827; --good:#10b981; --bad:#ef4444;
  }
  html,body{height:100%; margin:0; font-family:Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; background:linear-gradient(180deg,#061024 0%, #081426 100%); color:#e6eef6;}
  .app{max-width:1200px;margin:18px auto; padding:18px; display:grid; grid-template-columns:380px 1fr; gap:18px;}
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
  .rarity-uncommon{background:#062c2a;}
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
  .market-row{display:flex; gap:8px; align-items:center; margin-top:8px;}
  .cooldown-bar{height:8px; border-radius:6px; background:rgba(255,255,255,0.04); overflow:hidden;}
  .cooldown-fill{height:100%; width:0%; background:linear-gradient(90deg,var(--accent), #60a5fa);}
  footer{grid-column:1/-1; text-align:center; color:var(--muted); margin-top:8px; font-size:12px;}
  select,input{background:transparent; border:1px solid rgba(255,255,255,0.06); padding:6px 8px; border-radius:8px; color:inherit;}
  label{font-size:12px; color:var(--muted); display:block; margin-bottom:6px;}
  @media (max-width:900px){ .app{grid-template-columns:1fr; padding:12px;} .left{order:2} .main{order:1} }
</style>
</head>
<body>
<div class="app">
  <header>
    <h1>Vibe Boxes — Upgraded</h1>
    <div class="top-right">
      <div id="pointsDisplay" class="big">Points: 0</div>
      <div class="small">Boxes opened: <span id="openedCount">0</span></div>
    </div>
  </header>

  <section class="left panel">
    <div class="stat-row">
      <div class="stat">Inventory</div>
      <div style="margin-left:auto">
        <button id="freeBoxBtn" class="ghost" title="Open a free box (limited/cooldown)">Free box</button>
      </div>
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
      <div class="stat">Marketplace</div>
    </div>
    <div style="margin-top:8px" class="panel">
      <div style="display:flex; gap:8px; align-items:center;">
        <div style="flex:1">
          <label for="tradeGive">Give (from inventory)</label>
          <select id="tradeGive" style="width:100%"></select>
        </div>
        <div style="width:140px">
          <label for="tradeRarity">Receive rarity</label>
          <select id="tradeRarity" style="width:100%">
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
          </select>
        </div>
        <div style="width:110px; display:flex; align-items:flex-end;">
          <button id="tradeBtn">Trade 1 → 1</button>
        </div>
      </div>
      <div class="small muted" style="margin-top:8px">Trade 1 of an ingredient for a random ingredient of chosen rarity. No refunds — trade wisely.</div>
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
              <div style="font-weight:800">Free Box</div>
              <div class="small muted">Limited & cooldowned</div>
            </div>
            <div>
              <button id="openBoxBtn">Open Free</button>
            </div>
          </div>

          <div class="box" style="min-width:220px;">
            <div>
              <div style="font-weight:800">Standard Box</div>
              <div class="small muted">3 random ingredients · mixed rarities</div>
            </div>
            <div>
              <button id="openPaidBtn" class="ghost">Open (Buy)</button>
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

        <div style="margin-top:8px">
          <div class="small muted">Free boxes: <span id="freeBoxesDisplay">0</span> · Cooldown: <span id="cooldownDisplay">ready</span></div>
          <div class="cooldown-bar" style="margin-top:6px;"><div id="cooldownFill" class="cooldown-fill"></div></div>
        </div>
      </div>

      <div style="width:40%; min-width:260px;">
        <div class="stat">Quick Craft & Level</div>
        <div style="margin-top:8px;">
          <div class="small muted">Level: <strong id="levelDisplay">1</strong> · Cap: <strong id="capDisplay">20</strong></div>
          <div class="small muted">Next level at: <span id="nextLevelPts">100</span> pts</div>
          <div id="quickCrafts" style="margin-top:8px"></div>
        </div>
      </div>
    </div>

    <div style="margin-top:12px;">
      <div class="stat-row"><div class="stat">Recipes</div><div class="small muted" style="margin-left:8px">Craft recipes to earn points</div></div>
      <div style="margin-top:10px" class="recipes" id="recipesGrid"></div>
    </div>
  </main>

  <footer class="muted">Built with vibes. Save is automatic (localStorage).</footer>
</div>

<script>
/* -------------------------
   Upgraded Vibe Boxes Game
   - free box count + cooldown
   - marketplace (trade 1->1)
   - inventory cap by level
   - persistence (backwards compatible)
   ------------------------- */

const STORAGE_KEY = 'vibeboxes_save_v2'; // bump key to avoid collisions; loader supports older save

/* ---------- Data ---------- */
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
  {id:'rice', name:'Rice', color:'#fff', rarity:'common'},
];

// Rarity weights for standard box
const BOX_WEIGHTS = { common: 70, uncommon: 20, rare: 8, epic: 2 };
const PREMIUM_WEIGHTS = { common: 50, uncommon: 30, rare: 15, epic: 5 };
const BOX_COST = 100;
const PREMIUM_COST = 200;

// Recipes
const RECIPES = [
  {id:'salad', name:'Fresh Salad', requires:{lettuce:1,tomato:1}, points:40},
  {id:'omelette', name:'Omelette', requires:{egg:2,cheese:1}, points:80},
  {id:'truffle_pasta', name:'Truffle Pasta', requires:{flour:1,garlic:1,truffle:1}, points:180},
  {id:'saffron_risotto', name:'Saffron Risotto', requires:{rice:1,saffron:1}, points:220},
  {id:'gold_dessert', name:'Gold Dessert', requires:{flour:1,egg:1,goldleaf:1}, points:400}
];

const ING_MAP = Object.fromEntries(INGREDIENTS.map(i=>[i.id,i]));

/* ---------- State ---------- */
let state = {
  points: 0,
  inventory: {},
  opened: 0,
  log: [],
  // new fields:
  freeBoxes: 10,
  cooldownActive: false,
  cooldownEndsAt: 0, // timestamp ms
  level: 1,
  // storage versioning not needed beyond key bump, but keep compatibility handler
};

/* ---------- Persistence ---------- */
function saveState(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e){ console.warn('save failed', e); }
}
function loadState(){
  try{
    // try new key
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('vibeboxes_save_v1');
    if(raw){ const parsed = JSON.parse(raw); state = Object.assign(state, parsed); }
  }catch(e){ console.warn('load failed', e); }
}
function resetState(){
  state = {
    points: 0,
    inventory: {},
    opened: 0,
    log: [],
    freeBoxes: 10,
    cooldownActive: false,
    cooldownEndsAt: 0,
    level: 1
  };
  saveState();
  renderAll();
}

/* ---------- Helpers ---------- */
function weightedChoice(weights){
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

/* ---------- Inventory cap & leveling ---------- */
function inventoryTotal(){
  return Object.values(state.inventory).reduce((a,b)=>a+(b||0),0);
}
function inventoryCap(){
  // base cap 20, +20 per level
  return 20 + (state.level - 1) * 20;
}
function nextLevelPoints(){
  // simple scaling: 100 * level
  return 100 * state.level;
}
function tryAddIngredient(id, count = 1){
  const total = inventoryTotal();
  const cap = inventoryCap();
  if(total + count > cap){
    pushLog('Inventory full — cannot add ' + (ING_MAP[id]?.name || id));
    return false;
  }
  state.inventory[id] = (state.inventory[id]||0) + count;
  return true;
}

/* ---------- Gameplay actions ---------- */
function giveIngredient(id, count=1){
  if(!ING_MAP[id]) return;
  if(!tryAddIngredient(id, count)){
    // If inventory full, inform player and skip adding
    saveState();
    renderAll();
    return;
  }
  state.inventory[id] = (state.inventory[id]||0) + count;
  pushLog(`Gained ${count} × ${ING_MAP[id].name}`);
  saveState();
  renderAll();
}
function addPoints(n, reason){
  state.points += n;
  pushLog(`+${n} pts ${reason?('— '+reason):''}`);
  saveState();
  checkLevelUp();
  renderAll();
}
function pushLog(text){
  const t = `${new Date().toLocaleTimeString()} · ${text}`;
  state.log.unshift(t);
  if(state.log.length>400) state.log.pop();
  saveState();
}

/* ---------- Box logic (free with cooldown + paid) ---------- */
const COOLDOWN_MS = 5000; // 5 seconds

function startCooldown(){
  state.cooldownActive = true;
  state.cooldownEndsAt = Date.now() + COOLDOWN_MS;
  saveState();
  updateCooldownVisual();
  const id = setInterval(()=>{
    if(Date.now() >= state.cooldownEndsAt){
      clearInterval(id);
      state.cooldownActive = false;
      state.freeBoxes += 1; // regenerate 1 free box
      state.cooldownEndsAt = 0;
      pushLog('A free box has regenerated');
      saveState();
      renderAll();
    } else {
      updateCooldownVisual();
    }
  }, 100);
}

function openFreeBox(){
  // if freeBoxes available -> immediate
  if(state.freeBoxes > 0){
    // consume one
    state.freeBoxes -= 1;
    // give items
    for(let i=0;i<3;i++){
      const ing = pickRandomIngredient(BOX_WEIGHTS);
      if(ing) giveIngredient(ing.id, 1);
    }
    state.opened++;
    pushLog('Opened a free box');
    // if now zero, start cooldown to regenerate 1 box after delay
    if(state.freeBoxes <= 0 && !state.cooldownActive){
      startCooldown();
    }
    saveState();
    renderAll();
    return;
  }

  // no free boxes available
  if(state.cooldownActive){
    pushLog('Free box on cooldown — wait a moment');
    renderAll();
    return;
  }

  // fallback: if no freeBoxes and not on cooldown, start cooldown and deny open until regen
  startCooldown();
  pushLog('No free boxes — cooldown started');
  renderAll();
}

function openPaidBox(){
  if(state.points < BOX_COST){ pushLog('Not enough points to buy box'); renderAll(); return; }
  state.points -= BOX_COST;
  pushLog('Bought a standard box for ' + BOX_COST + ' pts');
  for(let i=0;i<3;i++){
    const ing = pickRandomIngredient(BOX_WEIGHTS);
    if(ing) giveIngredient(ing.id,1);
  }
  state.opened++;
  saveState();
  checkLevelUp();
  renderAll();
}

function openPremiumBox(){
  if(state.points < PREMIUM_COST){ pushLog('Not enough points for premium'); renderAll(); return; }
  state.points -= PREMIUM_COST;
  pushLog('Bought a premium box for ' + PREMIUM_COST + ' pts');
  for(let i=0;i<4;i++){
    const ing = pickRandomIngredient(PREMIUM_WEIGHTS);
    if(ing) giveIngredient(ing.id,1);
  }
  state.opened++;
  saveState();
  checkLevelUp();
  renderAll();
}

/* ---------- Crafting & selling ---------- */
function craftRecipe(recipeId){
  const recipe = RECIPES.find(r=>r.id===recipeId);
  if(!recipe) return;
  const missing = [];
  for(const [rid,c] of Object.entries(recipe.requires)){
    if((state.inventory[rid]||0) < c) missing.push(`${ING_MAP[rid]?.name || rid} x${c - (state.inventory[rid]||0)}`);
  }
  if(missing.length){
    pushLog('Missing ingredients: ' + missing.join(', '));
    renderAll();
    return;
  }
  for(const [rid,c] of Object.entries(recipe.requires)){
    state.inventory[rid] -= c;
    if(state.inventory[rid] <= 0) delete state.inventory[rid];
  }
  addPoints(recipe.points, `for crafting ${recipe.name}`);
  pushLog(`Crafted ${recipe.name}`);
  saveState();
  renderAll();
}
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
  if(gained === 0){ pushLog('No ingredients to sell'); renderAll(); return; }
  state.inventory = {};
  addPoints(gained, 'for selling all ingredients');
  pushLog(`Sold everything for ${gained} pts`);
  saveState();
  renderAll();
}

/* ---------- Marketplace (trade 1 -> 1) ---------- */
function tradeOne(giveId, receiveRarity){
  if(!state.inventory[giveId] || state.inventory[giveId] <= 0){
    pushLog("You don't have that ingredient to trade.");
    renderAll();
    return;
  }
  // remove one
  state.inventory[giveId] -= 1;
  if(state.inventory[giveId] <= 0) delete state.inventory[giveId];
  // pick a random ingredient of desired rarity
  const pool = INGREDIENTS.filter(i=>i.rarity === receiveRarity);
  if(pool.length === 0){
    pushLog('No ingredients available for that rarity.');
    renderAll();
    return;
  }
  const newIng = pool[Math.floor(Math.random() * pool.length)];
  // attempt to add (respect cap)
  if(!tryAddIngredient(newIng.id, 1)){
    // if cannot add because full, refund the given item
    state.inventory[giveId] = (state.inventory[giveId]||0) + 1;
    pushLog('Trade failed — inventory full. Trade cancelled.');
    saveState();
    renderAll();
    return;
  }
  state.inventory[newIng.id] = (state.inventory[newIng.id]||0) + 1;
  pushLog(`Traded 1 ${ING_MAP[giveId]?.name || giveId} → 1 ${newIng.name} (rarity ${receiveRarity})`);
  saveState();
  renderAll();
}

/* ---------- Leveling ---------- */
function checkLevelUp(){
  const needed = nextLevelPoints();
  if(state.points >= needed){
    state.level += 1;
    pushLog(`Leveled up! Now level ${state.level}. Inventory cap increased to ${inventoryCap()}.`);
    saveState();
    // optionally grant a free box on level up
    state.freeBoxes += 1;
    saveState();
    renderAll();
    // recursively check for multi-level ups
    checkLevelUp();
  }
}

/* ---------- Rendering ---------- */
const el = id => document.getElementById(id);

function rarityRank(r){
  if(r==='epic') return 4;
  if(r==='rare') return 3;
  if(r==='uncommon') return 2;
  return 1;
}

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

function renderPoints(){
  el('pointsDisplay').textContent = `Points: ${state.points}`;
  el('openedCount').textContent = state.opened;
  el('boxCost').textContent = BOX_COST;
  el('levelDisplay').textContent = state.level;
  el('capDisplay').textContent = inventoryCap();
  el('nextLevelPts').textContent = nextLevelPoints();
  el('freeBoxesDisplay').textContent = state.freeBoxes;
  el('cooldownDisplay').textContent = state.cooldownActive ? `in ${Math.max(0, Math.ceil((state.cooldownEndsAt - Date.now())/1000))}s` : 'ready';
}

function renderLog(){
  const node = el('log');
  node.innerHTML = state.log.slice(0,160).map(l => `<div>${l}</div>`).join('');
}

function renderRecipes(){
  const grid = el('recipesGrid');
  grid.innerHTML = '';
  for(const r of RECIPES){
    const missingIds = Object.keys(r.requires).filter(id=>!ING_MAP[id]);
    if(missingIds.length) continue; // hide if missing ingredient
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
  grid.querySelectorAll('button[data-recipe]').forEach(b=>{
    b.addEventListener('click', ()=>craftRecipe(b.getAttribute('data-recipe')));
  });
}

function renderQuickCrafts(){
  const quick = el('quickCrafts');
  quick.innerHTML = '';
  const craftable = RECIPES.filter(r=>{
    const missing = Object.entries(r.requires).some(([rid,c])=> (state.inventory[rid]||0) < c );
    return !missing;
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

function renderMarketplaceGiveOptions(){
  const sel = el('tradeGive');
  sel.innerHTML = '';
  const ids = Object.keys(state.inventory);
  if(ids.length === 0){
    sel.innerHTML = `<option value="">(no ingredients)</option>`;
    return;
  }
  ids.sort((a,b)=> rarityRank(ING_MAP[b]?.rarity) - rarityRank(ING_MAP[a]?.rarity));
  for(const id of ids){
    const name = ING_MAP[id]?.name || id;
    const count = state.inventory[id];
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${name} x${count} (${ING_MAP[id]?.rarity||'common'})`;
    sel.appendChild(opt);
  }
}

/* ---------- Cooldown visual ---------- */
function updateCooldownVisual(){
  const fill = el('cooldownFill');
  if(!state.cooldownActive || state.cooldownEndsAt <= Date.now()){
    fill.style.width = '0%';
    return;
  }
  const left = state.cooldownEndsAt - Date.now();
  const pct = Math.max(0, Math.min(100, (1 - left / COOLDOWN_MS) * 100));
  fill.style.width = pct + '%';
}

/* ---------- Render all ---------- */
function renderAll(){
  renderInventory();
  renderPoints();
  renderLog();
  renderRecipes();
  renderQuickCrafts();
  renderMarketplaceGiveOptions();
  updateCooldownVisual();
}

/* ---------- Init & events ---------- */
loadState();
renderAll();

el('openBoxBtn').addEventListener('click', ()=>openFreeBox());
el('openPaidBtn').addEventListener('click', ()=>openPaidBox());
el('openPremiumBtn').addEventListener('click', ()=>openPremiumBox());
el('buyBoxBtn').addEventListener('click', ()=>openPaidBox());
el('freeBoxBtn').addEventListener('click', ()=>openFreeBox());
el('sellAllBtn').addEventListener('click', ()=>sellAll());
el('resetBtn').addEventListener('click', ()=>{ if(confirm('Reset all progress?')) resetState(); });

el('tradeBtn').addEventListener('click', ()=>{
  const give = el('tradeGive').value;
  const rar = el('tradeRarity').value;
  if(!give){ pushLog('No ingredient selected to trade'); renderAll(); return; }
  tradeOne(give, rar);
});

// keyboard shortcuts
document.addEventListener('keydown', e=>{
  if(e.key.toLowerCase()==='o') openFreeBox();
  if(e.key.toLowerCase()==='p') openPremiumBox();
});

/* first-run welcome */
if((state.points||0)===0 && state.opened===0 && Object.keys(state.inventory).length===0){
  pushLog('Welcome! You start with 10 free boxes. After they run out, wait 5s to regenerate 1 free box.');
  saveState();
  renderAll();
}

/* make sure cooldown resumes if page reloads while active */
if(state.cooldownActive && state.cooldownEndsAt > Date.now()){
  // resume visual & timer
  const id = setInterval(()=>{
    if(Date.now() >= state.cooldownEndsAt){
      clearInterval(id);
      state.cooldownActive = false;
      state.freeBoxes += 1;
      state.cooldownEndsAt = 0;
      pushLog('A free box has regenerated');
      saveState();
      renderAll();
    } else {
      updateCooldownVisual();
    }
  }, 100);
} else {
  // clear stray flags
  if(state.cooldownActive && state.cooldownEndsAt <= Date.now()){
    state.cooldownActive = false;
    state.cooldownEndsAt = 0;
    saveState();
    renderAll();
  }
}
</script>
</body>
</html>
