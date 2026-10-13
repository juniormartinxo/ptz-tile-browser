# Bolsas

> Gerado por `node tools/bags_doc.js` a partir de `data/items.js` (extraído em 2026-09-28). Não edite à mão: rode `node build_items.js` e depois o script para atualizar.

Uma **bolsa** é um contêiner que vai no corpo: um item de script (`media/scripts`) cujo tipo é `container` (`ItemType = base:container`) e que declara um slot em `CanBeEquipped` (`base:back`, `base:satchel`...). São mochilas, bolsas de viagem, bolsas a tiracolo, pochetes, coletes, bolsas de cinto, bandoleiras e coldres. Cada uma é identificada por `<Módulo>.<Nome>`, ex.: `Base.Bag_Schoolbag`; é esse ID que o jogo usa, ex.: `getPlayer():getInventory():AddItem("Base.Bag_Schoolbag")`.

Total mapeado: **222 bolsas** de 4 origens (86 do jogo base), 86 com nome em PT-BR, 0 alteradas por outro mod e 0 ocultas por padrão na aba Itens. A maior é _ALICE Medium Field Pack_ (`ALICE.AliceBackpack`), com capacidade 40.

Os outros 225 contêineres (sacos, sacolas, estojos, caixas, chaveiros...) não têm `CanBeEquipped` e ficam fora do catálogo (veja [Outros contêineres](#outros-contêineres)).

## Como as bolsas são mapeadas

`build_items.js` lê os blocos `item` de todo `media/scripts/**/*.txt`, primeiro do jogo base e depois dos mods (de cada mod, a maior pasta `42.x` que não passa de `GAME_VER`, mais `common/`; sem pasta de versão, `media/`):

1. **Propriedades**: cada `chave = valor` do bloco vira uma string em `props`, sem conversão de tipo (`"18"`, `"0.98"`, `"base:back"`).
2. **Mods que redefinem um item**: se um mod declara um ID que já existe, as propriedades dele são mescladas por cima das anteriores e o nome do mod entra em `ovr`; a origem (`mod`) continua sendo quem o definiu primeiro.
3. **Nomes**: `pt` e `en` vêm de `ItemName` em `Translate/PTBR` e `Translate/EN`, do jogo base e dos mods. Sem tradução EN, `en` cai em `DisplayName`.
4. **Ícone**: o primeiro de `Icon`, `IconsForTexture`, `IconFluid` e o nome do item que for achado, como `Item_<nome>` ou `<nome>`, nos packs de textura lidos (`UI`, `UI2`, `IconsMoveables`, `RadioIcons`, `ApComUI` e os `pack=` dos mods) ou nos `.png` soltos de `media/textures`.

Na aba Itens, o filtro "Tipo → Contêiner / bolsa" da barra lateral mostra todos os contêineres, inclusive os que não vão no corpo; na busca, `k:canbeequipped` deixa só as bolsas e `canbeequipped=back` filtra pelo slot (por trecho, sem diferenciar maiúsculas).

## Formato de `data/items.js`

As bolsas ficam junto com os demais itens:

```js
window.PZ_ITEMS = {
  generated: "2026-09-28T16:29:54.165Z",   // data da extração
  pages: ["ninventory0", ...],              // páginas de ícones: icons/<page>.png
  cats: { pt: { Bag: "Bolsa", ... }, en: { ... } },   // nomes de DisplayCategory
  items: [{ id, mod, ovr, type, cat, pt, en, icon, props }, ...]
};
```

| Campo | Descrição |
| --- | --- |
| `id` | `<Módulo>.<Nome>`, ex.: `Base.Bag_ALICEpack`. |
| `mod` | `vanilla` ou o `name=` do `mod.info` do mod que definiu o item primeiro. |
| `ovr` | Mods que redefiniram o item depois (propriedades mescladas por cima). |
| `type` | `ItemType` (ou `Type`, se faltar) sem `base:`, em minúsculas e só com letras: `container` para todas as bolsas. |
| `cat` | `DisplayCategory`, a categoria mostrada no inventário (nome traduzido em `cats`). |
| `pt`, `en` | Nomes de exibição, ou `""`. |
| `icon` | `["p", página, ...recorte]` (pack), `["f", caminho]` (png solto), `["t", sprite]` (tile) ou `null`. |
| `props` | Todas as propriedades do bloco `item`, como strings. Nas bolsas, as principais são `CanBeEquipped` (slot), `Capacity` (capacidade), `WeightReduction` (redução do peso do conteúdo, em %), `Weight` (peso vazio) e `RunSpeedModifier` (modificador da velocidade de corrida). |

## Por classe

A classe não é um campo do jogo: é a parte do corpo onde a bolsa vai, que este script deriva do slot em `CanBeEquipped` por uma tabela mantida no script (veja [Por slot](#por-slot)). O script falha se aparecer um slot que a tabela não conhece. A classe segue o slot, não o nome: em "Costas" há mochilas, bolsas de viagem e estojos de arma, e em "Cintura" há bolsas de peito de mod que usam o slot de pochete. `BodyLocation`, quando existe (39 bolsas), repete o slot em 38 delas; na outra, vem sem o prefixo do módulo.

| Classe | Bolsas | Capacidade | Redução % |
| --- | ---: | ---: | ---: |
| [Costas](#costas) | 100 | 6–40 | 50–95 |
| [Tiracolo](#tiracolo) | 13 | 12–13 | 65 |
| [Cintura](#cintura) | 35 | 1–12 | 60–85 |
| [Tronco](#tronco) | 24 | 4–15 | 80–95 |
| [Cinto e perna](#cinto-e-perna) | 44 | 4–8 | 75–85 |
| [Ombro e peito](#ombro-e-peito) | 6 | 1 | 85 |

## Por slot

Cada bolsa declara um slot do corpo. Os slots com prefixo de mod (`ALICE:`, `KATTAJ1:`) são criados pelo mod. "Onde" é a posição que o nome do slot indica.

| Slot | Classe | Onde | Bolsas |
| --- | --- | --- | ---: |
| `base:back`, `base:Back` | Costas | costas | 99 |
| `ALICE:Tail` | Costas | costas, embaixo (ícone `BagAliceButtpack`) | 1 |
| `base:satchel` | Tiracolo | a tiracolo | 13 |
| `base:fannypackfront`, `base:FannyPackFront` | Cintura | cintura, na frente | 15 |
| `base:fannypackback` | Cintura | cintura, atrás | 3 |
| `KATTAJ1:TacticalFannyPackFront` | Cintura | cintura, na frente | 1 |
| `KATTAJ1:TacticalFannyPack` | Cintura | cintura, atrás | 1 |
| `KATTAJ1:BackFanny` | Cintura | cintura, atrás | 15 |
| `base:webbing` | Tronco | tronco | 21 |
| `KATTAJ1:ChestRig` | Tronco | peito | 3 |
| `KATTAJ1:BeltLeft` | Cinto e perna | cinto, à esquerda | 20 |
| `KATTAJ1:BeltRight` | Cinto e perna | cinto, à direita | 20 |
| `ALICE:GasMaskPouch` | Cinto e perna | ombro ou perna, pelo nome das bolsas | 4 |
| `base:ammostrap` | Ombro e peito | peito | 5 |
| `base:shoulderholster` | Ombro e peito | ombro | 1 |

## Por origem

| Origem | Bolsas | Costas | Tiracolo | Cintura | Tronco | Cinto e perna | Ombro e peito |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| vanilla | 86 | 56 | 13 | 6 | 5 | 0 | 6 |
| KATTAJ1 Military Pack | 103 | 40 | 0 | 27 | 0 | 36 | 0 |
| ALICE Gear | 22 | 2 | 0 | 0 | 16 | 4 | 0 |
| Cerberus Pack | 11 | 2 | 0 | 2 | 3 | 4 | 0 |

## Por categoria

A `DisplayCategory`, que é o filtro "Categoria" da aba Itens. As de `Memento` têm todas a tag `ismemento`.

| Categoria | Nome | Bolsas |
| --- | --- | ---: |
| `Bag` | Bolsa | 184 |
| (vazia) | (sem categoria) | 32 |
| `Memento` | Lembrança | 5 |
| `Accessory` | Acessório | 1 |

## Propriedades

As 36 chaves que aparecem em `props` das bolsas, da mais comum à mais rara. Na aba Itens, `k:Chave` filtra quem tem a chave e `chave=valor` quem tem um valor que contém o trecho. "Valores" mostra até 5 dos mais comuns (`+N` = outros N valores distintos).

| Propriedade | Bolsas | Valores |
| --- | ---: | --- |
| `CanBeEquipped` | 222 | `base:back` 59, `base:Back` 40, `base:webbing` 21, `KATTAJ1:BeltLeft` 20, `KATTAJ1:BeltRight` 20, +12 |
| `Capacity` | 222 | `4` 32, `8` 25, `18` 24, `12` 21, `15` 16, +17 |
| `CloseSound` | 222 | `CloseBag` 185, `CloseLeatherBag` 6, `CloseCargoVest` 5, `CloseClothGunCase` 5, `CloseHideFannyPack` 4, +10 |
| `ClothingItem` | 222 | `Bag_Satchel` 2, `AliceVest4P1C1HLoosen` 2, `AliceVest4P1C1HTight` 2, `Military_Backpack_Ranger_Large-White_Tight` 2, `AmmoStrap_Brown_Bullets` 1, +213 |
| `ItemType` | 222 | `base:container` 221, `base:container,` 1 |
| `OpenSound` | 222 | `OpenBag` 178, `OpenLeatherBag` 12, `OpenCargoVest` 5, `OpenClothGunCase` 5, `OpenHideFannyPack` 4, +11 |
| `PutInSound` | 222 | `PutItemInBag` 178, `StoreItemLeatherBag` 12, `StoreItemCargoVest` 5, `StoreItemClothGunCase` 5, `StoreItemHideFannyPack` 4, +11 |
| `WeightReduction` | 222 | `65` 46, `75` 46, `85` 36, `80` 36, `90` 33, +6 |
| `WorldStaticModel` | 222 | `DuffelBag_Ground` 22, `BagLeg_Utility_Medium_Ground` 20, `BagLeg_MagSecure_Small_Ground` 16, `Backpack_Colossus_VeryLarge_Ground` 8, `Backpack_Echo_Radio_Ground` 8, +49 |
| `Weight` | 212 | `1.0` 49, `0.5` 48, `1` 28, `2` 24, `0.2` 8, +18 |
| `DisplayCategory` | 190 | `Bag` 184, `Memento` 5, `Accessory` 1 |
| `RunSpeedModifier` | 184 | `0.98` 36, `0.96` 34, `0.95` 29, `0.94` 21, `0.99` 17, +4 |
| `ReplaceInPrimaryHand` | 172 | `Bag_DuffelBag_RHandTINT holdingbagright` 9, `Bag_DuffelBag_RHand holdingbagright` 6, `Bag_RifleCaseCloth_RHand holdingbagright` 4, `HipBag_Cerberus_RHand holdingbagright` 4, `Military_BagLeg_MagSecure_Small-Black_RHand holdingbagright` 4, +95 |
| `CanHaveHoles` | 169 | `false` 169 |
| `ReplaceInSecondHand` | 164 | `Bag_DuffelBag_LHandTINT holdingbagleft` 9, `Bag_DuffelBag_LHand holdingbagleft` 6, `Bag_RifleCaseCloth_LHand holdingbagleft` 4, `HipBag_Cerberus_LHand holdingbagleft` 4, `Military_BagLeg_MagSecure_Small-Black_LHand holdingbagleft` 4, +86 |
| `IconsForTexture` | 141 | `Duffelbag;DuffelBag_Green;DuffelBag_Grey;DuffelBagBlue;DuffelBagRed;Duffelbag_Sport;Duffelbag_Sport2` 6, `RifleCase_SoftGreen;RifleCase_SoftCamo` 4, `HipBag_Cerberus` 4, `Military_BagLeg_MagSecure_Small-Black;Military_BagLeg_MagSecure_Small-BlackPlain` 4, `Military_BagLeg_MagSecure_Small-Desert;Military_BagLeg_MagSecure_Small-DesertPlain` 4, +72 |
| `ClothingItemExtra` | 113 | `AliceVest4P1C1HTight` 2, `AliceVest4P1C1HLoosen` 2, `Base.Bag_FannyPackFront` 1, `Base.Bag_FannyPackFront_Hide` 1, `Base.Bag_FannyPackFront_Tarp` 1, +106 |
| `ClothingItemExtraOption` | 113 | `Tight` 30, `PutOn` 20, `AttachPouchToHipLeft;AttachPouchToHipRight;AttachPouchToHipRightOnArmor` 9, `AttachPouchToHipLeft;AttachPouchToHipRight;AttachPouchToHipLeftOnArmor` 9, `AttachPouchToHipRight;AttachPouchToHipLeftOnArmor;AttachPouchToHipRightOnArmor` 9, +15 |
| `DisplayName` | 103 | `Military MagSecure Hip Pouch (Black)` 4, `Military MagSecure Hip Pouch (Desert)` 4, `Military MagSecure Hip Pouch (Green)` 4, `Military MagSecure Hip Pouch (White)` 4, `Military Utility Hip Pouch (Black)` 4, +51 |
| `ClothingExtraSubmenu` | 93 | `PutOn` 23, `Tight` 21, `AttachPouchToHipLeftOnArmor` 9, `AttachPouchToHipRightOnArmor` 9, `AttachPouchToHipLeft` 9, +8 |
| `Icon` | 93 | `AliceWeebing` 16, `Duffelbag` 7, `AliceGasMaskPouch` 4, `Military_BagLeg_Utility_Medium-Medic` 4, `DuffelBagWhite` 2, +58 |
| `Tags` | 84 | `base:isfirefuel;base:isfiretinder` 21, `base:ignorezombiedensity;base:isfirefuel;base:isfiretinder` 15, `base:ignorezombiedensity` 8, `base:ignorezombiedensity;base:isfirefuel;base:isfiretinder;base:ismemento` 5, `base:bagsfillexception;base:isfiretinder;base:isfirefuel;base:firearmloot` 5, +17 |
| `BloodLocation` | 82 | `Bag` 82 |
| `AttachmentReplacement` | 68 | `Bag` 68 |
| `EquipSound` | 63 | `EquipSatchel` 12, `EquipBackpackLarge` 11, `EquipDuffleBag` 10, `EquipLeatherBag` 9, `EquipFannyPack` 6, +4 |
| `BodyLocation` | 39 | `base:webbing` 21, `base:ammostrap` 5, `ALICE:GasMaskPouch` 4, `base:fannypackback` 3, `base:fannypackfront` 3, +3 |
| `Researchablerecipes` | 36 | `SewCrudeLeatherBackpack` 14, `Forge_Buckle` 4, `SewCrudeLeatherBackpack;SewHideWallet;SewHideFannyBag` 4, `SewCrudeLeatherBackpack;AssembleSmallFramepack;AssembleLargeFramepack;AssembleAdvancedFramepack` 2, `SewCrudeLeatherBackpack;AssembleSmallFramepack;AssembleLargeFramepack;AssembleAdvancedFramepack;AssembleAdvancedLargeFramepack` 2, +7 |
| `AttachmentsProvided` | 32 | `BedrollBottom` 6, `BedrollBottomALICE` 4, `RightGrenadeSlot;LeftGrenadeSlot;RightCanteenSlot` 4, `AliceRightHandgunSlot;LeftGrenadeSlot;LeftCanteenSlot` 4, `RightGrenadeSlot;LeftGrenadeSlot;RightCanteenSlot;LeftCanteenSlot` 4, +4 |
| `SoundParameter` | 25 | `EquippedBaggageContainer SchoolBag` 11, `EquippedBaggageContainer HikingBag` 8, `EquippedBaggageContainer DuffleBag` 6 |
| `clothingExtraSubmenu` | 20 | `Loosen` 8, `Tight` 8, `OverShoulder` 1, `OverShoulderLoosen` 1, `OnLeg` 1, +1 |
| `Tooltip` | 11 | `Tooltip_Webbing` 5, `Tooltip_AmmoStrap` 3, `Tooltip_AmmoStrap_Shotgun` 2, `Tooltip_item_HolsterShoulder` 1 |
| `ReplaceInSecondaryHand` | 8 | `Military_BagBack_StormPack_Large-Black_LHand holdingbagleft` 1, `Military_BagBack_StormPack_Large-Desert_LHand holdingbagleft` 1, `Military_BagBack_StormPack_Large-Green_LHand holdingbagleft` 1, `Military_BagBack_StormPack_Medium-Black_LHand holdingbagleft` 1, `Military_BagBack_StormPack_Medium-Desert_LHand holdingbagleft` 1, +3 |
| `AcceptItemFunction` | 6 | `AcceptItemFunction.AmmoStrap_Bullets` 3, `AcceptItemFunction.AmmoStrap_Shells` 2, `AcceptItemFunction.HolsterShoulder` 1 |
| `CombatSpeedModifier` | 5 | `0.98` 3, `0.99` 2 |
| `MaxItemSize` | 5 | `1.3` 5 |
| `DiscomfortModifier` | 1 | `0.05` 1 |

## Catálogo

Todas as bolsas por classe, da maior capacidade para a menor e depois em ordem alfabética. "Nome" é o nome em PT-BR; em itálico quando só há o inglês e em `código` quando não há nenhum. "(oculta)" marca as que a aba Itens esconde por padrão (categoria interna ou `OBSOLETE`). As colunas mostram as propriedades cruas: capacidade é `Capacity`, redução é `WeightReduction`, peso é `Weight`, velocidade é `RunSpeedModifier` (— quando a propriedade falta) e slot é `CanBeEquipped`. "Extras" junta `AttachmentsProvided` (lugares para pendurar itens), `AcceptItemFunction` (restringe o que entra) e `MaxItemSize`.

### Costas

| Nome | ID | Origem | Slot | Capacidade | Redução % | Peso | Velocidade | Extras |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| _ALICE Medium Field Pack_ | `ALICE.AliceBackpack` | ALICE Gear | `base:back` | 40 | 90 | 1.1 | 1 | — |
| _Military Backpack Colossus (Black)_ | `Base.Military_Backpack_Colossus_VeryLarge-Black` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (Black)_ | `Base.Military_Backpack_Colossus_VeryLarge-Black_Tight` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (Desert)_ | `Base.Military_Backpack_Colossus_VeryLarge-Desert` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (Desert)_ | `Base.Military_Backpack_Colossus_VeryLarge-Desert_Tight` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (Green)_ | `Base.Military_Backpack_Colossus_VeryLarge-Green` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (Green)_ | `Base.Military_Backpack_Colossus_VeryLarge-Green_Tight` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (White)_ | `Base.Military_Backpack_Colossus_VeryLarge-White` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| _Military Backpack Colossus (White)_ | `Base.Military_Backpack_Colossus_VeryLarge-White_Tight` | KATTAJ1 Military Pack | `base:Back` | 40 | 85 | 3 | 0.9 | — |
| Mochila Grande com Armação | `Base.Bag_CraftedFramepack_Large3` | vanilla | `base:back` | 35 | 75 | 4 | 0.96 | pendura: `BedrollBottom` |
| _Military Backpack Ranger (Black)_ | `Base.Military_Backpack_Ranger_Large-Black` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (Black)_ | `Base.Military_Backpack_Ranger_Large-Black_Tight` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (Desert)_ | `Base.Military_Backpack_Ranger_Large-Desert` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (Desert)_ | `Base.Military_Backpack_Ranger_Large-Desert_Tight` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (Green)_ | `Base.Military_Backpack_Ranger_Large-Green` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (Green)_ | `Base.Military_Backpack_Ranger_Large-Green_Tight` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (White)_ | `Base.Military_Backpack_Ranger_Large-White` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| _Military Backpack Ranger (White)_ | `Base.Military_Backpack_Ranger_Large-White_Tight` | KATTAJ1 Military Pack | `base:Back` | 30 | 90 | 2 | 0.94 | — |
| Mochila Militar | `Base.Bag_ALICEpack` | vanilla | `base:back` | 28 | 85 | 2 | 0.94 | pendura: `BedrollBottomALICE` |
| Mochila Militar | `Base.Bag_ALICEpack_Army` | vanilla | `base:back` | 28 | 85 | 2 | 0.94 | pendura: `BedrollBottomALICE` |
| Mochila Militar | `Base.Bag_ALICEpack_DesertCamo` | vanilla | `base:back` | 28 | 85 | 2 | 0.94 | pendura: `BedrollBottomALICE` |
| Mochila Militar | `Base.Bag_SurvivorBag` | vanilla | `base:back` | 28 | 85 | 2 | 0.94 | pendura: `BedrollBottomALICE` |
| _Military Backpack Echo (Black)_ | `Base.Military_Backpack_Echo_Radio-Black` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (Black)_ | `Base.Military_Backpack_Echo_Radio-Black_Tight` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (Desert)_ | `Base.Military_Backpack_Echo_Radio-Desert` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (Desert)_ | `Base.Military_Backpack_Echo_Radio-Desert_Tight` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (Green)_ | `Base.Military_Backpack_Echo_Radio-Green` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (Green)_ | `Base.Military_Backpack_Echo_Radio-Green_Tight` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (White)_ | `Base.Military_Backpack_Echo_Radio-White` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| _Military Backpack Echo (White)_ | `Base.Military_Backpack_Echo_Radio-White_Tight` | KATTAJ1 Military Pack | `base:Back` | 25 | 90 | 2 | 0.96 | — |
| Mochila com Armação | `Base.Bag_CraftedFramepack_Large2` | vanilla | `base:back` | 25 | 80 | 3 | 0.96 | pendura: `BedrollBottom` |
| _Military Backpack Strategist (Black)_ | `Base.Military_Backpack_Strategist_Medium-Black` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (Black)_ | `Base.Military_Backpack_Strategist_Medium-Black_Tight` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (Desert)_ | `Base.Military_Backpack_Strategist_Medium-Desert` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (Desert)_ | `Base.Military_Backpack_Strategist_Medium-Desert_Tight` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (Green)_ | `Base.Military_Backpack_Strategist_Medium-Green` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (Green)_ | `Base.Military_Backpack_Strategist_Medium-Green_Tight` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (White)_ | `Base.Military_Backpack_Strategist_Medium-White` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| _Military Backpack Strategist (White)_ | `Base.Military_Backpack_Strategist_Medium-White_Tight` | KATTAJ1 Military Pack | `base:Back` | 22 | 90 | 2 | 0.96 | — |
| Mochila Grande de Trilha | `Base.Bag_BigHikingBag` | vanilla | `base:back` | 22 | 80 | 1.5 | 0.95 | pendura: `BedrollBottomBig` |
| Mochila Grande de Trilha | `Base.Bag_BigHikingBag_Travel` | vanilla | `base:back` | 22 | 80 | 1.5 | 0.95 | pendura: `BedrollBottomBig` |
| Mochila de Trilha | `Base.Bag_HikingBag_Travel` | vanilla | `base:back` | 20 | 75 | 1.2 | 0.96 | pendura: `BedrollBottom` |
| Mochila de Trilha | `Base.Bag_NormalHikingBag` | vanilla | `base:back` | 20 | 75 | 1.2 | 0.96 | pendura: `BedrollBottom` |
| Mochila Simples com Armação | `Base.Bag_CraftedFramepack_Large` | vanilla | `base:back` | 20 | 75 | 2 | 0.96 | pendura: `BedrollBottom` |
| Mochila Simples com Armação | `Base.Bag_TarpFramepack_Large` | vanilla | `base:back` | 20 | 70 | 2 | 0.97 | pendura: `BedrollBottom` |
| Bolsa de Golfe | `Base.Bag_GolfBag` | vanilla | `base:back` | 18 | 65 | 1.2 | 0.95 | — |
| Bolsa de Golfe | `Base.Bag_GolfBag_Melee` | vanilla | `base:back` | 18 | 65 | 1.2 | 0.95 | — |
| Bolsa de Trauma | `Base.Bag_MedicalBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_BaseballBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_BreakdownBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_BurglarBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_DuffelBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_DuffelBagTINT` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_FoodCanned` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_FoodSnacks` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_InmateEscapedBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_Military` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_MoneyBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_ShotgunBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_ShotgunDblBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_ShotgunDblSawnoffBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_ShotgunSawnoffBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_TennisBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_ToolBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_WeaponBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem | `Base.Bag_WorkerBag` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem da SWAT | `Base.Bag_SWAT` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem do Xerife | `Base.Bag_Sheriff` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| Bolsa de Viagem Policial | `Base.Bag_Police` | vanilla | `base:back` | 18 | 65 | 1 | 0.95 | — |
| _Cerberus Backpack_ | `Base.Backpack_Cerberus` | Cerberus Pack | `base:back` | 17 | 90 | 1 | 0.98 | — |
| _Cerberus Backpack_ | `Base.Backpack_Cerberus_Tight` | Cerberus Pack | `base:back` | 17 | 90 | 1 | 0.98 | — |
| _Field Pack. Training_ | `ALICE.AliceFieldpack` | ALICE Gear | `ALICE:Tail` | 17 | 95 | 0.6 | 1 | — |
| _Military Backpack Pocket (Black)_ | `Base.Military_Backpack_Pocket_Small-Black` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (Black)_ | `Base.Military_Backpack_Pocket_Small-Black_Tight` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (Desert)_ | `Base.Military_Backpack_Pocket_Small-Desert` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (Desert)_ | `Base.Military_Backpack_Pocket_Small-Desert_Tight` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (Green)_ | `Base.Military_Backpack_Pocket_Small-Green` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (Green)_ | `Base.Military_Backpack_Pocket_Small-Green_Tight` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (White)_ | `Base.Military_Backpack_Pocket_Small-White` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| _Military Backpack Pocket (White)_ | `Base.Military_Backpack_Pocket_Small-White_Tight` | KATTAJ1 Military Pack | `base:Back` | 15 | 94 | 1 | 0.98 | — |
| Mochila Pequena | `Base.Bag_Schoolbag` | vanilla | `base:back` | 15 | 70 | 1 | 0.97 | — |
| Mochila Pequena | `Base.Bag_Schoolbag_Kids` | vanilla | `base:back` | 15 | 70 | 1 | 0.97 | — |
| Mochila Pequena | `Base.Bag_Schoolbag_Patches` | vanilla | `base:back` | 15 | 70 | 1 | 0.97 | — |
| Mochila Pequena | `Base.Bag_Schoolbag_Travel` | vanilla | `base:back` | 15 | 70 | 1 | 0.97 | — |
| Mochila Pequena e Simples com Armação | `Base.Bag_CraftedFramepack_Small` | vanilla | `base:back` | 15 | 70 | 1.5 | 0.97 | — |
| Mochila Pequena e Simples com Armação | `Base.Bag_TarpFramepack_Small` | vanilla | `base:back` | 15 | 65 | 1.5 | 0.98 | — |
| Bolsa de Pele a Tiracolo | `Base.Bag_HideSlingBag` | vanilla | `base:back` | 14 | 60 | 0.8 | 0.95 | — |
| Mochila Pequena de Couro | `Base.Bag_CrudeLeatherBag` | vanilla | `base:back` | 14 | 65 | 1 | 0.96 | — |
| Mochila Pequena de Lona | `Base.Bag_CrudeTarpBag` | vanilla | `base:back` | 14 | 60 | 1 | 0.97 | — |
| Bolsa de Lona a Tiracolo | `Base.Bag_TarpSlingBag` | vanilla | `base:back` | 12 | 55 | 0.8 | 0.95 | — |
| Mochila de Hidratação | `Base.Bag_HydrationBackpack` | vanilla | `base:back` | 12 | 85 | 1 | 0.97 | — |
| Mochila de Hidratação | `Base.Bag_HydrationBackpack_Camo` | vanilla | `base:back` | 12 | 85 | 1 | 0.97 | — |
| Mochila Pequena | `Base.Bag_Schoolbag_Medical` | vanilla | `base:back` | 12 | 70 | 1 | 0.97 | — |
| Bolsa de Lençol a Tiracolo | `Base.Bag_SheetSlingBag` | vanilla | `base:back` | 10 | 50 | 0.8 | 0.95 | — |
| Estojo de Tecido para Arma | `Base.Bag_RifleCaseCloth` | vanilla | `base:back` | 7 | 65 | 1 | 0.97 | — |
| Estojo de Tecido para Arma | `Base.Bag_RifleCaseCloth2` | vanilla | `base:back` | 7 | 65 | 1 | 0.97 | — |
| Estojo de Tecido para Arma | `Base.Bag_RifleCaseClothCamo` | vanilla | `base:back` | 7 | 65 | 1 | 0.97 | — |
| Estojo de Tecido para Arma | `Base.Bag_ShotgunCaseCloth` | vanilla | `base:back` | 7 | 65 | 1 | 0.97 | — |
| Estojo de Tecido para Arma | `Base.Bag_ShotgunCaseCloth2` | vanilla | `base:back` | 7 | 65 | 1 | 0.97 | — |
| Cesta de Pesca | `Base.Bag_FishingBasket` | vanilla | `base:back` | 6 | 50 | 1.5 | 0.99 | — |

### Tiracolo

| Nome | ID | Origem | Slot | Capacidade | Redução % | Peso | Velocidade | Extras |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| Bolsa de Couro a Tiracolo | `Base.Bag_Satchel_Leather` | vanilla | `base:satchel` | 13 | 65 | 1 | 0.99 | — |
| Bolsa a Tiracolo | `Base.Bag_Satchel` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa a Tiracolo | `Base.Bag_SatchelPhoto` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Artesanal de Algodão | `Base.Bag_ClothSatchel_Cotton` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Artesanal de Jeans | `Base.Bag_ClothSatchel_Denim` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Artesanal de Jeans | `Base.Bag_ClothSatchel_DenimBlack` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Artesanal de Jeans | `Base.Bag_ClothSatchel_DenimLight` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Artesanal de Juta | `Base.Bag_ClothSatchel_Burlap` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa de Correio a Tiracolo | `Base.Bag_Satchel_Mail` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa de Pele Artesanal | `Base.Bag_HideSatchel` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa de Pesca a Tiracolo | `Base.Bag_Satchel_Fishing` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Médica a Tiracolo | `Base.Bag_Satchel_Medical` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |
| Bolsa Militar a Tiracolo | `Base.Bag_Satchel_Military` | vanilla | `base:satchel` | 12 | 65 | 1 | 0.99 | — |

### Cintura

| Nome | ID | Origem | Slot | Capacidade | Redução % | Peso | Velocidade | Extras |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| _Military Storm Pack Large (Black)_ | `Base.Military_BagBack_StormPack_Large-Black` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 12 | 80 | 1 | 0.94 | — |
| _Military Storm Pack Large (Desert)_ | `Base.Military_BagBack_StormPack_Large-Desert` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 12 | 80 | 1 | 0.94 | — |
| _Military Storm Pack Large (Green)_ | `Base.Military_BagBack_StormPack_Large-Green` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 12 | 80 | 1 | 0.94 | — |
| _Military Storm Pack Large (Medic)_ | `Base.Military_BagBack_StormPack_Large-Medic` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 12 | 80 | 1 | 0.94 | — |
| _Military Storm Pack Large (White)_ | `Base.Military_BagBack_StormPack_Large-White` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 12 | 80 | 1 | 0.94 | — |
| _Military Storm Pack Medium (Black)_ | `Base.Military_BagBack_StormPack_Medium-Black` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 8 | 80 | 1 | 0.96 | — |
| _Military Storm Pack Medium (Desert)_ | `Base.Military_BagBack_StormPack_Medium-Desert` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 8 | 80 | 1 | 0.96 | — |
| _Military Storm Pack Medium (Green)_ | `Base.Military_BagBack_StormPack_Medium-Green` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 8 | 80 | 1 | 0.96 | — |
| _Military Storm Pack Medium (Medic)_ | `Base.Military_BagBack_StormPack_Medium-Medic` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 8 | 80 | 1 | 0.96 | — |
| _Military Storm Pack Medium (White)_ | `Base.Military_BagBack_StormPack_Medium-White` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 8 | 80 | 1 | 0.96 | — |
| _Military Chest Pouches Large (Black)_ | `Base.Military_BagFront_ChestPouches_Large-Black` | KATTAJ1 Military Pack | `base:FannyPackFront` | 6 | 80 | 1 | 0.94 | — |
| _Military Chest Pouches Large (Desert)_ | `Base.Military_BagFront_ChestPouches_Large-Desert` | KATTAJ1 Military Pack | `base:FannyPackFront` | 6 | 80 | 1 | 0.94 | — |
| _Military Chest Pouches Large (Green)_ | `Base.Military_BagFront_ChestPouches_Large-Green` | KATTAJ1 Military Pack | `base:FannyPackFront` | 6 | 80 | 1 | 0.94 | — |
| _Military Chest Pouches Large (White)_ | `Base.Military_BagFront_ChestPouches_Large-White` | KATTAJ1 Military Pack | `base:FannyPackFront` | 6 | 80 | 1 | 0.94 | — |
| _Military Chest Pouches Medium (Black)_ | `Base.Military_BagFront_ChestPouches_Medium-Black` | KATTAJ1 Military Pack | `base:FannyPackFront` | 4 | 80 | 1 | 0.96 | — |
| _Military Chest Pouches Medium (Desert)_ | `Base.Military_BagFront_ChestPouches_Medium-Desert` | KATTAJ1 Military Pack | `base:FannyPackFront` | 4 | 80 | 1 | 0.96 | — |
| _Military Chest Pouches Medium (Green)_ | `Base.Military_BagFront_ChestPouches_Medium-Green` | KATTAJ1 Military Pack | `base:FannyPackFront` | 4 | 80 | 1 | 0.96 | — |
| _Military Chest Pouches Medium (White)_ | `Base.Military_BagFront_ChestPouches_Medium-White` | KATTAJ1 Military Pack | `base:FannyPackFront` | 4 | 80 | 1 | 0.96 | — |
| _Military Storm Pack Small (Black)_ | `Base.Military_BagBack_StormPack_Small-Black` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 4 | 80 | 0.5 | 0.98 | — |
| _Military Storm Pack Small (Desert)_ | `Base.Military_BagBack_StormPack_Small-Desert` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 4 | 80 | 0.5 | 0.98 | — |
| _Military Storm Pack Small (Green)_ | `Base.Military_BagBack_StormPack_Small-Green` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 4 | 80 | 0.5 | 0.98 | — |
| _Military Storm Pack Small (Medic)_ | `Base.Military_BagBack_StormPack_Small-Medic` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 4 | 80 | 0.5 | 0.98 | — |
| _Military Storm Pack Small (White)_ | `Base.Military_BagBack_StormPack_Small-White` | KATTAJ1 Military Pack | `KATTAJ1:BackFanny` | 4 | 80 | 0.5 | 0.98 | — |
| _Cerberus Tactical Fanny Pack (Back)_ | `Base.FannyPack_Cerberus` | Cerberus Pack | `KATTAJ1:TacticalFannyPack` | 2 | 75 | 0.2 | — | — |
| _Cerberus Tactical Fanny Pack (Front)_ | `Base.FannyPack_Cerberus_Front` | Cerberus Pack | `KATTAJ1:TacticalFannyPackFront` | 2 | 75 | 0.2 | — | — |
| _Military Chest Pouches Small (Black)_ | `Base.Military_BagFront_ChestPouches_Small-Black` | KATTAJ1 Military Pack | `base:FannyPackFront` | 2 | 80 | 0.5 | 0.98 | — |
| _Military Chest Pouches Small (Desert)_ | `Base.Military_BagFront_ChestPouches_Small-Desert` | KATTAJ1 Military Pack | `base:FannyPackFront` | 2 | 80 | 0.5 | 0.98 | — |
| _Military Chest Pouches Small (Green)_ | `Base.Military_BagFront_ChestPouches_Small-Green` | KATTAJ1 Military Pack | `base:FannyPackFront` | 2 | 80 | 0.5 | 0.98 | — |
| _Military Chest Pouches Small (White)_ | `Base.Military_BagFront_ChestPouches_Small-White` | KATTAJ1 Military Pack | `base:FannyPackFront` | 2 | 80 | 0.5 | 0.98 | — |
| Pochete | `Base.Bag_FannyPackBack` | vanilla | `base:fannypackback` | 1 | 85 | 0.2 | 0.98 | — |
| Pochete | `Base.Bag_FannyPackFront` | vanilla | `base:fannypackfront` | 1 | 85 | 0.2 | 0.98 | — |
| Pochete de Lona | `Base.Bag_FannyPackFront_Tarp` | vanilla | `base:fannypackfront` | 1 | 60 | 0.2 | 0.97 | — |
| Pochete de Lona - Costas | `Base.Bag_FannyPackBack_Tarp` | vanilla | `base:fannypackback` | 1 | 60 | 0.2 | 0.97 | — |
| Pochete de Pele | `Base.Bag_FannyPackBack_Hide` | vanilla | `base:fannypackback` | 1 | 65 | 0.2 | 0.98 | — |
| Pochete de Pele | `Base.Bag_FannyPackFront_Hide` | vanilla | `base:fannypackfront` | 1 | 65 | 0.2 | 0.98 | — |

### Tronco

| Nome | ID | Origem | Slot | Capacidade | Redução % | Peso | Velocidade | Extras |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| _ALICE Webbing (4P1C1E)_ | `ALICE.AliceVest4P1C1ELoosen` | ALICE Gear | `base:webbing` | 15 | 85 | 2.67 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot` |
| _ALICE Webbing (4P1C1E)_ | `ALICE.AliceVest4P1C1ETight` | ALICE Gear | `base:webbing` | 15 | 85 | 2.67 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot` |
| _ALICE Webbing (2P2C)_ | `ALICE.AliceVest2P2CTight` | ALICE Gear | `base:webbing` | 13 | 90 | 1.73 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (4P)_ | `ALICE.AliceVest4PLoosen` | ALICE Gear | `base:webbing` | 13 | 90 | 2.3 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot` |
| _ALICE Webbing (4P)_ | `ALICE.AliceVest4PTight` | ALICE Gear | `base:webbing` | 13 | 90 | 2.3 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot` |
| _ALICE Webbing (4P1C1H)_ | `ALICE.AliceVest4P1C1HLoosen` | ALICE Gear | `base:webbing` | 13 | 85 | 2.99 | 1 | pendura: `AliceRightHandgunSlot`, `LeftGrenadeSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (4P1C1H)_ | `ALICE.AliceVest4P1C1HTight` | ALICE Gear | `base:webbing` | 13 | 85 | 2.99 | 1 | pendura: `AliceRightHandgunSlot`, `LeftGrenadeSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (4P2C)_ | `ALICE.AliceVest4P2CLoosen` | ALICE Gear | `base:webbing` | 13 | 85 | 2.56 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (4P2C)_ | `ALICE.AliceVest4P2CTight` | ALICE Gear | `base:webbing` | 13 | 85 | 2.56 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (2P1C1E)_ | `ALICE.AliceVest2P1C1ELoosen` | ALICE Gear | `base:webbing` | 9 | 85 | 1.87 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot` |
| _ALICE Webbing (2P1C1E)_ | `ALICE.AliceVest2P1C1ETight` | ALICE Gear | `base:webbing` | 9 | 85 | 1.87 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot` |
| _ALICE Webbing (2P)_ | `ALICE.AliceVest2PLoosen` | ALICE Gear | `base:webbing` | 7 | 95 | 1.5 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot` |
| _ALICE Webbing (2P)_ | `ALICE.AliceVest2PTight` | ALICE Gear | `base:webbing` | 7 | 95 | 1.5 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot` |
| _ALICE Webbing (2P1C1H)_ | `ALICE.AliceVest2P1C1HLoosen` | ALICE Gear | `base:webbing` | 7 | 90 | 2.19 | 1 | pendura: `AliceRightHandgunSlot`, `LeftGrenadeSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (2P1C1H)_ | `ALICE.AliceVest2P1C1HTight` | ALICE Gear | `base:webbing` | 7 | 90 | 2.19 | 1 | pendura: `AliceRightHandgunSlot`, `LeftGrenadeSlot`, `LeftCanteenSlot` |
| _ALICE Webbing (2P2C)_ | `ALICE.AliceVest2P2CLoosen` | ALICE Gear | `base:webbing` | 7 | 90 | 1.73 | 1 | pendura: `RightGrenadeSlot`, `LeftGrenadeSlot`, `RightCanteenSlot`, `LeftCanteenSlot` |
| Cinto e Suspensórios ALICE | `Base.Bag_ALICE_BeltSus` | vanilla | `base:webbing` | 6 | 80 | — | 0.96 | pendura: `SmallBeltLeft`, `SmallBeltRight`, `WebbingRight`, `WebbingLeft`; item até 1.3 |
| Cinto e Suspensórios ALICE | `Base.Bag_ALICE_BeltSus_Camo` | vanilla | `base:webbing` | 6 | 80 | — | 0.96 | pendura: `SmallBeltLeft`, `SmallBeltRight`, `WebbingRight`, `WebbingLeft`; item até 1.3 |
| Cinto e Suspensórios ALICE | `Base.Bag_ALICE_BeltSus_Green` | vanilla | `base:webbing` | 6 | 80 | — | 0.96 | pendura: `SmallBeltLeft`, `SmallBeltRight`, `WebbingRight`, `WebbingLeft`; item até 1.3 |
| Colete de Carga | `Base.Bag_ChestRig` | vanilla | `base:webbing` | 5 | 85 | — | 0.99 | item até 1.3 |
| Colete de Carga de Lona | `Base.Bag_ChestRig_Tarp` | vanilla | `base:webbing` | 5 | 85 | — | 0.99 | item até 1.3 |
| _Cerberus Chest Rig_ | `Base.ChestRigs_Cerberus` | Cerberus Pack | `KATTAJ1:ChestRig` | 4 | 80 | 0.5 | 0.98 | — |
| _Cerberus Chest Rig_ | `Base.ChestRigs_Cerberus_NoBelts` | Cerberus Pack | `KATTAJ1:ChestRig` | 4 | 80 | 0.5 | 0.98 | — |
| _Cerberus Chest Rig_ | `Base.ChestRigs_Cerberus_Tight` | Cerberus Pack | `KATTAJ1:ChestRig` | 4 | 80 | 0.5 | 0.98 | — |

### Cinto e perna

| Nome | ID | Origem | Slot | Capacidade | Redução % | Peso | Velocidade | Extras |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| _Military Utility Hip Pouch (Black)_ | `Base.Military_BagLeg_Utility_Medium-Black_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Black)_ | `Base.Military_BagLeg_Utility_Medium-Black_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Black)_ | `Base.Military_BagLeg_Utility_Medium-Black_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Black)_ | `Base.Military_BagLeg_Utility_Medium-Black_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Desert)_ | `Base.Military_BagLeg_Utility_Medium-Desert_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Desert)_ | `Base.Military_BagLeg_Utility_Medium-Desert_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Desert)_ | `Base.Military_BagLeg_Utility_Medium-Desert_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Desert)_ | `Base.Military_BagLeg_Utility_Medium-Desert_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Green)_ | `Base.Military_BagLeg_Utility_Medium-Green_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Green)_ | `Base.Military_BagLeg_Utility_Medium-Green_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Green)_ | `Base.Military_BagLeg_Utility_Medium-Green_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Green)_ | `Base.Military_BagLeg_Utility_Medium-Green_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Medic)_ | `Base.Military_BagLeg_Utility_Medium-Medic_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Medic)_ | `Base.Military_BagLeg_Utility_Medium-Medic_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Medic)_ | `Base.Military_BagLeg_Utility_Medium-Medic_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (Medic)_ | `Base.Military_BagLeg_Utility_Medium-Medic_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (White)_ | `Base.Military_BagLeg_Utility_Medium-White_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (White)_ | `Base.Military_BagLeg_Utility_Medium-White_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (White)_ | `Base.Military_BagLeg_Utility_Medium-White_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 8 | 75 | 0.5 | — | — |
| _Military Utility Hip Pouch (White)_ | `Base.Military_BagLeg_Utility_Medium-White_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 8 | 75 | 0.5 | — | — |
| _M40 Gas Mask Carrier (Leg)_ | `ALICE.GasMaskPouchThigh` | ALICE Gear | `ALICE:GasMaskPouch` | 5 | 85 | 0.6 | 1 | — |
| _M40 Gas Mask Carrier (Leg)_ | `ALICE.GasMaskPouchThighLoosen` | ALICE Gear | `ALICE:GasMaskPouch` | 5 | 85 | 0.6 | 1 | — |
| _M40 Gas Mask Carrier (Over Shoulder)_ | `ALICE.GasMaskPouchOverShoulder` | ALICE Gear | `ALICE:GasMaskPouch` | 5 | 85 | 0.6 | 1 | — |
| _M40 Gas Mask Carrier (Over Shoulder)_ | `ALICE.GasMaskPouchOverShoulderLoosen` | ALICE Gear | `ALICE:GasMaskPouch` | 5 | 85 | 0.6 | 1 | — |
| _Cerberus Hip Bag (Left)_ | `Base.HipBag_Cerberus_ArmorLeft` | Cerberus Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.3 | 0.98 | — |
| _Cerberus Hip Bag (Left)_ | `Base.HipBag_Cerberus_Left` | Cerberus Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.3 | 0.98 | — |
| _Cerberus Hip Bag (Right)_ | `Base.HipBag_Cerberus_ArmorRight` | Cerberus Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.3 | 0.98 | — |
| _Cerberus Hip Bag (Right)_ | `Base.HipBag_Cerberus_Right` | Cerberus Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.3 | 0.98 | — |
| _Military MagSecure Hip Pouch (Black)_ | `Base.Military_BagLeg_MagSecure_Small-Black_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Black)_ | `Base.Military_BagLeg_MagSecure_Small-Black_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Black)_ | `Base.Military_BagLeg_MagSecure_Small-Black_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Black)_ | `Base.Military_BagLeg_MagSecure_Small-Black_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Desert)_ | `Base.Military_BagLeg_MagSecure_Small-Desert_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Desert)_ | `Base.Military_BagLeg_MagSecure_Small-Desert_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Desert)_ | `Base.Military_BagLeg_MagSecure_Small-Desert_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Desert)_ | `Base.Military_BagLeg_MagSecure_Small-Desert_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Green)_ | `Base.Military_BagLeg_MagSecure_Small-Green_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Green)_ | `Base.Military_BagLeg_MagSecure_Small-Green_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Green)_ | `Base.Military_BagLeg_MagSecure_Small-Green_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (Green)_ | `Base.Military_BagLeg_MagSecure_Small-Green_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (White)_ | `Base.Military_BagLeg_MagSecure_Small-White_ArmorLeft` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (White)_ | `Base.Military_BagLeg_MagSecure_Small-White_ArmorRight` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (White)_ | `Base.Military_BagLeg_MagSecure_Small-White_Left` | KATTAJ1 Military Pack | `KATTAJ1:BeltLeft` | 4 | 75 | 0.5 | — | — |
| _Military MagSecure Hip Pouch (White)_ | `Base.Military_BagLeg_MagSecure_Small-White_Right` | KATTAJ1 Military Pack | `KATTAJ1:BeltRight` | 4 | 75 | 0.5 | — | — |

