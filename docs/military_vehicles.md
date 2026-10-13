# Veículos militares

> Gerado por `node tools/military_vehicles_doc.js` a partir de `data/vehicles.js` (extraído em 2026-09-20). Não edite à mão: rode `node build_vehicles.js` e depois o script para atualizar.

O jogo não marca um veículo como militar: nenhum script de veículo tem um campo para isso. Nenhum veículo do jogo base entra na lista: todos vêm de mods. A lista deste catálogo é mantida à mão em `tools/military_vehicles_doc.js` (`MILITARY`), por ID, com a classe e o papel de cada veículo. Cada um é identificado por `<Módulo>.<Nome>`, ex.: `Base.M60A3`; é esse ID que o jogo usa, ex.: `addVehicle("Base.M60A3", getPlayer():getX()+3, getPlayer():getY(), getPlayer():getZ())`, o comando que o botão "Copiar spawn (console)" da aba Veículos copia.

Total: **21 veículos militares** de 10 mods, 3 deles destroços (queimados), 9 com nome em PT-BR.

Para a lista não ficar desatualizada, o script falha quando acha em `data/vehicles.js` um veículo com pista de militar (uma skin com `USMC`, `NATO`, `army`, `camo`, `desert`, `milit` ou `usamriid` no nome, sem diferenciar maiúsculas; um compartimento de arma montada, com `Browning`, `Cannon`, `Coax`, `AmmoStor`, `GunCab` ou `M240` no nome; HMMWV, Humvee ou Hummer no ID ou no nome; ou um mod com "military" no nome) que não está nem na lista nem nas [exclusões](#fora-do-catálogo). Também falha se um ID das duas listas sumir dos dados.

## Como os veículos são mapeados

`build_vehicles.js` lê os blocos `vehicle`, `template vehicle` e `model` de todo `media/scripts/**/*.txt` que os tenha, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):

1. **Herança**: as propriedades e as `part` vêm do veículo e da cadeia de `template!`, além das `part` incluídas por `template = X` ou `template = X/part/Y`.
2. **Mods**: a origem (`mod`) é o `name=` do `mod.info` do mod que declara o veículo (sem `name=`, o nome da pasta do mod). Se dois mods declaram o mesmo ID, vale o último lido; não há registro de quem foi sobrescrito.
3. **Nomes**: `pt` e `en` vêm de `IGUI_VehicleName<Nome>` em `IG_UI` (`Translate/PTBR` e `Translate/EN`), do jogo base e dos mods.
4. **Compartimentos**: as `part` com bloco `container` (ou com `TruckBed`, `Trunk`, `GloveBox` ou `Seat` no nome) e a capacidade de cada uma: a `capacity` do `container` ou, sem ela, a do tamanho em `itemType` (`Small`/`Normal`/`Big` `Trunk` ou `GasTank`); as de capacidade zero ficam de fora. `trunk` soma as que têm `TruckBed`, `Trunk` ou `Cargo` no nome, menos as com `Gas`; `gas` é a do `GasTank`. Por isso os blindados com esteira mostram porta-malas 0: a carga deles fica em compartimentos com outros nomes (`AmmoStor`, `TankRoof`...).
5. **Skins**: os blocos `skin` do veículo (ou do primeiro template que os tenha). Só as 6 primeiras viram miniatura em `vehicles/` e aparecem no painel da aba Veículos.
6. **Destroço**: `wreck` é `true` quando o nome tem `Burnt`, `Smashed` ou `Wreck`, ou o script tem `neverSpawnKey = true`. A aba Veículos esconde os destroços até marcar "destruídos".

## Formato de `data/vehicles.js`

Os veículos militares ficam junto com os demais:

```js
window.PZ_VEHICLES = {
  generated: "2026-09-20T20:00:46.844Z",   // data da extração
  vehicles: [{ id, name, mod, base, pt, en, mech, seats, trunk, gas, containers, skins, thumbs, wreck, m3d, stats }, ...]
};
```

