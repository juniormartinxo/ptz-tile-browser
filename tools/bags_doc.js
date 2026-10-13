// Gera docs/bags.md a partir de data/items.js: o que conta como bolsa, formato dos dados, contagens por
// classe, slot e origem, e o catalogo de todas as bolsas. Uso: node tools/bags_doc.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {}; require(path.join(ROOT, 'data/items.js'));
const D = window.PZ_ITEMS;
const C = D.items.filter(it => it.type === 'container');
// bolsa = conteiner que vai no corpo: tem um slot em CanBeEquipped
const B = C.filter(it => it.props.CanBeEquipped);
const OTHER = C.filter(it => !it.props.CanBeEquipped);

const fmt = n => n.toLocaleString('pt-BR');
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const inc = (o, k, n = 1) => o[k] = (o[k] || 0) + n;
const num = v => parseFloat(v) || 0;
const yes = v => /^true$/i.test(v || '');
const catLabel = c => c ? (D.cats.pt[c] || D.cats.en[c] || c) : '(sem categoria)';
const name = it => it.pt || (it.en ? '_' + it.en + '_' : '`' + it.id.replace(/^[^.]*\./, '') + '`');
// mesma regra da aba Itens: categorias internas e OBSOLETE ficam ocultas por padrao (le INTERNAL_CATS direto do items.js)
const itemsJs = fs.readFileSync(path.join(ROOT, 'items.js'), 'utf8');
const internalSrc = (itemsJs.match(/const INTERNAL_CATS = new Set\((\[[^\]]*\])\);/) || [])[1];
if (!internalSrc) throw new Error('nao achei INTERNAL_CATS no items.js');
const INTERNAL_CATS = new Set(new Function('return ' + internalSrc)());
const hidden = it => INTERNAL_CATS.has(it.cat) || yes(it.props.OBSOLETE);

// ---------- classe: a familia do slot (CanBeEquipped), pela palavra no nome do slot ----------
// O jogo nao agrupa os slots: a tabela e mantida aqui. Um slot que nenhuma classe reconhece, ou uma classe sem bolsas,
// faz o script falhar, para a tabela nao ficar para tras quando os dados mudarem.
const CLASS_SLOTS = [
  ['Costas', /^base:back$/i],
  ['Tiracolo', /satchel/i],
  ['Pochete', /fanny/i],
  ['Colete', /webbing|chestrig/i],
  ['Cinto', /belt/i],
  ['Porta-máscara', /gasmask/i],
  ['Bandoleira', /ammostrap/i],
  ['Coldre', /holster/i],
  ['Tail', /^alice:tail$/i],
];
const CLASSES = CLASS_SLOTS.map(c => c[0]);
const slotClass = s => (CLASS_SLOTS.find(([, re]) => re.test(s)) || [])[0];
const classOf = it => slotClass(it.props.CanBeEquipped);
const unknown = [...new Set(B.filter(it => !classOf(it)).map(it => it.props.CanBeEquipped))];
if (unknown.length) throw new Error('slots de bolsa que nenhuma classe de CLASS_SLOTS reconhece: ' + unknown.join(', '));
const unused = CLASSES.filter(c => !B.some(it => classOf(it) === c));
if (unused.length) throw new Error('classes de CLASS_SLOTS sem nenhuma bolsa em data/items.js: ' + unused.join(', '));
const slotKey = s => s.toLowerCase();
const FANNY = 'Pochete', notFanny = it => classOf(it) === FANNY && !/fanny|pochete/i.test(it.id + ' ' + it.en + ' ' + it.pt);
const baseName = it => (it.pt || it.en || it.id).replace(/\s*\([^)]*\)\s*$/, '');

