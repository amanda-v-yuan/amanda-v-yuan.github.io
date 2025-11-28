// -----------------------------
// INGREDIENTS
// -----------------------------
const INGREDIENTS = {
  flour: { name: "Flour", value: 2 },
  milk: { name: "Milk", value: 3 },
  cheese: { name: "Cheese", value: 12 },
  bread: { name: "Bread", value: 10 }
};

// -----------------------------
// RECIPES
// -----------------------------
const RECIPES = [
  {
    id: "bread",
    name: "Bake Bread",
    requires: { flour: 3 },
    produces: { bread: 1 },
    points: 5
  },
  {
    id: "cheese",
    name: "Make Cheese",
    requires: { milk: 5 },
    produces: { cheese: 1 },
    points: 12
  }
];

// -----------------------------
// SIMPLE TRADES
// -----------------------------
const TRADES = [
  {
    id: "flourForCheese",
    give: "flour",
    giveAmount: 5,
    get: "cheese",
    getAmount: 1,
  }
];

// -----------------------------
// BOX DROP RATES
// -----------------------------
const FREE_BOX = ["flour", "milk"];
const PAID_BOX = ["flour", "milk", "cheese"];
const PREMIUM_BOX = ["flour", "milk", "cheese", "bread"];
