// Gera docs/tiles.md a partir de data/tiles.js: formato dos dados, contagens por origem, funcao,
// material e propriedade, e o catalogo de todos os tilesets. Uso: node tools/tiles_doc.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {}; require(path.join(ROOT, 'data/tiles.js'));
const D = window.PZ_TILES, TS = D.tilesets;

// as funcoes e materiais sao os mesmos filtros da aba Tiles: le as regras direto da index.html
// (o FN termina no primeiro '\n  ];' depois de 'const FN = [')
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const grab = re => { const m = html.match(re); if (!m) throw new Error('nao achei ' + re + ' na index.html'); return m[0]; };
const { FN, MAT } = new Function(grab(/const FN = \[[\s\S]*?\n  \];/) + grab(/const MATS = .*;/) + grab(/const MAT = .*;/) + 'return { FN, MAT };')();

const fmt = n => n.toLocaleString('pt-BR');
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const inc = (o, k, n = 1) => o[k] = (o[k] || 0) + n;

// ---------- contagens ----------
const bySrc = {};
for (const t of TS) (bySrc[t.source] || (bySrc[t.source] = { ts: 0, n: 0, img: 0 })).ts++;
const per = TS.map(() => ({ n: 0, img: 0, pt: 0, named: 0, names: [] }));
const fnCnt = {}, matCnt = {}, propCnt = {}, propVals = {};
for (const [, ts, , pg, , props, pt, en] of D.tiles) {
  const t = per[ts]; t.n++; if (pg >= 0) t.img++;
  if (pt) t.pt++;
  const nm = pt || en; if (nm) { t.named++; if (t.names.length < 4 && !t.names.includes(nm)) t.names.push(nm); }
  const s = bySrc[TS[ts].source]; s.n++; if (pg >= 0) s.img++;
  FN.forEach(([label, f]) => { if (f(props)) inc(fnCnt, label); });
  MAT.forEach(([label, f]) => { if (f(props)) inc(matCnt, label); });
  for (const [k, v] of Object.entries(props)) {
    inc(propCnt, k);
    const vs = propVals[k] || (propVals[k] = new Map()); vs.set(v, (vs.get(v) || 0) + 1);
  }
}
const srcOrder = Object.keys(bySrc).sort((a, b) => (a === 'vanilla' ? -1 : b === 'vanilla' ? 1 : a === 'pack' ? 1 : b === 'pack' ? -1 : bySrc[b].n - bySrc[a].n));
const sum = f => per.reduce((a, t) => a + t[f], 0);
const total = D.tiles.length, withImg = sum('img'), withPt = sum('pt'), named = sum('named');

// ---------- markdown ----------
const out = [];
const p = (...l) => out.push(...l);
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '| ' + head.map(h => /^(Tiles|Com imagem|PT-BR|Com nome|Grade|Tilesets)$/.test(h) ? '---:' : '---').join(' | ') + ' |'); rows.forEach(r => p('| ' + r.map(cell).join(' | ') + ' |')); p(''); };
const anchor = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_ -]/g, '').replace(/ /g, '-');

p('# Tiles', '',
  '> Gerado por `node tools/tiles_doc.js` a partir de `data/tiles.js` (extraído em ' + D.generated.slice(0, 10) + '). Não edite à mão: rode `node build.js` e depois o script para atualizar.', '',
  'Um **tile** é um sprite do mapa do Project Zomboid (piso, parede, móvel, árvore...). Cada tile pertence a um **tileset** (uma folha de sprites, ex.: `appliances_com_01`) e é identificado por `<tileset>_<índice>`, ex.: `appliances_com_01_0`. É esse nome que o jogo e os mapas usam.', '',
  `Total mapeado: **${fmt(total)} tiles** em **${fmt(TS.length)} tilesets**, ${fmt(withImg)} com imagem, ${fmt(withPt)} com nome em PT-BR e ${fmt(named)} com algum nome de exibição, distribuídos em ${fmt(D.pages.length)} páginas de atlas.`, '',
  '## Como os tiles são mapeados', '',
  '`build.js` cruza três fontes. Os mods (com `pack=`/`tiledef=` no `mod.info`) contribuem só com as duas primeiras; as traduções vêm apenas do jogo base:', '',
  '1. **Texture packs** (`media/texturepacks/*.pack`, formato `PZPK`): páginas PNG com a posição de cada sprite. Vanilla: `Tiles2x.pack` e `Tiles2x.floor.pack`. As páginas viram `atlas/*.png`.',
  '2. **Definições de tiles** (`media/*.tiles`, formato `tdef`): lista os tilesets (nome, imagem, colunas × linhas) e as propriedades de cada tile. Vanilla: `newtiledefinitions`, `tiledefinitions_erosion`, `tiledefinitions_overlays` e `tiledefinitions_b42chunkcaching`. Se o mesmo tile aparece em mais de um arquivo, as propriedades são mescladas.',
  '3. **Traduções** (`Translate/PTBR` e `EN/Moveables.json`): o nome exibido vem de `GroupName` + `CustomName` do tile, normalizado como chave (espaços e hífens viram `_`, apóstrofos e pontos somem). Só o `Moveables.json` do jogo base é lido: um tile de mod só ganha nome traduzido quando seu `GroupName` + `CustomName` coincide com uma chave do vanilla.', '',
  'Regras de inclusão:', '',
  '- Um sprite `<nome>_<n>` que só existe no pack (sem `.tiles`) também vira tile: entra no tileset `<nome>` se ele já existe ou, se não, num tileset novo de origem `pack` sem grade definida. Sprites sem o sufixo `_<n>` são ignorados.',
  '- Um slot da folha sem imagem e sem propriedades é descartado.',
  '- O vanilla é lido antes dos mods. Na imagem, a primeira ocorrência de um sprite vence. No `.tiles`, um tileset repetido mantém a origem de quem o definiu primeiro, mas as propriedades de cada tile são mescladas e a leitura posterior sobrescreve as chaves iguais.', '',
  '## Formato de `data/tiles.js`', '',
  '```js',
  'window.PZ_TILES = {',
  '  generated: "' + D.generated + '",   // data da extração',
  '  pages: ["Tiles2x3", ...],                 // páginas de atlas: atlas/<page>.png',
  '  tilesets: [{ name, image, cols, rows, source }, ...],',
  '  tiles: [[name, ts, idx, pg, rect, props, pt, en], ...]',
  '};',
  '```', '',
  'Campos de cada tile (ordenados por tileset e índice):', '');
