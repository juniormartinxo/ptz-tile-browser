// Gera docs/knives.md a partir de data/items.js: o que conta como faca, formato dos dados, contagens por classe e
// origem, propriedades, o catalogo de todas as facas e o que fica de fora. Uso: node tools/knives_doc.js
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
const list = s => (s || '').split(';').map(s => s.trim()).filter(Boolean);
const tags = it => list(it.props.Tags);
const bare = t => t.replace(/^\w+:/, '').toLowerCase();
const hasTag = (it, t) => tags(it).some(x => bare(x) === t);
const skills = it => list(it.props.Categories).map(bare);
// mesma regra da aba Itens: categorias internas e OBSOLETE ficam ocultas por padrao (le INTERNAL_CATS direto do items.js)
const itemsJs = fs.readFileSync(path.join(ROOT, 'items.js'), 'utf8');
const internalSrc = (itemsJs.match(/const INTERNAL_CATS = new Set\((\[[^\]]*\])\);/) || [])[1];
if (!internalSrc) throw new Error('nao achei INTERNAL_CATS no items.js');
const INTERNAL_CATS = new Set(new Function('return ' + internalSrc)());
const hidden = it => INTERNAL_CATS.has(it.cat) || yes(it.props.OBSOLETE);

// faca = item com a tag sharpknife ou dullknife (com ou sem prefixo de modulo, sem diferenciar maiusculas): sao as tags que
// as receitas do jogo pedem quando exigem "uma faca"
const SHARP = 'sharpknife', DULL = 'dullknife';
const isKnife = it => hasTag(it, SHARP) || hasTag(it, DULL);
const K = D.items.filter(isKnife);
const both = K.filter(it => hasTag(it, SHARP) && hasTag(it, DULL));
if (both.length) throw new Error('facas com sharpknife e dullknife ao mesmo tempo: ' + both.map(it => it.id).join(', '));

// ---------- classe: pela tag e pela pericia da arma (Categories) ----------
// O jogo nao agrupa as facas: a tabela e mantida aqui. Uma faca que nenhuma classe reconhece, ou uma classe sem facas, faz
// o script falhar, para a tabela nao ficar para tras quando os dados mudarem.
const weaponOf = (it, skill) => it.type === 'weapon' && skills(it).includes(skill);
const CLASS_RULES = [
  ['Afiada, lâmina curta', it => hasTag(it, SHARP) && weaponOf(it, 'smallblade'), '`sharpknife`, `weapon` com `base:smallblade`', true],
  ['Cega, lâmina curta', it => hasTag(it, DULL) && weaponOf(it, 'smallblade'), '`dullknife`, `weapon` com `base:smallblade`', true],
  ['Afiada, lâmina longa', it => hasTag(it, SHARP) && weaponOf(it, 'longblade'), '`sharpknife`, `weapon` com `base:longblade`', true],
  ['Não é arma', it => it.type !== 'weapon', 'qualquer das duas tags, tipo que não é `weapon`', false],
];
const CLASSES = CLASS_RULES.map(c => c[0]);
const classOf = it => (CLASS_RULES.find(([, f]) => f(it)) || [])[0];
const unknown = K.filter(it => !classOf(it));
if (unknown.length) throw new Error('facas que nenhuma classe de CLASS_RULES reconhece: ' + unknown.map(it => it.id + ' (' + it.type + ', ' + (it.props.Categories || 'sem Categories') + ')').join(', '));
const unused = CLASSES.filter(c => !K.some(it => classOf(it) === c));
if (unused.length) throw new Error('classes de CLASS_RULES sem nenhuma faca em data/items.js: ' + unused.join(', '));
const isWeaponClass = c => CLASS_RULES.find(r => r[0] === c)[3];

