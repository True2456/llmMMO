/**
 * PRIMA: Age of Bronze - Account Persistence & Database Test Suite
 */

import { Database } from '../src/server/storage/db.js';
import { AccountManager } from '../src/server/auth/accountManager.js';
import { Player } from '../src/server/engine/player.js';

console.log('🧪 Starting Account Registration & Character Persistence Tests...\n');

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

const db = new Database();
const auth = new AccountManager(db);

// Test 1: Account Registration
console.log('1. Testing Account Registration...');
const testUser = `Shaman_${Date.now()}`;
const regResult = auth.register(testUser, 'AncientSecretPass123!');
assert(regResult.success && regResult.account.username === testUser, 'Account registered successfully');
assert(regResult.sessionToken && regResult.account.passwordHash, 'Salted PBKDF2 hash & session token generated');

// Test 2: Account Login with Correct & Incorrect Passwords
console.log('\n2. Testing Account Authentication...');
const badLogin = auth.login(testUser, 'WrongPassword');
assert(!badLogin.success, 'Login correctly rejected bad password');

const goodLogin = auth.login(testUser, 'AncientSecretPass123!');
assert(goodLogin.success && goodLogin.account.id === regResult.account.id, 'Login succeeded with valid credentials');

// Test 3: Modifying Player State & Skill Progression
console.log('\n3. Testing In-Game Character State Changes...');
const player = new Player({
  accountId: regResult.account.id,
  username: testUser,
  x: 75,
  y: 90
});

player.addXp('knapping', 450);
player.addXp('casting', 600);
player.addItem('ingot_bronze', 3);
player.addItem('mammoth_tusk', 1);

assert(player.skills.knapping.lvl > 1, `Knapping level advanced to ${player.skills.knapping.lvl}`);
assert(player.hasItem('ingot_bronze', 3), 'Added 3x Bronze Ingots to player inventory');
assert(player.hasItem('mammoth_tusk', 1), 'Added Great Mammoth Tusk (NFT) to player inventory');

// Test 4: Saving Character State to Disk
console.log('\n4. Testing Character State Persistence...');
const saveOk = auth.savePlayerState(player.accountId, player);
assert(saveOk, 'Character state saved to database');

// Test 5: Server Reboot & Cold-Load Verification
console.log('\n5. Testing Cold Server Reboot & Data Reload...');
const freshDb = new Database();
const freshAuth = new AccountManager(freshDb);

const loadedAccount = freshDb.getAccountById(player.accountId);
assert(loadedAccount !== null, 'Account successfully retrieved from disk after reboot');
assert(loadedAccount.character.x === 75 && loadedAccount.character.y === 90, 'Exact position preserved (75, 90)');
assert(loadedAccount.character.skills.knapping.xp === player.skills.knapping.xp, 'Knapping XP accurately preserved');
assert(loadedAccount.character.skills.casting.xp === player.skills.casting.xp, 'Casting XP accurately preserved');

const restoredPlayer = Player.fromJSON(loadedAccount.character);
assert(restoredPlayer.hasItem('ingot_bronze', 3), 'Restored player holds all 3x Bronze Ingots');
assert(restoredPlayer.hasItem('mammoth_tusk', 1), 'Restored player holds Great Mammoth Tusk');

console.log(`\n==================================================`);
console.log(`🎉 ACCOUNT TESTS: ${passed} PASSED | ${failed} FAILED`);
console.log(`==================================================`);

if (failed > 0) process.exit(1);