table(['Pos.', 'Campo', 'Descrição'], [
  ['0', '`name`', 'Nome do tile, `<tileset>_<idx>`.'],
  ['1', '`ts`', 'Índice em `tilesets`.'],
  ['2', '`idx`', 'Posição na folha do tileset (linha × `cols` + coluna).'],
  ['3', '`pg`', 'Índice em `pages`, ou `-1` se o tile não tem imagem.'],
  ['4', '`rect`', '`[x, y, w, h, ox, oy, fw, fh]`: recorte na página, deslocamento do recorte dentro do quadro e tamanho do quadro (sprites 2x, normalmente 128 × 256). `null` sem imagem.'],
  ['5', '`props`', 'Propriedades do `.tiles`, `{ chave: valor }`; flags têm valor `""`.'],
  ['6', '`pt`', 'Nome em PT-BR do `Moveables.json`, ou `""`.'],
  ['7', '`en`', 'Nome em inglês; sem tradução, cai em `GroupName CustomName`, ou `""`.'],
]);
p('`source` do tileset é `vanilla`, o `name=` do `mod.info` do mod, ou `pack` (sprite sem definição).', '');

const empty = TS.filter((t, i) => !per[i].n).map(t => '`' + t.name + '`');
p('## Por origem', '');
if (empty.length) p(`Tilesets definidos sem nenhum tile (só slots vazios) entram na contagem: ${empty.join(', ')}.`, '');
table(['Origem', 'Tilesets', 'Tiles', 'Com imagem'], srcOrder.map(s => ['[' + s + '](#' + anchor('Tilesets: ' + s) + ')', fmt(bySrc[s].ts), fmt(bySrc[s].n), fmt(bySrc[s].img)]));

p('## Por função', '', 'As funções são os filtros da barra lateral da aba Tiles, derivados das propriedades (regras em `index.html`). Um tile pode ter várias.', '');
table(['Função', 'Tiles'], FN.map(([l]) => [l, fmt(fnCnt[l] || 0)]));

p('## Por material', '', 'Os mesmos filtros da aba Tiles: o material está em `Material`, `Material2` ou `Material3`.', '');
table(['Material', 'Tiles'], MAT.map(([l]) => [l, fmt(matCnt[l] || 0)]));

p('## Propriedades', '', `As ${Object.keys(propCnt).length} chaves que aparecem em \`props\`, da mais comum à mais rara. Na busca, \`k:Chave\` filtra quem tem a chave e \`chave=valor\` filtra quem tem a chave com um valor que contém o trecho (sem diferenciar maiúsculas). "Valores" mostra até 5 dos mais comuns (\`(flag)\` = sem valor; \`+N\` = outros N valores distintos).`, '');
table(['Propriedade', 'Tiles', 'Valores'], Object.entries(propCnt).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, n]) => {
  const vs = [...propVals[k]].sort((a, b) => b[1] - a[1]);
  const shown = vs.slice(0, 5).map(([v, c]) => (v === '' ? '(flag)' : '`' + v + '`') + ' ' + fmt(c)).join(', ');
  return ['`' + k + '`', fmt(n), shown + (vs.length > 5 ? `, +${fmt(vs.length - 5)}` : '')];
}));

p('## Tilesets', '', 'Todos os tilesets, por origem e em ordem alfabética. "Grade" é colunas × linhas da folha; "PT-BR" conta os tiles com nome em PT-BR, "Com nome" os que têm algum nome de exibição (PT-BR, EN ou o `GroupName CustomName` cru); "Exemplos" são os primeiros desses nomes.', '');
for (const s of srcOrder) {
  p('### Tilesets: ' + s, '');
  const list = TS.map((t, i) => [t, i]).filter(([t]) => t.source === s).sort((a, b) => a[0].name.localeCompare(b[0].name));
  table(['Tileset', 'Grade', 'Tiles', 'Com imagem', 'PT-BR', 'Com nome', 'Exemplos'], list.map(([t, i]) => [
    '`' + t.name + '`', t.cols ? t.cols + '×' + t.rows : '—', fmt(per[i].n), fmt(per[i].img), fmt(per[i].pt), fmt(per[i].named), per[i].names.join('; ') || '—']));
}

const file = path.join(ROOT, 'docs/tiles.md');
fs.writeFileSync(file, out.join('\n'));
console.log(file, (fs.statSync(file).size / 1e3).toFixed(0) + 'KB');
