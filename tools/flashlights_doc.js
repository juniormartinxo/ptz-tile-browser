// Gera docs/flashlights.md a partir de data/items.js: o que conta como lanterna, formato dos dados, contagens por
// classe e origem, propriedades, o catalogo de todas as lanternas e o que fica de fora. Uso: node tools/flashlights_doc.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {}; require(path.join(ROOT, 'data/items.js'));
const D = window.PZ_ITEMS;

const fmt = n => n.toLocaleString('pt-BR');
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const inc = (o, k, n = 1) => o[k] = (o[k] || 0) + n;
const num = v => parseFloat(v) || 0;
const yes = v => /^true$/i.test(v || '');
const catLabel = c => c ? (D.cats.pt[c] || D.cats.en[c] || c) : '(sem categoria)';
const name = it => it.pt || (it.en ? '_' + it.en + '_' : '`' + it.id.replace(/^[^.]*\./, '') + '`');
const tags = it => (it.props.Tags || '').split(';').map(s => s.trim()).filter(Boolean);
// mesma regra da aba Itens: categorias internas e OBSOLETE ficam ocultas por padrao (le INTERNAL_CATS direto do items.js)
const itemsJs = fs.readFileSync(path.join(ROOT, 'items.js'), 'utf8');
const internalSrc = (itemsJs.match(/const INTERNAL_CATS = new Set\((\[[^\]]*\])\);/) || [])[1];
if (!internalSrc) throw new Error('nao achei INTERNAL_CATS no items.js');
const INTERNAL_CATS = new Set(new Function('return ' + internalSrc)());
const hidden = it => INTERNAL_CATS.has(it.cat) || yes(it.props.OBSOLETE);

// lanterna = item com a tag flashlight (com ou sem prefixo de modulo, sem diferenciar maiusculas)
const isFlashlight = it => tags(it).some(t => /^(\w+:)?flashlight$/i.test(t));
const F = D.items.filter(isFlashlight);
const noLight = F.filter(it => !it.props.LightStrength);
if (noLight.length) throw new Error('lanternas sem LightStrength: ' + noLight.map(it => it.id).join(', '));

// ---------- classe: pelo tipo e pelo feixe (TorchCone) ----------
// O jogo nao agrupa as lanternas: a tabela e mantida aqui. Uma lanterna que nenhuma classe reconhece, ou uma classe sem
// lanternas, faz o script falhar, para a tabela nao ficar para tras quando os dados mudarem.
const CLASS_RULES = [
  ['De mão', it => it.type === 'drainable' && yes(it.props.TorchCone), '`drainable` com `TorchCone = true`'],
  ['Ambiente', it => it.type === 'drainable' && !yes(it.props.TorchCone), '`drainable` com `TorchCone = false`'],
  ['Para arma', it => it.type === 'weaponpart', '`weaponpart`'],
];
const CLASSES = CLASS_RULES.map(c => c[0]);
const classOf = it => (CLASS_RULES.find(([, f]) => f(it)) || [])[0];
const unknown = F.filter(it => !classOf(it));
if (unknown.length) throw new Error('lanternas que nenhuma classe de CLASS_RULES reconhece: ' + unknown.map(it => it.id + ' (' + it.type + ')').join(', '));
const unused = CLASSES.filter(c => !F.some(it => classOf(it) === c));
if (unused.length) throw new Error('classes de CLASS_RULES sem nenhuma lanterna em data/items.js: ' + unused.join(', '));

