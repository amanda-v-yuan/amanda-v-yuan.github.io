import { ING_MAP, ING_VALUES, INGREDIENTS } from './ingredients.js';
import { RECIPES, craftRecipe } from './recipes.js';
import { renderAll } from './render.js';

/* -------------------- */
/* ---- State --------- */
let state = {
  points: 0,
  inventory: {},
  opened: 0,
  log: [],
  freeBoxes: 10,
  cooldownActive: false,
  cooldownEndsAt: 0,
  level: 1
};

/* -------------------- */
/* ---- DOM Elements -- */
const elements = {
  inventory: document.getElementById('inventory'),
  pointsDisplay: document.getElementById('pointsDisplay'),
  openedCount: document.getElementById('openedCount'),
  recipesGrid: document.getElementById('recipesGrid'),
  log: document.getElementById('log'),
  tradeBox: document.getElementById('marketplace'),
  tradeText: document.getElementById('trade-text'),
  tradeConfirm: document.getElementById('trade-confirm'),
  tradeDecline: document.getElementById('trade-decline'),
  boxCost: document.getElementById('boxCost')
};

/* -------------------- */
/* ---- Persistence --- */
const STORAGE_KEY = 'vibeboxes_save_v2';

function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw) state = Object.assign(state, JSON.parse(raw));
}

/* -------------------- */
/* ---- Inventory ----- */
function inventoryTotal(){ return Object.values(state.inventory).reduce((a,b)=>a+(b||0),0); }
function inventoryCap(){ return 20 + (state.level-1)*20; }

function tryAddIngredient(id, count=1){
  const total = inventoryTotal();
  if(total + count > inventoryCap()) return false;
  state.inventory[id] = (state.inventory[id]||0) + count;
  return true;
}

function addIngredient(id, count=1){
  if(!tryAddIngredient(id,count)){
    flashInventoryCap();
    pushLog(`Inventory full! Cannot add ${ING_MAP[id]?.name||id}`);
    return false;
  }
  pushLog(`Gained ${count}x ${ING_MAP[id]?.name||id}`);
  saveState();
  renderAll(state, elements);
  return true;
}

function flashInventoryCap(){
  elements.inventory.classList.add('cap-alert');
  setTimeout(()=>elements.inventory.classList.remove('cap-alert'),500);
}

/* -------------------- */
/* ---- Points -------- */
function addPointsToState(n, reason=''){
  state.points += n;
  pushLog(`+${n} pts${reason ? ' — '+reason : ''}`);
  saveState();
  checkLevelUp();
  renderAll(state, elements);
}

/* -------------------- */
/* ---- Log ----------- */
function pushLog(text){
  const entry = `${new Date().toLocaleTimeString()} · ${text}`;
  state.log.unshift(entry);
  if(state.log.length>400) state.log.pop();
  saveState();
}

/* -------------------- */
/* ---- Leveling ------ */
function nextLevelPoints(){ return 100*state.level; }

function checkLevelUp(){
  while(state.points>=nextLevelPoints()){
    state.level++;
    pushLog(`Leveled up! Inventory cap now ${inventoryCap()}.`);
    state.freeBoxes += 1; // bonus free box
    saveState();
  }
}

/* -------------------- */
/* ---- Boxes --------- */
const BOX_COST=100, PREMIUM_COST=200;
const BOX_WEIGHTS={common:70,uncommon:20,rare:8,epic:2};
const PREMIUM_WEIGHTS={common:50,uncommon:30,rare:15,epic:5};
const COOLDOWN_MS=5000;

