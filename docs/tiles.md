# Tiles

> Gerado por `node tools/tiles_doc.js` a partir de `data/tiles.js` (extraído em 2026-09-20). Não edite à mão: rode `node build.js` e depois o script para atualizar.

Um **tile** é um sprite do mapa do Project Zomboid (piso, parede, móvel, árvore...). Cada tile pertence a um **tileset** (uma folha de sprites, ex.: `appliances_com_01`) e é identificado por `<tileset>_<índice>`, ex.: `appliances_com_01_0`. É esse nome que o jogo e os mapas usam.

Total mapeado: **131.239 tiles** em **1.547 tilesets**, 128.667 com imagem e 34.902 com nome traduzido, distribuídos em 1.627 páginas de atlas.

## Como os tiles são mapeados

`build.js` cruza três fontes do jogo (e dos mods com `pack=`/`tiledef=` no `mod.info`):

1. **Texture packs** (`media/texturepacks/*.pack`, formato `PZPK`): páginas PNG com a posição de cada sprite. Vanilla: `Tiles2x.pack` e `Tiles2x.floor.pack`. As páginas viram `atlas/*.png`.
2. **Definições de tiles** (`media/*.tiles`, formato `tdef`): lista os tilesets (nome, imagem, colunas × linhas) e as propriedades de cada tile. Vanilla: `newtiledefinitions`, `tiledefinitions_erosion`, `tiledefinitions_overlays` e `tiledefinitions_b42chunkcaching`. Se o mesmo tile aparece em mais de um arquivo, as propriedades são mescladas.
3. **Traduções** (`Translate/PTBR` e `EN/Moveables.json`): o nome exibido vem de `GroupName` + `CustomName` do tile, normalizado como chave (espaços e hífens viram `_`, apóstrofos e pontos somem).

Regras de inclusão:

- Um sprite que só existe no pack (sem `.tiles`) também vira tile, num tileset de origem `pack` sem grade definida.
- Um slot da folha sem imagem e sem propriedades é descartado.
- A primeira ocorrência de um sprite vence: o vanilla é lido antes dos mods.

## Formato de `data/tiles.js`

```js
window.PZ_TILES = {
  generated: "2026-09-20T15:45:25.558Z",   // data da extração
  pages: ["Tiles2x3", ...],                 // páginas de atlas: atlas/<page>.png
  tilesets: [{ name, image, cols, rows, source }, ...],
  tiles: [[name, ts, idx, pg, rect, props, pt, en], ...]
};
```

Campos de cada tile (ordenados por tileset e índice):

| Pos. | Campo | Descrição |
| --- | --- | --- |
| 0 | `name` | Nome do tile, `<tileset>_<idx>`. |
| 1 | `ts` | Índice em `tilesets`. |
| 2 | `idx` | Posição na folha do tileset (linha × `cols` + coluna). |
| 3 | `pg` | Índice em `pages`, ou `-1` se o tile não tem imagem. |
| 4 | `rect` | `[x, y, w, h, ox, oy, fw, fh]`: recorte na página, deslocamento do recorte dentro do quadro e tamanho do quadro (sprites 2x, normalmente 128 × 256). `null` sem imagem. |
| 5 | `props` | Propriedades do `.tiles`, `{ chave: valor }`; flags têm valor `""`. |
| 6 | `pt` | Nome em PT-BR do `Moveables.json`, ou `""`. |
| 7 | `en` | Nome em inglês; sem tradução, cai em `GroupName CustomName`, ou `""`. |

`source` do tileset é `vanilla`, o `name=` do `mod.info` do mod, ou `pack` (sprite sem definição).

## Por origem

Tilesets definidos sem nenhum tile (só slots vazios) entram na contagem: `blueprints_01`, `fixtures_windows_curtains_01_on`, `z_templates_letterboard`, `e_debug_1`, `walls_house_blocks_01_MIRRORED`, `pert_carpentry_01`.

