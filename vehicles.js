// Aba Veiculos (carregada por index.html depois do script dos tiles)
(() => {
  const $ = s => document.querySelector(s);
  const V = (window.PZ_VEHICLES && window.PZ_VEHICLES.vehicles) || [];
  const isTrailer = v => /trailer|reboque/i.test(v.id + ' ' + v.en + ' ' + v.pt) || !v.stats.engineForce;
  const TYPES = [
    ['Carro', v => v.mech === 1 && !isTrailer(v)],
    ['Van / utilitário', v => v.mech === 2 && !isTrailer(v)],
    ['Caminhão / pesado', v => v.mech === 3 && !isTrailer(v)],
    ['Reboque', v => isTrailer(v)],
    ['Pequeno (moto etc.)', v => v.stats.isSmallVehicle],
  ];
  const rows = V.map((v, i) => { v.i = i; v.type = TYPES.findIndex(t => t[1](v)); v.hay = (v.id + ' ' + v.pt + ' ' + v.en + ' ' + v.mod + ' ' + (v.type >= 0 ? TYPES[v.type][0] : '') + ' ' + v.containers.map(c => c.part).join(' ')).toLowerCase(); return v; });
  const sel = { type: new Set(), seats: new Set(), mod: new Set() };
  let q = '', sort = 'name', wreck = false, selected = null, result = [];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const disp = v => v.pt || v.en || v.name;
  const seatBucket = v => v.seats >= 6 ? '6+' : String(v.seats || 0);

  function chips(el, group, items) {
    el.innerHTML = '';
    for (const [key, label, n] of items) {
      const d = document.createElement('div'); d.className = 'chip'; d.innerHTML = `<span>${esc(label)}</span><span>${n}</span>`;
      d.onclick = () => { const s = sel[group]; s.has(key) ? s.delete(key) : s.add(key); d.classList.toggle('on', s.has(key)); refresh(); };
      el.appendChild(d);
    }
  }
  function buildChips() {
    const live = rows.filter(v => !v.wreck);
    const cnt = k => { const c = {}; live.forEach(v => { const x = k(v); if (x != null) c[x] = (c[x] || 0) + 1; }); return c; };
    const ct = cnt(v => v.type >= 0 ? String(v.type) : null), cs = cnt(seatBucket), cm = cnt(v => v.mod);
    chips($('#v-type'), 'type', TYPES.map((t, k) => [String(k), t[0], ct[k] || 0]).filter(x => x[2]));
    chips($('#v-seats'), 'seats', ['1', '2', '3', '4', '5', '6+'].map(s => [s, s + ' assento' + (s === '1' ? '' : 's'), cs[s] || 0]).filter(x => x[2]));
    chips($('#v-mod'), 'mod', Object.entries(cm).sort((a, b) => (a[0] === 'vanilla' ? -1 : b[0] === 'vanilla' ? 1 : b[1] - a[1])).map(([k, n]) => [k, k, n]));
  }
  function matches(v, tokens) {
    for (const t of tokens) {
      let m;
      if ((m = /^mod:(.+)$/.exec(t))) { if (!v.mod.toLowerCase().includes(m[1])) return false; continue; }
      if ((m = /^seats:(\d+)$/.exec(t))) { if (v.seats !== +m[1]) return false; continue; }
      if ((m = /^(trunk|speed|engine|mass|seats|gas)([<>]=?|=)(\d+)$/.exec(t))) {
        const val = { trunk: v.trunk, speed: v.stats.maxSpeed, engine: v.stats.engineForce, mass: v.stats.mass, seats: v.seats, gas: v.gas }[m[1]]; const n = +m[3];
        const ok = { '>': val > n, '>=': val >= n, '<': val < n, '<=': val <= n, '=': val === n }[m[2]]; if (!ok) return false; continue;
      }
      if (t.startsWith('-')) { if (v.hay.includes(t.slice(1))) return false; continue; }
      if (!v.hay.includes(t)) return false;
    }
    return true;
  }
  function refresh() {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    result = rows.filter(v => (wreck || !v.wreck) &&
      (sel.type.size === 0 || sel.type.has(String(v.type))) &&
      (sel.seats.size === 0 || sel.seats.has(seatBucket(v))) &&
      (sel.mod.size === 0 || sel.mod.has(v.mod)) &&
      (tokens.length === 0 || matches(v, tokens)));
    const key = { name: v => disp(v), trunk: v => -v.trunk, speed: v => -v.stats.maxSpeed, engine: v => -v.stats.engineForce, seats: v => -v.seats, mass: v => -v.stats.mass }[sort];
    result.sort((a, b) => { const ka = key(a), kb = key(b); return typeof ka === 'string' ? ka.localeCompare(kb) : (ka - kb) || disp(a).localeCompare(disp(b)); });
    $('#status').textContent = result.length + ' veículos';
    const g = $('#vgrid'); g.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const v of result) {
      const c = document.createElement('div'); c.className = 'vcard' + (selected === v ? ' sel' : '');
      c.innerHTML = `<div class="vthumb" style="background-image:url('${esc(v.thumbs[0] || '')}')"></div><div class="name" title="${esc(disp(v))}">${esc(disp(v))}</div><div class="id" title="${esc(v.id)}">${esc(v.id)}</div>
        <div class="vstats"><span class="tag" title="assentos">🪑 <b>${v.seats}</b></span><span class="tag" title="porta-malas">📦 <b>${v.trunk}</b></span><span class="tag" title="tanque">⛽ <b>${v.gas}</b></span><span class="tag" title="velocidade máx.">🏁 <b>${v.stats.maxSpeed}</b></span><span class="tag" title="força do motor">⚙ <b>${v.stats.engineForce}</b></span>${v.mod !== 'vanilla' ? `<span class="tag fn">${esc(v.mod)}</span>` : ''}${v.wreck ? '<span class="tag">destruído</span>' : ''}</div>`;
      c.onclick = () => select(v, c); frag.appendChild(c);
    }
    g.appendChild(frag);
  }
  const bar = (val, max) => `<div class="bar"><i style="width:${Math.min(100, Math.round(val / max * 100))}%"></i></div>`;
  function select(v, c) {
    selected = v; document.querySelectorAll('.vcard.sel').forEach(x => x.classList.remove('sel')); if (c) c.classList.add('sel');
    const s = v.stats; const p = $('#vpanel'); p.style.display = 'block'; $('#vmain').style.gridTemplateColumns = '230px 1fr 380px';
    const spawn = `addVehicle("${v.id}", getPlayer():getX()+3, getPlayer():getY(), getPlayer():getZ())`;
    const stat = (label, val, max, unit) => `<tr><td>${label}</td><td>${val}${unit || ''}${max ? bar(val, max) : ''}</td></tr>`;
    p.innerHTML = `<button class="close" id="vclose">✕</button>
      <div class="v3d" id="v3d"><div class="msg">carregando 3D…</div></div>
      <h2>${esc(disp(v))}</h2>
      <div class="sub">${v.pt && v.en && v.pt !== v.en ? esc(v.en) + ' · ' : ''}${v.type >= 0 ? TYPES[v.type][0] + ' · ' : ''}${esc(v.mod)}${v.base ? ' · template ' + esc(v.base) : ''}${v.wreck ? ' · destruído' : ''}</div>
      <div><code>${esc(v.id)}</code></div>
      <div class="row"><button class="primary" data-copy="${esc(v.id)}">Copiar ID</button><button data-copy="${esc(spawn)}">Copiar spawn (console)</button></div>
      <table>
        ${stat('Assentos', v.seats)}${stat('Porta-malas', v.trunk, 500)}${stat('Tanque', v.gas, 200, ' L')}
        ${stat('Velocidade máx.', s.maxSpeed, 200)}${stat('Força do motor', s.engineForce, 12000)}${stat('Qualidade do motor', s.engineQuality, 100)}${stat('Barulho do motor', s.engineLoudness, 150)}
        ${stat('Massa', s.mass, 8000, ' kg')}${stat('Freio', s.brakingForce, 200)}${stat('Aderência', s.wheelFriction)}${stat('Nível p/ consertar motor', s.engineRepairLevel)}
        ${stat('Proteção do jogador', s.playerDamageProtection)}${stat('Vida dianteira / traseira', s.frontEndHealth + ' / ' + s.rearEndHealth)}${stat('Marchas', s.gearRatioCount)}${stat('Modelo', esc(s.model))}
        <tr><td>Compartimentos</td><td>${v.containers.map(c => esc(c.part) + ' = ' + c.cap).join('<br>') || '—'}</td></tr>
      </table>
      <h3 style="margin:12px 0 6px;font-size:12px;color:var(--fg3)">SKINS (${v.skins.length})</h3>
      <div class="skins">${v.thumbs.map((t, i) => `<img src="${esc(t)}" title="${esc(v.skins[i] || '')}">`).join('')}</div>
      <div class="hint">O spawn usa <code>addVehicle(script, x, y, z)</code>, o mesmo do painel de debug "Spawn Vehicle" (que também deixa escolher a skin).</div>`;
    show3d(v);
    p.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => navigator.clipboard.writeText(b.dataset.copy).then(() => toast('Copiado: ' + b.dataset.copy.slice(0, 60))));
    $('#vclose').onclick = () => { stop3d(); p.style.display = 'none'; $('#vmain').style.gridTemplateColumns = '230px 1fr'; selected = null; document.querySelectorAll('.vcard.sel').forEach(x => x.classList.remove('sel')); };
  }
  // ---------- visualizador 3D (three.js via CDN; modelos FBX em base64 em data/models/) ----------
  let three = null, cur3d = null;
  const loadedModels = {};
  const loadedTex = {};
  function loadTexJs(key) {
    if (!key) return Promise.resolve();
    if (window.PZ_TEX && window.PZ_TEX[key]) return Promise.resolve();
    if (loadedTex[key]) return loadedTex[key];
    loadedTex[key] = new Promise((res) => { const s = document.createElement('script'); s.src = 'data/textures/' + key + '.js'; s.onload = () => res(); s.onerror = () => res(); document.head.appendChild(s); });
    return loadedTex[key];
  }
  function loadModelJs(key) {
    if (window.PZ_MODELS && window.PZ_MODELS[key]) return Promise.resolve();
    if (loadedModels[key]) return loadedModels[key];
    loadedModels[key] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'data/models/' + key + '.js'; s.onload = () => res(); s.onerror = () => rej(new Error('modelo não encontrado: ' + key)); document.head.appendChild(s); });
    return loadedModels[key];
  }
  async function getThree() {
    if (three) return three;
    const [T, { FBXLoader }, { OrbitControls }] = await Promise.all([import('three'), import('three/addons/loaders/FBXLoader.js'), import('three/addons/controls/OrbitControls.js')]);
    three = { T, FBXLoader, OrbitControls }; return three;
  }
  const b64ToBuf = b64 => { const bin = atob(b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; };
  const fbxCache = {};
  function parseFbx(key) {
    if (!fbxCache[key]) {
      // Os materiais do FBX referenciam arquivos do computador do autor. As texturas
      // usadas aqui vêm dos scripts PZ; não tente carregar esses caminhos externos.
      const manager = new three.T.LoadingManager();
      const empty = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';
      manager.setURLModifier(() => empty);
      manager.addHandler(/\.(psd|tga|dds)$/i, new three.T.TextureLoader(manager));
      let buffer = b64ToBuf(window.PZ_MODELS[key]);
      if (new Uint8Array(buffer)[0] === 59) {
        // Exportadores ASCII podem escrever blocos em uma só linha. O leitor
        // do three.js exige uma linha por abertura, propriedade e fechamento.
        const ascii = new TextDecoder().decode(buffer).replace(/^([\t ]*)([^{}\r\n]+)\{([^{}\r\n]*)\}[\t ]*$/gm, (_, indent, header, values) =>
          indent + header.trimEnd() + ' {\n' + indent + '\t' + values.trim().replace(/\s+(?=[A-Za-z_]\w*:\s)/g, '\n' + indent + '\t') + '\n' + indent + '}');
        buffer = new TextEncoder().encode(ascii).buffer;
      }
      fbxCache[key] = new three.FBXLoader(manager).parse(buffer, '');
    }
    return fbxCache[key];
  }
  function stop3d() { if (cur3d) { cancelAnimationFrame(cur3d.raf); cur3d.renderer.dispose(); cur3d.controls.dispose(); cur3d = null; } }
  function instance(inst, tex, isBody = false) {
    const { T } = three; const src = parseFbx(inst.key); const g = new T.Group();
    const meshName = name => T.PropertyBinding.sanitizeNodeName(name || '').toLowerCase();
    const want = meshName(inst.sub);
    const meshes = []; src.traverse(o => { if (o.isMesh) meshes.push(o); });
    // Uma submalha é um nome exato: runFlat_Medium não inclui runFlat_Medium_4Axle.
    // Sem nome, o importador do jogo usa a primeira malha do arquivo.
    const pick = want ? meshes.filter(m => meshName(m.name) === want || meshName(m.geometry.name) === want) : meshes.slice(0, 1);
    if (!pick.length) throw new Error('submalha não encontrada: ' + inst.key + ' | ' + inst.sub);
    const mat = new T.MeshLambertMaterial({ map: tex, side: T.DoubleSide, color: tex ? 0xffffff : 0x8899aa, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: tex ? 0.55 : 0 });
    // Atualiza também os ossos, que podem ser irmãos da malha na árvore FBX.
    src.updateMatrixWorld(true);
    for (const m of pick) {
      const geo = m.geometry.clone();
      if (m.isSkinnedMesh) {
        // Congela a pose importada antes de converter em Mesh estática. Nos
        // blindados, os elos só formam a esteira depois da transformação dos ossos.
        const pos = geo.getAttribute('position'), vertex = new T.Vector3();
        for (let i = 0; i < pos.count; i++) { m.getVertexPosition(i, vertex); pos.setXYZ(i, vertex.x, vertex.y, vertex.z); }
        pos.needsUpdate = true;
        geo.deleteAttribute('skinIndex'); geo.deleteAttribute('skinWeight');
      }
      geo.applyMatrix4(m.matrixWorld); geo.computeVertexNormals();
      geo.computeBoundingBox(); geo.computeBoundingSphere();
      g.add(new T.Mesh(geo, mat));
    }
    const s = (inst.meshScale ?? 1) * (inst.scale ?? 1);
    // PZ importa FBX com MAKE_LEFT_HANDED (Z invertido). Manter a reflexão
    // no objeto permite ao three.js corrigir também a orientação das faces.
    g.scale.set(inst.invertX ? -s : s, s, -s);
    const o = inst.offset || []; g.position.set(-(o[0] || 0), o[1] || 0, o[2] || 0);
    const r = inst.rotate || [], sign = isBody || inst.wheel ? 1 : -1;
    g.rotation.set(T.MathUtils.degToRad(r[0] || 0), T.MathUtils.degToRad((r[1] || 0) * sign), T.MathUtils.degToRad((r[2] || 0) * sign));
    g.name = inst.part || (isBody ? 'body' : inst.sub || inst.key);
    return g;
  }
  async function show3d(v) {
    stop3d();
    const box = $('#v3d'); if (!box) return;
    const fallback = msg => { box.innerHTML = `<div class="vthumb" style="background-image:url('${esc(v.thumbs[0] || '')}');height:100%;aspect-ratio:auto;background-size:contain"></div><div class="msg" style="place-items:end center;font-size:11px">${esc(msg)}</div>`; };
    if (!v.m3d) return fallback('sem modelo 3D no script');
    try {
      const keys = [v.m3d.body.key, ...v.m3d.parts.map(p => p.key)];
      const tkeys = [v.m3d.body.texKey, ...v.m3d.parts.map(p => p.texKey), (v.m3d.skinKeys || [])[0]].filter(Boolean);
      await Promise.all([getThree(), ...[...new Set(keys)].map(loadModelJs), ...[...new Set(tkeys)].map(loadTexJs)]);
      if ($('#v3d') !== box) return; // selecionou outro enquanto carregava
      const { T, OrbitControls } = three;
      const scene = new T.Scene(); const root = new T.Group(); scene.add(root);
      // VehicleScript.Loaded + BaseVehicle.updateTransform: a escala e a origem
      // do veículo são compartilhadas pela carroceria, peças e rodas.
      const assembly = new T.Group(); root.add(assembly);
      const vehicleScale = v.m3d.body.scale ?? 1, origin = v.m3d.body.offset || [];
      assembly.scale.setScalar(vehicleScale);
      assembly.position.set(-(origin[0] || 0) * vehicleScale, (origin[1] || 0) * vehicleScale, (origin[2] || 0) * vehicleScale);
      const texLoader = new T.TextureLoader(); const texCache = {};
      // data-URL: unica forma de textura aceita pelo WebGL numa pagina file://
      const getTex = key => { if (!key || !window.PZ_TEX || !window.PZ_TEX[key]) return null; if (!texCache[key]) { const t = texLoader.load('data:image/png;base64,' + window.PZ_TEX[key]); t.colorSpace = T.SRGBColorSpace; t.flipY = true; texCache[key] = t; } return texCache[key]; };
      const skin = (v.m3d.skinKeys || [])[0] || null;
      const skinMats = []; const track = (g, usesSkin) => { if (usesSkin) g.traverse(o => { if (o.isMesh) skinMats.push(o.material); }); return g; };
      assembly.add(track(instance({ ...v.m3d.body, scale: 1, offset: [0, 0, 0] }, getTex(v.m3d.body.texKey || skin), true), !v.m3d.body.texKey));
      const renderedWheels = new Set();
      for (const p of v.m3d.parts) { try { assembly.add(track(instance(p, getTex(p.texKey || skin)), !p.texKey)); if (p.wheel) renderedWheels.add(p.wheel); for (const w of p.coversWheels || []) renderedWheels.add(w); } catch (e) { console.warn('part 3d', p, e); } }
      // clicar numa miniatura de skin troca a pintura no 3D
      document.querySelectorAll('#vpanel .skins img').forEach((img, i) => { img.style.cursor = 'pointer'; img.onclick = async () => { const k = (v.m3d.skinKeys || [])[i]; if (!k) return; await loadTexJs(k); const t = getTex(k); if (!t) return; for (const m of skinMats) { m.map = t; m.emissiveMap = t; m.needsUpdate = true; } }; });
      const wheelMat = new T.MeshLambertMaterial({ color: 0x222226 });
      for (const w of v.m3d.wheels) { if (renderedWheels.has(w.name)) continue; const geo = new T.CylinderGeometry(w.radius, w.radius, w.width, 24); const m = new T.Mesh(geo, wheelMat); m.name = 'Wheel' + w.name; m.rotation.z = Math.PI / 2; m.position.set(-(w.offset[0] || 0), w.offset[1] || 0, w.offset[2] || 0); assembly.add(m); }
      // enquadrar
      const bb = new T.Box3().setFromObject(root); const size = bb.getSize(new T.Vector3()); const center = bb.getCenter(new T.Vector3());
      root.position.sub(center);
      const radius = Math.max(size.x, size.y, size.z) * 0.6 || 1;
      const W = box.clientWidth || 350, H = box.clientHeight || 300;
      const camera = new T.PerspectiveCamera(35, W / H, 0.01, radius * 50); camera.position.set(radius * 1.6, radius * 1.1, radius * 1.9); camera.lookAt(0, 0, 0);
      scene.add(new T.AmbientLight(0xffffff, 0.5)); scene.add(new T.HemisphereLight(0xffffff, 0x333344, 0.8)); const dl = new T.DirectionalLight(0xffffff, 1.6); dl.position.set(radius * 2, radius * 3, radius * 2); scene.add(dl);
      const grid = new T.GridHelper(radius * 3, 12, 0x3a4150, 0x262b34); grid.position.y = -size.y / 2; scene.add(grid);
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H);
      box.innerHTML = ''; box.appendChild(renderer.domElement);
      const tools = document.createElement('div'); tools.className = 'tools'; tools.innerHTML = '<button id="v3d-rot">⟳ auto</button><button id="v3d-flip" title="inverter V da textura">↕ UV</button><button id="v3d-reset">reset</button>'; box.appendChild(tools);
      const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 1.5;
      tools.querySelector('#v3d-rot').onclick = () => { controls.autoRotate = !controls.autoRotate; };
      tools.querySelector('#v3d-flip').onclick = () => { for (const t of Object.values(texCache)) { t.flipY = !t.flipY; t.needsUpdate = true; } };
      tools.querySelector('#v3d-reset').onclick = () => { camera.position.set(radius * 1.6, radius * 1.1, radius * 1.9); controls.target.set(0, 0, 0); };
      const state = { renderer, controls, raf: 0 }; cur3d = state;
      const loop = () => { if (cur3d !== state) return; controls.update(); renderer.render(scene, camera); state.raf = requestAnimationFrame(loop); }; loop();
    } catch (e) { console.error(e); fallback('3D indisponível: ' + (e && e.message ? e.message : e) + (navigator.onLine ? '' : ' (sem internet para o three.js)')); }
  }

  let toastT; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1400); }

  // ---------- abas ----------
  const PH = { tiles: $('#q').placeholder, vehicles: 'Buscar veículo: nome, ID, mod, tipo…  (ex.: humvee, seats:6, trunk>150, mod:ki5, -trailer)' };
  const META_TILES = $('#meta').textContent;
  let view = 'tiles';
  // outras abas (ex.: items.js) se registram em window.PZ_VIEWS = { nome: { ph, meta(), show() } }
  const VIEWS = window.PZ_VIEWS || {};
  function setView(v) {
    if (v !== 'tiles' && v !== 'vehicles' && !VIEWS[v]) v = 'tiles';
    view = v; document.body.classList.toggle('view-vehicles', v === 'vehicles');
    for (const k in VIEWS) document.body.classList.toggle('view-' + k, v === k);
    document.querySelectorAll('#tabs .tab').forEach(b => b.classList.toggle('on', b.dataset.tab === v));
    $('#q').placeholder = PH[v] || VIEWS[v].ph; $('#q').value = ''; q = '';
    if (v === 'vehicles') { $('#meta').textContent = `${rows.length} veículos · ${new Set(rows.map(r => r.mod)).size} fontes`; refresh(); }
    else if (VIEWS[v]) { $('#meta').textContent = VIEWS[v].meta(); VIEWS[v].show(); }
    else { $('#meta').textContent = META_TILES; $('#q').dispatchEvent(new Event('input')); }
    try { localStorage.setItem('pz.view', v); } catch (e) {}
  }
  window.PZ_setView = setView;
  document.querySelectorAll('#tabs .tab[data-tab]').forEach(b => b.onclick = () => setView(b.dataset.tab));
  $('#q').addEventListener('input', e => { if (view !== 'vehicles') return; q = e.target.value; refresh(); });
  $('#vsort').onchange = e => { sort = e.target.value; refresh(); };
  $('#vwreck').onchange = e => { wreck = e.target.checked; refresh(); };
  $('#clear').addEventListener('click', () => { if (view !== 'vehicles') return; Object.values(sel).forEach(s => s.clear()); document.querySelectorAll('#vmain .chip.on').forEach(c => c.classList.remove('on')); q = ''; $('#q').value = ''; refresh(); });
  document.addEventListener('keydown', e => { if (view === 'vehicles' && e.key === 'Escape' && selected) $('#vclose').click(); });
  $('#vmain').style.display = 'grid'; $('#vmain').style.gridTemplateColumns = '230px 1fr';
  if (!V.length) $('#vgrid').innerHTML = '<p style="color:var(--fg3)">data/vehicles.js não encontrado — rode <code>node build_vehicles.js</code>.</p>';
  buildChips();
  let saved = 'tiles'; try { saved = localStorage.getItem('pz.view') || 'tiles'; } catch (e) {}
  if (saved !== 'tiles') setView(saved);
})();