function weightedChoice(weights){
  const items = Object.keys(weights);
  const sum = items.reduce((s,k)=>s+weights[k],0);
  let r=Math.random()*sum;
  for(const k of items){ r-=weights[k]; if(r<=0) return k; }
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

function startCooldown(){
  state.cooldownActive = true;
  state.cooldownEndsAt = Date.now()+COOLDOWN_MS;
  saveState();

  const id = setInterval(()=>{
    if(Date.now()>=state.cooldownEndsAt){
      clearInterval(id);
      state.cooldownActive=false;
      state.freeBoxes+=1;
      state.cooldownEndsAt=0;
      pushLog('A free box has regenerated');
      saveState();
      renderAll(state, elements);
    } else { renderAll(state, elements); }
  },100);
}

function openFreeBox(){
  if(state.freeBoxes>0){
    state.freeBoxes--;
    for(let i=0;i<3;i++){ const ing=pickRandomIngredient(BOX_WEIGHTS); if(ing) addIngredient(ing.id,1);}
    state.opened++;
    pushLog('Opened a free box');
    if(state.freeBoxes<=0 && !state.cooldownActive) startCooldown();
    saveState(); renderAll(state,elements);
    return;
  }
  if(state.cooldownActive){ pushLog('Free box on cooldown'); renderAll(state,elements); return; }
  startCooldown();
  pushLog('No free boxes — cooldown started'); renderAll(state,elements);
}

function openPaidBox(){
  if(state.points<BOX_COST){ pushLog('Not enough points'); renderAll(state,elements); return; }
  state.points-=BOX_COST; pushLog('Bought standard box');
  for(let i=0;i<3;i++){ const ing=pickRandomIngredient(BOX_WEIGHTS); if(ing) addIngredient(ing.id,1);}
  state.opened++; saveState(); checkLevelUp(); renderAll(state,elements);
}

function openPremiumBox(){
  if(state.points<PREMIUM_COST){ pushLog('Not enough points'); renderAll(state,elements); return; }
  state.points-=PREMIUM_COST; pushLog('Bought premium box');
  for(let i=0;i<4;i++){ const ing=pickRandomIngredient(PREMIUM_WEIGHTS); if(ing) addIngredient(ing.id,1);}
  state.opened++; saveState(); checkLevelUp(); renderAll(state,elements);
}

/* -------------------- */
/* ---- Sell All ------ */
function sellAll(){
  let gained=0;
  for(const id in state.inventory){
    const count=state.inventory[id];
    const val=ING_VALUES[id]||1;
    gained += val*count;
  }
  if(gained===0){ pushLog('No ingredients to sell'); renderAll(state,elements); return; }
  state.inventory={};
  addPointsToState(gained,'for selling all ingredients');
  pushLog(`Sold all ingredients for ${gained} pts`);
}

/* -------------------- */
/* ---- Trade --------- */
let currentTrade=null;
let tradeCooldown=false;

function generateTradeOffer(){
  const ids = Object.keys(ING_MAP);
  const giveId = ids[Math.floor(Math.random()*ids.length)];
  let receiveId=ids[Math.floor(Math.random()*ids.length)];
  if(giveId===receiveId) return generateTradeOffer();
  const giveVal=ING_VALUES[giveId]||1;
  const receiveVal=ING_VALUES[receiveId]||1;
  const qtyGive=Math.max(1,Math.round(receiveVal/giveVal));
  return {giveId, receiveId, qtyGive, qtyReceive:1};
}

function showTrade(){
  if(tradeCooldown) return;
  currentTrade = generateTradeOffer();
  elements.tradeText.textContent=`Trade ${currentTrade.qtyGive}x ${ING_MAP[currentTrade.giveId].name} → ${currentTrade.qtyReceive}x ${ING_MAP[currentTrade.receiveId].name}?`;
  elements.tradeBox.style.display='block';
}

function hideTrade(){ elements.tradeBox.style.display='none'; }

function confirmTrade(){
  const t=currentTrade;
  if(!t) return;
  if((state.inventory[t.giveId]||0)<t.qtyGive){
    pushLog(`Not enough ${ING_MAP[t.giveId].name}`); flashInventoryCap(); return;
  }
  state.inventory[t.giveId]-=t.qtyGive;
  if(state.inventory[t.giveId]<=0) delete state.inventory[t.giveId];
  tryAddIngredient(t.receiveId,t.qtyReceive);
  pushLog(`Traded ${t.qtyGive} ${ING_MAP[t.giveId].name} → ${t.qtyReceive} ${ING_MAP[t.receiveId].name}`);
  hideTrade();
  tradeCooldown=true;
  setTimeout(()=>{ tradeCooldown=false; showTrade(); },10000);
  renderAll(state,elements);
}

function declineTrade(){
  pushLog('Trade declined. New offer in 10s');
  hideTrade();
  tradeCooldown=true;
  setTimeout(()=>{ tradeCooldown=false; showTrade(); },10000);
}

/* -------------------- */
/* ---- Reset -------- */
function resetState(){
  if(!confirm('Reset all progress?')) return;
  state={points:0,inventory:{},opened:0,log:[],freeBoxes:10,cooldownActive:false,cooldownEndsAt:0,level:1};
  saveState(); renderAll(state,elements);
}

/* -------------------- */
/* ---- Init --------- */
loadState(); renderAll(state,elements);
elements.tradeConfirm.onclick=confirmTrade;
elements.tradeDecline.onclick=declineTrade;

document.getElementById('openBoxBtn').addEventListener('click',openFreeBox);
document.getElementById('freeBoxBtn').addEventListener('click',openFreeBox);
document.getElementById('openPaidBtn').addEventListener('click',openPaidBox);
document.getElementById('buyBoxBtn').addEventListener('click',openPaidBox);
document.getElementById('openPremiumBtn').addEventListener('click',openPremiumBox);
document.getElementById('sellAllBtn').addEventListener('click',sellAll);
document.getElementById('resetBtn').addEventListener('click',resetState);

// first run welcome
if(state.points===0 && state.opened===0 && Object.keys(state.inventory).length===0){
  pushLog('Welcome! You start with 10 free boxes. After they run out, wait 5s to regenerate 1 free box.');
  saveState(); renderAll(state,elements);
}

// resume cooldown if page reloads
if(state.cooldownActive && state.cooldownEndsAt>Date.now()){
  const id = setInterval(()=>{
    if(Date.now()>=state.cooldownEndsAt){
      clearInterval(id);
      state.cooldownActive=false; state.freeBoxes+=1; state.cooldownEndsAt=0;
      pushLog('A free box has regenerated'); saveState(); renderAll(state,elements);
    } else renderAll(state,elements);
  },100);
}

// show first trade
showTrade();
