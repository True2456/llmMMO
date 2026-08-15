/**
 * PRIMA: Age of Bronze - Account Authentication & Session Manager
 * Handles Username/Password registration, SIWE Web3 Auth, and Character Persistence.
 */

import crypto from 'crypto';
import { sanitizeUsername } from '../security/sanitize.js';

export class AccountManager {
  constructor(db) {
    this.db = db;
    this.sessions = new Map(); // sessionToken -> { accountId, expiresAt }
  }

  hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  }

  createSession(accountId) {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.sessions.set(sessionToken, { accountId, expiresAt });
    return { sessionToken, expiresAt };
  }

  validateSession(sessionToken) {
    const session = this.sessions.get(sessionToken);
    if (!session || Date.now() > session.expiresAt) {
      if (session) this.sessions.delete(sessionToken);
      return null;
    }
    return this.db.getAccountById(session.accountId);
  }

  register(username, password) {
    const cleanUsername = sanitizeUsername(username);
    if (cleanUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    if (this.db.getAccountByUsername(cleanUsername)) {
      return { success: false, error: 'Username already exists.' };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(password, salt);
    const id = `acc_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const newAccount = {
      id,
      username: cleanUsername,
      passwordHash,
      salt,
      walletAddress: null,
      character: {
        x: 60,
        y: 84,
        facing: 'S',
        hp: 10,
        maxHp: 10,
        spirit: 10,
        skills: {
          hunting: { xp: 0, lvl: 1 },
          strength: { xp: 0, lvl: 1 },
          defense: { xp: 0, lvl: 1 },
          hitpoints: { xp: 1154, lvl: 10 },
          shamanism: { xp: 0, lvl: 1 },
          knapping: { xp: 0, lvl: 1 },
          casting: { xp: 0, lvl: 1 },
          woodcutting: { xp: 0, lvl: 1 },
          foraging: { xp: 0, lvl: 1 },
          cooking: { xp: 0, lvl: 1 }
        },
        inventory: [
          { id: 'amber_beads', name: 'Amber Beads', quantity: 50, stackable: true },
          { id: 'spear_flint', name: 'Flint Spear', quantity: 1, slot: 'weapon' },
          { id: 'axe_bronze', name: 'Cast Bronze Axe', quantity: 1, slot: 'weapon' },
          { id: 'meat_cooked', name: 'Roasted Boar Meat', quantity: 5, heal: 6 }
        ],
        equipment: {
          head: null, cape: null, neck: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null
        },
        bankStorage: new Array(50).fill(null),
        amberBeads: 50
      },
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };

    this.db.saveAccount(newAccount);
    const { sessionToken } = this.createSession(newAccount.id);

    return {
      success: true,
      account: newAccount,
      sessionToken
    };
  }

  login(username, password) {
    const cleanUsername = sanitizeUsername(username);
    const account = this.db.getAccountByUsername(cleanUsername);

    if (!account) {
      return { success: false, error: 'Invalid username or password.' };
    }

    const hash = this.hashPassword(password, account.salt);
    if (hash !== account.passwordHash) {
      return { success: false, error: 'Invalid username or password.' };
    }

    account.lastLoginAt = Date.now();
    this.db.saveAccount(account);
    const { sessionToken } = this.createSession(account.id);

    return {
      success: true,
      account,
      sessionToken
    };
  }

  loginWithWallet(walletAddress) {
    const normalized = walletAddress.toLowerCase();
    let account = this.db.getAccountByWallet(normalized);

    if (!account) {
      // Create fresh wallet-linked account
      const id = `acc_w3_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const shortAddr = `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`;
      account = {
        id,
        username: `Chief_${walletAddress.substring(2, 6)}`,
        passwordHash: null,
        salt: null,
        walletAddress: normalized,
        character: {
          x: 60,
          y: 84,
          facing: 'S',
          hp: 10,
          maxHp: 10,
          spirit: 10,
          skills: {
            hunting: { xp: 0, lvl: 1 },
            strength: { xp: 0, lvl: 1 },
            defense: { xp: 0, lvl: 1 },
            hitpoints: { xp: 1154, lvl: 10 },
            shamanism: { xp: 0, lvl: 1 },
            knapping: { xp: 0, lvl: 1 },
            casting: { xp: 0, lvl: 1 },
            woodcutting: { xp: 0, lvl: 1 },
            foraging: { xp: 0, lvl: 1 },
            cooking: { xp: 0, lvl: 1 }
          },
          inventory: [
            { id: 'amber_beads', name: 'Amber Beads', quantity: 100, stackable: true },
            { id: 'spear_flint', name: 'Flint Spear', quantity: 1, slot: 'weapon' },
            { id: 'axe_bronze', name: 'Cast Bronze Axe', quantity: 1, slot: 'weapon' },
            { id: 'meat_cooked', name: 'Roasted Boar Meat', quantity: 5, heal: 6 }
          ],
          equipment: {
            head: null, cape: null, neck: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null
          },
          bankStorage: new Array(50).fill(null),
          amberBeads: 100
        },
        createdAt: Date.now(),
        lastLoginAt: Date.now()
      };
      this.db.saveAccount(account);
    } else {
      account.lastLoginAt = Date.now();
      this.db.saveAccount(account);
    }

    const { sessionToken } = this.createSession(account.id);
    return {
      success: true,
      account,
      sessionToken
    };
  }

  savePlayerState(accountId, player) {
    const account = this.db.getAccountById(accountId);
    if (!account) return false;

    account.character = {
      x: player.x,
      y: player.y,
      facing: player.facing,
      hp: player.hp,
      maxHp: player.maxHp,
      spirit: player.spirit,
      skills: player.skills,
      inventory: player.inventory,
      equipment: player.equipment,
      bankStorage: player.bankStorage || account.character.bankStorage,
      amberBeads: player.inventory.find(i => i && i.id === 'amber_beads')?.quantity || 0
    };

    this.db.saveAccount(account);
    return true;
  }
}
