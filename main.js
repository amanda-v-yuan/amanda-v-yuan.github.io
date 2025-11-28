import { INGREDIENTS } from './data/ingredients.js';
import { RECIPES } from './data/recipes.js';
import { loadState, saveState } from './logic/persistence.js';
import * as inventory from './logic/inventory.js';
import * as boxes from './logic/boxes.js';
import * as crafting from './logic/crafting.js';
import * as marketplace from './logic/marketplace.js';
import * as leveling from './logic/leveling.js';
import * as render from './logic/render.js';

// default state
let state = {
  points:0, inventory:{}, opened:0, log:[], freeBoxes:10, cooldownActive:false, cooldownEndsAt:0, level:1
};
state = loadState(state);

function pushLog(text){ state.log.unshift(`${new Date().toLocaleTimeString()} · ${text}`); if(state.log.length>400) state.log.pop(); saveState(state); }
function addPoints(n, reason){ state.points+=n; if(reason) pushLog(`+${n} pts — ${reason}`); leveling.checkLevelUp(state,pushLog,renderAll); saveState(state); }
function el(id){ return document.getElementById(id); }

function renderAll(){
  render.renderInventory(state, el);
  render.renderPoints(state, el, boxes.BOX_COST, inventory.inventoryCap, leveling.nextLevelPoints);
  render.renderLog(state, el);
}

renderAll();

// Buttons
el('openBoxBtn').addEventListener('click',()=>boxes.openFreeBox(state,pushLog,renderAll,boxes.startCooldown));
el('openPaidBtn').addEventListener('click',()=>boxes.openPaidBox(state,pushLog,renderAll));
el('openPremiumBtn').addEventListener('click',()=>boxes.openPremiumBox(state,pushLog,renderAll));
el('buyBoxBtn').addEventListener('click',()=>boxes.openPaidBox(state,pushLog,renderAll));
el('freeBoxBtn').addEventListener('click',()=>boxes.openFreeBox(state,pushLog,renderAll,boxes.startCooldown));
el('sellAllBtn').addEventListener('click',()=>crafting.sellAll(state, addPoints, pushLog, renderAll));
el('resetBtn').addEventListener('click',()=>{ if(confirm('Reset all?')) { state={points:0,inventory:{},opened:0,log:[],freeBoxes:10,cooldownActive:false,cooldownEndsAt:0,level:1}; saveState(state); renderAll(); } });

el('tradeBtn').addEventListener('click',()=>{
  const give = el('tradeGive').value;
  const rar = el('tradeRarity').value;
  if(!give){ pushLog('No ingredient selected'); renderAll(); return; }
  marketplace.tradeOne(state,give,rar,pushLog,renderAll);
});