// ---------- contagens ----------
const byClass = {}, bySrc = {}, byCat = {}, propCnt = {}, propVals = {}, byTag = {};
for (const it of K) {
  (byClass[classOf(it)] || (byClass[classOf(it)] = [])).push(it);
  const o = bySrc[it.mod] || (bySrc[it.mod] = { n: 0, cls: {} }); o.n++; inc(o.cls, classOf(it));
  inc(byCat, it.cat);
  for (const t of tags(it)) if (/knife/i.test(t)) inc(byTag, t);
  for (const [k, v] of Object.entries(it.props)) {
    inc(propCnt, k);
    const vs = propVals[k] || (propVals[k] = new Map()); vs.set(v, (vs.get(v) || 0) + 1);
  }
}
const srcOrder = Object.keys(bySrc).sort((a, b) => (a === 'vanilla' ? -1 : b === 'vanilla' ? 1 : bySrc[b].n - bySrc[a].n || a.localeCompare(b)));
const withPt = K.filter(it => it.pt).length, nHidden = K.filter(hidden).length;
const nOvr = K.filter(it => it.ovr.length).length;
const nSharp = K.filter(it => hasTag(it, SHARP)).length, nDull = K.length - nSharp;
const byName = (a, b) => (a.pt || a.en || a.id).localeCompare(b.pt || b.en || b.id) || a.id.localeCompare(b.id);
const weapons = K.filter(it => it.type === 'weapon');
// empate decidido pelo ID, para nao depender da ordem de data/items.js
const maxBy = (list, f) => list.reduce((m, it) => (f(it) > f(m) || (f(it) === f(m) && it.id < m.id) ? it : m));
const strongest = maxBy(weapons, it => num(it.props.MaxDamage));
// a busca tag:knife da aba Itens compara por trecho, sem o prefixo base:, e esconde os ocultos (ve items.js)
const tagSearch = D.items.filter(it => !hidden(it) && tags(it).some(t => t.replace(/^base:/i, '').toLowerCase().includes('knife')));
const tagSearchExtra = tagSearch.filter(it => !isKnife(it));
const tagSearchMissing = K.filter(it => !hidden(it) && !tagSearch.includes(it));
// fora do catalogo: armas de lamina curta sem as tags e itens com knife/faca/canivete/dagger/adaga no ID ou no nome
const NAME_WORDS = ['knife', 'faca', 'canivete', 'dagger', 'adaga', 'cleaver', 'cutelo'];
const NAME_RE = new RegExp(NAME_WORDS.join('|'), 'i');
const WHY = [['lâmina curta', it => weaponOf(it, 'smallblade')], ['nome', it => NAME_RE.test([it.id, it.en, it.pt].join(' '))]];
const why = it => WHY.filter(([, f]) => f(it)).map(w => w[0]);
const outside = D.items.filter(it => !isKnife(it) && why(it).length);
const outsideBlade = outside.filter(it => weaponOf(it, 'smallblade'));
const smallBlades = D.items.filter(it => weaponOf(it, 'smallblade')).length;

// ---------- markdown ----------
const out = [];
const p = (...l) => out.push(...l);
const RIGHT = /^(Facas|Alcance|Crítico %|Velocidade|Peso|Condição)$/;
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '| ' + head.map(h => RIGHT.test(h) || CLASSES.includes(h) ? '---:' : '---').join(' | ') + ' |'); rows.forEach(r => p('| ' + r.map(cell).join(' | ') + ' |')); p(''); };
// ancora do GitHub: mantem letras acentuadas, nao as troca pela letra sem acento
const anchor = s => s.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
const origin = it => it.mod + (it.ovr.length ? ' (alterada por ' + it.ovr.join(', ') + ')' : '');
const label = it => name(it) + (hidden(it) ? ' (oculta)' : '');
const span = (lo, hi) => lo === hi ? String(lo) : lo + '–' + hi;
const range = (list, f) => { const v = list.map(f); return span(Math.min(...v), Math.max(...v)); };
const dmg = it => span(num(it.props.MinDamage), num(it.props.MaxDamage));
const dash = v => v ? num(v) : '—';
const and = l => l.join(', ').replace(/, ([^,]*)$/, ' e $1');
const or = l => l.join(', ').replace(/, ([^,]*)$/, ' ou $1');
// as tags que dizem o que a faca faz alem de cortar (a coluna "Usos" do catalogo)
const USES = ['butcheranimal', 'killanimal', 'cutplant', 'sharpenable'];
const uses = it => USES.filter(t => hasTag(it, t)).map(t => '`' + t + '`').join(', ') || '—';