// ---------- contagens ----------
const byClass = {}, bySrc = {}, byCat = {}, propCnt = {}, propVals = {}, byTag = {};
for (const it of F) {
  (byClass[classOf(it)] || (byClass[classOf(it)] = [])).push(it);
  const o = bySrc[it.mod] || (bySrc[it.mod] = { n: 0, cls: {} }); o.n++; inc(o.cls, classOf(it));
  inc(byCat, it.cat);
  for (const t of tags(it)) if (/flashlight/i.test(t)) inc(byTag, t);
  for (const [k, v] of Object.entries(it.props)) {
    inc(propCnt, k);
    const vs = propVals[k] || (propVals[k] = new Map()); vs.set(v, (vs.get(v) || 0) + 1);
  }
}
const srcOrder = Object.keys(bySrc).sort((a, b) => (a === 'vanilla' ? -1 : b === 'vanilla' ? 1 : bySrc[b].n - bySrc[a].n || a.localeCompare(b)));
const withPt = F.filter(it => it.pt).length, nHidden = F.filter(hidden).length;
const nOvr = F.filter(it => it.ovr.length).length;
const byName = (a, b) => (a.pt || a.en || a.id).localeCompare(b.pt || b.en || b.id);
const maxBy = (list, f) => list.reduce((m, it) => (f(it) > f(m) ? it : m));
const far = maxBy(F, it => num(it.props.LightDistance));
// a busca tag:flashlight da aba Itens compara por trecho, sem o prefixo base: (ve items.js)
const tagSearch = D.items.filter(it => tags(it).some(t => t.replace(/^base:/i, '').toLowerCase().includes('flashlight')));
const tagSearchExtra = tagSearch.filter(it => !isFlashlight(it));
// fora do catalogo: outras fontes de luz (LightStrength sem a tag) e itens com lanterna/flashlight/lantern no ID ou no nome
const NAME_RE = /flashlight|lantern/i;
const outside = D.items.filter(it => !isFlashlight(it) && (it.props.LightStrength || NAME_RE.test([it.id, it.en, it.pt].join(' '))));
const outsideLight = outside.filter(it => it.props.LightStrength);
const unlit = outside.filter(it => !it.props.LightStrength && tags(it).some(t => /unlitlantern/i.test(t)));
// o filtro "Categoria" da barra lateral: quanto a categoria principal das lanternas traz alem delas, e quais lanternas ficam fora
const mainCat = Object.entries(F.reduce((o, it) => (inc(o, it.cat), o), {})).sort((a, b) => b[1] - a[1])[0][0];
const catOthers = D.items.filter(it => it.cat === mainCat && !isFlashlight(it) && !hidden(it)).length;
const catMissing = F.filter(it => it.cat !== mainCat);

// ---------- markdown ----------
const out = [];
const p = (...l) => out.push(...l);
const RIGHT = /^(Lanternas|Itens|Força|Alcance|Feixe|Consumo|Peso)$/;
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '| ' + head.map(h => RIGHT.test(h) || CLASSES.includes(h) ? '---:' : '---').join(' | ') + ' |'); rows.forEach(r => p('| ' + r.map(cell).join(' | ') + ' |')); p(''); };
// ancora do GitHub: mantem letras acentuadas, nao as troca pela letra sem acento
const anchor = s => s.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
const origin = it => it.mod + (it.ovr.length ? ' (alterada por ' + it.ovr.join(', ') + ')' : '');
const label = it => name(it) + (hidden(it) ? ' (oculta)' : '');
const stat = (list, k) => { const v = list.map(it => num(it.props[k])); return Math.min(...v) === Math.max(...v) ? String(Math.min(...v)) : Math.min(...v) + '–' + Math.max(...v); };
const dash = v => v ? num(v) : '—';

