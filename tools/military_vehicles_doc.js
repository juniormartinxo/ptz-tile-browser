// Gera docs/military_vehicles.md a partir de data/vehicles.js: o que conta como veiculo militar, formato dos
// dados, contagens por classe e origem, pinturas e o catalogo. Uso: node tools/military_vehicles_doc.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = {}; require(path.join(ROOT, 'data/vehicles.js'));
const D = window.PZ_VEHICLES;
const byId = new Map(D.vehicles.map(v => [v.id, v]));

// ---------- o que conta como militar ----------
// O jogo nao marca veiculo militar: a lista e mantida aqui, por ID, com a classe e o papel de cada um.
const BLIND = 'Blindado', UTIL = 'Utilitário', TRUCK = 'Caminhão', TRAILER = 'Reboque';
const CLASSES = [BLIND, UTIL, TRUCK, TRAILER];
const MILITARY = [
  ['Base.M60A3', BLIND, 'tanque'],
  ['Base.M60A3Burnt', BLIND, 'tanque'],
  ['Base.BMP-2', BLIND, 'veículo de combate de infantaria'],
  ['Base.BMP-2Burnt', BLIND, 'veículo de combate de infantaria'],
  ['Base.lockMartM577', BLIND, 'transporte de tropas (APC de _Aliens_)'],
  ['Base.cobbM540', BLIND, 'blindado de _Aliens_'],
  ['Base.92amgeneralM998', UTIL, 'HMMWV'],
  ['Base.92amgeneralM998Burnt', UTIL, 'HMMWV'],
  ['Base.M998_Humvee', UTIL, 'HMMWV'],
  ['Base.89defenderWolf', UTIL, 'Land Rover militar'],
  ['Base.78amgeneralM35A2', TRUCK, 'carga'],
  ['Base.78amgeneralM49A2C', TRUCK, 'tanque de combustível'],
  ['Base.78amgeneralM50A3', TRUCK, 'tanque de água'],
  ['Base.78amgeneralM62', TRUCK, 'guincho'],
  ['Base.86oshkoshUSMC', TRUCK, 'contra incêndio'],
  ['Base.86oshkoshFRTR55', TRUCK, 'contra incêndio'],
  ['Base.86oshkoshP19ABurnt', TRUCK, 'contra incêndio'],
  ['Base.TrailerM1082', TRAILER, 'carga'],
  ['Base.TrailerM1095', TRAILER, 'carga'],
  ['Base.TrailerM101A3cargo', TRAILER, 'carga'],
];
// Veiculos com cara de militar (pintura ou mod) que ficam de fora, e por que.
const EXCLUDED = [
  [['Base.86oshkoshKYFD'], 'Mesmo Oshkosh P19A, mas com pinturas de bombeiros civis (KYFD: vermelha e amarela), nenhuma militar.'],
  [['Base.PickUpTruck_Camo', 'Base.PickUpVan_Camo'], 'Jogo base: picapes civis (`base` `PickUpTruck`/`PickUpVan`) com pintura camuflada.'],
  [['Base.89defender90', 'Base.89defender90utility', 'Base.89defender110', 'Base.89defender110utility', 'Base.89defender130', 'Base.Trailer89defender'], 'Versões civis do Land Rover Defender e o reboque dele, do mesmo mod do Wolf.'],
  [D.vehicles.filter(v => v.mod === 'Containers!').map(v => v.id), 'Mod Containers!: contêineres ISO e reboques de contêiner; `army` e `camo` são só opções de pintura.'],
];
// Pista de militar: pintura militar ou mod com "military" no nome. Quem tiver a pista e nao estiver em
// nenhuma das listas faz o script falhar, para a lista nao ficar para tras quando os dados mudarem.
const MIL_SKIN = /usmc|nato|army|camo|desert|milit/i;
const looksMilitary = v => v.skins.some(s => MIL_SKIN.test(s)) || /milit/i.test(v.mod);