// ---------- contagens ----------
const byClass = {}, bySlot = {}, bySrc = {}, byCat = {}, propCnt = {}, propVals = {}, otherCat = {};
for (const it of B) {
  (byClass[classOf(it)] || (byClass[classOf(it)] = [])).push(it);
  const sk = slotKey(it.props.CanBeEquipped), s = bySlot[sk] || (bySlot[sk] = { n: 0, raw: new Set() });
  s.n++; s.raw.add(it.props.CanBeEquipped);
  const o = bySrc[it.mod] || (bySrc[it.mod] = { n: 0, cls: {} }); o.n++; inc(o.cls, classOf(it));
  inc(byCat, it.cat);
  for (const [k, v] of Object.entries(it.props)) {
    inc(propCnt, k);
    const vs = propVals[k] || (propVals[k] = new Map()); vs.set(v, (vs.get(v) || 0) + 1);
  }
}
for (const it of OTHER) { const o = otherCat[it.cat] || (otherCat[it.cat] = { n: 0, names: new Set() }); o.n++; o.names.add(name(it)); }
// itens de outro tipo que declaram um slot de bolsa (em CanBeEquipped ou BodyLocation): ficam fora, mas o doc diz quais
const bagSlots = new Set(B.map(it => slotKey(it.props.CanBeEquipped)));
const itemSlot = it => [it.props.CanBeEquipped, it.props.BodyLocation].find(s => s && bagSlots.has(slotKey(s)));
const outside = {};
for (const it of D.items) {
  if (it.type === 'container' || !itemSlot(it)) continue;
  const o = outside[it.type] || (outside[it.type] = { n: 0, names: new Set(), slots: new Set() }); o.n++; o.names.add(baseName(it)); o.slots.add(itemSlot(it));
}
const srcOrder = Object.keys(bySrc).sort((a, b) => (a === 'vanilla' ? -1 : b === 'vanilla' ? 1 : bySrc[b].n - bySrc[a].n || a.localeCompare(b)));
const withPt = B.filter(it => it.pt).length, nHidden = B.filter(hidden).length;
const nOvr = B.filter(it => it.ovr.length).length;
const withBody = B.filter(it => it.props.BodyLocation), nBody = withBody.length;
const bodyDiff = withBody.filter(it => it.props.BodyLocation !== it.props.CanBeEquipped);
const bodyNoPrefix = bodyDiff.length > 0 && bodyDiff.every(it => it.props.CanBeEquipped.endsWith(':' + it.props.BodyLocation));
const byName = (a, b) => (a.pt || a.en || a.id).localeCompare(b.pt || b.en || b.id) || a.id.localeCompare(b.id);
const all = (list, f) => list.length > 0 && list.every(f);
const maxBy = (list, f) => list.reduce((m, it) => (f(it) > f(m) ? it : m));

// ---------- markdown ----------
const out = [];
const p = (...l) => out.push(...l);
const RIGHT = /^(Bolsas|Contêineres|Itens|Capacidade|Redução %|Peso|Velocidade)$/;
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '| ' + head.map(h => RIGHT.test(h) || CLASSES.includes(h) ? '---:' : '---').join(' | ') + ' |'); rows.forEach(r => p('| ' + r.map(cell).join(' | ') + ' |')); p(''); };
// ancora do GitHub: mantem letras acentuadas, nao as troca pela letra sem acento
const anchor = s => s.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
const origin = it => it.mod + (it.ovr.length ? ' (alterada por ' + it.ovr.join(', ') + ')' : '');
const label = it => name(it) + (hidden(it) ? ' (oculta)' : '');
const big = maxBy(B, it => num(it.props.Capacity));

p('# Bolsas', '',
  '> Gerado por `node tools/bags_doc.js` a partir de `data/items.js` (extraído em ' + D.generated.slice(0, 10) + '). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.', '',
  'Uma **bolsa** é um contêiner que vai no corpo: um item de script (`media/scripts`) cujo tipo é `container` (`ItemType = base:container`) e que declara um slot em `CanBeEquipped` (`base:back`, `base:satchel`...). São mochilas, bolsas de viagem, bolsas a tiracolo, pochetes, coletes, bolsas de cinto, bandoleiras e coldres. Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.Bag_Schoolbag`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.Bag_Schoolbag")`.', '',
  `Total mapeado: **${fmt(B.length)} bolsas** de ${fmt(srcOrder.length)} origens (${fmt(bySrc.vanilla ? bySrc.vanilla.n : 0)} do jogo base), ${fmt(withPt)} com nome em PT-BR, ${fmt(nOvr)} ${nOvr === 1 ? 'alterada' : 'alteradas'} por outro mod e ${fmt(nHidden)} ${nHidden === 1 ? 'oculta' : 'ocultas'} por padrão na aba Itens. A maior é ${name(big)} (\`${big.id}\`), com capacidade ${num(big.props.Capacity)}.`, '',
  `Os outros ${fmt(OTHER.length)} contêineres (sacos, sacolas, estojos, caixas, chaveiros...) não têm \`CanBeEquipped\` e ficam fora do catálogo (veja [Outros contêineres](#outros-contêineres)), assim como os itens de outros tipos que usam um slot de bolsa (veja [Fora do catálogo](#fora-do-catálogo)).`, '',
  '## Como as bolsas são mapeadas', '',
  '`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):', '',
  '1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"18"`, `"0.98"`, `"base:back"`).',
  '2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.',
  '3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.',
  '4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que for achado, como `Item_<nome>` ou `<nome>`, nos packs de textura lidos (`UI`, `UI2`, `IconsMoveables`, `RadioIcons`, `ApComUI` e os `pack=` dos mods) ou nos `.png` soltos de `media/textures`. Sem nenhum, um item com `WorldObjectSprite` usa o sprite do tile.', '',
  'Na aba Itens, o filtro "Tipo → Contêiner / bolsa" da barra lateral mostra todos os contêineres, inclusive os que não vão no corpo; na busca, `type:bolsa k:canbeequipped` deixa só as bolsas e `canbeequipped=satchel` filtra pelo slot. A comparação é por trecho e sem diferenciar maiúsculas: `canbeequipped=back` traz também `base:fannypackback` e `KATTAJ1:BackFanny`.', '',
  '## Formato de `data/items.js`', '',
  'As bolsas ficam junto com os demais itens:', '',
  '```js',
  'window.PZ_ITEMS = {',
  '  generated: "' + D.generated + '",   // data da extração',
  '  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png',
  '  cats: { pt: { Bag: "' + catLabel('Bag') + '", ... }, en: { ... } },   // nomes de DisplayCategory',
  '  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]',
  '};',
  '```', '');
