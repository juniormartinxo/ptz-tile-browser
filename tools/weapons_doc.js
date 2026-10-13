// Gera docs/weapons.md a partir de data/items.js: o que conta como arma, formato dos dados, contagens
// por classe, origem, categoria e municao, e o catalogo de todas as armas. Uso: node tools/weapons_doc.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {}; require(path.join(ROOT, 'data/items.js'));
const D = window.PZ_ITEMS;
const W = D.items.filter(it => it.type === 'weapon');

const fmt = n => n.toLocaleString('pt-BR');
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const inc = (o, k, n = 1) => o[k] = (o[k] || 0) + n;
const num = v => parseFloat(v) || 0;
const yes = v => /^true$/i.test(v || '');
const unbase = s => s.replace(/^base:/i, '');
const catLabel = c => c ? (D.cats.pt[c] || D.cats.en[c] || c) : '(sem categoria)';
const name = it => it.pt || (it.en ? '_' + it.en + '_' : '`' + it.id.replace(/^[^.]*\./, '') + '`');
// mesmas regras da aba Itens (items.js): categorias internas e OBSOLETE ficam ocultas por padrao
const INTERNAL_CATS = new Set(['Hidden', 'Wound', 'ZedDmg', 'MaleBody', 'Corpse', 'Appearance']);
const hidden = it => INTERNAL_CATS.has(it.cat) || yes(it.props.OBSOLETE);

// ---------- classe: arma de fogo, explosivo ou corpo a corpo pela categoria de pericia ----------
const SKILLS = [['axe', 'Machado'], ['longblade', 'Lâmina longa'], ['smallblade', 'Lâmina curta'], ['blunt', 'Contundente longa'], ['smallblunt', 'Contundente curta'], ['spear', 'Lança'], ['unarmed', 'Desarmado']];
const skills = it => (it.props.Categories || '').split(';').map(s => unbase(s.trim()).toLowerCase()).filter(Boolean);
function classOf(it) {
  if (it.props.SubCategory === 'Firearm') return 'Arma de fogo';
  if (it.cat === 'Explosives') return 'Explosivo';
  const s = SKILLS.find(([k]) => skills(it).includes(k));
  return s ? s[1] : 'Corpo a corpo sem perícia';
}
const CLASSES = ['Arma de fogo', 'Explosivo', ...SKILLS.map(s => s[1]), 'Corpo a corpo sem perícia'];
const improvised = it => skills(it).includes('improvised');

// ---------- contagens ----------
const byClass = {}, bySrc = {}, byCat = {}, ovrBy = {}, propCnt = {}, propVals = {}, ammo = {};
for (const it of W) {
  (byClass[classOf(it)] || (byClass[classOf(it)] = [])).push(it);
  const s = bySrc[it.mod] || (bySrc[it.mod] = { n: 0, fire: 0, expl: 0 }); s.n++;
  if (classOf(it) === 'Arma de fogo') s.fire++; else if (classOf(it) === 'Explosivo') s.expl++;
  inc(byCat, it.cat);
  for (const m of it.ovr) inc(ovrBy, m);
  for (const [k, v] of Object.entries(it.props)) {
    inc(propCnt, k);
    const vs = propVals[k] || (propVals[k] = new Map()); vs.set(v, (vs.get(v) || 0) + 1);
  }
  if (it.props.AmmoType) {
    const a = ammo[it.props.AmmoType] || (ammo[it.props.AmmoType] = { n: 0, boxes: new Set(), names: [] });
    a.n++; if (it.props.AmmoBox) a.boxes.add(it.props.AmmoBox); if (a.names.length < 4) a.names.push(name(it));
  }
}
const srcOrder = Object.keys(bySrc).sort((a, b) => (a === 'vanilla' ? -1 : b === 'vanilla' ? 1 : bySrc[b].n - bySrc[a].n || a.localeCompare(b)));
const withPt = W.filter(it => it.pt).length, nHidden = W.filter(hidden).length;
const nOvr = W.filter(it => it.ovr.length).length, nOvrBase = W.filter(it => it.mod === 'vanilla' && it.ovr.length).length;
const byName = (a, b) => (a.pt || a.en || a.id).localeCompare(b.pt || b.en || b.id) || a.id.localeCompare(b.id);