const listed = new Set([...MILITARY.map(m => m[0]), ...EXCLUDED.flatMap(e => e[0])]);
const missing = [...listed].filter(id => !byId.has(id));
if (missing.length) throw new Error('IDs listados que nao existem em data/vehicles.js: ' + missing.join(', '));
const unlisted = D.vehicles.filter(v => looksMilitary(v) && !listed.has(v.id)).map(v => v.id);
if (unlisted.length) throw new Error('veiculos com pista de militar fora de MILITARY e EXCLUDED: ' + unlisted.join(', '));

const M = MILITARY.map(([id, cls, role]) => Object.assign({}, byId.get(id), { cls, role }));

const fmt = n => n.toLocaleString('pt-BR');
const cell = s => String(s).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const inc = (o, k, n = 1) => o[k] = (o[k] || 0) + n;
const name = v => v.pt || (v.en ? '_' + v.en + '_' : '`' + v.name + '`');
const label = v => name(v) + (v.wreck ? ' (destroço)' : '');
const dash = n => n ? fmt(n) : '—';
// nome da pintura: o que vem depois de _Shell_ (ou do prefixo do veiculo) no nome da textura
const paint = s => { const b = s.replace(/^.*\//, ''); const m = /_Shell_(.+)$/.exec(b); return m ? m[1] : /_Shell$/.test(b) ? 'padrão' : b.replace(/^[^_]*_/, ''); };
const paints = v => { const c = new Map(); for (const s of v.skins) { const p = paint(s); c.set(p, (c.get(p) || 0) + 1); } return [...c].map(([p, n]) => '`' + p + '`' + (n > 1 ? ' ×' + n : '')).join(', '); };
const others = v => v.containers.filter(c => !/^(GasTank|Tire.*)$/.test(c.part)).map(c => '`' + c.part + '` ' + fmt(c.cap)).join(', ') || '—';

// ---------- contagens ----------
const byClass = {}, bySrc = {}, byPaint = {};
for (const v of M) {
  (byClass[v.cls] || (byClass[v.cls] = [])).push(v);
  const s = bySrc[v.mod] || (bySrc[v.mod] = { n: 0, wreck: 0 }); s.n++; if (v.wreck) s.wreck++;
  for (const p of new Set(v.skins.map(s => paint(s).toLowerCase()))) inc(byPaint, p);
}
const srcOrder = Object.keys(bySrc).sort((a, b) => bySrc[b].n - bySrc[a].n || a.localeCompare(b));
const nWreck = M.filter(v => v.wreck).length, withPt = M.filter(v => v.pt).length;
const manySkins = M.filter(v => v.skins.length > v.thumbs.length);

// ---------- markdown ----------
const out = [];
const p = (...l) => out.push(...l);
const RIGHT = /^(Veículos|Destroços|Assentos|Porta-malas|Tanque|Vel\. máx\.|Motor|Massa|Proteção)$/;
const table = (head, rows) => { p('| ' + head.join(' | ') + ' |', '| ' + head.map(h => RIGHT.test(h) ? '---:' : '---').join(' | ') + ' |'); rows.forEach(r => p('| ' + r.map(cell).join(' | ') + ' |')); p(''); };
// ancora do GitHub: mantem letras acentuadas, nao as troca pela letra sem acento
const anchor = s => s.toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-');

p('# Veículos militares', '',
  '> Gerado por `node tools/military_vehicles_doc.js` a partir de `data/vehicles.js` (extraído em ' + D.generated.slice(0, 10) + '). Não edite à mão: rode `node build_vehicles.js` e depois o script para atualizar.', '',
  'O jogo não marca um veículo como militar: nenhum script de veículo tem um campo para isso. Nenhum veículo do jogo base entra na lista: todos vêm de mods. A lista deste catálogo é mantida à mão em `tools/military_vehicles_doc.js` (`MILITARY`), por ID, com a classe e o papel de cada veículo. Cada um é identificado por `<Módulo>.<Nome>`, ex.: `Base.M60A3`; é esse ID que o jogo usa, ex.: `addVehicle("Base.M60A3", getPlayer():getX()+3, getPlayer():getY(), getPlayer():getZ())`, o comando que o botão "Copiar spawn (console)" da aba Veículos copia.', '',
  `Total: **${M.length} veículos militares** de ${srcOrder.length} mods, ${nWreck} deles destroços (queimados), ${withPt} com nome em PT-BR.`, '',
  'Para a lista não ficar desatualizada, o script falha quando acha em `data/vehicles.js` um veículo com pista de militar (uma skin com `USMC`, `NATO`, `army`, `camo`, `desert` ou `milit` no nome, ou um mod com "military" no nome) que não está nem na lista nem nas [exclusões](#fora-do-catálogo). Também falha se um ID das duas listas sumir dos dados.', '');

p('## Como os veículos são mapeados', '',
  '`build_vehicles.js` lê os blocos `vehicle`, `template vehicle` e `model` de todo `media/scripts/**/*.txt` que os tenha, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):', '',
  '1. **Herança**: as propriedades e as `part` vêm do veículo e da cadeia de `template!`, além das `part` incluídas por `template = X` ou `template = X/part/Y`.',
  '2. **Mods**: a origem (`mod`) é o `name=` do `mod.info` do mod que declara o veículo. Se dois mods declaram o mesmo ID, vale o último lido; não há registro de quem foi sobrescrito.',
  '3. **Nomes**: `pt` e `en` vêm de `IGUI_VehicleName<Nome>` em `IG_UI` (`Translate/PTBR` e `Translate/EN`), do jogo base e dos mods.',
  '4. **Compartimentos**: as `part` com bloco `container` (ou com `TruckBed`, `Trunk`, `GloveBox` ou `Seat` no nome) e a capacidade de cada uma. `trunk` soma as que têm `TruckBed`, `Trunk` ou `Cargo` no nome; `gas` é a do `GasTank`. Por isso os blindados com esteira mostram porta-malas 0: a carga deles fica em compartimentos com outros nomes (`AmmoStor`, `TankRoof`...).',
  '5. **Skins**: os blocos `skin` do veículo (ou do primeiro template que os tenha). Só as 6 primeiras viram miniatura em `vehicles/` e aparecem no painel da aba Veículos.',
  '6. **Destroço**: `wreck` é `true` quando o nome tem `Burnt`, `Smashed` ou `Wreck`, ou o script tem `neverSpawnKey = true`. A aba Veículos esconde os destroços até marcar "destruídos".', '');

p('## Formato de `data/vehicles.js`', '',
  'Os veículos militares ficam junto com os demais:', '',
  '```js',
  'window.PZ_VEHICLES = {',
  '  generated: "' + D.generated + '",   // data da extração',
  '  vehicles: [{ id, name, mod, base, pt, en, mech, seats, trunk, gas, containers, skins, thumbs, wreck, m3d, stats }, ...]',
  '};',
  '```', '');
table(['Campo', 'Descrição'], [
  ['`id`', '`<Módulo>.<Nome>`, ex.: `Base.M60A3`.'],
  ['`name`', 'Nome do bloco `vehicle` no script.'],
  ['`mod`', '`vanilla` ou o `name=` do `mod.info` do mod.'],
  ['`base`', 'O `template!` do veículo, ou `""`.'],
  ['`pt`, `en`', 'Nomes de exibição, ou `""`.'],
  ['`mech`', '`mechanicType` (1 se faltar). A aba Veículos usa para o filtro "Tipo": 1 carro, 2 van / utilitário, 3 caminhão / pesado; reboques à parte.'],
  ['`seats`', '`seats`, ou o número de `part Seat*`.'],
  ['`trunk`, `gas`', 'Capacidade do porta-malas e do tanque (veja acima).'],
  ['`containers`', '`[{ part, cap }]`, todos os compartimentos.'],
  ['`skins`, `thumbs`', 'Texturas das skins e as miniaturas copiadas para `vehicles/`.'],
  ['`wreck`', 'Destroço (veja acima).'],
  ['`m3d`', 'Montagem do modelo 3D (corpo, peças, rodas), ou `null`.'],
  ['`stats`', 'Propriedades numéricas do script: `mass`, `engineForce`, `maxSpeed`, `frontEndHealth`, `rearEndHealth`, `playerDamageProtection`, `model` etc.'],
]);

p('## Por classe', '',
  'A classe e o papel também são da lista do script, não do jogo. **Blindado**: tanques e veículos de combate ou transporte blindados. **Utilitário**: jipes e HMMWV. **Caminhão**: caminhões de carga, tanque, guincho e contra incêndio. **Reboque**: reboques de carga militares.', '');
table(['Classe', 'Veículos', 'Destroços'], CLASSES.filter(c => byClass[c]).map(c => ['[' + c + '](#' + anchor(c) + ')', fmt(byClass[c].length), fmt(byClass[c].filter(v => v.wreck).length)]));

p('## Por origem', '', 'Na aba Veículos, o filtro "Mod" da barra lateral ou `mod:<trecho>` na busca (ex.: `mod:oshkosh`, `mod:papa_chad`) mostra os veículos de cada mod.', '');
table(['Mod', 'Veículos', 'Destroços'], srcOrder.map(s => [s, fmt(bySrc[s].n), fmt(bySrc[s].wreck)]));

p('## Pinturas', '',
  'Cada skin é uma pintura do mesmo modelo; o painel de debug "Spawn Vehicle" do jogo deixa escolher qual. O nome da pintura vem do nome da textura, o que vem depois de `_Shell_` ou do prefixo do veículo; aqui sem diferenciar maiúsculas. "Veículos" conta quantos veículos militares têm a pintura.', '');
table(['Pintura', 'Veículos'], Object.entries(byPaint).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, n]) => ['`' + k + '`', fmt(n)]));
if (manySkins.length) p('Têm mais skins do que as 6 que viram miniatura: ' + manySkins.map(v => name(v) + ' (' + v.skins.length + ')').join(', ') + '.', '');