### Ombro e peito

| Nome | ID | Origem | Slot | Capacidade | Redução % | Peso | Velocidade | Extras |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| Bandoleira de Balas | `Base.AmmoStrap_Brown_Bullets` | vanilla | `base:ammostrap` | 1 | 85 | — | 0.98 | aceita: `AcceptItemFunction.AmmoStrap_Bullets` |
| Bandoleira de Balas | `Base.AmmoStrap_Bullets` | vanilla | `base:ammostrap` | 1 | 85 | — | 0.98 | aceita: `AcceptItemFunction.AmmoStrap_Bullets` |
| Bandoleira de Balas | `Base.AmmoStrap_Bullets_308` | vanilla | `base:ammostrap` | 1 | 85 | — | 0.98 | aceita: `AcceptItemFunction.AmmoStrap_Bullets` |
| Bandoleira de Cartuchos | `Base.AmmoStrap_Brown_Shells` | vanilla | `base:ammostrap` | 1 | 85 | — | 0.98 | aceita: `AcceptItemFunction.AmmoStrap_Shells` |
| Bandoleira de Cartuchos | `Base.AmmoStrap_Shells` | vanilla | `base:ammostrap` | 1 | 85 | — | 0.98 | aceita: `AcceptItemFunction.AmmoStrap_Shells` |
| Coldre - Ombro | `Base.HolsterShoulder` | vanilla | `base:shoulderholster` | 1 | 85 | 0.4 | 0.99 | pendura: `HolsterShoulder`; aceita: `AcceptItemFunction.HolsterShoulder` |