// ---------- markdown ----------
const out = [];
const p = (...l) => out.push(...l);
const RIGHT = /^(Armas|Improvisadas|Fogo|Explosivos|Peso|Dano|Alcance|Crítico %|Velocidade|Condição|Pente)$/;
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '| ' + head.map(h => RIGHT.test(h) ? '---:' : '---').join(' | ') + ' |'); rows.forEach(r => p('| ' + r.map(cell).join(' | ') + ' |')); p(''); };
// ancora do GitHub: mantem letras acentuadas (L\u00e2mina longa -> #l\u00e2mina-longa)
const anchor = s => s.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');
const dmg = it => num(it.props.MinDamage) + '–' + num(it.props.MaxDamage);
const origin = it => it.mod + (it.ovr.length ? ' (alterada por ' + it.ovr.join(', ') + ')' : '');
const nm = it => name(it) + (hidden(it) ? ' (oculta)' : '');

p('# Armas', '',
  '> Gerado por `node tools/weapons_doc.js` a partir de `data/items.js` (extraído em ' + D.generated.slice(0, 10) + '). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.', '',
  'Uma **arma** é um item de script (`media/scripts`) com `ItemType = base:weapon`. Na aba Itens ela aparece com o tipo "Arma" (`type:arma` na busca). Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.Axe`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.Axe")`.', '',
  `Total mapeado: **${fmt(W.length)} armas** de ${fmt(srcOrder.length)} origens (${fmt(bySrc.vanilla ? bySrc.vanilla.n : 0)} do jogo base), ${fmt(withPt)} com nome em PT-BR, ${fmt(nOvr)} alteradas por outro mod (${fmt(nOvrBase)} delas do jogo base) e ${fmt(nHidden)} ${nHidden === 1 ? 'oculta' : 'ocultas'} por padrão na aba Itens.`, '',
  'Peças de arma (`ItemType = base:weaponpart`: miras, pentes, coronhas) e munição (`DisplayCategory = Ammo`) são outros tipos de item e ficam fora deste catálogo.', '',
  '## Como as armas são mapeadas', '',
  '`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (a pasta `42.x` mais próxima de `GAME_VER` e `common/`):', '',
  '1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"2.0"`, `"true"`, `"TRUE"`).',
  '2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.',
  '3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.',
  '4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que existir nos packs de UI ou nos `Item_*.png` soltos.', '',
  '## Formato de `data/items.js`', '',
  'As armas ficam junto com os demais itens:', '',
  '```js',
  'window.PZ_ITEMS = {',
  '  generated: "' + D.generated + '",   // data da extração',
  '  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png',
  '  cats: { pt: { Weapon: "Arma", ... }, en: { ... } },   // nomes de DisplayCategory',
  '  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]',
  '};',
  '```', '');
table(['Campo', 'Descrição'], [
  ['`id`', '`<Módulo>.<Nome>`, ex.: `Base.Pistol`.'],
  ['`mod`', '`vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro.'],
  ['`ovr`', 'Mods que redefiniram o item depois (propriedades mescladas por cima).'],
  ['`type`', '`ItemType` sem `base:`, em minúsculas: `weapon` para todas as armas.'],
  ['`cat`', '`DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`).'],
  ['`pt`, `en`', 'Nomes de exibição, ou `""`.'],
  ['`icon`', '`["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`.'],
  ['`props`', 'Todas as propriedades do bloco `item`, como strings.'],
]);

p('## Por classe', '',
  'A classe não é um campo do jogo: é derivada das propriedades, nesta ordem. **Arma de fogo**: `SubCategory = Firearm` (todas têm também `Ranged` e `IsAimedFirearm`). **Explosivo**: `DisplayCategory = Explosives` (bombas, armadilhas e molotov; todos podem ser arremessados, e as variantes colocáveis disparam por temporizador, controle remoto ou sensor). As demais são **corpo a corpo**, classificadas pela perícia em `Categories` (`base:axe`, `base:longblade`...), que define qual habilidade sobe e o bônus aplicado; `base:improvised` só marca a arma como improvisada e não conta como perícia.', '');
