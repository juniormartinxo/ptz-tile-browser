# PZ Browser

Navegador offline de **tiles**, **veículos** e **itens** do Project Zomboid (build 42), incluindo o conteúdo dos mods instalados. É uma página estática (`index.html`) alimentada por arquivos `data/*.js` que os scripts `build*.js` extraem direto da instalação do jogo.

## Abas

- **Tiles**: todos os sprites dos tilesets vanilla e de mods, com propriedades (`.tiles`), nomes PT-BR/EN (`Moveables.json`) e filtros por função, material, origem e tileset. Clique num tile para ver as propriedades e copiar o nome.
- **Veículos**: scripts de veículo com estatísticas (porta-malas, velocidade, motor, assentos, massa), skins e um visualizador 3D (three.js via CDN, modelos FBX). Copia o ID e o comando de spawn para o console de debug.
- **Itens**: itens de `media/scripts` com ícone, nome PT/EN, categoria, peso, dano, calorias e capacidade. Copia o ID e o comando `AddItem` para o console.
- **Mapa ↗**: link para o mapa isométrico renderizado com [pzmap2dzi](https://github.com/cff29546/pzmap2dzi). Ele não vem no repositório (veja [Mapa](#mapa)).

### Sintaxe de busca

| Aba | Exemplos |
| --- | --- |
| Tiles | `lustre`, `generator`, `container=fridge`, `ts:lighting_indoor`, `mod:atlanta`, `k:Propriedade`, `-palavra` |
| Veículos | `mod:ki5`, `seats:6`, `-trailer`; comparações (`>`, `>=`, `<`, `<=`, `=`) com `trunk`, `speed`, `engine`, `mass`, `seats`, `gas`, ex.: `trunk>100` |
| Itens | `cat:comida`, `type:arma`, `tag:sharpknife`, `mod:ki5`, `k:Propriedade`, `ammotype=9mm`, `-palavra`; comparações (`>`, `>=`, `<`, `<=`) com `weight`/`peso`, `dmg`/`dano`, `cal`, `cap`, `range`, ex.: `weight<0.5` |

Filtros da mesma seção da barra lateral se combinam com OU; filtros de seções diferentes, com E. Atalhos: `/` foca a busca; `Esc` limpa a busca quando ela está focada com texto e, fora disso, fecha o painel.

## Uso

Requer Node.js (sem dependências npm). Os scripts de extração só rodam no Windows: usam `%USERPROFILE%` e caminhos `C:/` fixos.

```sh
node serve.js        # http://localhost:8765
```

Também dá para abrir `index.html` direto no navegador, mas a aba Mapa só funciona com o servidor.

O repositório já traz `data/items.js`, `data/vehicles.js`, `data/tiles.js`, os ícones e as texturas de veículos. As **imagens dos tiles** (`atlas/`) ficam fora do Git: rode `node build.js` uma vez para gerá-las.

## Regenerando os dados

Os scripts leem o jogo em `C:/Program Files (x86)/Steam/steamapps/common/ProjectZomboid` e os mods em `%USERPROFILE%/Zomboid/mods` e no Workshop da Steam (`steamapps/workshop/content/108600`). Os caminhos estão fixos no topo de cada script (inclusive `tools/city_cells.js`). Ajuste-os se a sua instalação for diferente.

| Script | Lê | Gera |
| --- | --- | --- |
| `node build.js` | `media/texturepacks/*.pack`, `media/*.tiles`, `pack=`/`tiledef=` dos `mod.info`, `Moveables.json` | `atlas/*.png`, `data/tiles.js` |
| `node build_items.js` | blocos `item` de `media/scripts`, packs de UI, `Item_*.png`, traduções `ItemName` e `IG_UI` (categorias) | `icons/*.png`, `data/items.js` |
| `node build_vehicles.js` | blocos `vehicle`/`template vehicle`/`model` de `media/scripts`, texturas e modelos FBX, `IG_UI.json` | `vehicles/*.png`, `data/vehicles.js`, `data/models/*.js`, `data/textures/*.js` |

Opções de `build.js` e `build_items.js` (`build_vehicles.js` sempre inclui os mods):

- `--vanilla`: ignora os mods.
- `--skip=nome1,nome2`: pula os mods cujo nome ou id contenha algum dos termos.

`build_items.js` e `build_vehicles.js` usam `GAME_VER` (42.20) para escolher a pasta de versão `42.x` mais adequada de cada mod.

`node tools/tiles_doc.js` regera [`docs/tiles.md`](docs/tiles.md), o catálogo dos tiles mapeados (formato de `data/tiles.js`, contagens e todos os tilesets), a partir de `data/tiles.js`. Rode-o depois de `node build.js`.

`node tools/weapons_doc.js` regera [`docs/weapons.md`](docs/weapons.md), o catálogo das armas (itens `base:weapon`: classes, origens, munição, propriedades e todas as armas), a partir de `data/items.js`. Rode-o depois de `node build_items.js`.

`node tools/bags_doc.js` regera [`docs/bags.md`](docs/bags.md), o catálogo das bolsas (contêineres que vão no corpo, com slot em `CanBeEquipped`: classes, slots, origens, propriedades e todas as bolsas, mais um resumo dos outros contêineres e dos itens de outros tipos que usam um slot de bolsa), a partir de `data/items.js`. Rode-o depois de `node build_items.js`; ele falha se aparecer um slot que nenhuma classe da tabela do script reconhece ou se uma classe ficar sem bolsas.

`node tools/military_vehicles_doc.js` regera [`docs/military_vehicles.md`](docs/military_vehicles.md), o catálogo dos veículos militares (lista mantida no script: classes, origens, pinturas e todos os veículos, mais os que ficam de fora e por quê), a partir de `data/vehicles.js`. Rode-o depois de `node build_vehicles.js`; ele falha se aparecer um veículo com pista de militar (pintura, arma montada, HMMWV no nome ou mod militar) que não está na lista nem nas exclusões.

## Mapa

A aba Mapa abre `map/html/pzmap.html`, gerado pelo pzmap2dzi (cerca de 45 GB, fora do Git). Para gerá-lo:

1. Clone o [pzmap2dzi](https://github.com/cff29546/pzmap2dzi) em `tools/pzmap2dzi/`.
2. Use `tools/pzmap2dzi.conf.yaml` como configuração e ajuste `output_root` para a pasta `map/` deste repositório (o valor versionado aponta para a máquina do autor).
3. Rode o render conforme a documentação do pzmap2dzi.

`node tools/city_cells.js [minPredios] [raio]` lista as células 256×256 do mapa vanilla que pertencem a cada cidade, a partir do `worldmap.xml`, e grava `tools/city_cells.json`. Serve para limitar o render às áreas urbanas.

## Estrutura

```
index.html         página única; abas, estilos e a aba Tiles
items.js           aba Itens
vehicles.js        aba Veículos, visualizador 3D e troca de abas
serve.js           servidor estático (porta 8765)
build*.js          extratores (veja acima)
data/              dados gerados (tiles, itens, veículos, modelos e texturas 3D em base64)
icons/, vehicles/  ícones de itens e skins de veículos
atlas/             páginas de textura dos tiles (gerado, ignorado pelo Git)
map/               mapa renderizado (gerado, ignorado pelo Git)
tools/             utilitários do mapa e geradores dos docs/*.md
docs/tiles.md      catálogo dos tiles (gerado)
docs/weapons.md    catálogo das armas (gerado)
docs/bags.md       catálogo das bolsas (gerado)
docs/military_vehicles.md  catálogo dos veículos militares (gerado)
AGENTS.md, docs/agents/  instruções para agentes de IA (issues no It's a Plan, projeto PTZ)
.claude/, .agents/, skills-lock.json  skills dos agentes
```