p('# Lanternas', '',
  '> Gerado por `node tools/flashlights_doc.js` a partir de `data/items.js` (extraído em ' + D.generated.slice(0, 10) + '). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.', '',
  'Uma **lanterna** é um item de script (`media/scripts`) com a tag `flashlight` em `Tags` (`base:flashlight` no jogo base; um mod pode declará-la sem o prefixo). São as lanternas de mão, a lanterna elétrica improvisada e as lanternas que se montam em armas. Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.HandTorch`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.HandTorch")`.', '',
  `Total mapeado: **${fmt(F.length)} lanternas** de ${fmt(srcOrder.length)} origens (${fmt(bySrc.vanilla ? bySrc.vanilla.n : 0)} do jogo base), ${fmt(withPt)} com nome em PT-BR, ${fmt(nOvr)} ${nOvr === 1 ? 'alterada' : 'alteradas'} por outro mod e ${fmt(nHidden)} ${nHidden === 1 ? 'oculta' : 'ocultas'} por padrão na aba Itens. A de maior alcance é ${name(far)} (\`${far.id}\`), com \`LightDistance\` ${num(far.props.LightDistance)}.`, '',
  `As outras ${fmt(outsideLight.length)} fontes de luz (itens com \`LightStrength\` sem a tag) e os itens que só têm "flashlight" ou "lantern" no ID ou no nome ficam fora do catálogo (veja [Fora do catálogo](#fora-do-catálogo)).`, '',
  '## Como as lanternas são mapeadas', '',
  '`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):', '',
  '1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"15"`, `"0.66"`, `"true"`).',
  '2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.',
  '3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.',
  '4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que for achado, como `Item_<nome>` ou `<nome>`, nos packs de textura lidos (`UI`, `UI2`, `IconsMoveables`, `RadioIcons`, `ApComUI` e os `pack=` dos mods) ou nos `.png` soltos de `media/textures`. Sem nenhum, um item com `WorldObjectSprite` usa o sprite do tile.', '',
  `Na aba Itens, a busca \`tag:flashlight\` traz ${tagSearchExtra.length ? `${fmt(tagSearch.length)} itens: as lanternas e mais ${tagSearchExtra.map(it => '`' + it.id + '`').join(', ')}` : 'exatamente as lanternas'} (a comparação é por trecho, sem o prefixo \`base:\` e sem diferenciar maiúsculas; \`flashlightpillar\` também casa). O filtro "Categoria → ${catLabel(mainCat)}" da barra lateral traz mais ${fmt(catOthers)} itens que não são lanternas` +
  (catMissing.length ? ` e deixa de fora ${fmt(catMissing.length)} lanternas (${[...new Set(catMissing.map(it => catLabel(it.cat)))].join(', ')})` : '') + '.', '',
  '## Formato de `data/items.js`', '',
  'As lanternas ficam junto com os demais itens:', '',
  '```js',
  'window.PZ_ITEMS = {',
  '  generated: "' + D.generated + '",   // data da extração',
  '  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png',
  '  cats: { pt: { LightSource: "' + catLabel('LightSource') + '", ... }, en: { ... } },   // nomes de DisplayCategory',
  '  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]',
  '};',
  '```', '');
table(['Campo', 'Descrição'], [
  ['`id`', '`<Módulo>.<Nome>`, ex.: `Base.Torch`.'],
  ['`mod`', '`vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro.'],
  ['`ovr`', 'Mods que redefiniram o item depois (propriedades mescladas por cima).'],
  ['`type`', '`ItemType` (ou `Type`, se faltar) sem `base:`, em minúsculas e só com letras. Nas lanternas: ' + [...new Set(F.map(it => it.type))].map(t => '`' + t + '`').join(' ou ') + '.'],
  ['`cat`', '`DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`).'],
  ['`pt`, `en`', 'Nomes de exibição, ou `""`.'],
  ['`icon`', '`["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`.'],
  ['`props`', 'Todas as propriedades do bloco `item`, como strings. Nas lanternas, as principais são `LightStrength`, `LightDistance`, `TorchCone`, `TorchDot`, `UseDelta` e `Weight`; nas para arma, também `MountOn` e `PartType`.'],
]);

const tagNote = Object.entries(byTag).sort((a, b) => b[1] - a[1]).map(([t, n]) => '`' + t + '` ' + fmt(n)).join(', ');
p('## Por classe', '',
  'A classe não é um campo do jogo: é dada pelo tipo do item e por `TorchCone`, por uma tabela mantida no script. O script falha se aparecer uma lanterna que nenhuma classe reconhece ou se uma classe ficar sem lanternas. Tags com `flashlight` nas lanternas: ' + tagNote + '.', '');
table(['Classe', 'Regra', 'Lanternas', 'Força', 'Alcance'], CLASS_RULES.filter(([c]) => byClass[c]).map(([c, , rule]) => ['[' + c + '](#' + anchor(c) + ')', rule, fmt(byClass[c].length), stat(byClass[c], 'LightStrength'), stat(byClass[c], 'LightDistance')]));

