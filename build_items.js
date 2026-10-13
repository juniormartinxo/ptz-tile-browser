// PZ Tile Browser - itens. Uso: node build_items.js
// Le blocos 'item' de media/scripts (vanilla + mods), resolve icones (packs UI/UI2 + Item_*.png soltos),
// nomes PT/EN (ItemName.json / ItemName_XX.txt) e gera icons/*.png + data/items.js
const fs = require('fs'), path = require('path');
const GAME = 'C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid';
const GAME_VER = 42.20;
const USER_DIR = process.env.USERPROFILE.replace(/\\/g, '/');
const OUT = __dirname; const ICONS = path.join(OUT, 'icons'); fs.mkdirSync(ICONS, { recursive: true }); fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });

// ---------- parser de script PZ (so o necessario para 'module X { item Y { k = v, } }') ----------
function parseScript(text) {
  text = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/mg, '');
  const root = { type: 'root', name: '', props: {}, children: [] };
  const stack = [root]; let buf = '', pendingHeader = '';
  const flush = () => { const line = buf.trim(); buf = ''; if (!line) return; const cur = stack[stack.length - 1];
    // uma linha pode ter varios 'k = v,' (scripts antigos de mods)
    const pieces = line.split(/,\s*(?=[\w!]+\s*=)/); let any = false;
    for (const pc of pieces) { const m = /^([\w!]+)\s*=\s*(.*?),?\s*$/.exec(pc.trim()); if (m) { cur.props[m[1]] = m[2].trim(); any = true; } }
    if (!any) pendingHeader = line; };
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (ch === '{') { const header = buf.trim() || pendingHeader; buf = ''; pendingHeader = ''; const parts = header.split(/\s+/);
      const node = { type: parts[0] || 'block', name: parts.slice(1).join(' '), props: {}, children: [] }; stack[stack.length - 1].children.push(node); stack.push(node); }
    else if (ch === '}') { flush(); if (stack.length > 1) stack.pop(); }
    else if (ch === '\n') flush();
    else buf += ch; }
  flush(); return root;
}

// ---------- mods (mesma regra de pasta de versao do build_vehicles.js) ----------
function modMediaDirs(modDir) {
  const ents = fs.readdirSync(modDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);
  const vers = ents.map(v => ({ v, num: /^42(\.\d+)?$/.test(v) ? parseFloat(v) : null })).filter(x => x.num !== null && x.num <= GAME_VER).sort((a, b) => b.num - a.num);
  const dirs = [];
  if (vers.length) dirs.push(path.join(modDir, vers[0].v, 'media'));
  if (ents.includes('common')) dirs.push(path.join(modDir, 'common', 'media'));
  if (!vers.length && ents.includes('media')) dirs.push(path.join(modDir, 'media'));
  return dirs.filter(d => fs.existsSync(d));
}
function findMods() {
  const roots = [USER_DIR + '/Zomboid/mods', 'C:/Program Files (x86)/Steam/steamapps/workshop/content/108600'];
  const mods = []; const seen = new Set();
  for (const r of roots) { if (!fs.existsSync(r)) continue;
    for (const e of fs.readdirSync(r, { withFileTypes: true })) { if (!e.isDirectory()) continue;
      const p = path.join(r, e.name);
      const cands = fs.existsSync(path.join(p, 'mods')) ? fs.readdirSync(path.join(p, 'mods')).map(x => path.join(p, 'mods', x)) : [p];
      for (const c of cands) { if (!fs.existsSync(c) || !fs.statSync(c).isDirectory()) continue;
        let info = null; for (const cand of [...fs.readdirSync(c).filter(x => /^42/.test(x)).sort().reverse().map(x => path.join(c, x, 'mod.info')), path.join(c, 'common', 'mod.info'), path.join(c, 'mod.info')]) if (fs.existsSync(cand)) { info = cand; break; }
        if (!info) continue;
        const txt = fs.readFileSync(info, 'latin1'); const name = ((txt.match(/^name=(.*)$/m) || [])[1] || e.name).trim(); const id = ((txt.match(/^id=(.*)$/m) || [])[1] || name).trim();
        if (seen.has(id)) continue; seen.add(id);
        const packs = [...txt.matchAll(/^pack=(.*)$/mg)].map(m => m[1].trim()).filter(Boolean);
        mods.push({ name, id, dir: c, media: modMediaDirs(c), packs });
      } } }
  return mods;
}

