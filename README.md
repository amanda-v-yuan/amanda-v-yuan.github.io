<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ingredient Game</title>
<style>
 body {
   font-family: Arial, sans-serif;
   background: #faf7ef;
   margin: 20px;
 }
 h1 {
   margin-top: 0;
 }
 .panel {
   background: white;
   padding: 15px;
   margin-bottom: 20px;
   border-radius: 10px;
   box-shadow: 0 2px 6px rgba(0,0,0,0.1);
 }
 #inventory-cap-warning {
   color: #b30000;
   font-weight: bold;
   display: none;
   margin-bottom: 10px;
 }
 button {
   padding: 8px 12px;
   border-radius: 6px;
   border: none;
   background: #4b79ff;
   color: white;
   cursor: pointer;
 }
 button:disabled {
   background: gray;
 }
 #market-offer {
   border: 2px dashed #666;
   padding: 10px;
   border-radius: 8px;
   margin-top: 10px;
 }
 #market-timer {
   font-size: 14px;
   color: #333;
   margin-top: 5px;
 }
 #crafting-area {
   border: 2px solid #888;
   padding: 10px;
   border-radius: 8px;
   min-height: 50px;
   margin-bottom: 10px;
 }
 .craft-item {
   display: inline-block;
   background: #e3e3ff;
   padding: 5px 10px;
   border-radius: 6px;
   margin-right: 5px;
 }
</style>
</head>
<body>
<h1>Ingredient Box Game</h1>

<div class="panel">
 <h2>Status</h2>
 <p>Level: <span id="level">1</span></p>
 <p>Points: <span id="points">0</span></p>
 <p>Boxes Available: <span id="boxes">10</span></p>
 <p id="cooldown-status"></p>
</div>

<div class="panel">
 <h2>Inventory <span id="inventory-count">0</span>/<span id="inventory-cap">20</span></h2>
 <div id="inventory-cap-warning">Inventory full! Level up to increase storage.</div>
 <ul id="inventory"></ul>
</div>

<div class="panel">
 <h2>Open Boxes</h2>
 <button onclick="openBox()">Open Box</button>
</div>

<div class="panel">
 <h2>Craft a Recipe</h2>
 <p>Select ingredients to craft. Any combo gives points based on rarity.</p>
 <div id="crafting-area"></div>
 <button onclick="craftRecipe()">Craft!</button>
 <p id="craft-result"></p>
</div>

<div class="panel">
 <h2>Marketplace</h2>
 <div id="market-offer">Generating trade offer...</div>
 <div id="market-timer"></div>
</div>

<script>
let boxes = 10;
let boxCooldown = false;
let cooldownTime = 5000;
let level = 1;
let points = 0;
let inventoryCap = 20;
let inventory = {};
let marketTimer = 10;
let currentOffer = null;
let crafting = [];

const ingredientPool = {
  common: ["Flour", "Carrot", "Potato", "Wheat"],
  uncommon: ["Cheese", "Honey", "Garlic"],
  rare: ["Truffle", "Saffron", "Vanilla"]
};

const rarityScore = {
  common: 5,
  uncommon: 12,
  rare: 25
};

function getRarity(ingredient) {
  if (ingredientPool.common.includes(ingredient)) return "common";
  if (ingredientPool.uncommon.includes(ingredient)) return "uncommon";
  return "rare";
}

function updateUI() {
  document.getElementById("boxes").textContent = boxes;
  document.getElementById("level").textContent = level;
  document.getElementById("points").textContent = points;
  document.getElementById("inventory-cap").textContent = inventoryCap;

  const invList = document.getElementById("inventory");
  invList.innerHTML = "";
  let total = 0;

  for (let item in inventory) {
    total += inventory[item];
    const li = document.createElement("li");
    li.innerHTML = `${item}: ${inventory[item]} <button onclick=\"addToCraft('${item}')\">Add</button>`;
    invList.appendChild(li);
  }

  document.getElementById("inventory-count").textContent = total;
  document.getElementById("inventory-cap-warning").style.display = total >= inventoryCap ? "block" : "none";

  renderCrafting();
}

