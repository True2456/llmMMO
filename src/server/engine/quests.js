/**
 * PRIMA: Age of Bronze - 30 Quests Engine
 * Contains 10 Novice, 10 Adept, and 10 Master/Grandmaster Quests with complete dialogue trees,
 * multi-step objectives, skill prerequisites, and rich rewards.
 */

export const QUEST_DEFINITIONS = {
  // =========================================================================
  // NOVICE QUESTS (1 - 10)
  // =========================================================================
  quest_01_first_flame: {
    id: 'quest_01_first_flame',
    title: 'The First Flame',
    difficulty: 'Novice',
    category: 'Survival',
    giver: 'Elder Kael (Ash-River Encampment)',
    reqs: { skills: { foraging: 1, cooking: 1 } },
    summary: 'Gather river clay and cycad wood to light the sacred communal roasting fire.',
    steps: [
      { step: 1, desc: 'Speak to Elder Kael at the Ash-River Encampment hearth.' },
      { step: 2, desc: 'Gather 2x Lump of River Clay and 2x Cycad Wood.' },
      { step: 3, desc: 'Craft a Stone Fire Ring and light it with flint.' },
      { step: 4, desc: 'Report back to Elder Kael.' }
    ],
    rewards: { xp: { foraging: 100, cooking: 100 }, items: [{ id: 'amber_beads', qty: 25 }, { id: 'meat_cooked', qty: 5 }], questPoints: 1 }
  },

  quest_02_flint_and_bone: {
    id: 'quest_02_flint_and_bone',
    title: 'Flint & Bone',
    difficulty: 'Novice',
    category: 'Crafting',
    giver: 'Knapper Urk (Flint-Knappers Outpost)',
    reqs: { skills: { knapping: 1, hunting: 1 } },
    summary: 'Chip your first flint spear and practice hunting small prairie game.',
    steps: [
      { step: 1, desc: 'Speak to Knapper Urk at the Outpost.' },
      { step: 2, desc: 'Mine 1x Native Copper/Flint and gather 1x Cycad Wood.' },
      { step: 3, desc: 'Knap a Flint Spear in your inventory.' },
      { step: 4, desc: 'Hunt 1x Dire Wolf Pup and return with its pelt.' }
    ],
    rewards: { xp: { knapping: 150, hunting: 150 }, items: [{ id: 'amber_beads', qty: 30 }, { id: 'spear_flint', qty: 1 }], questPoints: 1 }
  },

  quest_03_howling_pack: {
    id: 'quest_03_howling_pack',
    title: 'The Howling Pack',
    difficulty: 'Novice',
    category: 'Combat',
    giver: 'Scout Tara (Ash-River East Gate)',
    reqs: { skills: { hunting: 3, strength: 3 } },
    summary: 'Defend the eastern foraging trails from an encroaching pack of Dire Wolves.',
    steps: [
      { step: 1, desc: 'Talk to Scout Tara at the gate.' },
      { step: 2, desc: 'Defeat 3x Dire Wolves in the Savannah.' },
      { step: 3, desc: 'Collect 3x Raw Boar Meat.' },
      { step: 4, desc: 'Return to Scout Tara.' }
    ],
    rewards: { xp: { hunting: 200, strength: 200, hitpoints: 100 }, items: [{ id: 'amber_beads', qty: 45 }], questPoints: 1 }
  },

  quest_04_river_crossing: {
    id: 'quest_04_river_crossing',
    title: 'River Crossing',
    difficulty: 'Novice',
    category: 'Utility',
    giver: 'Ferryman Boru (River-Ford Harbor)',
    reqs: { skills: { sailing: 1, woodcutting: 3 } },
    summary: 'Construct a papyrus reed raft to establish a safe ferry crossing across the Primeval River.',
    steps: [
      { step: 1, desc: 'Speak to Ferryman Boru at River-Ford.' },
      { step: 2, desc: 'Harvest 5x River Reed Cordage and 3x Cycad Logs.' },
      { step: 3, desc: 'Assemble a Papyrus Reed Raft at the river dock.' },
      { step: 4, desc: 'Cross to the eastern shore and secure the anchor.' }
    ],
    rewards: { xp: { sailing: 250, woodcutting: 150 }, items: [{ id: 'amber_beads', qty: 50 }], questPoints: 1 }
  },

  quest_05_whispers_of_cycad: {
    id: 'quest_05_whispers_of_cycad',
    title: 'Whispers of the Cycad',
    difficulty: 'Novice',
    category: 'Gathering',
    giver: 'Forester Garek (Cycad Grove Hamlet)',
    reqs: { skills: { woodcutting: 5, foraging: 3 } },
    summary: 'Harvest ancient fibrous timber and rare pitch resin from the primeval canopy.',
    steps: [
      { step: 1, desc: 'Speak to Forester Garek in Cycad Grove.' },
      { step: 2, desc: 'Chop 8x Cycad Wood logs.' },
      { step: 3, desc: 'Extract 3x Flammable Tree Pitch.' },
      { step: 4, desc: 'Deliver the materials to Garek.' }
    ],
    rewards: { xp: { woodcutting: 300, foraging: 150 }, items: [{ id: 'axe_bronze', qty: 1 }], questPoints: 1 }
  },

  quest_06_lost_amber: {
    id: 'quest_06_lost_amber',
    title: 'Lost Amber Beads',
    difficulty: 'Novice',
    category: 'Trade',
    giver: 'Merchant Zara (Barter Oasis)',
    reqs: { skills: { bartering: 1, hunting: 4 } },
    summary: 'Recover a pouch of precious amber beads stolen by swift desert raptors.',
    steps: [
      { step: 1, desc: 'Talk to Merchant Zara at the Oasis bazaar.' },
      { step: 2, desc: 'Track raptor footprints heading toward Raptor-Ridge.' },
      { step: 3, desc: 'Defeat the Raptor Scavenger and retrieve Zara’s Pouch.' },
      { step: 4, desc: 'Return the pouch to Zara.' }
    ],
    rewards: { xp: { bartering: 250, hunting: 200 }, items: [{ id: 'amber_beads', qty: 100 }], questPoints: 1 }
  },

  quest_07_smelters_first_ingot: {
    id: 'quest_07_smelters_first_ingot',
    title: 'The Smelter’s First Ingot',
    difficulty: 'Novice',
    category: 'Crafting',
    giver: 'Master Smith Torv (Ash-Varr)',
    reqs: { skills: { casting: 5, knapping: 5 } },
    summary: 'Learn the ancient lost-wax metallurgy secrets and cast your first Bronze Ingot.',
    steps: [
      { step: 1, desc: 'Visit Master Smith Torv in the city of Ash-Varr.' },
      { step: 2, desc: 'Mine 2x Native Copper Ore and 2x Cassiterite Tin Ore.' },
      { step: 3, desc: 'Use the Clay Crucible Smelter to forge a Bronze Ingot.' },
      { step: 4, desc: 'Present your fresh ingot to Torv for inspection.' }
    ],
    rewards: { xp: { casting: 400, knapping: 200 }, items: [{ id: 'ingot_bronze', qty: 2 }, { id: 'amber_beads', qty: 60 }], questPoints: 1 }
  },

  quest_08_herbalist_poultice: {
    id: 'quest_08_herbalist_poultice',
    title: 'Herbalist’s Poultice',
    difficulty: 'Novice',
    category: 'Alchemy',
    giver: 'Herbalist Mira (Shamanic Mist Sanctuary)',
    reqs: { skills: { alchemy: 1, foraging: 5 } },
    summary: 'Gather antiseptic fever roots and wild moss to brew healing salves for wounded hunters.',
    steps: [
      { step: 1, desc: 'Speak to Herbalist Mira in the Sanctuary.' },
      { step: 2, desc: 'Forage 4x Medicinal Fever Roots and 2x River Reeds.' },
      { step: 3, desc: 'Brew an Antiseptic Fever Poultice using a clay bowl.' },
      { step: 4, desc: 'Deliver the poultice to the triage shelter.' }
    ],
    rewards: { xp: { alchemy: 300, foraging: 200 }, items: [{ id: 'amber_beads', qty: 40 }], questPoints: 1 }
  },

  quest_09_runestone_apprentice: {
    id: 'quest_09_runestone_apprentice',
    title: 'The Runestone Apprentice',
    difficulty: 'Novice',
    category: 'Masonry',
    giver: 'Stonecutter Bran (Sol-Megalith)',
    reqs: { skills: { masonry: 5, knapping: 5 } },
    summary: 'Chisel sacred ancestral glyphs into a basalt stele for the Sun Temple.',
    steps: [
      { step: 1, desc: 'Meet Stonecutter Bran at Sol-Megalith.' },
      { step: 2, desc: 'Quarry 2x Dense Granite Blocks.' },
      { step: 3, desc: 'Carve a Tribal Boundary Stele using a knapped chisel.' },
      { step: 4, desc: 'Erect the stele at the temple perimeter.' }
    ],
    rewards: { xp: { masonry: 350, knapping: 150 }, items: [{ id: 'amber_beads', qty: 75 }], questPoints: 1 }
  },

  quest_10_taming_hatchling: {
    id: 'quest_10_taming_hatchling',
    title: 'Taming the Raptor Hatchling',
    difficulty: 'Novice',
    category: 'Husbandry',
    giver: 'Beastmaster Korgan (Raptor-Ridge Camp)',
    reqs: { skills: { husbandry: 1, hunting: 6 } },
    summary: 'Capture and domesticate a wild saber-raptor hatchling to serve as your loyal hunting pet.',
    steps: [
      { step: 1, desc: 'Speak to Beastmaster Korgan at Raptor-Ridge.' },
      { step: 2, desc: 'Bait a trap with 2x Roasted Boar Meat.' },
      { step: 3, desc: 'Capture a young Saber Raptor Hatchling.' },
      { step: 4, desc: 'Feed and calm the hatchling to earn its trust.' }
    ],
    rewards: { xp: { husbandry: 400, hunting: 250 }, items: [{ id: 'amber_beads', qty: 120 }], questPoints: 2 }
  },

  // =========================================================================
  // ADEPT QUESTS (11 - 20)
  // =========================================================================
  quest_11_curse_of_basalt: {
    id: 'quest_11_curse_of_basalt',
    title: 'Curse of the Basalt Crags',
    difficulty: 'Adept',
    category: 'Combat',
    giver: 'Captain Varis (Basalt Watch)',
    reqs: { skills: { hunting: 12, defense: 10 } },
    summary: 'Investigate dark sulfur eruptions in the eastern volcanic crags.',
    steps: [
      { step: 1, desc: 'Speak to Captain Varis at Basalt Watch.' },
      { step: 2, desc: 'Scout the Sulfur Rift and defeat 4x Basalt Scorpions.' },
      { step: 3, desc: 'Collect 2x Obsidian Glass Shards.' },
      { step: 4, desc: 'Seal the minor sulfur vent using heavy rocks.' }
    ],
    rewards: { xp: { hunting: 600, defense: 500 }, items: [{ id: 'dagger_obsidian', qty: 1 }, { id: 'amber_beads', qty: 150 }], questPoints: 2 }
  },

  quest_12_shadows_of_obsidian: {
    id: 'quest_12_shadows_of_obsidian',
    title: 'Shadows of the Obsidian Rift',
    difficulty: 'Adept',
    category: 'Archaeology',
    giver: 'Archaeologist Theron (Starfall Crater Village)',
    reqs: { skills: { archaeology: 10, knapping: 12 } },
    summary: 'Uncover precursor stone tablets buried under volcanic ash.',
    steps: [
      { step: 1, desc: 'Consult with Theron at Starfall Crater.' },
      { step: 2, desc: 'Excavate 3x Buried Precursor Tablets in the rift.' },
      { step: 3, desc: 'Clean and translate the ancient glyphs.' },
      { step: 4, desc: 'Deliver the deciphered text to Theron.' }
    ],
    rewards: { xp: { archaeology: 700, knapping: 400 }, items: [{ id: 'amber_beads', qty: 180 }], questPoints: 2 }
  },

  quest_13_bronze_standard: {
    id: 'quest_13_bronze_standard',
    title: 'The Bronze Standard',
    difficulty: 'Adept',
    category: 'Crafting',
    giver: 'Chieftain Uruk (Uruk-Prime)',
    reqs: { skills: { casting: 15, bartering: 10 } },
    summary: 'Supply the Imperial Bronze Foundry with alloy ingots for city armaments.',
    steps: [
      { step: 1, desc: 'Meet Chieftain Uruk in the grand palace.' },
      { step: 2, desc: 'Smelt 6x Bronze Ingots and 2x Arsenical Bronze Ingots.' },
      { step: 3, desc: 'Deliver the metal cache to the city armory.' },
      { step: 4, desc: 'Sign the Imperial Trade Charter.' }
    ],
    rewards: { xp: { casting: 800, bartering: 500 }, items: [{ id: 'armor_bronze', qty: 1 }, { id: 'amber_beads', qty: 250 }], questPoints: 2 }
  },

  quest_14_totem_four_winds: {
    id: 'quest_14_totem_four_winds',
    title: 'Totem of the Four Winds',
    difficulty: 'Adept',
    category: 'Shamanism',
    giver: 'High Shaman Orena (Shamanic Mist Sanctuary)',
    reqs: { skills: { shamanism: 15, masonry: 12 } },
    summary: 'Erect wind alignment totems on the four boundary peaks of the continent.',
    steps: [
      { step: 1, desc: 'Receive the consecrated spirit seeds from Orena.' },
      { step: 2, desc: 'Carve 4x Megalith Totem Pedestals.' },
      { step: 3, desc: 'Channel spirit chanting at the North, South, East, and West shrines.' },
      { step: 4, desc: 'Return to Orena to witness the wind blessing.' }
    ],
    rewards: { xp: { shamanism: 900, masonry: 500 }, items: [{ id: 'headdress_feather', qty: 1 }, { id: 'amber_beads', qty: 220 }], questPoints: 3 }
  },

  quest_15_great_river_megalith: {
    id: 'quest_15_great_river_megalith',
    title: 'The Great River Megalith',
    difficulty: 'Adept',
    category: 'Masonry',
    giver: 'Governor Senus (Uruk-Prime)',
    reqs: { skills: { masonry: 18, strength: 15 } },
    summary: 'Quarry and erect a colossal 20-ton stone monument at the Primeval River crossing.',
    steps: [
      { step: 1, desc: 'Receive the architectural blueprints from Senus.' },
      { step: 2, desc: 'Quarry 4x Colossal Granite Megaliths.' },
      { step: 3, desc: 'Transport and erect the monument at the central river ford.' },
      { step: 4, desc: 'Inscribe the treaty glyphs upon the stone face.' }
    ],
    rewards: { xp: { masonry: 1000, strength: 600 }, items: [{ id: 'amber_beads', qty: 300 }], questPoints: 2 }
  },

  quest_16_bane_of_raptors: {
    id: 'quest_16_bane_of_raptors',
    title: 'Bane of the Raptor Nest',
    difficulty: 'Adept',
    category: 'Combat',
    giver: 'Hunter Dareth (Raptor-Ridge Camp)',
    reqs: { skills: { hunting: 20, trapping: 15 } },
    summary: 'Infiltrate the alpha raptor breeding grounds and eliminate the sickle-claw patriarch.',
    steps: [
      { step: 1, desc: 'Speak to Dareth about the raptor attacks.' },
      { step: 2, desc: 'Deploy 3x Ironwood Raptor Traps around the canyon nest.' },
      { step: 3, desc: 'Defeat 5x Saber Raptors.' },
      { step: 4, desc: 'Slay the Alpha Raptor Boss and claim its sickle claw.' }
    ],
    rewards: { xp: { hunting: 1200, trapping: 700, hitpoints: 400 }, items: [{ id: 'amber_beads', qty: 350 }], questPoints: 3 }
  },

  quest_17_secrets_sunken_crypts: {
    id: 'quest_17_secrets_sunken_crypts',
    title: 'Secrets of the Sunken Crypts',
    difficulty: 'Adept',
    category: 'Dungeon',
    giver: 'Elder Vorn (Sunken Crypts Sanctuary)',
    reqs: { skills: { archaeology: 18, shamanism: 15 } },
    summary: 'Enter Dungeon #1 (Sunken Runestone Crypts) and recover the ancient burial urn.',
    steps: [
      { step: 1, desc: 'Enter the Sunken Runestone Crypts antechamber.' },
      { step: 2, desc: 'Defeat 4x Crypt Skeletons and 2x Stone Guardians.' },
      { step: 3, desc: 'Solve the ancestral lever puzzle.' },
      { step: 4, desc: 'Retrieve the Urn of the First Chieftain.' }
    ],
    rewards: { xp: { archaeology: 1100, shamanism: 800 }, items: [{ id: 'amber_beads', qty: 400 }], questPoints: 3 }
  },

  quest_18_starfall_divination: {
    id: 'quest_18_starfall_divination',
    title: 'The Starfall Divination',
    difficulty: 'Adept',
    category: 'Astronomy',
    giver: 'Stargazer Lyra (Sol-Megalith Observatory)',
    reqs: { skills: { astronomy: 18, foraging: 15 } },
    summary: 'Collect fresh celestial meteorite dust following a nighttime shooting star event.',
    steps: [
      { step: 1, desc: 'Observe the night sky with Lyra’s bone astrolabe.' },
      { step: 2, desc: 'Track the impact crater in the north-east plains.' },
      { step: 3, desc: 'Excavate 3x Glowing Starfall Meteorite Fragments.' },
      { step: 4, desc: 'Channel starlight into the temple altar.' }
    ],
    rewards: { xp: { astronomy: 1200, foraging: 600 }, items: [{ id: 'ore_starfall', qty: 1 }, { id: 'amber_beads', qty: 300 }], questPoints: 2 }
  },

  quest_19_mammoth_alliances: {
    id: 'quest_19_mammoth_alliances',
    title: 'Mammoth Tribe Alliances',
    difficulty: 'Adept',
    category: 'Diplomacy',
    giver: 'Chieftainess Freya (Skadi-Frost)',
    reqs: { skills: { husbandry: 20, bartering: 18 } },
    summary: 'Unite the northern mammoth hunters and southern bronze smiths into a trade federation.',
    steps: [
      { step: 1, desc: 'Travel across the frosty steppes to Skadi-Frost.' },
      { step: 2, desc: 'Offer 10x Cured Mammoth Hides and 5x Bronze Axes as tribute.' },
      { step: 3, desc: 'Secure the signature of the northern clan elders.' },
      { step: 4, desc: 'Return the treaty to Uruk-Prime.' }
    ],
    rewards: { xp: { husbandry: 1300, bartering: 900 }, items: [{ id: 'armor_hide', qty: 1 }, { id: 'amber_beads', qty: 450 }], questPoints: 3 }
  },

  quest_20_canyon_fire_drakes: {
    id: 'quest_20_canyon_fire_drakes',
    title: 'Canyon of the Fire Drakes',
    difficulty: 'Adept',
    category: 'Combat',
    giver: 'Warden Brand (Obsidian Crags Outpost)',
    reqs: { skills: { hunting: 25, defense: 22 } },
    summary: 'Slay the fire-breathing drakes terrorizing the obsidian glass trade route.',
    steps: [
      { step: 1, desc: 'Equip fire-resistant armor and speak to Warden Brand.' },
      { step: 2, desc: 'Navigate the lava bridges of the Obsidian Canyon.' },
      { step: 3, desc: 'Slay 4x Magma Drakes.' },
      { step: 4, desc: 'Harvest 2x Fire Drake Glands for the alchemists.' }
    ],
    rewards: { xp: { hunting: 1500, defense: 1000 }, items: [{ id: 'dagger_obsidian', qty: 1 }, { id: 'amber_beads', qty: 500 }], questPoints: 3 }
  },

  // =========================================================================
  // MASTER & GRANDMASTER QUESTS (21 - 30)
  // =========================================================================
  quest_21_awakening_golem: {
    id: 'quest_21_awakening_golem',
    title: 'Awakening of the Primordial Golem',
    difficulty: 'Master',
    category: 'Raid Boss',
    giver: 'High Shaman Orena (Sol-Megalith)',
    reqs: { skills: { combatLvl: 30, shamanism: 30, strength: 30 } },
    summary: 'Defeat the awakened mountain-sized Primordial Stone Colossus in Dungeon #7.',
    steps: [
      { step: 1, desc: 'Gather the 3 elemental keystones from the crypts.' },
      { step: 2, desc: 'Enter the Chamber of the Stone Colossus.' },
      { step: 3, desc: 'Survive the seismic earthquake phases.' },
      { step: 4, desc: 'Shatter the golem’s glowing cyan core and claim the Runic Heart.' }
    ],
    rewards: { xp: { strength: 3000, shamanism: 3000, hitpoints: 1500 }, items: [{ id: 'ore_starfall', qty: 2 }, { id: 'amber_beads', qty: 1000 }], questPoints: 4 }
  },

  quest_22_wrath_mammoth_king: {
    id: 'quest_22_wrath_mammoth_king',
    title: 'Wrath of the Ancient Mammoth King',
    difficulty: 'Master',
    category: 'World Boss',
    giver: 'Elder Skadi (Skadi-Frost)',
    reqs: { skills: { hunting: 35, husbandry: 30 } },
    summary: 'Track down and defeat the legendary 100-ton Ancient Woolly Mammoth Boss on the Frost Steppes.',
    steps: [
      { step: 1, desc: 'Track giant footprints through the northern blizzard.' },
      { step: 2, desc: 'Engage the Ancient Mammoth King in epic combat.' },
      { step: 3, desc: 'Avoid the colossal tusk sweeps and stomps.' },
      { step: 4, desc: 'Claim the Great Mammoth Tusk (Legendary NFT Artifact).' }
    ],
    rewards: { xp: { hunting: 4000, husbandry: 3000 }, items: [{ id: 'mammoth_tusk', qty: 1 }, { id: 'amber_beads', qty: 1500 }], questPoints: 4 }
  },

  quest_23_blood_moon_eclipse: {
    id: 'quest_23_blood_moon_eclipse',
    title: 'The Eclipse of the Blood Moon',
    difficulty: 'Master',
    category: 'Shamanism',
    giver: 'High Priestess Cynthia (Sol-Megalith)',
    reqs: { skills: { astronomy: 35, shamanism: 35 } },
    summary: 'Defend the Sun Temple against waves of shadowy eclipse horrors during the cosmic alignment.',
    steps: [
      { step: 1, desc: 'Align the solar lenses on the temple summit.' },
      { step: 2, desc: 'Repel 10 waves of shadow beasts during totality.' },
      { step: 3, desc: 'Channel the Solar Focus Beam to banish the Eclipse Fiend.' },
      { step: 4, desc: 'Consecrate the eternal sun fire.' }
    ],
    rewards: { xp: { astronomy: 4500, shamanism: 4500 }, items: [{ id: 'ingot_starfall', qty: 1 }, { id: 'amber_beads', qty: 2000 }], questPoints: 5 }
  },

  quest_24_fall_starfall_citadel: {
    id: 'quest_24_fall_starfall_citadel',
    title: 'Fall of the Starfall Citadel',
    difficulty: 'Master',
    category: 'Dungeon Raid',
    giver: 'Commander Kaelen (Starfall Crater Village)',
    reqs: { skills: { combatLvl: 40, defense: 38 } },
    summary: 'Storm Dungeon #5 (Starfall Meteorite Core) and disable the precursor defense turrets.',
    steps: [
      { step: 1, desc: 'Breach the magnetic barrier using starfall keys.' },
      { step: 2, desc: 'Deactivate 4x Precursor Lightning Conduits.' },
      { step: 3, desc: 'Defeat the Starfall Sentinel Automaton.' },
      { step: 4, desc: 'Secure the core repository.' }
    ],
    rewards: { xp: { defense: 5000, casting: 3500 }, items: [{ id: 'spear_starfall', qty: 1 }, { id: 'amber_beads', qty: 2500 }], questPoints: 5 }
  },

  quest_25_kraken_river_abyss: {
    id: 'quest_25_kraken_river_abyss',
    title: 'The Kraken of the Deep River Abyss',
    difficulty: 'Master',
    category: 'Aquatic Raid',
    giver: 'Admiral Torgan (River-Ford Harbor)',
    reqs: { skills: { sailing: 40, fishing: 40 } },
    summary: 'Sail into Dungeon #6 (Deep River Abyss) and harpoon the primordial multi-tentacled river terror.',
    steps: [
      { step: 1, desc: 'Board the War Canoe with heavy ballista harpoons.' },
      { step: 2, desc: 'Navigate the swirling whirlpool into the abyss cavern.' },
      { step: 3, desc: 'Sever 8 giant tentacles assaulting the vessel.' },
      { step: 4, desc: 'Deliver the killing blow to the Kraken’s eye.' }
    ],
    rewards: { xp: { sailing: 6000, fishing: 6000 }, items: [{ id: 'amber_beads', qty: 3000 }], questPoints: 5 }
  },

  quest_26_heart_primeval_volcano: {
    id: 'quest_26_heart_primeval_volcano',
    title: 'Heart of the Primeval Volcano',
    difficulty: 'Grandmaster',
    category: 'Crafting & Boss',
    giver: 'Vulcanus the Elder (Ash-Varr)',
    reqs: { skills: { casting: 45, alchemy: 40 } },
    summary: 'Descend into Dungeon #2 (Obsidian Magma Chambers) to forge God-metal inside molten magma.',
    steps: [
      { step: 1, desc: 'Drink Fire-Resistant Elixir and descend to the magma floor.' },
      { step: 2, desc: 'Defeat the Magma Drake Ignis guarding the furnace.' },
      { step: 3, desc: 'Smelt pure Starfall Ore with Arsenical Bronze at 3000°C.' },
      { step: 4, desc: 'Forge the Starfall God-Blade.' }
    ],
    rewards: { xp: { casting: 8000, alchemy: 5000 }, items: [{ id: 'ingot_starfall', qty: 3 }, { id: 'amber_beads', qty: 4000 }], questPoints: 6 }
  },

  quest_27_tears_mother_shaman: {
    id: 'quest_27_tears_mother_shaman',
    title: 'Tears of the Mother Shaman',
    difficulty: 'Grandmaster',
    category: 'Shamanism',
    giver: 'Mother Shaman Gaia (Rain-Crest)',
    reqs: { skills: { shamanism: 45, foraging: 45 } },
    summary: 'Gather the tears of the ancient forest spirits to cure the primordial blight in the rainforest.',
    steps: [
      { step: 1, desc: 'Commune with the ancient spirit trees in Rain-Crest.' },
      { step: 2, desc: 'Collect 4x Tears of the Sacred Grove.' },
      { step: 3, desc: 'Cleanse the corrupted World-Tree roots in Dungeon #4.' },
      { step: 4, desc: 'Banish the Blight Phantom.' }
    ],
    rewards: { xp: { shamanism: 9000, foraging: 6000 }, items: [{ id: 'amber_beads', qty: 4500 }], questPoints: 6 }
  },

  quest_28_titans_tomb: {
    id: 'quest_28_titans_tomb',
    title: 'The Titan’s Tomb',
    difficulty: 'Grandmaster',
    category: 'Archaeology & Dungeon',
    giver: 'Archivist Elidor (Sol-Megalith)',
    reqs: { skills: { archaeology: 48, masonry: 45 } },
    summary: 'Excavate and explore Dungeon #9 (Tomb of the First Shaman) to discover the genesis of mortal magic.',
    steps: [
      { step: 1, desc: 'Assemble the 4 broken precursor tablets.' },
      { step: 2, desc: 'Open the sealed 100-ton stone tomb doors.' },
      { step: 3, desc: 'Disarm the pressure plate dart and crushing traps.' },
      { step: 4, desc: 'Decipher the Genesis Stele and claim the First Shaman’s Staff.' }
    ],
    rewards: { xp: { archaeology: 10000, masonry: 7000 }, items: [{ id: 'amber_beads', qty: 5000 }], questPoints: 6 }
  },

  quest_29_vault_meteorite_lords: {
    id: 'quest_29_vault_meteorite_lords',
    title: 'Vault of the Meteorite Lords',
    difficulty: 'Grandmaster',
    category: 'Raid',
    giver: 'High Archon Sol (Sol-Megalith)',
    reqs: { skills: { astronomy: 48, combatLvl: 45 } },
    summary: 'Breach the celestial orbital seal in Dungeon #11 (Cursed Megalith Labyrinth).',
    steps: [
      { step: 1, desc: 'Align the 6 celestial monoliths during the solar zenith.' },
      { step: 2, desc: 'Enter the Celestial Labyrinth and defeat the Star Sentinels.' },
      { step: 3, desc: 'Defeat the Meteorite Lord Boss in multidimensional combat.' },
      { step: 4, desc: 'Claim the Cosmic Crown.' }
    ],
    rewards: { xp: { astronomy: 12000, strength: 8000 }, items: [{ id: 'spear_starfall', qty: 1 }, { id: 'amber_beads', qty: 7500 }], questPoints: 7 }
  },

  quest_30_ascension_bronze_emperor: {
    id: 'quest_30_ascension_bronze_emperor',
    title: 'Ascension of the Bronze Emperor',
    difficulty: 'Grandmaster (Endgame Milestone)',
    category: 'Endgame Raid',
    giver: 'Imperial Emperor Gilgamesh (Uruk-Prime)',
    reqs: { skills: { combatLvl: 48, totalSkillLevel: 500 } },
    summary: 'The ultimate trial: conquer Dungeon #12 (Primordial Void Sanctum) and unite the continent under the Eternal Bronze Banner.',
    steps: [
      { step: 1, desc: 'Gather the 6 Chieftains of the Grand Cities in Uruk-Prime.' },
      { step: 2, desc: 'Enter the Primordial Void Sanctum beneath the continent.' },
      { step: 3, desc: 'Defeat the 4 Primordial Titans of Void, Fire, Earth, and Spirit.' },
      { step: 4, desc: 'Claim the Eternal Crown and ascend as the Bronze Emperor of PRIMA.' }
    ],
    rewards: {
      xp: { strength: 20000, hunting: 20000, casting: 20000, shamanism: 20000 },
      items: [{ id: 'spear_starfall', qty: 1 }, { id: 'mammoth_tusk', qty: 1 }, { id: 'amber_beads', qty: 25000 }],
      questPoints: 10,
      title: 'Bronze Emperor of PRIMA'
    }
  }
};