p('# Facas', '',
  '> Gerado por `node tools/knives_doc.js` a partir de `data/items.js` (extraído em ' + D.generated.slice(0, 10) + '). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.', '',
  'Uma **faca** é um item de script (`media/scripts`) com a tag `sharpknife` (afiada) ou `dullknife` (cega) em `Tags` (`base:sharpknife` e `base:dullknife` no jogo base). São essas tags que as receitas pedem quando exigem uma faca (`tags[base:sharpknife]`, `tags[base:dullknife]`), então a lista inclui o que o jogo aceita como faca mesmo sem "faca" no nome. ' + `Elas se dividem em ${and(CLASSES.map(c => '"' + c + '"'))} (veja [Por classe](#por-classe)). ` + 'Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.KitchenKnife`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.KitchenKnife")`.', '',
  `Total mapeado: **${fmt(K.length)} facas** (${fmt(nSharp)} afiadas e ${fmt(nDull)} cegas) de ${fmt(srcOrder.length)} origens (${fmt(bySrc.vanilla ? bySrc.vanilla.n : 0)} do jogo base), ${fmt(withPt)} com nome em PT-BR, ${fmt(nOvr)} ${nOvr === 1 ? 'alterada' : 'alteradas'} por outro mod e ${fmt(nHidden)} ${nHidden === 1 ? 'oculta' : 'ocultas'} por padrão na aba Itens. A de maior dano é ${name(strongest)} (\`${strongest.id}\`), com \`MaxDamage\` ${num(strongest.props.MaxDamage)}.`, '',
  `As outras ${fmt(outsideBlade.length)} armas de lâmina curta (\`base:smallblade\` sem as tags) e os itens que só têm ${or(NAME_WORDS.map(w => '"' + w + '"'))} no ID ou no nome ficam fora do catálogo (veja [Fora do catálogo](#fora-do-catálogo)).`, '',
  '## Como as facas são mapeadas', '',
  '`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):', '',
  '1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"0.9"`, `"10"`, `"TRUE"`).',
  '2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.',
  '3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.',
  '4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que for achado, como `Item_<nome>` ou `<nome>`, nos packs de textura lidos (`UI`, `UI2`, `IconsMoveables`, `RadioIcons`, `ApComUI` e os `pack=` dos mods) ou nos `.png` soltos de `media/textures`. Sem nenhum, um item com `WorldObjectSprite` usa o sprite do tile.', '',
  `Na aba Itens, a busca \`tag:knife\` traz ${tagSearchExtra.length || tagSearchMissing.length ? `${fmt(tagSearch.length)} itens` + (tagSearchExtra.length ? `: as facas e mais ${tagSearchExtra.map(it => '`' + it.id + '`').join(', ')}` : '') + (tagSearchMissing.length ? `, sem ${tagSearchMissing.map(it => '`' + it.id + '`').join(', ')}` : '') : 'exatamente as facas'} (a comparação é por trecho, sem o prefixo \`base:\` e sem diferenciar maiúsculas); \`tag:sharpknife\` e \`tag:dullknife\` separam as afiadas das cegas. O filtro "Tipo → Arma" da barra lateral não as isola: ${fmt(K.length - weapons.length)} facas não são armas, e as ${fmt(smallBlades)} armas de lâmina curta incluem ${fmt(outsideBlade.length)} que não são facas.`, '',
  '## Formato de `data/items.js`', '',
  'As facas ficam junto com os demais itens:', '',
  '```js',
  'window.PZ_ITEMS = {',
  '  generated: "' + D.generated + '",   // data da extração',
  '  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png',
  '  cats: { pt: { Weapon: "' + catLabel('Weapon') + '", ... }, en: { ... } },   // nomes de DisplayCategory',
  '  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]',
  '};',
  '```', '');
table(['Campo', 'Descrição'], [
  ['`id`', '`<Módulo>.<Nome>`, ex.: `Base.HuntingKnife`.'],
  ['`mod`', '`vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro.'],
  ['`ovr`', 'Mods que redefiniram o item depois (propriedades mescladas por cima).'],
  ['`type`', '`ItemType` (ou `Type`, se faltar) sem `base:`, em minúsculas e só com letras. Nas facas: ' + [...new Set(K.map(it => it.type))].sort().map(t => '`' + t + '`').join(' ou ') + '.'],
  ['`cat`', '`DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`).'],
  ['`pt`, `en`', 'Nomes de exibição, ou `""`.'],
  ['`icon`', '`["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`.'],
  ['`props`', 'Todas as propriedades do bloco `item`, como strings. Nas facas, as principais são `Tags` e `Weight`; nas que são armas, também `Categories`, `MinDamage`, `MaxDamage`, `MaxRange`, `CriticalChance`, `BaseSpeed` e `ConditionMax`.'],
]);

const tagNote = Object.entries(byTag).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t, n]) => '`' + t + '` ' + fmt(n)).join(', ');
p('## Por classe', '',
  'A classe não é um campo do jogo: é dada pela tag (`sharpknife` ou `dullknife`), pelo tipo do item e pela perícia da arma em `Categories`, por uma tabela mantida no script. "Afiada" e "Cega" vêm só da tag, não do dano nem do nome (ex.: `Base.SharpBone_Long`, "Osso Longo e Afiado", tem `dullknife`). O script falha se aparecer uma faca que nenhuma classe reconhece, uma classe sem facas ou um item com as duas tags. Tags com `knife` nas facas: ' + tagNote + '. "Dano" é a faixa de `MinDamage`–`MaxDamage` e "Peso" a de `Weight`.', '');
