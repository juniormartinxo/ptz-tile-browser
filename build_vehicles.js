// PZ Tile Browser - veiculos. Uso: node build_vehicles.js
// Le media/scripts/**/vehicles/*.txt (vanilla + mods), resolve template!/parts, copia skins e gera data/vehicles.js
const fs = require('fs'), path = require('path');
const GAME = 'C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid';
const GAME_VER = 42.20;
const USER_DIR = process.env.USERPROFILE.replace(/\\/g, '/');
const OUT = __dirname; const IMG = path.join(OUT, 'vehicles'); fs.mkdirSync(IMG, { recursive: true }); fs.mkdirSync(path.join(OUT, 'data'), { recursive: true });

// ---------- parser generico de script PZ ----------
function parseScript(text) {
  // varredura por caractere: '{' abre bloco com o cabecalho = ultimo texto pendente; '}' fecha; linhas 'k = v,' viram props
  text = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/mg, '');
  const root = { type: 'root', name: '', props: {}, templates: [], children: [] };
  const stack = [root]; let buf = '', pendingHeader = '';
  // linha sem '=' e o cabecalho do bloco cuja '{' vem na linha seguinte
  const flush = () => { const line = buf.trim(); buf = ''; if (!line) return; const cur = stack[stack.length - 1];
    const m = /^([\w!]+)\s*=\s*(.*?),?\s*$/.exec(line);
    if (m) { if (m[1] === 'template!') cur.base = m[2].trim(); else if (m[1] === 'template') cur.templates.push(m[2].trim()); else cur.props[m[1]] = m[2].trim(); }
    else pendingHeader = line; };
  for (let i = 0; i < text.length; i++) { const ch = text[i];
    if (ch === '{') { const header = buf.trim() || pendingHeader; buf = ''; pendingHeader = ''; const parts = header.split(/\s+/); let type = parts[0] || 'block', name = parts.slice(1).join(' ');
      if (type === 'template' && parts[1] === 'vehicle') { type = 'template vehicle'; name = parts.slice(2).join(' '); }
      const node = { type, name, props: {}, templates: [], children: [] }; stack[stack.length - 1].children.push(node); stack.push(node); }
    else if (ch === '}') { flush(); if (stack.length > 1) stack.pop(); }
    else if (ch === '\n') flush();
    else buf += ch; }
  flush(); return root;
}
const vehicles = {}, templates = {}, models = {};
function collect(node, mod, src) {
  for (const c of node.children) {
    if (c.type === 'module') { collect(c, c.name || mod, src); continue; }
    if (c.type === 'vehicle') { c.mod = mod; c.src = src; vehicles[mod + '.' + c.name] = c; }
    else if (c.type === 'template vehicle') { c.mod = mod; c.src = src; templates[c.name] = c; }
    else if (c.type === 'model' && c.props.mesh) { c.src = src; models[c.name] = c; }
  }
}
function scanScripts(dir, src) {
  if (!fs.existsSync(dir)) return 0; let n = 0;
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.txt')) { const t = fs.readFileSync(p, 'latin1'); if (/^\s*(template\s+)?vehicle\s+\w|^\s*model\s+\w/m.test(t)) { collect(parseScript(t), 'Base', src); n++; } } } };
  walk(dir); return n;
}

// ---------- mods: pasta de versao que o jogo usa ----------
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
  const mods = [];
  for (const r of roots) { if (!fs.existsSync(r)) continue;
    for (const e of fs.readdirSync(r, { withFileTypes: true })) { if (!e.isDirectory()) continue;
      const p = path.join(r, e.name);
      const cands = fs.existsSync(path.join(p, 'mods')) ? fs.readdirSync(path.join(p, 'mods')).map(x => path.join(p, 'mods', x)) : [p];
      for (const c of cands) { if (!fs.existsSync(c) || !fs.statSync(c).isDirectory()) continue;
        let info = null; for (const cand of [path.join(c, 'mod.info'), ...fs.readdirSync(c).filter(x => /^42/.test(x)).map(x => path.join(c, x, 'mod.info')), path.join(c, 'common', 'mod.info')]) if (fs.existsSync(cand)) { info = cand; break; }
        if (!info) continue;
        const txt = fs.readFileSync(info, 'latin1'); const name = ((txt.match(/^name=(.*)$/m) || [])[1] || e.name).trim(); const id = ((txt.match(/^id=(.*)$/m) || [])[1] || name).trim();
        mods.push({ name, id, dir: c, media: modMediaDirs(c) });
      } } }
  return mods;
}