// ---------- packs de textura (PZPK novo e formato antigo terminado por 0xDEADBEEF) ----------
const packIcons = {}; // src -> Map(textureName -> [page, x, y, w, h, ox, oy, fw, fh])
const pages = []; const pageIdx = new Map();
function readPack(file, src, tag) {
  const buf = fs.readFileSync(file); const map = packIcons[src] = packIcons[src] || new Map(); let pos = 0;
  const i32 = () => { const v = buf.readInt32LE(pos); pos += 4; return v; };
  const str = () => { const n = i32(); const s = buf.toString('latin1', pos, pos + n); pos += n; return s; };
  const isNew = buf.toString('latin1', 0, 4) === 'PZPK'; if (isNew) pos = 8;
  let n = 0;
  try {
    const np = i32();
    for (let p = 0; p < np; p++) {
      const pname = str(); const cnt = i32(); i32(); const ents = [];
      for (let e = 0; e < cnt; e++) { const en = str(); const v = []; for (let k = 0; k < 8; k++) v.push(i32()); ents.push([en, v]); }
      let png;
      if (isNew) { const len = i32(); png = buf.subarray(pos, pos + len); pos += len; }
      else { const end = buf.indexOf(Buffer.from([0xEF, 0xBE, 0xAD, 0xDE]), pos); if (end < 0) break; png = buf.subarray(pos, end); pos = end + 4; }
      // so interessam paginas com icones de item
      if (!ents.some(([en]) => /^Item_/i.test(en))) continue;
      const pageName = (tag ? tag + '__' : '') + pname.replace(/[^A-Za-z0-9_.-]/g, '_');
      const out = path.join(ICONS, pageName + '.png'); if (!fs.existsSync(out) || fs.statSync(out).size !== png.length) fs.writeFileSync(out, png);
      if (!pageIdx.has(pageName)) { pageIdx.set(pageName, pages.length); pages.push(pageName); }
      const pg = pageIdx.get(pageName);
      for (const [en, v] of ents) if (!map.has(en)) { map.set(en, [pg, ...v]); n++; }
    }
  } catch (e) { console.log('  pack com erro:', file, e.message); }
  return n;
}

// ---------- texturas soltas (media/textures/**/*.png) ----------
const looseIcons = {}; // src -> Map(lowercase basename sem .png -> caminho)
function indexTextures(dir, src) {
  const map = looseIcons[src] = looseIcons[src] || new Map(); if (!fs.existsSync(dir)) return;
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.png$/i.test(e.name)) { const k = e.name.slice(0, -4).toLowerCase(); if (!map.has(k)) map.set(k, p); } } };
  walk(dir);
}

// ---------- traducoes ----------
const names = { pt: {}, en: {} }, cats = { pt: {}, en: {} };
function readText(file) { let t = fs.readFileSync(file, 'utf8'); if (t.includes('\uFFFD')) t = fs.readFileSync(file, 'latin1'); return t; }
function unq(s) { try { return JSON.parse('"' + s + '"'); } catch (e) { return s; } }
function loadItemNames(file, lang) {
  const t = readText(file);
  for (const m of t.matchAll(/"?(?:ItemName_)?([A-Za-z0-9_]+\.[^"\s=:]+)"?\s*[:=]\s*"((?:[^"\\\n]|\\.)*)"/g)) names[lang][m[1]] = unq(m[2]);
}
function loadCats(file, lang) { const t = readText(file); for (const m of t.matchAll(/"?IGUI_ItemCat_(\w+)"?\s*[:=]\s*"((?:[^"\\\n]|\\.)*)"/g)) cats[lang][m[1]] = unq(m[2]); }
function loadTranslations(media) {
  const tdir = path.join(media, 'lua/shared/Translate'); if (!fs.existsSync(tdir)) return;
  for (const [lang, key] of [['PTBR', 'pt'], ['EN', 'en']]) { const d = path.join(tdir, lang); if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) { if (/^ItemName/i.test(f)) loadItemNames(path.join(d, f), key); else if (/^IG_UI/i.test(f)) loadCats(path.join(d, f), key); } }
}

// ---------- coleta dos itens ----------
const items = new Map(); // 'Module.Name' -> {id, module, name, src, props, ovr}
function scanScripts(dir, src) {
  if (!fs.existsSync(dir)) return 0; let n = 0;
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.txt$/i.test(e.name)) {
    const t = fs.readFileSync(p, 'latin1'); if (!/^\s*item\s+[\w.-]+\s*(\{|$)/m.test(t)) continue;
    const root = parseScript(t);
    for (const mod of root.children.filter(c => c.type === 'module')) for (const c of mod.children) {
      if (c.type !== 'item' || !c.name || /\s/.test(c.name)) continue;
      const id = mod.name + '.' + c.name; const ex = items.get(id);
      if (ex) { Object.assign(ex.props, c.props); if (src !== ex.src && !ex.ovr.includes(src)) ex.ovr.push(src); }
      else { items.set(id, { id, module: mod.name, name: c.name, src, props: { ...c.props }, ovr: [] }); n++; }
    } } } };
  walk(dir); return n;
}

