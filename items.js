// Aba Itens (carregada por index.html antes do vehicles.js, que controla as abas)
(() => {
  const $ = s => document.querySelector(s);
  const D = window.PZ_ITEMS || { pages: [], cats: { pt: {}, en: {} }, items: [] };
  const TYPE_PT = { normal: 'Geral', food: 'Comida', weapon: 'Arma', clothing: 'Roupa', container: 'Contêiner / bolsa', literature: 'Literatura', drainable: 'Consumível (gasta)', moveable: 'Móvel', weaponpart: 'Peça de arma', radio: 'Rádio', map: 'Mapa', key: 'Chave', alarmclock: 'Relógio', alarmclockclothing: 'Relógio de pulso', animal: 'Animal' };
  const INTERNAL_CATS = new Set(['Hidden', 'Wound', 'ZedDmg', 'MaleBody', 'Corpse', 'Appearance']);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = v => parseFloat(v) || 0;
  const typeLabel = t => TYPE_PT[t] || t;
  const catLabel = c => c ? (D.cats.pt[c] || D.cats.en[c] || c) : '(sem categoria)';
  const shortName = id => id.replace(/^[^.]*\./, '').replace(/_/g, ' ');
  const disp = it => it.pt || it.en || shortName(it.id);

  const rows = D.items.map((it, i) => {
    const p = it.props;
    it.i = i;
    it.tags = (p.Tags || '').split(';').map(s => s.trim().replace(/^base:/i, '')).filter(Boolean);
    it.internal = INTERNAL_CATS.has(it.cat) || /^true$/i.test(p.OBSOLETE || '');
    it.n = { weight: num(p.Weight), dmg: num(p.MaxDamage), cal: num(p.Calories), cap: num(p.Capacity), range: num(p.MaxRange) };
    it.hay = [it.id, it.pt, it.en, it.mod, it.cat, catLabel(it.cat), it.type, typeLabel(it.type), it.tags.join(' '), p.Categories || '', p.BodyLocation || '', p.SkillTrained || ''].join(' ').toLowerCase();
    return it;
  });

  // ---------- icones: pagina de pack, png solto ou sprite do tile (moveis) ----------
  let tileIdx = null;
  function tileRect(name) {
    if (!tileIdx) { tileIdx = new Map(); const T = window.PZ_TILES; if (T) for (const r of T.tiles) if (r[4]) tileIdx.set(r[0], ['atlas/' + T.pages[r[3]] + '.png', r[4]]); }
    return tileIdx.get(name);
  }
  function paintIcon(el, it, box) {
    el.innerHTML = ''; const ic = it.icon;
    let url, rect;
    if (ic && ic[0] === 'p') { url = 'icons/' + D.pages[ic[1]] + '.png'; rect = ic.slice(2); }
    else if (ic && ic[0] === 't') { const t = tileRect(ic[1]); if (t) [url, rect] = t; }
    else if (ic && ic[0] === 'f') { const img = document.createElement('img'); img.src = ic[1]; img.className = 'iimg'; img.loading = 'lazy'; el.appendChild(img); return; }
    if (!rect) { el.innerHTML = '<div class="noimg">sem ícone</div>'; return; }
    const [x, y, w, h, ox, oy, fw, fh] = rect;
    // icone de item: encaixa o quadro inteiro (32x32); sprite de tile: so a area recortada, senao fica minusculo
    const tile = ic[0] === 't';
    const s = tile ? Math.min(box / w, box / h, 1) : Math.min(box / fw, box / fh);
    const left = tile ? (box - w * s) / 2 : (box - fw * s) / 2 + ox * s, top = tile ? (box - h * s) / 2 : (box - fh * s) / 2 + oy * s;
    const d = document.createElement('div'); d.className = 'img';
    d.style.cssText = `width:${w}px;height:${h}px;left:${left}px;top:${top}px;transform:scale(${s});background-image:url("${url}");background-position:-${x}px -${y}px;background-repeat:no-repeat`;
    el.appendChild(d);
  }

  // ---------- estado / filtros ----------
  const sel = { type: new Set(), cat: new Set(), mod: new Set() };
  let q = '', sort = 'name', internal = false, selected = null, result = [], shown = 0;
  const PAGE = 300;
  const active = () => document.body.classList.contains('view-items');

  function chips(el, group, items) {
    el.innerHTML = '';
    for (const [key, label, n] of items) {
      const d = document.createElement('div'); d.className = 'chip'; d.innerHTML = `<span>${esc(label)}</span><span>${n}</span>`;
      d.onclick = () => { const s = sel[group]; s.has(key) ? s.delete(key) : s.add(key); d.classList.toggle('on', s.has(key)); refresh(); };
      el.appendChild(d);
    }
  }
  function buildChips() {
    const live = rows.filter(it => !it.internal);
    const cnt = k => { const c = {}; live.forEach(it => { const x = k(it); c[x] = (c[x] || 0) + 1; }); return c; };
    const byCount = o => Object.entries(o).sort((a, b) => b[1] - a[1]);
    chips($('#i-type'), 'type', byCount(cnt(it => it.type)).map(([k, n]) => [k, typeLabel(k), n]));
    chips($('#i-cat'), 'cat', Object.entries(cnt(it => it.cat)).sort((a, b) => catLabel(a[0]).localeCompare(catLabel(b[0]))).map(([k, n]) => [k, catLabel(k), n]));
    chips($('#i-mod'), 'mod', byCount(cnt(it => it.mod)).sort((a, b) => (a[0] === 'vanilla' ? -1 : b[0] === 'vanilla' ? 1 : 0)).map(([k, n]) => [k, k, n]));
  }

  // ---------- busca ----------
  const NUMF = { weight: it => it.n.weight, peso: it => it.n.weight, dmg: it => it.n.dmg, dano: it => it.n.dmg, cal: it => it.n.cal, cap: it => it.n.cap, range: it => it.n.range };
  function matches(it, tokens) {
    for (const t of tokens) {
      let m;
      if ((m = /^mod:(.+)$/.exec(t))) { if (!it.mod.toLowerCase().includes(m[1])) return false; continue; }
      if ((m = /^cat:(.+)$/.exec(t))) { if (!(it.cat + ' ' + catLabel(it.cat)).toLowerCase().includes(m[1])) return false; continue; }
      if ((m = /^type:(.+)$/.exec(t))) { if (!(it.type + ' ' + typeLabel(it.type)).toLowerCase().includes(m[1])) return false; continue; }
      if ((m = /^tag:(.+)$/.exec(t))) { if (!it.tags.some(x => x.toLowerCase().includes(m[1]))) return false; continue; }
      if ((m = /^k:(.+)$/.exec(t))) { if (!Object.keys(it.props).some(k => k.toLowerCase() === m[1])) return false; continue; }
      if ((m = /^(\w+)([<>]=?)([\d.]+)$/.exec(t)) && NUMF[m[1]]) { const v = NUMF[m[1]](it), n = +m[3]; if (!{ '>': v > n, '>=': v >= n, '<': v < n, '<=': v <= n }[m[2]]) return false; continue; }
      if ((m = /^(\w+)=(.*)$/.exec(t))) { if (!Object.entries(it.props).some(([k, v]) => k.toLowerCase() === m[1] && v.toLowerCase().includes(m[2]))) return false; continue; }
      if (t.startsWith('-')) { if (it.hay.includes(t.slice(1))) return false; continue; }
      if (!it.hay.includes(t)) return false;
    }
    return true;
  }
  function refresh() {
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    result = rows.filter(it => (internal || !it.internal) &&
      (sel.type.size === 0 || sel.type.has(it.type)) &&
      (sel.cat.size === 0 || sel.cat.has(it.cat)) &&
      (sel.mod.size === 0 || sel.mod.has(it.mod)) &&
      (tokens.length === 0 || matches(it, tokens)));
    const key = { name: null, weight: it => -it.n.weight, dmg: it => -it.n.dmg, cal: it => -it.n.cal, cap: it => -it.n.cap }[sort];
    result.sort((a, b) => (key ? key(a) - key(b) : 0) || disp(a).localeCompare(disp(b)));
    $('#status').textContent = result.length.toLocaleString('pt-BR') + ' itens';
    $('#igrid').innerHTML = ''; shown = 0; renderMore();
  }

  // ---------- grade ----------
  function statTags(it) {
    const p = it.props, t = [];
    if (it.n.weight) t.push(['⚖', it.n.weight, 'peso']);
    if (it.type === 'weapon' && it.n.dmg) t.push(['⚔', num(p.MinDamage) + '–' + it.n.dmg, 'dano mín–máx']);
    if (it.n.cal) t.push(['🔥', it.n.cal, 'calorias']);
    if (it.n.cap) t.push(['📦', it.n.cap, 'capacidade']);
    if (p.SkillTrained) t.push(['📖', p.SkillTrained + (p.LvlSkillTrained ? ' ' + p.LvlSkillTrained + '–' + (+p.LvlSkillTrained + (+p.NumLevelsTrained || 1) - 1) : ''), 'habilidade']);
    return t.map(([ic, v, title]) => `<span class="tag" title="${title}">${ic} <b>${esc(v)}</b></span>`).join('');
  }
  const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { paintIcon(e.target.querySelector('.ithumb'), rows[e.target.dataset.i], 48); io.unobserve(e.target); } }, { rootMargin: '400px' });
  function card(it) {
    const c = document.createElement('div'); c.className = 'icard' + (selected === it ? ' sel' : ''); c.dataset.i = it.i;
    c.innerHTML = `<div class="ithumb"></div><div class="ibody"><div class="name" title="${esc(disp(it))}">${esc(disp(it))}</div><div class="id" title="${esc(it.id)}">${esc(it.id)}</div>
      <div class="vstats"><span class="tag fn">${esc(catLabel(it.cat))}</span>${statTags(it)}${it.mod !== 'vanilla' ? `<span class="tag">${esc(it.mod)}</span>` : ''}</div></div>`;
    c.onclick = () => select(it, c); io.observe(c);
    return c;
  }
  function renderMore() {
    const g = $('#igrid'); const old = $('#imore'); if (old) old.remove();
    const frag = document.createDocumentFragment(); const end = Math.min(result.length, shown + PAGE);
    for (let i = shown; i < end; i++) frag.appendChild(card(result[i]));
    shown = end; g.appendChild(frag);
    if (shown < result.length) { const m = document.createElement('div'); m.id = 'imore'; m.className = 'more'; m.textContent = `mostrando ${shown} de ${result.length} — role para carregar mais`; g.appendChild(m); moreIO.observe(m); }
  }
  const moreIO = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) renderMore(); }, { root: $('#grid-wrap-i'), rootMargin: '600px' });

  // ---------- painel ----------
  const KEY_STATS = [
    ['Peso', 'Weight'], ['Dano mín / máx', p => p.MinDamage || p.MaxDamage ? (p.MinDamage || 0) + ' / ' + (p.MaxDamage || 0) : ''], ['Alcance', 'MaxRange'], ['Crítico %', 'CriticalChance'],
    ['Condição máx.', 'ConditionMax'], ['Munição', 'AmmoType'], ['Pente', 'MaxAmmo'], ['Calorias', 'Calories'], ['Fome', 'HungerChange'], ['Sede', 'ThirstChange'],
    ['Dias fresco / podre', p => p.DaysFresh ? p.DaysFresh + ' / ' + (p.DaysTotallyRotten || '—') : ''], ['Capacidade', 'Capacity'], ['Redução de peso', 'WeightReduction'],
    ['Local do corpo', 'BodyLocation'], ['Isolamento', 'Insulation'], ['Defesa mordida / arranhão', p => p.BiteDefense || p.ScratchDefense ? (p.BiteDefense || 0) + ' / ' + (p.ScratchDefense || 0) : ''],
    ['Habilidade', p => p.SkillTrained ? p.SkillTrained + ' (nível ' + (p.LvlSkillTrained || '?') + ', +' + (p.NumLevelsTrained || 1) + ')' : ''], ['Receitas ensinadas', p => p.LearnedRecipes || p.TeachedRecipes || ''], ['Sprite do móvel', 'WorldObjectSprite'],
  ];
  function select(it, c) {
    selected = it; document.querySelectorAll('.icard.sel').forEach(x => x.classList.remove('sel')); if (c) c.classList.add('sel');
    const p = it.props; const panel = $('#ipanel'); $('#imain').classList.add('with-panel');
    const lua = `getPlayer():getInventory():AddItem("${it.id}")`;
    const key = KEY_STATS.map(([label, f]) => [label, typeof f === 'function' ? f(p) : p[f]]).filter(x => x[1]).map(([l, v]) => `<tr><td>${l}</td><td>${esc(v)}</td></tr>`).join('');
    const all = Object.entries(p).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('');
    const sprite = p.WorldObjectSprite && tileRect(p.WorldObjectSprite.trim()) ? p.WorldObjectSprite.trim() : '';
    panel.innerHTML = `<button class="close" id="iclose">✕</button>
      <div class="ithumb big"></div>
      <h2>${esc(disp(it))}</h2>
      <div class="sub">${it.pt && it.en && it.pt !== it.en ? esc(it.en) + ' · ' : ''}${esc(typeLabel(it.type))} · ${esc(catLabel(it.cat))} · ${esc(it.mod)}${it.ovr.length ? ' · alterado por ' + esc(it.ovr.join(', ')) : ''}</div>
      <div><code>${esc(it.id)}</code></div>
      <div class="row"><button class="primary" data-copy="${esc(it.id)}">Copiar ID</button><button data-copy="${esc(lua)}">Copiar AddItem (console)</button>${sprite ? '<button id="isprite">Ver tile</button>' : ''}</div>
      ${it.tags.length ? `<div class="row">${it.tags.map(t => `<span class="tag fn itag" data-tag="${esc(t)}" style="cursor:pointer">${esc(t)}</span>`).join('')}</div>` : ''}
      ${key ? `<table>${key}</table>` : ''}
      <h3 style="margin:14px 0 4px;font-size:12px;color:var(--fg3)">TODAS AS PROPRIEDADES (${Object.keys(p).length})</h3>
      <table>${all}</table>
      <div class="hint">O comando roda no console Lua do modo debug. Tags são clicáveis (buscam <code>tag:</code>).</div>`;
    paintIcon(panel.querySelector('.ithumb'), it, 96);
    panel.querySelectorAll('[data-copy]').forEach(b => b.onclick = () => copy(b.dataset.copy));
    panel.querySelectorAll('.itag').forEach(t => t.onclick = () => { q = 'tag:' + t.dataset.tag.toLowerCase(); $('#q').value = q; refresh(); });
    if (sprite) $('#isprite').onclick = () => { window.PZ_setView('tiles'); $('#q').value = sprite; $('#q').dispatchEvent(new Event('input')); };
    $('#iclose').onclick = close;
  }
  function close() { selected = null; $('#imain').classList.remove('with-panel'); document.querySelectorAll('.icard.sel').forEach(x => x.classList.remove('sel')); }
  function copy(t) { navigator.clipboard.writeText(t).then(() => toast('Copiado: ' + t.slice(0, 60))); }
  let toastT; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 1400); }

  // ---------- eventos / registro da aba ----------
  let deb; $('#q').addEventListener('input', e => { if (!active()) return; clearTimeout(deb); deb = setTimeout(() => { q = e.target.value; refresh(); }, 120); });
  $('#isort').onchange = e => { sort = e.target.value; refresh(); };
  $('#iinternal').onchange = e => { internal = e.target.checked; refresh(); };
  $('#clear').addEventListener('click', () => { if (!active()) return; Object.values(sel).forEach(s => s.clear()); document.querySelectorAll('#imain .chip.on').forEach(c => c.classList.remove('on')); q = ''; $('#q').value = ''; refresh(); });
  document.addEventListener('keydown', e => { if (active() && e.key === 'Escape' && selected && document.activeElement !== $('#q')) close(); });
  window.PZ_VIEWS = window.PZ_VIEWS || {};
  window.PZ_VIEWS.items = {
    ph: 'Buscar item: nome, ID, categoria, tag…  (ex.: machado, cat:comida, tag:sharpknife, dmg>2, weight<0.5, mod:ki5)',
    meta: () => `${rows.length.toLocaleString('pt-BR')} itens · ${new Set(rows.map(r => r.mod)).size} fontes · gerado ${D.generated ? new Date(D.generated).toLocaleString('pt-BR') : '—'}`,
    show: () => { q = ''; refresh(); },
  };
  if (!rows.length) $('#igrid').innerHTML = '<p style="color:var(--fg3)">data/items.js não encontrado — rode <code>node build_items.js</code>.</p>';
  else buildChips();
})();
