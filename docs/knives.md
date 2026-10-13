# Facas

> Gerado por `node tools/knives_doc.js` a partir de `data/items.js` (extraído em 2026-09-28). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.

Uma **faca** é um item de script (`media/scripts`) com a tag `sharpknife` (afiada) ou `dullknife` (cega) em `Tags` (`base:sharpknife` e `base:dullknife` no jogo base). São essas tags que as receitas pedem quando exigem uma faca (`tags[base:sharpknife]`, `tags[base:dullknife]`), então a lista inclui o que o jogo aceita como faca mesmo sem "faca" no nome. Elas se dividem em "Afiada, lâmina curta", "Cega, lâmina curta", "Afiada, lâmina longa" e "Não é arma" (veja [Por classe](#por-classe)). Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.KitchenKnife`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.KitchenKnife")`.

Total mapeado: **39 facas** (32 afiadas e 7 cegas) de 4 origens (36 do jogo base), 37 com nome em PT-BR, 0 alteradas por outro mod e 0 ocultas por padrão na aba Itens. A de maior dano é Facão (`Base.Machete`), com `MaxDamage` 3.

As outras 29 armas de lâmina curta (`base:smallblade` sem as tags) e os itens que só têm "knife", "faca", "canivete", "dagger" ou "adaga" no ID ou no nome ficam fora do catálogo (veja [Fora do catálogo](#fora-do-catálogo)).

## Como as facas são mapeadas

`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):

1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"0.9"`, `"10"`, `"TRUE"`).
2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.
3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.
4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que for achado, como `Item_<nome>` ou `<nome>`, nos packs de textura lidos (`UI`, `UI2`, `IconsMoveables`, `RadioIcons`, `ApComUI` e os `pack=` dos mods) ou nos `.png` soltos de `media/textures`. Sem nenhum, um item com `WorldObjectSprite` usa o sprite do tile.

Na aba Itens, a busca `tag:knife` traz exatamente as facas (a comparação é por trecho, sem o prefixo `base:` e sem diferenciar maiúsculas); `tag:sharpknife` e `tag:dullknife` separam as afiadas das cegas. O filtro "Tipo → Arma" da barra lateral não as isola: 3 facas não são armas, e as 62 armas de lâmina curta incluem 29 que não são facas.

## Formato de `data/items.js`

As facas ficam junto com os demais itens:

```js
window.PZ_ITEMS = {
  generated: "2026-09-28T16:29:54.165Z",   // data da extração
  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png
  cats: { pt: { Weapon: "Arma", ... }, en: { ... } },   // nomes de DisplayCategory
  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]
};
```

| Campo | Descrição |
| --- | --- |
| `id` | `<Módulo>.<Nome>`, ex.: `Base.HuntingKnife`. |
| `mod` | `vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro. |
| `ovr` | Mods que redefiniram o item depois (propriedades mescladas por cima). |
| `type` | `ItemType` (ou `Type`, se faltar) sem `base:`, em minúsculas e só com letras. Nas facas: `normal` ou `weapon`. |
| `cat` | `DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`). |
| `pt`, `en` | Nomes de exibição, ou `""`. |
| `icon` | `["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`. |
| `props` | Todas as propriedades do bloco `item`, como strings. Nas facas, as principais são `Tags` e `Weight`; nas que são armas, também `Categories`, `MinDamage`, `MaxDamage`, `MaxRange`, `CriticalChance`, `BaseSpeed` e `ConditionMax`. |

## Por classe

A classe não é um campo do jogo: é dada pela tag (`sharpknife` ou `dullknife`), pelo tipo do item e pela perícia da arma em `Categories`, por uma tabela mantida no script. O script falha se aparecer uma faca que nenhuma classe reconhece, uma classe sem facas ou um item com as duas tags. Tags com `knife` nas facas: `base:sharpknife` 32, `base:dullknife` 7. "Dano" é a faixa de `MinDamage`–`MaxDamage` e "Peso" a de `Weight`.

| Classe | Regra | Facas | Dano | Peso |
| --- | --- | ---: | --- | ---: |
| [Afiada, lâmina curta](#afiada-lâmina-curta) | `sharpknife`, `weapon` com `base:smallblade` | 27 | 0.3–2 | 0.3–1 |
| [Cega, lâmina curta](#cega-lâmina-curta) | `dullknife`, `weapon` com `base:smallblade` | 6 | 0.1–1 | 0.25–1 |
| [Afiada, lâmina longa](#afiada-lâmina-longa) | `sharpknife`, `weapon` com `base:longblade` | 3 | 1–3 | 2 |
| [Não é arma](#não-é-arma) | qualquer das duas tags, tipo que não é `weapon` | 3 | — | 0.1–1 |

## Por origem

| Origem | Facas | Afiada, lâmina curta | Cega, lâmina curta | Afiada, lâmina longa | Não é arma |
| --- | ---: | ---: | ---: | ---: | ---: |
| vanilla | 36 | 24 | 6 | 3 | 3 |
| ALICE Gear | 1 | 1 | 0 | 0 | 0 |
| Legendary Tactical Weapons | 1 | 1 | 0 | 0 | 0 |
| Vanilla Weapons Plus - Gunworks Edition | 1 | 1 | 0 | 0 | 0 |

## Por categoria

A `DisplayCategory`, que é o filtro "Categoria" da aba Itens.

| Categoria | Nome | Facas |
| --- | --- | ---: |
| `CookingWeapon` | Culinária / Arma | 11 |
| `Weapon` | Arma | 10 |
| `ToolWeapon` | Ferramenta / Arma | 7 |
| `WeaponCrafted` | Arma - Artesanal | 6 |
| `GardeningWeapon` | Jardinagem / Arma | 2 |
| `Cooking` | Culinária | 1 |
| `Household` | Objeto Doméstico | 1 |
| `Material` | Material | 1 |

## Propriedades

As 58 chaves que aparecem em `props` das facas, da mais comum à mais rara. Na aba Itens, `k:Chave` filtra quem tem a chave e `chave=valor` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (`+N` = outros N valores distintos).

| Propriedade | Facas | Valores |
| --- | ---: | --- |
| `DisplayCategory` | 39 | `CookingWeapon` 11, `Weapon` 10, `ToolWeapon` 7, `WeaponCrafted` 6, `GardeningWeapon` 2, +3 |
| `ItemType` | 39 | `base:weapon` 36, `base:normal` 3 |
| `Tags` | 39 | `base:cutplant;base:sharpknife;base:butcheranimal;base:sharpenable;base:killanimal;base:hasmetal` 6, `base:cutplant;base:sharpknife;base:butcheranimal;base:hasmetal;base:sharpenable;base:killanimal` 3, `base:dullknife;base:nomaintenancexp` 2, `base:ignorezombiedensity;base:cutplant;base:sharpknife;base:butcheranimal;base:sharpenable;base:hasmetal` 2, `base:dullknife` 2, +24 |
| `Weight` | 39 | `1.0` 13, `0.5` 5, `0.25` 4, `0.7` 4, `0.3` 4, +7 |
| `ConditionLowerChanceOneIn` | 38 | `2` 10, `5` 6, `15` 6, `1` 4, `7` 4, +6 |
| `ConditionMax` | 38 | `10` 17, `5` 7, `1` 3, `6` 3, `13` 2, +6 |
| `Icon` | 37 | `KnifeButter` 2, `Machete_Forged` 2, `Knife_Gold` 1, `Knife_Silver` 1, `SpearHead_Shiv_Crude01` 1, +30 |
| `BreakSound` | 36 | `KitchenKnifeBreak` 8, `HuntingKnifeBreak` 5, `ButterKnifeBreak` 4, `LargeKnifeBreak` 2, `MacheteBreak` 2, +15 |
| `Categories` | 36 | `base:smallblade` 33, `base:longblade` 3 |
| `CritDmgMultiplier` | 36 | `3.0` 16, `4.0` 9, `10.0` 5, `2.0` 3, `5.0` 2, +1 |
| `CriticalChance` | 36 | `20.0` 10, `25.0` 8, `50.0` 7, `7.0` 4, `10.0` 3, +3 |
| `DoorDamage` | 36 | `1` 30, `0` 2, `10` 2, `5` 1, `3` 1 |
| `DoorHitSound` | 36 | `KitchenKnifeHit` 8, `HuntingKnifeHit` 5, `ButterKnifeHit` 4, `LargeKnifeHit` 2, `MacheteHit` 2, +15 |
| `HitFloorSound` | 36 | `KitchenKnifeHit` 8, `HuntingKnifeHit` 5, `ButterKnifeHit` 4, `LargeKnifeHit` 2, `MacheteHit` 2, +15 |
| `HitSound` | 36 | `KitchenKnifeHit` 8, `HuntingKnifeHit` 5, `ButterKnifeHit` 4, `LargeKnifeHit` 2, `MacheteHit` 2, +15 |
| `ImpactSound` | 36 | `KitchenKnifeHit` 8, `HuntingKnifeHit` 5, `ButterKnifeHit` 4, `LargeKnifeHit` 2, `MacheteHit` 2, +15 |
| `KnockBackOnNoDeath` | 36 | `false` 36 |
| `KnockdownMod` | 36 | `0.0` 32, `2.0` 3, `0.2` 1 |
| `MaxDamage` | 36 | `0.4` 6, `1.2` 6, `0.6` 6, `0.7` 5, `1.1` 4, +5 |
| `MaxHitcount` | 36 | `1` 33, `2` 3 |
| `MaxRange` | 36 | `0.9` 22, `0.8` 5, `1.23` 3, `1.0` 2, `0.85` 2, +2 |
| `MinAngle` | 36 | `0.65` 32, `0.7` 3, `0.55` 1 |
| `MinDamage` | 36 | `0.3` 13, `0.6` 10, `0.1` 5, `2.0` 2, `1.0` 2, +4 |
| `MinimumSwingtime` | 36 | `2.0` 32, `4.0` 3, `1.8` 1 |
| `MinRange` | 36 | `0.61` 35, `0.55` 1 |
| `PushBackMod` | 36 | `0.01` 32, `0.3` 3, `0.08` 1 |
| `SplatBloodOnNoDeath` | 36 | `true` 29, `false` 7 |
| `SplatNumber` | 36 | `4` 26, `2` 9, `5` 1 |
| `SubCategory` | 36 | `Stab` 33, `Swinging` 3 |
| `SwingAmountBeforeImpact` | 36 | `0.02` 36 |
| `SwingAnim` | 36 | `Stab` 33, `Bat` 3 |
| `SwingSound` | 36 | `KitchenKnifeSwing` 8, `HuntingKnifeSwing` 5, `ButterKnifeSwing` 4, `LargeKnifeSwing` 2, `MacheteSwing` 2, +15 |
| `Swingtime` | 36 | `2.0` 32, `4.0` 3, `1.8` 1 |
| `TreeDamage` | 36 | `0` 32, `10` 2, `5` 1, `2` 1 |
| `WeaponLength` | 36 | `0.19` 14, `0.25` 12, `0.17` 6, `0.3` 3, `0.28` 1 |
| `AimingMod` | 33 | `0.8` 33 |
| `CloseKillMove` | 33 | `Jaw_Stab` 33 |
| `IdleAnim` | 33 | `Idle_Weapon2` 33 |
| `IsAimedHandWeapon` | 33 | `true` 33 |
| `RunAnim` | 33 | `Run_Weapon2` 33 |
| `AttachmentType` | 32 | `Knife` 22, `Screwdriver` 4, `Sword` 3, `NotKnife` 1, `M9Sheath` 1, +1 |
| `Researchablerecipes` | 32 | `Forge_Crude_Blade;Forge_Small_Knife` 12, `Forge_Hunting_Knife_Blade;Forge_Large_Knife_Blade;Forge_Crude_Blade;Forge_Small_Knife;Forge_Fleshing_Tool` 3, `Forge_Kitchen_Knife_Blade;Forge_Crude_Blade;Forge_Small_Knife;Forge_Fleshing_Tool` 2, `Forge_Machete_Blade;Forge_Crude_Shortsword_Blade;Forge_Large_Knife_Blade;Forge_Fleshing_Tool;Forge_Scrap_Shortsword` 2, `Forge_Crude_Blade` 1, +12 |
| `DamageCategory` | 31 | `Slash` 31 |
| `DamageMakeHole` | 31 | `true` 31 |
| `WeaponSprite` | 31 | `BreadKnife` 1, `ButterKnife` 1, `ButterKnife_Gold` 1, `ButterKnife_Silver` 1, `CrudeKnife` 1, +26 |
| `DropSound` | 30 | `HuntingKnifeDrop` 5, `ButterKnifeDrop` 4, `KitchenKnifeDrop` 4, `StoneKnifeDrop` 2, `LargeKnifeDrop` 2, +12 |
| `MetalValue` | 30 | `10.0` 14, `30.0` 10, `8.0` 4, `1.0` 1, `45.0` 1 |
| `Sharpness` | 29 | `1.0` 28, `2.0` 1 |
| `OnBreak` | 9 | `OnBreak.HuntingKnife` 2, `OnBreak.KitchenKnife` 2, `OnBreak.Machete` 2, `OnBreak.SmallHandle` 1, `OnBreak.LargeKnife` 1, +1 |
| `WorldStaticModel` | 6 | `HandiknifeClosed` 1, `Multitool_Closed` 1, `PlasticKnife` 1, `ChippedStone` 1, `StraightRazor` 1, +1 |
| `EquipSound` | 5 | `PocketKnifeEquip` 3, `ButterflyKnifeEquip` 1, `SwitchBladeEquip` 1 |
| `UnequipSound` | 5 | `PocketKnifeUnequip` 3, `ButterflyKnifeUnequip` 1, `SwitchBladeUnequip` 1 |
| `WeaponSpritesByIndex` | 5 | `HuntingKnife;HuntingKnifeForged` 1, `Knife;KitchenKnifeForged` 1, `KnifeButterfly;KnifeButterfly2` 1, `KnifePocket;KnifePocket2` 1, `Machete;MacheteForged` 1 |
| `BaseSpeed` | 3 | `1.0` 3 |
| `StaticModel` | 3 | `PlasticKnife` 1, `ChippedStone` 1, `StraightRazor_Open` 1 |
| `IconsForTexture` | 2 | `HuntingKnife;HuntingKnife_Forged` 1, `KnifeChopping;KitchenKnife_Forged` 1 |
| `WorldStaticModelsByIndex` | 2 | `KnifeButterflyClosed;KnifeButterflyClosed2` 1, `KnifePocketClosed;KnifePocketClosed2` 1 |
| `ResearchableRecipes` | 1 | `MakeLegendaryTacticalKnife` 1 |

## Catálogo

Todas as facas por classe; nas que são armas, do maior dano para o menor, e depois em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). As colunas mostram as propriedades cruas: dano é `MinDamage`–`MaxDamage`, alcance é `MaxRange`, crítico é `CriticalChance`, velocidade é `BaseSpeed` (— quando falta), peso é `Weight` e condição é `ConditionMax`. "Usos" lista quais destas tags a faca tem: `butcheranimal`, `killanimal`, `cutplant` e `sharpenable`.

### Afiada, lâmina curta

| Nome | ID | Origem | Categoria | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Usos |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Faca Tática Lendária | `LTW.LegendaryTacticalKnife` | Legendary Tactical Weapons | Arma | 1–2 | 1 | 55 | — | 0.8 | 100 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| _M9 Bayonet_ | `ALICE.M9Bayonet` | ALICE Gear | Arma | 1.2–2 | 1.2 | 50 | — | 0.46 | 25 | `butcheranimal`, `cutplant`, `sharpenable` |
| Adaga com Guarda | `Base.HandguardDagger` | vanilla | Arma | 0.6–1.2 | 0.9 | 50 | — | 1 | 5 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Caça | `Base.HuntingKnife` | vanilla | Arma | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Caça | `Base.HuntingKnifeForged` | vanilla | Arma | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Combate | `Base.FightingKnife` | vanilla | Arma | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca Longa Simples de Metal | `Base.LongCrudeKnife` | vanilla | Arma - Artesanal | 0.6–1.2 | 0.9 | 50 | — | 1 | 5 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| _M9 Bayonet_ | `Base.M9_Bayonet` | Vanilla Weapons Plus - Gunworks Edition | Arma | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Lâmina de Facão | `Base.MacheteKnife` | vanilla | Ferramenta / Arma | 0.6–1.1 | 0.9 | 30 | — | 1 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca Grande | `Base.LargeKnife` | vanilla | Ferramenta / Arma | 0.6–1.1 | 0.9 | 30 | — | 1 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca Grande de Sucata Metálica | `Base.LargeKnife_Scrap` | vanilla | Ferramenta / Arma | 0.6–1.1 | 0.9 | 20 | — | 1 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |
| Faca Longa de Pedra | `Base.StoneKnifeLong` | vanilla | Arma - Artesanal | 0.7–1.1 | 0.85 | 20 | — | 1 | 6 | `butcheranimal`, `killanimal` |
| Faca Simples de Metal | `Base.CrudeKnife` | vanilla | Arma - Artesanal | 0.5–0.9 | 0.9 | 25 | — | 0.7 | 6 | `sharpenable` |
| Faca de Churrasco | `Base.SteakKnife` | vanilla | Culinária / Arma | 0.3–0.7 | 0.9 | 25 | — | 0.5 | 5 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Cozinha | `Base.KitchenKnife` | vanilla | Culinária / Arma | 0.3–0.7 | 0.9 | 25 | — | 0.7 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Cozinha | `Base.KitchenKnifeForged` | vanilla | Culinária / Arma | 0.3–0.7 | 0.9 | 25 | — | 0.6 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Cravo Ferroviário | `Base.RailroadSpikeKnife` | vanilla | Arma | 0.3–0.7 | 0.9 | 25 | — | 0.5 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Sushi | `Base.KnifeSushi` | vanilla | Culinária / Arma | 0.3–0.7 | 0.9 | 25 | — | 0.7 | 15 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Canivete | `Base.KnifePocket` | vanilla | Ferramenta / Arma | 0.3–0.6 | 0.9 | 20 | — | 0.3 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |
| Canivete Automático | `Base.SwitchKnife` | vanilla | Arma | 0.3–0.6 | 0.9 | 20 | — | 0.3 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |
| Canivete Borboleta | `Base.KnifeButterfly` | vanilla | Arma | 0.3–0.6 | 0.9 | 20 | — | 0.3 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |
| Faca de Pedra | `Base.FlintKnife` | vanilla | Arma - Artesanal | 0.4–0.6 | 0.69 | 20 | — | 0.75 | 6 | `butcheranimal`, `killanimal` |
| Faca Pequena | `Base.SmallKnife` | vanilla | Ferramenta / Arma | 0.3–0.6 | 0.9 | 20 | — | 0.5 | 8 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Multiferramenta | `Base.Multitool` | vanilla | Ferramenta / Arma | 0.3–0.6 | 0.9 | 25 | — | 0.5 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |
| Faca de Filetar | `Base.KnifeFillet` | vanilla | Culinária / Arma | 0.3–0.5 | 0.9 | 10 | — | 0.7 | 5 | `butcheranimal`, `sharpenable` |
| Handiknife | `Base.Handiknife` | vanilla | Ferramenta / Arma | 0.3–0.5 | 0.9 | 25 | — | 0.4 | 10 | `butcheranimal`, `killanimal`, `cutplant`, `sharpenable` |
| Faca de Descascar | `Base.KnifeParing` | vanilla | Culinária / Arma | 0.3–0.4 | 0.8 | 10 | — | 0.3 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |

### Cega, lâmina curta

| Nome | ID | Origem | Categoria | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Usos |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Osso Longo e Afiado | `Base.SharpBone_Long` | vanilla | Arma - Artesanal | 0.6–1 | 0.85 | 20 | — | 1 | 5 | — |
| Faca de Manteiga | `Base.ButterKnife` | vanilla | Culinária / Arma | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 3 | — |
| Faca de Manteiga de Ouro | `Base.ButterKnife_Gold` | vanilla | Culinária / Arma | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 1 | — |
| Faca de Manteiga de Prata | `Base.ButterKnife_Silver` | vanilla | Culinária / Arma | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 2 | — |
| Faca de Osso Cega | `Base.DullBoneKnife` | vanilla | Culinária / Arma | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 1 | — |
| Faca de Pão | `Base.BreadKnife` | vanilla | Culinária / Arma | 0.1–0.4 | 1 | 15 | — | 1 | 5 | — |

### Afiada, lâmina longa

| Nome | ID | Origem | Categoria | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Usos |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| Facão | `Base.Machete` | vanilla | Jardinagem / Arma | 2–3 | 1.23 | 20 | 1 | 2 | 13 | `butcheranimal`, `cutplant`, `sharpenable` |
| Facão | `Base.MacheteForged` | vanilla | Jardinagem / Arma | 2–3 | 1.23 | 20 | 1 | 2 | 13 | `butcheranimal`, `cutplant`, `sharpenable` |
| Facão de Sucata Metálica | `Base.Machete_Crude` | vanilla | Arma - Artesanal | 1–2 | 1.23 | 10 | 1 | 2 | 10 | `butcheranimal`, `cutplant`, `sharpenable` |

### Não é arma

| Nome | ID | Origem | Tag | Tipo | Categoria | Peso | Condição | Usos |
| --- | --- | --- | --- | --- | --- | ---: | ---: | --- |
| Faca de Plástico | `Base.PlasticKnife` | vanilla | `dullknife` | `normal` | Culinária | 0.1 | — | — |
| Lasca Afiada de Sílex | `Base.SharpedStone` | vanilla | `sharpknife` | `normal` | Material | 1 | 5 | — |
| Navalha Reta | `Base.StraightRazor` | vanilla | `sharpknife` | `normal` | Objeto Doméstico | 0.5 | 1 | `sharpenable` |

## Fora do catálogo

Itens sem `sharpknife` nem `dullknife` que são armas de lâmina curta (`base:smallblade` em `Categories`) ou que têm "knife", "faca", "canivete", "dagger" ou "adaga" no ID ou no nome: 58 itens, 29 deles armas de lâmina curta. "Por quê" diz qual dos dois critérios o item cumpre. As receitas que pedem uma faca por `tags[base:sharpknife]` ou `tags[base:dullknife]` não aceitam nenhum deles.

| Nome | ID | Origem | Tipo | Categoria | Por quê |
| --- | --- | --- | --- | --- | --- |
| Abridor de Cartas | `Base.LetterOpener` | vanilla | `weapon` | Objeto Doméstico / Arma | lâmina curta |
| Abridor de Latas - Modelo Antigo | `Base.TinOpener_Old` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Bisturi | `Base.Scalpel` | vanilla | `weapon` | Primeiros Socorros / Arma | lâmina curta |
| Chave de Fenda | `Base.Screwdriver` | vanilla | `weapon` | Ferramenta / Arma | lâmina curta |
| Chave de Fenda | `Base.Screwdriver_Old` | vanilla | `weapon` | Ferramenta / Arma | lâmina curta |
| Chave de Fenda Improvisada | `Base.Screwdriver_Improvised` | vanilla | `weapon` | Ferramenta / Arma | lâmina curta |
| Colher | `Base.Spoon` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Colher de Osso | `Base.Spoon_Bone` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Colher de Ouro | `Base.Spoon_Gold` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Colher de Pedreiro | `Base.MasonsTrowel` | vanilla | `weapon` | Ferramenta / Arma | lâmina curta |
| Colher de Prata | `Base.Spoon_Silver` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Colher Forjada | `Base.SpoonForged` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Cravo Ferroviário | `Base.RailroadSpike` | vanilla | `weapon` | Material / Arma | lâmina curta |
| Estaca | `Base.Stake` | vanilla | `weapon` | Jardinagem / Arma | lâmina curta |
| Faca Improvisada | `Base.KnifeShiv` | vanilla | `weapon` | Arma - Artesanal | lâmina curta, nome |
| Faca Improvisada de Escova de Dentes | `Base.Toothbrush_Shiv` | vanilla | `weapon` | Arma - Artesanal | lâmina curta, nome |
| Garfo | `Base.Fork` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Garfo de Jardinagem | `Base.HandFork` | vanilla | `weapon` | Ferramenta / Arma | lâmina curta |
| Garfo de Osso | `Base.Fork_Bone` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Garfo de Ouro | `Base.Fork_Gold` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Garfo de Prata | `Base.Fork_Silver` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Garfo de Trinchar | `Base.CarvingFork2` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Garfo Forjado | `Base.ForkForged` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Garrafa Quebrada | `Base.SmashedBottle` | vanilla | `weapon` | Arma - Improvisada | lâmina curta |
| Pá de Jardinagem | `Base.HandShovel` | vanilla | `weapon` | Jardinagem | lâmina curta |
| Picador de Gelo | `Base.IcePick` | vanilla | `weapon` | Culinária / Arma | lâmina curta |
| Punhal de Vidro | `Base.GlassShiv` | vanilla | `weapon` | Arma - Artesanal | lâmina curta |
| Tesoura | `Base.Scissors` | vanilla | `weapon` | Objeto Doméstico / Arma | lâmina curta |
| Tesoura Rudimentar | `Base.ScissorsForged` | vanilla | `weapon` | Objeto Doméstico / Arma | lâmina curta |
| Bainha de Faca Lendária (Costas) | `LTW.LegendaryKnifeSheathBack` | Legendary Tactical Weapons | `clothing` | Acessório | nome |
| Bainha de Faca Lendária (Coxa direita) | `LTW.LegendaryKnifeSheathRightThigh` | Legendary Tactical Weapons | `clothing` | Acessório | nome |
| Chapéu de Brincadeira - Faca | `Base.Hat_JokeKnife` | vanilla | `clothing` | Lembrança | nome |
| Lâmina de Faca de Caça | `Base.HuntingKnifeBlade` | vanilla | `normal` | Material | nome |
| Lâmina de Faca de Cozinha | `Base.KitchenKnifeBlade` | vanilla | `normal` | Material | nome |
| Lâmina de Faca Grande | `Base.LargeKnifeBlade` | vanilla | `normal` | Material | nome |
| Lamina de Faca Tatica Lendaria | `LTW.LegendaryTacticalKnifeBlade` | Legendary Tactical Weapons | `normal` | Material | nome |
| Lança com Faca de Caça | `Base.SpearHuntingKnife` | vanilla | `weapon` | Arma - Artesanal | nome |
| Lança com Faca de Churrasco | `Base.SpearSteakKnife` | vanilla | `weapon` | Arma - Artesanal | nome |
| Lança com Faca de Combate | `Base.SpearFightingKnife` | vanilla | `weapon` | Arma - Artesanal | nome |
| Lança com Faca de Cozinha | `Base.SpearKnife` | vanilla | `weapon` | Arma - Artesanal | nome |
| Lança com Faca de Sucata Metálica | `Base.SpearScrapKnife` | vanilla | `weapon` | Arma - Artesanal | nome |
| Lança com Faca Grande | `Base.SpearLargeKnife` | vanilla | `weapon` | Arma - Artesanal | nome |
| Lança com Faca Pequena | `Base.SpearKnifeSmall` | vanilla | `weapon` | Arma - Artesanal | nome |
| _Military Knife Pleated Mini Skirt (Black)_ | `Base.Military_Skirt_KnifePleatedMini-Black` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Mini Skirt (Desert)_ | `Base.Military_Skirt_KnifePleatedMini-Desert` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Mini Skirt (Green)_ | `Base.Military_Skirt_KnifePleatedMini-Green` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Mini Skirt (White)_ | `Base.Military_Skirt_KnifePleatedMini-White` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Short Skirt (Black)_ | `Base.Military_Skirt_KnifePleatedShort-Black` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Short Skirt (Desert)_ | `Base.Military_Skirt_KnifePleatedShort-Desert` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Short Skirt (Green)_ | `Base.Military_Skirt_KnifePleatedShort-Green` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Short Skirt (White)_ | `Base.Military_Skirt_KnifePleatedShort-White` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Skirt (Black)_ | `Base.Military_Skirt_KnifePleated-Black` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Skirt (Desert)_ | `Base.Military_Skirt_KnifePleated-Desert` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Skirt (Green)_ | `Base.Military_Skirt_KnifePleated-Green` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Military Knife Pleated Skirt (White)_ | `Base.Military_Skirt_KnifePleated-White` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Press Knife Pleated Mini Skirt_ | `Base.Military_Skirt_KnifePleatedMini-Press` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Press Knife Pleated Short Skirt_ | `Base.Military_Skirt_KnifePleatedShort-Press` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
| _Press Knife Pleated Skirt_ | `Base.Military_Skirt_KnifePleated-Press` | KATTAJ1 Military Pack | `clothing` | Vestuário | nome |
