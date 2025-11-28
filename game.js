// --------------------------------------
// STATE
// --------------------------------------
const state = {
  inventory: {},
  log: "",
  points: 0
};

function addToInventory(id, amount = 1) {
  state.inventory[id] = (state.inventory[id] || 0) + amount;
}

function log(msg) {
  state.log = msg;
  render();
}

// --------------------------------------
// RANDOM PICK
// --------------------------------------
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --------------------------------------
// BOXES
// --------------------------------------
function openFreeBox() {
  const item = pick(FREE_BOX);
  addToInventory(item, 1);
  log(`Opened Free Box → ${INGREDIENTS[item].name}`);
}

function openPaidBox() {
  const item = pick(PAID_BOX);
  addToInventory(item, 1);
  log(`Opened Paid Box → ${INGREDIENTS[item].name}`);
}

function openPremiumBox() {
  const item = pick(PREMIUM_BOX);
  addToInventory(item, 1);
  log(`Opened Premium Box → ${INGREDIENTS[item].name}`);
}

// --------------------------------------
// CRAFTING
// --------------------------------------
function craft(id) {
  const recipe = RECIPES.find(r => r.id === id);
  if (!recipe) return;

  // Check ingredients
  for (const [rid, amt] of Object.entries(recipe.requires)) {
    if ((state.inventory[rid] || 0) < amt) {
      log(`Missing ${INGREDIENTS[rid].name}`);
      return;
    }
  }

  // Remove
  for (const [rid, amt] of Object.entries(recipe.requires)) {
    state.inventory[rid] -= amt;
  }

  // Add outputs
  for (const [rid, amt] of Object.entries(recipe.produces)) {
    addToInventory(rid, amt);
  }

  state.points += recipe.points || 0;

  log(`Crafted ${recipe.name}!`);
}

// --------------------------------------
// TRADING
// --------------------------------------
function trade(id) {
  const t = TRADES.find(t => t.id === id);
  if (!t) return;

  if ((state.inventory[t.give] || 0) < t.giveAmount) {
    log(`Not enough ${INGREDIENTS[t.give].name}`);
    return;
  }

  state.inventory[t.give] -= t.giveAmount;
  addToInventory(t.get, t.getAmount);

  log(`Traded ${t.giveAmount} ${INGREDIENTS[t.give].name} → ${t.getAmount} ${INGREDIENTS[t.get].name}`);
}

// --------------------------------------
// RENDER
// --------------------------------------
function renderInventory() {
  const inv = document.getElementById("inventory");
  inv.innerHTML = "";

  for (const [id, amt] of Object.entries(state.inventory)) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${INGREDIENTS[id].name}</strong><br>Qty: ${amt}`;
    inv.appendChild(div);
  }
}

function renderRecipes() {
  const container = document.getElementById("recipes");
  container.innerHTML = "";

  RECIPES.forEach(r => {
    const div = document.createElement("div");
    div.className = "recipe-card";

    const reqText = Object.entries(r.requires)
      .map(([id, amt]) => `${INGREDIENTS[id].name} x${amt}`)
      .join(", ");

    div.innerHTML = `
      <strong>${r.name}</strong><br>
      Needs: ${reqText}<br><br>
      <button onclick="craft('${r.id}')">Craft</button>
    `;

    container.appendChild(div);
  });
}

function renderTrades() {
  const container = document.getElementById("trades");
  container.innerHTML = "";

  TRADES.forEach(t => {
    const div = document.createElement("div");
    div.className = "trade-card";

    div.innerHTML = `
      <strong>Trade</strong><br>
      Give: ${INGREDIENTS[t.give].name} x${t.giveAmount}<br>
      Get: ${INGREDIENTS[t.get].name} x${t.getAmount}<br><br>
      <button onclick="trade('${t.id}')">Trade</button>
    `;

    container.appendChild(div);
  });
}

function render() {
  renderInventory();
  renderRecipes();
  renderTrades();
  document.getElementById("log").textContent = state.log;
}

// --------------------------------------
// EVENT LISTENERS
// --------------------------------------
document.getElementById("freeBoxBtn").onclick = openFreeBox;
document.getElementById("paidBoxBtn").onclick = openPaidBox;
document.getElementById("premiumBoxBtn").onclick = openPremiumBox;

// Initial render
render();
