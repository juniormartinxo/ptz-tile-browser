# Lanternas

> Gerado por `node tools/flashlights_doc.js` a partir de `data/items.js` (extraído em 2026-09-28). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.

Uma **lanterna** é um item de script (`media/scripts`) com a tag `flashlight` em `Tags` (`base:flashlight` no jogo base; um mod pode declará-la sem o prefixo). São as lanternas de mão, a lanterna elétrica improvisada e as lanternas que se montam em armas. Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.HandTorch`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.HandTorch")`.

Total mapeado: **11 lanternas** de 3 origens (8 do jogo base), 8 com nome em PT-BR, 3 alteradas por outro mod e 0 ocultas por padrão na aba Itens. A de maior alcance é _Tactical Flashlight_ (`Base.KATTAJ1_TacticalFlashlight`), com `LightDistance` 28.

As outras 10 fontes de luz (itens com `LightStrength` sem a tag) e os itens que só têm "flashlight" ou "lantern" no ID ou no nome ficam fora do catálogo (veja [Fora do catálogo](#fora-do-catálogo)).

## Como as lanternas são mapeadas

`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):

1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"15"`, `"0.66"`, `"true"`).
2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.
3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.
4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que for achado, como `Item_<nome>` ou `<nome>`, nos packs de textura lidos (`UI`, `UI2`, `IconsMoveables`, `RadioIcons`, `ApComUI` e os `pack=` dos mods) ou nos `.png` soltos de `media/textures`. Sem nenhum, um item com `WorldObjectSprite` usa o sprite do tile.

Na aba Itens, a busca `tag:flashlight` traz exatamente as lanternas (a comparação é por trecho, sem o prefixo `base:` e sem diferenciar maiúsculas; `flashlightpillar` também casa). O filtro "Categoria → Fonte de Luz" da barra lateral traz mais 15 itens que não são lanternas e deixa de fora 3 lanternas (Peça de Arma).

## Formato de `data/items.js`

As lanternas ficam junto com os demais itens:

```js
window.PZ_ITEMS = {
  generated: "2026-09-28T16:29:54.165Z",   // data da extração
  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png
  cats: { pt: { LightSource: "Fonte de Luz", ... }, en: { ... } },   // nomes de DisplayCategory
  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]
};
```

| Campo | Descrição |
| --- | --- |
| `id` | `<Módulo>.<Nome>`, ex.: `Base.Torch`. |
| `mod` | `vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro. |
| `ovr` | Mods que redefiniram o item depois (propriedades mescladas por cima). |
| `type` | `ItemType` (ou `Type`, se faltar) sem `base:`, em minúsculas e só com letras. Nas lanternas: `drainable` ou `weaponpart`. |
| `cat` | `DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`). |
| `pt`, `en` | Nomes de exibição, ou `""`. |
| `icon` | `["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`. |
| `props` | Todas as propriedades do bloco `item`, como strings. Nas lanternas, as principais são `LightStrength`, `LightDistance`, `TorchCone`, `TorchDot`, `UseDelta` e `Weight`; nas para arma, também `MountOn` e `PartType`. |

## Por classe

A classe não é um campo do jogo: é dada pelo tipo do item e por `TorchCone`, por uma tabela mantida no script. O script falha se aparecer uma lanterna que nenhuma classe reconhece ou se uma classe ficar sem lanternas. Tags com `flashlight` nas lanternas: `base:flashlight` 10, `base:flashlightpillar` 4, `Flashlight` 1.

| Classe | Regra | Lanternas | Força | Alcance |
| --- | --- | ---: | ---: | ---: |
| [De mão](#de-mão) | `drainable` com `TorchCone = true` | 7 | 1.2–3 | 11–28 |
| [Ambiente](#ambiente) | `drainable` com `TorchCone = false` | 1 | 1.5 | 10 |
| [Para arma](#para-arma) | `weaponpart` | 3 | 1.3–1.8 | 15 |

## Por origem

| Origem | Lanternas | De mão | Ambiente | Para arma |
| --- | ---: | ---: | ---: | ---: |
| vanilla | 8 | 6 | 1 | 1 |
| Firearms B42 | 2 | 0 | 0 | 2 |
| KATTAJ1 Clothes Core | 1 | 1 | 0 | 0 |

## Por categoria

A `DisplayCategory`, que é o filtro "Categoria" da aba Itens.

| Categoria | Nome | Lanternas |
| --- | --- | ---: |
| `LightSource` | Fonte de Luz | 8 |
| `WeaponPart` | Peça de Arma | 3 |

## Propriedades

As 31 chaves que aparecem em `props` das lanternas, da mais comum à mais rara. Na aba Itens, `k:Chave` filtra quem tem a chave e `chave=valor` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (`+N` = outros N valores distintos).

| Propriedade | Lanternas | Valores |
| --- | ---: | --- |
| `ActivatedItem` | 11 | `true` 10, `TRUE` 1 |
| `DisplayCategory` | 11 | `LightSource` 8, `WeaponPart` 3 |
| `Icon` | 11 | `Flashlight2` 3, `FlashlightAngled_Black` 1, `FlashlightAngled_Green` 1, `Flashlight_Improvised` 1, `Lantern_Improvised` 1, +4 |
| `ItemType` | 11 | `base:drainable` 8, `base:weaponpart` 3 |
| `LightDistance` | 11 | `15` 6, `11` 2, `10` 1, `25` 1, `28` 1 |
| `LightStrength` | 11 | `1.5` 3, `1.2` 2, `1.3` 2, `1.8` 2, `2.0` 1, +1 |
| `MetalValue` | 11 | `10.0` 6, `15` 2, `20.0` 1, `5.0` 1, `10` 1 |
| `primaryAnimMask` | 11 | `HoldingTorchRight` 8, `HoldingAngleTorchRight` 2, `holdingbagright` 1 |
| `secondaryAnimMask` | 11 | `HoldingTorchLeft` 6, `HoldingAngleTorchLeft` 2, `HoldingHeavyTorchLeft` 2, `holdingbagleft` 1 |
| `SoundMap` | 11 | `Deactivate FlashlightOff` 10, `Deactivate FlashlightPenOff` 1 |
| `StaticModel` | 11 | `HandTorch` 2, `FlashLight_AngleHead` 1, `FlashLight_AngleHead_Army` 1, `FlashLight_Improvised` 1, `GunLight` 1, +5 |
| `Tags` | 11 | `base:flashlight;base:flashlightpillar` 4, `base:flashlight;base:usesbattery` 3, `base:flashlight;base:hasmetal;base:ignorezombiedensity` 2, `base:flashlight` 1, `Flashlight` 1 |
| `TorchCone` | 11 | `true` 9, `false` 1, `TRUE` 1 |
| `UseDelta` | 11 | `0.006` 3, `0.001` 3, `0.007` 2, `0.0057` 1, `0.008` 1, +1 |
| `Weight` | 11 | `0.5` 4, `0.2` 3, `1.0` 2, `2.0` 1, `0.1` 1 |
| `WorldStaticModel` | 11 | `HandTorchGround` 2, `FlashLight_AngleHead_Ground` 1, `FlashLight_AngleHead_Army_Ground` 1, `FlashLight_Improvised` 1, `Handgun_Light_Ground` 1, +5 |
| `TorchDot` | 10 | `0.66` 5, `0.5` 3, `0.53` 1, `0.75` 1 |
| `DisappearOnUse` | 9 | `false` 9 |
| `cantBeConsolided` | 8 | `true` 7, `TRUE` 1 |
| `Researchablerecipes` | 8 | `MakeImprovisedFlashlight;MakeImprovisedLantern` 6, `MakeImprovisedLantern` 1, `MakeImprovisedFlashlight` 1 |
| `KeepOnDeplete` | 6 | `true` 5, `True` 1 |
| `AimingTimeModifier` | 3 | `5` 2, `8` 1 |
| `AttachmentType` | 3 | `Webbing` 2, `FlashlightKATTAJ1` 1 |
| `MountOn` | 3 | `Base.Pistol;Base.PistolGlock;Base.Pistol2;Base.Pistol3;Base.Pistolm93r;Base.MP5_SMG;Base.MP5SD_SMG` 1, `Shotgun; ShotgunSawnoff; Mossberg500; Mossberg500Tactical; JS14_Rifle; SPAS12; LAW12; Remington870; Remington870Wood; Remington870Sawnoff` 1, `AssaultRifle; M16A2; M733; AR15; M4; G3; FN_FAL; AK47; M60; AssaultRifle2; JS14_Rifle; VarmintRifle; HuntingRifle; L94_Rifle; SKS; MSR7T_Rifle` 1 |
| `PartType` | 3 | `GunLight` 2, `Canon` 1 |
| `WeightModifier` | 3 | `0.2` 2, `0.5` 1 |
| `CanAttach` | 1 | `MarzVanillaGuns_AttachAndDetach.requiredTools` 1 |
| `CanDetach` | 1 | `MarzVanillaGuns_AttachAndDetach.requiredTools` 1 |
| `DisplayName` | 1 | `Tactical Flashlight` 1 |
| `DissapearOnUse` | 1 | `FASLE` 1 |
| `Tooltip` | 1 | `Tooltip_KATTAJ1_TacticalFlashlight` 1 |

## Catálogo

Todas as lanternas por classe, do maior alcance para o menor e depois em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). As colunas mostram as propriedades cruas: força é `LightStrength`, alcance é `LightDistance`, feixe é `TorchDot` (— quando falta), consumo é `UseDelta` e peso é `Weight`. "Extras" junta `AttachmentType` ("pendura em"), `PartType` ("peça") e `MountOn` ("monta em").

### De mão

| Nome | ID | Origem | Força | Alcance | Feixe | Consumo | Peso | Extras |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| _Tactical Flashlight_ | `Base.KATTAJ1_TacticalFlashlight` | KATTAJ1 Clothes Core | 3 | 28 | 0.66 | 0.00002 | 0.1 | pendura em `FlashlightKATTAJ1` |
| Lanterna - Reforçada | `Base.Torch` | vanilla | 2 | 25 | 0.66 | 0.007 | 1 | — |
| Lanterna | `Base.HandTorch` | vanilla | 1.8 | 15 | 0.5 | 0.006 | 0.5 | — |
| Lanterna - Angular | `Base.FlashLight_AngleHead` | vanilla | 1.5 | 15 | 0.5 | 0.006 | 0.5 | pendura em `Webbing` |
| Lanterna - Angular | `Base.FlashLight_AngleHead_Army` | vanilla | 1.5 | 15 | 0.53 | 0.0057 | 0.5 | pendura em `Webbing` |
| Lanterna - Improvisada | `Base.Flashlight_Crafted` | vanilla | 1.2 | 11 | 0.66 | 0.008 | 1 | — |
| Lanterna tipo Caneta | `Base.PenLight` | vanilla | 1.2 | 11 | 0.75 | 0.001 | 0.2 | — |

### Ambiente

| Nome | ID | Origem | Força | Alcance | Feixe | Consumo | Peso | Extras |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Lanterna Elétrica Improvisada | `Base.Lantern_CraftedElectric` | vanilla | 1.5 | 10 | — | 0.007 | 2 | — |

### Para arma

| Nome | ID | Origem | Força | Alcance | Feixe | Consumo | Peso | Extras |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Lanterna para Arma | `Base.GunLight` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | 1.3 | 15 | 0.66 | 0.001 | 0.2 | peça `Canon`; monta em `Base.Pistol`, `Base.PistolGlock`, `Base.Pistol2`, `Base.Pistol3`, `Base.Pistolm93r`, `Base.MP5_SMG`, `Base.MP5SD_SMG` |
| _Rifle Flashlight_ | `Base.Rifle_Flashlight` | Firearms B42 (alterada por Firearms B42 Beta) | 1.3 | 15 | 0.66 | 0.001 | 0.2 | peça `GunLight`; monta em `AssaultRifle`, `M16A2`, `M733`, `AR15`, `M4`, `G3`, `FN_FAL`, `AK47`, `M60`, `AssaultRifle2`, `JS14_Rifle`, `VarmintRifle`, `HuntingRifle`, `L94_Rifle`, `SKS`, `MSR7T_Rifle` |
| _Taped Flashlight_ | `Base.GunLightImprovised` | Firearms B42 (alterada por Firearms B42 Beta) | 1.8 | 15 | 0.5 | 0.006 | 0.5 | peça `GunLight`; monta em `Shotgun`, `ShotgunSawnoff`, `Mossberg500`, `Mossberg500Tactical`, `JS14_Rifle`, `SPAS12`, `LAW12`, `Remington870`, `Remington870Wood`, `Remington870Sawnoff` |

## Fora do catálogo

Itens sem a tag `flashlight` que têm `LightStrength` (10) ou que têm "flashlight" ou "lantern" no ID ou no nome (10), entre eles 5 lampiões apagados (tag `unlitlantern`), que não têm `LightStrength`. Força e alcance são `LightStrength` e `LightDistance` (— quando faltam).

| Nome | ID | Origem | Tipo | Categoria | Força | Alcance |
| --- | --- | --- | --- | --- | ---: | ---: |
| Isqueiro | `Base.Lighter` | vanilla | `drainable` | Fonte de Fogo | 0.8 | 5 |
| Isqueiro - Descartável | `Base.LighterDisposable` | vanilla | `drainable` | Fonte de Fogo | 0.6 | 5 |
| Isqueiro - Para Churrasqueira | `Base.LighterBBQ` | vanilla | `drainable` | Fonte de Fogo | 0.6 | 5 |
| Lampião - Cobre (Aceso) | `Base.Lantern_Hurricane_CopperLit` | vanilla | `drainable` | Fonte de Luz | 1.5 | 15 |
| Lampião - Ouro (Aceso) | `Base.Lantern_Hurricane_GoldLit` | vanilla | `drainable` | Fonte de Luz | 1.5 | 15 |
| Lampião - Prata (Aceso) | `Base.Lantern_Hurricane_SilverLit` | vanilla | `drainable` | Fonte de Luz | 1.5 | 15 |
| Lampião (Aceso) | `Base.Lantern_Hurricane_ForgedLit` | vanilla | `drainable` | Fonte de Luz | 1.5 | 15 |
| Lampião (Aceso) | `Base.Lantern_HurricaneLit` | vanilla | `drainable` | Fonte de Luz | 1.5 | 15 |
| Lampião a Propano | `Base.Lantern_Propane` | vanilla | `drainable` | Fonte de Luz | 2 | 15 |
| Vela Acesa | `Base.CandleLit` | vanilla | `drainable` | Fonte de Luz | 1.2 | 5 |
| Abóbora de Halloween | `Base.HalloweenPumpkin` | vanilla | `food` | Comida | — | — |
| Cilindro de Propano para Lampião | `Base.Propane_Refill` | vanilla | `drainable` | Fonte de Luz | — | — |
| _Flashlight Suppressor_ | `Base.ImprovisedSilencer` | Firearms B42 (alterada por Firearms B42 Beta) | `weaponpart` | Peça de Arma | — | — |
| _Flashlight Suppressor(Broken)_ | `Base.ImprovisedSilencer_Broken` | Firearms B42 (alterada por Firearms B42 Beta) | `normal` | Peça de Arma | — | — |
| Lampião | `Base.Lantern_Hurricane` | vanilla | `drainable` | Fonte de Luz | — | — |
| Lampião | `Base.Lantern_Hurricane_Forged` | vanilla | `drainable` | Fonte de Luz | — | — |
| Lampião - Cobre | `Base.Lantern_Hurricane_Copper` | vanilla | `drainable` | Fonte de Luz | — | — |
| Lampião - Ouro | `Base.Lantern_Hurricane_Gold` | vanilla | `drainable` | Fonte de Luz | — | — |
| Lampião - Prata | `Base.Lantern_Hurricane_Silver` | vanilla | `drainable` | Fonte de Luz | — | — |
| Vidro de Lanterna | `Base.LanternGlass` | vanilla | `normal` | Material | — | — |
