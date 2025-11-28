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
  .rarity-uncommon{bac