console.log('vanilla...');
const VM = GAME + '/media';
for (const p of ['UI.pack', 'UI2.pack', 'IconsMoveables.pack', 'RadioIcons.pack', 'ApComUI.pack']) { const f = path.join(VM, 'texturepacks', p); if (fs.existsSync(f)) console.log(' ', p, readPack(f, 'vanilla', '')); }
indexTextures(VM + '/textures', 'vanilla');
loadTranslations(VM);
console.log('  itens', scanScripts(VM + '/scripts', 'vanilla'));

const ARGS = process.argv.slice(2); const VANILLA_ONLY = ARGS.includes('--vanilla');
const SKIP = (ARGS.find(a => a.startsWith('--skip=')) || '').slice(7).split(',').filter(Boolean).map(x => x.toLowerCase());
const modMedia = {};
if (!VANILLA_ONLY) for (const m of findMods()) {
  if (SKIP.some(x => m.name.toLowerCase().includes(x) || m.id.toLowerCase().includes(x))) continue;
  let n = 0;
  for (const d of m.media) n += scanScripts(path.join(d, 'scripts'), m.name);
  if (!n && !m.media.some(d => fs.existsSync(path.join(d, 'scripts')))) continue;
  modMedia[m.name] = m.media;
  for (const d of m.media) { indexTextures(path.join(d, 'textures'), m.name); loadTranslations(d); }
  let np = 0; for (const pk of m.packs) for (const d of m.media) { const f = path.join(d, 'texturepacks', pk + '.pack'); if (fs.existsSync(f)) { np += readPack(f, m.name, m.id.replace(/[^A-Za-z0-9]/g, '_')); break; } }
  if (n) console.log('  ', m.name, 'itens', n, np ? 'icones em pack ' + np : '');
}

// ---------- icone: Icon / IconsForTexture -> Item_X; moveable sem icone -> sprite do tile ----------
const copied = new Map();
function lookupIcon(tex, src) {
  const order = [src, 'vanilla', ...Object.keys(packIcons), ...Object.keys(looseIcons)].filter((x, i, a) => x && a.indexOf(x) === i);
  const want = [tex.startsWith('Item_') ? tex : 'Item_' + tex, tex];
  for (const s of order) for (const w of want) {
    const pk = packIcons[s]; if (pk && pk.has(w)) return ['p', ...pk.get(w)];
    const lf = looseIcons[s] && looseIcons[s].get(w.toLowerCase());
    if (lf) { if (!copied.has(lf)) { const dst = (s === 'vanilla' ? '' : s.replace(/[^A-Za-z0-9]/g, '_') + '__') + path.basename(lf); const full = path.join(ICONS, dst); if (!fs.existsSync(full)) fs.copyFileSync(lf, full); copied.set(lf, 'icons/' + dst); } return ['f', copied.get(lf)]; }
  }
  return null;
}
function iconOf(it) {
  const p = it.props; const cands = [];
  if (p.Icon) cands.push(p.Icon.trim());
  if (p.IconsForTexture) cands.push(...p.IconsForTexture.split(';').map(s => s.trim()).filter(Boolean));
  if (p.IconFluid) cands.push(p.IconFluid.trim());
  cands.push(it.name);
  for (const c of cands) { const r = lookupIcon(c, it.src); if (r) return r; }
  if (p.WorldObjectSprite) return ['t', p.WorldObjectSprite.trim()];
  return null;
}

// ---------- saida ----------
const typeOf = p => ((p.ItemType || p.Type || 'normal').replace(/^base:/i, '').toLowerCase().replace(/[^a-z]/g, ''));
const out = []; let noIcon = 0;
for (const it of items.values()) {
  const p = it.props; const icon = iconOf(it); if (!icon) noIcon++;
  const en = names.en[it.id] || p.DisplayName || '';
  out.push({ id: it.id, mod: it.src, ovr: it.ovr, type: typeOf(p), cat: (p.DisplayCategory || '').trim(), pt: names.pt[it.id] || '', en, icon, props: p });
}
out.sort((a, b) => (a.mod === 'vanilla' ? 0 : 1) - (b.mod === 'vanilla' ? 0 : 1) || a.id.localeCompare(b.id));
const js = 'window.PZ_ITEMS=' + JSON.stringify({ generated: new Date().toISOString(), pages, cats, items: out }) + ';';
fs.writeFileSync(path.join(OUT, 'data/items.js'), js);
console.log('itens', out.length, 'sem icone', noIcon, 'com nome PT', out.filter(x => x.pt).length, 'paginas de icone', pages.length, 'icones soltos', copied.size, 'data/items.js', (js.length / 1e6).toFixed(1) + 'MB');