## Outros contêineres

Os 225 contêineres sem `CanBeEquipped`, por `DisplayCategory`, com até 8 nomes distintos de cada. Ficam fora do catálogo.

| Categoria | Nome | Contêineres | Exemplos |
| --- | --- | ---: | --- |
| `Container` | Recipiente | 161 | Sacola; Saco; Saco de Juta; Saco de Pele; Saco de Roupa Suja; Saco de Correio; Estojo Protetor; Recipiente Protetor Volumoso... |
| `Bag` | Bolsa | 27 | Caixa de Munição; Cesta; Bolsa para Bola de Boliche; Estojo de Flauta; Cesta de Jardinagem; Caixa de Ferramentas; Cesta de Piquenique; Estojo para Arma... |
| `Memento` | Lembrança | 22 | Maleta Médica; Balde de Doces de Halloween; Chaveiro - Achigã; Chaveiro - Trevo de Quatro Folhas; Chaveiro - Águia Americana; Chaveiro - Bola 8; Chaveiro - Cachorro-quente; Chaveiro - Gatinho... |
| `Literature` | Literatura | 7 | Livro; Livro Encadernado em Couro |
| `VehicleMaintenance` | Manutenção de Veículos | 2 | _Open Mlitary Wooden Crate_; _Open Wooden Crate_ |
| `Animal` | Animal | 1 | Alforjes Companion Dogs |
| `Bear` | Urso | 1 | Pote de Biscoitos - Ursinho de Pelúcia |
| `Bug` | Inseto | 1 | Chaveiro - Inseto |
| `Bunny` | Coelhinho | 1 | Chaveiro - Pé de Coelho |
| `Duck` | Pato | 1 | Chaveiro - Pato de Borracha |
| `Fox` | Raposa | 1 | Chaveiro - Raposa Azul |