| Origem | Tilesets | Tiles | Com imagem |
| --- | ---: | ---: | ---: |
| [vanilla](#tilesets-vanilla) | 479 | 39.453 | 37.180 |
| [Melos Tiles For Miles](#tilesets-melos-tiles-for-miles) | 790 | 80.646 | 80.517 |
| [Perts Party Tiles](#tilesets-perts-party-tiles) | 70 | 3.993 | 3.827 |
| [Atlanta](#tilesets-atlanta) | 77 | 3.873 | 3.873 |
| [Rocco's Tiles](#tilesets-roccos-tiles) | 47 | 1.851 | 1.851 |
| [Ladders?! B42.20.4 [USE FOR NEW SAVES]](#tilesets-ladders-b42204-use-for-new-saves) | 1 | 29 | 29 |
| [3D Gun Racks](#tilesets-3d-gun-racks) | 1 | 24 | 24 |
| [Bunker](#tilesets-bunker) | 5 | 18 | 16 |
| [Useful Barrels](#tilesets-useful-barrels) | 1 | 17 | 17 |
| [Excavation](#tilesets-excavation) | 3 | 15 | 14 |
| [Hot Brass - Ammo Crafting](#tilesets-hot-brass---ammo-crafting) | 1 | 4 | 4 |
| [Underground Power Tap](#tilesets-underground-power-tap) | 1 | 1 | 0 |
| [Neat Building [B42.12]](#tilesets-neat-building-b4212) | 1 | 1 | 1 |
| [pack](#tilesets-pack) | 70 | 1.314 | 1.314 |

## Por função

As funções são os filtros da barra lateral da aba Tiles, derivados das propriedades (regras em `index.html`). Um tile pode ter várias.

| Função | Tiles |
| --- | ---: |
| Contêiner | 4.007 |
| Cama | 3.008 |
| Iluminação | 2.205 |
| Poste / luz externa | 3.836 |
| Fogão / forno | 109 |
| Geladeira | 114 |
| Fogueira / churrasqueira / lareira | 76 |
| Rádio / TV | 91 |
| Gerador | 17 |
| Porta | 7.319 |
| Janela | 12.711 |
| Parede | 51.058 |
| Cerca / grade | 7.474 |
| Piso | 1.563 |
| Telhado | 6.131 |
| Escada | 442 |
| Árvore / vegetação | 426 |
| Mesa / superfície | 6.917 |
| Móvel (pode pegar) | 29.044 |
| Água | 531 |
| Sinal / placa | 1.906 |
| Quebra ao bater (carro) | 1.102 |
| Sem propriedades | 10.174 |

## Por material

Vem de `Material`, `Material2` e `Material3`.

| Material | Tiles |
| --- | ---: |
| Wood | 9.549 |
| Electric | 1.167 |
| Glass | 839 |
| Fabric | 2.690 |
| Stone | 598 |
| Plastic | 179 |
| Leather | 377 |
| Paper | 420 |
| Rubber | 78 |

## Propriedades

As 243 chaves que aparecem em `props`, da mais comum à mais rara. Na busca, `k:Chave` filtra quem tem a chave e `chave=valor` compara o valor. "Valores" mostra até 5 dos mais comuns (`(flag)` = sem valor; acima de 50 valores distintos a contagem é parcial).

| Propriedade | Tiles | Valores |
| --- | ---: | --- |
| `wall` | 51.058 | (flag) 51.058 |
| `BurntTile` | 44.572 | `fencing_burnt_01_1` 16, `fencing_burnt_01_2` 16, `roofs_burnt_01_14` 14, `roofs_burnt_01_15` 14, `roofs_burnt_01_0` 12, … |
| `CustomName` | 34.841 | `Sign` 1.567, `Chair` 437, `Table` 302, `Tent` 144, `CustomName` 139, … |
| `IsMoveAble` | 29.044 | (flag) 29.044 |
| `GroupName` | 26.731 | `Blue` 218, `White` 161, `Green` 156, `Metal` 154, `Red` 142, … |
| `PickUpWeight` | 25.839 | `100` 6.729, `30` 3.543, `200` 3.094, `50` 2.841, `20` 2.282, +30 |
| `Facing` | 24.412 | `S` 7.862, `E` 7.744, `N` 4.430, `W` 4.376 |
| `WallOverlay` | 21.640 | (flag) 21.640 |
| `Material` | 19.171 | `Wood` 6.190, `Nails` 2.522, `Steel` 1.663, `Door` 1.076, `MetalBars` 989, +28 |
| `CanScrap` | 18.849 | (flag) 18.849 |
| `MoveType` | 15.497 | `WallObject` 8.929, `Window` 3.587, `WindowObject` 1.160, `FloorRug` 1.144, `FloorTile` 436, +1 |
| `attachedN` | 15.244 | (flag) 15.244 |
| `PickUpTool` | 15.012 | `Hammer` 8.448, `Crowbar` 4.906, `Wrench` 867, `Shovel` 335, `Electrician` 277, +2 |
| `PlaceTool` | 14.974 | `Hammer` 13.383, `Wrench` 867, `Shovel` 333, `Electrician` 281, `Screwdriver` 84, +2 |
| `Material2` | 14.972 | `Nails` 4.806, `Wood` 3.382, `Screws` 2.632, `MetalScrap` 643, `Pipes` 581, +26 |
| `attachedW` | 14.895 | (flag) 14.895 |
| `WallN` | 13.646 | (flag) 13.646 |
| `WallW` | 13.635 | (flag) 13.635 |
| `BlocksPlacement` | 13.500 | (flag) 13.500 |
| `PickUpLevel` | 13.165 | `2` 11.772, `1` 618, `3` 586, `4` 150, `5` 39 |
| `CanBreak` | 11.618 | (flag) 11.618 |
| `FlatTextureOffset` | 10.457 | `-8` 3.555, `-7` 3.448, `1` 793, `-10` 688, `-9` 686, +3 |
| `solidtrans` | 9.716 | (flag) 9.716 |
| `IsLow` | 7.792 | (flag) 7.792 |
| `SpriteGridPos` | 6.962 | `0,0` 2.680, `1,0` 1.547, `0,1` 1.522, `1,1` 377, `2,0` 246, +25 |
| `attachedFloor` | 6.849 | (flag) 6.849 |
| `Surface` | 6.845 | `34` 1.729, `29` 1.162, `17` 748, `36` 376, `15` 342, … |
| `WindowN` | 6.357 | (flag) 6.357 |
| `WindowW` | 6.354 | (flag) 6.354 |
| `WestRoofT` | 5.983 | (flag) 5.983 |
| `ForceAmbient` | 5.847 | (flag) 5.847 |
| `Material3` | 5.828 | `Fabric` 1.954, `Screws` 1.159, `Glass` 323, `Leather` 302, `SmallMetalPlates` 278, +23 |
| `MaterialType` | 5.753 | `Wood` 1.377, `Metal` 762, `Glass` 674, `Fabric` 531, `Plastic` 389, +16 |
| `ScrapSize` | 5.330 | `Small` 4.867, `Large` 463 |
| `HoppableW` | 4.925 | (flag) 4.925 |
| `HoppableN` | 4.815 | (flag) 4.815 |
| `FloorOverlay` | 4.672 | (flag) 4.672 |
| `ForceSingleItem` | 4.620 | (flag) 4.620 |
| `disableFade` | 4.573 | (flag) 4.573 |
| `WindowShape` | 4.110 | `9` 256, `10` 256, `1` 250, `2` 250, `3` 250, +16 |
| `container` | 4.007 | `counter` 1.212, `shelves` 395, `overhead` 234, `desk` 174, `sidetable` 150, … |
| `streetlight` | 3.836 | (flag) 3.836 |
| `WallSE` | 3.739 | (flag) 3.739 |
| `IsTable` | 3.375 | (flag) 3.375 |
| `WallNW` | 3.263 | (flag) 3.263 |
| `bed` | 3.008 | (flag) 3.008 |
| `GrimeType` | 2.892 | `FullWindow` 2.435, `Trim` 173, `DoubleLeft` 142, `DoubleRight` 142 |
| `SnowTile` | 2.751 | `object_snow_overlay_03_144` 1, `object_snow_overlay_03_146` 1, `object_snow_overlay_03_147` 1, `object_snow_overlay_03_148` 1, `object_snow_overlay_03_149` 1, … |
| `BedType` | 2.695 | `goodBed` 1.407, `badBed` 772, `averageBed` 516 |
| `ContainerCapacity` | 2.675 | `20` 494, `50` 426, `10` 345, `15` 336, `30` 199, +21 |
| `IsHigh` | 2.666 | (flag) 2.666 |
| `alwaysDraw` | 2.590 | (flag) 2.590 |
| `IsPaintable` | 2.375 | (flag) 2.375 |
| `PaintingType` | 2.296 | `windowsframe` 1.648, `wall` 159, `dblwindowframeleft` 128, `dblwindowframeright` 128, `doorframe` 106, +5 |
| `attachedNW` | 2.291 | (flag) 2.291 |
| `SmashedTileOffset` | 2.254 | `4` 1.702, `8` 302, `56` 98, `2` 38, `64` 32, +18 |
| `BlockRain` | 2.204 | (flag) 2.204 |
| `doorFrW` | 2.176 | (flag) 2.176 |
| `doorFrN` | 2.171 | (flag) 2.171 |
| `GlassRemovedOffset` | 2.120 | `12` 882, `6` 794, `16` 150, `88` 96, `96` 32, +27 |
| `attachedSE` | 2.044 | (flag) 2.044 |
| `ContainerPosition` | 1.950 | `Low` 1.275, `High` 675 |
| `IsGridExtensionTile` | 1.794 | (flag) 1.794 |
| `lightR` | 1.594 | `120` 170, `50` 146, `115` 110, `20` 106, `30` 97, … |
| `lightG` | 1.573 | `30` 134, `50` 118, `120` 117, `80` 111, `100` 107, … |
| `lightB` | 1.567 | `50` 138, `30` 135, `100` 131, `20` 128, `120` 126, … |
| `solidfloor` | 1.563 | (flag) 1.563 |
| `IsClosedState` | 1.546 | (flag) 1.546 |
| `lightswitch` | 1.476 | (flag) 1.476 |
| `LightRadius` | 1.437 | `3` 731, `2` 282, `4` 196, `1` 119, `5` 28, +13 |
| `WindowLocked` | 1.323 | (flag) 1.323 |
| `DoorWallW` | 1.322 | (flag) 1.322 |
| `DoorWallN` | 1.320 | (flag) 1.320 |
| `ScrapUseSkill` | 1.144 | (flag) 1.144 |
| `ScrapUseTool` | 1.120 | (flag) 1.120 |
| `HitByCar` | 1.102 | (flag) 1.102 |
| `GenericCraftingSurface` | 1.007 | `true` 931, `false` 76 |
| `doorTrans` | 990 | (flag) 990 |
| `windowN` | 986 | (flag) 986 |
| `exterior` | 985 | (flag) 985 |
| `windowW` | 982 | (flag) 982 |
| `CloseSneakBonus` | 974 | `250` 687, `500` 159, `1000` 89, `200` 22, `400` 15, +1 |
| `attachedE` | 964 | (flag) 964 |
| `ItemHeight` | 868 | `96` 152, `80` 86, `34` 83, `64` 52, `60` 45, +36 |
| `attachedS` | 848 | (flag) 848 |
| `CutawayHint` | 806 | `DoubleDoorLeft` 265, `DoubleDoorRight` 265, `DoubleWindowLeft` 90, `DoubleWindowRight` 90, `GarageDoorLeft` 32, +2 |
| `OpenTileOffset` | 775 | `2` 750, `32` 12, `1` 9, `-1` 4 |
| `TileOverlay` | 768 | (flag) 768 |
| `doorW` | 758 | (flag) 758 |
| `doorN` | 757 | (flag) 757 |
| `diamondFloor` | 686 | (flag) 686 |
| `IsTableTop` | 672 | (flag) 672 |
| `FootstepMaterial` | 661 | `Carpet` 254, `Gravel` 132, `Ceramic` 122, `Dirt` 66, `Concrete` 58, +2 |
| `IsSurfaceOffset` | 657 | (flag) 657 |
| `solid` | 652 | (flag) 652 |
| `MoveWithWind` | 616 | (flag) 616 |
| `WallNTrans` | 610 | (flag) 610 |
| `WallWTrans` | 592 | (flag) 592 |
| `NoWallLighting` | 579 | (flag) 579 |
| `CustomItem` | 570 | `Base.TentYellow` 32, `Base.TentBlue` 32, `Base.TentBrown` 32, `Base.TentGreen` 32, `Base.HideTent` 16, … |
| `cutN` | 531 | (flag) 531 |
| `cutW` | 531 | (flag) 531 |
| `RoofGroup` | 490 | `3` 68, `9` 66, `10` 66, `1` 50, `5` 44, +5 |
| `CornerWestWall` | 488 | `fencing_01_35` 4, `carpentry_02_40` 3, `carpentry_02_44` 3, `carpentry_02_48` 3, `fencing_01_4` 3, … |
| `CornerNorthWall` | 487 | `fencing_01_32` 4, `carpentry_02_41` 3, `carpentry_02_45` 3, `carpentry_02_49` 3, `fencing_01_5` 3, … |
| `waterPiped` | 482 | (flag) 482 |
| `FlatTextureOverride` | 471 | `-7` 83, `-8` 81, `1` 69, `-2` 66, `-1` 62, +2 |
| `HasLightOnSprite` | 460 | (flag) 460 |
| `DoorSound` | 452 | `GarageDoor` 244, `WoodGate` 84, `MetalGate` 56, `SlidingGlassDoor` 28, `WoodShackDoor` 16, +2 |
| `canBeRemoved` | 447 | (flag) 447 |
| `TallHoppableW` | 444 | (flag) 444 |
| `waterAmount` | 437 | `20` 360, `100` 37, `9999` 22, `1000` 6, `999999` 5, +4 |
| `vegitation` | 426 | (flag) 426 |
| `TallHoppableN` | 419 | (flag) 419 |
| `waterMaxAmount` | 419 | `20` 360, `100` 41, `1000` 6, `999999` 5, `50` 2, +3 |
| `CurtainSound` | 376 | `Long` 192, `Short` 128, `Shade` 56 |
| `Movement` | 348 | `HedgeLow` 196, `HedgeHigh` 152 |
| `GarageDoor` | 336 | `1` 56, `2` 56, `3` 56, `4` 56, `5` 56, +1 |
| `IsoType` | 316 | `IsoStove` 86, `IsoBarbecue` 49, `IsoRadio` 48, `IsoTelevision` 43, `IsoFireplace` 24, +7 |
| `curtainE` | 292 | (flag) 292 |
| `curtainN` | 292 | (flag) 292 |
| `curtainS` | 292 | (flag) 292 |
| `curtainW` | 292 | (flag) 292 |
| `WindType` | 279 | `2` 216, `3` 63 |
| `fireRequirement` | 267 | `900000` 93, `35` 84, `80` 68, `800` 22 |
| `DoubleDoor1` | 265 | (flag) 265 |
| `DoubleDoor2` | 265 | (flag) 265 |
| `FloorMaterial` | 264 | `Burnt` 40, `Clay` 32, `Sand` 16, `Grass_Dark` 16, `Grass_Medium` 16, +11 |
| `WallType` | 258 | `wall` 110, `windowsframe` 74, `doorframe` 74 |
| `CanAttachAnimal` | 240 | (flag) 240 |
| `SinkType` | 240 | `Ceramic` 240 |
| `Bush` | 233 | (flag) 233 |
| `WallNWTrans` | 219 | (flag) 219 |
| `RenderLayer` | 205 | `Floor` 205 |
| `SpearOnlyAttackThrough` | 202 | (flag) 202 |
| `IsFloorAttached` | 200 | (flag) 200 |
| `forceLocked` | 180 | (flag) 180 |
| `DoubleDoor` | 176 | `3` 22, `4` 22, `1` 22, `2` 22, `8` 22, +3 |
| `CountertopAttach` | 174 | (flag) 174 |
| `TieSheetRope` | 170 | (flag) 170 |
| `FenceTypeLow` | 152 | `Wood` 132, `Metal` 12, `RoadBlock` 8 |
| `PhysicsShape` | 147 | `Tree` 75, `WallN` 18, `WallW` 18, `WallS` 18, `WallE` 18 |
| `StopCar` | 145 | (flag) 145 |
| `tree` | 135 | `2` 38, `3` 36, `1` 33, `4` 28 |
| `ContainerPutSound` | 124 | `PutItemInFridge` 52, `ShelfWoodTransferItem` 52, `MannequinTransferItem` 12, `ShelfMetalTransferItem` 8 |
| `ContainerTakeSound` | 124 | `PutItemInFridge` 52, `ShelfWoodTransferItem` 52, `MannequinTransferItem` 12, `ShelfMetalTransferItem` 8 |
| `Freezer` | 120 | (flag) 120 |
| `FreezerCapacity` | 120 | `20` 72, `30` 20, `50` 16, `5` 10, `10` 2 |
| `FasciaEdge` | 112 | `West` 16, `North` 16, `NorthWestCorner` 16, `NorthAndWest` 16, `NorthEastCorner` 6, +7 |
| `livingRoom` | 108 | (flag) 108 |
| `FenceTypeHigh` | 105 | `MetalGate` 48, `Wood` 40, `Metal` 17 |
| `signal` | 102 | `radio` 56, `tv` 46 |
| `propaneTank` | 92 | (flag) 92 |
| `chairS` | 82 | (flag) 82 |
| `PhysicsMesh` | 80 | `ramp20segment1n` 1, `ramp20segment2n` 1, `ramp20segment3n` 1, `ramp20segment4n` 1, `ramp20segment5n` 1, … |
| `SlopedSurfaceDirection` | 80 | `N` 20, `S` 20, `W` 20, `E` 20 |
| `SlopedSurfaceHeightMax` | 80 | `5` 4, `10` 4, `15` 4, `20` 4, `25` 4, +15 |
| `IsStackable` | 79 | (flag) 79 |
| `chairE` | 78 | (flag) 78 |
| `chairN` | 78 | (flag) 78 |
| `isEave` | 76 | (flag) 76 |
| `IsMirror` | 76 | (flag) 76 |
| `SlopedSurfaceHeightMin` | 76 | `5` 4, `10` 4, `15` 4, `20` 4, `25` 4, +14 |
| `stairsBN` | 74 | (flag) 74 |
| `stairsBW` | 74 | (flag) 74 |
| `stairsMN` | 74 | (flag) 74 |
| `stairsMW` | 74 | (flag) 74 |
| `stairsTN` | 73 | (flag) 73 |
| `stairsTW` | 73 | (flag) 73 |
| `chairW` | 72 | (flag) 72 |
| `WestRoofB` | 70 | (flag) 70 |
| `canBeCut` | 68 | (flag) 68 |
| `FloorAttachmentE` | 68 | (flag) 68 |
| `FloorAttachmentN` | 68 | (flag) 68 |
| `FloorAttachmentS` | 68 | (flag) 68 |
| `FloorAttachmentW` | 68 | (flag) 68 |
| `collideW` | 67 | (flag) 67 |
| `transparentFloor` | 64 | (flag) 64 |
| `collideN` | 63 | (flag) 63 |
| `IsTrashCan` | 63 | (flag) 63 |
| `Countertop` | 56 | (flag) 56 |
| `IsFridge` | 54 | (flag) 54 |
| `ContainerCloseSound` | 52 | `CloseFridge` 44, `CloseFridgeSliding` 8 |
| `ContainerOpenSound` | 52 | `OpenFridge` 44, `OpenFridgeSliding` 8 |
| `FreezerPosition` | 52 | `Low` 40, `High` 12 |
| `invisible` | 49 | (flag) 49 |
| `StackReplaceTileOffset` | 47 | `-1` 20, `-2` 15, `-4` 8, `-8` 4 |
| `MinimumCarSpeedDmg` | 45 | `15` 16, `10` 14, `20` 9, `30` 4, `5` 2 |
| `AmbientSound` | 40 | `FridgeHum` 40 |
| `taintedWater` | 39 | (flag) 39 |
| `DamagedSprite` | 37 | `damaged_objects_01_2` 2, `damaged_objects_01_12` 2, `damaged_objects_01_13` 2, `melos_tiles_gardencenter_01_32` 2, `melos_tiles_gardencenter_01_35` 2, +25 |
| `SpeedFactor` | 36 | `20` 36 |
| `forceFade` | 32 | (flag) 32 |
| `IsWaterCollector` | 32 | (flag) 32 |
| `CantClimb` | 31 | (flag) 31 |
| `attachedSurface` | 29 | (flag) 29 |
| `WallObjectAllowDoorframe` | 29 | (flag) 29 |
| `makeWindowInvincible` | 28 | (flag) 28 |
| `AttachedToGlass` | 24 | (flag) 24 |
| `InteriorSide` | 24 | (flag) 24 |
| `TunaRackPiece` | 24 | `cabinet` 4, `handguncase` 4, `armory` 4, `armorysat` 4, `pegboard` 4, +1 |
| `TV` | 24 | (flag) 24 |
| `WestRoofM` | 24 | (flag) 24 |
| `fuelAmount` | 23 | `20000` 8, `200` 8, `50` 7 |
| `natureFloor` | 20 | (flag) 20 |
| `grassFloor` | 19 | (flag) 19 |
| `attachedCeiling` | 18 | (flag) 18 |
| `FitsBeneathCountertop` | 17 | (flag) 17 |
| `IgnoreSurfaceSnap` | 16 | (flag) 16 |
| `RoofWallStart` | 15 | `walls_exterior_roofs_09_0` 2, `walls_exterior_roofs_01_0` 1, `walls_exterior_roofs_02_0` 1, `walls_exterior_roofs_04_0` 1, `walls_exterior_roofs_01_24` 1, +9 |
| `CarSlowFactor` | 12 | `2` 12 |
| `FloorHeight` | 12 | `OneThird` 6, `TwoThirds` 6 |
| `climbSheetTopE` | 10 | (flag) 10 |
| `climbSheetTopS` | 10 | (flag) 10 |
| `forceRender` | 10 | (flag) 10 |
| `water` | 10 | (flag) 10 |
| `badBed` | 8 | (flag) 8 |
| `CollisionShape` | 8 | `SouthCounter` 8 |
| `Microwave` | 8 | (flag) 8 |
| `NoFreezer` | 8 | (flag) 8 |
| `PreSeen` | 8 | (flag) 8 |
| `climbSheetN` | 5 | (flag) 5 |
| `climbSheetTopN` | 5 | (flag) 5 |
| `climbSheetTopW` | 5 | (flag) 5 |
| `climbSheetW` | 5 | (flag) 5 |
| `GeneratorSound` | 5 | `OldGenerator` 4, `UPT_Silent` 1 |
| `ladderN` | 5 | (flag) 5 |
| `ladderW` | 5 | (flag) 5 |
| `SeatMaterial` | 5 | `Wooden` 4, `Plastic` 1 |
| `ladderE` | 4 | (flag) 4 |
| `ladderS` | 4 | (flag) 4 |
| `NeverCutaway` | 4 | (flag) 4 |
| `ThumpSound` | 4 | `ZombieThumpMetal` 4 |
| `WheelieBin` | 4 | (flag) 4 |
| `climbSheetE` | 3 | (flag) 3 |
| `climbSheetS` | 3 | (flag) 3 |
| `Eoffset` | 3 | `-1` 1, `-2` 1, `-3` 1 |
| `Noffset` | 3 | `3` 1, `2` 1, `1` 1 |
| `Soffset` | 3 | `1` 1, `-1` 1, `-2` 1 |
| `Woffset` | 3 | `2` 1, `1` 1, `-1` 1 |
| `TreatAsWallOrder` | 2 | (flag) 2 |
| `DoorWallNTrans` | 1 | (flag) 1 |
| `DoorWallWTrans` | 1 | (flag) 1 |

## Tilesets

Todos os tilesets, por origem e em ordem alfabética. "Grade" é colunas × linhas da folha; "Exemplos" são os primeiros nomes traduzidos do tileset.

### Tilesets: vanilla

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `advertising_01` | 8×16 | 100 | 100 | 0 | — |
| `advertising_01_on` | 8×16 | 3 | 3 | 0 | — |
| `advertising_02` | 8×8 | 2 | 2 | 2 | Mall Sign |
| `advertising_02_on` | 8×8 | 2 | 2 | 0 | — |
| `animaltracks_large_01` | 8×20 | 64 | 64 | 0 | — |
| `appliances_01` | 8×12 | 96 | 0 | 0 | — |
| `appliances_com_01` | 8×30 | 158 | 153 | 84 | Rádio Amador Premium Technologies; Premium Technologies Ham CustomName; Rádio Amador do Exército dos Estados Unidos; US ARMY COMM. Ham CustomName |
| `appliances_com_01_on` | 8×30 | 11 | 11 | 0 | — |
| `appliances_cooking_01` | 8×16 | 79 | 79 | 79 | Fogão Verde; Fogão Cinza; Fogão Vermelho; Fogão Cromado |
| `appliances_cooking_01_on` | 8×16 | 33 | 33 | 0 | — |
| `appliances_cooking_ON_01` | 8×16 | 128 | 0 | 0 | — |
| `appliances_laundry_01` | 8×8 | 28 | 28 | 22 | Lava e Seca Azul; Lavadora de Roupas Branca; Secadora de Roupas Branca; Placa de Lavanderia |
| `appliances_laundry_01_on` | 8×8 | 6 | 6 | 0 | — |
| `appliances_misc_01` | 8×8 | 16 | 16 | 16 | Red Generator; Old Generator; Yellow Generator; Blue Generator |
| `appliances_misc_01_on` | 8×8 | 8 | 8 | 0 | — |
| `appliances_radio_01` | 8×8 | 20 | 20 | 20 | Rádio ValuTech; ValuTech CustomName; Rádio Premium Technologies; Premium Technologies CustomName |
| `appliances_refrigeration_01` | 8×8 | 52 | 52 | 52 | Geladeira Branca; Geladeira Azul; Geladeira Cromada; Geladeira Verde |
| `appliances_refrigeration_01_on` | 8×8 | 12 | 12 | 0 | — |
| `appliances_television_01` | 8×16 | 36 | 36 | 12 | Televisão Premium Technologies; Televisão ValuTech; Televisão Antiga |
| `blends_grassoverlays_01` | 8×10 | 55 | 55 | 0 | — |
| `blends_natural_01` | 8×20 | 128 | 128 | 0 | — |
| `blends_natural_02` | 8×10 | 16 | 16 | 0 | — |
| `blends_street_01` | 8×20 | 80 | 80 | 0 | — |
| `blends_streetoverlays_01` | 8×10 | 32 | 32 | 0 | — |
| `blueprints_01` | 8×8 | 0 | 0 | 0 | — |
| `books&misc_01` | 8×16 | 122 | 122 | 0 | — |
| `books&misc_02` | 8×16 | 128 | 128 | 0 | — |
| `boulders` | 8×16 | 64 | 60 | 36 | LargeStone; Stone2; Large[1] Boulder; large[2] Boulder |
| `brokenglass_1` | 8×10 | 4 | 4 | 4 | Vidro Quebrado |
| `camping_01` | 8×16 | 59 | 59 | 53 | Barraca Pequena; Campfire; Mesa de Piquenique; Troféu de Veado Empalhado |
| `camping_02` | 8×16 | 88 | 88 | 88 | Saco de Dormir Xadrez Vermelho; Saco de Dormir Xadrez Azul; Saco de Dormir Verde; Saco de Dormir Xadrez Verde |
| `camping_03` | 8×16 | 43 | 36 | 42 | Lean-To Shelter; Tarp Shelter; Simple Cooking Pit; Cooking Pit |
| `camping_04` | 8×16 | 128 | 82 | 128 | Barraca Amarela; Barraca Azul; Barraca Marrom; Barraca Verde |
| `carpentry_01` | 8×8 | 61 | 61 | 29 | Caixote; Mesa Grande Malfeita; Mesa Grande Artesanal; Mesa Artesanal de Qualidade |
| `carpentry_02` | 8×16 | 115 | 115 | 75 | Mesa Malfeita; Mesa Artesanal com Gaveta; Mesa Artesanal de Qualidade com Gaveta; Balcão de Canto Artesanal de Qualidade |
| `carpentry_02_on` | 8×16 | 2 | 0 | 0 | — |
| `carpentry_03` | 8×16 | 94 | 94 | 0 | — |
| `ceilings_01` | 8×4 | 1 | 1 | 0 | — |
| `clothing_01` | 8×8 | 62 | 62 | 0 | — |
| `clothing_02` | 8×8 | 51 | 51 | 0 | — |
| `constructedobjects_01` | 8×18 | 87 | 87 | 9 | Vela; Caixote de Metal; Metal Wall Frame |
| `constructedobjects_signs_01` | 8×16 | 52 | 52 | 42 | Wooden Sign; Crânio de Touro; Crânio de Veado no Poste; Crânio de Vaca |
| `construction_01` | 8×24 | 110 | 110 | 26 | Palete com Tijolos; Palete Vazio; Misturador de Argamassa; Barreira de Estrada |
| `crafted_01` | 8×16 | 118 | 118 | 40 | Blacksmith Anvil; Block Anvil; Stone Anvil; Tambor de Metal |
| `crafted_02` | 8×16 | 109 | 109 | 30 | Workbench; Mó de Pedra; Simple Brazier; Stone Mill |
| `crafted_03` | 8×16 | 86 | 0 | 5 | Assembled Blacksmith Anvil; Rebolo |
| `crafted_04` | 8×16 | 128 | 128 | 74 | Closed Amphora; Open Amphora; Roda de Fiar; Stone Shelf |
| `crafted_05` | 8×24 | 136 | 136 | 83 | Prensa Manual Rudimentar; Forno Artesanal; Armário Alto Rudimentar; Armário de Parede Rudimentar |
| `crafting_ore` | 8×16 | 55 | 55 | 54 | Small ironOreSmall; Medium ironOreMedium; Large ironOreLarge; Pedaços de Minério de Ferro |
| `d_floorleaves_1` | 4×8 | 12 | 12 | 12 | Folhas |
| `d_generic_1` | 16×10 | 80 | 80 | 20 | Twigs; Small Stump; TreeBranch2; StoneTwigs |
| `d_plants_1` | 8×12 | 64 | 64 | 0 | — |
| `d_streetcracks_1` | 8×16 | 120 | 120 | 0 | — |
| `d_trash_1` | 10×8 | 26 | 26 | 26 | Lixo |
| `d_wallcracks_1` | 9×8 | 72 | 72 | 0 | — |
| `damaged_objects_01` | 8×16 | 38 | 38 | 38 | CustomName; bleh |
| `desks_01` | 8×12 | 96 | 96 | 0 | — |
| `e_americanholly_1` | 4×8 | 8 | 8 | 0 | — |
| `e_americanlinden_1` | 4×8 | 24 | 24 | 0 | — |
| `e_canadianhemlock_1` | 4×8 | 9 | 9 | 0 | — |
| `e_carolinasilverbell_1` | 4×8 | 24 | 24 | 0 | — |
| `e_cockspurhawthorn_1` | 4×8 | 24 | 24 | 0 | — |
| `e_debug_1` | 8×10 | 0 | 0 | 0 | — |
| `e_dogwood_1` | 4×8 | 24 | 24 | 0 | — |
| `e_easternredbud_1` | 4×8 | 24 | 24 | 0 | — |
| `e_exterior_1` | 8×8 | 3 | 0 | 0 | — |
| `e_exterior_snow_1` | 2×1 | 2 | 2 | 0 | — |
| `e_newgrass_1` | 8×15 | 92 | 92 | 30 | Cerca-viva Baixa |
| `e_newgrassbase_1` | 8×10 | 48 | 0 | 0 | — |
| `e_newgrassbase_snow_1` | 8×4 | 16 | 16 | 0 | — |
| `e_newsnow_ground_1` | 8×6 | 48 | 48 | 48 | CustomName |
| `e_redmaple_1` | 4×8 | 24 | 24 | 0 | — |
| `e_riverbirch_1` | 4×8 | 24 | 24 | 0 | — |
| `e_roof_snow_1` | 8×19 | 148 | 142 | 0 | — |
| `e_roof_snow_30_01` | 8×17 | 93 | 93 | 0 | — |
| `e_virginiapine_1` | 4×8 | 9 | 9 | 0 | — |
| `e_yellowwood_1` | 4×8 | 24 | 24 | 0 | — |
| `electricity_pylon` | 8×23 | 182 | 180 | 0 | — |
| `f_bushes_1` | 16×8 | 126 | 126 | 32 | Cerca-viva Baixa |
| `f_bushes_2` | 10×8 | 24 | 24 | 20 | Cerca-viva Alta; Canto de Cerca-viva Alta; Cerca-viva Baixa; Canto de Cerca-viva Baixa |
| `f_flowerbed_1` | 12×4 | 23 | 23 | 0 | — |
| `f_wallvines_1` | 6×12 | 72 | 72 | 0 | — |
| `farm_01` | 8×13 | 88 | 88 | 0 | — |
| `fencing_01` | 8×16 | 98 | 94 | 12 | Fence Post; Barricade Military Barrier; Barreira Militar Vazia |
| `fencing_burnt_01` | 8×16 | 58 | 58 | 2 | Fence Post |
| `fencing_damaged_01` | 8×24 | 166 | 166 | 0 | — |
| `fencing_damaged_02` | 8×32 | 163 | 163 | 0 | — |
| `fencing_damaged_03` | 8×24 | 116 | 116 | 0 | — |
| `fencing_damaged_04` | 8×32 | 168 | 168 | 0 | — |
| `fencing_damaged_05` | 8×32 | 164 | 164 | 0 | — |
| `fencing_damaged_06` | 8×32 | 165 | 165 | 0 | — |
| `fixtures_01` | 8×8 | 64 | 0 | 0 | — |
| `fixtures_bathroom_01` | 8×10 | 65 | 65 | 34 | Vaso Sanitário Branco; Vaso Sanitário Baixo; Mictório Branco; Dispensador de Papel-toalha |
| `fixtures_bathroom_02` | 8×8 | 30 | 30 | 8 | Banheiro Químico; Vaso Sanitário de Madeira |
| `fixtures_counters_01` | 8×28 | 200 | 200 | 144 | Balcão de Canto de Mogno; Balcão de Mogno; Balcão de Canto de Madeira Bruta; Balcão de Madeira Bruta |
| `fixtures_doors_01` | 8×16 | 88 | 88 | 80 | Porta; White Window Door |
| `fixtures_doors_02` | 8×16 | 52 | 52 | 52 | Porta |
| `fixtures_doors_fences_01` | 8×20 | 134 | 134 | 36 | Portão de Cerca |
| `fixtures_doors_frames_01` | 8×8 | 26 | 26 | 0 | — |
| `fixtures_escalators_01` | 8×8 | 45 | 45 | 4 | Catraca de Metal |
| `fixtures_fireplaces_01` | 8×10 | 64 | 64 | 6 | Fireplace |
| `fixtures_overlay_counters_01` | 8×16 | 128 | 64 | 0 | — |
| `fixtures_railings_01` | 8×18 | 126 | 126 | 0 | — |
| `fixtures_sinks_01` | 8×8 | 36 | 36 | 34 | Pia Branca; Pia Industrial de Porcelana; Pia Cromada; Pia de Coluna Branca |
| `fixtures_stairs_01` | 8×16 | 60 | 60 | 0 | — |
| `fixtures_windows_01` | 8×10 | 78 | 78 | 48 | Janela de Madeira; Janela; Janela Branca com Azulejos; Janela com Azulejos |
| `fixtures_windows_church` | 8×16 | 96 | 96 | 96 | Vitral de Igreja |
| `fixtures_windows_curtains_01` | 8×16 | 97 | 97 | 96 | Cortina; Cortina Longa Bege; Cortina Longa Branca; Cortina Azul |
| `fixtures_windows_curtains_01_on` | 8×16 | 0 | 0 | 0 | — |
| `fixtures_windows_curtains_02` | 8×8 | 32 | 32 | 32 | Cortina; Cortina Pequena Branca; Cortina Pequena Verde; Cortina Pequena Bordô |
| `fixtures_windows_detailing_01` | 8×8 | 21 | 21 | 0 | — |
| `fixtures_windows_detailing_02` | 8×8 | 20 | 0 | 0 | — |
| `fixtures_windows_metal` | 8×16 | 101 | 101 | 100 | Janela de Metal |
| `fixtures_windows_white` | 8×16 | 101 | 101 | 100 | Janela Branca |
| `fixtures_windows_wood` | 8×16 | 102 | 102 | 100 | Janela de Madeira; Janela Branca |
| `floor_carpet_motif` | 8×16 | 16 | 16 | 16 | Carpete Vermelho |
| `floors_burnt_01` | 8×8 | 29 | 29 | 0 | — |
| `floors_exterior_natural_01` | 8×8 | 35 | 35 | 0 | — |
| `floors_exterior_street_01` | 8×8 | 31 | 31 | 0 | — |
| `floors_exterior_tilesandstone_01` | 8×20 | 81 | 81 | 0 | — |
| `floors_interior_carpet_01` | 8×8 | 33 | 33 | 32 | Carpete Azul; Carpete Roxo; Carpete Cinza-escuro; Carpete Marrom |
| `floors_interior_tilesandwood_01` | 8×16 | 73 | 73 | 56 | Azulejos Diagonais Cinza; Azulejos Diagonais Pretos; Azulejos Xadrez Azuis; Azulejos Xadrez Amarelos |
| `floors_overlay_street_01` | 8×9 | 64 | 0 | 0 | — |
| `floors_overlay_tiles_01` | 8×9 | 72 | 0 | 0 | — |
| `floors_overlay_tiles_02` | 8×9 | 16 | 0 | 0 | — |
| `floors_overlay_wood_01` | 8×9 | 56 | 0 | 0 | — |
| `floors_rugs_01` | 8×20 | 129 | 129 | 129 | Tapete Verde-escuro; Tapete Roxo-escuro; Tapete Bordô; Tapete Xadrez Laranja |
| `floors_rugs_02` | 8×16 | 8 | 8 | 8 | Carpete Felpudo Branco; Carpete Felpudo Preto; Carpete Felpudo Bege; Carpete Felpudo Branco e Marrom |
| `food_01` | 8×16 | 108 | 108 | 0 | — |
| `food_02` | 8×16 | 96 | 96 | 0 | — |
| `foraging_01` | 8×8 | 18 | 18 | 0 | — |
| `furniture_bedding_01` | 8×16 | 96 | 96 | 96 | Cama de Solteiro com Estrutura Preta; Cama de Casal com Estrutura Preta; Cama de Solteiro Azul; Cama de Casal de Mogno |
| `furniture_seating_indoor_01` | 8×8 | 64 | 64 | 64 | Sofá Laranja; Poltrona Verde; Poltrona Quadrada Laranja; Sofá Verde |
| `furniture_seating_indoor_02` | 8×8 | 64 | 64 | 64 | Cadeira de Mogno; Cadeira de Carvalho Vermelho; Cadeira de Madeira Vermelha; Cadeira de Plástico Azul |
| `furniture_seating_indoor_03` | 8×30 | 150 | 150 | 150 | Banco de Bordo sem Encosto; Poltrona Cinza; Sofá Cinza; Sofá Amarelo |
| `furniture_seating_outdoor_01` | 8×8 | 36 | 36 | 36 | Banco ao Ar Livre; Banco Externo Elegante; Cadeira de Plástico; Banco de Carvalho sem Encosto |
| `furniture_shelving_01` | 8×8 | 60 | 60 | 60 | Prateleiras de Canto para Parede em Madeira Nobre; Prateleiras de Parede de Mogno; Prateleiras Grandes de Canto para Parede; Prateleiras Grandes de Parede |
| `furniture_storage_01` | 8×16 | 72 | 72 | 68 | Guarda-roupa Branco; Cômoda Branca; Cômoda de Mogno; Guarda-roupa de Mogno |
| `furniture_storage_01_on` | 8×16 | 4 | 4 | 0 | — |
| `furniture_storage_02` | 8×8 | 48 | 48 | 48 | Armário de Metal; Armário de Parede Azul; Armário de Parede Verde; Armário de Parede Amarelo |
| `furniture_tables_high_01` | 8×8 | 64 | 64 | 64 | Mesa Robusta de Carvalho Vermelho; Mesa Estreita de Mogno; Mesa Redonda de Carvalho Vermelho; Mesa Redonda de Bordo |
| `furniture_tables_high_02` | 8×8 | 39 | 39 | 38 | Mesa Comprida de Carvalho Escuro; Mesa Escura; Mesa Marrom Comprida; Mesa de Metal Comprida |
| `furniture_tables_low_01` | 8×8 | 22 | 22 | 22 | Mesa Baixa Estreita de Carvalho Vermelho; Mesa Baixa de Mogno; Mesa Baixa Estreita de Mogno; Mesa Baixa Elegante de Vidro |
| `industry_01` | 8×12 | 64 | 64 | 6 | Ar-condicionado; Barril Laranja |
| `industry_02` | 8×46 | 331 | 331 | 0 | — |
| `industry_03` | 8×16 | 117 | 117 | 40 | Extintor; Cilindro de Oxigênio em Carrinho de Carga; Extintor em Carrinho de Carga; Carrinho de Carga Vazio |
| `industry_04` | 8×16 | 20 | 20 | 8 | Duplicadora de Chaves; Esmeril de Bancada |
| `industry_bunker_01` | 8×10 | 24 | 24 | 0 | — |
| `industry_railroad_01` | 8×8 | 61 | 61 | 0 | — |
| `industry_railroad_02` | 8×8 | 47 | 47 | 0 | — |
| `industry_railroad_03` | 8×8 | 54 | 54 | 0 | — |
| `industry_railroad_04` | 8×8 | 41 | 41 | 0 | — |
| `industry_railroad_05` | 8×8 | 61 | 61 | 8 | Escada de Madeira; Escada de Aço; Sinal de Trem |
| `industry_trucks_01` | 8×10 | 65 | 65 | 0 | — |
| `industry_trucks_02` | 8×10 | 16 | 16 | 0 | — |
| `invisible_01` | 8×8 | 1 | 1 | 0 | — |
| `lighting_indoor_01` | 8×8 | 45 | 45 | 45 | Interruptor; Luminária Listrada; Luminária Cinza; Luminária Vermelha |
| `lighting_indoor_01_on` | 8×8 | 41 | 41 | 24 | Luminária Listrada; Luminária Cinza; Luminária Vermelha; Luminária Azul |
| `lighting_indoor_02` | 8×16 | 84 | 84 | 84 | Luminária Cinza; Luminária Vermelha; Luminária Preta; Luminária Amarela |
| `lighting_indoor_02_on` | 8×16 | 84 | 84 | 0 | — |
| `lighting_indoor_03` | 8×16 | 18 | 18 | 18 | Lustre Cinza; Luminária Cinza; Luminária Vermelha; Luminária Preta |
| `lighting_indoor_03_on` | 8×16 | 17 | 17 | 0 | — |
| `lighting_outdoor_01` | 8×16 | 80 | 80 | 28 | Luminária Externa Redonda; Luminária de Parede Antiga; Luminária Externa Moderna; Luminária Externa Elegante |
| `lighting_outdoor_01_on` | 8×16 | 51 | 51 | 0 | — |
| `location_barn_01` | 8×8 | 47 | 47 | 0 | — |
| `location_business_bank_01` | 8×16 | 75 | 75 | 38 | Balcão de Banco de Carvalho; Balcão de Banco; Cofre de Parede; Cofre Vertical |
| `location_business_distillery_01` | 8×16 | 23 | 23 | 10 | Distillery |
| `location_business_machinery_01` | 8×8 | 50 | 49 | 31 | Bancada de Trabalho com Tampo de Madeira; Painel Perfurado de Madeira; Armário de Ferramentas Móvel Vermelho; 2 Pneus Empilhados |
| `location_business_office_generic_01` | 8×29 | 190 | 190 | 184 | Mesa de Escritório de Carvalho Vermelho; Quadro de Cortiça; Armário de Arquivo Cinza; Cubículo Cinza Esquerdo |
| `location_business_office_generic_02` | 8×16 | 24 | 24 | 24 | Telefone de Disco Bege; Telefone de Disco Preto; Telefone de Disco Vermelho; Telefone de Disco Branco |
| `location_community_cemetary_01` | 8×10 | 40 | 40 | 40 | Lápide Redonda; Lápide Arqueada; Lápide Quadrada; Lápide Antiga |
| `location_community_church_small_01` | 8×34 | 258 | 258 | 88 | Altar Ornamentado; Atril; Banco de Igreja; Placa Sinistra |
| `location_community_church_small_01_on` | 8×16 | 2 | 2 | 0 | — |
| `location_community_medical_01` | 8×32 | 227 | 226 | 143 | Maca de Exame; Balança; Banqueta de Metal com Rodinhas; Pôster de Órgãos |
| `location_community_medical_01_on` | 8×16 | 6 | 6 | 0 | — |
| `location_community_park_01` | 8×10 | 54 | 47 | 26 | Playground Swingset; Escorregador de Parquinho; Carrossel; Castelo de Brinquedo |
| `location_community_police_01` | 8×16 | 101 | 101 | 53 | Placa da Polícia; Cama de Prisioneiro; Mesa Suspensa; Placa de Alerta sobre Detentos em Fuga |
| `location_community_police_01_on` | 8×16 | 15 | 15 | 0 | — |
| `location_community_school_01` | 8×16 | 80 | 80 | 56 | Banco Escolar Escuro; Banco Escolar de Bordo; Quadro-negro; Mapa dos Estados Unidos |
| `location_community_school_02` | 8×16 | 48 | 48 | 0 | — |
| `location_community_school_overlays` | 8×16 | 42 | 42 | 42 | Avisos Aleatórios |
| `location_community_school_overlays_black` | 8×16 | 42 | 42 | 42 | Avisos Aleatórios |
| `location_entertainment_gallery_01` | 8×16 | 125 | 124 | 124 | Quadro Grande; Quadro Grande 2; Quadro Alto; Quadro Largo |
| `location_entertainment_gallery_02` | 8×16 | 71 | 71 | 54 | location_entertainment_gallery_02_3 x; location_entertainment_gallery_02_11 x; location_entertainment_gallery_02_18 x; location_entertainment_gallery_02_30 x |
| `location_entertainment_theatre_01` | 8×36 | 266 | 266 | 188 | Cadeiras Azuis Interligadas; Balcão Expositor de Vidro Laranja; Balcão de Canto Listrado Azul; Balcão Listrado Azul |
| `location_entertainment_theatre_01_on` | 8×36 | 163 | 163 | 0 | — |
| `location_farm_accesories_01` | 8×26 | 122 | 114 | 30 | Cocho; Casinha de Cachorro; Bloco de Sal; Cocho Pequeno para Animais |
| `location_hospitality_sunstarmotel_01` | 8×9 | 60 | 60 | 2 | Piso Liso Esbranquiçado; Azulejos Amarelos Pequenos |
| `location_hospitality_sunstarmotel_02` | 8×8 | 56 | 56 | 31 | Placa Sunstar Motel; Placa Há Vagas; Balcão Branco; Piso Liso Esbranquiçado |
| `location_hospitality_sunstarmotel_02_on` | 8×8 | 6 | 6 | 0 | — |
| `location_military_generic_01` | 8×16 | 71 | 71 | 36 | Caixote Militar; Barril Verde-claro; Barril Verde-escuro; Placa de Propriedade do Exército |
| `location_military_knox_01` | 8×8 | 27 | 27 | 9 | Palete; Palete de Barras de Ouro; Bandeira dos Estados Unidos |
| `location_military_tent_01` | 8×16 | 104 | 104 | 16 | Cortina; Green Military Curtain; Tan Military Curtain |
| `location_restaurant_bar_01` | 8×18 | 106 | 105 | 73 | Balcão de Canto de Mogno; Balcão de Mogno; Assento de Bar de Couro; Balcão de Canto de Bar Escuro |
| `location_restaurant_bar_01_on` | 8×12 | 2 | 2 | 0 | — |
| `location_restaurant_bar_smutz` | 8×10 | 32 | 32 | 22 | Quadro Dr. Oids; Alvo de Dardos; Toldo Verde; Bar |
| `location_restaurant_diner_01` | 8×8 | 57 | 57 | 31 | Mesa Verde Antiga com Suporte de Metal; Balcão de Canto com Tampo Verde Estampado; Balcão com Tampo Verde Estampado; Assento Vermelho Antigo |
| `location_restaurant_diner_01_on` | 8×8 | 11 | 11 | 0 | — |
| `location_restaurant_generic_01` | 8×8 | 54 | 54 | 52 | Mesa de Piquenique Marrom; Mesa de Piquenique Azul; Balcão de Alimentos da Cantina; Balcão Esquerdo |
| `location_restaurant_pie_01` | 8×8 | 41 | 41 | 33 | Toldo Rosa; Azulejos Xadrez Marrons; Quadro-negro de Ofertas Especiais; Expositor de Vidro |
| `location_restaurant_pileocrepe_01` | 8×8 | 59 | 59 | 21 | Toldo Azul; Azulejos Claros de Acácia; Assento de Bordo Azul; Mesa de Bordo |
| `location_restaurant_pileocrepe_01_on` | 8×8 | 10 | 10 | 0 | — |
| `location_restaurant_pizzawhirled_01` | 8×16 | 78 | 78 | 35 | Azulejos Vermelhos; Lixeira; Balcão de Canto Azulejado Vermelho e Branco; Balcão Azulejado Vermelho e Branco |
| `location_restaurant_pizzawhirled_01_on` | 8×16 | 22 | 22 | 0 | — |
| `location_restaurant_seahorse_01` | 8×16 | 76 | 76 | 34 | Lixeira; Balcão de Canto Escuro de Cafeteria; Balcão Escuro de Cafeteria; Placa de Cardápio Seahorse Coffee |
| `location_restaurant_spiffos_01` | 8×10 | 80 | 80 | 11 | Lixeira Alta Vermelha; Azulejos Diagonais Verdes; Balcão de Canto Laranja com Listras Verdes; Balcão Laranja com Listras Verdes |
| `location_restaurant_spiffos_02` | 8×8 | 62 | 62 | 40 | Placa com o Logo do Spiffo's; Assento Laranja e Vermelho; Cadeira Laranja com Suporte de Metal; Mesa Dupla Laranja com Suporte de Metal |
| `location_restaurant_spiffos_02_on` | 8×8 | 24 | 24 | 0 | — |
| `location_restaurant_spiffos_03` | 8×8 | 45 | 44 | 30 | Spiffo na Parede; The Glorious Spiffo; Spiffo Grande de Parede; Balcão Suspenso de Hambúrguer |
| `location_restaurant_spiffos_03_on` | 8×8 | 12 | 12 | 0 | — |
| `location_services_beauty_01` | 8×10 | 12 | 12 | 12 | Cadeira de Salão; Poste de Barbeiro; Secador de Cabelo de Salão |
| `location_sewer_01` | 8×8 | 47 | 47 | 4 | Escadas de Acesso ao Esgoto |
| `location_shop_accessories_01` | 8×8 | 32 | 32 | 26 | Caixa Registradora; Máquina de Refrigerante de Mesa; Dispensador de Loja; Máquina de Lanches |
| `location_shop_accessories_01_on` | 8×8 | 6 | 6 | 0 | — |
| `location_shop_accessories_genericsigns_01` | 8×16 | 85 | 85 | 66 | Placa Tattoo 42; Placa de Fianças Judiciais; Placa de Venda; Placa de Serviços Jurídicos |
| `location_shop_accessories_genericsigns_01_on` | 8×16 | 40 | 40 | 0 | — |
| `location_shop_bargNclothes_01` | 8×10 | 60 | 60 | 10 | Placa Barg-n-Clothes; Placa de Liquidação |
| `location_shop_bargNclothes_01_on` | 8×8 | 2 | 2 | 0 | — |
| `location_shop_fossoil_01` | 8×16 | 109 | 109 | 34 | Máquina de Cachorro-quente; Balcão de Canto Pêssego com Tampo Azul; Balcão Pêssego com Tampo Azul; Placa Fossoil |
| `location_shop_fossoil_01_on` | 8×16 | 12 | 10 | 0 | — |
| `location_shop_gas2go_01` | 8×12 | 96 | 96 | 12 | Balcão de Canto Vermelho; Balcão Vermelho; Prateleiras Baixas Gas2Go; Placa Sem Combustível |
| `location_shop_gas2go_01_on` | 8×8 | 4 | 4 | 0 | — |
| `location_shop_generic_01` | 8×16 | 120 | 120 | 119 | Prateleiras de Loja de Quadrinhos; Prateleiras de Revistas Bege; Estante Expositora Bege; Balcão de Canto de Bordo |
| `location_shop_greenes_01` | 8×10 | 70 | 70 | 34 | Balcão Expositor Inclinado de Madeira; Expositor de Madeira Escalonado; Carpete Listrado Cinza-escuro Horizontal; Carpete Listrado Cinza-escuro Vertical |
| `location_shop_greenes_01_on` | 8×10 | 10 | 10 | 0 | — |
| `location_shop_mall_01` | 8×16 | 84 | 84 | 34 | Azulejos Pretos com Borda Branca Vertical; Azulejos Pretos com Borda Branca Horizontal; Azulejo de Shopping Cinza; Azulejos Esbranquiçados |
| `location_shop_mall_signs_01` | 8×18 | 130 | 130 | 128 | Placa Wok & Rolls; Placa Taco del Pancho; Placa Lola Limon; Placa Hugo Plush |
| `location_shop_mall_signs_01_on` | 8×18 | 78 | 78 | 0 | — |
| `location_shop_mall_signs_02` | 8×18 | 53 | 53 | 32 | Placa Optima Eyes; Placa Time 4 Sport; Placa Palm Travel; Placa Groovy Chic |
| `location_shop_mall_signs_02_on` | 8×18 | 43 | 43 | 0 | — |
| `location_shop_zippee_01` | 8×8 | 64 | 64 | 48 | Prateleiras de Parede Vermelhas e Brancas; Prateleiras Baixas de Parede Vermelhas e Brancas; Azulejos Lisos em Azul-claro; Azulejos Lisos em Laranja-claro |
| `location_shop_zippee_01_on` | 8×8 | 10 | 10 | 0 | — |
| `location_trailer_01` | 8×8 | 56 | 56 | 0 | — |
| `location_trailer_02` | 8×10 | 65 | 65 | 34 | Assento Grande Listrado; Banco Baixo de Madeira; Balcão com Geladeira Embutida; Mesa de Bordo com Suporte de Metal |
| `object_snow_overlay_01` | 8×32 | 227 | 227 | 0 | — |
| `object_snow_overlay_02` | 8×41 | 319 | 319 | 0 | — |
| `object_snow_overlay_03` | 8×40 | 247 | 247 | 0 | — |
| `object_snow_overlay_04` | 8×41 | 243 | 243 | 0 | — |
| `office_01` | 8×8 | 32 | 32 | 0 | — |
| `overlay_blood_fence_01` | 8×8 | 24 | 24 | 0 | — |
| `overlay_blood_floor_01` | 8×8 | 43 | 43 | 0 | — |
| `overlay_blood_wall_01` | 8×8 | 64 | 64 | 0 | — |
| `overlay_graffiti_wall_01` | 8×16 | 112 | 112 | 0 | — |
| `overlay_grime_floor_01` | 8×12 | 84 | 84 | 0 | — |
| `overlay_grime_wall_01` | 8×8 | 46 | 46 | 0 | — |
| `overlay_messages_wall_01` | 8×8 | 36 | 36 | 0 | — |
| `papernotices_01` | 8×8 | 10 | 10 | 10 | Cartazes de Procurados; Avisos Publicitários; Coleção de Avisos; Avisos de Papel |
| `preset_depthmaps_01` | 8×1 | 7 | 7 | 0 | — |
| `radio_tower` | 8×16 | 112 | 112 | 0 | — |
| `ramps_01` | 8×32 | 81 | 0 | 0 | — |
| `recreational_01` | 8×16 | 96 | 96 | 94 | Jukebox de Clássicos; Mesa de Sinuca; Suporte para Tacos de Sinuca; Piano de Faroeste |
| `recreational_01_on` | 8×16 | 17 | 17 | 0 | — |
| `recreational_sports_01` | 8×32 | 141 | 141 | 36 | Esteira; Colchonete de Ginástica; Banco de Musculação; Buraco de Golfe |
| `roofs_01` | 8×17 | 130 | 130 | 0 | — |
| `roofs_02` | 8×16 | 116 | 116 | 0 | — |
| `roofs_03` | 8×16 | 92 | 92 | 0 | — |
| `roofs_04` | 8×15 | 90 | 90 | 0 | — |
| `roofs_05` | 8×23 | 170 | 170 | 0 | — |
| `roofs_30_01` | 8×16 | 93 | 93 | 0 | — |
| `roofs_30_02` | 8×16 | 93 | 93 | 0 | — |
| `roofs_30_03` | 8×16 | 90 | 90 | 0 | — |
| `roofs_30_04` | 8×16 | 90 | 90 | 0 | — |
| `roofs_30_05` | 8×16 | 93 | 93 | 0 | — |
| `roofs_30_06` | 8×16 | 93 | 93 | 0 | — |
| `roofs_30_07` | 8×16 | 90 | 90 | 0 | — |
| `roofs_30_08` | 8×16 | 90 | 90 | 0 | — |
| `roofs_30_09` | 8×16 | 90 | 90 | 0 | — |
| `roofs_30_10` | 8×16 | 90 | 90 | 0 | — |
| `roofs_accents_01` | 8×10 | 55 | 55 | 0 | — |
| `roofs_accents_30_01` | 8×16 | 40 | 40 | 0 | — |
| `roofs_burnt_01` | 8×19 | 95 | 95 | 0 | — |
| `roofs_burnt_30_01` | 8×17 | 90 | 90 | 0 | — |
| `roofs_shallow_01` | 8×24 | 144 | 144 | 0 | — |
| `rooftop_furniture` | 8×16 | 51 | 51 | 40 | Ar-condicionado |
| `rugs_animals` | 8×16 | 103 | 103 | 102 | Pele de Veado Malhado; Pele de Ovelha; Pele de Vaca; Pele de Porco Landrace |
| `seating_01` | 8×8 | 64 | 0 | 0 | — |
| `security_01` | 8×10 | 6 | 6 | 6 | Estação de Monitoramento; Conjunto de Monitores |
| `signs_church` | 8×16 | 32 | 32 | 32 | Placa Sinistra |
| `signs_church_on` | 8×16 | 32 | 32 | 0 | — |
| `signs_miscbrands_01` | 8×16 | 113 | 113 | 16 | Placa Enigma Books; Placa Hair O Genesis; Placa The Drake; Placa Yummmers |
| `signs_miscbrands_01_on` | 8×16 | 112 | 79 | 0 | — |
| `signs_one-off_01` | 8×16 | 118 | 118 | 33 | Placa do Advogado H. Smith; Placa Pony Roam-o; Placa Dixie; Placa Twiggy's |
| `signs_one-off_01_on` | 8×16 | 31 | 31 | 0 | — |
| `signs_one-off_02` | 8×64 | 512 | 502 | 0 | — |
| `signs_one-off_02_on` | 8×64 | 106 | 106 | 0 | — |
| `signs_one-off_03` | 8×64 | 510 | 510 | 0 | — |
| `signs_one-off_03_on` | 8×64 | 168 | 168 | 0 | — |
| `signs_one-off_04` | 8×64 | 511 | 511 | 0 | — |
| `signs_one-off_04_on` | 8×64 | 78 | 78 | 0 | — |
| `signs_one-off_05` | 8×64 | 508 | 508 | 0 | — |
| `signs_one-off_05_on` | 8×64 | 157 | 157 | 0 | — |
| `signs_one-off_06` | 8×40 | 314 | 314 | 0 | — |
| `signs_one-off_06_on` | 8×40 | 60 | 60 | 0 | — |
| `signs_one-off_07` | 8×40 | 282 | 282 | 2 | Placa Sem Combustível |
| `signs_one-off_07_on` | 8×40 | 11 | 11 | 0 | — |
| `signs_one-off_08` | 8×45 | 351 | 351 | 2 | Wooden Sign |
| `signs_one-off_08_on` | 8×45 | 39 | 39 | 0 | — |
| `signs_one-off_09` | 8×64 | 314 | 314 | 19 | Placa Frescor a Semana Toda; Placa Melos Records; Placa da Escola de Música; Placa do Centro Comunitário de Rosewood |
| `signs_one-off_09_on` | 8×64 | 99 | 99 | 0 | — |
| `signs_one-off_lights_01` | 8×16 | 32 | 32 | 32 | Placa de Neon Pole Position; Placa de Neon Rosa Show Girls; Placa de Neon Rosa de Show ao Vivo; Placa de Neon Azul Show Girls |
| `signs_one-off_lights_01_on` | 8×16 | 29 | 29 | 0 | — |
| `stashes_01` | 8×16 | 14 | 14 | 0 | — |
| `steamboat` | 8×16 | 33 | 33 | 0 | — |
| `storage_01` | 8×10 | 80 | 0 | 0 | — |
| `street_curbs_01` | 8×10 | 57 | 56 | 0 | — |
| `street_curbs_01_blend_dark_grass` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_blend_dirt` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_blend_gravel` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_blend_light_grass` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_blend_medium_grass` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_blend_sand` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_blend_street` | 8×11 | 88 | 88 | 0 | — |
| `street_curbs_01_diag` | 8×10 | 73 | 73 | 0 | — |
| `street_curbs_01_diag_2` | 8×10 | 74 | 74 | 0 | — |
| `street_decoration_01` | 8×16 | 81 | 81 | 44 | Placa de Pare; Parquímetro; Caixa de Correio Pública; Hidrante |
| `street_roadsigns_01` | 8×10 | 37 | 37 | 20 | Placa de Área de Descanso; Placa de Muldraugh; Placa de West Point; Placa de Rosewood |
| `street_trafficlines_01` | 8×8 | 49 | 49 | 0 | — |
| `street_trafficlines_curb_white_faded` | 8×20 | 155 | 155 | 0 | — |
| `street_trafficlines_curb_white_full` | 8×20 | 155 | 155 | 0 | — |
| `street_trafficlines_curb_yellow_faded` | 8×20 | 155 | 155 | 0 | — |
| `street_trafficlines_curb_yellow_full` | 8×20 | 155 | 155 | 0 | — |
| `trash_01` | 8×8 | 51 | 51 | 51 | Lixo |
| `trash_walls_01` | 8×8 | 10 | 10 | 10 | Avisos Desgastados; Pôster Vermelho Rasgado; Pôster Arruinado; Foto Rasgada |
| `trash&junk_01` | 8×10 | 4 | 4 | 0 | — |
| `trashcontainers_01` | 8×8 | 29 | 29 | 28 | Lixeira com Rodas; Caçamba de Lixo Azul; Caçamba de Lixo Laranja; Lixeira de Reciclagem |
| `underground_01` | 8×20 | 6 | 6 | 0 | — |
| `vegetation_drying_01` | 8×30 | 148 | 148 | 24 | Varal Pequeno; Varal Grande; Varal Pequeno e Simples; Varal Simples Grande |
| `vegetation_drying_02` | 8×30 | 84 | 84 | 0 | — |
| `vegetation_farm_01` | 8×8 | 36 | 36 | 10 | Fardo de Feno Pequeno; Dois Fardos de Feno Empilhados; Piso de Feno |
| `vegetation_farming_01` | 8×20 | 133 | 133 | 0 | — |
| `vegetation_farming_01b` | 8×20 | 136 | 136 | 136 | Barley; Flax; Hemp; Hops |
| `vegetation_farming_02` | 8×20 | 120 | 120 | 72 | Habanero; Jalapeno; Leek; Lemongrass |
| `vegetation_farming_dead_01` | 8×20 | 133 | 133 | 0 | — |
| `vegetation_farming_dead_01b` | 8×20 | 136 | 136 | 0 | — |
| `vegetation_farming_dead_02` | 8×20 | 120 | 120 | 0 | — |
| `vegetation_farming_dying_01` | 8×20 | 133 | 133 | 0 | — |
| `vegetation_farming_dying_01b` | 8×20 | 136 | 136 | 0 | — |
| `vegetation_farming_dying_02` | 8×20 | 120 | 120 | 0 | — |
| `vegetation_farming_trampled_01` | 8×20 | 133 | 133 | 0 | — |
| `vegetation_farming_trampled_01b` | 8×20 | 136 | 136 | 0 | — |
| `vegetation_farming_trampled_02` | 8×20 | 120 | 120 | 0 | — |
| `vegetation_farming_unhealthy_01` | 8×20 | 133 | 133 | 0 | — |
| `vegetation_farming_unhealthy_01b` | 8×20 | 136 | 136 | 0 | — |
| `vegetation_farming_unhealthy_02` | 8×20 | 120 | 120 | 0 | — |
| `vegetation_foliage_01` | 8×8 | 13 | 13 | 13 | Arbusto |
| `vegetation_gardening_01` | 8×20 | 102 | 102 | 18 | Roses; Poppies; Lavender |
| `vegetation_gardening_dead_01` | 8×20 | 102 | 102 | 0 | — |
| `vegetation_gardening_dying_01` | 8×20 | 102 | 102 | 0 | — |
| `vegetation_gardening_trampled_01` | 8×20 | 19 | 19 | 0 | — |
| `vegetation_gardening_unhealthy_01` | 8×20 | 102 | 102 | 0 | — |
| `vegetation_groundcover_01` | 8×8 | 47 | 0 | 8 | Planta Marrom; Planta Verde; Planta Roxa; Planta Amarela Pequena |
| `vegetation_indoor_01` | 8×8 | 31 | 31 | 31 | Vaso de Amores-perfeitos; Bonsai; Vaso de Petúnias; Vaso com Cacto |
| `vegetation_ornamental_01` | 8×8 | 50 | 50 | 50 | Cerca-viva Alta; Canto de Cerca-viva Alta; Cerca-viva Baixa; Canto de Cerca-viva Baixa |
| `vegetation_trees_01` | 8×8 | 15 | 0 | 0 | — |
| `vegetation_wall_01` | 8×8 | 5 | 0 | 0 | — |
| `walls_burnt_01` | 8×8 | 16 | 16 | 0 | — |
| `walls_burnt_roofs_01` | 8×10 | 60 | 60 | 0 | — |
| `walls_commercial_01` | 8×16 | 105 | 105 | 4 | Dracena |
| `walls_commercial_02` | 8×11 | 84 | 84 | 0 | — |
| `walls_commercial_03` | 8×12 | 96 | 96 | 0 | — |
| `walls_decoration_01` | 8×24 | 166 | 166 | 166 | Espelho Largo; Espelho Grande; Espelho com Moldura de Madeira; Espelho Alto |
| `walls_decoration_01_on` | 8×24 | 12 | 12 | 0 | — |
| `walls_decoration_02` | 8×24 | 192 | 192 | 192 | Quadro |
| `walls_decoration_03` | 8×24 | 168 | 168 | 168 | Pôster Grande Cyberkiller 2; Pôster Cyberkiller 2; Cyberkiller 2 ; Pôster Largo Cyberkiller 2 |
| `walls_decoration_04` | 8×14 | 108 | 108 | 28 | Pôster Grande The Forgotten Element; Pôster The Forgotten Element; The Forgotten Element ; Pôster Largo The Forgotten Element |
| `walls_decoration_05` | 8×25 | 200 | 200 | 200 | Pôster |
| `walls_decoration_06` | 8×16 | 108 | 108 | 108 | Pôster |
| `walls_detailing_01` | 8×16 | 94 | 94 | 0 | — |
| `walls_detailing_02` | 8×16 | 90 | 90 | 0 | — |
| `walls_exterior_house_01` | 8×16 | 60 | 60 | 0 | — |
| `walls_exterior_house_02` | 8×16 | 104 | 104 | 0 | — |
| `walls_exterior_house_03` | 8×8 | 38 | 38 | 0 | — |
| `walls_exterior_house_04` | 8×16 | 80 | 80 | 0 | — |
| `walls_exterior_house_05` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_06` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_07` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_08` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_09` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_10` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_11` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_12` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_13` | 8×16 | 128 | 128 | 0 | — |
| `walls_exterior_house_low_01` | 8×18 | 132 | 132 | 0 | — |
| `walls_exterior_roofs_01` | 8×32 | 240 | 240 | 0 | — |
| `walls_exterior_roofs_02` | 8×32 | 128 | 128 | 0 | — |
| `walls_exterior_roofs_03` | 8×10 | 60 | 60 | 0 | — |
| `walls_exterior_roofs_04` | 8×10 | 60 | 60 | 0 | — |
| `walls_exterior_roofs_05` | 8×10 | 69 | 63 | 0 | — |
| `walls_exterior_roofs_06` | 8×8 | 60 | 60 | 0 | — |
| `walls_exterior_roofs_07` | 8×10 | 60 | 60 | 0 | — |
| `walls_exterior_roofs_08` | 8×10 | 60 | 60 | 0 | — |
| `walls_exterior_roofs_09` | 8×24 | 180 | 180 | 0 | — |
| `walls_exterior_roofs_10` | 8×32 | 240 | 240 | 0 | — |
| `walls_exterior_roofs_30_01` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_02` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_03` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_04` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_05` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_06` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_07` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_08` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_09` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_10` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_11` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_12` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_13` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_14` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_15` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_16` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_17` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_18` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_19` | 8×16 | 36 | 36 | 0 | — |
| `walls_exterior_roofs_30_20` | 8×16 | 72 | 72 | 0 | — |
| `walls_exterior_roofs_30_burnt_01` | 8×16 | 36 | 36 | 0 | — |
| `walls_exterior_wooden_01` | 8×10 | 73 | 73 | 73 | Generic Wall; Generic ; Generic Doorframe; Generic Windowframe |
| `walls_exterior_wooden_02` | 8×8 | 24 | 24 | 0 | — |
| `walls_garage_01` | 8×8 | 55 | 55 | 0 | — |
| `walls_garage_02` | 8×8 | 48 | 48 | 0 | — |
| `walls_house_blocks_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_blocks_01_MIRRORED` | 8×8 | 0 | 0 | 0 | — |
| `walls_house_blocks_LIGHT_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_blocks_LIGHT_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_brick_01` | 8×8 | 52 | 0 | 0 | — |
| `walls_house_brick_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_brick_LIGHT_01` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_brick_LIGHT_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_clapboard_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_clapboard_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_clapboard_LIGHT_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_clapboard_LIGHT_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_flatstone_01` | 8×8 | 32 | 0 | 0 | — |
| `walls_house_flatstone_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_smooth_01` | 8×8 | 48 | 0 | 0 | — |
| `walls_house_smooth_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_stone_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_stone_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_trailer_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_trailer_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_house_wood_01` | 8×8 | 40 | 0 | 0 | — |
| `walls_house_wood_01_MIRRORED` | 8×8 | 64 | 0 | 0 | — |
| `walls_interior_bathroom_01` | 8×16 | 104 | 104 | 0 | — |
| `walls_interior_cutaways_01` | 8×16 | 26 | 26 | 0 | — |
| `walls_interior_detailing_01` | 8×16 | 120 | 120 | 0 | — |
| `walls_interior_detailing_bathroom_01` | 8×32 | 192 | 192 | 0 | — |
| `walls_interior_detailing_bathroom_02` | 8×32 | 192 | 192 | 0 | — |
| `walls_interior_detailing_bathroom_03` | 8×32 | 192 | 192 | 0 | — |
| `walls_interior_house_01` | 8×16 | 120 | 120 | 0 | — |
| `walls_interior_house_02` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_03` | 8×8 | 64 | 64 | 0 | — |
| `walls_interior_house_04` | 8×16 | 96 | 96 | 0 | — |
| `walls_interior_house_05` | 8×17 | 112 | 112 | 0 | — |
| `walls_interior_house_06` | 8×18 | 144 | 144 | 0 | — |
| `walls_interior_house_07` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_08` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_09` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_10` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_11` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_12` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_13` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_14` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_15` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_16` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_17` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_18` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_19` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_20` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_21` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_22` | 8×16 | 64 | 64 | 0 | — |
| `walls_interior_house_23` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_24` | 8×16 | 96 | 96 | 0 | — |
| `walls_interior_house_25` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_26` | 8×16 | 128 | 128 | 0 | — |
| `walls_interior_house_27` | 8×18 | 104 | 104 | 0 | — |
| `walls_logs` | 8×16 | 93 | 93 | 20 | Porta; Log Gate |
| `walls_special_01` | 8×16 | 8 | 8 | 0 | — |
| `water_tank` | 8×23 | 38 | 38 | 0 | — |
| `weapons_01` | 8×8 | 32 | 32 | 0 | — |
| `z_templates_letterboard` | 4×1 | 0 | 0 | 0 | — |
| `z_templates_wallcutaways` | 10×8 | 10 | 10 | 0 | — |

### Tilesets: Melos Tiles For Miles

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `melos_tiles_advertising_01` | 8×32 | 23 | 23 | 22 | Schwarzenegger Exhibition Advertising; Petroville Get Filled Advertising |
| `melos_tiles_appliances_01` | 8×16 | 104 | 104 | 104 | Eggshell Oven; Sky Blue Oven; Wildberry Oven; Yellow Oven |
| `melos_tiles_appliances_02` | 8×16 | 49 | 49 | 16 | Melos Grey Television; Melos Grey Wallmounted Television; Melos Grey Stacked Television |
| `melos_tiles_appliances_03` | 8×16 | 16 | 16 | 16 | Beige Lazy Washing Machine; Black Washing Machine; Pink Washing Machine; Green Washing Machine |
| `melos_tiles_appliances_security_01` | 8×16 | 3 | 3 | 2 | Security Monitor |
| `melos_tiles_castle_01` | 8×16 | 92 | 92 | 16 | Melos Brown Wood Horizontal Beam; Melos Brown Wood Beam; Melos White Wood Horizontal Beam; Melos White Wood Beam |
| `melos_tiles_church_01` | 8×16 | 32 | 32 | 21 | Wooden Bell Frame; Iron Bell; Extended Church Base; Extended Church Shaft |
| `melos_tiles_construction_01` | 8×16 | 59 | 59 | 52 | Yellow Container Wall; Barreira de Concreto; Portable Concrete Road Block; Yellow Concrete Road Block |
| `melos_tiles_construction_02` | 8×16 | 30 | 30 | 0 | — |
| `melos_tiles_curtains_01` | 8×16 | 128 | 128 | 128 | Cortina; Victorian Green Double Curtain; Victorian Green Left Curtain; Victorian Green Right Curtain |
| `melos_tiles_curtains_02` | 8×16 | 128 | 128 | 128 | Cortina; Melos Red Long Curtain; Melos Red Short Curtain; Melos Orange Long Curtain |
| `melos_tiles_curtains_03` | 8×16 | 128 | 128 | 128 | Cortina; Melos Blue Long Curtain; Melos Blue Curtain; Melos Blue Dark Long Curtain |
| `melos_tiles_curtains_04` | 8×16 | 128 | 128 | 128 | Cortina; Melos White Long Curtain; Melos White Curtain; Melos Grey Light Long Curtain |
| `melos_tiles_curtains_05` | 8×16 | 128 | 128 | 128 | Cortina; Melos Dark Brown Long Curtain; Melos Dark Brown Curtain; Melos Brown Long Curtain |
| `melos_tiles_curtains_06` | 8×16 | 112 | 112 | 112 | Cortina; Melos Small Eggshell Curtain; Melos Small Light Green Curtain; Melos Small Bordeaux Curtain |
| `melos_tiles_curtains_random_01` | 8×16 | 80 | 80 | 80 | Construction Fence Light Blue Tarpaulin; Construction Fence White Tarpaulin; Construction Fence Dark Green Tarpaulin; Construction Fence Green Tarpaulin |
| `melos_tiles_detailing_exterior_01` | 8×16 | 101 | 101 | 0 | — |
| `melos_tiles_detailing_exterior_01a` | 8×16 | 29 | 29 | 0 | — |
| `melos_tiles_detailing_exterior_01b` | 8×16 | 37 | 37 | 8 | Long Dark Wood Beam; Short Dark Wood Beam |
| `melos_tiles_detailing_exterior_02` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_exterior_02a` | 8×16 | 16 | 16 | 0 | — |
| `melos_tiles_detailing_exterior_02b` | 8×16 | 32 | 32 | 0 | — |
| `melos_tiles_detailing_exterior_03` | 8×16 | 128 | 128 | 32 | Melos Brown Lattice Fence; Melos White Lattice Fence; Melos Mahagoni Lattice Fence; Melos Hazelnut Lattice Fence |
| `melos_tiles_detailing_exterior_03_no_collision_01` | 8×16 | 68 | 68 | 0 | — |
| `melos_tiles_detailing_exterior_03a` | 8×16 | 32 | 32 | 8 | Melos Grey Lattice Fence; Melos Black Lattice Fence |
| `melos_tiles_detailing_exterior_04` | 8×16 | 95 | 95 | 5 | Melos Junk Stash; Melos Firewood Stash |
| `melos_tiles_detailing_exterior_04_no_collision_01` | 8×16 | 90 | 90 | 0 | — |
| `melos_tiles_detailing_exterior_04_no_collision_02` | 8×16 | 48 | 48 | 0 | — |
| `melos_tiles_detailing_exterior_04a` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_exterior_04b` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_exterior_05` | 8×16 | 48 | 48 | 0 | — |
| `melos_tiles_detailing_exterior_06` | 8×16 | 16 | 15 | 15 | Melos Brick Chimney; Melos Grey Industry Chimney; Melos Small Grey Industry Chimney; Melos Brown Stone Chimney |
| `melos_tiles_detailing_interior_01` | 8×16 | 39 | 39 | 0 | — |
| `melos_tiles_detailing_interior_02` | 8×16 | 88 | 88 | 0 | — |
| `melos_tiles_detailing_interior_02a` | 8×16 | 88 | 88 | 0 | — |
| `melos_tiles_detailing_interior_02b` | 8×16 | 88 | 88 | 0 | — |
| `melos_tiles_detailing_interior_03` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_interior_03a` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_interior_03b` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_interior_03c` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_interior_03d` | 8×16 | 96 | 96 | 0 | — |
| `melos_tiles_detailing_interior_04` | 8×16 | 30 | 30 | 0 | — |
| `melos_tiles_doorframes_01` | 8×16 | 52 | 52 | 0 | — |
| `melos_tiles_doors_01` | 8×16 | 128 | 128 | 128 | Melos Green Glass Door 1; Melos Green Glass Door 1or; Melos Red Back Door 1; Melos Green Back Door 1 |
| `melos_tiles_doors_02` | 8×16 | 104 | 104 | 104 | Porta |
| `melos_tiles_doors_02a` | 8×16 | 64 | 64 | 64 | Porta |
| `melos_tiles_doors_03` | 8×16 | 120 | 120 | 120 | Double Door |
| `melos_tiles_doors_04` | 8×16 | 98 | 98 | 96 | Porta |
| `melos_tiles_doors_04a` | 8×16 | 116 | 116 | 116 | Porta; Double Door |
| `melos_tiles_doors_05` | 8×16 | 88 | 88 | 88 | Double Door |
| `melos_tiles_doors_05a` | 8×16 | 25 | 25 | 24 | Double Door; Dark Green Sliding Double Door; Eggshell Sliding Double Door |
| `melos_tiles_doors_05b` | 8×16 | 9 | 9 | 8 | Eggshell Sliding Glass Double Door |
| `melos_tiles_doors_06` | 8×16 | 120 | 120 | 120 | Double Door; Porta |
| `melos_tiles_doors_06a` | 8×16 | 120 | 120 | 120 | Double Door; Porta |
| `melos_tiles_doors_locked_01` | 8×16 | 112 | 112 | 112 | Porta |
| `melos_tiles_doors_locked_01a` | 8×16 | 41 | 41 | 40 | Double Door |
| `melos_tiles_doors_locked_01b` | 8×16 | 116 | 116 | 116 | Porta; Double Door |
| `melos_tiles_doors_special_01` | 8×16 | 84 | 84 | 84 | Porta; Broken Glass Double Door |
| `melos_tiles_fencing_01` | 8×16 | 80 | 80 | 80 | White Metal Fence; White Metal Fence Gate; Green Metal Fence; Green Metal Fence Gate |
| `melos_tiles_fencing_02` | 8×16 | 89 | 89 | 57 | Melos Low Wood Fence White; Melos Low Wood Fence Brown; White High Country Fence; Melos Hard Fence Gate |
| `melos_tiles_fencing_03` | 8×16 | 58 | 56 | 58 | Extended Low Brown Wood Fence; Extended Low Brown Wood Fence Post; Extended Low Blue Wood Fence; Extended Low Blue Wood Fence Post |
| `melos_tiles_fencing_04` | 8×16 | 108 | 108 | 104 | Large Wood Brown Fence; Large Wood Brown Fence Post; Large Wood Brown Fence Double Door; Large Wood Brown Fence Gate |
| `melos_tiles_fencing_05` | 8×16 | 32 | 32 | 32 | Brown High Garden Fence; Brown Low Garden Fence; Purple High Garden Fence; Purple Low Garden Fence |
| `melos_tiles_fencing_06` | 8×16 | 10 | 10 | 9 | Fancy White Concrete Fence; Fancy White Concrete Block; Fancy White Concrete Type2 Fence |
| `melos_tiles_fireplaces_chimneys_01` | 8×16 | 128 | 128 | 128 | Triple Metal Pipe Chimney; Triple Brick Pipe Chimney; Triple Clay Pipe Chimney; Triple Dark Clay Pipe Chimney |
| `melos_tiles_flags_stalker_01` | 8×16 | 78 | 78 | 78 | Stalker Faction DUTY Pole Flag; Stalker Faction CLEAR SKY Pole Flag; Stalker Faction MONOLITH Pole Flag; Stalker Faction FREEDOM Pole Flag |
| `melos_tiles_flags_stalker_01_alt` | 8×16 | 78 | 78 | 78 | Stalker Faction DUTY Alternative Pole Flag; Stalker Faction CLEAR SKY Alternative Pole Flag; Stalker Faction MONOLITH Alternative Pole Flag; Stalker Faction FREEDOM Alternative Pole Flag |
| `melos_tiles_flags_stalker_01_dirty` | 8×16 | 78 | 78 | 78 | Stalker Faction DUTY Dirty Pole Flag; Stalker Faction CLEAR SKY Dirty Pole Flag; Stalker Faction MONOLITH Dirty Pole Flag; Stalker Faction FREEDOM Dirty Pole Flag |
| `melos_tiles_floors_01` | 8×16 | 120 | 120 | 120 | Floor Tile |
| `melos_tiles_floors_02` | 8×16 | 69 | 69 | 69 | Floor Tile |
| `melos_tiles_floors_natural_01` | 8×16 | 50 | 50 | 0 | — |
| `melos_tiles_floors_overlays_01` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_floors_overlays_02` | 8×16 | 11 | 11 | 0 | — |
| `melos_tiles_furniture_bathroom_01` | 8×16 | 121 | 121 | 120 | New White Toilet; New White Modern Hanging Sink; New White Hanging Toilet; New White Shower |
| `melos_tiles_furniture_bathroom_02` | 8×16 | 121 | 121 | 120 | New Red Toilet; New Red Modern Hanging Sink; New Red Hanging Toilet; New Red Shower |
| `melos_tiles_furniture_bathroom_03` | 8×16 | 121 | 121 | 120 | New Purple Toilet; New Purple Modern Hanging Sink; New Purple Hanging Toilet; New Purple Shower |
| `melos_tiles_furniture_bathroom_04` | 8×16 | 121 | 121 | 120 | New Orange Toilet; New Orange Modern Hanging Sink; New Orange Hanging Toilet; New Orange Shower |
| `melos_tiles_furniture_bedding_01` | 8×16 | 128 | 128 | 128 | White Wood Single Bed; White Wood Massive Bed; Single Simple Smaragd Bed; Smaragd Antqiue Bed |
| `melos_tiles_furniture_bedding_02` | 8×16 | 120 | 120 | 120 | Simple Brown & Blue Bed; Single Simple Brown & Blue Bed; Simple Brown & Red Bed; Single Simple Brown & Red Bed |
| `melos_tiles_furniture_bedding_02a` | 8×16 | 120 | 120 | 120 | Simple Yellow & Red Bed; Single Simple Yellow & Red Bed; Simple Yellow & Sand Bed; Single Simple Yellow & Sand Bed |
| `melos_tiles_furniture_bedding_03` | 8×16 | 128 | 128 | 128 | Blue Comfy Bed; Blue Comfy Store Bed; Red Comfy Bed; Red Comfy Store Bed |
| `melos_tiles_furniture_bedding_03a` | 8×16 | 128 | 128 | 128 | Modern Blue Comfy Bed; Modern Blue Comfy Store Bed; Modern Red Comfy Bed; Modern Red Comfy Store Bed |
| `melos_tiles_furniture_bedding_03b` | 8×16 | 128 | 128 | 128 | Modern Black and White Bed; Modern Black and Grey Bed; Modern Black and Black Bed; Modern Black and Red Bed |
| `melos_tiles_furniture_bedding_03c` | 8×16 | 128 | 128 | 128 | Modern Wood and White Bed; Modern Wood and Grey Bed; Modern Wood and Blue Bed; Modern Wood and Red Bed |
| `melos_tiles_furniture_bedding_03d` | 8×16 | 128 | 128 | 128 | Modern Yellow and White Bed; Modern Green and Grey Bed; Modern Turquois Dream Bed; Modern Red Love Bed |
| `melos_tiles_furniture_bedding_04` | 8×16 | 76 | 76 | 76 | Grey & White Bunk Bed; Grey & White Loft Bed; Grey Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04a` | 8×16 | 76 | 76 | 76 | Mahagoni & White Bunk Bed; Mahagoni & White Loft Bed; Mahagoni Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04b` | 8×16 | 76 | 76 | 76 | White & White Bunk Bed; White & White Loft Bed; White Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04c` | 8×16 | 76 | 76 | 76 | Yellow & White Bunk Bed; Yellow & White Loft Bed; Yellow Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04d` | 8×16 | 76 | 76 | 76 | Brown & White Bunk Bed; Brown & White Loft Bed; Brown Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04e` | 8×16 | 76 | 76 | 76 | Black & White Bunk Bed; Black & White Loft Bed; Black Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04f` | 8×16 | 76 | 76 | 76 | Blue & White Bunk Bed; Blue & White Loft Bed; Blue Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_bedding_04g` | 8×16 | 76 | 76 | 76 | Red & White Bunk Bed; Red & White Loft Bed; Red Frame for Loft Bed; Shadow for Loft Bed |
| `melos_tiles_furniture_buffet_01` | 8×16 | 128 | 128 | 128 | Grey Buffet; Grey Buffet Shelve; Green Buffet; Green Buffet Shelve |
| `melos_tiles_furniture_counters_01` | 8×16 | 128 | 128 | 128 | Mahagoni Granite Corner Counter; Mahagoni Granite Counter; Mahagoni Hanger Corner Cabinet; Mahagoni Hanger Cabinet |
| `melos_tiles_furniture_counters_02` | 8×16 | 16 | 16 | 16 | Black Granite Corner Counter; Black Granite Counter; Black Granite Hanger Corner Cabinet; Black Granite Hanger Cabinet |
| `melos_tiles_furniture_counters_03` | 8×16 | 128 | 128 | 128 | Trailer RMX Vanilla Counter; Trailer RMX Vanilla Cabinet; Trailer RMX RB Counter; Trailer RMX RB Cabinet |
| `melos_tiles_furniture_counters_03a` | 8×16 | 36 | 36 | 32 | Trailer RMX WG Counter; Trailer RMX WG Cabinet; Trailer RMX BO Counter; Trailer RMX BO Cabinet |
| `melos_tiles_furniture_counters_04` | 8×16 | 51 | 51 | 44 | Pie Store Corner Alt1 Counter; Pie Store Corner Alt2 Counter; Pie Store Corner Green Counter; Pie Store Corner Green Alt1 Counter |
| `melos_tiles_furniture_counters_05` | 8×16 | 9 | 9 | 8 | Wall Mounted Wood Counter Top |
| `melos_tiles_furniture_random_01` | 8×16 | 112 | 112 | 112 | Black File Triple Cabinet; White File Triple Cabinet; Black Coat Hanger; Yellow Coat Hanger |
| `melos_tiles_furniture_random_02` | 8×16 | 61 | 61 | 56 | Brown Medicine Cabinet; White Medicine Cabinet; Low China Cabinet; Brown Newspaper Holder |
| `melos_tiles_furniture_random_03` | 8×16 | 48 | 48 | 48 | Vintage Large Wardrobe; Vintage Sidetable; Vintage Tall Sidetable; Mahagoni Vintage Large Wardrobe |
| `melos_tiles_furniture_random_shop_01` | 8×16 | 25 | 25 | 24 | Large Bread Display Shelf; Blue Cigarette Shop Shelf; Red Cigarette Shop Shelf; Grey Van Recolor Shelf |
| `melos_tiles_furniture_seating_01` | 8×16 | 100 | 100 | 100 | Yellow Striped Chair; Blue Striped Chair; Green Striped Chair; Red Striped Chair |
| `melos_tiles_furniture_seating_01a` | 8×16 | 56 | 56 | 56 | Modern Blue Plastic Chair; Modern Turquoise Plastic Chair; Modern Green Plastic Chair; Modern Yellow Plastic Chair |
| `melos_tiles_furniture_seating_02` | 8×16 | 118 | 118 | 118 | Black Leather Couch; Milk Leather Chair; Black Leather Chair; Milk Leather Couch |
| `melos_tiles_furniture_seating_02a` | 8×16 | 108 | 108 | 108 | Green Leather Couch; Sand Leather Chair; Green Leather Chair; Sand Leather Couch |
| `melos_tiles_furniture_seating_03` | 8×16 | 52 | 52 | 52 | Yellow Flowers Couch; Blue Flowers Chair; Yellow Flowers Chair; Blue Flowers Couch |
| `melos_tiles_furniture_seating_04` | 8×16 | 64 | 64 | 64 | Red Park Bench; Green Park Bench; Blue Park Bench; White Park Bench |
| `melos_tiles_furniture_storage_01` | 8×16 | 72 | 72 | 72 | Yellow Dresser; Red Dresser; Green Dresser; Ocean Dresser |
| `melos_tiles_furniture_storage_02` | 8×32 | 248 | 248 | 248 | Smaragd Corner Counter; Smaragd Counter; Smaragd Wardrobe; Smaragd Low Table |
| `melos_tiles_furniture_storage_02a` | 8×32 | 248 | 248 | 248 | Red Corner Counter; Red Counter; Red Wardrobe; Red Low Table |
| `melos_tiles_furniture_storage_03` | 8×16 | 16 | 16 | 16 | Olive Combi Locker; Red Combi Locker; Maritim Combi Locker; Grey Combi Locker |
| `melos_tiles_furniture_tables_01` | 8×16 | 75 | 75 | 75 | Milk White Round Table; Milk White Fancy Table; Milk White Square Table; Square Oak Table |
| `melos_tiles_furniture_tables_02` | 8×16 | 36 | 36 | 33 | Vintage White Square Table; Green Square Wooden Table; Green Square Wooden Square Table; Childrens Large Square Table |
| `melos_tiles_furniture_tables_03` | 8×16 | 96 | 96 | 96 | Brown Vintage Writers Desk; Turquoise Vintage Writers Desk; Green Vintage Writers Desk; Old Vintage Writers Desk |
| `melos_tiles_furniture_tables_low_01` | 8×16 | 105 | 105 | 105 | Armário Baixo de Mogno; Dark Brown Low Table; Long Dark Brown Low Table; Long Black Low Table |
| `melos_tiles_gardencenter_01` | 8×16 | 127 | 127 | 125 | Melos Large Plant; Melos Firewood Group Melos Firewood Stack; Melos Terrarium; Melos Large Fruit Plant |
| `melos_tiles_gardencenter_02` | 8×16 | 83 | 83 | 81 | Ground Overgrown Ladder; Overgrown Ladder; Green Garden Hose; Orange Garden Hose |
| `melos_tiles_gardencenter_03` | 8×16 | 11 | 11 | 10 | Sitting Bear Statue; Golden Buddha Statue; Silver Buddha Statue; Hippie Fountain |
| `melos_tiles_gardencenter_hedges_01` | 8×16 | 20 | 20 | 20 | Cerca-viva Alta |
| `melos_tiles_gardencenter_plants_01` | 8×16 | 128 | 128 | 128 | White Full Planter; White Empty Planter; Purple Flowers White Planter; Blue Flowers White Planter |
| `melos_tiles_gardencenter_plants_02` | 8×16 | 84 | 84 | 84 | Pot Plant; Melos Large Plant; Pink Table Plant; Orange Table Plant |
| `melos_tiles_gardencenter_pots_02` | 8×16 | 20 | 20 | 20 | Fancy Blue Plant Pot; Vintage Large Melos Large Plant; Roman Blue Plant Pot; Roman Yellow Plant Pot |
| `melos_tiles_gardencenter_rocks_01` | 8×16 | 44 | 44 | 44 | Melos 1 Rock; Melos 2 Rock; Melos 3 Rock; Melos 4 Rock |
| `melos_tiles_gardencenter_rocks_overgrown_01` | 8×16 | 47 | 47 | 44 | Melos Overgrown 1 Rock; Melos Overgrown 2 Rock; Melos Overgrown 3 Rock; Melos Overgrown 4 Rock |
| `melos_tiles_gardencenter_vines_01` | 8×16 | 128 | 128 | 128 | Melos Custom Wall Vines |
| `melos_tiles_grapevines_01` | 6×12 | 42 | 42 | 42 | Grapevines |
| `melos_tiles_grime_walls_01` | 8×16 | 28 | 28 | 0 | — |
| `melos_tiles_grime_walls_vanilla_add_heavy_01` | 8×16 | 109 | 109 | 0 | — |
| `melos_tiles_grime_walls_vanilla_add_low_01` | 8×16 | 109 | 109 | 0 | — |
| `melos_tiles_industry_01` | 8×8 | 27 | 27 | 24 | Woodframe Watertower; Clean Watertower; Overgrown Watertower |
| `melos_tiles_industry_02` | 8×16 | 94 | 94 | 88 | Large Industry Pipe |
| `melos_tiles_industry_02a` | 8×16 | 103 | 103 | 88 | Large Industry Pipe |
| `melos_tiles_industry_02b` | 8×16 | 103 | 103 | 88 | Large Industry Pipe |
| `melos_tiles_junk_01` | 8×16 | 82 | 82 | 82 | Damaged Metal Trash Bin; Damaged Green Trash Bin; Lord Bloody Painting; Folded USA Flag |
| `melos_tiles_junk_01a` | 8×16 | 51 | 51 | 50 | Stacked Floortiles; White Junk Cloth; Turquois Junk Cloth; Yellow Junk Cloth |
| `melos_tiles_junk_01b` | 8×16 | 51 | 51 | 45 | Toppled Slide; Stacked Mattresses; Dirty Stacked Mattresses; Single Mattress |
| `melos_tiles_junk_02` | 8×16 | 84 | 84 | 82 | Melos Basement Windows Group Junk Pit; Melos Junk; Melos Basement Windows Group Trash Pit |
| `melos_tiles_junk_furniture_01` | 8×16 | 47 | 47 | 44 | Very Dirty Bed; Broken Bed; Broken Mossy Bed; Trashed Junk Bed |
| `melos_tiles_junk_furniture_02` | 8×16 | 6 | 6 | 5 | Toppled Wood Shelf; Toppled Wood Desk |
| `melos_tiles_junk_ruins_01` | 8×16 | 5 | 5 | 3 | Broken Concrete Pillar |
| `melos_tiles_kitchen_props_01` | 8×16 | 91 | 91 | 69 | Melos Dishwasher; Melos Full Dishwasher; Melos Half Full Dishwasher; Melos Grey Kitchen Shelve |
| `melos_tiles_overgrown_objects_01` | 8×16 | 61 | 61 | 59 | Overgrown Toilet; Hanging Overgrown Toilet; Overgrown Leaning Doors; Overgrown Bathtub |
| `melos_tiles_overgrown_objects_02` | 8×16 | 72 | 72 | 71 | Melos Statue Lenin Bust; Melos Statue Lenin Statue; Melos Statue Lenin Fallen; Melos Overgrown Sewer Exit |
| `melos_tiles_overgrown_ruins_01` | 8×16 | 93 | 93 | 8 | Brick Debris |
| `melos_tiles_overgrown_ruins_02` | 8×16 | 93 | 93 | 8 | Brick Debris |
| `melos_tiles_overgrown_ruins_03` | 8×16 | 114 | 114 | 0 | — |
| `melos_tiles_overgrown_ruins_04` | 8×32 | 210 | 210 | 0 | — |
| `melos_tiles_overgrown_ruins_05` | 8×32 | 210 | 210 | 0 | — |
| `melos_tiles_overgrown_ruins_06` | 8×32 | 210 | 210 | 0 | — |
| `melos_tiles_overgrown_ruins_07` | 8×32 | 210 | 210 | 0 | — |
| `melos_tiles_overgrown_ruins_08` | 8×32 | 210 | 210 | 0 | — |
| `melos_tiles_overgrown_ruins_concrete_01` | 8×16 | 49 | 49 | 0 | — |
| `melos_tiles_overgrown_ruins_concrete_02` | 8×16 | 80 | 80 | 30 | Floor Tile |
| `melos_tiles_overgrown_ruins_fossoil_01` | 8×32 | 110 | 110 | 60 | Porta; Toppled Fossoil Garbage Bin; Fossoil Garbage Lid Bin; Damaged Fossoil Garbage Bin |
| `melos_tiles_overgrown_ruins_gas2go_01` | 8×32 | 105 | 105 | 44 | Porta; Toppled Fossoil Garbage Bin; Fossoil Garbage Lid Bin; Damaged Fossoil Garbage Bin |
| `melos_tiles_overgrown_ruins_overlay_broken_tiles_01` | 8×16 | 39 | 39 | 0 | — |
| `melos_tiles_overgrown_ruins_overlay_grime_01` | 8×16 | 41 | 41 | 0 | — |
| `melos_tiles_overgrown_ruins_overlay_grime_02` | 8×16 | 34 | 34 | 0 | — |
| `melos_tiles_overgrown_vehicles_01` | 8×10 | 62 | 62 | 58 | Blue Overgrown Pickup; Red Overgrown Pickup; Blue Overgrown Tractor; Red Overgrown Moped |
| `melos_tiles_overgrown_vehicles_02` | 8×10 | 46 | 46 | 46 | Overgrown Ship |
| `melos_tiles_overgrown_vehicles_03` | 8×10 | 71 | 71 | 71 | Grey Overgrown Bus Toppled; Orange Overgrown Taunus; Brown Garage Find Oldtimer; Brown Overgrown Garage Find Oldtimer |
| `melos_tiles_overlays_01` | 8×16 | 103 | 103 | 0 | — |
| `melos_tiles_overlays_02` | 8×16 | 94 | 94 | 0 | — |
| `melos_tiles_railings_01` | 8×16 | 106 | 106 | 106 | Railing; Railing Post |
| `melos_tiles_railings_02` | 8×16 | 120 | 120 | 120 | Railing; Railing Post |
| `melos_tiles_railings_03` | 8×16 | 28 | 28 | 0 | — |
| `melos_tiles_railings_04` | 8×16 | 80 | 80 | 0 | — |
| `melos_tiles_railings_04a` | 8×16 | 17 | 17 | 0 | — |
| `melos_tiles_random_props_01` | 8×16 | 85 | 85 | 84 | Colored Records Crate; White Vinyl Sleeve; French Vinyl Sleeve; Records Stacked |
| `melos_tiles_random_props_01a` | 8×16 | 20 | 20 | 19 | Small Carrera; Large Carrera; Pile of Clothes; Sewing Basket |
| `melos_tiles_random_props_02` | 8×16 | 109 | 109 | 109 | Wooden & Plant Toiletpaper Holder; Wooden Toiletpaper Holder; Red Toaster; Yellow Toaster |
| `melos_tiles_random_props_02a` | 8×16 | 45 | 45 | 44 | Black Menu Box; White Menu Box; Red Menu Box; Blue Menu Box |
| `melos_tiles_random_props_02b` | 8×16 | 20 | 20 | 16 | Melos Grey Laundry Rack; Melos Yellow Laundry Rack; Melos White Laundry Rack; Melos Pink Laundry Rack |
| `melos_tiles_random_props_03` | 8×16 | 79 | 79 | 72 | Welcome to Shortrest Street Sign; Leaving Shortrest Street Sign; Westpoint Shortrest Street Sign; Westpoint Valley Station Street Sign |
| `melos_tiles_random_props_04` | 8×16 | 32 | 32 | 32 | Melos Black Bicycle; Melos White Bicycle; Melos Blue Bicycle; Melos Yellow Bicycle |
| `melos_tiles_random_props_05` | 8×16 | 51 | 51 | 49 | Fish Taxidermy; Another Fish Taxidermy; Paper Roll Holder; Small Painting Frame |
| `melos_tiles_random_props_corpses_01` | 8×16 | 18 | 18 | 16 | Wolf Corpse; Wolf Bloody Corpse; Fox Corpse; Fox Bloody Corpse |
| `melos_tiles_random_props_corpses_02` | 8×16 | 14 | 14 | 12 | Stalker Corpse; Human Corpse |
| `melos_tiles_random_props_industry_01` | 8×16 | 116 | 116 | 116 | Rusty Metal Drum; Grey Metal Drum; Red Metal Drum; Blue Metal Drum |
| `melos_tiles_random_props_industry_02` | 8×16 | 85 | 85 | 85 | Single Metal Bottle; Stacked Metal Bottle; Single Gas Bottle; Stacked Gas Bottle |
| `melos_tiles_random_props_industry_03` | 8×16 | 73 | 73 | 71 | Melos Large Metal Drum; Blue Wooden Crate; Blue Flat Wooden Crate; Blue Flat Wooden |
| `melos_tiles_random_props_industry_04` | 8×16 | 42 | 42 | 39 | Broken Vent; Large Broken Vent; Broken Motor; Broken Wallmounted Vent |
| `melos_tiles_random_props_industry_05` | 8×16 | 76 | 76 | 76 | Blue Large Fuel Tank; Red Large Fuel Tank; Green Large Fuel Tank; Empty Large Fuel Tank |
| `melos_tiles_random_props_lighting_01` | 8×16 | 41 | 41 | 41 | Green Table Lantern; Brown Table Lantern; Blue Table Lantern; White Table Lantern |
| `melos_tiles_random_props_playground_01` | 8×16 | 94 | 94 | 92 | Yellow Playground Bird; Blue Playground Bird; Red Playground Bird; Green Playground Bird |
| `melos_tiles_random_props_pool_01` | 8×16 | 46 | 46 | 42 | White Pool Floor; White Slated Pool Floor |
| `melos_tiles_random_props_pool_02` | 8×16 | 16 | 16 | 0 | — |
| `melos_tiles_random_props_sports_01` | 8×16 | 63 | 63 | 62 | Melos Net Goal; Melos Concrete Table Tennis; Blue Stacked Sport Mattresses; Blue Sport Mattresses |
| `melos_tiles_random_props_stalker_01` | 8×16 | 81 | 81 | 81 | Arena Large Wall Sign; Stalker Bar Wall Sign; Stalker Small Poster; Stalker Large Poster |
| `melos_tiles_random_props_stalker_signs_01` | 8×16 | 66 | 66 | 65 | Polissya Rooftop Sign; Hammer and Sickle Sign; Hazardous Warning Road Sign; Prypiat Road Sign |
| `melos_tiles_random_props_statues_01` | 8×16 | 4 | 4 | 3 | Arnie Strong Statue; Arnie Fist Statue; Handmaid Statue |
| `melos_tiles_random_props_trash_container_01` | 8×16 | 16 | 16 | 16 | Large Metal Tray Rack; Lixeira; Melos Silver Square Bin; Melos Red Square Bin |
| `melos_tiles_roofs_01` | 8×16 | 88 | 88 | 88 | MT Blue Slated Roof |
| `melos_tiles_roofs_01a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_01b` | 8×16 | 61 | 61 | 54 | MT Blue Roof |
| `melos_tiles_roofs_02` | 8×16 | 88 | 88 | 88 | MT Berry Slated Roof Edge |
| `melos_tiles_roofs_02a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_02b` | 8×16 | 61 | 61 | 58 | MT Berry Roof |
| `melos_tiles_roofs_03` | 8×16 | 88 | 88 | 88 | MT Red Slated Roof |
| `melos_tiles_roofs_03a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_03b` | 8×16 | 61 | 61 | 58 | MT Red Roof |
| `melos_tiles_roofs_04` | 8×16 | 88 | 88 | 88 | MT Orange Slated Roof Edge |
| `melos_tiles_roofs_04a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_04b` | 8×16 | 61 | 61 | 58 | MT Orange Roof |
| `melos_tiles_roofs_05` | 8×16 | 88 | 88 | 88 | MT Green Slated Roof |
| `melos_tiles_roofs_05a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_05b` | 8×16 | 61 | 61 | 58 | MT Green Roof |
| `melos_tiles_roofs_06` | 8×16 | 88 | 88 | 88 | MT Smaragd Slated Roof |
| `melos_tiles_roofs_06a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_06b` | 8×16 | 61 | 61 | 58 | MT Smaragd Roof |
| `melos_tiles_roofs_07` | 8×16 | 88 | 88 | 88 | MT Blue Slated Roof |
| `melos_tiles_roofs_07a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_07b` | 8×16 | 61 | 61 | 58 | MT Blue Roof |
| `melos_tiles_roofs_08` | 8×16 | 88 | 88 | 88 | MT Grey Slated Roof |
| `melos_tiles_roofs_08a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_08b` | 8×16 | 61 | 61 | 58 | MT Grey Roof |
| `melos_tiles_roofs_08c` | 8×32 | 182 | 182 | 182 | MT Blue Slated Roof Edge; MT Black Roof |
| `melos_tiles_roofs_09` | 8×16 | 88 | 88 | 88 | MT Black Slated Roof Edge |
| `melos_tiles_roofs_09a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_09b` | 8×16 | 61 | 61 | 58 | MT Black Roof |
| `melos_tiles_roofs_09c` | 8×32 | 182 | 182 | 182 | MT Blue Slated Roof Edge; MT Black Roof |
| `melos_tiles_roofs_10` | 8×16 | 88 | 88 | 88 | MT Eggshell Slated Roof Edge |
| `melos_tiles_roofs_10a` | 8×32 | 152 | 152 | 152 | MT Blue Slated Roof Edge |
| `melos_tiles_roofs_10b` | 8×16 | 61 | 61 | 58 | MT Eggshell Roof |
| `melos_tiles_rugs_01` | 8×16 | 102 | 102 | 102 | Melos Yellow Arabic Rug; Melos Blue Shells Rug; Melos Rose Flower Rug; Melos Blue Arabic Rug |
| `melos_tiles_rugs_02` | 8×16 | 108 | 108 | 108 | Brown Shells Rug; Roses on Green Rug; Green Mosaic Rug; Spilled Colors Rug |
| `melos_tiles_rugs_03` | 8×16 | 128 | 128 | 128 | White Roots Rug; Green Gradient Rug; Childrens Drawing Rug; Overlapping Circles Rug |
| `melos_tiles_rugs_04` | 8×16 | 96 | 96 | 96 | Comfy Colors Rug; Blue Rustic Rug; Random Triangles Rug; White Comfy Triangles Rug |
| `melos_tiles_rugs_05` | 8×16 | 96 | 96 | 96 | Western Old Rug; Western Vintage Rug; Western Country Rug; Random Simple Rug |
| `melos_tiles_rugs_06` | 8×16 | 72 | 72 | 72 | Tapete de Banheiro; Tapete Retangular Preto |
| `melos_tiles_shop_signs_01` | 8×32 | 162 | 162 | 161 | Pies from Pete Sign; Stacked Mc Cheese Sign; Bullsteaks Sign; Beautiful Furniture Sign |
| `melos_tiles_shop_signs_02` | 8×16 | 128 | 128 | 128 | Placa; Broccolee Sign |
| `melos_tiles_shop_signs_03` | 8×16 | 119 | 119 | 119 | Gibson Theatre Sign; Large Motel Sign; Chop Shop Sign; Kostners Camping Sign |
| `melos_tiles_shop_signs_04` | 8×32 | 240 | 240 | 238 | The River Restaurant Sign; AIMerica Gunstore Sign; Shortrest Post Office Sign; Road House Advert Sign |
| `melos_tiles_shop_signs_05` | 8×32 | 211 | 211 | 210 | Liquor Store Sign; Hifi Sale Sign; Gas Depot Sign; Anthonys Woodworks Sign |
| `melos_tiles_stairs_01` | 8×16 | 125 | 125 | 125 | Metal Stairs; Metal Beam; Wood Stairs; Wood Beam |
| `melos_tiles_stairs_01a` | 8×16 | 125 | 125 | 125 | Metal Stairs; Metal Beam; Wood Stairs; Wood Beam |
| `melos_tiles_stairs_02` | 8×16 | 96 | 96 | 96 | Concrete Stairs |
| `melos_tiles_stairs_03` | 8×16 | 51 | 51 | 48 | Concrete Stairs; Broken Concrete Stairs; Wood Stairs |
| `melos_tiles_stairs_04` | 8×16 | 4 | 4 | 3 | Wood Stairs |
| `melos_tiles_trims_en_newburbs_add_01_brown_dark` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_trims_en_newburbs_add_02_brown` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_trims_en_newburbs_add_03_yellow` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_trims_en_newburbs_add_04_green` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_trims_en_newburbs_add_05_grey_dark` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_trims_en_newburbs_add_06_grey` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_trims_en_newburbs_add_07_grey_light` | 8×16 | 81 | 81 | 0 | — |
| `melos_tiles_wall_deco_01` | 8×16 | 128 | 128 | 128 | Lovers Melos Painting; Black Kitten Melos Painting; Endtimes Melos Painting; Lord Melos Painting |
| `melos_tiles_wall_deco_02` | 8×16 | 128 | 128 | 128 | Bears Melos Painting; Bear Melos Painting; Deer1 Melos Painting; Deer2 Melos Painting |
| `melos_tiles_wall_deco_03` | 8×16 | 52 | 52 | 52 | Golden Woods Melos Painting; Canada Melos Painting; Monkey's with oranges Melos Painting; Bear Family Melos Painting |
| `melos_tiles_wall_deco_04` | 8×16 | 38 | 38 | 37 | Cardboard Cutout Painter; Color Wheel Melos Poster; Color Scale Melos Poster; Color Picker Melos Poster |
| `melos_tiles_wall_deco_04a` | 8×16 | 28 | 28 | 28 | Mass Advertising ONE Posters; Mass Advertising TWO Posters; Mass Advertising THREE Posters; Mass Advertising FOUR Posters |
| `melos_tiles_wall_deco_05` | 8×16 | 118 | 118 | 118 | Golden Ornamental Mirror; Wooden Ornamental Mirror; White Melos Mirrors; White Small Mirror |
| `melos_tiles_wall_deco_05a` | 8×16 | 5 | 5 | 4 | Western Landscape Melos Painting |
| `melos_tiles_wall_deco_06` | 8×16 | 128 | 128 | 128 | Akira Melos Poster; Akira Alternative Melos Poster; Akira Large Melos Poster; The Alpha Incident Melos Poster |
| `melos_tiles_wall_deco_06a` | 8×16 | 128 | 128 | 128 | Cincinnati Melos Poster; Old World Melos Poster; Old Skyscrapers Melos Poster; Wheat Fields Melos Poster |
| `melos_tiles_wall_deco_06b` | 8×16 | 78 | 78 | 78 | The Deer Melos Poster; The Squirrel Melos Poster; Polar Bear Melos Poster; The Badger Melos Poster |
| `melos_tiles_wall_deco_07` | 8×16 | 98 | 98 | 98 | Gamepad Walldeco; Sonic Melos Poster; No Parents Allowed Melos Sign; Keep Out Melos Sign |
| `melos_tiles_wall_deco_08` | 8×16 | 84 | 84 | 84 | Red Ford Taunus Melos Poster; Grey Ford Laser Melos Poster; Ford Escort Rally Melos Poster; Ford Eclipse Melos Poster |
| `melos_tiles_wall_deco_09` | 8×16 | 116 | 116 | 116 | Twelve Lions Melos Painting; Mysty Mountains Melos Painting; DFENS Melos Painting; San Fransisco Earth Quake Melos Painting |
| `melos_tiles_wall_deco_09a` | 8×16 | 32 | 32 | 32 | Woman at the Lake Melos Painting; Before the Mission Melos Painting; Good vs Evil Melos Painting; White Dogs Melos Painting |
| `melos_tiles_wall_deco_10` | 8×16 | 104 | 104 | 104 | Brutalism Melos Poster; Brutalism Art Melos Poster; Brutalism Architecture Melos Poster; Nothing Melos Poster |
| `melos_tiles_wall_deco_11` | 8×16 | 80 | 80 | 80 | All you need is LESS Melos Poster; Why Not Melos Poster; Je Taime Melos Poster; Woman in the Water Melos Poster |
| `melos_tiles_wall_deco_12` | 8×16 | 42 | 42 | 42 | Pink Cat Melos Poster; Monke People Melos Poster; Animal Tourist Melos Poster; Friend Dog Melos Poster |
| `melos_tiles_wall_deco_13` | 8×16 | 108 | 108 | 108 | Golden Equinox Melos Painting; Legs and Arms Melos Painting; Catching Rays Melos Painting; Sun and Moon Melos Painting |
| `melos_tiles_wall_deco_13a` | 8×16 | 35 | 35 | 34 | Cathedral Melos Painting; Greek Stamp Melos Painting; Black Hound Melos Painting; Giant Shrooms Melos Painting |
| `melos_tiles_wall_deco_graffiti_01` | 8×16 | 110 | 110 | 110 | Graffiti; Emote Graffiti |
| `melos_tiles_wall_deco_graffiti_02` | 8×16 | 96 | 96 | 96 | Graffiti |
| `melos_tiles_wall_deco_graffiti_03` | 8×16 | 128 | 128 | 128 | Graffiti |
| `melos_tiles_wall_deco_graffiti_04` | 8×16 | 108 | 108 | 108 | Graffiti |
| `melos_tiles_wall_deco_graffiti_05` | 8×16 | 104 | 104 | 104 | Graffiti |
| `melos_tiles_wall_deco_graffiti_06` | 8×16 | 123 | 123 | 122 | Graffiti |
| `melos_tiles_wall_deco_streetart_01` | 8×16 | 119 | 119 | 118 | Street Art |
| `melos_tiles_wall_deco_streetart_02` | 8×16 | 105 | 105 | 105 | Street Art |
| `melos_tiles_wall_deco_streetart_03` | 8×16 | 108 | 108 | 108 | Street Art |
| `melos_tiles_wall_deco_streetart_04` | 8×16 | 65 | 65 | 65 | Street Art |
| `melos_tiles_walls_basement_windows_01` | 8×8 | 61 | 61 | 0 | — |
| `melos_tiles_walls_bathroom_01` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_walls_bathroom_01a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01i` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_01j` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_02` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_walls_bathroom_03` | 8×32 | 240 | 240 | 0 | — |
| `melos_tiles_walls_bathroom_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_04a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_07` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_08` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_10` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_11` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_12` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_12a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_12b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_12c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_13` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_14` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_15` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_16` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_17` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_18` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_18a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_18b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_18c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_07` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_08` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_10` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_11` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_ddd_add_12` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_vanilla_add_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_vanilla_add_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_bathroom_vanilla_add_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_walls_brick_01a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_01h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_blue` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_blue_dark` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_brown` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_brown_hazel` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_brown_light` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_dark_grey` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_eggshell` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_green` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_purple` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_purple_dark` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_standard_brown` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_02_standard_light` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_natural_01` | 8×16 | 111 | 111 | 0 | — |
| `melos_tiles_walls_brick_natural_01e` | 8×16 | 111 | 111 | 0 | — |
| `melos_tiles_walls_brick_raw_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01i` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01j` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01k` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01l` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01m` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01n` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01o` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01p` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01q` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01r` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01s` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01t` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01u` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01v` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01w` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01x` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01xa` | 8×16 | 111 | 111 | 0 | — |
| `melos_tiles_walls_brick_raw_01y` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_01z` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02i` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02j` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_raw_02k` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01i` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01j` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_special_01k` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_brick_windowframes_01` | 8×8 | 48 | 48 | 0 | — |
| `melos_tiles_walls_burnt_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_01` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_children_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_07` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_08` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_children_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_church_van_add_01` | 8×16 | 123 | 123 | 0 | — |
| `melos_tiles_walls_commercial_01` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_02` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_03` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_04` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_05` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_06` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_07` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_08` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_09` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_10` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_11` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_12` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_13` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_14` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_15` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_16` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_17` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_18` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_19` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_20` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_21` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_22` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_23` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_24` | 8×16 | 105 | 105 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_01` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_02` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_03` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_04` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_05` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_06` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_07` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_08` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_09` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_10` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_11` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_12` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_13` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_14` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_15` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_16` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_17` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_18` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_19` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_20` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_21` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_22` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_23` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_commercial_overgrown_24` | 8×16 | 61 | 61 | 0 | — |
| `melos_tiles_walls_concrete_01` | 8×16 | 118 | 118 | 8 | Pillar |
| `melos_tiles_walls_detailing_01` | 8×16 | 114 | 114 | 0 | — |
| `melos_tiles_walls_detailing_01a` | 8×16 | 66 | 66 | 0 | — |
| `melos_tiles_walls_detailing_02` | 8×16 | 64 | 64 | 64 | Steps White Wall Moulding; Steps Grey Wall Moulding; Steps Black Wall Moulding; Steps Brown Wall Moulding |
| `melos_tiles_walls_detailing_03` | 8×32 | 230 | 230 | 230 | Cornice White Wall Moulding; Cornice Red Wall Moulding; Cornice Smaragd Wall Moulding; Cornice Bordeaux Wall Moulding |
| `melos_tiles_walls_detailing_03a` | 8×32 | 230 | 230 | 230 | Cornice Grey Sand Wall Moulding; Cornice Red White Wall Moulding; Cornice Grey Red Wall Moulding; Cornice Bordeaux Grey Wall Moulding |
| `melos_tiles_walls_detailing_04` | 8×16 | 16 | 16 | 16 | Sunny Door Headlight; Victorian Door Headlight; White Victorian Door Headlight; Greek Window Frame |
| `melos_tiles_walls_detailing_05` | 8×16 | 104 | 104 | 96 | Gable Pediment |
| `melos_tiles_walls_detailing_06` | 8×16 | 17 | 17 | 0 | — |
| `melos_tiles_walls_detailing_07` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_detailing_08` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08a` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08b` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08c` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08d` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08e` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08f` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08g` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08h` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08i` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08j` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08k` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08l` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_08m` | 8×16 | 90 | 90 | 90 | Gold Vintage Trim Framing; Gold Vintage Door Framing; Gold Vintage Window Framing |
| `melos_tiles_walls_detailing_09` | 8×16 | 120 | 120 | 120 | Limestone Window Trim; Limestone Round Window Trim; White Limestone Window Trim; Brown Limestone Window Trim |
| `melos_tiles_walls_detailing_09a` | 8×16 | 120 | 120 | 120 | Green Limestone Window Trim; Blue Limestone Window Trim |
| `melos_tiles_walls_detailing_grand_hotel_01` | 8×16 | 62 | 62 | 4 | Eggshell Modern Large Extended Right Window |
| `melos_tiles_walls_double_doorframes_01` | 8×16 | 54 | 54 | 0 | — |
| `melos_tiles_walls_en_newburbs_add_01` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_02` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_03` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_04` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_05` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_06` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_07` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_08` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_09` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_10` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_11` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_12` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_13` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_14` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_15` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_16` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_17` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_18` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_19` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_en_newburbs_add_20` | 8×16 | 128 | 128 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_garage_01` | 8×16 | 112 | 112 | 0 | — |
| `melos_tiles_walls_garage_02` | 8×16 | 112 | 112 | 0 | — |
| `melos_tiles_walls_indoor_01` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_indoor_02` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_indoor_03` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_indoor_04` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_indoor_05` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_indoor_06` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_industry_tk_add_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_07` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_08` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_10` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_industry_tk_add_11` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_07` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_08` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_10` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_11` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_12` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_13` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_14` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_15` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_16` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_17` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_18` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_19` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_20` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_21` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_22` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_23` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_24` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_25` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_26` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_27` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_28` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_29` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_30` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_31` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_32` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_33` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_34` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_35` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_36` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_37` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_38` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_39` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_40` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_41` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_42` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_43` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_44` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_45` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_46` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_47` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_48` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_49` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_50` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_51` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_interior_52` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_01` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_livingroom_02` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_livingroom_03` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_livingroom_04` | 8×16 | 120 | 120 | 0 | — |
| `melos_tiles_walls_livingroom_05` | 8×32 | 180 | 180 | 0 | — |
| `melos_tiles_walls_livingroom_06` | 8×32 | 180 | 180 | 0 | — |
| `melos_tiles_walls_livingroom_07` | 8×32 | 180 | 180 | 0 | — |
| `melos_tiles_walls_livingroom_08` | 8×32 | 180 | 180 | 0 | — |
| `melos_tiles_walls_livingroom_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_10` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_11` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_12` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_13` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_14` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_15` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_16` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_17` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_18` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_19` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_20` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_21` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_22` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_23` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_24` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_25` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_26` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_27` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_28f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_29` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_29a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_29b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_30` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_30a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_30b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_30c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_30d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_30e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_31` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_31a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_31b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_31c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_livingroom_31d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_overlays_01` | 8×32 | 128 | 128 | 0 | — |
| `melos_tiles_walls_overlays_01a` | 8×16 | 30 | 30 | 0 | — |
| `melos_tiles_walls_overlays_02` | 8×16 | 114 | 114 | 0 | — |
| `melos_tiles_walls_overlays_03` | 8×16 | 114 | 114 | 0 | — |
| `melos_tiles_walls_overlays_04` | 8×16 | 90 | 90 | 0 | — |
| `melos_tiles_walls_overlays_04a` | 8×16 | 88 | 88 | 0 | — |
| `melos_tiles_walls_overlays_brick_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_overlays_brick_01a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_overlays_brick_block_vanilla_01` | 8×16 | 106 | 106 | 0 | — |
| `melos_tiles_walls_overlays_brick_blood_01` | 8×16 | 105 | 0 | 0 | — |
| `melos_tiles_walls_overlays_brick_dirt_01` | 8×16 | 106 | 105 | 0 | — |
| `melos_tiles_walls_overlays_brick_green_01` | 8×16 | 106 | 105 | 0 | — |
| `melos_tiles_walls_overlays_brick_plaster_01` | 8×16 | 106 | 105 | 0 | — |
| `melos_tiles_walls_overlays_brick_vanilla_01` | 8×16 | 106 | 105 | 0 | — |
| `melos_tiles_walls_overlays_broken_01` | 8×16 | 19 | 19 | 0 | — |
| `melos_tiles_walls_overlays_decayed_01_door_window` | 8×32 | 256 | 256 | 0 | — |
| `melos_tiles_walls_overlays_decayed_01_walls` | 8×32 | 142 | 142 | 0 | — |
| `melos_tiles_walls_overlays_decayed_01_window_wide` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_01_window_wide_long` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_02_door_window` | 8×32 | 256 | 256 | 0 | — |
| `melos_tiles_walls_overlays_decayed_02_walls` | 8×32 | 142 | 142 | 0 | — |
| `melos_tiles_walls_overlays_decayed_02_window_wide` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_02_window_wide_long` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_03_door_window` | 8×32 | 256 | 256 | 0 | — |
| `melos_tiles_walls_overlays_decayed_03_walls` | 8×32 | 142 | 142 | 0 | — |
| `melos_tiles_walls_overlays_decayed_03_window_wide` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_03_window_wide_long` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_04_door_window` | 8×32 | 256 | 256 | 0 | — |
| `melos_tiles_walls_overlays_decayed_04_walls` | 8×32 | 142 | 142 | 0 | — |
| `melos_tiles_walls_overlays_decayed_04_window_wide` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_04_window_wide_long` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_05_door_window` | 8×32 | 256 | 256 | 0 | — |
| `melos_tiles_walls_overlays_decayed_05_walls` | 8×32 | 142 | 142 | 0 | — |
| `melos_tiles_walls_overlays_decayed_05_window_wide` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_decayed_05_window_wide_long` | 8×32 | 192 | 192 | 0 | — |
| `melos_tiles_walls_overlays_wallpaper_peeled_01` | 8×16 | 20 | 20 | 0 | — |
| `melos_tiles_walls_pert_add_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_07` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_08` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_09` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_10` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_11` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_12` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_13` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_14` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_15` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_16` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_17` | 8×16 | 110 | 106 | 0 | — |
| `melos_tiles_walls_pert_add_18` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_19` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_pert_add_20` | 8×16 | 111 | 111 | 0 | — |
| `melos_tiles_walls_plaster_01` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_walls_plaster_01a` | 8×16 | 64 | 64 | 0 | — |
| `melos_tiles_walls_plaster_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_plaster_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_plaster_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_plaster_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_soviet_01i` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_special_01` | 8×16 | 112 | 104 | 112 | Melos Brick Ads Group Melos Brick Ads |
| `melos_tiles_walls_special_02` | 8×16 | 88 | 88 | 88 | Melos Brick Ads Group Melos Brick Ads |
| `melos_tiles_walls_special_03` | 8×16 | 88 | 88 | 88 | Falling Down Melos Wallpapers; Jurassic Park Melos Wallpapers; Kate Bush Melos Wallpapers; Gremlin Melos Wallpapers |
| `melos_tiles_walls_special_04` | 8×16 | 20 | 20 | 0 | — |
| `melos_tiles_walls_special_soviet_01` | 8×32 | 112 | 112 | 0 | — |
| `melos_tiles_walls_triple_arch_vanilla_add_01` | 8×16 | 112 | 112 | 0 | — |
| `melos_tiles_walls_triple_arch_vanilla_add_01a` | 8×16 | 70 | 70 | 0 | — |
| `melos_tiles_walls_vanilla_add_01` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_02` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_03` | 8×16 | 125 | 125 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_04` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_05` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_06` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_07` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_08` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_09` | 8×16 | 120 | 120 | 10 | Small Air Vent; Fuse Box Unit; Electric Unit; Gas Counter Unit |
| `melos_tiles_walls_vanilla_add_10` | 8×16 | 110 | 109 | 0 | — |
| `melos_tiles_walls_vanilla_add_11` | 8×16 | 110 | 109 | 0 | — |
| `melos_tiles_walls_vanilla_add_12` | 8×16 | 110 | 109 | 0 | — |
| `melos_tiles_walls_vanilla_add_13` | 8×16 | 110 | 109 | 0 | — |
| `melos_tiles_walls_vanilla_add_14` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_15` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_16` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_17` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_18` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_19` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_20` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_21` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_22` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_23` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_fossoil_01` | 8×16 | 123 | 123 | 0 | — |
| `melos_tiles_walls_vanilla_add_gas2go_01` | 8×16 | 123 | 123 | 0 | — |
| `melos_tiles_walls_vanilla_add_industry_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_industry_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_add_industry_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_interior_add_01` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_interior_add_02` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_interior_add_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_interior_add_04` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_interior_add_05` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_vanilla_interior_add_06` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_01` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_walls_wood_01a` | 8×16 | 64 | 64 | 0 | — |
| `melos_tiles_walls_wood_02` | 8×16 | 128 | 128 | 0 | — |
| `melos_tiles_walls_wood_02a` | 8×16 | 64 | 64 | 0 | — |
| `melos_tiles_walls_wood_03` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03a` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03b` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03c` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03d` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03e` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03f` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03g` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03h` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_walls_wood_03i` | 8×16 | 110 | 110 | 0 | — |
| `melos_tiles_windows_01` | 8×16 | 104 | 104 | 0 | — |
| `melos_tiles_windows_02` | 8×16 | 104 | 104 | 0 | — |
| `melos_tiles_windows_03` | 8×16 | 128 | 128 | 128 | Melos Rustic White Window; Janela; Melos Rustic White Large Window; Melos Rustic Light Brown Window |
| `melos_tiles_windows_04` | 8×16 | 80 | 80 | 80 | Melos Round White Window; Janela; Melos Round Black Window; Melos Round Rustic White Window |
| `melos_tiles_windows_05` | 8×16 | 120 | 120 | 120 | White Modern Large Window; Janela; White Modern Large Alt Window; White Modern Small Window |
| `melos_tiles_windows_05a` | 8×16 | 120 | 120 | 120 | Black Modern Large Window; Janela; Black Modern Large Alt Window; Black Modern Small Window |
| `melos_tiles_windows_05b` | 8×16 | 120 | 120 | 120 | Dark Green Modern Large Window; Janela; Dark Green Modern Large Alt Window; Dark Green Modern Small Window |
| `melos_tiles_windows_05c` | 8×16 | 120 | 120 | 120 | Red Modern Large Window; Janela; Red Modern Large Alt Window; Red Modern Small Window |
| `melos_tiles_windows_06` | 8×16 | 120 | 120 | 120 | White Modern Large Extended Right Window; Janela; White Modern Large Extended Center Window; White Modern Large Extended Left Window |
| `melos_tiles_windows_06a` | 8×16 | 120 | 120 | 120 | Black Modern Large Extended Right Window; Janela; Black Modern Large Extended Center Window; Black Modern Large Extended Left Window |
| `melos_tiles_windows_06b` | 8×16 | 120 | 120 | 120 | Dark Green Modern Large Extended Right Window; Janela; Dark Green Modern Large Extended Center Window; Dark Green Modern Large Extended Left Window |
| `melos_tiles_windows_06c` | 8×16 | 120 | 120 | 120 | Red Modern Large Extended Right Window; Janela; Red Modern Large Extended Center Window; Red Modern Large Extended Left Window |
| `melos_tiles_windows_07` | 8×32 | 114 | 114 | 114 | White Modern Headlight Window; Eggshell Modern Headlight Window; Grey Modern Headlight Window; Dark Grey Modern Headlight Window |
| `melos_tiles_windows_08` | 8×16 | 120 | 120 | 120 | White Countryside Large Extended Window; Janela; Eggshell Countryside Large Extended Window; Grey Countryside Large Extended Window |
| `melos_tiles_windows_08a` | 8×16 | 120 | 120 | 120 | Black Countryside Large Extended Window; Janela; Olive Countryside Large Extended Window; Brown Countryside Large Extended Window |
| `melos_tiles_windows_09` | 8×16 | 120 | 120 | 120 | White Cross Large Window; Janela; White Cross Large Alt Window; White Cross Small Window |
| `melos_tiles_windows_09a` | 8×16 | 120 | 120 | 120 | Black Cross Large Window; Janela; Black Cross Large Alt Window; Black Cross Small Window |
| `melos_tiles_windows_09b` | 8×16 | 120 | 120 | 120 | Dark Green Cross Large Window; Janela; Dark Green Cross Large Alt Window; Dark Green Cross Small Window |
| `melos_tiles_windows_09c` | 8×16 | 120 | 120 | 120 | Red Cross Large Window; Janela; Red Cross Large Alt Window; Red Cross Small Window |
| `melos_tiles_windows_10` | 8×16 | 120 | 120 | 120 | White Cross Large Extended Right Window; Janela; White Cross Large Extended Center Window; White Cross Large Extended Left Window |
| `melos_tiles_windows_10a` | 8×16 | 120 | 120 | 120 | Black Cross Large Extended Right Window; Janela; Olive Cross Large Extended Right Window; Brown Cross Large Extended Right Window |
| `melos_tiles_windows_10b` | 8×16 | 120 | 120 | 120 | Dark Green Cross Large Extended Right Window; Janela; Green Cross Large Extended Right Window; Mudd Cross Large Extended Right Window |
| `melos_tiles_windows_10c` | 8×16 | 120 | 120 | 120 | Red Cross Large Extended Right Window; Janela; Berry Cross Large Extended Right Window; Purple Cross Large Extended Right Window |
| `melos_tiles_windows_11` | 8×16 | 120 | 120 | 120 | White Cross Square Window; Janela; Eggshell Cross Square Window; Grey Cross Square Window |
| `melos_tiles_windows_11a` | 8×16 | 120 | 120 | 120 | Black Cross Square Window; Janela; Olive Cross Square Window; Brown Cross Square Window |
| `melos_tiles_windows_11b` | 8×16 | 120 | 120 | 120 | Dark Green Cross Square Window; Janela; Green Cross Square Window; Mudd Cross Square Window |
| `melos_tiles_windows_11c` | 8×16 | 120 | 120 | 120 | Red Cross Square Window; Janela; Berry Cross Square Window; Purple Cross Square Window |
| `melos_tiles_windows_special_01` | 8×16 | 18 | 18 | 0 | — |
| `melos_tiles_windows_triple_large_dark_red_brick_01` | 8×16 | 101 | 101 | 0 | — |
| `melos_tiles_windows_triple_large_grey_brick_01` | 8×16 | 101 | 100 | 0 | — |
| `melos_tiles_windows_triple_large_yellow_brick_01` | 8×16 | 101 | 101 | 0 | — |

### Tilesets: Perts Party Tiles

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `k8_puk_01` | 8×16 | 81 | 81 | 41 | Puk Seat; Puk Wall Art; Puk Cash Register; Puk Change Booth |
| `pert_advertising_01` | 8×16 | 33 | 33 | 0 | — |
| `pert_bar_01` | 8×16 | 90 | 90 | 49 | Maple Bar Corner Counter; Maple Bar Counter; black Bar Corner Counter; black Bar Counter |
| `pert_bathroom_01` | 8×16 | 43 | 43 | 25 | Large Green Bath; Green Standing Sink; Lovers Toilet; Green Sink |
| `pert_big-gym_01` | 8×8 | 50 | 50 | 18 | Colchonete de Ginástica; Totally Not a Weight Rack; Big Gains Stair Master; Human Raised Hamster Wheel |
| `pert_burnt_01` | 8×16 | 77 | 77 | 0 | — |
| `pert_carpentry_01` | 8×16 | 0 | 0 | 0 | — |
| `pert_Christmas_01` | 8×16 | 105 | 0 | 33 | Ginger Bread Window; Christmas Mail Box; GingerBreadDoor; Candycane single |
| `pert_Christmas_02` | 8×16 | 54 | 0 | 14 | Krampus sign; Christmas Runner; Christmas Runner End; Server NaughtyORNice |
| `pert_cyberdrive_systems_1` | 8×8 | 46 | 46 | 18 | Barril; Cyberdrive Computer; Cyberdrive Aux Screen; Cyberdrive Twin Cabinet |
| `pert_cyberdrive_systems_2` | 8×8 | 27 | 27 | 19 | Cyberdrive Noticeboard; Wall Sign; Cyberdrive Forms; Cyberdrive Binder |
| `pert_doors_01` | 8×16 | 40 | 40 | 8 | Trek Turbo; Trek ; Hardwood Door Secured |
| `pert_doors_fire_1` | 8×8 | 36 | 36 | 24 | Fire Door |
| `pert_edges_01` | 8×16 | 30 | 30 | 0 | — |
| `pert_eltrain_01` | 8×16 | 18 | 18 | 0 | — |
| `pert_fencing_01` | 8×16 | 60 | 60 | 0 | — |
| `pert_filthy-pools01` | 8×8 | 42 | 42 | 0 | — |
| `pert_fixtures_windows_detailing_01` | 8×16 | 8 | 8 | 0 | — |
| `pert_floors_01` | 8×16 | 10 | 10 | 0 | — |
| `pert_furniture_outdoor_1` | 8×16 | 37 | 37 | 33 | Overlook Dried Decoration; Overlook blue Decoration; Overlook pink Decoration; Overlook tall Decoration |
| `pert_garden_slopes_01` | 8×16 | 96 | 96 | 0 | — |
| `pert_garden_slopes_02` | 8×16 | 36 | 36 | 0 | — |
| `pert_gates_01` | 8×16 | 12 | 12 | 0 | — |
| `pert_glorious_photoframes_01` | 8×16 | 86 | 86 | 86 | Portrait FancyBob; Portrait FancyBean; Portrait FancyNiko; Portrait FancyGoths |
| `pert_gothic_roofs_01` | 8×16 | 98 | 94 | 0 | — |
| `pert_grime_01` | 8×16 | 88 | 88 | 0 | — |
| `pert_gross_stuff_01` | 8×16 | 27 | 27 | 14 | Body Bag Garbage; Containment Bag Biohazard; Wrapped Corpse Sheet; Hamper Biohazard Laundry |
| `pert_halloween_01` | 8×16 | 25 | 25 | 2 | Fllamingo Evil |
| `pert_halloween_02` | 8×16 | 40 | 40 | 18 | Skeleton Nessy; Skeleton Abe; Skeleton Tycoon; Skeleton Sammy |
| `pert_hanging_vines_01` | 8×16 | 30 | 30 | 0 | — |
| `pert_hedge_maze_1` | 8×16 | 38 | 38 | 18 | Plaque; Tall Dead Hedge; Tall Corner Dead Hedge; Short Dead Hedge |
| `pert_inverted_roofcaps_01` | 8×16 | 24 | 24 | 0 | — |
| `pert_location_carwash_1` | 8×8 | 10 | 10 | 2 | Suds Sign |
| `pert_mansions_01` | 8×16 | 101 | 101 | 51 | Posh DoubleBed; Posh SingleBed; Sad Collection of Junk; Fancy Chess Table |
| `pert_mini_phoenix` | 8×16 | 48 | 48 | 0 | — |
| `pert_modern_stuff_01` | 8×8 | 25 | 25 | 1 | Turbo Oven |
| `pert_more_dbl_doors_01` | 8×16 | 128 | 128 | 0 | — |
| `pert_more_dbl_doors_02` | 8×16 | 28 | 28 | 0 | — |
| `pert_more_garage_doors` | 8×16 | 48 | 48 | 0 | — |
| `pert_railings_01` | 8×16 | 71 | 71 | 0 | — |
| `pert_re-phoenix_1` | 8×16 | 114 | 114 | 16 | Dark AF Window; Black Double Door |
| `pert_re-phoenix_2` | 8×32 | 143 | 140 | 60 | Smashed Emo Kid Mirror; Road Cone Stack; Road Cone Stacks; Blue Steel Bench |
| `pert_re-phoenix_3` | 8×16 | 125 | 125 | 41 | Shit Bucket; Lifeguard Chair; Croc Knives Cutout; Scroobs Poster |
| `pert_re-phoenix_4` | 8×16 | 128 | 128 | 30 | Dark AF Dining Chair; Paper Tray; Perts Type Writer; Maze Model |
| `pert_re-phoenix_5` | 8×16 | 109 | 109 | 20 | SpunchBob Display Stand; SpunchBob EndDisplay; Expo Sign Get Fit or Die; Barricade Stacked Desk |
| `pert_roof_accents_01` | 8×16 | 51 | 51 | 0 | — |
| `pert_roofcaps_01` | 8×16 | 56 | 56 | 0 | — |
| `pert_roofcaps_02` | 8×16 | 102 | 102 | 0 | — |
| `pert_roofcaps_grime` | 8×16 | 56 | 56 | 0 | — |
| `pert_roofs_01` | 8×22 | 166 | 166 | 0 | — |
| `pert_rugs_01` | 8×8 | 8 | 8 | 0 | — |
| `pert_signs_01` | 8×16 | 51 | 51 | 0 | — |
| `pert_street_curbs_01_blend_dark_asphalt` | 8×16 | 88 | 88 | 0 | — |
| `pert_street_trafficlines_02` | 8×8 | 27 | 27 | 0 | — |
| `pert_tall_windows_01` | 8×16 | 48 | 48 | 0 | — |
| `pert_trims_01` | 8×16 | 115 | 115 | 0 | — |
| `pert_trims_02` | 8×16 | 29 | 29 | 0 | — |
| `pert_vegetation_indoor_01` | 8×16 | 4 | 4 | 4 | Indoor Plant Dead |
| `pert_wall_overlays_01` | 8×16 | 4 | 4 | 0 | — |
| `pert_walls_01` | 8×16 | 88 | 88 | 0 | — |
| `pert_walls_02` | 8×16 | 50 | 50 | 0 | — |
| `pert_walls_03` | 8×16 | 20 | 20 | 0 | — |
| `pert_walls_decayingwallpaper` | 8×16 | 70 | 70 | 4 | Portão de Cerca |
| `pert_walls_detailing_01` | 8×16 | 4 | 4 | 0 | — |
| `pert_walls_wallpaper_1` | 8×16 | 96 | 96 | 0 | — |
| `pert_walls_wallpaper_2` | 8×16 | 64 | 64 | 0 | — |
| `pert_walls_wallpaper_3` | 8×16 | 128 | 128 | 0 | — |
| `scrooby_fixtures_doors_fences_01` | 8×8 | 8 | 8 | 0 | — |
| `scrooby_walls_01` | 8×16 | 14 | 14 | 0 | — |
| `zed_graffiti_01` | 8×16 | 81 | 81 | 0 | — |

### Tilesets: Atlanta

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `air-conditioning_LD` | 8×16 | 45 | 45 | 0 | — |
| `bridge_LD` | 8×16 | 32 | 32 | 0 | — |
| `church_LD` | 8×16 | 12 | 12 | 12 | Jesus Christ; church 1; church 2; church 3 |
| `curtains_01_LD` | 8×13 | 88 | 88 | 88 | Cortina; Cortina Longa Bege |
| `curtains_02_LD` | 8×13 | 88 | 88 | 88 | Cortina; Cortina Longa Bege |
| `curtains_03_LD` | 8×13 | 88 | 88 | 88 | Cortina; Cortina Longa Bege |
| `detailing_02_LD` | 8×16 | 40 | 40 | 0 | — |
| `detailing_LD` | 8×16 | 99 | 99 | 0 | — |
| `detailing_walls_LD` | 8×16 | 11 | 11 | 0 | — |
| `detailing_win_LD` | 8×16 | 2 | 2 | 0 | — |
| `door_02_LD` | 8×16 | 22 | 22 | 0 | — |
| `door_03_LD` | 8×16 | 80 | 80 | 80 | door 1; door 2; door 3; door 4 |
| `door_04_LD` | 8×16 | 8 | 8 | 8 | Dragon Ball door_LD; ES green door_LD |
| `door_LD` | 8×16 | 32 | 32 | 32 | Porta; ES wood door_LD |
| `Elainesky_ES` | 8×16 | 100 | 100 | 20 | ES Fridge; ES green furniture; ES Rattan storage basket; ES Wooden shelves |
| `Elainesky_ES_02` | 8×16 | 74 | 74 | 43 | Wooden gear_LD ; windmill 3_1_LD; windmill 3_2_LD; windmill 3_3_LD |
| `Elainesky_ES_02_on` | 8×16 | 42 | 42 | 0 | — |
| `farm_LD` | 8×16 | 4 | 4 | 0 | — |
| `floor_liuding` | 8×16 | 76 | 76 | 15 | Piso de Cedro Vertical; bituminous pavement; Piso Liso Branco; Vinyl Flooring |
| `frames_L` | 8×16 | 30 | 30 | 0 | — |
| `furniture_02_LD` | 8×16 | 14 | 14 | 10 | military fence 1; Barreira de Concreto; Concrete Road Block1 |
| `furniture_LD` | 8×16 | 6 | 6 | 6 | Georgia State Flag; Georgia State Seal; Federal Government of Atlanta |
| `garage_LD` | 8×16 | 57 | 57 | 5 | water floor_LD ; ming shi Crate_LD |
| `grime_wall_LD` | 8×16 | 8 | 8 | 0 | — |
| `guns` | 8×16 | 8 | 8 | 4 | red airdrop box; blue airdrop box; green airdrop box; pink airdrop box |
| `haima_LD` | 8×16 | 46 | 46 | 44 | Dragon Ball_house 1F_LD; Dragon Ball_house 2F_LD; Dragon Ball_house 2F_1_1_LD; Dragon Ball_house 2F_1_2_LD |
| `king county_LD` | 8×16 | 85 | 85 | 26 | king county sign01; Metal closet; Police gun rack; Police bullet cabinet |
| `LiuDing_1` | 8×16 | 120 | 120 | 36 | Janela com Azulejos; Janela; corpse 3; corpse 2 |
| `LiuDing_2` | 8×16 | 65 | 65 | 12 | Janela com Azulejos; Janela; Porta |
| `mingshi` | 8×16 | 100 | 100 | 15 | mingshi Spring Festival couplets_LD; ming shi Sign_LD; ming shi _LD |
| `mingshi_on` | 8×16 | 8 | 8 | 0 | — |
| `mingshi02` | 8×16 | 96 | 96 | 0 | — |
| `mingshi03` | 8×16 | 96 | 96 | 0 | — |
| `MK10` | 8×16 | 44 | 44 | 4 | machine gun; Rick sheriffs hat; Rick Sheriff Backpack |
| `music_LD` | 8×16 | 23 | 23 | 11 | yin xiang; Jaguar Sunburst ; Kurt Cobain; NIRVANA |
| `oujinjin_LD` | 8×16 | 32 | 32 | 32 | oujinjin furniture 01_LD; oujinjin furniture 02_LD; oujinjin furniture 03_LD; oujinjin furniture 04_LD |
| `prison_02_LD` | 8×16 | 20 | 20 | 20 | BLOCK A; BLOCK B; BLOCK C; BLOCK D |
| `prison_03_LD` | 8×16 | 66 | 66 | 0 | — |
| `prison_LD` | 8×16 | 105 | 105 | 5 | Janela; STOP 1 |
| `railings_LD` | 8×64 | 36 | 36 | 0 | — |
| `roadsigns_LD` | 8×16 | 21 | 21 | 21 | Atlanta signs4; Atlanta signs5; Atlanta signs2; Atlanta signs1 |
| `robin_LD` | 8×16 | 36 | 36 | 32 | fufu claw _LD; fufu rug _LD; robin _LD |
| `robin_LD_on` | 8×16 | 8 | 8 | 0 | — |
| `roof_02_LD` | 8×16 | 116 | 116 | 0 | — |
| `roof_03_LD` | 8×16 | 116 | 116 | 0 | — |
| `roof_04_LD` | 8×16 | 84 | 84 | 0 | — |
| `roof_05_LD` | 8×16 | 32 | 32 | 0 | — |
| `roof_LD` | 8×16 | 6 | 6 | 0 | — |
| `rugs_LD` | 8×16 | 90 | 90 | 9 | zhizi rug _LD |
| `rugs_special_LD` | 8×16 | 30 | 30 | 0 | — |
| `salmon` | 8×16 | 40 | 40 | 32 | high country salmon; store Table; store Chair; Fish shop Sign |
| `salmon_on` | 8×16 | 8 | 8 | 0 | — |
| `seating_LD` | 8×16 | 19 | 19 | 18 | Assento de Bar de Couro; Red Oakwood Shelves; ceiling Bookshelf; Red wood Shelves |
| `signs_02_LD` | 8×16 | 39 | 39 | 27 | RED EYE BAIL BONDS; storewide sale; IRON PALM Tattoo Shop; Tattoo Shop LIGHT |
| `signs_LD` | 8×16 | 61 | 61 | 11 | PUBLIC PARKING; PUBLIC PARKING 2; Hilton parking; EXIT ONLY |
| `sophia` | 8×16 | 25 | 25 | 2 | Piso de Cedro Vertical |
| `stairs_LD` | 8×16 | 3 | 3 | 0 | — |
| `Survivor Community_furniture_LD` | 8×16 | 38 | 38 | 10 | Electric pole NW _LD; Electric pole TOP NW _LD; Electric pole SW _LD; Electric pole TOP SW _LD |
| `Survivor Community_LD` | 8×16 | 10 | 10 | 0 | — |
| `Survivor Community_sign_LD` | 8×16 | 92 | 92 | 92 | vinifan _LD; chun zi _LD; shi san _LD; Raccoon City Car Model_LD |
| `Survivor Community_sign_LD_on` | 8×16 | 88 | 88 | 0 | — |
| `survivors_furniture_LD` | 8×16 | 24 | 24 | 0 | — |
| `trafficlines_02_LD` | 8×16 | 43 | 43 | 0 | — |
| `trafficlines_basketball_LD` | 8×16 | 90 | 90 | 8 | basketball stands; basketball stands_02 |
| `trafficlines_LD` | 8×16 | 116 | 116 | 4 | Accessible parking space |
| `Transparent_Floor_LD` | 8×16 | 48 | 48 | 0 | — |
| `trashcontainers_LD` | 8×16 | 3 | 3 | 3 | Lobby trash bin; Bin |
| `walls` | 8×16 | 91 | 91 | 0 | — |
| `walls_02_LD` | 8×16 | 120 | 120 | 0 | — |
| `walls_03_LD` | 8×16 | 96 | 96 | 11 | Glass dome; Glass dome_2; Hertz automobile lease; STEAK HOUSE |
| `walls_04_LD` | 8×16 | 36 | 36 | 0 | — |
| `walls_05_LD` | 8×16 | 46 | 46 | 0 | — |
| `walls01_house_LD` | 8×16 | 16 | 16 | 0 | — |
| `windows_02_LD` | 8×16 | 72 | 72 | 72 | Janela |
| `windows_LD` | 8×16 | 70 | 70 | 32 | Janela |
| `windows_wall_LD` | 8×16 | 24 | 24 | 0 | — |
| `zhizi` | 8×16 | 8 | 8 | 8 | zhizi Fridge_LD; Anon sofa _LD |

### Tilesets: Rocco's Tiles

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `Overlays_Roccos_Tiles_Counters` | 8×16 | 22 | 22 | 0 | — |
| `Overlays_Roccos_Tiles_Locker_01` | 8×16 | 36 | 36 | 0 | — |
| `Overlays_Roccos_Tiles_Shelf_01` | 8×16 | 60 | 60 | 0 | — |
| `Overlays_Roccos_Tiles_Store_01` | 8×8 | 16 | 16 | 0 | — |
| `Roccos_Tiles_Appliances_01` | 8×8 | 44 | 44 | 44 | New Empty Water Dispenser; New Water Dispenser; Old Empty Water Dispenser; Old Water Dispenser |
| `Roccos_Tiles_Appliances_01_on` | 8×8 | 8 | 8 | 0 | — |
| `Roccos_Tiles_Bathroom` | 8×16 | 9 | 9 | 8 | Large White Bathtub; White Squat Toilet |
| `Roccos_Tiles_BrickWall_01` | 8×8 | 64 | 64 | 0 | — |
| `Roccos_Tiles_Case_01` | 8×8 | 48 | 48 | 48 | Flight Case Black; Flight Case Blue; Flight Case Green; Flight Case Red |
| `Roccos_Tiles_Case_02` | 8×8 | 22 | 22 | 22 | White Shoe Box; Raw Shoe Box; Old Wooden Crate; Old Wooden 2 Crate |
| `Roccos_Tiles_Construction_01` | 8×8 | 11 | 11 | 11 | Wooden Plank Construction; Wooden Wall Frame Construction; Wooden Door Construction; Timber Construction |
| `Roccos_Tiles_Counters_01` | 8×16 | 64 | 64 | 64 | A Raw Counter; A Raw Corner Counter; B Raw Counter; B Raw Corner Counter |
| `Roccos_Tiles_Counters_02` | 8×16 | 64 | 64 | 64 | A Brown Counter; A Brown Corner Counter; B Brown Counter; B Brown Corner Counter |
| `Roccos_Tiles_Counters_03` | 8×16 | 64 | 64 | 64 | A Blue Counter; A Blue Corner Counter; B Blue Counter; B Blue Corner Counter |
| `Roccos_Tiles_Counters_04` | 8×16 | 64 | 64 | 64 | A Coffee Counter; A Coffee Corner Counter; B Coffee Counter; B Coffee Corner Counter |
| `Roccos_Tiles_Counters_05` | 8×16 | 64 | 64 | 64 | A Red Counter; A Red Corner Counter; B Red Counter; B Red Corner Counter |
| `Roccos_Tiles_Counters_06` | 8×16 | 64 | 64 | 64 | A Green Counter; A Green Corner Counter; B Green Counter; B Green Corner Counter |
| `Roccos_Tiles_Counters_07` | 8×16 | 64 | 64 | 64 | A White Counter; A White Corner Counter; B White Counter; B White Corner Counter |
| `Roccos_Tiles_Desk_01` | 8×8 | 8 | 8 | 8 | RG Office Desk |
| `Roccos_Tiles_Fencing_01` | 8×8 | 28 | 28 | 0 | — |
| `Roccos_Tiles_Fencing_02` | 8×8 | 28 | 28 | 16 | Raw Metal Street Fence; Kentucky Metal Street Fence; Grass Metal Street Fence; Wake Metal Street Fence |
| `Roccos_Tiles_FloorDec_01` | 8×16 | 66 | 66 | 0 | — |
| `Roccos_Tiles_FloorDec_02` | 8×8 | 24 | 24 | 0 | — |
| `Roccos_Tiles_FloorPaint_01` | 8×8 | 6 | 6 | 0 | — |
| `Roccos_Tiles_Graffitti_01` | 8×8 | 23 | 23 | 0 | — |
| `Roccos_Tiles_Locker_01` | 8×16 | 56 | 56 | 56 | Green Military Small Locker; Blue Military Small Locker; Brown Military Small Locker; Black Military Small Locker |
| `Roccos_Tiles_Office_01` | 8×8 | 52 | 52 | 52 | A Yellow Filing Cabinet; A Silvery Filing Cabinet; A Blue Filing Cabinet; A Red Filing Cabinet |
| `Roccos_Tiles_Plants_01` | 8×16 | 128 | 128 | 128 | Planter Empty; Planter Green Bush; Planter Soybeans; Planter Mint |
| `Roccos_Tiles_Plants_02` | 8×16 | 51 | 51 | 50 | A Garden Pot; B Garden Pot; C Garden Pot; D Garden Pot |
| `Roccos_Tiles_Plants_03` | 8×16 | 112 | 112 | 0 | — |
| `Roccos_Tiles_Poster_01` | 8×8 | 3 | 3 | 3 | portrait Sam Dicky; portrait Skeleton; portrait Casey Brown |
| `Roccos_Tiles_Poster_02` | 8×8 | 8 | 8 | 8 | Poster Bakery Menu; Poster Bakery1; Poster Florist1; Poster Florist2 |
| `Roccos_Tiles_Props_01` | 8×8 | 24 | 24 | 24 | Green Casino Slots; Blue Casino Slots; Yellow Casino Slots; Purple Casino Slots |
| `Roccos_Tiles_Props_02` | 8×8 | 36 | 36 | 36 | Green Unknow Oven; Rat Dead Body; C4 Mail Box; Blue Homeless Dumpster |
| `Roccos_Tiles_Rug_01` | 8×8 | 16 | 16 | 16 | New Diamond Pattern Mat Rug; Old Diamond Pattern Mat Rug; YGR Diamond Pattern Mat Rug; Blue Diamond Pattern Mat Rug |
| `Roccos_Tiles_Shelf_01` | 8×8 | 30 | 30 | 30 | Large Metal Yellow Modern Shelves; Large Metal Red Modern Shelves; Large Metal Green Modern Shelves; Large Metal White Modern Shelves |
| `Roccos_Tiles_Signs_01` | 8×8 | 49 | 49 | 0 | — |
| `Roccos_Tiles_Signs_01_on` | 8×8 | 15 | 15 | 0 | — |
| `Roccos_Tiles_SpecialWall_01` | 8×16 | 30 | 30 | 0 | — |
| `Roccos_Tiles_SpecialWall_02` | 8×16 | 18 | 18 | 0 | — |
| `Roccos_Tiles_Store_01` | 8×8 | 24 | 24 | 16 | Store Red Metal Shelves; Store Green Metal Shelves; 3 Floor Little Metal Shelves; 2 Floor Little Metal Shelves |
| `Roccos_Tiles_StoreCounters_01` | 8×16 | 32 | 32 | 32 | A Raw Store Counter; A Raw Corner Store Counter; A White Store Counter; A White Corner Store Counter |
| `Roccos_Tiles_StoryProps_01` | 8×8 | 2 | 2 | 2 | Dont steal Store Sign |
| `Roccos_Tiles_Television_01` | 8×8 | 8 | 8 | 8 | Portable White Television; Portable Dark Television |
| `Roccos_Tiles_WallDecoration_01` | 8×8 | 10 | 10 | 0 | — |
| `Roccos_Tiles_WallDetailing_01` | 8×16 | 112 | 112 | 0 | — |
| `Roccos_Tiles_WoodenWall_01` | 8×8 | 64 | 64 | 0 | — |

### Tilesets: Ladders?! B42.20.4 [USE FOR NEW SAVES]

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `ladders_01` | 8×4 | 29 | 29 | 4 | Collapsible Ladder |

### Tilesets: 3D Gun Racks

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `tuna_weaponrack_01` | 8×3 | 24 | 24 | 24 | Tuna Gun Cabinet; Tuna Handgun Display Case; Tuna Armory Cabinet; Tuna Rifle Wall Rack |

### Tilesets: Bunker

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `abys` | 8×2 | 2 | 1 | 0 | — |
| `D` | 8×15 | 5 | 4 | 4 | door |
| `frame` | 8×5 | 2 | 2 | 0 | — |
| `Generator` | 8×34 | 3 | 3 | 0 | — |
| `water` | 8×15 | 6 | 6 | 1 | Water pump |

### Tilesets: Useful Barrels

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `useful_barrels_1` | 8×8 | 17 | 17 | 5 | Barril Verde-escuro; Barril Verde-claro; Barril Laranja |

### Tilesets: Excavation

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `fixtures_excavation_01` | 8×8 | 6 | 6 | 0 | — |
| `floors_excavation_01` | 8×8 | 1 | 0 | 0 | — |
| `walls_underground_dirt` | 8×8 | 8 | 8 | 0 | — |

### Tilesets: Hot Brass - Ammo Crafting

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `HotBrassReloadingBench` | 8×1 | 4 | 4 | 4 | HotBrassReloadingBench HotBrassReloadingBench |

### Tilesets: Underground Power Tap

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `UPT_tap` | 1×1 | 1 | 0 | 0 | — |

### Tilesets: Neat Building [B42.12]

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `NB_building_tiles_01` | 1×1 | 1 | 1 | 0 | — |

### Tilesets: pack

| Tileset | Grade | Tiles | Com imagem | Com nome | Exemplos |
| --- | ---: | ---: | ---: | ---: | --- |
| `alokin_test_sheet` | — | 39 | 39 | 0 | — |
| `bed_overlays_large` | — | 4 | 4 | 0 | — |
| `blends_natural_01_TEST` | — | 80 | 80 | 0 | — |
| `blood_floor_large` | — | 5 | 5 | 0 | — |
| `blood_floor_med` | — | 8 | 8 | 0 | — |
| `blood_floor_small` | — | 8 | 8 | 0 | — |
| `camping_03 (ayrton orio's conflicted copy 2025-09-10)` | — | 43 | 43 | 0 | — |
| `camping_04_on` | — | 32 | 32 | 0 | — |
| `constructedobjects_01_on` | — | 1 | 1 | 0 | — |
| `crafted_01_on` | — | 32 | 32 | 0 | — |
| `crafted_02_on` | — | 15 | 15 | 0 | — |
| `crafted_05_on` | — | 5 | 5 | 0 | — |
| `crafted_skins_drying_01` | — | 96 | 96 | 0 | — |
| `e_americanhollyJUMBO_1` | — | 5 | 5 | 0 | — |
| `e_americanhollyJUMBOXL_1` | — | 2 | 2 | 0 | — |
| `e_americanhollyJUMBOXXL_1` | — | 2 | 2 | 0 | — |
| `e_americanlindenJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_americanlindenJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_americanlindenJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_canadianhemlockJUMBO_1` | — | 5 | 5 | 0 | — |
| `e_canadianhemlockJUMBOXL_1` | — | 2 | 2 | 0 | — |
| `e_canadianhemlockJUMBOXXL_1` | — | 2 | 2 | 0 | — |
| `e_carolinasilverbellJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_carolinasilverbellJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_carolinasilverbellJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_cockspurhawthornJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_cockspurhawthornJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_cockspurhawthornJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_dogwoodJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_dogwoodJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_dogwoodJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_easternredbudJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_easternredbudJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_easternredbudJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_newgrass_1_depth` | — | 90 | 90 | 0 | — |
| `e_redmapleJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_redmapleJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_redmapleJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_riverbirchJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_riverbirchJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_riverbirchJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `e_virginiapineJUMBO_1` | — | 4 | 4 | 0 | — |
| `e_virginiapineJUMBOXL_1` | — | 2 | 2 | 0 | — |
| `e_virginiapineJUMBOXXL_1` | — | 2 | 2 | 0 | — |
| `e_yellowwoodJUMBO_1` | — | 12 | 12 | 0 | — |
| `e_yellowwoodJUMBOXL_1` | — | 6 | 6 | 0 | — |
| `e_yellowwoodJUMBOXXL_1` | — | 6 | 6 | 0 | — |
| `fencing_damaged_01b` | — | 116 | 116 | 0 | — |
| `Fire_01` | — | 30 | 30 | 0 | — |
| `Fire_02` | — | 30 | 30 | 0 | — |
| `Fire_03` | — | 30 | 30 | 0 | — |
| `floors_excavation` | — | 1 | 1 | 0 | — |
| `Giblet_00` | — | 3 | 3 | 0 | — |
| `Giblet_01` | — | 3 | 3 | 0 | — |
| `location_orphanage` | — | 10 | 10 | 0 | — |
| `melos_tiles_furniture_bedding_overlays_01` | — | 128 | 128 | 0 | — |
| `overlay_graffiti_wall_02` | — | 64 | 64 | 0 | — |
| `pert_walls_bathroom_01` | — | 12 | 12 | 0 | — |
| `Rain_00` | — | 1 | 1 | 0 | — |
| `RainSplash_00` | — | 4 | 4 | 0 | — |
| `signs_billboards` | — | 44 | 44 | 0 | — |
| `Smoke_01` | — | 30 | 30 | 0 | — |
| `Smoke_02` | — | 30 | 30 | 0 | — |
| `Smoke_03` | — | 30 | 30 | 0 | — |
| `TileThuztorSymbolDisease` | — | 1 | 1 | 0 | — |
| `TileThuztorSymbolPests` | — | 1 | 1 | 0 | — |
| `TileThuztorSymbolPIXEL` | — | 1 | 1 | 0 | — |
| `TileThuztorSymbolWaterDrop` | — | 1 | 1 | 0 | — |
| `walls_exterior_house_14` | — | 32 | 32 | 0 | — |
| `walls_exterior_roofs_30_21` | — | 36 | 36 | 0 | — |