function updateInventoryCap() {
  inventoryCap = 20 + (level - 1) * 20;
}

function addIngredient(name) {
  const total = Object.values(inventory).reduce((a,b)=>a+b,0);
  if (total >= inventoryCap) return false;
  if (!inventory[name]) inventory[name] = 0;
  inventory[name]++;
  return true;
}

function giveRandomIngredient() {
  const rarities = ["common", "common", "uncommon", "rare"]; // weighted
  const rarity = rarities[Math.floor(Math.random() * rarities.length)];
  const pool = ingredientPool[rarity];
  const ingredient = pool[Math.floor(Math.random() * pool.length)];

  if (!addIngredient(ingredient)) {
    alert("Inventory full!");
    return;
  }

  points += 5;
  checkLevelUp();
}

function checkLevelUp() {
  if (points >= level * 100) {
    level++;
    updateInventoryCap();
    alert("Level up! Now level " + level);
  }
}

function openBox() {
  if (boxes <= 0 && boxCooldown) {
    alert("Wait for cooldown!");
    return;
  }

  if (boxes > 0) {
    boxes--;
  } else {
    boxCooldown = true;
    document.getElementById("cooldown-status").textContent = "Cooldown...";
    setTimeout(() => {
      boxCooldown = false;
      boxes++;
      document.getElementById("cooldown-status").textContent = "";
      updateUI();
    }, cooldownTime);
  }

  giveRandomIngredient();
  updateUI();
}

// CRAFTING SYSTEM
function addToCraft(item) {
  if (!inventory[item] || inventory[item] <= 0) return;
  inventory[item]--;
  if (inventory[item] === 0) delete inventory[item];

  crafting.push(item);
  updateUI();
}

function renderCrafting() {
  const c = document.getElementById("crafting-area");
  c.innerHTML = "";
  crafting.forEach(i => {
    const div = document.createElement("div");
    div.className = "craft-item";
    div.textContent = i;
    c.appendChild(div);
  });
}

function craftRecipe() {
  if (crafting.length === 0) {
    document.getElementById("craft-result").textContent = "Add ingredients first!";
    return;
  }

  let total = 0;
  crafting.forEach(i => {
    total += rarityScore[getRarity(i)];
  });

  points += total;
  crafting = [];
  document.getElementById("craft-result").textContent = `Crafted! +${total} points`;

  checkLevelUp();
  updateUI();
}

// MARKETPLACE
function generateMarketOffer() {
  const giveItem = ingredientPool.common[Math.floor(Math.random() * ingredientPool.common.length)];
  const receiveItem = "Cheese";

  currentOffer = { give: giveItem, amountGive: 5, get: receiveItem, amountGet: 1 };
  renderMarketOffer();
}

function renderMarketOffer() {
  const box = document.getElementById("market-offer");
  const o = currentOffer;

  box.innerHTML = `Trade <b>${o.amountGive} ${o.give}</b> for <b>${o.amountGet} ${o.get}</b><br><br>
    <button onclick=\"acceptTrade()\">Accept</button>
    <button onclick=\"rejectTrade()\">Reject</button>`;
}

function acceptTrade() {
  const o = currentOffer;

  if (!inventory[o.give] || inventory[o.give] < o.amountGive) {
    alert("Not enough ingredients!");
    return;
  }

  inventory[o.give] -= o.amountGive;
  if (inventory[o.give] <= 0) delete inventory[o.give];

  for (let i = 0; i < o.amountGet; i++) addIngredient(o.get);

  updateUI();
  rejectTrade();
}

function rejectTrade() {
  currentOffer = null;
  document.getElementById("market-offer").textContent = "New offer in 10 seconds...";
  marketTimer = 10;
}

setInterval(() => {
  if (!currentOffer) {
    marketTimer--;
    if (marketTimer <= 0) generateMarketOffer();
    document.getElementById("market-timer").textContent = `Next offer: ${marketTimer}s`;
  } else {
    document.getElementById("market-timer").textContent = "";
  }
}, 1000);

updateUI();
generateMarketOffer();
</script>
</body>
</html>