| Campo | Descrição |
| --- | --- |
| `id` | `<Módulo>.<Nome>`, ex.: `Base.M60A3`. |
| `name` | Nome do bloco `vehicle` no script. |
| `mod` | `vanilla` ou o `name=` do `mod.info` do mod (ou o nome da pasta dele). |
| `base` | O `template!` do veículo, ou `""`. |
| `pt`, `en` | Nomes de exibição, ou `""`. |
| `mech` | `mechanicType` (1 se faltar). O filtro "Tipo" da aba Veículos parte dele, mas põe em "Reboque" todo veículo sem `engineForce`, o que inclui os destroços. |
| `seats` | `seats`, ou o número de `part Seat*`. |
| `trunk`, `gas` | Capacidade do porta-malas e do tanque (veja acima). |
| `containers` | `[{ part, cap }]`, todos os compartimentos. |
| `skins`, `thumbs` | Texturas das skins e as miniaturas copiadas para `vehicles/`. |
| `wreck` | Destroço (veja acima). |
| `m3d` | Montagem do modelo 3D (corpo, peças, rodas), ou `null`. |
| `stats` | Propriedades numéricas do script: `mass`, `engineForce`, `maxSpeed`, `frontEndHealth`, `rearEndHealth`, `playerDamageProtection`, `model` etc. |

## Por classe

A classe e o papel também são da lista do script, não do jogo. **Blindado**: tanques e veículos de combate ou transporte blindados. **Utilitário**: jipes e HMMWV. **Caminhão**: caminhões de carga, tanque, guincho e contra incêndio. **Reboque**: reboques de carga militares.