table(['Classe', 'Armas', 'Improvisadas'], CLASSES.filter(c => byClass[c]).map(c => ['[' + c + '](#' + anchor(c) + ')', fmt(byClass[c].length), fmt(byClass[c].filter(improvised).length)]));

p('## Por origem', '');
table(['Origem', 'Armas', 'Fogo', 'Explosivos'], srcOrder.map(s => [s, fmt(bySrc[s].n), fmt(bySrc[s].fire), fmt(bySrc[s].expl)]));
if (nOvr) {
  p('Mods que alteram armas de outra origem (uma arma pode ser alterada por vários):', '');
  table(['Mod', 'Armas'], Object.entries(ovrBy).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([m, n]) => [m, fmt(n)]));
}

p('## Por categoria', '', 'A `DisplayCategory`, que é o filtro "Categoria" da aba Itens. Muitas armas corpo a corpo são ferramentas ou objetos comuns (`ToolWeapon`, `CookingWeapon`...).', '');
table(['Categoria', 'Nome', 'Armas'], Object.entries(byCat).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([c, n]) => [c ? '`' + c + '`' : '(vazia)', catLabel(c), fmt(n)]));

p('## Munição', '', 'Os `AmmoType` das armas de fogo. "Caixa" é o `AmmoBox`, o item que o jogo usa como caixa de munição daquela arma. Na aba Itens, `ammotype=9mm` filtra as armas por munição.', '');
table(['AmmoType', 'Armas', 'Caixa', 'Exemplos'], Object.entries(ammo).sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0])).map(([t, a]) => ['`' + t + '`', fmt(a.n), [...a.boxes].map(b => '`' + b + '`').join(', ') || '—', a.names.join('; ')]));

p('## Propriedades', '',
  'O significado das propriedades mais usadas nas armas (a lista completa vem depois):', '');
table(['Propriedade', 'Significado'], [
  ['`MinDamage`, `MaxDamage`', 'Dano por golpe ou disparo; o valor sorteado fica entre os dois.'],
  ['`MinRange`, `MaxRange`', 'Alcance em tiles. Para explosivos, `MaxRange` é a distância de arremesso.'],
  ['`CriticalChance`, `CritDmgMultiplier`', 'Chance de crítico (%) e multiplicador do dano crítico.'],
  ['`BaseSpeed`, `Swingtime`, `MinimumSwingtime`', 'Velocidade do golpe (maior `BaseSpeed` = mais rápido) e duração da animação.'],
  ['`MaxHitcount`', 'Quantos alvos um golpe ou disparo atinge.'],
  ['`ConditionMax`, `ConditionLowerChanceOneIn`', 'Durabilidade máxima e chance (1 em N) de perder condição a cada golpe.'],
  ['`KnockdownMod`, `PushBackMod`', 'Chance de derrubar e força do empurrão.'],
  ['`TwoHandWeapon`, `RequiresEquippedBothHands`', 'Se rende melhor com duas mãos / se exige as duas mãos.'],
  ['`DoorDamage`, `TreeDamage`', 'Dano em portas e árvores.'],
  ['`AmmoType`, `MaxAmmo`, `MagazineType`', 'Munição, capacidade e pente (armas de fogo).'],
  ['`HitChance`, `AimingPerkHitChanceModifier`', 'Precisão base e quanto ela cresce por nível de Pontaria.'],
  ['`SoundRadius`, `JamGunChance`', 'Raio em que o disparo atrai zumbis e chance de travar.'],
  ['`ExplosionPower`/`ExplosionRange`, `FireRange`, `SmokeRange`, `NoiseRange`', 'Efeito e raio dos explosivos.'],
]);
p(`As ${Object.keys(propCnt).length} chaves que aparecem em \`props\` das armas, da mais comum à mais rara. Na aba Itens, \`k:Chave\` filtra quem tem a chave e \`chave=valor\` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (\`+N\` = outros N valores distintos).`, '');
table(['Propriedade', 'Armas', 'Valores'], Object.entries(propCnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, n]) => {
  const vs = [...propVals[k]].sort((a, b) => b[1] - a[1]);
  const shown = vs.slice(0, 5).map(([v, c]) => (v === '' ? '(vazio)' : '`' + v + '`') + ' ' + fmt(c)).join(', ');
  return ['`' + k + '`', fmt(n), shown + (vs.length > 5 ? `, +${fmt(vs.length - 5)}` : '')];
}));