table(['Campo', 'Descrição'], [
  ['`id`', '`<Módulo>.<Nome>`, ex.: `Base.Bag_ALICEpack`.'],
  ['`mod`', '`vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro.'],
  ['`ovr`', 'Mods que redefiniram o item depois (propriedades mescladas por cima).'],
  ['`type`', '`ItemType` (ou `Type`, se faltar) sem `base:`, em minúsculas e só com letras: `container` para todas as bolsas.'],
  ['`cat`', '`DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`).'],
  ['`pt`, `en`', 'Nomes de exibição, ou `""`.'],
  ['`icon`', '`["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`.'],
  ['`props`', 'Todas as propriedades do bloco `item`, como strings. Nas bolsas, as principais são `CanBeEquipped` (slot), `Capacity` (capacidade), `WeightReduction` (redução de peso, em %), `Weight` (peso) e `RunSpeedModifier`.'],
]);

const backKinds = [[/duffel/i, 'bolsas de viagem'], [/case/i, 'estojos de arma']].filter(([re]) => B.some(it => classOf(it) === 'Costas' && re.test(it.id))).map(k => k[1]);
const odd = [...new Set(B.filter(notFanny).map(baseName))];
p('## Por classe', '',
  'A classe não é um campo do jogo: é a família do slot em `CanBeEquipped`, que este script reconhece pela palavra no nome do slot (`fanny`, `belt`, `webbing`...), por uma tabela mantida no script (veja [Por slot](#por-slot)). O script falha se aparecer um slot que nenhuma classe reconhece ou se uma classe ficar sem bolsas. A classe segue o slot, não o nome da bolsa' +
  (backKinds.length ? ': em "Costas" (`base:back`) há também ' + backKinds.join(' e ') : '') +
  (odd.length ? `${backKinds.length ? ', e' : ':'} em "${FANNY}" há ${fmt(B.filter(notFanny).length)} bolsas sem "fanny" nem "pochete" no ID nem no nome (${odd.map(n => '_' + n + '_').join(', ')})` : '') + '. ' +
  `\`BodyLocation\`, quando existe (${fmt(nBody)} bolsas), repete o slot` + (bodyDiff.length ? ` em ${fmt(nBody - bodyDiff.length)} delas; ${bodyDiff.length === 1 ? 'na outra, vem' : `nas outras ${fmt(bodyDiff.length)}, vem`} ${bodyNoPrefix ? 'sem o prefixo do módulo' : 'diferente'}` : '') + '.', '');
const stat = (list, k) => { const v = list.map(it => num(it.props[k])); return Math.min(...v) === Math.max(...v) ? String(Math.min(...v)) : Math.min(...v) + '–' + Math.max(...v); };
table(['Classe', 'Bolsas', 'Capacidade', 'Redução %'], CLASSES.filter(c => byClass[c]).map(c => ['[' + c + '](#' + anchor(c) + ')', fmt(byClass[c].length), stat(byClass[c], 'Capacity'), stat(byClass[c], 'WeightReduction')]));

p('## Por slot', '', 'Os valores de `CanBeEquipped`, juntando os que só diferem em maiúsculas. Os slots com prefixo de mod (`ALICE:`, `KATTAJ1:`) vêm de mods.', '');
table(['Slot', 'Classe', 'Bolsas'], Object.values(bySlot).map(o => ({ ...o, c: slotClass([...o.raw][0]) })).sort((a, b) => CLASSES.indexOf(a.c) - CLASSES.indexOf(b.c) || b.n - a.n).map(o => [[...o.raw].map(r => '`' + r + '`').join(', '), o.c, fmt(o.n)]));