p('## Catálogo', '',
  'Todos os veículos militares por classe, em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. As colunas são os campos de `data/vehicles.js`: porta-malas é `trunk`, tanque é `gas` (litros), vel. máx. é `maxSpeed`, motor é `engineForce`, massa é `mass`, proteção é `playerDamageProtection` e vida é `frontEndHealth` / `rearEndHealth`. "Outros compartimentos" lista os de `containers` fora o tanque e os pneus. Os destroços têm quase tudo zerado no script; "—" marca o zero.', '');
const byName = (a, b) => (a.pt || a.en || a.name).localeCompare(b.pt || b.en || b.name) || a.id.localeCompare(b.id);
for (const c of CLASSES) {
  const list = byClass[c]; if (!list) continue;
  p('### ' + c, '');
  table(['Nome', 'ID', 'Origem', 'Papel', 'Assentos', 'Porta-malas', 'Tanque', 'Vel. máx.', 'Motor', 'Massa', 'Proteção', 'Vida', 'Outros compartimentos', 'Pinturas'], list.sort(byName).map(v => {
    const s = v.stats;
    return [label(v), '`' + v.id + '`', v.mod, v.role, dash(v.seats), dash(v.trunk), dash(v.gas), dash(s.maxSpeed), dash(s.engineForce), dash(s.mass), dash(s.playerDamageProtection), s.frontEndHealth || s.rearEndHealth ? fmt(s.frontEndHealth) + ' / ' + fmt(s.rearEndHealth) : '—', others(v), paints(v)];
  }));
}

p('## Fora do catálogo', '', 'Veículos que têm pista de militar, ou são parentes próximos de um veículo militar, mas não entram na lista (`EXCLUDED` no script):', '');
table(['IDs', 'Por quê'], EXCLUDED.map(([ids, why]) => [ids.map(id => '`' + id + '`').join(', '), why]));

const file = path.join(ROOT, 'docs/military_vehicles.md');
fs.writeFileSync(file, out.join('\n'));
console.log(file, (fs.statSync(file).size / 1e3).toFixed(0) + 'KB');