p('## Catálogo', '',
  'Todas as armas por classe, em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). Dano é `MinDamage`–`MaxDamage`, alcance é `MaxRange`, velocidade é `BaseSpeed`, peso é `Weight` e condição é `ConditionMax`. "Mãos" é `1`, `2` (`TwoHandWeapon`: perde dano se usada com uma mão) ou `exige 2` (`RequiresEquippedBothHands`).', '');
const hands = it => yes(it.props.RequiresEquippedBothHands) ? 'exige 2' : yes(it.props.TwoHandWeapon) ? '2' : '1';
const effect = it => {
  const q = it.props, e = [];
  if (num(q.ExplosionPower)) e.push('explosão ' + num(q.ExplosionPower) + ' (raio ' + num(q.ExplosionRange) + ')');
  if (num(q.FireRange)) e.push('fogo (raio ' + num(q.FireRange) + ')');
  if (num(q.SmokeRange)) e.push('fumaça (raio ' + num(q.SmokeRange) + ')');
  if (num(q.NoiseRange)) e.push('ruído (raio ' + num(q.NoiseRange) + (num(q.NoiseDuration) ? ', ' + num(q.NoiseDuration) + ' s' : '') + ')');
  return e.join('; ') || '—';
};
const use = it => [it.props.SwingAnim === 'Throw' && 'arremesso', yes(it.props.CanBePlaced) && 'colocável', it.props.ExplosionTimer && 'temporizador', yes(it.props.CanBeRemote) && 'remoto', it.props.SensorRange && 'sensor ' + num(it.props.SensorRange)].filter(Boolean).join(', ') || '—';
for (const c of CLASSES) {
  const list = byClass[c]; if (!list) continue;
  p('### ' + c, '');
  if (c === 'Arma de fogo') {
    table(['Nome', 'ID', 'Origem', 'Munição', 'Pente', 'Dano', 'Alcance', 'Crítico %', 'Peso', 'Condição'], list.sort((a, b) => (a.props.AmmoType || '').localeCompare(b.props.AmmoType || '') || byName(a, b)).map(it => [
      nm(it), '`' + it.id + '`', origin(it), '`' + it.props.AmmoType + '`', it.props.MaxAmmo || '—', dmg(it), num(it.props.MaxRange), num(it.props.CriticalChance), num(it.props.Weight), it.props.ConditionMax || '—']));
  } else if (c === 'Explosivo') {
    table(['Nome', 'ID', 'Origem', 'Efeito', 'Uso', 'Alcance', 'Peso'], list.sort(byName).map(it => [
      nm(it), '`' + it.id + '`', origin(it), effect(it), use(it), num(it.props.MaxRange), num(it.props.Weight)]));
  } else {
    table(['Nome', 'ID', 'Origem', 'Dano', 'Alcance', 'Crítico %', 'Velocidade', 'Peso', 'Condição', 'Mãos', 'Improvisada'], list.sort(byName).map(it => [
      nm(it), '`' + it.id + '`', origin(it), dmg(it), num(it.props.MaxRange), num(it.props.CriticalChance), it.props.BaseSpeed ? num(it.props.BaseSpeed) : '—', num(it.props.Weight), it.props.ConditionMax || '—', hands(it), improvised(it) ? 'sim' : '']));
  }
}

const file = path.join(ROOT, 'docs/weapons.md');
fs.writeFileSync(file, out.join('\n'));
console.log(file, (fs.statSync(file).size / 1e3).toFixed(0) + 'KB');