| Classe | Veículos | Destroços |
| --- | ---: | ---: |
| [Blindado](#blindado) | 6 | 2 |
| [Utilitário](#utilitário) | 6 | 1 |
| [Caminhão](#caminhão) | 6 | 0 |
| [Reboque](#reboque) | 3 | 0 |

## Por origem

Na aba Veículos, o filtro "Mod" da barra lateral ou `mod:<trecho>` na busca (ex.: `mod:oshkosh`, `mod:papa_chad`) mostra os veículos de cada mod.

| Mod | Veículos | Destroços |
| --- | ---: | ---: |
| '78 AM General M35 Series Trucks | 4 | 0 |
| '86 Oshkosh P19A + Military Trailers | 4 | 0 |
| '92 AM General M998 + M101A3 Trailer | 3 | 1 |
| Fallout Hummer by Papa_Chad | 2 | 0 |
| R.U. BMP-2 by Papa_Chad | 2 | 1 |
| U.S. M60A3 Drive and Shoot by Papa_Chad | 2 | 1 |
| '89 LAND ROVER Defender | 1 | 0 |
| Cobb Motor Company M540 | 1 | 0 |
| Lock-Mart Industries M577 | 1 | 0 |
| U.S. M998 Humvee by Papa_Chad | 1 | 0 |

## Pinturas

Cada skin é uma pintura do mesmo modelo; o painel de debug "Spawn Vehicle" do jogo deixa escolher qual. O nome da pintura vem do nome da textura, o que vem depois de `_Shell_` ou do prefixo do veículo; aqui sem diferenciar maiúsculas. "Veículos" conta quantos veículos militares têm a pintura.

| Pintura | Veículos |
| --- | ---: |
| `camo` | 13 |
| `deserttan` | 10 |
| `natogreen` | 10 |
| `usmcgreen` | 10 |
| `black` | 6 |
| `camocombo` | 6 |
| `desertcamo` | 4 |
| `green` | 4 |
| `desert` | 3 |
| `burned` | 2 |
| `fdredblack` | 2 |
| `hummer_grey` | 2 |
| `hummer_grey_bos` | 2 |
| `hummer_grey_vault_tec` | 2 |
| `padrão` | 2 |
| `black_burnt` | 1 |
| `camo_2` | 1 |
| `camo_3` | 1 |
| `camo_burnt` | 1 |
| `camocombo_burnt` | 1 |
| `deserttan_burnt` | 1 |
| `greenblack` | 1 |
| `grey` | 1 |
| `natogreen_burnt` | 1 |
| `usmcgreen_burnt` | 1 |

Têm mais skins do que as 6 que viram miniatura: _M60A3_ (8), _'78 AM General M35A2_ (7), _'78 AM General M49A2C Fuel Tanker_ (7), _'78 AM General M50A3 Water Tanker_ (8), _'78 AM General M62 Wrecker_ (8).

## Catálogo

Todos os veículos militares por classe, em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. As colunas são os campos de `data/vehicles.js`: porta-malas é `trunk`, tanque é `gas` (litros), vel. máx. é `maxSpeed`, motor é `engineForce`, massa é `mass`, proteção é `playerDamageProtection` e vida é `frontEndHealth` / `rearEndHealth`. "Outros compartimentos" lista os de `containers` fora o tanque, os pneus e as `part` curinga (`Seat*`). Os destroços têm quase tudo zerado no script; "—" marca o zero.

### Blindado

| Nome | ID | Origem | Papel | Assentos | Porta-malas | Tanque | Vel. máx. | Motor | Massa | Proteção | Vida | Outros compartimentos | Pinturas |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| `BMP-2` | `Base.BMP-2` | R.U. BMP-2 by Papa_Chad | veículo de combate de infantaria | 8 | — | 95 | 25 | 5.600 | 1.104 | 0,8 | 5.000 / 3.000 | `Cannon30mm2A42` 60, `PKT_Coax` 5, `GloveBox` 20, `TankRoof` 30 | `Green`, `Desert`, `Grey`, `Camo` |
| `BMP-2Burnt` (destroço) | `Base.BMP-2Burnt` | R.U. BMP-2 by Papa_Chad | veículo de combate de infantaria | — | — | — | — | — | 1.104 | — | — | — | `Burned` |
| _Cobb Motor Company M540_ | `Base.cobbM540` | Cobb Motor Company M540 | blindado (ARC de _Aliens_, segundo o mod) | 6 | 200 | 150 | 55 | 5.000 | 1.050 | 1,2 | 3.500 / 3.000 | `M540Trunk` 200, `M540GunCab` 25, `GloveBox` 10 | `padrão` |
| Lock-Mart Industries M577 | `Base.lockMartM577` | Lock-Mart Industries M577 | transporte de tropas (APC de _Aliens_, segundo o mod) | 15 | 400 | 150 | 55 | 5.000 | 1.150 | 1,2 | 3.500 / 3.000 | `M577Trunk` 400, `M577ToolboxLeft` 15, `M577ToolboxRight` 15, `M577GunCab` 25, `GloveBox` 10 | `padrão` |
| _M60A3_ | `Base.M60A3` | U.S. M60A3 Drive and Shoot by Papa_Chad | tanque | 2 | — | 95 | 20 | 5.600 | 1.104 | 0,8 | 5.000 / 3.000 | `M60A3_105mm_Driver` 6, `M240_Coax_Driver` 15, `AmmoStor` 180, `GloveBox` 20, `TankRoof` 30 | `Green` ×3, `Desert`, `Camo`, `Camo_2`, `Camo_3` ×2 |
| `M60A3Burnt` (destroço) | `Base.M60A3Burnt` | U.S. M60A3 Drive and Shoot by Papa_Chad | tanque | — | — | — | — | — | 1.104 | — | — | — | `Burned` |

### Utilitário

| Nome | ID | Origem | Papel | Assentos | Porta-malas | Tanque | Vel. máx. | Motor | Massa | Proteção | Vida | Outros compartimentos | Pinturas |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| AM General M998 HMMWV 92 | `Base.92amgeneralM998` | '92 AM General M998 + M101A3 Trailer | HMMWV | 4 | 110 | 95 | 85 | 4.451 | 850 | 1,3 | 1.500 / 1.350 | `M998Trunk` 110, `DAMNGunrack` 5, `GloveBox` 7 | `USMCgreen`, `NATOgreen`, `DesertTan`, `camo`, `camoCombo`, `black` |
| AM General M998 HMMWV 92 Queimado (destroço) | `Base.92amgeneralM998Burnt` | '92 AM General M998 + M101A3 Trailer | HMMWV | — | — | — | — | — | 1.100 | — | — | — | `USMCgreen_Burnt`, `NATOgreen_Burnt`, `DesertTan_Burnt`, `camo_Burnt`, `camoCombo_Burnt`, `black_Burnt` |
| _Fallout Hummer_ | `Base.Fallout_Hummer` | Fallout Hummer by Papa_Chad | HMMWV com pinturas de _Fallout_ | 4 | 50 | 95 | 85 | 4.500 | 850 | 0,8 | 1.500 / 1.350 | `TruckBedOpen` 50 | `Hummer_Grey_BOS`, `Hummer_Grey`, `Hummer_Grey_Vault_Tec` |
| _Fallout Hummer with Turret_ | `Base.Fallout_Hummer_Turret` | Fallout Hummer by Papa_Chad | HMMWV com pinturas de _Fallout_ | 4 | 50 | 95 | 85 | 4.500 | 850 | 0,8 | 1.500 / 1.350 | `TruckBedOpen` 50, `Browning_M2` 10 | `Hummer_Grey_BOS`, `Hummer_Grey`, `Hummer_Grey_Vault_Tec` |
| Land Rover Wolf '89 | `Base.89defenderWolf` | '89 LAND ROVER Defender | Land Rover militar | 2 | 140 | 49 | 75 | 4.300 | 790 | 1,4 | 150 / 165 | `DEF89Trunk` 140, `DAMNGunrack` 5, `DEF89CenterConsole` 8, `GloveBox` 7 | `green`, `greenBlack` |
| _M998 HMMWV Humvee_ | `Base.M998_Humvee` | U.S. M998 Humvee by Papa_Chad | HMMWV | 5 | 110 | 95 | 85 | 4.500 | 850 | 0,8 | 1.500 / 1.350 | `TruckBed` 110, `Browning_M2` 10 | `Green`, `Camo`, `Desert` |

### Caminhão

| Nome | ID | Origem | Papel | Assentos | Porta-malas | Tanque | Vel. máx. | Motor | Massa | Proteção | Vida | Outros compartimentos | Pinturas |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| _'78 AM General M35A2_ | `Base.78amgeneralM35A2` | '78 AM General M35 Series Trucks | carga | 2 | 620 | 90 | 60 | 4.350 | 1.000 | 1,3 | 3.001 / 1.500 | `M35A2Trunk` 620, `DAMNGunrack` 5, `GloveBox` 8 | `USMCgreen`, `desertTan`, `desertCamo`, `NATOgreen`, `camo`, `camoCombo`, `black` |
| _'78 AM General M49A2C Fuel Tanker_ | `Base.78amgeneralM49A2C` | '78 AM General M35 Series Trucks | tanque de combustível | 2 | 20 | 90 | 60 | 4.350 | 1.075 | 1,3 | 3.001 / 1.500 | `M49A2CTrunk` 20, `DAMNGunrack` 5, `GloveBox` 8 | `USMCgreen`, `desertTan`, `desertCamo`, `NATOgreen`, `camo`, `camoCombo`, `black` |
| _'78 AM General M50A3 Water Tanker_ | `Base.78amgeneralM50A3` | '78 AM General M35 Series Trucks | tanque de água | 2 | 20 | 90 | 60 | 4.350 | 1.070 | 1,3 | 3.001 / 1.500 | `M49A2CTrunk` 20, `DAMNGunrack` 5, `GloveBox` 8 | `USMCgreen`, `desertTan`, `desertCamo`, `NATOgreen`, `camo`, `camoCombo`, `black`, `FDredBlack` |
| _'78 AM General M62 Wrecker_ | `Base.78amgeneralM62` | '78 AM General M35 Series Trucks | guincho | 2 | 35 | 90 | 55 | 5.550 | 1.050 | 1,3 | 3.001 / 1.500 | `M35A2Trunk` 35, `DAMNGunrack` 5, `GloveBox` 8 | `USMCgreen`, `desertTan`, `desertCamo`, `NATOgreen`, `camo`, `camoCombo`, `black`, `FDredBlack` |
| Oshkosh P19A USMC 86 | `Base.86oshkoshUSMC` | '86 Oshkosh P19A + Military Trailers | contra incêndio | 4 | 290 | 200 | 55 | 5.050 | 980 | 1,3 | 3.500 / 3.000 | `P19ABigTrunkCompartment0` 80, `P19ASmallTrunkCompartment1` 30, `P19ASmallTrunkCompartment2` 40, `P19ABigTrunkCompartment0b` 80, `P19ASmallTrunkCompartment1b` 30, `P19ASmallTrunkCompartment3b` 30, `GloveBox` 10 | `USMCGreen`, `NATOGreen`, `desertTan`, `camo` |
| P19A FRTR55 | `Base.86oshkoshFRTR55` | '86 Oshkosh P19A + Military Trailers | contra incêndio | 4 | 290 | 200 | 55 | 5.150 | 1.000 | 1,3 | 3.500 / 3.000 | `P19ABigTrunkCompartment0` 80, `P19ASmallTrunkCompartment1` 30, `P19ASmallTrunkCompartment2` 40, `P19ABigTrunkCompartment0b` 80, `P19ASmallTrunkCompartment1b` 30, `P19ASmallTrunkCompartment3b` 30, `GloveBox` 10 | `NATOGreen`, `USMCGreen`, `desertTan`, `camo` |

### Reboque

| Nome | ID | Origem | Papel | Assentos | Porta-malas | Tanque | Vel. máx. | Motor | Massa | Proteção | Vida | Outros compartimentos | Pinturas |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| Reboque de Carga M101A3 92 | `Base.TrailerM101A3cargo` | '92 AM General M998 + M101A3 Trailer | carga | 2 | 180 | — | 70 | 3.600 | 250 | 0,8 | 150 / 150 | `M101A3Trunk` 180 | `USMCgreen`, `NATOgreen`, `DesertTan`, `camo`, `camoCombo`, `black` |
| Reboque M1082 | `Base.TrailerM1082` | '86 Oshkosh P19A + Military Trailers | carga | 2 | 380 | — | 70 | 3.600 | 200 | 1 | 150 / 150 | `TruckBed` 380, `M10XXToolboxLeft` 10, `M10XXToolboxRight` 10 | `USMCGreen`, `NATOGreen`, `desertTan`, `camo` |
| Reboque M1095 | `Base.TrailerM1095` | '86 Oshkosh P19A + Military Trailers | carga | 2 | 490 | — | 70 | 3.600 | 200 | 1 | 150 / 150 | `TruckBed` 490, `M10XXToolboxLeft` 10, `M10XXToolboxRight` 10 | `USMCGreen`, `NATOGreen`, `desertTan`, `camo` |

## Fora do catálogo

Veículos que têm pista de militar, ou são parentes próximos de um veículo militar, mas não entram na lista (`EXCLUDED` no script):

| IDs | Por quê |
| --- | --- |
| `Base.86oshkoshKYFD` | Mesmo Oshkosh P19A, mas com pinturas de bombeiros civis (KYFD: vermelha e amarela), nenhuma militar. |
| `Base.86oshkoshP19ABurnt` | Destroço do Oshkosh P19A sem pintura própria (`Burnt`, `Burnt2`): os dados não dizem se é o militar ou o KYFD. |
| `Base.Trailer54FlyingCloud22` | Trailer de camping Airstream; só uma das pinturas é `usamriid` (instituto de pesquisa do Exército dos EUA). |
| `Base.PickUpTruck_Camo`, `Base.PickUpVan_Camo` | Jogo base: picapes civis (`base` `PickUpTruck`/`PickUpVan`) com pintura camuflada. |
| `Base.89defender90`, `Base.89defender90utility`, `Base.89defender110`, `Base.89defender110utility`, `Base.89defender130`, `Base.Trailer89defender` | Versões civis do Land Rover Defender e o reboque dele, do mesmo mod do Wolf. |
| `Base.isoContainer2`, `Base.isoContainer3tanker`, `Base.isoContainer4`, `Base.isoContainer5`, `Base.TrailerISOcontainerM1`, `Base.TrailerISOcontainerM2`, `Base.TrailerISOcontainerM3tanker`, `Base.TrailerISOcontainerM4damaged`, `Base.TrailerISOcontainerS2` | Mod Containers!: contêineres ISO e reboques de contêiner; `army` e `camo` são só opções de pintura. |
