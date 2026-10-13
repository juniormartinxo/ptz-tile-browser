// PZ Tile Browser - extrator. Uso: node build.js
// Le media/texturepacks/*.pack (PZPK) + media/*.tiles (tdef) + Translate/*/Moveables.json
// e gera atlas/*.png + data/tiles.js para a index.html.
const fs = require('fs'), path = require('path');
const GAME = 'C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid';
const HOME = process.env.USERPROFILE.replace(/\\/g, '/');
const OUT = __dirname;
const ATLAS = path.join(OUT, 'atlas'); fs.mkdirSync(ATLAS, { recursive: true });
fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });

// ---------- .pack ----------
const images = new Map(); // textureName -> {page,x,y,w,h,ox,oy,fw,fh}
function readPack(file, tag) {
  const fd = fs.openSync(file, 'r'); let pos = 0; const b4 = Buffer.alloc(4);
  const i32 = () => { fs.readSync(fd, b4, 0, 4, pos); pos += 4; return b4.readInt32LE(0); };
  const str = () => { const n = i32(); const b = Buffer.alloc(n); fs.readSync(fd, b, 0, n, pos); pos += n; return b.toString('latin1'); };
  const magic = Buffer.alloc(4); fs.readSync(fd, magic, 0, 4, 0); pos = 4;
  if (magic.toString() !== 'PZPK') { console.log('nao e PZPK:', file); fs.closeSync(fd); return 0; }
  i32(); const pages = i32(); let n = 0;
  for (let p = 0; p < pages; p++) {
    const name = str(); const cnt = i32(); i32();
    const pageName = (tag ? tag + '__' : '') + name.replace(/[^A-Za-z0-9_.-]/g, '_');
    for (let e = 0; e < cnt; e++) {
      const en = str(); const v = []; for (let k = 0; k < 8; k++) v.push(i32());
      if (!images.has(en)) { images.set(en, { page: pageName, x: v[0], y: v[1], w: v[2], h: v[3], ox: v[4], oy: v[5], fw: v[6], fh: v[7] }); n++; }
    }
    const len = i32(); const out = path.join(ATLAS, pageName + '.png');
    if (!fs.existsSync(out) || fs.statSync(out).size !== len) {
      const png = Buffer.alloc(len); fs.readSync(fd, png, 0, len, pos); fs.writeFileSync(out, png);
    }
    pos += len;
  }
  fs.closeSync(fd); return n;
}

// ---------- .tiles ----------
const tilesets = []; // {name, image, cols, rows, source}
const tiles = new Map(); // tileName -> {ts, idx, props}
function readTiles(file, source) {
  const buf = fs.readFileSync(file); let pos = 0;
  const i32 = () => { const v = buf.readInt32LE(pos); pos += 4; return v; };
  const str = () => { let e = buf.indexOf(0x0a, pos); if (e < 0) e = buf.length; const s = buf.toString('latin1', pos, e); pos = e + 1; return s.trim(); };
  if (buf.toString('latin1', 0, 4) !== 'tdef') { console.log('nao e tdef:', file); return 0; }
  pos = 4; i32(); const nts = i32(); let n = 0;
  for (let t = 0; t < nts; t++) {
    const name = str(), image = str(), cols = i32(), rows = i32(); i32(); const cnt = i32();
    let ts = tilesets.findIndex(x => x.name === name);
    if (ts < 0) { ts = tilesets.length; tilesets.push({ name, image, cols, rows, source }); }
    for (let i = 0; i < cnt; i++) {
      const np = i32(); const props = {};
      for (let k = 0; k < np; k++) { const key = str(); const val = str(); props[key] = val; }
      const tn = name + '_' + i;
      const ex = tiles.get(tn);
      if (ex) Object.assign(ex.props, props); else { tiles.set(tn, { ts, idx: i, props }); n++; }
    }
  }
  return n;
}

// ---------- vanilla ----------
console.log('packs vanilla...');
for (const p of ['Tiles2x.pack', 'Tiles2x.floor.pack']) console.log(' ', p, readPack(path.join(GAME, 'media/texturepacks', p), ''));
console.log('tiledefs vanilla...');
for (const t of ['newtiledefinitions.tiles', 'tiledefinitions_erosion.tiles', 'tiledefinitions_overlays.tiles', 'tiledefinitions_b42chunkcaching.tiles'])
  console.log(' ', t, readTiles(path.join(GAME, 'media', t), 'vanilla'));

