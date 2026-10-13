# Armas

> Gerado por `node tools/weapons_doc.js` a partir de `data/items.js` (extraído em 2026-09-28). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.

Uma **arma** é um item de script (`media/scripts`) com `ItemType = base:weapon`. Na aba Itens ela aparece com o tipo "Arma" (`type:arma` na busca). Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.Axe`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.Axe")`.

Total mapeado: **468 armas** de 6 origens (409 do jogo base), 422 com nome em PT-BR, 52 alteradas por outro mod (20 delas do jogo base) e 1 oculta por padrão na aba Itens.

Peças de arma (`ItemType = base:weaponpart`: miras, pentes, coronhas) e munição (`DisplayCategory = Ammo`) são outros tipos de item e ficam fora deste catálogo.

## Como as armas são mapeadas

`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (a pasta `42.x` mais próxima de `GAME_VER` e `common/`):

1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"2.0"`, `"true"`, `"TRUE"`).
2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.
3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.
4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que existir nos packs de UI ou nos `Item_*.png` soltos.

## Formato de `data/items.js`

As armas ficam junto com os demais itens:

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
| `id` | `<Módulo>.<Nome>`, ex.: `Base.Pistol`. |
| `mod` | `vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro. |
| `ovr` | Mods que redefiniram o item depois (propriedades mescladas por cima). |
| `type` | `ItemType` sem `base:`, em minúsculas: `weapon` para todas as armas. |
| `cat` | `DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`). |
| `pt`, `en` | Nomes de exibição, ou `""`. |
| `icon` | `["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`. |
| `props` | Todas as propriedades do bloco `item`, como strings. |

## Por classe

A classe não é um campo do jogo: é derivada das propriedades, nesta ordem. **Arma de fogo**: `SubCategory = Firearm` (todas têm também `Ranged` e `IsAimedFirearm`). **Explosivo**: `DisplayCategory = Explosives` (bombas, armadilhas e molotov; todos podem ser arremessados, e as variantes colocáveis disparam por temporizador, controle remoto ou sensor). As demais são **corpo a corpo**, classificadas pela perícia em `Categories` (`base:axe`, `base:longblade`...), que define qual habilidade sobe e o bônus aplicado; `base:improvised` só marca a arma como improvisada e não conta como perícia.

| Classe | Armas | Improvisadas |
| --- | ---: | ---: |
| [Arma de fogo](#arma-de-fogo) | 64 | 0 |
| [Explosivo](#explosivo) | 34 | 0 |
| [Machado](#machado) | 48 | 4 |
| [Lâmina longa](#lâmina-longa) | 15 | 0 |
| [Lâmina curta](#lâmina-curta) | 62 | 3 |
| [Contundente longa](#contundente-longa) | 101 | 38 |
| [Contundente curta](#contundente-curta) | 100 | 52 |
| [Lança](#lança) | 31 | 21 |
| [Desarmado](#desarmado) | 1 | 0 |
| [Corpo a corpo sem perícia](#corpo-a-corpo-sem-perícia) | 12 | 12 |

## Por origem

| Origem | Armas | Fogo | Explosivos |
| --- | ---: | ---: | ---: |
| vanilla | 409 | 22 | 33 |
| Firearms B42 | 32 | 31 | 1 |
| Vanilla Weapons Plus - Gunworks Edition | 13 | 11 | 0 |
| Legendary Tactical Weapons | 10 | 0 | 0 |
| Bushcraft Gear - Rare Weapons | 3 | 0 | 0 |
| ALICE Gear | 1 | 0 | 0 |

Mods que alteram armas de outra origem (uma arma pode ser alterada por vários):

| Mod | Armas |
| --- | ---: |
| Firearms B42 Beta | 51 |
| Firearms B42 | 19 |
| Vanilla Weapons Plus - Gunworks Edition | 17 |

## Por categoria

A `DisplayCategory`, que é o filtro "Categoria" da aba Itens. Muitas armas corpo a corpo são ferramentas ou objetos comuns (`ToolWeapon`, `CookingWeapon`...).

| Categoria | Nome | Armas |
| --- | --- | ---: |
| `WeaponCrafted` | Arma - Artesanal | 116 |
| `Weapon` | Arma | 91 |
| `ToolWeapon` | Ferramenta / Arma | 58 |
| `Explosives` | Explosivos | 34 |
| `CookingWeapon` | Culinária / Arma | 32 |
| `MaterialWeapon` | Material / Arma | 23 |
| `HouseholdWeapon` | Objeto Doméstico / Arma | 19 |
| `JunkWeapon` | Tralha / Arma | 18 |
| `SportsWeapon` | Esportes / Arma | 18 |
| `GardeningWeapon` | Jardinagem / Arma | 17 |
| `InstrumentWeapon` | Instrumento Musical / Arma | 10 |
| `AnimalPartWeapon` | Parte Animal / Arma | 7 |
| `BrokenWeapon` | Arma - Quebrada | 7 |
| `Memento` | Lembrança | 6 |
| `FishingWeapon` | Pesca / Arma | 4 |
| (vazia) | (sem categoria) | 2 |
| `FirstAidWeapon` | Primeiros Socorros / Arma | 1 |
| `Fishing` | Pesca | 1 |
| `Gardening` | Jardinagem | 1 |
| `Hidden` | Oculto | 1 |
| `VehicleMaintenanceWeapon` | Manutenção de Veículo / Arma | 1 |
| `WeaponImprovised` | Arma - Improvisada | 1 |

## Munição

Os `AmmoType` das armas de fogo. "Caixa" é o `AmmoBox`, o item que o jogo usa como caixa de munição daquela arma. Na aba Itens, `ammotype=9mm` filtra as armas por munição.

| AmmoType | Armas | Caixa | Exemplos |
| --- | ---: | --- | --- |
| `base:shotgun_shells` | 15 | `Base.ShotgunShellsBox`, `ShotgunShellsBox` | Espingarda de Cano Duplo; Espingarda de Cano Duplo Serrada; Escopeta Tática JS-3T; Espingarda JS-2000 |
| `base:bullets_9mm` | 10 | `Base.Bullets9mmBox`, `Bullets9mmBox` | Pistola M9; _Glock 17_; _JS5 SMG_; _MP5A1_ |
| `base:bullets_308` | 8 | `Base.308Box`, `308Box` | Rifle M1A; Rifle MSR788; Rifle Tático MSR7T; _FN Fal_ |
| `base:bullets_556` | 7 | `Base.556Box`, `556Box` | Rifle de Assalto M16; Rifle JS-14; Rifle MSR700; _JS-556 Rifle_ |
| `base:bullets_44` | 4 | `Base.Bullets44Box`, `Bullets44Box` | Pistola B-F; Magnum; _Colt Anaconda_; _Sawed-off Marlin Model 1894_ |
| `base:bullets_45` | 4 | `Base.Bullets45Box`, `Bullets45Box` | Pistola M1911; Revólver de Patrulha; Carabina de Caçador; _Ingram MAC 10_ |
| `base:bullets_357` | 3 | `Base.Bullets357Box`, `Bullets357Box` | Carabina L92; _Colt Python_; _Colt Python Hunter_ |
| `base:cap_gun_cap` | 2 | `Base.CapGunCapBox` | Pistola de Brinquedo com Espoleta; Rifle de Brinquedo com Espoleta |
| `firearms:bullets_10mm` | 2 | `Bullets10mmBox` | _Colt Delta_; _MP5/10_ |
| `firearms:bullets_22` | 2 | `Bullets22Box` | _Colt Ace_; _Colt Single Action Frontier Scout_ |
| `firearms:bullets_762x39` | 2 | `762x39Box` | _AKM_; _SKS_ |
| `base:bullets_3030` | 1 | `Base.3030Box` | Rifle L94 |
| `base:bullets_38` | 1 | `Bullets38Box` | Revólver SN38 |
| `firearms:bullets_30_06` | 1 | `Bullets3006Box` | _M1 Garand_ |
| `firearms:bullets_44_40` | 1 | `Bullets4440Box` | _Colt Single Action Army_ |
| `mvgi:bullets_762` | 1 | `Base.762Box` | _AK-47 Assault Rifle_ |

## Propriedades

O significado das propriedades mais usadas nas armas (a lista completa vem depois):

| Propriedade | Significado |
| --- | --- |
| `MinDamage`, `MaxDamage` | Dano por golpe ou disparo; o valor sorteado fica entre os dois. |
| `MinRange`, `MaxRange` | Alcance em tiles. Para explosivos, `MaxRange` é a distância de arremesso. |
| `CriticalChance`, `CritDmgMultiplier` | Chance de crítico (%) e multiplicador do dano crítico. |
| `BaseSpeed`, `Swingtime`, `MinimumSwingtime` | Velocidade do golpe (maior `BaseSpeed` = mais rápido) e duração da animação. |
| `MaxHitcount` | Quantos alvos um golpe ou disparo atinge. |
| `ConditionMax`, `ConditionLowerChanceOneIn` | Durabilidade máxima e chance (1 em N) de perder condição a cada golpe. |
| `KnockdownMod`, `PushBackMod` | Chance de derrubar e força do empurrão. |
| `TwoHandWeapon`, `RequiresEquippedBothHands` | Se rende melhor com duas mãos / se exige as duas mãos. |
| `DoorDamage`, `TreeDamage` | Dano em portas e árvores. |
| `AmmoType`, `MaxAmmo`, `MagazineType` | Munição, capacidade e pente (armas de fogo). |
| `HitChance`, `AimingPerkHitChanceModifier` | Precisão base e quanto ela cresce por nível de Pontaria. |
| `SoundRadius`, `JamGunChance` | Raio em que o disparo atrai zumbis e chance de travar. |
| `ExplosionPower`/`ExplosionRange`, `FireRange`, `SmokeRange`, `NoiseRange` | Efeito e raio dos explosivos. |

As 173 chaves que aparecem em `props` das armas, da mais comum à mais rara. Na aba Itens, `k:Chave` filtra quem tem a chave e `chave=valor` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (`+N` = outros N valores distintos).

| Propriedade | Armas | Valores |
| --- | ---: | --- |
| `ItemType` | 468 | `base:weapon` 468 |
| `MaxDamage` | 468 | `1.0` 37, `0.0` 36, `0.7` 30, `1.1` 26, `1.5` 23, +41 |
| `MaxRange` | 468 | `1.1` 62, `0.8` 36, `0.9` 36, `1.35` 34, `10.0` 33, +43 |
| `MinDamage` | 468 | `0.5` 52, `0.6` 48, `0.3` 41, `0.0` 36, `0.1` 34, +27 |
| `Weight` | 468 | `1.5` 92, `2.0` 79, `1.0` 66, `3.0` 28, `6.0` 23, +38 |
| `ConditionMax` | 467 | `10` 211, `1` 50, `5` 44, `15` 26, `3` 22, +13 |
| `SwingSound` | 467 | `M9Shoot` 11, `PenSwing` 9, `KitchenKnifeSwing` 9, `M16Shoot` 8, `JS2000ShotgunShoot` 8, +276 |
| `DisplayCategory` | 466 | `WeaponCrafted` 116, `Weapon` 91, `ToolWeapon` 58, `Explosives` 34, `CookingWeapon` 32, +16 |
| `SwingAnim` | 454 | `Bat` 223, `Stab` 72, `Heavy` 41, `Throw` 34, `Rifle` 31, +4 |
| `SwingAmountBeforeImpact` | 448 | `0.02` 318, `0.1` 35, `0.0` 25, `0.04` 25, `0` 25, +1 |
| `Icon` | 445 | `NoiseMaker` 6, `AerosolbombTimer` 5, `FireBomb` 5, `PipeBombTimer` 5, `SmokebombTimer` 5, +394 |
| `KnockdownMod` | 437 | `0.0` 212, `2.0` 131, `3.0` 27, `1` 21, `8` 10, +14 |
| `WeaponSprite` | 435 | `AerosolBombSensor` 5, `FlameTrapSensor` 5, `NoiseMakerSensor` 5, `PipeBombSensor` 5, `SmokeBombSensor` 5, +400 |
| `DoorDamage` | 434 | `5` 117, `1` 110, `0` 25, `2` 23, `7` 23, +19 |
| `HitSound` | 434 | `BulletHitBody` 35, `BulletImpact` 27, `PenHit` 9, `KitchenKnifeHit` 9, `SledgehammerHit` 6, +251 |
| `MaxHitcount` | 434 | `2` 172, `1` 133, `3` 89, `0` 34, `9` 6 |
| `MinAngle` | 434 | `0.65` 160, `0.8` 82, `0.72` 35, `0.67` 28, `0.75` 28, +15 |
| `PushBackMod` | 434 | `0.3` 232, `0.5` 77, `0.01` 69, `1.0` 24, `0.8` 15, +9 |
| `Swingtime` | 434 | `2.0` 181, `3.0` 85, `4.0` 80, `0.5` 39, `1.5` 34, +8 |
| `BreakSound` | 433 | `M16Break` 12, `PenBreak` 9, `KitchenKnifeBreak` 9, `M9Break` 9, `JS2000ShotgunBreak` 8, +268 |
| `ConditionLowerChanceOneIn` | 433 | `10` 69, `200` 60, `5` 48, `15` 45, `2` 39, +25 |
| `MinRange` | 433 | `0.61` 357, `0.7` 26, `0.98` 23, `0.67` 12, `0.2` 10, +4 |
| `SubCategory` | 433 | `Swinging` 273, `Stab` 72, `Firearm` 64, `Spear` 24 |
| `MinimumSwingtime` | 429 | `2.0` 149, `4.0` 104, `3.0` 95, `1.5` 34, `0.5` 32, +7 |
| `CriticalChance` | 425 | `20.0` 93, `30.0` 51, `5.0` 48, `25.0` 41, `10.0` 35, +18 |
| `KnockBackOnNoDeath` | 420 | `false` 223, `true` 162, `TRUE` 35 |
| `Tags` | 419 | `base:hasmetal;base:firearm` 60, `base:hasmetal;base:repairwithglue;base:repairwithtape` 23, `base:isfirefuel;base:repairwithglue;base:repairwithtape` 14, `base:fishingspear;base:sharpenable;base:repairwithglue;base:repairwithtape;base:hasmetal` 9, `base:isfirefuel;base:repairwithtape` 8, +221 |
| `CritDmgMultiplier` | 409 | `2.0` 126, `5.0` 85, `4.0` 49, `3.0` 48, `10.0` 24, +16 |
| `SplatNumber` | 394 | `1` 192, `3` 108, `2` 44, `4` 32, `5` 16, +1 |
| `SplatBloodOnNoDeath` | 391 | `false` 198, `true` 159, `TRUE` 34 |
| `AttachmentType` | 380 | `Shovel` 83, `BigWeapon` 81, `Rifle` 40, `BigBlade` 39, `Hammer` 26, +17 |
| `Categories` | 370 | `base:blunt` 63, `base:smallblade` 59, `base:improvised;base:smallblunt` 52, `base:smallblunt` 48, `base:axe` 44, +9 |
| `DoorHitSound` | 370 | `PenHit` 9, `KitchenKnifeHit` 9, `SledgehammerHit` 6, `AxeHit` 5, `BaseballBatHit` 5, +249 |
| `HitFloorSound` | 370 | `PenHit` 9, `KitchenKnifeHit` 9, `SledgehammerHit` 6, `BaseballBatHit` 5, `UmbrellaHit` 5, +250 |
| `TreeDamage` | 370 | `0` 263, `1` 30, `10` 29, `5` 21, `15` 12, +7 |
| `DropSound` | 362 | `JS2000ShotgunDrop` 8, `M16Drop` 7, `BaseballBatDrop` 5, `UmbrellaDrop` 5, `ForkDrop` 5, +244 |
| `RunAnim` | 351 | `Run_Weapon2` 351 |
| `IdleAnim` | 315 | `Idle_Weapon2` 315 |
| `WeaponLength` | 276 | `0.23` 40, `0.35` 37, `0.65` 28, `0.19` 22, `0.5` 20, +17 |
| `BaseSpeed` | 275 | `1.0` 107, `1.2` 37, `0.9` 35, `1.1` 31, `0.95` 18, +10 |
| `Researchablerecipes` | 230 | `Forge_Crude_Blade;Forge_Small_Knife` 16, `Forge_Nails;Forge_Heading_Tool` 14, `MakeSawPlank;MakeBrakeWeapon` 4, `BarbedWireWeapon` 3, `MakeGardenForkHeadWeapon` 3, +134 |
| `TwoHandWeapon` | 221 | `true` 183, `TRUE` 22, `FALSE` 16 |
| `OnBreak` | 206 | `OnBreak.LongStick` 17, `OnBreak.LargeBranch` 13, `OnBreak.MetalPipe` 12, `OnBreak.LongHandle` 12, `OnBreak.Nails` 11, +106 |
| `DamageMakeHole` | 203 | `true` 202, `TRUE` 1 |
| `MetalValue` | 192 | `120.0` 36, `45` 34, `45.0` 24, `5.0` 21, `30.0` 18, +12 |
| `ImpactSound` | 177 | `null` 64, `PenHit` 9, `KitchenKnifeHit` 9, `UmbrellaHit` 5, `ForkHit` 5, +61 |
| `DamageCategory` | 172 | `Slash` 172 |
| `RequiresEquippedBothHands` | 99 | `true` 62, `TRUE` 21, `FALSE` 16 |
| `AimingMod` | 84 | `0.8` 67, `2` 12, `2.0` 5 |
| `IsAimedHandWeapon` | 82 | `true` 72, `TRUE` 10 |
| `Sharpness` | 82 | `1.0` 78, `2.0` 3, `5.0` 1 |
| `SplatSize` | 75 | `3` 47, `5` 26, `0` 2 |
| `EquipSound` | 73 | `M16Equip` 12, `M9Equip` 9, `JS2000ShotgunEquip` 8, `MagnumEquip` 4, `DoubleBarrelShotgunEquip` 3, +22 |
| `UnequipSound` | 70 | `M16UnEquip` 12, `M9UnEquip` 9, `JS2000ShotgunUnEquip` 8, `MagnumUnEquip` 4, `MSR700UnEquip` 4, +18 |
| `HitAngleMod` | 69 | `-30.0` 66, `-30` 3 |
| `AimingPerkCritModifier` | 64 | `6` 30, `15` 21, `10` 3, `5` 3, `4` 3, +2 |
| `AimingPerkHitChanceModifier` | 64 | `4` 36, `12` 8, `5` 6, `10` 5, `7` 5, +3 |
| `AmmoBox` | 64 | `ShotgunShellsBox` 9, `Base.556Box` 6, `Base.ShotgunShellsBox` 6, `Base.Bullets9mmBox` 6, `Base.308Box` 4, +18 |
| `AmmoType` | 64 | `base:shotgun_shells` 15, `base:bullets_9mm` 10, `base:bullets_308` 8, `base:bullets_556` 7, `base:bullets_45` 4, +11 |
| `BringToBearSound` | 64 | `M16BringToBear` 15, `JS2000ShotgunBringToBear` 8, `M9BringToBear` 6, `MagnumBringToBear` 4, `DoubleBarrelShotgunBringToBear` 3, +15 |
| `ClickSound` | 64 | `M16Jam` 12, `M9Jam` 9, `JS2000ShotgunJam` 8, `MagnumJam` 4, `DoubleBarrelShotgunJam` 3, +15 |
| `EjectAmmoSound` | 64 | `M16EjectAmmo` 12, `M9EjectAmmo` 9, `JS2000ShotgunEjectAmmo` 8, `MagnumEjectAmmo` 4, `DoubleBarrelShotgunEjectAmmo` 3, +15 |
| `EjectAmmoStartSound` | 64 | `M16EjectAmmoStart` 11, `M9EjectAmmoStart` 9, `JS2000ShotgunEjectAmmoStart` 8, `MagnumEjectAmmoStart` 4, `DoubleBarrelShotgunEjectAmmoStart` 3, +16 |
| `EjectAmmoStopSound` | 64 | `M16EjectAmmoStop` 11, `M9EjectAmmoStop` 9, `JS2000ShotgunEjectAmmoStop` 8, `MagnumEjectAmmoStop` 4, `DoubleBarrelShotgunEjectAmmoStop` 3, +16 |
| `HitChance` | 64 | `50` 24, `65` 13, `35` 12, `45` 6, `40` 4, +3 |
| `InsertAmmoSound` | 64 | `M16InsertAmmo` 12, `M9InsertAmmo` 9, `JS2000ShotgunInsertAmmo` 8, `MagnumInsertAmmo` 4, `DoubleBarrelShotgunInsertAmmo` 3, +15 |
| `InsertAmmoStartSound` | 64 | `M16InsertAmmoStart` 11, `M9InsertAmmoStart` 9, `JS2000ShotgunInsertAmmoStart` 8, `MagnumInsertAmmoStart` 4, `DoubleBarrelShotgunInsertAmmoStart` 3, +16 |
| `InsertAmmoStopSound` | 64 | `M16InsertAmmoStop` 11, `M9InsertAmmoStop` 9, `JS2000ShotgunInsertAmmoStop` 8, `MagnumInsertAmmoStop` 4, `DoubleBarrelShotgunInsertAmmoStop` 3, +16 |
| `IsAimedFirearm` | 64 | `TRUE` 34, `true` 30 |
| `JamGunChance` | 64 | `0` 22, `2` 15, `1` 14, `5` 5, `0.8` 2, +5 |
| `MaxAmmo` | 64 | `30` 14, `6` 13, `8` 8, `20` 6, `5` 5, +7 |
| `MaxSightRange` | 64 | `10.0` 18, `9` 15, `6` 11, `10` 6, `6.0` 5, +6 |
| `MinSightRange` | 64 | `2` 42, `3` 22 |
| `MultipleHitConditionAffected` | 64 | `FALSE` 34, `false` 30 |
| `Ranged` | 64 | `TRUE` 34, `true` 30 |
| `RecoilDelay` | 64 | `15` 14, `30` 13, `25` 9, `35` 8, `12` 5, +10 |
| `SoundGain` | 64 | `2` 34, `2.0` 22, `1.5` 7, `1.2` 1 |
| `SoundRadius` | 64 | `100` 22, `200` 15, `150` 8, `170` 4, `120` 3, +8 |
| `SoundVolume` | 64 | `200` 43, `35` 8, `30` 5, `75` 2, `50` 2, +3 |
| `StopPower` | 64 | `2.0` 11, `3` 11, `40` 9, `5` 8, `20.0` 5, +15 |
| `UseEndurance` | 64 | `FALSE` 34, `false` 30 |
| `WeaponReloadType` | 64 | `boltaction` 21, `shotgun` 11, `handgun` 10, `revolver` 9, `boltactionnomag` 7, +3 |
| `AimReleaseSound` | 63 | `M16AimRelease` 15, `JS2000ShotgunAimRelease` 8, `M9AimRelease` 4, `M1911AimRelease` 4, `MagnumAimRelease` 4, +15 |
| `MuzzleFlashModelKey` | 63 | `muzzle_flash_shotgun` 19, `muzzle_flash_revolver` 9, `muzzle_flash_handgun` 9, `muzzle_flash_assault_rifle` 5, `muzzle_flash_hunting_rifle` 3, +9 |
| `CloseKillMove` | 62 | `Jaw_Stab` 62 |
| `HeadCondition` | 62 | `10` 32, `6` 6, `100` 5, `13` 4, `5` 4, +7 |
| `ModelWeaponPart` | 62 | `Base.ExtendedRecoilPad Base.ExtendedRecoil_Pad recoilpad recoilpad` 20, `Pistol_Silencer Pistol_Silencer silencer silencer` 4, `AR_Silencer AR_Silencer silencer silencer` 2, `CloseBolt JS2000_Pump pump pump` 2, `556Muzzle 556Muzzle muzzle_end muzzle_end` 2, +30 |
| `ShellFallSound` | 62 | `M16CartridgeFall` 12, `M9CartridgeFall` 9, `JS2000ShotgunCartridgeFall` 8, `MagnumCartridgeFall` 4, `DoubleBarrelShotgunCartridgeFall` 3, +13 |
| `PiercingBullets` | 60 | `FALSE` 23, `TRUE` 15, `true` 13, `false` 9 |
| `HeadConditionLowerChanceMultiplier` | 59 | `1.5` 24, `1.0` 23, `2.0` 11, `0.5` 1 |
| `RackSound` | 59 | `M16Rack` 11, `M9Rack` 9, `JS2000ShotgunRack` 8, `MagnumRack` 4, `MSR788Rack` 3, +14 |
| `MaxHitCount` | 53 | `1` 36, `9` 14, `3` 2, `10` 1 |
| `SwingTime` | 53 | `0.5` 34, `2` 16, `3` 2, `3.0` 1 |
| `DisplayName` | 52 | `Sawed-off Double Barrel Shotgun` 2, `Remington Model 788` 2, `Remington Model 700` 2, `Remington 870` 2, `M16` 1, +43 |
| `RackAfterShoot` | 52 | `FALSE` 30, `TRUE` 10, `true` 8, `false` 4 |
| `AimingTime` | 50 | `40` 35, `30` 6, `25` 5, `20` 2, `35` 2 |
| `NPCSoundBoost` | 50 | `1.5` 50 |
| `ProjectileCount` | 50 | `1` 36, `9` 14 |
| `ReloadTime` | 50 | `25` 43, `35` 6, `15` 1 |
| `ShareDamage` | 50 | `FALSE` 50 |
| `ToHitModifier` | 50 | `1.5` 49, `2.5` 1 |
| `AimingPerkMinAngleModifier` | 49 | `0` 21, `0.01` 17, `0.05` 6, `0.04` 3, `0.02` 1, +1 |
| `AimingPerkRangeModifier` | 49 | `0` 49 |
| `WorldStaticModel` | 45 | `AerosolBombSensor` 5, `FlameTrapSensor` 5, `NoiseMakerSensor` 5, `PipeBombSensor` 5, `SmokeBombSensor` 5, +19 |
| `WeaponSpritesByIndex` | 41 | `M16A1;M16A2;M733` 1, `BallPeenHammer;BallPeenHammerForged` 1, `ClubHammer;ClubHammerForged` 1, `Crowbar;CrowbarForged` 1, `GardenHoe;GardenHoeForged` 1, +36 |
| `EnduranceMod` | 40 | `3.0` 22, `4.0` 9, `1.3` 3, `2.0` 2, `1.7` 1, +3 |
| `MinimumSwingTime` | 39 | `0.5` 36, `3` 2, `3.0` 1 |
| `OnCreate` | 37 | `MarzVanillaGuns_OnCreate.AttachParts` 27, `SpecialLootSpawns.OnCreateWeaponWithStock` 4, `Fishing.onCreateFishingRod` 2, `ItemCodeOnCreate.onCreateIDCard` 1, `ItemCodeOnCreate.onCreateRandomColor` 1, +2 |
| `FireMode` | 35 | `Single` 26, `Auto` 7, `Burst` 2 |
| `ExplosionSound` | 34 | `PipeBombExplode` 7, `AerosolBombExplode` 6, `FlameTrapExplode` 6, `NoiseMakerActivate` 6, `SmokeBombLoop` 6, +3 |
| `PhysicsObject` | 34 | `Base.PipeBomb` 7, `Base.Aerosolbomb` 6, `Base.NoiseTrap` 6, `Base.SmokeBomb` 6, `Base.FlameTrap` 5, +2 |
| `UseSelf` | 34 | `true` 34 |
| `Aimingtime` | 33 | `40` 11, `25` 7, `50` 4, `45` 4, `30` 2, +4 |
| `Projectilecount` | 33 | `1` 27, `9` 6 |
| `Reloadtime` | 33 | `25` 24, `30` 9 |
| `MagazineType` | 32 | `Base.556Clip` 4, `Base.9mmClip` 3, `Base.JS14_Clip` 2, `Base.45Clip` 2, `Base.MP5Mag` 2, +18 |
| `IconsForTexture` | 29 | `Mossberg_Wood;Mossberg_Wood_Black` 2, `Mossberg_Wood_Sawed;Mossberg_Wood_Black_Sawed` 2, `Mossberg_Plastic;Mossberg_Plastic_Black` 2, `BallPeenHammer;BallPeenHammer_Forged` 1, `ClubHammer_Forged;ClubHammer` 1, +21 |
| `CanBePlaced` | 27 | `true` 27 |
| `AlwaysKnockdown` | 26 | `true` 26 |
| `FireStartingChance` | 26 | `50` 12, `0` 7, `10` 6, `30` 1 |
| `FireStartingEnergy` | 26 | `40` 12, `0` 7, `20` 6, `30` 1 |
| `Tooltip` | 25 | `Tooltip_Trap` 6, `Tooltip_no_nails` 4, `Tooltip_item_CutGrass` 4, `Tooltip_item_NotARealAxe` 2, `Tooltip_item_PickAxe` 2, +6 |
| `PlacedSprite` | 24 | `constructedobjects_01_32` 18, `constructedobjects_01_40` 6 |
| `CantAttackWithLowestEndurance` | 23 | `true` 23 |
| `SoundMap` | 23 | `SpearStab SpearHuntingKnifeStab` 5, `SpearStab SpearKnifeStab` 3, `SpearStab LongSpearStab` 2, `SpearStab SpearBoneStab` 1, `SpearStab LongSpearBoneStab` 1, +11 |
| `CyclicRateMultiplier` | 21 | `1.0` 19, `2.0` 2 |
| `ExplosionTimer` | 20 | `5` 12, `10` 8 |
| `FireModePossibilities` | 20 | `Auto/Single` 14, `Auto/Single/Burst` 3, `Burst/Single` 1, `Single` 1, `Single/Burst` 1 |
| `HaveChamber` | 20 | `TRUE` 11, `false` 8, `FALSE` 1 |
| `HeadConditionMax` | 19 | `10` 12, `100` 5, `8` 1, `6` 1 |
| `AngleFalloff` | 17 | `TRUE` 9, `true` 4, `false` 2, `FALSE` 2 |
| `InsertAllBulletsReload` | 17 | `FALSE` 13, `true` 3, `TRUE` 1 |
| `DigType` | 15 | `Shovel` 7, `Trowel` 4, `Hoe` 2, `PickAxe` 2 |
| `ProjectileSpread` | 15 | `1` 6, `1.5` 3, `0.6` 2, `1.0` 2, `2.0` 1, +1 |
| `ProjectileWeightCenter` | 15 | `1.0` 15 |
| `RangeFalloff` | 15 | `TRUE` 9, `true` 6 |
| `SensorRange` | 15 | `3` 5, `4` 5, `6` 3, `5` 2 |
| `NoiseRange` | 14 | `17` 6, `10` 6, `80` 1, `60` 1 |
| `CanBarricade` | 13 | `true` 13 |
| `ExplosionPower` | 13 | `90` 7, `70` 6 |
| `ExplosionRange` | 13 | `7` 7, `6` 6 |
| `ManuallyRemoveSpentRounds` | 12 | `TRUE` 8, `true` 4 |
| `NoiseDuration` | 12 | `30` 6, `10` 6 |
| `haveChamber` | 10 | `FALSE` 8, `TRUE` 2 |
| `ClipSize` | 9 | `15` 7, `20` 1, `6` 1 |
| `FireRange` | 9 | `6` 6, `0` 2, `4` 1 |
| `ResearchableRecipes` | 9 | `MakeLegendaryTacticalAxe` 1, `MakeLegendaryTacticalBat` 1, `MakeLegendaryTacticalCrowbar` 1, `MakeLegendaryTacticalHammer` 1, `MakeLegendaryTacticalKnife` 1, +4 |
| `CanBeReused` | 6 | `true` 6 |
| `ExplosionDuration` | 6 | `10` 6 |
| `SmokeRange` | 6 | `5` 6 |
| `CanBeRemote` | 5 | `true` 5 |
| `ColorBlue` | 3 | `10` 2, `210` 1 |
| `ColorGreen` | 3 | `50` 1, `220` 1, `10` 1 |
| `ColorRed` | 3 | `50` 1, `10` 1, `220` 1 |
| `needtobeclosedoncereload` | 3 | `true` 3 |
| `OtherHandRequire` | 3 | `base:lighter` 3 |
| `OtherHandUse` | 3 | `true` 3 |
| `triggerExplosionTimer` | 3 | `50` 3 |
| `WeaponWeight` | 3 | `3` 2, `0` 1 |
| `CanStoreWater` | 2 | `true` 2 |
| `displaycategory` | 2 | `Weapon` 2 |
| `dropsound` | 2 | `MetalBaseballBatDrop` 1, `AxeDrop` 1 |
| `EatType` | 2 | `Saucepan` 2 |
| `FireFuelRatio` | 2 | `0.75` 2 |
| `IconFluidMask` | 2 | `Saucepan_Mask` 2 |
| `IsCookable` | 2 | `true` 2 |
| `RainFactor` | 2 | `0.8` 2 |
| `SurvivalGear` | 2 | `true` 2 |
| `WorldStaticModelsByIndex` | 2 | `KnifeButterflyClosed;KnifeButterflyClosed2` 1, `KnifePocketClosed;KnifePocketClosed2` 1 |
| `critDmgMultiplier` | 1 | `6` 1 |
| `damagemakehole` | 1 | `true` 1 |
| `IconColorMask` | 1 | `Umbrella_Mask` 1 |
| `impactsound` | 1 | `SwordHit` 1 |

## Catálogo

Todas as armas por classe, em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). Dano é `MinDamage`–`MaxDamage`, alcance é `MaxRange`, velocidade é `BaseSpeed`, peso é `Weight` e condição é `ConditionMax`. "Mãos" é `1`, `2` (`TwoHandWeapon`: perde dano se usada com uma mão) ou `exige 2` (`RequiresEquippedBothHands`).

### Arma de fogo

| Nome | ID | Origem | Munição | Pente | Dano | Alcance | Crítico % | Peso | Condição |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Rifle L94 | `Base.L94_Rifle` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_3030` | 6 | 1.2–2 | 30 | 25 | 3.5 | 10 |
| _FN Fal_ | `Base.FN_FAL` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_308` | 20 | 1.25–3 | 30 | 20 | 3.7 | 10 |
| _H&K G3_ | `Base.G3` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_308` | 20 | 1.25–3 | 30 | 20 | 3.5 | 10 |
| _M60_ | `Base.M60` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_308` | 100 | 1.25–3 | 30 | 20 | 6 | 10 |
| Rifle M1A | `Base.AssaultRifle2` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_308` | 20 | 1.2–2 | 40 | 30 | 4.5 | 10 |
| Rifle MSR788 | `Base.HuntingRifle` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_308` | 4 | 1.2–2 | 40 | 30 | 4 | 10 |
| Rifle Tático MSR7T | `Base.MSR7T_Rifle` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_308` | 4 | 1.2–2 | 40 | 35 | 4.5 | 10 |
| _Sawed-off Remington Model 788_ | `Base.HuntingRifle_Sawn` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_308` | 10 | 1.25–3 | 17 | 30 | 4 | 10 |
| _SR-25 Rifle_ | `Base.SR25_Rifle` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_308` | 20 | 1–1.8 | 40 | 25 | 4.5 | 10 |
| Carabina L92 | `Base.L92_Carbine` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_357` | 10 | 1–1.6 | 24 | 20 | 3.5 | 10 |
| _Colt Python_ | `Base.ColtPython` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_357` | 6 | 1–2 | 15 | 20 | 1.7 | 10 |
| _Colt Python Hunter_ | `Base.ColtPythonHunter` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_357` | 6 | 1–2 | 16 | 20 | 2 | 10 |
| Revólver SN38 | `Base.Revolver_Short` | vanilla (alterada por Firearms B42, Firearms B42 Beta) | `base:bullets_38` | 6 | 1–2 | 12 | 20 | 1 | 10 |
| _Colt Anaconda_ | `Base.ColtAnaconda` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_44` | 6 | 1.25–2.5 | 16 | 20 | 2 | 10 |
| Magnum | `Base.Revolver_Long` | vanilla (alterada por Firearms B42, Firearms B42 Beta) | `base:bullets_44` | 6 | 1.25–2.5 | 15 | 20 | 1.7 | 10 |
| Pistola B-F | `Base.Pistol3` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_44` | 8 | 1–1.6 | 17 | 20 | 2 | 10 |
| _Sawed-off Marlin Model 1894_ | `Base.L92_Carbine_Sawn` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_44` | 5 | 1.25–2.5 | 25 | 20 | 3.5 | 10 |
| Carabina de Caçador | `Base.TrapperCarbine` | vanilla (alterada por Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_45` | 7 | 1–1.4 | 20 | 22 | 3.2 | 10 |
| _Ingram MAC 10_ | `Base.Mac10` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_45` | 30 | 0.75–2.25 | 15 | 20 | 3 | 10 |
| Pistola M1911 | `Base.Pistol2` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_45` | 7 | 0.9–1.2 | 12 | 20 | 1.5 | 10 |
| Revólver de Patrulha | `Base.Revolver` | vanilla (alterada por Firearms B42, Firearms B42 Beta) | `base:bullets_45` | 6 | 1–2.25 | 15 | 20 | 1.4 | 10 |
| _JS-556 Rifle_ | `Base.AC556` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_556` | 30 | 1–1.6 | 30 | 15 | 3.2 | 10 |
| _M16A3 Assault Rifle_ | `Base.AssaultRifleA3` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_556` | 30 | 1–1.6 | 30 | 20 | 4 | 10 |
| _M4_ | `Base.M4` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_556` | 30 | 1–2.75 | 25 | 20 | 3.3 | 10 |
| _M4 Carbine_ | `Base.AssaultRifleM4` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_556` | 30 | 0.9–1.5 | 30 | 18 | 3.2 | 10 |
| Rifle de Assalto M16 | `Base.AssaultRifle` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_556` | 30 | 1–1.6 | 30 | 20 | 4 | 10 |
| Rifle JS-14 | `Base.JS14_Rifle` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_556` | 20 | 1–1.6 | 30 | 20 | 3.5 | 10 |
| Rifle MSR700 | `Base.VarmintRifle` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_556` | 5 | 1–1.6 | 30 | 20 | 4 | 10 |
| _Glock 17_ | `Base.Glock17` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_9mm` | 17 | 0.65–2 | 15 | 20 | 1.3 | 10 |
| _Glock 17 Pistol_ | `Base.PistolGlock` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_9mm` | 15 | 0.7–0.9 | 15 | 20 | 1.3 | 10 |
| _JS5 SMG_ | `Base.JS5_smg` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_9mm` | 30 | 1–1.6 | 30 | 20 | 4 | 10 |
| _M93R Pistol_ | `Base.Pistolm93r` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_9mm` | 15 | 0.6–1 | 15 | 20 | 1.5 | 10 |
| _MP5 SMG_ | `Base.MP5_SMG` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_9mm` | 30 | 0.6–1 | 20 | 15 | 2.6 | 10 |
| _MP5A1_ | `Base.MP5` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_9mm` | 30 | 0.65–2.25 | 18 | 20 | 2.5 | 10 |
| _MP5SD_ | `Base.MP5SD` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_9mm` | 30 | 0.65–2.25 | 18 | 20 | 2.5 | 10 |
| _MP5SD SMG_ | `Base.MP5SD_SMG` | Vanilla Weapons Plus - Gunworks Edition | `base:bullets_9mm` | 30 | 0.5–0.9 | 20 | 15 | 2.5 | 10 |
| Pistola M9 | `Base.Pistol` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:bullets_9mm` | 15 | 0.6–1 | 15 | 20 | 1.5 | 10 |
| _UZI Carbine_ | `Base.UZI` | Firearms B42 (alterada por Firearms B42 Beta) | `base:bullets_9mm` | 20 | 0.65–2 | 16 | 20 | 3.5 | 10 |
| Pistola de Brinquedo com Espoleta | `Base.Revolver_CapGun` | vanilla | `base:cap_gun_cap` | 8 | 0–0 | 0.6 | 0 | 0.5 | 10 |
| Rifle de Brinquedo com Espoleta | `Base.Rifle_CapGun` | vanilla | `base:cap_gun_cap` | 8 | 0–0 | 0.6 | 0 | 2 | 10 |
| Escopeta Tática JS-3T | `Base.JS3T_Shotgun` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:shotgun_shells` | 7 | 1.5–2.2 | 12 | 70 | 4.5 | 10 |
| Espingarda de Cano Duplo | `Base.DoubleBarrelShotgun` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:shotgun_shells` | 2 | 1.5–2.2 | 15 | 70 | 4 | 10 |
| Espingarda de Cano Duplo Serrada | `Base.DoubleBarrelShotgunSawnoff` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:shotgun_shells` | 2 | 1.2–1.8 | 8 | 50 | 3 | 10 |
| Espingarda JS-2000 | `Base.Shotgun` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:shotgun_shells` | 5 | 1.5–2.2 | 12 | 70 | 4 | 10 |
| Espingarda JS-2000 de Cano Serrado | `Base.ShotgunSawnoff` | vanilla (alterada por Firearms B42, Firearms B42 Beta, Vanilla Weapons Plus - Gunworks Edition) | `base:shotgun_shells` | 5 | 1.3–2 | 10 | 50 | 3 | 10 |
| _Franchi LAW-12_ | `Base.LAW12` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 8 | 1.5–2.2 | 15 | 70 | 4 | 10 |
| _Franchi SPAS-12_ | `Base.SPAS12` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 8 | 1.5–2.2 | 15 | 70 | 4 | 10 |
| _Mossberg 590_ | `Base.Mossberg500` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 6 | 1.5–2.2 | 15 | 70 | 4 | 10 |
| _Mossberg 590A1 Tactical_ | `Base.Mossberg500Tactical` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 8 | 1.5–2.2 | 15 | 70 | 3.5 | 10 |
| _Remington 870_ | `Base.Remington870` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 6 | 1.5–2.2 | 15 | 70 | 4 | 10 |
| _Remington 870_ | `Base.Remington870Wood` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 6 | 1.5–2.2 | 15 | 70 | 4 | 10 |
| _Sawed-off Double Barrel Shotgun_ | `Base.DoubleBarrelShotgunSawnoffStock` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 2 | 1.5–2.2 | 15 | 70 | 2 | 10 |
| _Sawed-off M37_ | `Base.JS3T_Shotgun_Sawnoff` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 5 | 1.5–2.2 | 15 | 70 | 3.5 | 10 |
| _Sawed-off Remington 870_ | `Base.Remington870Sawnoff` | Firearms B42 (alterada por Firearms B42 Beta) | `base:shotgun_shells` | 6 | 1.5–2.2 | 15 | 70 | 3.5 | 10 |
| _Side by Side Shotgun_ | `Base.Side_By_Side` | Vanilla Weapons Plus - Gunworks Edition | `base:shotgun_shells` | 2 | 1.5–2.2 | 15 | 70 | 2 | 10 |
| _Colt Delta_ | `Base.ColtDelta` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_10mm` | 8 | 0.75–2.25 | 15 | 20 | 1.4 | 10 |
| _MP5/10_ | `Base.MP510` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_10mm` | 30 | 0.65–2.25 | 18 | 20 | 2.5 | 10 |
| _Colt Ace_ | `Base.ColtAce` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_22` | 10 | 0.55–1.5 | 15 | 20 | 1.4 | 10 |
| _Colt Single Action Frontier Scout_ | `Base.ColtSingleAction22` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_22` | 6 | 0.75–1.5 | 15 | 20 | 1.4 | 10 |
| _M1 Garand_ | `Base.M1Garand` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_30_06` | 8 | 1.25–3.25 | 25 | 30 | 4 | 10 |
| _Colt Single Action Army_ | `Base.ColtPeacemaker` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_44_40` | 6 | 1.25–2.5 | 15 | 20 | 1.8 | 10 |
| _AKM_ | `Base.AKM` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_762x39` | 30 | 1.25–2.75 | 25 | 20 | 3.5 | 10 |
| _SKS_ | `Base.SKS` | Firearms B42 (alterada por Firearms B42 Beta) | `firearms:bullets_762x39` | 10 | 1.75–2.75 | 25 | 30 | 4 | 10 |
| _AK-47 Assault Rifle_ | `Base.AssaultRifleAK47` | Vanilla Weapons Plus - Gunworks Edition | `mvgi:bullets_762` | 30 | 1.1–1.7 | 30 | 22 | 4 | 10 |

### Explosivo

| Nome | ID | Origem | Efeito | Uso | Alcance | Peso |
| --- | --- | --- | --- | --- | ---: | ---: |
| `Grenade` | `Base.Grenade` | Firearms B42 (alterada por Firearms B42 Beta) | explosão 90 (raio 7) | arremesso | 10 | 1 |
| Bomba de Aerossol | `Base.Aerosolbomb` | vanilla | explosão 70 (raio 6) | arremesso | 10 | 1.5 |
| Bomba de Aerossol com Sensor de Curto Alcance | `Base.AerosolbombSensorV1` | vanilla | explosão 70 (raio 6) | arremesso, colocável, temporizador, sensor 3 | 10 | 1.5 |
| Bomba de Aerossol com Sensor de Longo Alcance | `Base.AerosolbombSensorV3` | vanilla | explosão 70 (raio 6) | arremesso, colocável, temporizador, sensor 6 | 10 | 1.5 |
| Bomba de Aerossol com Sensor de Médio Alcance | `Base.AerosolbombSensorV2` | vanilla | explosão 70 (raio 6) | arremesso, colocável, temporizador, sensor 4 | 10 | 1.5 |
| Bomba de Aerossol com Temporizador | `Base.AerosolbombTriggered` | vanilla | explosão 70 (raio 6) | arremesso, colocável, temporizador | 10 | 1.5 |
| Bomba de Aerossol Remota | `Base.AerosolbombRemote` | vanilla | explosão 70 (raio 6) | arremesso, colocável, remoto | 10 | 1.5 |
| Bomba de Cano | `Base.PipeBomb` | vanilla | explosão 90 (raio 7) | arremesso | 10 | 1.5 |
| Bomba de Cano com Sensor de Curto Alcance | `Base.PipeBombSensorV1` | vanilla | explosão 90 (raio 7) | arremesso, colocável, temporizador, sensor 3 | 10 | 1.5 |
| Bomba de Cano com Sensor de Longo Alcance | `Base.PipeBombSensorV3` | vanilla | explosão 90 (raio 7) | arremesso, colocável, temporizador, sensor 6 | 10 | 1.5 |
| Bomba de Cano com Sensor de Médio Alcance | `Base.PipeBombSensorV2` | vanilla | explosão 90 (raio 7) | arremesso, colocável, temporizador, sensor 4 | 10 | 1.5 |
| Bomba de Cano com Temporizador | `Base.PipeBombTriggered` | vanilla | explosão 90 (raio 7) | arremesso, colocável, temporizador | 10 | 1.5 |
| Bomba de Cano Remota | `Base.PipeBombRemote` | vanilla | explosão 90 (raio 7) | arremesso, colocável, remoto | 10 | 1.5 |
| Bomba de Fumaça | `Base.SmokeBomb` | vanilla | fumaça (raio 5); ruído (raio 10, 10 s) | arremesso, colocável | 10 | 1.5 |
| Bomba de Fumaça com Sensor de Curto Alcance | `Base.SmokeBombSensorV1` | vanilla | fumaça (raio 5); ruído (raio 10, 10 s) | arremesso, colocável, temporizador, sensor 3 | 10 | 1.5 |
| Bomba de Fumaça com Sensor de Longo Alcance | `Base.SmokeBombSensorV3` | vanilla | fumaça (raio 5); ruído (raio 10, 10 s) | arremesso, colocável, temporizador, sensor 5 | 10 | 1.5 |
| Bomba de Fumaça com Sensor de Médio Alcance | `Base.SmokeBombSensorV2` | vanilla | fumaça (raio 5); ruído (raio 10, 10 s) | arremesso, colocável, temporizador, sensor 4 | 10 | 1.5 |
| Bomba de Fumaça com Temporizador | `Base.SmokeBombTriggered` | vanilla | fumaça (raio 5); ruído (raio 10, 10 s) | arremesso, colocável, temporizador | 10 | 1.5 |
| Bomba de Fumaça Remota | `Base.SmokeBombRemote` | vanilla | fumaça (raio 5); ruído (raio 10, 10 s) | arremesso, colocável, remoto | 10 | 1.5 |
| Bomba Incendiária | `Base.FlameTrap` | vanilla | fogo (raio 6) | arremesso | 10 | 1.5 |
| Bomba Incendiária com Sensor de Curto Alcance | `Base.FlameTrapSensorV1` | vanilla | fogo (raio 6) | arremesso, colocável, temporizador, sensor 3 | 10 | 1.5 |
| Bomba Incendiária com Sensor de Longo Alcance | `Base.FlameTrapSensorV3` | vanilla | fogo (raio 6) | arremesso, colocável, temporizador, sensor 5 | 10 | 1.5 |
| Bomba Incendiária com Sensor de Médio Alcance | `Base.FlameTrapSensorV2` | vanilla | fogo (raio 6) | arremesso, colocável, temporizador, sensor 4 | 10 | 1.5 |
| Bomba Incendiária com Temporizador | `Base.FlameTrapTriggered` | vanilla | fogo (raio 6) | arremesso, colocável, temporizador | 3 | 1.5 |
| Bomba Incendiária Remota | `Base.FlameTrapRemote` | vanilla | fogo (raio 6) | arremesso, colocável, remoto | 10 | 1.5 |
| Bombinha - Artesanal | `Base.Firecracker_Crafted` | vanilla | ruído (raio 60) | arremesso | 10 | 0.1 |
| Bombinhas | `Base.Firecracker` | vanilla | ruído (raio 80) | arremesso | 10 | 0.1 |
| Coquetel Molotov | `Base.Molotov` | vanilla | fogo (raio 4) | arremesso | 8 | 1.5 |
| Gerador de Ruído | `Base.NoiseTrap` | vanilla | ruído (raio 17, 30 s) | arremesso, colocável | 10 | 1.5 |
| Gerador de Ruído com Sensor de Curto Alcance | `Base.NoiseTrapSensorV1` | vanilla | ruído (raio 17, 30 s) | arremesso, colocável, temporizador, sensor 3 | 10 | 1.5 |
| Gerador de Ruído com Sensor de Longo Alcance | `Base.NoiseTrapSensorV3` | vanilla | ruído (raio 17, 30 s) | arremesso, colocável, temporizador, sensor 6 | 10 | 1.5 |
| Gerador de Ruído com Sensor de Médio Alcance | `Base.NoiseTrapSensorV2` | vanilla | ruído (raio 17, 30 s) | arremesso, colocável, temporizador, sensor 4 | 10 | 1.5 |
| Gerador de Ruído com Temporizador | `Base.NoiseTrapTriggered` | vanilla | ruído (raio 17, 30 s) | arremesso, colocável, temporizador | 10 | 1.5 |
| Gerador de Ruído Remoto | `Base.NoiseTrapRemote` | vanilla | ruído (raio 17, 30 s) | arremesso, colocável, remoto | 10 | 1.5 |

### Machado

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Arma de Sucata Metálica com Cabeça de Pá de Corte | `Base.ScrapWeaponSpade` | vanilla | 0.8–2 | 1.2 | 30 | 1 | 4 | 10 | 2 |  |
| Arma de Sucata Metálica com Disco de Freio | `Base.ScrapWeapon_Brake` | vanilla | 0.8–1.9 | 1.2 | 30 | 1 | 4 | 10 | 2 |  |
| Arma de Sucata Metálica com Forcado de Jardim | `Base.ScrapWeaponGardenFork` | vanilla | 0.8–2 | 1.2 | 30 | 1 | 4 | 10 | 2 |  |
| Bastão Curto com Cravo Ferroviário | `Base.ShortBat_RailSpike` | vanilla | 0.7–1.4 | 1.23 | 20 | 1.05 | 1.5 | 15 | 1 |  |
| Bastão Curto com Lâmina de Serra | `Base.ShortBat_Sawblade` | vanilla | 0.7–1.5 | 1.23 | 20 | 1 | 3 | 13 | 1 |  |
| Cabo Grande com Cravo Ferroviário | `Base.LongHandle_Railspike` | vanilla | 0.7–1.5 | 1.25 | 10 | 1 | 2 | 10 | 2 | sim |
| Cabo Grande com Lâmina de Serra | `Base.LongHandle_Sawblade` | vanilla | 0.7–1.5 | 1.25 | 10 | 1 | 2 | 10 | 2 |  |
| Clava de Osso Resistente com Espinhos | `Base.LargeBoneClub_Spiked` | vanilla | 0.7–1.5 | 1.1 | 25 | 1.1 | 2.5 | 10 | 1 |  |
| Cutelo de Carne | `Base.MeatCleaver` | vanilla | 0.4–0.8 | 1 | 15 | 1.2 | 1 | 10 | 1 |  |
| Cutelo de Carne | `Base.MeatCleaverForged` | vanilla | 0.4–0.8 | 1 | 15 | 1.2 | 1 | 10 | 1 |  |
| Cutelo de Sucata Metálica | `Base.MeatCleaver_Scrap` | vanilla | 0.3–0.7 | 1 | 10 | 1 | 2 | 10 | 1 |  |
| Cutelo-Machado de Sucata Metálica | `Base.Axe_ScrapCleaver` | vanilla | 0.6–1.7 | 1.35 | 10 | 0.9 | 3 | 10 | exige 2 |  |
| Foice de Mão | `Base.HandScythe` | vanilla | 0.6–1.2 | 1.1 | 15 | 1.1 | 1 | 5 | 1 |  |
| Foice de Mão | `Base.HandScytheForged` | vanilla | 0.6–1.2 | 1.1 | 15 | 1.1 | 1 | 5 | 1 |  |
| Gadanha com Lâmina de Pedra | `Base.PrimitiveScythe` | vanilla | 0.6–1 | 1.1 | 15 | 1.1 | 1 | 5 | 1 |  |
| Galho com Cravo Ferroviário | `Base.TreeBranch_Railspike` | vanilla | 0.5–1 | 1.1 | 25 | 1 | 2 | 5 | 1 | sim |
| Machadinha | `Base.HandAxe` | vanilla | 0.7–1.5 | 1.1 | 15 | 1 | 1.5 | 10 | 1 |  |
| Machadinha | `Base.HandAxeForged` | vanilla | 0.7–1.5 | 1.1 | 15 | 1 | 1.5 | 10 | 1 |  |
| Machadinha Antiga | `Base.HandAxe_Old` | vanilla | 0.7–1.5 | 1.1 | 15 | 1 | 2 | 10 | 1 |  |
| Machadinha com Lâmina de Serra | `Base.Axe_Sawblade_Hatchet` | vanilla | 0.6–1.3 | 1.1 | 10 | 0.95 | 2 | 10 | 1 |  |
| Machadinha de Guerra de Osso | `Base.Hatchet_Bone` | vanilla | 0.5–1 | 1.1 | 25 | 1 | 1.5 | 10 | 1 |  |
| Machado | `Base.Axe_Old` | vanilla | 0.8–2 | 1.2 | 20 | 1 | 3 | 13 | 2 |  |
| Machado com Lâmina de Serra | `Base.Axe_Sawblade` | vanilla | 0.7–1.8 | 1.4 | 15 | 0.95 | 3 | 10 | 2 |  |
| Machado de Bombeiro | `Base.Axe` | vanilla | 0.8–2 | 1.2 | 20 | 1 | 3 | 13 | 2 |  |
| Machado de Guerra de Mandíbula | `Base.JawboneBovide_Axe` | vanilla | 0.6–1.1 | 1.2 | 35 | 1.1 | 2 | 10 | 2 |  |
| Machado Grande de Pedra | `Base.StoneAxeLarge` | vanilla | 0.7–1.8 | 1.35 | 15 | 1 | 3 | 10 | exige 2 |  |
| Machado para Lenha | `Base.WoodAxe` | vanilla | 1.3–3 | 1.35 | 50 | 1 | 3 | 15 | exige 2 |  |
| Machado para Lenha | `Base.WoodAxeForged` | vanilla | 1.3–3 | 1.35 | 50 | 1 | 3 | 15 | exige 2 |  |
| Machado Rústico de Pedra | `Base.AxeStone` | vanilla | 0.5–1.5 | 1.2 | 15 | 1 | 2 | 5 | 2 |  |
| Machado Tático Lendário | `LTW.LegendaryTacticalAxe` | Legendary Tactical Weapons | 1.6–3.8 | 1.2 | 30 | 1 | 2 | 100 | 2 |  |
| Machado Viking | `BCGRareWeapons.VikingAxe` | Bushcraft Gear - Rare Weapons | 8–10 | 1.35 | 30 | 1 | 3 | 12 | exige 2 |  |
| Pá de Entrincheiramento | `Base.EntrenchingTool` | vanilla | 0.5–1.3 | 1.1 | 10 | 1 | 2 | 10 | 1 |  |
| Perna de Mesa Antiga com Lâmina de Serra | `Base.TableLeg_Sawblade` | vanilla | 0.9–1.7 | 1 | 20 | 1 | 2 | 4 | exige 2 | sim |
| Picareta | `Base.PickAxe` | vanilla | 1–2.2 | 1.6 | 25 | 0.8 | 3 | 13 | 2 |  |
| Picareta | `Base.PickAxeForged` | vanilla | 1–2.2 | 1.6 | 25 | 0.8 | 3 | 13 | 2 |  |
| Picareta de Gelo | `Base.IceAxe` | vanilla | 0.7–1.5 | 1.2 | 15 | 1 | 2 | 10 | 1 |  |
| Porrete com Cabeça de Pá de Corte | `Base.Cudgel_SpadeHead` | vanilla | 1.8–3 | 1.35 | 50 | 0.85 | 6 | 10 | exige 2 |  |
| Porrete com Disco de Freio | `Base.Cudgel_Brake` | vanilla | 2–3 | 1.35 | 50 | 0.85 | 6 | 10 | exige 2 |  |
| Porrete com Lâmina de Serra | `Base.Cudgel_Sawblade` | vanilla | 1.9–3 | 1.35 | 50 | 0.85 | 6 | 10 | exige 2 |  |
| Serra de Sílex | `Base.Saw_Flint` | vanilla | 0.6–1 | 1.1 | 15 | 1.1 | 1 | 5 | 1 |  |
| Tábua com Disco de Freio | `Base.Plank_Brake` | vanilla | 0.8–1.7 | 1.25 | 20 | 1 | 4 | 10 | exige 2 |  |
| Tábua com Lâmina de Serra | `Base.Plank_Sawblade` | vanilla | 0.7–1.5 | 1.25 | 10 | 1 | 4 | 10 | exige 2 |  |
| Taco de Beisebol com Cravo Ferroviário | `Base.BaseballBat_RailSpike` | vanilla | 1.2–1.9 | 1.28 | 40 | 1 | 2.5 | 10 | 2 |  |
| Taco de Beisebol com Lâmina de Serra | `Base.BaseballBat_Sawblade` | vanilla | 1.2–1.9 | 1.2 | 30 | 1 | 2.5 | 10 | 2 |  |
| Taco de Beisebol de Metal com Lâmina de Serra | `Base.BaseballBat_Metal_Sawblade` | vanilla | 1.2–1.9 | 1.2 | 30 | 1 | 2.5 | 15 | 2 |  |
| Taco de Hóquei de Campo com Lâmina de Serra | `Base.FieldHockeyStick_Sawblade` | vanilla | 0.7–1.5 | 1.63 | 10 | 0.9 | 1.5 | 7 | 2 | sim |
| Tomahawk Tático Lendário | `LTW.LegendaryTacticalTomahawk` | Legendary Tactical Weapons | 1–2.2 | 1.1 | 28 | 1.1 | 1 | 100 | 1 |  |
| Tubo de Ferro com Cravo Ferroviário | `Base.MetalPipe_Railspike` | vanilla | 0.6–1 | 1.2 | 30 | 0.95 | 1.5 | 8 | 1 |  |

### Lâmina longa

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Espada | `Base.Sword` | vanilla | 2–3 | 1.4 | 20 | 1 | 2 | 13 | 2 |  |
| Espada Curta | `Base.ShortSword` | vanilla | 1.5–2 | 1.23 | 20 | 1 | 1.5 | 13 | 1 |  |
| Espada Curta de Sucata Metálica | `Base.ShortSword_Scrap` | vanilla | 0.9–1.8 | 1.23 | 20 | 1 | 2 | 10 | 1 |  |
| Espada Curta Simples | `Base.CrudeShortSword` | vanilla | 1–2 | 1.23 | 20 | 1 | 1.5 | 10 | 1 |  |
| Espada de Sucata Metálica | `Base.Sword_Scrap` | vanilla | 1.5–2.5 | 1.4 | 20 | 1 | 3 | 10 | exige 2 |  |
| Espada de Sucata Metálica Quebrada | `Base.Sword_Scrap_Broken` | vanilla | 0.9–1.6 | 1.23 | 20 | 1 | 2 | 10 | 1 |  |
| Espada Quebrada | `Base.Sword_Broken` | vanilla | 1.4–1.8 | 1.23 | 20 | 1 | 1.5 | 13 | 1 |  |
| Espada Simples | `Base.CrudeSword` | vanilla | 1.5–3 | 1.4 | 20 | 1 | 2 | 10 | 2 |  |
| Espada Simples Quebrada | `Base.CrudeSword_Broken` | vanilla | 0.9–1.8 | 1.23 | 20 | 1 | 1.5 | 10 | 1 |  |
| Espada Tática Lendária | `LTW.LegendaryTacticalSword` | Legendary Tactical Weapons | 8–14 | 2 | 35 | 1 | 1.5 | 100 | 2 |  |
| Facão | `Base.Machete` | vanilla | 2–3 | 1.23 | 20 | 1 | 2 | 13 | 1 |  |
| Facão | `Base.MacheteForged` | vanilla | 2–3 | 1.23 | 20 | 1 | 2 | 13 | 1 |  |
| Facão de Sucata Metálica | `Base.Machete_Crude` | vanilla | 1–2 | 1.23 | 10 | 1 | 2 | 10 | 1 |  |
| Katana | `Base.Katana` | vanilla | 8–8 | 1.4 | 35 | 1 | 2 | 10 | 2 |  |
| Katana Quebrada | `Base.Katana_Broken` | vanilla | 1.5–2 | 1.23 | 20 | 1 | 1.5 | 10 | 1 |  |

### Lâmina curta

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Abridor de Cartas | `Base.LetterOpener` | vanilla | 0.1–0.1 | 0.8 | 5 | — | 0.3 | 5 | 1 |  |
| Abridor de Latas - Modelo Antigo | `Base.TinOpener_Old` | vanilla | 0.3–0.4 | 0.8 | 10 | — | 0.6 | 10 | 1 |  |
| Adaga com Guarda | `Base.HandguardDagger` | vanilla | 0.6–1.2 | 0.9 | 50 | — | 1 | 5 | 1 |  |
| Bisturi | `Base.Scalpel` | vanilla | 0.1–0.4 | 0.8 | 10 | — | 0.3 | 5 | 1 |  |
| Canivete | `Base.KnifePocket` | vanilla | 0.3–0.6 | 0.9 | 20 | — | 0.3 | 10 | 1 |  |
| Canivete Automático | `Base.SwitchKnife` | vanilla | 0.3–0.6 | 0.9 | 20 | — | 0.3 | 10 | 1 |  |
| Canivete Borboleta | `Base.KnifeButterfly` | vanilla | 0.3–0.6 | 0.9 | 20 | — | 0.3 | 10 | 1 |  |
| Chave de Fenda | `Base.Screwdriver` | vanilla | 0.3–0.7 | 0.85 | 10 | — | 0.5 | 10 | 1 | sim |
| Chave de Fenda | `Base.Screwdriver_Old` | vanilla | 0.3–0.7 | 0.85 | 10 | — | 0.5 | 10 | 1 | sim |
| Chave de Fenda Improvisada | `Base.Screwdriver_Improvised` | vanilla | 0.3–0.7 | 0.85 | 10 | — | 0.5 | 3 | 1 | sim |
| Colher | `Base.Spoon` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.25 | 3 | 1 |  |
| Colher de Osso | `Base.Spoon_Bone` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.25 | 1 | 1 |  |
| Colher de Ouro | `Base.Spoon_Gold` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.25 | 1 | 1 |  |
| Colher de Pedreiro | `Base.MasonsTrowel` | vanilla | 0.2–0.4 | 0.9 | 30 | — | 1 | 6 | 1 |  |
| Colher de Prata | `Base.Spoon_Silver` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.25 | 2 | 1 |  |
| Colher Forjada | `Base.SpoonForged` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.25 | 3 | 1 |  |
| Cravo Ferroviário | `Base.RailroadSpike` | vanilla | 0.3–0.4 | 0.9 | 5 | — | 0.5 | 15 | 1 |  |
| Estaca | `Base.Stake` | vanilla | 0.25–0.53 | 0.85 | 10 | — | 0.5 | 5 | 1 |  |
| Faca de Caça | `Base.HuntingKnife` | vanilla | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | 1 |  |
| Faca de Caça | `Base.HuntingKnifeForged` | vanilla | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | 1 |  |
| Faca de Churrasco | `Base.SteakKnife` | vanilla | 0.3–0.7 | 0.9 | 25 | — | 0.5 | 5 | 1 |  |
| Faca de Combate | `Base.FightingKnife` | vanilla | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | 1 |  |
| Faca de Cozinha | `Base.KitchenKnife` | vanilla | 0.3–0.7 | 0.9 | 25 | — | 0.7 | 10 | 1 |  |
| Faca de Cozinha | `Base.KitchenKnifeForged` | vanilla | 0.3–0.7 | 0.9 | 25 | — | 0.6 | 10 | 1 |  |
| Faca de Cravo Ferroviário | `Base.RailroadSpikeKnife` | vanilla | 0.3–0.7 | 0.9 | 25 | — | 0.5 | 10 | 1 |  |
| Faca de Descascar | `Base.KnifeParing` | vanilla | 0.3–0.4 | 0.8 | 10 | — | 0.3 | 10 | 1 |  |
| Faca de Filetar | `Base.KnifeFillet` | vanilla | 0.3–0.5 | 0.9 | 10 | — | 0.7 | 5 | 1 |  |
| Faca de Lâmina de Facão | `Base.MacheteKnife` | vanilla | 0.6–1.1 | 0.9 | 30 | — | 1 | 10 | 1 |  |
| Faca de Manteiga | `Base.ButterKnife` | vanilla | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 3 | 1 |  |
| Faca de Manteiga de Ouro | `Base.ButterKnife_Gold` | vanilla | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 1 | 1 |  |
| Faca de Manteiga de Prata | `Base.ButterKnife_Silver` | vanilla | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 2 | 1 |  |
| Faca de Osso Cega | `Base.DullBoneKnife` | vanilla | 0.1–0.4 | 0.8 | 7 | — | 0.25 | 1 | 1 |  |
| Faca de Pão | `Base.BreadKnife` | vanilla | 0.1–0.4 | 1 | 15 | — | 1 | 5 | 1 |  |
| Faca de Pedra | `Base.FlintKnife` | vanilla | 0.4–0.6 | 0.69 | 20 | — | 0.75 | 6 | 1 |  |
| Faca de Sushi | `Base.KnifeSushi` | vanilla | 0.3–0.7 | 0.9 | 25 | — | 0.7 | 15 | 1 |  |
| Faca Grande | `Base.LargeKnife` | vanilla | 0.6–1.1 | 0.9 | 30 | — | 1 | 10 | 1 |  |
| Faca Grande de Sucata Metálica | `Base.LargeKnife_Scrap` | vanilla | 0.6–1.1 | 0.9 | 20 | — | 1 | 10 | 1 |  |
| Faca Improvisada | `Base.KnifeShiv` | vanilla | 0.3–0.5 | 0.8 | 10 | — | 0.5 | 5 | 1 |  |
| Faca Improvisada de Escova de Dentes | `Base.Toothbrush_Shiv` | vanilla | 0.3–0.5 | 0.8 | 10 | — | 0.25 | 5 | 1 |  |
| Faca Longa de Pedra | `Base.StoneKnifeLong` | vanilla | 0.7–1.1 | 0.85 | 20 | — | 1 | 6 | 1 |  |
| Faca Longa Simples de Metal | `Base.LongCrudeKnife` | vanilla | 0.6–1.2 | 0.9 | 50 | — | 1 | 5 | 1 |  |
| Faca Pequena | `Base.SmallKnife` | vanilla | 0.3–0.6 | 0.9 | 20 | — | 0.5 | 8 | 1 |  |
| Faca Simples de Metal | `Base.CrudeKnife` | vanilla | 0.5–0.9 | 0.9 | 25 | — | 0.7 | 6 | 1 |  |
| Faca Tática Lendária | `LTW.LegendaryTacticalKnife` | Legendary Tactical Weapons | 1–2 | 1 | 55 | — | 0.8 | 100 | 1 |  |
| Garfo | `Base.Fork` | vanilla | 0.1–0.1 | 0.8 | 5 | — | 0.25 | 3 | 1 |  |
| Garfo de Jardinagem | `Base.HandFork` | vanilla | 0.2–0.4 | 0.9 | 10 | — | 1 | 6 | 1 |  |
| Garfo de Osso | `Base.Fork_Bone` | vanilla | 0.1–0.1 | 0.8 | 5 | — | 0.25 | 1 | 1 |  |
| Garfo de Ouro | `Base.Fork_Gold` | vanilla | 0.1–0.1 | 0.8 | 5 | — | 0.25 | 1 | 1 |  |
| Garfo de Prata | `Base.Fork_Silver` | vanilla | 0.1–0.1 | 0.8 | 5 | — | 0.25 | 2 | 1 |  |
| Garfo de Trinchar | `Base.CarvingFork2` | vanilla | 0.2–0.4 | 0.9 | 10 | — | 0.5 | 6 | 1 |  |
| Garfo Forjado | `Base.ForkForged` | vanilla | 0.1–0.1 | 0.8 | 5 | — | 0.25 | 3 | 1 |  |
| Garrafa Quebrada | `Base.SmashedBottle` | vanilla | 0.2–0.5 | 0.8 | 5 | 1.4 | 1 | 3 | 1 |  |
| Handiknife | `Base.Handiknife` | vanilla | 0.3–0.5 | 0.9 | 25 | — | 0.4 | 10 | 1 |  |
| _M9 Bayonet_ | `ALICE.M9Bayonet` | ALICE Gear | 1.2–2 | 1.2 | 50 | — | 0.46 | 25 | 1 |  |
| _M9 Bayonet_ | `Base.M9_Bayonet` | Vanilla Weapons Plus - Gunworks Edition | 0.6–1.2 | 0.9 | 50 | — | 1 | 10 | 1 |  |
| Multiferramenta | `Base.Multitool` | vanilla | 0.3–0.6 | 0.9 | 25 | — | 0.5 | 10 | 1 |  |
| Osso Longo e Afiado | `Base.SharpBone_Long` | vanilla | 0.6–1 | 0.85 | 20 | — | 1 | 5 | 1 |  |
| Pá de Jardinagem | `Base.HandShovel` | vanilla | 0.2–0.4 | 0.9 | 30 | — | 1 | 6 | 1 |  |
| Picador de Gelo | `Base.IcePick` | vanilla | 0.6–0.9 | 0.8 | 10 | — | 0.3 | 10 | 1 |  |
| Punhal de Vidro | `Base.GlassShiv` | vanilla | 0.3–0.5 | 0.8 | 10 | — | 0.5 | 1 | 1 |  |
| Tesoura | `Base.Scissors` | vanilla | 0.1–0.1 | 0.9 | 5 | — | 0.5 | 10 | 1 |  |
| Tesoura Rudimentar | `Base.ScissorsForged` | vanilla | 0.1–0.1 | 0.9 | 5 | — | 0.5 | 10 | 1 |  |

### Contundente longa

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Alicate Corta-vergalhão | `Base.BoltCutters` | vanilla | 0.6–1.15 | 1.25 | 20 | 1 | 4 | 15 | 2 |  |
| Ancinho | `Base.Rake` | vanilla | 0.2–0.5 | 1.6 | 5 | 1.2 | 2 | 4 | 2 | sim |
| Ancinho para Folhas | `Base.LeafRake` | vanilla | 0.2–0.4 | 1.6 | 5 | 1.2 | 1.5 | 4 | 2 | sim |
| Arma de Sucata Metálica com Cabeça de Ancinho | `Base.ScrapWeaponRakeHead` | vanilla | 0.6–1.5 | 1.2 | 30 | 1 | 3 | 10 | 2 |  |
| Baixo Elétrico | `Base.GuitarElectricBass` | vanilla | 0.9–1.4 | 1.35 | 70 | 1 | 3.5 | 12 | 2 |  |
| Banjo | `Base.Banjo` | vanilla | 0.3–0.6 | 1.25 | 5 | 1.1 | 3 | 3 | 2 |  |
| Barra de Aço | `Base.SteelBar` | vanilla | 0.6–1.15 | 1.25 | 20 | 1 | 2 | 8 | 2 |  |
| Barra de Ferro | `Base.IronBar` | vanilla | 0.6–1.15 | 1.25 | 20 | 1 | 2 | 8 | 2 |  |
| Barra de Pesos | `Base.BarBell` | vanilla | 1.8–2.8 | 1.35 | 0 | 0.7 | 6 | 15 | exige 2 |  |
| Barra de Pesos | `Base.BarBell_Forged` | vanilla | 1.8–2.8 | 1.35 | 0 | 0.7 | 6 | 15 | exige 2 |  |
| Barra Tatica Lendaria | `LTW.LegendaryTacticalBar` | Legendary Tactical Weapons | 0.6–1.15 | 1.25 | 20 | 1 | 2 | 8 | 2 |  |
| Bicheiro | `Base.Gaffhook` | vanilla | 0.2–0.4 | 1.6 | 5 | 1.2 | 1.5 | 4 | 2 | sim |
| Cabeça de Forcado de Jardim | `Base.GardenForkHead` | vanilla | 0.4–0.8 | 1.1 | 15 | 1.2 | 1 | 10 | 1 |  |
| Cabeça de Forcado de Jardim | `Base.GardenForkHead_Forged` | vanilla | 0.4–0.8 | 1.1 | 15 | 1.2 | 1 | 10 | 1 |  |
| Cabo Grande | `Base.LongHandle` | vanilla | 0.5–0.9 | 1.25 | 25 | 1 | 2 | 10 | 2 | sim |
| Cabo Grande - Reforçado com Lata | `Base.LongHandle_Can` | vanilla | 0.6–1 | 1.28 | 30 | 1 | 2.5 | 15 | 2 | sim |
| Cabo Grande com Dentes de Ancinho | `Base.LongHandle_RakeHead` | vanilla | 0.7–1.5 | 1.25 | 10 | 1 | 2 | 10 | 2 | sim |
| Cabo Grande com Disco de Freio | `Base.LongHandle_Brake` | vanilla | 0.8–1.7 | 1.25 | 20 | 1 | 4 | 10 | exige 2 | sim |
| Cabo Grande com Pregos | `Base.LongHandle_Nails` | vanilla | 0.7–1.4 | 1.28 | 30 | 1 | 2 | 10 | 2 | sim |
| Cavalinho de Pau | `Base.HobbyHorse` | vanilla | 0.4–0.8 | 1.25 | 5 | 0.85 | 2 | 5 | 2 | sim |
| Clava Longa com Espinhos | `Base.LongSpikedClub` | vanilla | 0.9–1.5 | 0.9 | 10 | 1 | 2 | 10 | 2 | sim |
| Enxada de Jardim | `Base.GardenHoe` | vanilla | 0.6–1.7 | 1.6 | 35 | 0.85 | 2 | 10 | 2 |  |
| Enxada de Jardim | `Base.GardenHoeForged` | vanilla | 0.6–1.7 | 1.6 | 35 | 0.85 | 2 | 10 | 2 |  |
| Esfregão | `Base.Mop` | vanilla | 0.2–0.5 | 1.6 | 5 | 1.2 | 2 | 3 | 2 | sim |
| Extrator de Cravos Ferroviários | `Base.RailroadSpikePuller` | vanilla | 2–3 | 1.35 | 0 | 0.9 | 6 | 10 | exige 2 |  |
| Extrator de Cravos Ferroviários | `Base.RailroadSpikePullerOld` | vanilla | 2–3 | 1.35 | 0 | 0.9 | 6 | 10 | exige 2 |  |
| Galho Grande | `Base.LargeBranch` | vanilla | 1.4–2.1 | 1.35 | 30 | 0.85 | 6 | 10 | exige 2 |  |
| Guitarra Elétrica | `Base.GuitarElectric` | vanilla | 0.8–1.2 | 1.35 | 55 | 1.1 | 2.8 | 10 | 2 |  |
| Haste de Madeira - Reforçada com Lata | `Base.WoodenStick_Can` | vanilla | 0.5–0.9 | 1.3 | 30 | 1 | 2.5 | 8 | 2 | sim |
| ITEM DE DESENVOLVIMENTO DE PESCA (NÃO GERAR) | `Base.FISH_DEV_ITEM` | vanilla | 0.2–0.3 | 1.55 | 5 | 1.3 | 0.01 | 3 | 2 | sim |
| Keytar | `Base.Keytar` | vanilla | 0.2–0.7 | 1.25 | 20 | 1.2 | 2 | 2 | 2 |  |
| Lâmina de Pá de Corte | `Base.SpadeHead` | vanilla | 0.4–0.8 | 1.1 | 15 | 1.2 | 1 | 10 | 1 |  |
| Maça Longa | `Base.LongMace` | vanilla | 1–2 | 1.25 | 40 | 1 | 2.5 | 15 | 2 | sim |
| Maça Longa de Pedra | `Base.LongMace_Stone` | vanilla | 1–1.6 | 1.25 | 40 | 1 | 2.5 | 15 | 2 | sim |
| Maça-estrela de Mandíbula | `Base.JawboneBovide_Morningstar` | vanilla | 1.3–3 | 1.35 | 50 | 1 | 4 | 15 | exige 2 |  |
| Maça-estrela de Sucata Metálica | `Base.Morningstar_Scrap` | vanilla | 0.8–1.6 | 1.28 | 30 | 0.95 | 3 | 10 | 2 |  |
| Marreta | `Base.Sledgehammer` | vanilla | 2–3 | 1.35 | 0 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta | `Base.Sledgehammer2` | vanilla | 2–3 | 1.35 | 0 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta | `Base.SledgehammerForged` | vanilla | 2–3 | 1.35 | 0 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta de Balde - Cabo de Madeira | `Base.BucketMace_Wood` | vanilla | 1.5–3 | 1.35 | 70 | 0.9 | 10 | 10 | exige 2 |  |
| Marreta de Balde - Cabo de Metal | `Base.BucketMace_Metal` | vanilla | 1.5–3 | 1.35 | 70 | 0.9 | 10 | 10 | exige 2 |  |
| Marreta de Bloco de Ferro | `Base.BlockMaul` | vanilla | 2–3 | 1.35 | 40 | 0.9 | 4 | 10 | exige 2 |  |
| Marreta de Chaleira - Cabo de Madeira | `Base.KettleMace_Wood` | vanilla | 2–3 | 1.35 | 40 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta de Chaleira - Cabo de Metal | `Base.KettleMace_Metal` | vanilla | 2–3 | 1.35 | 40 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta de Peças de Motor | `Base.EngineMaul` | vanilla | 1.5–2.5 | 1.35 | 40 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta de Pedra | `Base.StoneMaul` | vanilla | 1.5–2 | 1.35 | 0 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta de Sucata Metálica | `Base.ScrapMaul` | vanilla | 1.5–2.5 | 1.35 | 40 | 0.9 | 6 | 10 | exige 2 |  |
| Marreta Tática Lendária | `LTW.LegendaryTacticalSledgehammer` | Legendary Tactical Weapons | 2.5–3.5 | 1.35 | 35 | 0.95 | 5 | 100 | exige 2 |  |
| Muda | `Base.Sapling` | vanilla | 0.3–0.6 | 1.6 | 5 | 1.2 | 2 | 5 | 2 | sim |
| Pá | `Base.Shovel2` | vanilla | 0.8–1.9 | 1.6 | 40 | 0.8 | 2 | 10 | 2 |  |
| Pá de Corte | `Base.Shovel` | vanilla | 0.8–1.9 | 1.6 | 40 | 0.8 | 2 | 10 | 2 |  |
| Pá de Corte | `Base.SpadeForged` | vanilla | 0.8–1.9 | 1.6 | 40 | 0.8 | 2 | 10 | 2 |  |
| Pá de Corte de Madeira | `Base.SpadeWood` | vanilla | 0.4–0.8 | 1.6 | 20 | 0.8 | 2 | 8 | 2 |  |
| Pá de Neve | `Base.SnowShovel` | vanilla | 0.8–1.9 | 1.6 | 40 | 0.8 | 2 | 10 | 2 |  |
| Pé de Cabra | `Base.Crowbar` | vanilla | 0.6–1.15 | 1.25 | 20 | 1 | 2 | 15 | 2 |  |
| Pé de Cabra | `Base.CrowbarForged` | vanilla | 0.6–1.15 | 1.25 | 20 | 1 | 2 | 15 | 2 |  |
| Pé-de-cabra Tático Lendário | `LTW.LegendaryTacticalCrowbar` | Legendary Tactical Weapons | 1.4–2.9 | 1.25 | 25 | 1 | 2 | 100 | 2 |  |
| Perna de Mesa Antiga | `Base.TableLeg` | vanilla | 0.5–0.9 | 1 | 10 | 1 | 2 | 4 | 2 | sim |
| Perna de Mesa Antiga - Acorrentada | `Base.TableLeg_Chain` | vanilla | 0.9–1.7 | 1 | 10 | 0.9 | 6 | 4 | exige 2 | sim |
| Perna de Mesa Antiga com Pregos | `Base.TableLeg_Nails` | vanilla | 0.7–1.3 | 1 | 10 | 1 | 2 | 4 | 2 | sim |
| Porrete - Reforçado com Chapa Metálica | `Base.Cudgel_ScrapSheet` | vanilla | 1.6–2.3 | 1.35 | 50 | 0.85 | 6 | 20 | exige 2 |  |
| Porrete com Cabeça de Forcado de Jardim | `Base.Cudgel_GardenForkHead` | vanilla | 1.8–3 | 1.35 | 50 | 0.85 | 6 | 10 | exige 2 |  |
| Porrete com Cravos Ferroviários | `Base.Cudgel_Railspike` | vanilla | 1.8–2.9 | 1.35 | 50 | 0.85 | 6 | 10 | exige 2 |  |
| Porrete com Pontas | `Base.Cudgel_Spike` | vanilla | 1.8–2.9 | 1.35 | 50 | 0.85 | 6 | 10 | exige 2 |  |
| Porrete com Pontas de Osso | `Base.Cudgel_Bone` | vanilla | 1.8–2.6 | 1.35 | 40 | 0.85 | 6 | 10 | exige 2 |  |
| Porrete com Pregos | `Base.Cudgel_Nails` | vanilla | 1.7–2.5 | 1.35 | 40 | 0.85 | 6 | 10 | exige 2 |  |
| Remo de Canoa | `Base.CanoePadel` | vanilla | 0.5–1.3 | 1.6 | 40 | 0.85 | 2 | 10 | 2 | sim |
| Remo de Canoa - Duas Pás | `Base.CanoePadelX2` | vanilla | 0.8–1.9 | 1.6 | 50 | 0.8 | 2.2 | 10 | 2 | sim |
| Remo de Canoa Quebrado | `Base.CanoePadelX2_Broken` | vanilla | 0.5–1.3 | 1.6 | 40 | 0.85 | 2 | 10 | 2 | sim |
| Saxofone | `Base.Saxophone` | vanilla | 0.4–0.8 | 1.2 | 70 | 0.9 | 3 | 5 | 1 |  |
| Tábua | `Base.Plank` | vanilla | 0.4–0.6 | 1.3 | 30 | 0.9 | 3 | 10 | 2 | sim |
| Tábua com Pregos | `Base.Plank_Nails` | vanilla | 0.6–1.1 | 1.32 | 25 | 0.85 | 3 | 10 | 2 | sim |
| Tábua com Serra | `Base.Plank_Saw` | vanilla | 0.5–0.8 | 1.32 | 25 | 0.85 | 3 | 10 | 2 | sim |
| Taco de Beisebol | `Base.BaseballBat` | vanilla | 0.8–1.1 | 1.25 | 40 | 1 | 2 | 15 | 2 |  |
| Taco de Beisebol - Reforçado com Chapa de Metal | `Base.BaseballBat_ScrapSheet` | vanilla | 1–1.3 | 1.25 | 40 | 1 | 2.5 | 25 | 2 |  |
| Taco de Beisebol - Reforçado com Lata | `Base.BaseballBat_Can` | vanilla | 0.9–1.2 | 1.25 | 45 | 1 | 2 | 20 | 2 |  |
| Taco de Beisebol Artesanal | `Base.BaseballBat_Crafted` | vanilla | 0.8–1.1 | 1.25 | 40 | 1 | 2 | 15 | 2 |  |
| Taco de Beisebol com Cabeça de Forcado de Jardim | `Base.BaseballBat_GardenForkHead` | vanilla | 1.2–1.9 | 1.28 | 40 | 1 | 3 | 10 | 2 |  |
| Taco de Beisebol com Pontas | `Base.BaseballBat_Spiked` | vanilla | 1.2–1.9 | 1.28 | 40 | 1 | 2.5 | 10 | 2 |  |
| Taco de Beisebol com Pontas de Ancinho | `Base.BaseballBat_RakeHead` | vanilla | 1.2–1.9 | 1.28 | 40 | 1 | 2.5 | 20 | 2 |  |
| Taco de Beisebol com Pregos | `Base.BaseballBat_Nails` | vanilla | 1–1.5 | 1.28 | 30 | 0.95 | 2 | 15 | 2 |  |
| Taco de Beisebol de Metal | `Base.BaseballBat_Metal` | vanilla | 0.8–1.1 | 1.25 | 40 | 1 | 2 | 20 | 2 |  |
| Taco de Beisebol de Metal com Parafusos | `Base.BaseballBat_Metal_Bolts` | vanilla | 1.1–1.5 | 1.25 | 50 | 1 | 2.25 | 20 | 2 |  |
| Taco de Beisebol Reforçado | `BCGRareWeapons.ReinforcedBaseballBat` | Bushcraft Gear - Rare Weapons | 8–8 | 1.2 | 25 | 0.8 | 4 | 18 | 2 |  |
| Taco de Golfe | `Base.Golfclub` | vanilla | 0.5–1 | 1.42 | 25 | 1 | 2 | 5 | 2 |  |
| Taco de Hóquei de Campo | `Base.FieldHockeyStick` | vanilla | 0.3–0.7 | 1.6 | 30 | 0.9 | 1.5 | 7 | 2 | sim |
| Taco de Hóquei de Campo com Pregos | `Base.FieldHockeyStick_Nails` | vanilla | 0.5–1.1 | 1.63 | 30 | 0.9 | 1.5 | 7 | 2 | sim |
| Taco de Hóquei no Gelo | `Base.IceHockeyStick` | vanilla | 0.3–0.7 | 1.6 | 30 | 0.9 | 1.5 | 7 | 2 | sim |
| Taco de Hóquei no Gelo com Arame Farpado | `Base.IceHockeyStick_BarbedWire` | vanilla | 0.3–0.7 | 1.6 | 30 | 0.9 | 1.5 | 10 | 2 | sim |
| Taco de Lacrosse | `Base.LaCrosseStick` | vanilla | 0.3–0.7 | 1.6 | 30 | 0.9 | 0.4 | 10 | 2 | sim |
| Taco de Sinuca | `Base.Poolcue` | vanilla | 0.2–0.4 | 1.6 | 0 | 1.2 | 1 | 10 | 2 | sim |
| Taco Tático Lendário | `LTW.LegendaryTacticalBat` | Legendary Tactical Weapons | 1.3–2.7 | 1.28 | 25 | 1.05 | 1.5 | 100 | 2 |  |
| Trompete | `Base.Trumpet` | vanilla | 0.4–0.8 | 1.15 | 20 | 1 | 1 | 5 | 1 |  |
| Vara de Pesca | `Base.FishingRod` | vanilla | 0.2–0.3 | 1.55 | 5 | 1.3 | 1 | 3 | 2 | sim |
| Vara de Pesca Improvisada | `Base.CraftedFishingRod` | vanilla | 0.2–0.3 | 1.55 | 5 | 1.3 | 1 | 3 | 2 | sim |
| Vara de Pesca sem Linha | `Base.FishingRodBreak` | vanilla | 0.2–0.3 | 1.55 | 5 | 1.3 | 1 | 3 | 2 | sim |
| Vara Longa | `Base.LongStick` | vanilla | 0.3–0.6 | 1.6 | 5 | 1.2 | 2 | 5 | 2 | sim |
| Vassoura | `Base.Broom` | vanilla | 0.2–0.5 | 1.6 | 5 | 1.2 | 2 | 3 | 2 | sim |
| Vassoura com Arame Farpado | `Base.Broom_BarbedWire` | vanilla | 0.3–0.75 | 1.6 | 5 | 1.2 | 2 | 3 | 2 | sim |
| Vassoura de Graveto | `Base.Broom_Twig` | vanilla | 0.2–0.5 | 1.6 | 5 | 1.2 | 2 | 3 | 2 | sim |
| Violão | `Base.GuitarAcoustic` | vanilla | 0.3–0.8 | 1.3 | 20 | 0.9 | 2.6 | 2 | 2 |  |

### Contundente curta

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Atiçador de Lareira | `Base.FireplacePoker` | vanilla | 0.7–1.1 | 1.2 | 35 | 0.95 | 1.5 | 8 | 1 | sim |
| Baqueta | `Base.Drumstick` | vanilla | 0.1–0.2 | 0.9 | 0 | 1.3 | 0.5 | 1 | 1 | sim |
| Bastão Curto | `Base.ShortBat` | vanilla | 0.5–1 | 1.23 | 25 | 1.1 | 1.5 | 10 | 1 |  |
| Bastão Curto - Reforçado com Lata | `Base.ShortBat_Can` | vanilla | 0.6–1.1 | 1.26 | 30 | 1.1 | 2 | 15 | 1 |  |
| Bastão Curto com Dentes de Ancinho | `Base.ShortBat_RakeHead` | vanilla | 0.7–1.4 | 1.23 | 20 | 1.05 | 1.5 | 15 | 1 |  |
| Bastão Curto com Espinhos | `Base.SpikedShortBat` | vanilla | 0.6–1.2 | 1.2 | 30 | 1 | 2 | 15 | 1 |  |
| Bastão Curto com Pregos | `Base.ShortBat_Nails` | vanilla | 0.7–1.3 | 1.23 | 20 | 1.05 | 1.5 | 10 | 1 |  |
| Braço de Baixo Elétrico Quebrado | `Base.GuitarElectricBassNeck_Broken` | vanilla | 0.6–1.1 | 1.23 | 25 | 1.1 | 1.5 | 10 | 1 |  |
| Braço de Banjo Quebrado | `Base.BanjoNeck_Broken` | vanilla | 0.6–1.1 | 1.23 | 25 | 1.1 | 1.5 | 10 | 1 |  |
| Braço de Guitarra Elétrica Quebrado | `Base.GuitarElectricNeck_Broken` | vanilla | 0.6–1.1 | 1.23 | 25 | 1.1 | 1.5 | 10 | 1 |  |
| Braço de Violão Quebrado | `Base.GuitarAcousticNeck_Broken` | vanilla | 0.6–1.1 | 1.23 | 25 | 1.1 | 1.5 | 10 | 1 |  |
| Cabo Grande Quebrado | `Base.LongHandle_Broken` | vanilla | 0.4–0.8 | 1.1 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Cabo Grande Quebrado com Pregos | `Base.LongHandle_Broken_Nails` | vanilla | 0.6–1.1 | 1.1 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Cabo Médio | `Base.Handle` | vanilla | 0.3–0.5 | 1.1 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Cabo Médio - Reforçado com Lata | `Base.Handle_Can` | vanilla | 0.4–0.6 | 1.1 | 10 | 1.2 | 1.25 | 15 | 1 | sim |
| Cabo Médio com Pregos | `Base.Handle_Nails` | vanilla | 0.4–0.7 | 1.13 | 5 | 1.15 | 1 | 10 | 1 | sim |
| Cabo Quebrado de Ferramenta de Jardinagem | `Base.GardenToolHandle_Broken` | vanilla | 0.6–1.1 | 1.23 | 25 | 1.1 | 1.5 | 10 | 1 |  |
| Caçarola | `Base.Saucepan` | vanilla | 0.2–0.7 | 1 | 30 | 1 | 0.7 | 5 | 1 | sim |
| Caçarola de Cobre | `Base.SaucepanCopper` | vanilla | 0.2–0.7 | 1 | 30 | 1 | 0.7 | 5 | 1 | sim |
| Cassetete | `Base.Nightstick` | vanilla | 0.6–1.1 | 1.2 | 25 | 1 | 1.5 | 15 | 1 |  |
| Chave de Catraca | `Base.Ratchet` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1 | 9 | 1 |  |
| Chave Grifo | `Base.PipeWrench` | vanilla | 0.5–1 | 1.1 | 25 | 1 | 1.5 | 10 | 1 |  |
| Chave Inglesa | `Base.Wrench` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1 | 9 | 1 |  |
| Clava de Mandíbula | `Base.JawboneBovide_Club` | vanilla | 0.6–1.1 | 1.23 | 30 | 1.1 | 2 | 10 | 1 |  |
| Clava de Osso | `Base.BoneClub` | vanilla | 0.4–1 | 1.1 | 20 | 1.1 | 1.5 | 5 | 1 |  |
| Clava de Osso com Pontas | `Base.BoneClub_Spiked` | vanilla | 0.6–1.4 | 1.1 | 25 | 1.1 | 2 | 10 | 1 |  |
| Clava de Osso Resistente | `Base.LargeBoneClub` | vanilla | 0.5–1.1 | 1.1 | 25 | 1.1 | 2 | 5 | 1 |  |
| Desentupidor | `Base.Plunger` | vanilla | 0.3–0.5 | 1.1 | 5 | 1.2 | 0.5 | 3 | 1 | sim |
| Desentupidor com Arame Farpado | `Base.Plunger_BarbedWire` | vanilla | 0.45–0.75 | 1.1 | 5 | 1.2 | 0.5 | 6 | 1 | sim |
| Espátula para Desmontar Pneu | `Base.TireIron` | vanilla | 0.5–1 | 1.2 | 30 | 0.95 | 1.5 | 10 | 1 | sim |
| Flauta | `Base.Flute` | vanilla | 0.1–0.2 | 0.9 | 0 | 1.3 | 1 | 1 | 1 | sim |
| Formão de Carpinteiro | `Base.CarpentryChisel` | vanilla | 0.4–0.8 | 1.2 | 30 | 0.95 | 1 | 8 | 1 | sim |
| Frigideira | `Base.Pan` | vanilla | 0.3–0.5 | 1.1 | 30 | 1 | 1.5 | 10 | 1 | sim |
| Frigideira | `Base.PanForged` | vanilla | 0.3–0.5 | 1.1 | 30 | 1 | 1.5 | 10 | 1 | sim |
| Frigideira Grill | `Base.GridlePan` | vanilla | 0.25–0.45 | 1.1 | 30 | 1 | 1.5 | 10 | 1 | sim |
| Galho | `Base.TreeBranch2` | vanilla | 0.5–1 | 1.1 | 25 | 1 | 2 | 5 | 1 | sim |
| Galho - Reforçado com Lata | `Base.TreeBranch_Can` | vanilla | 0.6–1.1 | 1.13 | 30 | 1 | 2.5 | 8 | 1 | sim |
| Galho com Espinhos de Osso | `Base.TreeBranch_Bone` | vanilla | 0.5–1 | 1.1 | 25 | 1 | 2 | 5 | 1 |  |
| Galho com Pregos | `Base.TreeBranch_Nails` | vanilla | 0.7–1.2 | 1.1 | 25 | 1 | 2 | 5 | 1 | sim |
| Galho Quebrado | `Base.Branch_Broken` | vanilla | 0.4–0.8 | 1.1 | 5 | 1.2 | 1.5 | 5 | 1 | sim |
| Galho Quebrado com Pregos | `Base.Branch_Broken_Nails` | vanilla | 0.5–1 | 1.1 | 5 | 1.2 | 1.5 | 3 | 1 | sim |
| Gancho Grande | `Base.LargeHook` | vanilla | 0.5–1 | 0.8 | 15 | 1.1 | 2 | 5 | 1 |  |
| Haltere | `Base.DumbBell` | vanilla | 0.5–1 | 1 | 25 | 0.9 | 5 | 10 | 1 |  |
| Haltere | `Base.DumbBell_Forged` | vanilla | 0.5–1 | 1 | 25 | 0.9 | 5 | 10 | 1 |  |
| Haste de Aço | `Base.MetalBar` | vanilla | 0.7–1.1 | 1.2 | 30 | 0.95 | 1.5 | 8 | 1 | sim |
| Haste de Madeira | `Base.WoodenStick2` | vanilla | 0.4–0.8 | 1.3 | 25 | 1 | 2 | 5 | 1 | sim |
| Haste de Madeira com Pregos | `Base.WoodenStick_Nails` | vanilla | 0.5–1 | 1.33 | 25 | 1 | 2 | 5 | 1 | sim |
| Haste Quebrada | `Base.WoodenStick_Broken` | vanilla | 0.3–0.5 | 1.1 | 5 | 1.2 | 1 | 5 | 1 | sim |
| Haste Quebrada com Pregos | `Base.WoodenStick_Broken_Nails` | vanilla | 0.4–0.7 | 1.13 | 5 | 1.15 | 1 | 10 | 1 | sim |
| Lenha | `Base.Firewood` | vanilla | 0.4–0.7 | 1.1 | 5 | 1.2 | 1.5 | 1 | 1 | sim |
| Lenha com Pregos | `Base.Firewood_Nails` | vanilla | 0.6–1.1 | 1.1 | 5 | 1.2 | 1.5 | 1 | 1 | sim |
| Lima | `Base.File` | vanilla | 0.4–0.8 | 1.2 | 30 | 0.95 | 1 | 8 | 1 | sim |
| Maça | `Base.Mace` | vanilla | 0.8–1.4 | 1.2 | 40 | 1 | 1.5 | 15 | 1 |  |
| Maça de Bloco de Ferro | `Base.BlockMace` | vanilla | 0.5–1.2 | 1 | 30 | 1 | 2.5 | 10 | 1 |  |
| Maça de Pedra | `Base.Mace_Stone` | vanilla | 0.8–1.3 | 1.3 | 40 | 1 | 1.5 | 15 | 1 |  |
| Maça-estrela de Sucata Metálica - Curta | `Base.Morningstar_Scrap_Short` | vanilla | 0.7–1.4 | 1.1 | 30 | 0.95 | 2.25 | 10 | 1 |  |
| Macete de Madeira | `Base.WoodenMallet` | vanilla | 0.4–0.9 | 1 | 17 | 1.1 | 1.5 | 8 | 1 |  |
| Malhete | `Base.Gavel` | vanilla | 0.1–0.2 | 0.9 | 0 | 1.3 | 0.5 | 1 | 1 | sim |
| Mandíbula | `Base.JawboneBovide` | vanilla | 0.5–1.1 | 1.1 | 25 | 1.1 | 1.5 | 5 | 1 |  |
| Marreta Pequena | `Base.ClubHammer` | vanilla | 0.5–1 | 1 | 20 | 1 | 2 | 10 | 1 |  |
| Marreta Pequena | `Base.ClubHammerForged` | vanilla | 0.5–1 | 1 | 20 | 1 | 2 | 10 | 1 |  |
| Martelo de Bola | `Base.BallPeenHammer` | vanilla | 0.5–1 | 1 | 20 | 1 | 1.5 | 10 | 1 |  |
| Martelo de Bola | `Base.BallPeenHammerForged` | vanilla | 0.5–1 | 1 | 20 | 1 | 1.5 | 10 | 1 |  |
| Martelo de Ferreiro | `Base.SmithingHammer` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1.5 | 10 | 1 |  |
| Martelo de Pedra | `Base.HammerStone` | vanilla | 0.3–0.7 | 1.05 | 15 | 1 | 2 | 5 | 1 |  |
| Martelo de Unha | `Base.Hammer` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1.5 | 10 | 1 |  |
| Martelo de Unha | `Base.HammerForged` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1.5 | 10 | 1 |  |
| Martelo Tático Lendário | `LTW.LegendaryTacticalHammer` | Legendary Tactical Weapons | 1–2.2 | 1.12 | 30 | 1.05 | 1.3 | 100 | 1 |  |
| Meia Barra de Aço | `Base.SteelBarHalf` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1 | 8 | 1 |  |
| Meia Barra de Ferro | `Base.IronBarHalf` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 1 | 8 | 1 |  |
| Meia Haste de Aço | `Base.SteelRodHalf` | vanilla | 0.5–1 | 1.1 | 20 | 1 | 0.75 | 8 | 1 |  |
| Osso de Animal | `Base.AnimalBone` | vanilla | 0.4–1 | 1.1 | 20 | 1.1 | 1.5 | 5 | 1 |  |
| Osso de Animal Grande | `Base.LargeAnimalBone` | vanilla | 0.5–1.1 | 1.1 | 25 | 1.1 | 2 | 5 | 1 |  |
| Perna de Cadeira | `Base.ChairLeg` | vanilla | 0.4–0.8 | 1 | 5 | 1.1 | 1 | 3 | 1 | sim |
| Perna de Cadeira com Pregos | `Base.ChairLeg_Nails` | vanilla | 0.5–1 | 1 | 5 | 1.1 | 1 | 3 | 1 | sim |
| Perna de Mesa Quebrada | `Base.TableLeg_Broken` | vanilla | 0.4–0.8 | 1.1 | 5 | 1.2 | 1.5 | 10 | 1 | sim |
| Perna de Mesa Quebrada com Pregos | `Base.TableLeg_Broken_Nails` | vanilla | 0.6–1.2 | 1.1 | 5 | 1.2 | 1.5 | 10 | 1 | sim |
| Pino de Boliche | `Base.BowlingPin` | vanilla | 0.3–0.5 | 0.9 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Pino de Boliche com Pregos | `Base.BowlingPin_Nails` | vanilla | 0.5–0.7 | 0.9 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Placa de Identificação de Latão | `Base.BrassNameplate` | vanilla | 0.4–0.8 | 1.1 | 20 | 1 | 1 | 4 | 1 |  |
| Punção para Metalurgia | `Base.MetalworkingPunch` | vanilla | 0.4–0.8 | 1.2 | 30 | 0.95 | 1 | 8 | 1 | sim |
| Raquete de Badminton | `Base.BadmintonRacket` | vanilla | 0.1–0.2 | 1.25 | 0 | 1.2 | 1 | 4 | 1 | sim |
| Raquete de Tênis | `Base.TennisRacket` | vanilla | 0.3–0.5 | 1.25 | 5 | 1.1 | 1 | 4 | 1 | sim |
| Régua de Debug (oculta) | `Base.YardstickDEBUG` | vanilla | 0.1–0.2 | 0.9 | 0 | 1.3 | 3 | 1 | 1 | sim |
| Rolo de Massa | `Base.RollingPin` | vanilla | 0.2–0.5 | 1.1 | 15 | 1.2 | 1.5 | 8 | 1 |  |
| Tábua Quebrada | `Base.Plank_Broken` | vanilla | 0.4–0.7 | 1.1 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Tábua Quebrada com Pregos | `Base.Plank_Broken_Nails` | vanilla | 0.5–0.9 | 1.1 | 5 | 1.2 | 1 | 10 | 1 | sim |
| Taco de Beisebol Quebrado | `Base.BaseballBat_Broken` | vanilla | 0.5–0.9 | 1.23 | 20 | 1.1 | 1.5 | 5 | 1 |  |
| Taco de Beisebol Quebrado com Pregos | `Base.BaseballBat_Broken_Nails` | vanilla | 0.7–1.2 | 1.23 | 20 | 1.1 | 1.5 | 5 | 1 |  |
| Taco de Beisebol Reforçado Quebrado | `BCGRareWeapons.ReinforcedBaseballBat_Broken` | Bushcraft Gear - Rare Weapons | 0.5–0.9 | 1.15 | 20 | 1.1 | 3 | 5 | 1 |  |
| Taco de Hóquei de Campo Quebrado | `Base.FieldHockeyStick_Broken` | vanilla | 0.3–0.7 | 1.22 | 25 | 1 | 2 | 10 | 1 | sim |
| Taco de Hóquei de Campo Quebrado com Pregos | `Base.FieldHockeyStick_Broken_Nails` | vanilla | 0.5–1 | 1.25 | 30 | 1 | 2 | 10 | 1 | sim |
| Talhadeira de Pedreiro | `Base.MasonsChisel` | vanilla | 0.4–0.8 | 1.2 | 30 | 0.95 | 1 | 8 | 1 | sim |
| Talhadeira para Metal | `Base.MetalworkingChisel` | vanilla | 0.4–0.8 | 1.2 | 30 | 0.95 | 1 | 8 | 1 | sim |
| Tesoura para Chapa Metálica | `Base.SheetMetalSnips` | vanilla | 0.4–0.8 | 1.2 | 5 | 0.95 | 1 | 8 | 1 | sim |
| Tubo de Chumbo | `Base.LeadPipe` | vanilla | 0.7–1.2 | 1.15 | 30 | 0.93 | 1.5 | 15 | 1 | sim |
| Tubo de Ferro | `Base.MetalPipe` | vanilla | 0.6–1 | 1.2 | 30 | 0.95 | 1.5 | 8 | 1 | sim |
| Tubo de Ferro Quebrado | `Base.MetalPipe_Broken` | vanilla | 0.5–0.9 | 1.1 | 20 | 1 | 1 | 6 | 1 | sim |
| Vara Longa Quebrada | `Base.LongStick_Broken` | vanilla | 0.2–0.5 | 1.3 | 20 | 1.2 | 1.5 | 4 | 1 | sim |
| Violino | `Base.Violin` | vanilla | 0.2–0.4 | 1 | 5 | 1.2 | 0.7 | 1 | 1 |  |

### Lança

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| _Do not spawn me with the debug menu, I am not meant to be accesible dawg_ | `Base.Attack_Bayonet` | Vanilla Weapons Plus - Gunworks Edition | 1.2–1.7 | 1.48 | 20 | — | 0 | 10000 | 2 | sim |
| Forcado de Jardim | `Base.GardenFork` | vanilla | 1–1.5 | 1.37 | 30 | 0.9 | 2 | 10 | 2 | sim |
| Forcado de Jardim | `Base.GardenFork_Forged` | vanilla | 1–1.5 | 1.37 | 30 | 0.9 | 2 | 10 | 2 | sim |
| Guarda-chuva (Fechado) | `Base.ClosedUmbrellaBlack` | vanilla | 0.5–0.7 | 1.1 | 10 | 0.9 | 1 | 7 | 2 | sim |
| Guarda-chuva (Fechado) | `Base.ClosedUmbrellaBlue` | vanilla | 0.5–0.7 | 1.1 | 10 | 0.9 | 1 | 7 | 2 | sim |
| Guarda-chuva (Fechado) | `Base.ClosedUmbrellaRed` | vanilla | 0.5–0.7 | 1.1 | 10 | 0.9 | 1 | 7 | 2 | sim |
| Guarda-chuva (Fechado) | `Base.ClosedUmbrellaTINTED` | vanilla | 0.5–0.7 | 1.1 | 10 | 0.9 | 1 | 7 | 2 | sim |
| Guarda-chuva (Fechado) | `Base.ClosedUmbrellaWhite` | vanilla | 0.5–0.7 | 1.1 | 10 | 0.9 | 1 | 7 | 2 | sim |
| Lança com Chave de Fenda | `Base.SpearScrewdriver` | vanilla | 1.2–1.6 | 1.45 | 20 | — | 2.5 | 7 | 2 | sim |
| Lança com Desentupidor | `Base.Spear_Plunger` | vanilla | 0.3–0.6 | 1.55 | 0 | — | 2.5 | 6 | 2 | sim |
| Lança com Faca de Caça | `Base.SpearHuntingKnife` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 3 | 9 | 2 | sim |
| Lança com Faca de Churrasco | `Base.SpearSteakKnife` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.5 | 7 | 2 | sim |
| Lança com Faca de Combate | `Base.SpearFightingKnife` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 3 | 9 | 2 | sim |
| Lança com Faca de Cozinha | `Base.SpearKnife` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.7 | 7 | 2 | sim |
| Lança com Faca de Sucata Metálica | `Base.SpearScrapKnife` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 3 | 9 | 2 | sim |
| Lança com Faca Grande | `Base.SpearLargeKnife` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 3 | 9 | 2 | sim |
| Lança com Faca Pequena | `Base.SpearKnifeSmall` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.7 | 7 | 2 | sim |
| Lança com Garfo de Jardinagem | `Base.SpearHandFork` | vanilla | 1.1–1.6 | 1.45 | 20 | 0.95 | 3 | 7 | 2 | sim |
| Lança com Ponta de Metal | `Base.SpearShort` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.4 | 10 | 2 |  |
| Lança com Ponta de Osso | `Base.Spear_Bone` | vanilla | 0.9–1.5 | 1.45 | 20 | — | 2.4 | 6 | 2 |  |
| Lança com Ponta de Pedra | `Base.SpearStone` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.4 | 6 | 2 |  |
| Lança com Ponta de Vidro | `Base.SpearGlass` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.4 | 2 | 2 |  |
| Lança com Ponta Longa de Metal | `Base.SpearLong` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 2.7 | 10 | 2 |  |
| Lança com Ponta Longa de Osso | `Base.Spear_BoneLong` | vanilla | 1.1–1.6 | 1.48 | 20 | — | 2.7 | 6 | 2 |  |
| Lança com Ponta Longa de Pedra | `Base.SpearStoneLong` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 2.7 | 6 | 2 |  |
| Lança com Ponta Longa e Simples de Metal | `Base.SpearCrudeLong` | vanilla | 1.2–1.7 | 1.48 | 20 | — | 3 | 5 | 2 |  |
| Lança com Ponta Simples de Metal | `Base.SpearCrude` | vanilla | 1–1.6 | 1.45 | 20 | — | 2.5 | 4 | 2 |  |
| Lança com Tesoura | `Base.SpearScissors` | vanilla | 1–1.6 | 1.42 | 20 | — | 2.5 | 6 | 2 | sim |
| Lança de Madeira | `Base.SpearCrafted` | vanilla | 1–1.4 | 1.4 | 20 | — | 2 | 5 | 2 | sim |
| Lança de Madeira (Endurecida pelo Fogo) | `Base.SpearCraftedFireHardened` | vanilla | 1–1.5 | 1.4 | 30 | — | 2 | 7 | 2 | sim |
| Lança Tática Lendária | `LTW.LegendaryTacticalSpear` | Legendary Tactical Weapons | 1.9–3.6 | 1.6 | 35 | — | 2.7 | 100 | 2 |  |

### Desarmado

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Mãos Nuas | `Base.BareHands` | vanilla | 0.2–0.4 | 1.1 | 0 | — | 1 | — | 1 |  |

### Corpo a corpo sem perícia

| Nome | ID | Origem | Dano | Alcance | Crítico % | Velocidade | Peso | Condição | Mãos | Improvisada |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Caneta - Azul | `Base.BluePen` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.1 | 2 | 1 | sim |
| Caneta - Preta | `Base.Pen` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.1 | 2 | 1 | sim |
| Caneta - Spiffo | `Base.PenSpiffo` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.2 | 2 | 1 | sim |
| Caneta - Verde | `Base.GreenPen` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.1 | 2 | 1 | sim |
| Caneta - Vermelha | `Base.RedPen` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.1 | 2 | 1 | sim |
| Caneta Multicolorida | `Base.PenMultiColor` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.2 | 3 | 1 | sim |
| Caneta Tinteiro | `Base.PenFancy` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.2 | 3 | 1 | sim |
| Compasso Geométrico | `Base.CompassGeometry` | vanilla | 0.1–0.2 | 0.8 | 10 | — | 0.2 | 2 | 1 | sim |
| Lápis | `Base.Pencil` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.1 | 1 | 1 | sim |
| Lápis - Spiffo | `Base.PencilSpiffo` | vanilla | 0.1–0.1 | 0.8 | 0 | — | 0.2 | 1 | 1 | sim |
| Nódulo de Sílex | `Base.FlintNodule` | vanilla | 0.4–0.7 | 0.8 | 20 | 0.9 | 1 | 4 | 1 | sim |
| Pedra | `Base.Stone2` | vanilla | 0.4–0.7 | 0.8 | 20 | 0.9 | 1 | 4 | 1 | sim |