table(['Classe', 'Regra', 'Facas', 'Dano', 'Peso'], CLASS_RULES.filter(([c]) => byClass[c]).map(([c, , rule]) => {
  const l = byClass[c];
  return ['[' + c + '](#' + anchor(c) + ')', rule, fmt(l.length), isWeaponClass(c) ? span(Math.min(...l.map(it => num(it.props.MinDamage))), Math.max(...l.map(it => num(it.props.MaxDamage)))) : '—', range(l, it => num(it.props.Weight))];
}));

p('## Por origem', '');
table(['Origem', 'Facas', ...CLASSES], srcOrder.map(s => [s, fmt(bySrc[s].n), ...CLASSES.map(c => fmt(bySrc[s].cls[c] || 0))]));

p('## Por categoria', '', 'A `DisplayCategory`, que é o filtro "Categoria" da aba Itens.', '');
table(['Categoria', 'Nome', 'Facas'], Object.entries(byCat).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c, n]) => [c ? '`' + c + '`' : '(vazia)', catLabel(c), fmt(n)]));

p('## Propriedades', '', `As ${Object.keys(propCnt).length} chaves que aparecem em \`props\` das facas, da mais comum à mais rara. Na aba Itens, \`k:Chave\` filtra quem tem a chave e \`chave=valor\` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (\`+N\` = outros N valores distintos).`, '');
table(['Propriedade', 'Facas', 'Valores'], Object.entries(propCnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, n]) => {
  const vs = [...propVals[k]].sort((a, b) => b[1] - a[1]);
  const shown = vs.slice(0, 5).map(([v, c]) => (v === '' ? '(vazio)' : '`' + v + '`') + ' ' + fmt(c)).join(', ');
  return ['`' + k + '`', fmt(n), shown + (vs.length > 5 ? `, +${fmt(vs.length - 5)}` : '')];
}));

p('## Catálogo', '',
  'Todas as facas por classe; nas que são armas, do maior dano para o menor, e depois em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). As colunas mostram as propriedades cruas: dano é `MinDamage`–`MaxDamage`, alcance é `MaxRange`, crítico é `CriticalChance`, velocidade é `BaseSpeed` (a coluna só aparece na classe em que alguma faca o tem), peso é `Weight` e condição é `ConditionMax`. "Usos" lista quais destas tags a faca tem: ' + and(USES.map(t => '`' + t + '`')) + '.', '');
for (const c of CLASSES) {
  const l = byClass[c]; if (!l) continue;
  p('### ' + c, '');
  if (isWeaponClass(c)) {
    const speed = l.some(it => it.props.BaseSpeed);
    table(['Nome', 'ID', 'Origem', 'Categoria', 'Dano', 'Alcance', 'Crítico %', ...(speed ? ['Velocidade'] : []), 'Peso', 'Condição', 'Usos'], l.sort((a, b) => num(b.props.MaxDamage) - num(a.props.MaxDamage) || byName(a, b)).map(it => [
      label(it), '`' + it.id + '`', origin(it), catLabel(it.cat), dmg(it), num(it.props.MaxRange), num(it.props.CriticalChance), ...(speed ? [dash(it.props.BaseSpeed)] : []), num(it.props.Weight), it.props.ConditionMax || '—', uses(it)]));
  } else {
    table(['Nome', 'ID', 'Origem', 'Tag', 'Tipo', 'Categoria', 'Peso', 'Condição', 'Usos'], l.sort(byName).map(it => [
      label(it), '`' + it.id + '`', origin(it), '`' + (hasTag(it, SHARP) ? SHARP : DULL) + '`', '`' + it.type + '`', catLabel(it.cat), num(it.props.Weight), it.props.ConditionMax || '—', uses(it)]));
  }
}

p('## Fora do catálogo', '',
  `Itens sem \`sharpknife\` nem \`dullknife\` que são armas de lâmina curta (\`base:smallblade\` em \`Categories\`) ou que têm ${or(NAME_WORDS.map(w => '"' + w + '"'))} no ID ou no nome: ${fmt(outside.length)} itens, ${fmt(outsideBlade.length)} deles armas de lâmina curta. "Por quê" diz qual dos dois critérios o item cumpre. Uma receita pode aceitar alguns deles no mesmo slot da faca (ex.: \`tags[base:sharpknife;base:scissors]\`), mas eles não têm as tags de faca.`, '');
table(['Nome', 'ID', 'Origem', 'Tipo', 'Categoria', 'Por quê'], outside.sort((a, b) => weaponOf(b, 'smallblade') - weaponOf(a, 'smallblade') || byName(a, b)).map(it => [
  label(it), '`' + it.id + '`', origin(it), '`' + it.type + '`', catLabel(it.cat), why(it).join(', ')]));

const file = path.join(ROOT, 'docs/knives.md');
fs.writeFileSync(file, out.join('\n'));
console.log(file, (fs.statSync(file).size / 1e3).toFixed(0) + 'KB');