p('## Por origem', '');
table(['Origem', 'Lanternas', ...CLASSES], srcOrder.map(s => [s, fmt(bySrc[s].n), ...CLASSES.map(c => fmt(bySrc[s].cls[c] || 0))]));

p('## Por categoria', '', 'A `DisplayCategory`, que é o filtro "Categoria" da aba Itens.', '');
table(['Categoria', 'Nome', 'Lanternas'], Object.entries(byCat).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c, n]) => [c ? '`' + c + '`' : '(vazia)', catLabel(c), fmt(n)]));

p('## Propriedades', '', `As ${Object.keys(propCnt).length} chaves que aparecem em \`props\` das lanternas, da mais comum à mais rara. Na aba Itens, \`k:Chave\` filtra quem tem a chave e \`chave=valor\` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (\`+N\` = outros N valores distintos).`, '');
table(['Propriedade', 'Lanternas', 'Valores'], Object.entries(propCnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, n]) => {
  const vs = [...propVals[k]].sort((a, b) => b[1] - a[1]);
  const shown = vs.slice(0, 5).map(([v, c]) => (v === '' ? '(vazio)' : '`' + v + '`') + ' ' + fmt(c)).join(', ');
  return ['`' + k + '`', fmt(n), shown + (vs.length > 5 ? `, +${fmt(vs.length - 5)}` : '')];
}));

p('## Catálogo', '',
  'Todas as lanternas por classe, do maior alcance para o menor e depois em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). As colunas mostram as propriedades cruas: força é `LightStrength`, alcance é `LightDistance`, feixe é `TorchDot` (— quando falta), consumo é `UseDelta` e peso é `Weight`. "Extras" junta `AttachmentType` ("pendura em"), `PartType` ("peça") e `MountOn` ("monta em").', '');
const extras = it => [it.props.AttachmentType && 'pendura em `' + it.props.AttachmentType + '`', it.props.PartType && 'peça `' + it.props.PartType + '`',
  it.props.MountOn && 'monta em ' + it.props.MountOn.split(';').map(s => s.trim()).filter(Boolean).map(s => '`' + s + '`').join(', ')].filter(Boolean).join('; ') || '—';
for (const c of CLASSES) {
  const list = byClass[c]; if (!list) continue;
  p('### ' + c, '');
  table(['Nome', 'ID', 'Origem', 'Força', 'Alcance', 'Feixe', 'Consumo', 'Peso', 'Extras'], list.sort((a, b) => num(b.props.LightDistance) - num(a.props.LightDistance) || byName(a, b)).map(it => [
    label(it), '`' + it.id + '`', origin(it), num(it.props.LightStrength), num(it.props.LightDistance), dash(it.props.TorchDot), dash(it.props.UseDelta), dash(it.props.Weight), extras(it)]));
}

p('## Fora do catálogo', '',
  `Itens sem a tag \`flashlight\` que têm \`LightStrength\` (${fmt(outsideLight.length)}) ou que têm "flashlight" ou "lantern" no ID ou no nome (${fmt(outside.length - outsideLight.length)})` +
  (unlit.length ? `, entre eles ${fmt(unlit.length)} lampiões apagados (tag \`unlitlantern\`), que não têm \`LightStrength\`` : '') + '. Força e alcance são `LightStrength` e `LightDistance` (— quando faltam).', '');
table(['Nome', 'ID', 'Origem', 'Tipo', 'Categoria', 'Força', 'Alcance'], outside.sort((a, b) => !!b.props.LightStrength - !!a.props.LightStrength || byName(a, b)).map(it => [
  label(it), '`' + it.id + '`', origin(it), '`' + it.type + '`', catLabel(it.cat), dash(it.props.LightStrength), dash(it.props.LightDistance)]));

const file = path.join(ROOT, 'docs/flashlights.md');
fs.writeFileSync(file, out.join('\n'));
console.log(file, (fs.statSync(file).size / 1e3).toFixed(0) + 'KB');
