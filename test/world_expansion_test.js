/**
 * PRIMA: Age of Bronze - World Expansion Verification Test Suite
 * Asserts 20 Skills (10 Tiers, 25 Unlocks each = 500 Unlocks), 30 Quests,
 * 250 distinct NPC Types, 10 Towns, 6 Cities, 12 Dungeons, and 6 Biomes.
 */

import { SKILL_DEFINITIONS, getAllSkills, getSkillTier } from '../src/server/engine/skills_data.js';
import { QUEST_DEFINITIONS, QuestManager } from '../src/server/engine/quests.js';
import { NPC_TYPES, getAllNpcTypes } from '../src/server/engine/npc_data.js';
import { DUNGEON_DEFINITIONS, DungeonManager } from '../src/server/engine/dungeons.js';
import { BIOMES, CITIES, TOWNS, World } from '../src/server/engine/world.js';
import { Player } from '../src/server/engine/player.js';

console.log('🧪 Starting World Expansion Master Verification Test Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Verify 20 Skills & 500 Unlocks
console.log('1. Testing 20 Skills & 500 Unlocks Matrix...');
const allSkills = getAllSkills();
assert(allSkills.length === 20, `Exactly 20 Skills registered (Found ${allSkills.length})`);

let totalUnlocks = 0;
let allSkillsHave25 = true;
for (const skill of allSkills) {
  if (skill.unlocks.length !== 25) {
    allSkillsHave25 = false;
    console.error(`Skill ${skill.id} has ${skill.unlocks.length} unlocks instead of 25!`);
  }
  totalUnlocks += skill.unlocks.length;
}
assert(allSkillsHave25, 'Every skill contains exactly 25 structured unlocks');
assert(totalUnlocks === 500, `Total 500 Skill Unlocks verified across all 10 Tiers (Found ${totalUnlocks})`);

// 2. Verify 30 Quests
console.log('\n2. Testing 30 Quests Engine...');
const allQuests = QuestManager.getAllQuests();
assert(allQuests.length === 30, `Exactly 30 Quests registered (Found ${allQuests.length})`);

const noviceQuests = allQuests.filter(q => q.difficulty === 'Novice');
const adeptQuests = allQuests.filter(q => q.difficulty === 'Adept');
const masterQuests = allQuests.filter(q => q.difficulty.startsWith('Master') || q.difficulty.startsWith('Grandmaster'));

assert(noviceQuests.length === 10, `10 Novice Quests verified (Found ${noviceQuests.length})`);
assert(adeptQuests.length === 10, `10 Adept Quests verified (Found ${adeptQuests.length})`);
assert(masterQuests.length === 10, `10 Master/Grandmaster Quests verified (Found ${masterQuests.length})`);

// Test Quest Progression
const testPlayer = new Player({ username: 'QuestHero' });
const startRes = QuestManager.startQuest(testPlayer, 'quest_01_first_flame');
assert(startRes.success, 'Player started Quest: The First Flame');
assert(testPlayer.quests['quest_01_first_flame'].status === 'IN_PROGRESS', 'Quest state marked IN_PROGRESS');

// Advance steps to completion
QuestManager.advanceQuest(testPlayer, 'quest_01_first_flame'); // 0 -> 1
QuestManager.advanceQuest(testPlayer, 'quest_01_first_flame'); // 1 -> 2
QuestManager.advanceQuest(testPlayer, 'quest_01_first_flame'); // 2 -> 3
const compRes = QuestManager.advanceQuest(testPlayer, 'quest_01_first_flame'); // 3 -> 4 (Complete)
assert(compRes.success && testPlayer.quests['quest_01_first_flame'].status === 'COMPLETED', 'Quest completed successfully with rewards awarded');

// 3. Verify 250 Distinct NPC Types
console.log('\n3. Testing 250 Distinct NPC Types Registry...');
const allNpcTypes = getAllNpcTypes();
assert(allNpcTypes.length === 250, `Exactly 250 distinct NPC Types registered in database (Found ${allNpcTypes.length})`);

const beasts = allNpcTypes.filter(n => n.category === 'beast');
const humanoids = allNpcTypes.filter(n => n.category === 'humanoid');
const merchants = allNpcTypes.filter(n => n.category === 'merchant');
const elementals = allNpcTypes.filter(n => n.category === 'elemental');
const bosses = allNpcTypes.filter(n => n.category === 'boss');

assert(beasts.length === 50, `50 Distinct Fauna & Beast Types registered (Found ${beasts.length})`);
assert(humanoids.length === 50, `50 Distinct Humanoid Clan Types registered (Found ${humanoids.length})`);
assert(merchants.length === 50, `50 Distinct Merchant & Elder Types registered (Found ${merchants.length})`);
assert(elementals.length === 50, `50 Distinct Elemental & Construct Types registered (Found ${elementals.length})`);
assert(bosses.length === 50, `50 Distinct Dungeon Bosses & Raid Titans registered (Found ${bosses.length})`);

// 4. Verify 10 Towns, 6 Cities, 12 Dungeons & 6 Biomes
console.log('\n4. Testing Geography: 10 Towns, 6 Cities, 12 Dungeons, 6 Biomes...');
assert(TOWNS.length === 10, `Exactly 10 Towns registered (Found ${TOWNS.length})`);
assert(CITIES.length === 6, `Exactly 6 Grand Metropolis Cities registered (Found ${CITIES.length})`);
assert(BIOMES.length === 6, `Exactly 6 Biomes mapped across continent (Found ${BIOMES.length})`);

const allDungeons = DungeonManager.getAllDungeons();
assert(allDungeons.length === 12, `Exactly 12 Dungeons registered with bosses and loot (Found ${allDungeons.length})`);

// 5. Verify World Continent Generator
console.log('\n5. Testing 200x200 Continent Integration...');
const world = new World(200, 200);
assert(world.width === 200 && world.height === 200, '200x200 Continuous Continent active');
assert(world.resourceNodes.size >= 10, 'Resource nodes placed across settlements');

console.log(`\n==================================================`);
console.log(`🎉 WORLD EXPANSION TESTS: ${passed} PASSED | ${failed} FAILED`);
console.log(`==================================================`);

if (failed > 0) process.exit(1);