p('## Por origem', '');
table(['Origem', 'Bolsas', ...CLASSES], srcOrder.map(s => [s, fmt(bySrc[s].n), ...CLASSES.map(c => fmt(bySrc[s].cls[c] || 0))]));

const mementos = B.filter(it => it.cat === 'Memento');
p('## Por categoria', '', 'A `DisplayCategory`, que é o filtro "Categoria" da aba Itens.' + (all(mementos, it => /\bbase:ismemento\b/i.test(it.props.Tags || '')) ? ' As de `Memento` têm todas a tag `ismemento`.' : ''), '');
table(['Categoria', 'Nome', 'Bolsas'], Object.entries(byCat).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c, n]) => [c ? '`' + c + '`' : '(vazia)', catLabel(c), fmt(n)]));

p('## Propriedades', '', `As ${Object.keys(propCnt).length} chaves que aparecem em \`props\` das bolsas, da mais comum à mais rara. Na aba Itens, \`k:Chave\` filtra quem tem a chave e \`chave=valor\` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (\`+N\` = outros N valores distintos).`, '');
table(['Propriedade', 'Bolsas', 'Valores'], Object.entries(propCnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, n]) => {
  const vs = [...propVals[k]].sort((a, b) => b[1] - a[1]);
  const shown = vs.slice(0, 5).map(([v, c]) => (v === '' ? '(vazio)' : '`' + v + '`') + ' ' + fmt(c)).join(', ');
  return ['`' + k + '`', fmt(n), shown + (vs.length > 5 ? `, +${fmt(vs.length - 5)}` : '')];
}));

p('## Catálogo', '',
  'Todas as bolsas por classe, da maior capacidade para a menor e depois em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). As colunas mostram as propriedades cruas: capacidade é `Capacity`, redução é `WeightReduction`, peso é `Weight`, velocidade é `RunSpeedModifier` (— quando a propriedade falta) e slot é `CanBeEquipped`. "Extras" junta `AttachmentsProvided` ("pendura"), `AcceptItemFunction` ("aceita") e `MaxItemSize` ("item até").', '');
const extras = it => [it.props.AttachmentsProvided && 'pendura: ' + it.props.AttachmentsProvided.split(';').map(s => '`' + s.trim() + '`').join(', '),
  it.props.AcceptItemFunction && 'aceita: `' + it.props.AcceptItemFunction + '`', it.props.MaxItemSize && 'item até ' + num(it.props.MaxItemSize)].filter(Boolean).join('; ') || '—';
for (const c of CLASSES) {
  const list = byClass[c]; if (!list) continue;
  p('### ' + c, '');
  table(['Nome', 'ID', 'Origem', 'Slot', 'Capacidade', 'Redução %', 'Peso', 'Velocidade', 'Extras'], list.sort((a, b) => num(b.props.Capacity) - num(a.props.Capacity) || byName(a, b)).map(it => [
    label(it), '`' + it.id + '`', origin(it), '`' + it.props.CanBeEquipped + '`', num(it.props.Capacity), num(it.props.WeightReduction), it.props.Weight ? num(it.props.Weight) : '—',
    it.props.RunSpeedModifier ? num(it.props.RunSpeedModifier) : '—', extras(it)]));
}

p('## Outros contêineres', '', `Os ${fmt(OTHER.length)} contêineres sem \`CanBeEquipped\`, por \`DisplayCategory\`, com até 8 nomes distintos de cada. Ficam fora do catálogo.`, '');
table(['Categoria', 'Nome', 'Contêineres', 'Exemplos'], Object.entries(otherCat).sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0])).map(([c, o]) => [
  c ? '`' + c + '`' : '(vazia)', catLabel(c), fmt(o.n), [...o.names].slice(0, 8).join('; ') + (o.names.size > 8 ? '...' : '')]));

p('## Fora do catálogo', '', 'Itens de outros tipos (não `container`) cujo `CanBeEquipped` ou `BodyLocation` é um dos slots das bolsas. Usam o mesmo slot, mas não são contêineres. "Exemplos" mostra os nomes distintos (PT-BR ou, sem tradução, inglês), sem a variação entre parênteses no fim, como a cor.', '');
table(['Tipo', 'Itens', 'Slots', 'Exemplos'], Object.entries(outside).sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0])).map(([t, o]) => [
  '`' + t + '`', fmt(o.n), [...o.slots].map(s => '`' + s + '`').join(', '), [...o.names].join('; ')]));

const file = path.join(ROOT, 'docs/bags.md');
fs.writeFileSync(file, out.join('\n'));
console.log(file, (fs.statSync(file).size / 1e3).toFixed(0) + 'KB');