// ---------- mods (pack= / tiledef= no mod.info) ----------
function findModInfos() {
  const roots = [HOME + '/Zomboid/mods', 'C:/Program Files (x86)/Steam/steamapps/workshop/content/108600'];
  const found = [];
  const walk = (dir, depth) => {
    if (depth > 5) return; let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (!['media', 'atlas', 'data'].includes(e.name)) walk(p, depth + 1); }
      else if (e.name === 'mod.info') found.push(p);
    }
  };
  for (const r of roots) walk(r, 0);
  return found;
}
const ARGS = process.argv.slice(2); const VANILLA_ONLY = ARGS.includes('--vanilla');
const SKIP = (ARGS.find(a => a.startsWith('--skip=')) || '').slice(7).split(',').filter(Boolean).map(x => x.toLowerCase());
console.log('mods...' + (VANILLA_ONLY ? ' (pulados: --vanilla)' : ''));
const modsSeen = new Set();
for (const info of findModInfos()) {
  const txt = fs.readFileSync(info, 'latin1');
  const id = ((txt.match(/^id=(.*)$/m) || [])[1] || '').trim(); const name = ((txt.match(/^name=(.*)$/m) || [])[1] || id).trim();
  const packs = [...txt.matchAll(/^pack=(.*)$/mg)].map(m => m[1].trim());
  const defs = [...txt.matchAll(/^tiledef=(\S+)/mg)].map(m => m[1].trim());
  if (!packs.length && !defs.length) continue;
  if (VANILLA_ONLY || SKIP.some(x => name.toLowerCase().includes(x) || id.toLowerCase().includes(x))) continue;
  const key = id + '|' + info.replace(/\\/g, '/').includes('/42/'); if (modsSeen.has(key)) continue; modsSeen.add(key);
  // pastas media candidatas: <mod>/42/media, <mod>/common/media, <mod>/media
  const modDir = path.dirname(info); const base = path.basename(modDir) === '42' ? path.dirname(modDir) : modDir;
  const mediaDirs = [path.join(modDir, 'media'), path.join(base, 'common/media'), path.join(base, '42/media'), path.join(base, 'media')].filter(d => fs.existsSync(d));
  let np = 0, nt = 0;
  for (const p of packs) for (const d of mediaDirs) { const f = path.join(d, 'texturepacks', p + '.pack'); if (fs.existsSync(f)) { np += readPack(f, id); break; } }
  for (const t of defs) for (const d of mediaDirs) { const f = path.join(d, t + '.tiles'); if (fs.existsSync(f)) { nt += readTiles(f, name); break; } }
  if (np || nt) console.log(' ', name, 'imgs', np, 'tiles', nt);
}

// ---------- tiles que so existem no pack ----------
for (const [tn] of images) {
  const m = tn.match(/^(.*)_(\d+)$/); if (!m || tiles.has(tn)) continue;
  let ts = tilesets.findIndex(x => x.name === m[1]);
  if (ts < 0) { ts = tilesets.length; tilesets.push({ name: m[1], image: '', cols: 0, rows: 0, source: 'pack' }); }
  tiles.set(tn, { ts, idx: +m[2], props: {} });
}

// ---------- traducoes ----------
function loadMov(lang) { try { return JSON.parse(fs.readFileSync(path.join(GAME, 'media/lua/shared/Translate', lang, 'Moveables.json'), 'utf8')); } catch { return {}; } }
const movPT = loadMov('PTBR'), movEN = loadMov('EN');
const movKey = s => s.replace(/ /g, '_').replace(/-/g, '_').replace(/'/g, '').replace(/\./g, '');

// ---------- saida ----------
const pageIdx = new Map(); const pages = [];
const rows = [];
for (const [tn, t] of tiles) {
  const im = images.get(tn);
  if (!im && Object.keys(t.props).length === 0) continue; // slot vazio da sheet
  let pg = -1;
  if (im) { if (!pageIdx.has(im.page)) { pageIdx.set(im.page, pages.length); pages.push(im.page); } pg = pageIdx.get(im.page); }
  const p = t.props;
  const g = p.GroupName, c = p.CustomName;
  const mov = (g ? g + ' ' : '') + (c || '');
  const key = mov ? movKey(mov) : '';
  rows.push([tn, t.ts, t.idx, pg, im ? [im.x, im.y, im.w, im.h, im.ox, im.oy, im.fw, im.fh] : null, p, key ? (movPT[key] || '') : '', key ? (movEN[key] || mov) : '']);
}
rows.sort((a, b) => a[1] - b[1] || a[2] - b[2]);
const js = 'window.PZ_TILES=' + JSON.stringify({ generated: new Date().toISOString(), pages, tilesets, tiles: rows }) + ';';
fs.writeFileSync(path.join(OUT, 'data/tiles.js'), js);
console.log('tilesets', tilesets.length, 'tiles', rows.length, 'com imagem', rows.filter(r => r[3] >= 0).length, 'paginas', pages.length, 'data/tiles.js', (js.length / 1e6).toFixed(1) + 'MB');