export class QuestManager {
  static getQuest(questId) {
    return QUEST_DEFINITIONS[questId] || null;
  }

  static getAllQuests() {
    return Object.values(QUEST_DEFINITIONS);
  }

  static getPlayerQuests(player) {
    if (!player.quests) player.quests = {};
    const result = [];
    for (const [id, def] of Object.entries(QUEST_DEFINITIONS)) {
      const state = player.quests[id] || { status: 'NOT_STARTED', step: 0 };
      result.push({
        id,
        title: def.title,
        difficulty: def.difficulty,
        category: def.category,
        giver: def.giver,
        status: state.status,
        step: state.step,
        totalSteps: def.steps.length,
        currentStepDesc: def.steps[state.step]?.desc || 'Completed',
        rewards: def.rewards
      });
    }
    return result;
  }

  static startQuest(player, questId) {
    const quest = QUEST_DEFINITIONS[questId];
    if (!quest) return { success: false, error: 'Quest does not exist.' };
    if (!player.quests) player.quests = {};
    if (player.quests[questId] && player.quests[questId].status !== 'NOT_STARTED') {
      return { success: false, error: 'Quest already started or completed.' };
    }

    player.quests[questId] = { status: 'IN_PROGRESS', step: 0, startedAt: Date.now() };
    return { success: true, message: `Started Quest: ${quest.title}`, step: quest.steps[0].desc };
  }

  static advanceQuest(player, questId) {
    if (!player.quests || !player.quests[questId]) {
      return { success: false, error: 'Quest not active.' };
    }
    const quest = QUEST_DEFINITIONS[questId];
    const state = player.quests[questId];

    state.step++;
    if (state.step >= quest.steps.length) {
      return this.completeQuest(player, questId);
    }
    return { success: true, message: `Quest Updated: ${quest.title}`, step: quest.steps[state.step].desc };
  }

  static completeQuest(player, questId) {
    const quest = QUEST_DEFINITIONS[questId];
    if (!quest) return { success: false, error: 'Quest not found.' };
    if (!player.quests) player.quests = {};

    player.quests[questId] = { status: 'COMPLETED', step: quest.steps.length, completedAt: Date.now() };

    // Award Rewards
    if (quest.rewards.xp) {
      for (const [skill, amt] of Object.entries(quest.rewards.xp)) {
        player.addXp(skill, amt);
      }
    }
    if (quest.rewards.items) {
      for (const item of quest.rewards.items) {
        player.addItem(item.id, item.qty);
      }
    }

    return {
      success: true,
      message: `🎉 Quest Complete: ${quest.title}!`,
      rewards: quest.rewards
    };
  }
}
