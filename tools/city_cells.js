// Descobre quais celulas (256x256) do mapa vanilla sao cidade: conta predios do worldmap.xml por celula
// e agrupa pela cidade (rotulo text-town) mais proxima. Uso: node tools/city_cells.js [minPredios] [raio]
const fs = require('fs');
const M = 'C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid/media/maps/Muldraugh, KY/';
const CELL = 256, WMCELL = 300, MIN = +(process.argv[2] || 6), RADIUS = +(process.argv[3] || 2000);
const towns = [...fs.readFileSync(M + 'worldmap-annotations.lua', 'utf8').matchAll(/addUntranslatedText\("MapLabel_(\w+)", "text-town", (-?[\d.]+), (-?[\d.]+)/g)].map(m => ({ name: m[1], x: +m[2], y: +m[3] }));
const xml = fs.readFileSync(M + 'worldmap.xml', 'utf8');
const count = {};
for (const cm of xml.matchAll(/<cell x="(\d+)" y="(\d+)">([\s\S]*?)<\/cell>/g)) {
  const ox = +cm[1] * WMCELL, oy = +cm[2] * WMCELL;
  for (const f of cm[3].matchAll(/<feature>([\s\S]*?)<\/feature>/g)) {
    if (!/name="building"/.test(f[1])) continue;
    const pts = [...f[1].matchAll(/<point x="(-?\d+)" y="(-?\d+)"/g)]; if (!pts.length) continue;
    const x = ox + pts.reduce((s, p) => s + +p[1], 0) / pts.length, y = oy + pts.reduce((s, p) => s + +p[2], 0) / pts.length;
    const k = Math.floor(x / CELL) + ',' + Math.floor(y / CELL); count[k] = (count[k] || 0) + 1;
  }
}
const by = {}; for (const t of towns) by[t.name] = [];
for (const [k, n] of Object.entries(count)) { if (n < MIN) continue; const [cx, cy] = k.split(',').map(Number); const px = (cx + .5) * CELL, py = (cy + .5) * CELL;
  const t = towns.slice().sort((a, b) => Math.hypot(a.x - px, a.y - py) - Math.hypot(b.x - px, b.y - py))[0];
  if (Math.hypot(t.x - px, t.y - py) < RADIUS) by[t.name].push([cx, cy]); }
let total = 0;
for (const [n, cells] of Object.entries(by)) { total += cells.length; const xs = cells.map(c => c[0]), ys = cells.map(c => c[1]);
  console.log(n.padEnd(14), String(cells.length).padStart(3), 'celulas', 'x', Math.min(...xs) + '-' + Math.max(...xs), 'y', Math.min(...ys) + '-' + Math.max(...ys)); }
console.log('total', total, 'celulas de', Object.keys(count).length, 'com algum predio');
fs.writeFileSync(__dirname + '/city_cells.json', JSON.stringify(by));
