/**
 * PRIMA: Age of Bronze - Persistent Database & Account Storage Adapter
 * Stores character states, skill XP, 28-slot inventory, equipment, bank vault,
 * and currency in JSON format with atomic transactional writes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../../data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

export class Database {
  constructor() {
    this.accounts = new Map(); // id -> account
    this.usernameIndex = new Map(); // username.toLowerCase() -> id
    this.walletIndex = new Map(); // walletAddress.toLowerCase() -> id
    this.init();
  }

  init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(ACCOUNTS_FILE)) {
      try {
        const raw = fs.readFileSync(ACCOUNTS_FILE, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          for (const acc of data) {
            this.accounts.set(acc.id, acc);
            if (acc.username) this.usernameIndex.set(acc.username.toLowerCase(), acc.id);
            if (acc.walletAddress) this.walletIndex.set(acc.walletAddress.toLowerCase(), acc.id);
          }
        }
        console.log(`[Database] Loaded ${this.accounts.size} persistent accounts from disk.`);
      } catch (err) {
        console.error('[Database] Failed to read accounts file, initializing fresh:', err);
      }
    } else {
      this.flush();
    }
  }

  flush() {
    try {
      const data = Array.from(this.accounts.values());
      const tempFile = `${ACCOUNTS_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, ACCOUNTS_FILE);
    } catch (err) {
      console.error('[Database] Failed to flush accounts to disk:', err);
    }
  }

  getAccountById(id) {
    return this.accounts.get(id) || null;
  }

  getAccountByUsername(username) {
    if (!username) return null;
    const id = this.usernameIndex.get(username.toLowerCase());
    return id ? this.accounts.get(id) : null;
  }

  getAccountByWallet(walletAddress) {
    if (!walletAddress) return null;
    const id = this.walletIndex.get(walletAddress.toLowerCase());
    return id ? this.accounts.get(id) : null;
  }

  saveAccount(account) {
    this.accounts.set(account.id, account);
    if (account.username) this.usernameIndex.set(account.username.toLowerCase(), account.id);
    if (account.walletAddress) this.walletIndex.set(account.walletAddress.toLowerCase(), account.id);
    this.flush();
    return account;
  }
}