// ---------- traducoes ----------
const names = { pt: {}, en: {} };
function loadNames(file, lang) {
  if (!fs.existsSync(file)) return; const t = fs.readFileSync(file, 'utf8');
  for (const m of t.matchAll(/IGUI_VehicleName(\w+)"?\s*[:=]\s*"([^"]*)"/g)) { let val = m[2]; try { val = JSON.parse('"' + val + '"'); } catch (e) {} names[lang][m[1]] = val; }
}
loadNames(GAME + '/media/lua/shared/Translate/PTBR/IG_UI.json', 'pt'); loadNames(GAME + '/media/lua/shared/Translate/EN/IG_UI.json', 'en');
function loadModNames(media) {
  const tdir = path.join(media, 'lua/shared/Translate'); if (!fs.existsSync(tdir)) return;
  for (const [lang, key] of [['PTBR', 'pt'], ['EN', 'en']]) { const d = path.join(tdir, lang); if (!fs.existsSync(d)) continue; for (const f of fs.readdirSync(d)) if (/^IG_UI/i.test(f)) loadNames(path.join(d, f), key); }
}

// ---------- coleta ----------
console.log('vanilla:', scanScripts(GAME + '/media/scripts', 'vanilla'), 'arquivos');
const mods = findMods(); const modSrc = {};
for (const m of mods) { let n = 0; for (const d of m.media) { n += scanScripts(path.join(d, 'scripts'), m.name); loadModNames(d); } if (n) { console.log('  ', m.name, n, 'arquivos'); modSrc[m.name] = m; } }

// ---------- resolucao ----------
const TRUNK = { Small: 40, Normal: 55, Big: 70 }, GAS = { Small: 39, Normal: 49, Big: 59 };
function chain(v) { const out = [v]; let b = v.base, guard = 0; while (b && templates[b] && guard++ < 10) { out.push(templates[b]); b = templates[b].base; } return out; }
function mergedProps(v) { const p = {}; for (const node of chain(v).reverse()) Object.assign(p, node.props); return p; }
function mergePart(parts, c) { parts[c.name] = parts[c.name] || { name: c.name, props: {}, container: {} }; Object.assign(parts[c.name].props, c.props); for (const cc of c.children) if (cc.type === 'container') Object.assign(parts[c.name].container, cc.props); }
// 'template = X'         -> inclui todas as parts do template X (recursivo)
// 'template = X/part/Y'  -> inclui so a part Y do template X
function applyTemplateRefs(parts, node, depth) {
  if (depth > 6) return;
  for (const ref of node.templates) {
    const m = /^([^/]+)(?:\/part\/(.+))?$/.exec(ref); if (!m || !templates[m[1]]) continue;
    const t = templates[m[1]];
    if (m[2]) { const c = t.children.find(x => x.type === 'part' && x.name === m[2]); if (c) mergePart(parts, c); }
    else { applyTemplateRefs(parts, t, depth + 1); for (const c of t.children) if (c.type === 'part') mergePart(parts, c); }
  }
}
function partsOf(v) { const parts = {}; for (const node of chain(v).reverse()) { applyTemplateRefs(parts, node, 0); for (const c of node.children) if (c.type === 'part') mergePart(parts, c); } return parts; }
function skinsOf(v) { for (const node of chain(v)) { const s = node.children.filter(c => c.type === 'skin').map(c => c.props.texture).filter(Boolean); if (s.length) return s; } return []; }
function pickByMech(list, mech) { const arr = list.split(';').map(s => s.trim()); return arr[Math.min(Math.max((mech || 1) - 1, 0), arr.length - 1)]; }
function findTexture(tex, srcMod) {
  const rel = 'textures/' + tex + '.png'; const dirs = srcMod && modSrc[srcMod] ? modSrc[srcMod].media.slice() : []; dirs.push(GAME + '/media'); for (const m of Object.values(modSrc)) for (const d of m.media) if (!dirs.includes(d)) dirs.push(d);
  for (const d of dirs) { const p = path.join(d, rel); if (fs.existsSync(p)) return p; const dd = path.join(d, path.dirname(rel)); if (fs.existsSync(dd)) { const want = path.basename(rel).toLowerCase(); const hit = fs.readdirSync(dd).find(f => f.toLowerCase() === want); if (hit) return path.join(dd, hit); } }
  return null;
}
// ---------- 3D: modelos FBX em base64 (file:// nao permite fetch) ----------
const MODELS_DIR = path.join(OUT, 'data', 'models'); fs.mkdirSync(MODELS_DIR, { recursive: true });
const modelFiles = {}; // chave -> {js, ok}
const TEX_DIR = path.join(OUT, 'data', 'textures'); fs.mkdirSync(TEX_DIR, { recursive: true }); const texKeys = {};
// textura -> data/textures/<key>.js com base64 (WebGL em file:// so aceita data-URL)
function exportTexture(rel) { if (!rel) return null; const src = path.join(OUT, rel); if (!fs.existsSync(src)) return null; const key = path.basename(rel).replace(/.[^.]+$/, ''); if (!texKeys[key]) { const js = path.join(TEX_DIR, key + '.js'); if (!fs.existsSync(js)) fs.writeFileSync(js, 'window.PZ_TEX=window.PZ_TEX||{};window.PZ_TEX[' + JSON.stringify(key) + ']=' + JSON.stringify(fs.readFileSync(src).toString('base64')) + ';'); texKeys[key] = true; } return key; }
function findModelFile(mesh, srcMod) {
  const rel = mesh.split('|')[0]; const dirs = srcMod && modSrc[srcMod] ? modSrc[srcMod].media.slice() : []; dirs.push(GAME + '/media'); for (const m of Object.values(modSrc)) for (const d of m.media) if (!dirs.includes(d)) dirs.push(d);
  for (const d of dirs) { const dd = path.join(d, 'models_X', path.dirname(rel)); if (!fs.existsSync(dd)) continue; const want = path.basename(rel).toLowerCase(); const hit = fs.readdirSync(dd).find(f => { const l = f.toLowerCase(); return l === want + '.fbx' || l === want + '.x' || l === want; }); if (hit) return path.join(dd, hit); }
  return null;
}
function exportModel(mesh, srcMod) {
  const file = findModelFile(mesh, srcMod); if (!file) return null;
  const key = (srcMod === 'vanilla' ? '' : srcMod.replace(/[^A-Za-z0-9]/g, '_') + '__') + path.basename(file).replace(/\.[^.]+$/, '');
  if (!modelFiles[key]) {
    const js = path.join(MODELS_DIR, key + '.js');
    if (!fs.existsSync(js)) { const b64 = fs.readFileSync(file).toString('base64'); fs.writeFileSync(js, 'window.PZ_MODELS=window.PZ_MODELS||{};window.PZ_MODELS[' + JSON.stringify(key) + ']=' + JSON.stringify(b64) + ';'); }
    modelFiles[key] = { js: 'data/models/' + key + '.js', ok: true };
  }
  return key;
}
const vec = s => { const values = (s || '').trim().split(/\s+/); return [0, 1, 2].map(i => parseFloat(values[i]) || 0); };
// um "model NAME { file = X, offset, rotate, scale }" dentro do veiculo ou de uma part -> instancia
function instanceOf(node, v) {
  const mdef = models[node.props.file]; if (!mdef) return null;
  const key = exportModel(mdef.props.mesh, mdef.src === 'vanilla' && v.src !== 'vanilla' ? v.src : mdef.src) || exportModel(mdef.props.mesh, v.src); if (!key) return null;
  const tex = mdef.props.texture ? (findTexture(mdef.props.texture, mdef.src) || findTexture(mdef.props.texture, v.src)) : null;
  let texRel = null; if (tex) { const dst = path.join(IMG, (v.src === 'vanilla' ? '' : v.src.replace(/[^A-Za-z0-9]/g, '_') + '__') + path.basename(tex)); if (!fs.existsSync(dst)) fs.copyFileSync(tex, dst); texRel = 'vehicles/' + path.basename(dst); }
  return { key, sub: (mdef.props.mesh.split('|')[1] || ''), meshScale: parseFloat(mdef.props.scale) || 1, invertX: /^true$/i.test(mdef.props.invertX || ''), tex: texRel, texKey: exportTexture(texRel),
    scale: parseFloat(node.props.scale) || 1, offset: vec(node.props.offset), rotate: vec(node.props.rotate) };
}
// Parts com modelos: as do proprio veiculo/template! e as incluidas por 'template = X' (recursivo).
// Parts com curinga ('Tire*', 'Door*') valem para todas as parts concretas que casam com o padrao;
// uma part com 'wheel = FrontLeft' posiciona seus modelos no offset desse wheel.
function gatherPartNodes(v) {
  const list = []; const seenTpl = new Set();
  const addFrom = (node, depth) => {
    if (depth > 6) return;
    if (node.base && templates[node.base] && !seenTpl.has(node.base)) { seenTpl.add(node.base); addFrom(templates[node.base], depth + 1); }
    for (const ref of node.templates) { const m = /^([^/]+)(?:\/part\/(.+))?$/.exec(ref); if (!m || !templates[m[1]] || seenTpl.has(ref)) continue; seenTpl.add(ref); const t = templates[m[1]];
      if (m[2]) { const c = t.children.find(x => x.type === 'part' && x.name === m[2]); if (c) list.push(c); } else addFrom(t, depth + 1); }
    for (const c of node.children) if (c.type === 'part') list.push(c);
  };
  addFrom(v, 0);
  return list;
}
function build3d(v) {
  const ch = chain(v); let body = null; const parts = []; const wheels = [];
  for (const node of ch) { const m = node.children.find(c => c.type === 'model'); if (m && m.props.file && !body) body = instanceOf(m, v); }
  if (!body) return null;
  for (const node of ch) { const ws = node.children.filter(c => c.type === 'wheel'); if (ws.length) { for (const w of ws) wheels.push({ name: w.name, offset: vec(w.props.offset), radius: parseFloat(w.props.radius) || 0.3, width: parseFloat(w.props.width) || 0.2 }); break; } }
  const wheelByName = Object.fromEntries(wheels.map(w => [w.name, w]));
  // parts concretas: nome -> {props, models}; curingas aplicados depois
  const nodes = gatherPartNodes(v); const concrete = {}; const wild = [];
  for (const p of nodes) { if (p.name.includes('*')) { wild.push(p); continue; } concrete[p.name] = concrete[p.name] || { name: p.name, props: {}, models: [] }; }
  // curinga Tire* sem parts concretas (ex.: KI5 'TireFront*'): materializa TireFrontLeft/Right etc. a partir dos wheels
  const wildRe = name => new RegExp('^' + name.split('*').map(p => p.replace(/[.+?^${}()|[\]\\]/g, ch => '\\' + ch)).join('.*') + '$', 'i');
  for (const w of wild) { if (!/^Tire/i.test(w.name)) continue; const re = wildRe(w.name); for (const wh of wheels) { const n = 'Tire' + wh.name; if (re.test(n) && !concrete[n]) concrete[n] = { name: n, props: {}, models: [] }; } }
  // Aplica na ordem dos templates e depois as sobrescritas do veículo. Blocos
  // model com o mesmo ID se complementam (offset/rotate podem vir sem file).
  for (const p of nodes) {
    const re = wildRe(p.name);
    for (const c of Object.values(concrete)) if (re.test(c.name)) {
      Object.assign(c.props, p.props);
      for (const m of p.children.filter(m => m.type === 'model')) {
        const old = c.models.find(n => n.name === m.name);
        if (old) Object.assign(old.props, m.props);
        else c.models.push({ ...m, props: { ...m.props } });
      }
    }
  }
  const seen = new Set(); const wheelsWithModel = new Set();
  const hasTracks = Object.values(concrete).some(c => /^Track(?:_?\d+)?$/i.test(c.name) && c.models.some(m => m.props.file));
  const OPTIONAL =/Armor|Turret|Turrent|Browning|Machinegun|MachineGun|Ammo|Snorkel|Winch|Lightbar|LightBar|Siren|Roofrack|RoofRack|Ladder|Bullbar|BullBar|Plow|Blade/i;
  for (const c of Object.values(concrete)) {
    // A torre principal dos blindados com esteiras é estrutural; torres de
    // veículos comuns e acessórios como TurretSpotlight continuam opcionais.
    if (OPTIONAL.test(c.name) && !(hasTracks && /^(Turret|Turrent)$/i.test(c.name))) continue;
    // 'wheel =' explicito, senao inferido do nome da part (TireRearLeft -> RearLeft), como o KI5/DAMN fazem
    let wname = c.props.wheel; if (!wname) { const mm = /^Tire(Front|Rear|Back)(Left|Right)$/i.exec(c.name); if (mm) wname = (mm[1].toLowerCase() === 'back' ? 'Rear' : mm[1][0].toUpperCase() + mm[1].slice(1).toLowerCase()) + mm[2][0].toUpperCase() + mm[2].slice(1).toLowerCase(); }
    const wheel = wname && wheelByName[wname];
    // Peças estruturais podem fornecer várias malhas simultâneas (ex.: leito
    // e interior no GloveBox do M35). Acessórios mantêm uma variante padrão.
    const available = c.models.filter(m => m.props.file);
    const structural = /^(GloveBox|TruckBed|TruckBedOpen|TrailerTrunk|Engine)$/.test(c.name);
    // Default explícito tem prioridade sobre variantes herdadas de Tire*.
    // Se o modelo não é exportável, tente o próximo, sem exibir estados alternativos juntos.
    const visible = structural ? available : available.slice().sort((a, b) => Number(b.name === 'Default') - Number(a.name === 'Default'));
    for (const m of visible) {
      const id = c.name + '/' + m.name + '/' + m.props.file; if (seen.has(id)) continue; seen.add(id);
      const inst = instanceOf(m, v); if (!inst) continue;
      if (wheel) { inst.offset = [(inst.offset[0] || 0) + (wheel.offset[0] || 0), (inst.offset[1] || 0) + (wheel.offset[1] || 0), (inst.offset[2] || 0) + (wheel.offset[2] || 0)]; inst.wheel = wheel.name; wheelsWithModel.add(wheel.name); }
      // Tire sem vínculo wheel, junto das esteiras, é o conjunto inteiro de
      // rodagem no espaço do chassi, não uma roda para cada apoio da física.
      if (!wheel && hasTracks && /^Tires?$/i.test(c.name)) inst.coversWheels = wheels.map(w => w.name);
      parts.push(Object.assign(inst, { part: c.name }));
      if (!structural) break;
    }
  }
  const coveredWheels = new Set(parts.flatMap(p => p.coversWheels || []));
  for (let i = parts.length - 1; i >= 0; i--) if (coveredWheels.has(parts[i].wheel)) parts.splice(i, 1);
  for (const w of coveredWheels) wheelsWithModel.add(w);
  // DAMN lib run-flat: part Tire* com itemType runFlat.<Tamanho>Tire e sem modelo -> modelo runFlat<Tamanho>Tire no wheel
  for (const c of Object.values(concrete)) {
    const mm = /^Tire(Front|Rear|Back)(Left|Right)$/i.exec(c.name); if (!mm || c.models.length) continue;
    const it = /runFlat\.(\w+?)Tire/i.exec(c.props.itemType || ''); if (!it) continue;
    const wname = (mm[1].toLowerCase() === 'back' ? 'Rear' : mm[1][0].toUpperCase() + mm[1].slice(1).toLowerCase()) + mm[2][0].toUpperCase() + mm[2].slice(1).toLowerCase();
    const w = wheelByName[wname]; if (!w || wheelsWithModel.has(wname)) continue;
    const mname = Object.keys(models).find(k => k.toLowerCase() === ('runflat' + it[1] + 'tire').toLowerCase()); if (!mname) continue;
    const inst = instanceOf({ props: { file: mname } }, v); if (!inst) continue;
    inst.offset = [w.offset[0] || 0, w.offset[1] || 0, w.offset[2] || 0]; parts.push(Object.assign(inst, { part: c.name, wheel: wname })); wheelsWithModel.add(wname);
  }
  // rodas sem part com modelo: os mods (KI5/DAMN) ligam o modelo da roda por Lua; casamos pelo nome do modelo.
  // Candidatos: modelos cujo nome comeca com um prefixo do nome do veiculo e contem 'wheel'/'tire';
  // pontua lado (L/R, left/right) e eixo (front/rear/back); preferimos a variante base (sem digito apos 'wheel').
  const vn = v.name.toLowerCase(); const modelNames = Object.keys(models);
  let cands = [];
  for (let len = vn.length; len >= 4 && !cands.length; len--) { const pre = vn.slice(0, len); cands = modelNames.filter(k => { const l = k.toLowerCase(); return models[k].src === v.src && l.startsWith(pre) && /wheel|tire/.test(l.slice(pre.length)); }); }
  for (const w of wheels) {
    if (wheelsWithModel.has(w.name) || !cands.length) continue;
    const side = /Left$/.test(w.name) ? 'left' : 'right', axle = /^Front/.test(w.name) ? 'front' : 'rear';
    const score = k => { const l = k.toLowerCase(); let s = 0;
      const hasL = /left|wheel\d*l\b|wheell$/.test(l), hasR = /right|wheel\d*r\b|wheelr$/.test(l);
      if (hasL || hasR) s += (side === 'left' ? hasL : hasR) ? 3 : -5;
      const hasF = /front/.test(l), hasB = /rear|back/.test(l);
      if (hasF || hasB) s += (axle === 'front' ? hasF : hasB) ? 2 : -5;
      if (!/wheel\d|tire\d/.test(l)) s += 1; return s - l.length / 100; };
    let inst = null; for (const c of cands.slice().sort((x, y) => score(y) - score(x))) { if (score(c) < -1) break; inst = instanceOf({ props: { file: c } }, v); if (inst) break; }
    if (!inst) continue;
    inst.offset = [w.offset[0] || 0, w.offset[1] || 0, w.offset[2] || 0]; parts.push(Object.assign(inst, { part: 'Wheel' + w.name, wheel: w.name })); wheelsWithModel.add(w.name);
  }
  for (const w of wheels) w.hasModel = wheelsWithModel.has(w.name);
  return { body, parts, wheels, extents: vec(mergedProps(v).extents), skinKeys: (v._thumbs || []).map(exportTexture) };
}

const out = []; let copied = 0;
for (const [id, v] of Object.entries(vehicles)) {
  const p = mergedProps(v); const parts = partsOf(v); const mech = parseInt(p.mechanicType) || 1;
  const containers = [];
  for (const pt of Object.values(parts)) {
    if (!Object.keys(pt.container).length && !/TruckBed|Trunk|GloveBox|Seat/.test(pt.name)) continue;
    let cap = parseFloat(pt.container.capacity);
    if (!cap && pt.props.itemType) { const it = pickByMech(pt.props.itemType, mech); const m = /(Small|Normal|Big)(Trunk|GasTank)/.exec(it); if (m) cap = (m[2] === 'Trunk' ? TRUNK : GAS)[m[1]]; }
    if (cap) containers.push({ part: pt.name, cap });
  }
  const trunk = containers.filter(c => /TruckBed|Trunk|Cargo/i.test(c.part) && !/Gas/i.test(c.part)).reduce((a, c) => a + c.cap, 0);
  const gas = (containers.find(c => /GasTank/i.test(c.part)) || {}).cap || 0;
  const seats = parseInt(p.seats) || Object.keys(parts).filter(k => /^Seat/.test(k)).length;
  const skins = skinsOf(v); const thumbs = [];
  for (const s of skins.slice(0, 6)) { const f = findTexture(s, v.src); if (!f) continue; const dst = path.join(IMG, (v.src === 'vanilla' ? '' : v.src.replace(/[^A-Za-z0-9]/g, '_') + '__') + path.basename(f)); if (!fs.existsSync(dst)) { fs.copyFileSync(f, dst); copied++; } thumbs.push('vehicles/' + path.basename(dst)); }
  const wreck = /Burnt|Smashed|Wreck/i.test(v.name) || p.neverSpawnKey === 'true';
  v._thumbs = thumbs; const m3d = build3d(v);
  out.push({ id, name: v.name, mod: v.src, base: v.base || '', pt: names.pt[v.name] || '', en: names.en[v.name] || '', mech, seats, trunk, gas, containers, skins, thumbs, wreck, m3d,
    stats: { mass: +p.mass || 0, engineForce: +p.engineForce || 0, maxSpeed: parseFloat(p.maxSpeed) || 0, engineQuality: +p.engineQuality || 0, engineLoudness: +p.engineLoudness || 0, engineRepairLevel: +p.engineRepairLevel || 0, brakingForce: +p.brakingForce || 0, wheelFriction: parseFloat(p.wheelFriction) || 0, frontEndHealth: +p.frontEndHealth || 0, rearEndHealth: +p.rearEndHealth || 0, steeringIncrement: parseFloat(p.steeringIncrement) || 0, gearRatioCount: +p.gearRatioCount || 0, playerDamageProtection: parseFloat(p.playerDamageProtection) || 0, isSmallVehicle: p.isSmallVehicle === 'true', model: (chain(v).map(n => (n.children.find(c => c.type === 'model') || {}).props).find(x => x && x.file) || {}).file || '' } });
}
out.sort((a, b) => (a.mod === 'vanilla' ? 0 : 1) - (b.mod === 'vanilla' ? 0 : 1) || a.id.localeCompare(b.id));
fs.writeFileSync(path.join(OUT, 'data/vehicles.js'), 'window.PZ_VEHICLES=' + JSON.stringify({ generated: new Date().toISOString(), vehicles: out }) + ';');
console.log('texturas 3d', Object.keys(texKeys).length, 'modelos 3d', Object.keys(modelFiles).length, 'veiculos com 3d', out.filter(v => v.m3d).length);
console.log('veiculos', out.length, 'templates', Object.keys(templates).length, 'skins copiadas', copied, 'com nome PT', out.filter(v => v.pt).length);
