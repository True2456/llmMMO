/**
 * PRIMA: Age of Bronze - UI Controller (20 Skills, 30 Quests, World Atlas & Auth)
 */

import { QUEST_DEFINITIONS } from '../../server/engine/quests.js';
import { CITIES, TOWNS, BIOMES } from '../../server/engine/world.js';
import { DUNGEON_DEFINITIONS } from '../../server/engine/dungeons.js';
import { SKILL_DEFINITIONS } from '../../server/engine/skills_data.js';
import { CRAFTING_RECIPES, CRAFTING_STATIONS } from '../../server/engine/crafting.js';
import { ITEM_DEFINITIONS } from '../../server/engine/player.js';

export class UIManager {
  constructor(network, audio, web3, spriteEngine) {
    this.network = network;
    this.audio = audio;
    this.web3 = web3;
    this.spriteEngine = spriteEngine;
    this.activeChatChannel = 'all';
    this.activeQuestFilter = 'all';

    this.initEventListeners();
    this.initAuthModal();
    this.initDialogueAndCraftingModals();
    this.initMcpSettings();
    this.renderAtlas();
    this.renderQuests({});
  }

  initAuthModal() {
    const modal = document.getElementById('auth-modal');
    const tabLogin = document.getElementById('modal-tab-login');
    const tabReg = document.getElementById('modal-tab-register');
    const formLogin = document.getElementById('form-login');
    const formReg = document.getElementById('form-register');
    const btnGuest = document.getElementById('btn-modal-guest');
    const btnWeb3 = document.getElementById('btn-modal-web3');
    const errorBox = document.getElementById('auth-error-msg');

    if (!modal) return;

    const savedToken = localStorage.getItem('prima_session');
    if (savedToken) {
      this.network.send({ type: 'LOGIN_SESSION', sessionToken: savedToken });
      modal.classList.add('hidden');
    }

    if (tabLogin && tabReg && formLogin && formReg) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
        formLogin.classList.add('active');
        formReg.classList.remove('active');
        if (errorBox) errorBox.classList.add('hidden');
      });

      tabReg.addEventListener('click', () => {
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
        formReg.classList.add('active');
        formLogin.classList.remove('active');
        if (errorBox) errorBox.classList.add('hidden');
      });

      formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem('prima_session', data.sessionToken);
            this.network.send({ type: 'LOGIN_SESSION', sessionToken: data.sessionToken });
            modal.classList.add('hidden');
            this.audio.playLevelUp();
          } else {
            errorBox.textContent = data.error || 'Login failed.';
            errorBox.classList.remove('hidden');
          }
        } catch (err) {
          errorBox.textContent = 'Server connection error.';
          errorBox.classList.remove('hidden');
        }
      });

      formReg.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;

        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem('prima_session', data.sessionToken);
            this.network.send({ type: 'LOGIN_SESSION', sessionToken: data.sessionToken });
            modal.classList.add('hidden');
            this.audio.playLevelUp();
          } else {
            errorBox.textContent = data.error || 'Registration failed.';
            errorBox.classList.remove('hidden');
          }
        } catch (err) {
          errorBox.textContent = 'Server connection error.';
          errorBox.classList.remove('hidden');
        }
      });
    }

    if (btnGuest) btnGuest.addEventListener('click', () => modal.classList.add('hidden'));

    if (btnWeb3) {
      btnWeb3.addEventListener('click', async () => {
        const res = await this.web3.connectWallet();
        if (res && res.success) {
          try {
            const vRes = await fetch('/api/auth/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ address: res.address, signature: '0x_verified', nonce: 'siwe_login' })
            });
            const vData = await vRes.json();
            if (vData.sessionToken) {
              localStorage.setItem('prima_session', vData.sessionToken);
              this.network.send({ type: 'LOGIN_SESSION', sessionToken: vData.sessionToken });
            }
          } catch (e) {}
          modal.classList.add('hidden');
        }
      });
    }
  }

  initEventListeners() {
    // Tab Switching
    document.querySelectorAll('.hud-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hud-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const tabKey = btn.getAttribute('data-tab');
        const panel = document.getElementById(`panel-${tabKey}`);
        if (panel) panel.classList.add('active');
      });
    });

    // Quest Filter Switching
    document.querySelectorAll('.quest-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.quest-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeQuestFilter = btn.getAttribute('data-filter');
        this.renderQuests(this.latestPlayerQuests || {});
      });
    });

    // Chat Form Submission
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (text) {
          this.network.chat(text);
          chatInput.value = '';
        }
      });
    }

    // Chat Filter Tabs
    document.querySelectorAll('.chat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chat-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeChatChannel = btn.getAttribute('data-channel');
      });
    });

    // Audio Toggle
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const enabled = this.audio.toggle();
        audioBtn.textContent = enabled ? '🔊 Sound: ON' : '🔇 Sound: OFF';
      });
    }

    // Web3 Connect Button
    const web3Btn = document.getElementById('btn-web3-connect');
    if (web3Btn) {
      web3Btn.addEventListener('click', async () => {
        const res = await this.web3.connectWallet();
        if (res && res.success) {
          web3Btn.textContent = `🦊 ${res.address.substring(0, 6)}...${res.address.substring(38)}`;
          document.getElementById('web3-wallet-addr').textContent = res.address;
          document.getElementById('web3-network-name').textContent = res.network;
          this.network.send({ type: 'SET_WALLET', address: res.address });
        }
      });
    }

    // Grand Exchange Buttons
    const btnBuy = document.getElementById('btn-ge-buy');
    const btnSell = document.getElementById('btn-ge-sell');
    if (btnBuy && btnSell) {
      btnBuy.addEventListener('click', () => {
        const item = document.getElementById('ge-item-select').value;
        const qty = parseInt(document.getElementById('ge-qty').value, 10) || 1;
        const price = parseInt(document.getElementById('ge-price').value, 10) || 10;
        this.network.exchangeBuy(item, qty, price);
        this.audio.playCoin();
      });

      btnSell.addEventListener('click', () => {
        const item = document.getElementById('ge-item-select').value;
        const qty = parseInt(document.getElementById('ge-qty').value, 10) || 1;
        const price = parseInt(document.getElementById('ge-price').value, 10) || 10;
        this.network.exchangeSell(item, qty, price);
        this.audio.playCoin();
      });
    }

    const btnBridge = document.getElementById('btn-bridge-gold');
    if (btnBridge) {
      btnBridge.addEventListener('click', async () => {
        try {
          const res = await this.web3.bridgeGold(100);
          alert(`🎉 Amber Beads Bridged On-Chain!\nTokens: ${res.amount} PRIMA Tokens\nTX: ${res.txHash.substring(0, 18)}...`);
        } catch (e) {
          alert(`Web3 Notice: ${e.message}`);
        }
      });
    }
  }

  updatePlayerStats(self) {
    if (!self) return;

    if (self.username) {
      this.updateMcpCharacter(self.username);
    }

    document.getElementById('stat-hp-text').textContent = `${self.hp} / ${self.maxHp}`;
    document.getElementById('stat-hp-bar').style.width = `${Math.max(0, Math.min(100, (self.hp / self.maxHp) * 100))}%`;
    document.getElementById('stat-prayer-text').textContent = `${self.spirit || 10} / 10`;
    document.getElementById('stat-combat-lvl').textContent = self.combatLvl || 3;

    // Location Check (200x200 Archipelago)
    const locElem = document.getElementById('stat-location-name');
    if (locElem) {
      if (self.x >= 150 && self.y <= 65) {
        locElem.textContent = '✨ Starfall Sanctuary Isle';
      } else if (self.y < 52) {
        locElem.textContent = '❄️ The Mammoth Steppes';
      } else if (self.x < 65 && self.y >= 75) {
        locElem.textContent = '🌿 Primeval Cycad Rainforest';
      } else if (self.x > 125 && self.y >= 95) {
        locElem.textContent = '🔥 Obsidian Crags';
      } else if (self.x > 125 && self.y < 95) {
        locElem.textContent = '✨ Sunken Megalith Crypts';
      } else if (self.y >= 52 && self.y < 95 && self.x >= 70 && self.x <= 130) {
        locElem.textContent = '🐪 Barter Oasis Dunes';
      } else {
        locElem.textContent = '🌾 Ash-River Encampment';
      }
    }

    this.renderInventory(self.inventory);
    this.renderEquipment(self.equipment);
    this.renderSkills(self.skills);
    this.renderQuests(self.quests || {});
  }

  renderInventory(inventory) {
    const grid = document.getElementById('inventory-grid');
    if (!grid || !inventory) return;

    grid.innerHTML = '';
    let amberCount = 0;

    inventory.forEach((item, slotIdx) => {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';

      if (item) {
        if (item.id === 'amber_beads') amberCount = item.quantity;
        
        const sprite = this.spriteEngine?.getSprite(`icon_${item.id}`) || this.spriteEngine?.getSprite('icon_amber_beads');
        if (sprite) {
          const img = document.createElement('img');
          img.src = sprite.toDataURL();
          img.className = 'slot-sprite-img';
          img.style.imageRendering = 'pixelated';
          slot.appendChild(img);
        } else {
          slot.innerHTML = `<span class="slot-icon">${item.name.substring(0, 2)}</span>`;
        }

        if (item.quantity > 1) {
          const qty = document.createElement('span');
          qty.className = 'slot-qty';
          qty.textContent = item.quantity;
          slot.appendChild(qty);
        }

        slot.title = `${item.name} (${item.quantity})`;

        slot.addEventListener('click', () => {
          if (item.heal) {
            this.network.eatFood(slotIdx);
            this.audio.playTone(440, 'triangle', 0.1);
          } else if (item.slot) {
            this.network.equipItem(slotIdx);
            this.audio.playTone(330, 'square', 0.08);
          }
        });
      }

      grid.appendChild(slot);
    });

    const coinElem = document.getElementById('inv-coins');
    if (coinElem) coinElem.textContent = `🟡 ${amberCount} Amber`;
  }

  renderEquipment(equipment) {
    if (!equipment) return;

    const slots = ['head', 'cape', 'neck', 'weapon', 'body', 'shield', 'legs', 'hands', 'feet', 'ring'];
    let totalAtt = 0;
    let totalStr = 0;
    let totalDef = 0;

    slots.forEach(s => {
      const elem = document.getElementById(`equip-${s}`);
      const item = equipment[s];
      if (elem) {
        if (item) {
          const sprite = this.spriteEngine?.getSprite(`icon_${item.id}`);
          if (sprite) {
            elem.innerHTML = `<img src="${sprite.toDataURL()}" style="image-rendering: pixelated; width: 24px; height: 24px;">`;
          } else {
            elem.innerHTML = item.name.substring(0, 4);
          }
          elem.classList.add('has-item');
          elem.title = item.name;
          if (item.attackBonus) totalAtt += item.attackBonus;
          if (item.strengthBonus) totalStr += item.strengthBonus;
          if (item.defenseBonus) totalDef += item.defenseBonus;

          elem.onclick = () => this.network.unequipItem(s);
        } else {
          elem.innerHTML = s.charAt(0).toUpperCase() + s.slice(1);
          elem.classList.remove('has-item');
          elem.title = s;
          elem.onclick = null;
        }
      }
    });

    document.getElementById('stat-att-bonus').textContent = `+${totalAtt}`;
    document.getElementById('stat-str-bonus').textContent = `+${totalStr}`;
    document.getElementById('stat-def-bonus').textContent = `+${totalDef}`;
  }

  renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid || !skills) return;

    grid.innerHTML = '';

    for (const [skillId, def] of Object.entries(SKILL_DEFINITIONS)) {
      const data = skills[skillId] || { lvl: 1, xp: 0 };
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <span class="skill-icon">${def.icon}</span>
        <div class="skill-info">
          <div class="skill-name">${def.name.toUpperCase()}</div>
          <div class="skill-lvl">Tier ${Math.ceil(data.lvl / 5)} • Lv ${data.lvl}</div>
        </div>
      `;
      card.title = `${def.name}: Level ${data.lvl}/50 (${data.xp} XP) - Click to view 25 Unlocks`;
      card.style.cursor = 'pointer';
      card.onclick = () => {
        const unlocks = def.unlocks.map(u => `• [Lv ${u.lvl}] ${u.name}: ${u.desc}`).join('\n');
        alert(`✨ ${def.name.toUpperCase()} (Tier ${Math.ceil(data.lvl / 5)} / 10)\nCategory: ${def.category}\n${def.description}\n\n25 UNLOCKS MATRIX:\n${unlocks}`);
      };
      grid.appendChild(card);
    }
  }

  renderQuests(playerQuests) {
    this.latestPlayerQuests = playerQuests;
    const list = document.getElementById('quests-list');
    if (!list) return;

    list.innerHTML = '';

    for (const [id, def] of Object.entries(QUEST_DEFINITIONS)) {
      const qState = playerQuests[id] || { status: 'NOT_STARTED', step: 0 };

      if (this.activeQuestFilter !== 'all') {
        if (this.activeQuestFilter === 'novice' && def.difficulty !== 'Novice') continue;
        if (this.activeQuestFilter === 'adept' && def.difficulty !== 'Adept') continue;
        if (this.activeQuestFilter === 'master' && !['Master', 'Grandmaster (Endgame Milestone)'].includes(def.difficulty)) continue;
      }

      const card = document.createElement('div');
      card.className = `quest-card ${qState.status === 'COMPLETED' ? 'completed' : ''}`;
      
      const statusIcon = qState.status === 'COMPLETED' ? '✅' : (qState.status === 'IN_PROGRESS' ? '⏳' : '📜');
      const stepText = qState.status === 'COMPLETED' ? 'Complete' : `Step ${qState.step + 1}/${def.steps.length}`;

      card.innerHTML = `
        <div class="quest-header-row">
          <span class="quest-title-text">${statusIcon} ${def.title}</span>
          <span class="quest-diff-badge ${def.difficulty.split(' ')[0]}">${def.difficulty.toUpperCase()}</span>
        </div>
        <div class="quest-desc-text">${def.summary}</div>
        <div class="quest-reward-text">Giver: ${def.giver} • [${stepText}]</div>
      `;
      list.appendChild(card);
    }
  }

  renderAtlas() {
    const list = document.getElementById('atlas-list');
    if (!list) return;

    list.innerHTML = '';

    // 1. Grand Metropolis Cities
    CITIES.forEach(c => {
      const card = document.createElement('div');
      card.className = 'atlas-card';
      card.innerHTML = `
        <div>
          <div class="atlas-card-title">👑 ${c.name} (Grand Metropolis)</div>
          <div class="atlas-card-sub">${c.desc}</div>
        </div>
        <div class="atlas-coords">(${c.x}, ${c.y})</div>
      `;
      list.appendChild(card);
    });

    // 2. Towns & Encampments
    TOWNS.forEach(t => {
      const card = document.createElement('div');
      card.className = 'atlas-card';
      card.innerHTML = `
        <div>
          <div class="atlas-card-title">🏕️ ${t.name}</div>
          <div class="atlas-card-sub">${t.desc}</div>
        </div>
        <div class="atlas-coords">(${t.x}, ${t.y})</div>
      `;
      list.appendChild(card);
    });

    // 3. 12 Dungeons
    Object.values(DUNGEON_DEFINITIONS).forEach(d => {
      const card = document.createElement('div');
      card.className = 'atlas-card';
      card.innerHTML = `
        <div>
          <div class="atlas-card-title">⚔️ ${d.name} (${d.recLevel})</div>
          <div class="atlas-card-sub">Boss: ${d.bossName} • ${d.rooms} Chambers</div>
        </div>
        <div class="atlas-coords">(${d.entrance.x}, ${d.entrance.y})</div>
      `;
      list.appendChild(card);
    });
  }

  showLevelUp(event) {
    const banner = document.getElementById('level-up-banner');
    const text = document.getElementById('level-up-text');
    if (banner && text) {
      text.textContent = `You advanced in ${event.skillName.toUpperCase()}! Current Level: ${event.newLevel}`;
      banner.classList.remove('hidden');
      this.audio.playLevelUp();
      setTimeout(() => banner.classList.add('hidden'), 4000);
    }
  }

  addChatMessage(msg) {
    const box = document.getElementById('chat-messages');
    if (!box) return;

    const div = document.createElement('div');
    div.className = `chat-msg ${msg.isAgent ? 'agent' : 'human'}`;

    const badgeClass = msg.isAgent ? 'badge-agent' : 'badge-human';
    div.innerHTML = `
      <span class="badge ${badgeClass}">[${msg.badge || 'Tribesman'}]</span>
      <b>${msg.from}:</b> ${msg.text}
    `;

    box.insertBefore(div, box.firstChild);
    if (box.children.length > 50) box.removeChild(box.lastChild);
  }

  initDialogueAndCraftingModals() {
    const btnDiagClose = document.getElementById('btn-dialogue-close');
    if (btnDiagClose) {
      btnDiagClose.addEventListener('click', () => {
        document.getElementById('dialogue-modal')?.classList.add('hidden');
      });
    }

    const btnCraftClose = document.getElementById('btn-crafting-close');
    if (btnCraftClose) {
      btnCraftClose.addEventListener('click', () => {
        document.getElementById('crafting-modal')?.classList.add('hidden');
      });
    }

    const btnStashClose = document.getElementById('btn-stash-close');
    if (btnStashClose) {
      btnStashClose.addEventListener('click', () => {
        document.getElementById('stash-modal')?.classList.add('hidden');
      });
    }
  }

  openStashVault(player) {
    const modal = document.getElementById('stash-modal');
    const vaultGrid = document.getElementById('stash-vault-grid');
    const invGrid = document.getElementById('stash-inventory-grid');
    const occupiedCountEl = document.getElementById('stash-occupied-count');
    const statusMsgEl = document.getElementById('stash-status-msg');
    const btnDepositAll = document.getElementById('btn-stash-deposit-all');

    if (!modal) return;

    const bankStorage = player?.bankStorage || new Array(50).fill(null);
    const inventory = player?.inventory || new Array(28).fill(null);

    let occupied = 0;
    for (let i = 0; i < 50; i++) {
      if (bankStorage[i]) occupied++;
    }
    if (occupiedCountEl) occupiedCountEl.textContent = occupied;

    if (vaultGrid) {
      vaultGrid.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const item = bankStorage[i];
        const slotEl = document.createElement('div');
        slotEl.className = `stash-slot ${item ? '' : 'empty'}`;

        if (item) {
          const spriteKey = item.sprite || `icon_${item.id}`;
          const sprite = this.spriteEngine.getSprite(spriteKey) || this.spriteEngine.getSprite('icon_amber_beads');
          if (sprite) {
            const canvas = document.createElement('canvas');
            canvas.width = sprite.width;
            canvas.height = sprite.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(sprite, 0, 0);
            slotEl.appendChild(canvas);
          }
          if (item.quantity > 1) {
            const badge = document.createElement('span');
            badge.className = 'stash-stack-badge';
            badge.textContent = `${item.quantity}x`;
            slotEl.appendChild(badge);
          }
          slotEl.title = `${item.name} (${item.quantity}x/25x) - Left click: Withdraw 1x | Right click: Withdraw 25x`;

          slotEl.onclick = () => {
            this.network.send({ type: 'WITHDRAW_STASH', stashIndex: i, quantity: 1 });
            if (statusMsgEl) statusMsgEl.textContent = `Withdrawing 1x ${item.name}...`;
            setTimeout(() => {
              if (window.latestGameState?.self) this.openStashVault(window.latestGameState.self);
            }, 300);
          };
          slotEl.oncontextmenu = (e) => {
            e.preventDefault();
            this.network.send({ type: 'WITHDRAW_STASH', stashIndex: i, quantity: 25 });
            if (statusMsgEl) statusMsgEl.textContent = `Withdrawing all ${item.name}...`;
            setTimeout(() => {
              if (window.latestGameState?.self) this.openStashVault(window.latestGameState.self);
            }, 300);
          };
        }
        vaultGrid.appendChild(slotEl);
      }
    }

    if (invGrid) {
      invGrid.innerHTML = '';
      for (let i = 0; i < 28; i++) {
        const item = inventory[i];
        const slotEl = document.createElement('div');
        slotEl.className = `stash-slot ${item ? '' : 'empty'}`;

        if (item) {
          const spriteKey = item.sprite || `icon_${item.id}`;
          const sprite = this.spriteEngine.getSprite(spriteKey) || this.spriteEngine.getSprite('icon_amber_beads');
          if (sprite) {
            const canvas = document.createElement('canvas');
            canvas.width = sprite.width;
            canvas.height = sprite.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(sprite, 0, 0);
            slotEl.appendChild(canvas);
          }
          if (item.quantity > 1) {
            const badge = document.createElement('span');
            badge.className = 'stash-stack-badge';
            badge.textContent = `${item.quantity}x`;
            slotEl.appendChild(badge);
          }
          slotEl.title = `${item.name} (${item.quantity}x) - Click to Deposit into Stash`;

          slotEl.onclick = () => {
            this.network.send({ type: 'DEPOSIT_STASH', slotIndex: i, quantity: item.quantity || 1 });
            if (statusMsgEl) statusMsgEl.textContent = `Depositing ${item.name}...`;
            setTimeout(() => {
              if (window.latestGameState?.self) this.openStashVault(window.latestGameState.self);
            }, 300);
          };
        }
        invGrid.appendChild(slotEl);
      }
    }

    if (btnDepositAll) {
      btnDepositAll.onclick = () => {
        for (let i = 0; i < 28; i++) {
          if (inventory[i]) {
            this.network.send({ type: 'DEPOSIT_STASH', slotIndex: i, quantity: inventory[i].quantity || 1 });
          }
        }
        if (statusMsgEl) statusMsgEl.textContent = `Depositing all materials into tribal vault...`;
        setTimeout(() => {
          if (window.latestGameState?.self) this.openStashVault(window.latestGameState.self);
        }, 500);
      };
    }

    modal.classList.remove('hidden');
  }

  openDialogue(npc) {
    const modal = document.getElementById('dialogue-modal');
    const nameEl = document.getElementById('dialogue-speaker-name');
    const titleEl = document.getElementById('dialogue-speaker-title');
    const textEl = document.getElementById('dialogue-text-content');
    const optionsEl = document.getElementById('dialogue-options');
    const canvas = document.getElementById('dialogue-avatar-canvas');

    if (!modal) return;

    nameEl.textContent = npc.name;
    titleEl.textContent = npc.title || (npc.isTownNpc ? 'Tribal Elder' : 'Wild Wanderer');
    textEl.textContent = npc.dialogue || `Greetings, traveler. May the spirit fires guide your path across the realm.`;

    // Render avatar
    if (canvas && this.spriteEngine) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 48, 48);
      const sprite = this.spriteEngine.getSprite(npc.sprite || `npc_${npc.id}`) || this.spriteEngine.getSprite('monster_dire_wolf');
      if (sprite) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sprite, 12, 10, 24, 28);
      }
    }

    // Build branching options
    optionsEl.innerHTML = '';

    // Option 1: Quests
    const optQuest = document.createElement('button');
    optQuest.className = 'dialogue-opt-btn';
    optQuest.innerHTML = `📜 "Do you have any tasks for my clan?"`;
    optQuest.onclick = () => {
      modal.classList.add('hidden');
      this.switchTab('quests');
    };
    optionsEl.appendChild(optQuest);

    // Option 2: Bank (if Torok or Banker)
    if (npc.name.includes('Banker') || (npc.id && npc.id.includes('banker'))) {
      const optBank = document.createElement('button');
      optBank.className = 'dialogue-opt-btn';
      optBank.innerHTML = `🏦 "I wish to access my tribal vault storage."`;
      optBank.onclick = () => {
        modal.classList.add('hidden');
        if (window.latestGameState?.self) {
          this.openStashVault(window.latestGameState.self);
        }
      };
      optionsEl.appendChild(optBank);
    }

    // Option 3: Crafting Guidance
    const optCraft = document.createElement('button');
    optCraft.className = 'dialogue-opt-btn';
    optCraft.innerHTML = `🛠️ "Tell me about the crafting stations in this realm."`;
    optCraft.onclick = () => {
      textEl.textContent = `"Ash-River has our Smelting Crucible and Knapping Bench. Oakhaven Grove in the west specializes in Carpentry and Leather Tanning. Travel north to Frostbite Hold for Mammoth Looms, or east to Sunken Basin for heavy Basalt Anvils!"`;
    };
    optionsEl.appendChild(optCraft);

    // Option 4: Close
    const optLeave = document.createElement('button');
    optLeave.className = 'dialogue-opt-btn';
    optLeave.innerHTML = `❌ "Farewell, elder."`;
    optLeave.onclick = () => modal.classList.add('hidden');
    optionsEl.appendChild(optLeave);

    modal.classList.remove('hidden');
  }

  openCraftingStation(stationNode, player) {
    const modal = document.getElementById('crafting-modal');
    const nameEl = document.getElementById('crafting-station-name');
    const iconEl = document.getElementById('crafting-station-icon');
    const descEl = document.getElementById('crafting-station-desc');
    const gridEl = document.getElementById('crafting-recipe-grid');

    if (!modal) return;

    const stationDef = CRAFTING_STATIONS[stationNode.stationType] || {
      name: stationNode.name,
      icon: '🔥',
      desc: 'Use materials from your inventory to craft useful items.'
    };

    nameEl.textContent = stationDef.name;
    iconEl.textContent = stationDef.icon;
    descEl.textContent = stationDef.desc;

    // Filter recipes
    const recipes = CRAFTING_RECIPES.filter(r => r.stationType === stationNode.stationType || (stationNode.type && stationNode.type.includes('CAMPFIRE') && r.stationType === 'STATION_CAMPFIRE') || (stationNode.type && stationNode.type.includes('CRUCIBLE') && r.stationType === 'STATION_CRUCIBLE') || (stationNode.type && stationNode.type.includes('ANVIL') && r.stationType === 'STATION_ANVIL') || (stationNode.type && stationNode.type.includes('KNAPPING') && r.stationType === 'STATION_KNAPPING'));

    gridEl.innerHTML = '';

    if (recipes.length === 0) {
      gridEl.innerHTML = `<div style="color: #888; font-family: var(--font-retro); font-size: 18px;">No known recipes for this station.</div>`;
    }

    recipes.forEach(r => {
      const card = document.createElement('div');
      card.className = 'recipe-card';

      // Check level
      const skillLvl = player?.skills ? (player.skills[r.skill]?.lvl || 1) : 1;
      const hasLevel = skillLvl >= r.reqLvl;

      // Check ingredients
      let hasAllItems = true;
      const reqItemsHtml = r.inputs.map(input => {
        let count = 0;
        if (player?.inventory) {
          for (const slot of player.inventory) {
            if (slot && slot.id === input.id) count += (slot.quantity || 1);
          }
        }
        const hasEnough = count >= input.qty;
        if (!hasEnough) hasAllItems = false;
        const itemDef = ITEM_DEFINITIONS[input.id] || { name: input.id };
        return `<span class="req-item ${hasEnough ? 'has-enough' : 'missing'}">${hasEnough ? '✓' : '✗'} ${count}/${input.qty} ${itemDef.name}</span>`;
      }).join(' ');

      const canCraft = hasLevel && hasAllItems;

      card.innerHTML = `
        <div class="recipe-info">
          <div class="recipe-title-row">
            <span class="recipe-name">${r.name}</span>
            <span class="recipe-lvl-tag">Req ${r.skill.toUpperCase()} Lvl ${r.reqLvl} (+${r.xp} XP)</span>
          </div>
          <div class="recipe-reqs">
            ${reqItemsHtml}
          </div>
        </div>
        <button class="btn-craft-action" ${canCraft ? '' : 'disabled'}>CRAFT 1x</button>
      `;

      const btn = card.querySelector('.btn-craft-action');
      btn.onclick = () => {
        this.network.send({
          type: 'CRAFT_RECIPE',
          recipeId: r.id,
          stationId: stationNode.id
        });
        setTimeout(() => {
          if (window.latestGameState?.self) {
            this.openCraftingStation(stationNode, window.latestGameState.self);
          }
        }, 500);
      };

      gridEl.appendChild(card);
    });

    modal.classList.remove('hidden');
  }

  /* ==========================================================================
     AI & MCP Agent Control Center Management
     ========================================================================== */
  initMcpSettings() {
    this.currentCharName = 'Tribesman';

    const modal = document.getElementById('mcp-modal');
    const btnOpenHeader = document.getElementById('btn-mcp-settings');
    const btnOpenPanel = document.getElementById('btn-mcp-open-modal');
    const btnClose = document.getElementById('btn-mcp-close');

    const openModal = () => {
      this.renderMcpSnippets();
      if (modal) modal.classList.remove('hidden');
    };

    const closeModal = () => {
      if (modal) modal.classList.add('hidden');
    };

    if (btnOpenHeader) btnOpenHeader.addEventListener('click', openModal);
    if (btnOpenPanel) btnOpenPanel.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);

    // Config Tabs
    const tabBtns = document.querySelectorAll('.mcp-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.mcp-config-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(`pane-config-${btn.dataset.configTab}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Helper for clipboard copying with visual feedback
    const setupCopy = (btnId, textGetter) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.addEventListener('click', async () => {
        const text = typeof textGetter === 'function' ? textGetter() : textGetter;
        try {
          await navigator.clipboard.writeText(text);
          const oldText = btn.textContent;
          btn.textContent = '✓ Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = oldText;
            btn.classList.remove('copied');
          }, 1800);
        } catch (err) {
          console.warn('Clipboard write error:', err);
        }
      });
    };

    // Copy Handlers
    const getBaseUrl = () => window.location.origin;
    const getMcpUrl = () => `${getBaseUrl()}/mcp`;

    setupCopy('btn-mcp-copy-endpoint', () => getMcpUrl());
    setupCopy('btn-mcp-copy-quick-url', () => getMcpUrl());
    setupCopy('btn-mcp-copy-header', () => `X-Agent-Name: ${this.currentCharName}`);

    setupCopy('btn-copy-claude-snippet', () => document.getElementById('code-claude-snippet')?.textContent || '');
    setupCopy('btn-mcp-copy-claude', () => document.getElementById('code-claude-snippet')?.textContent || '');

    setupCopy('btn-copy-cursor-snippet', () => document.getElementById('code-cursor-snippet')?.textContent || '');
    setupCopy('btn-mcp-copy-cursor', () => document.getElementById('code-cursor-snippet')?.textContent || '');

    setupCopy('btn-copy-python-snippet', () => document.getElementById('code-python-snippet')?.textContent || '');
    setupCopy('btn-copy-node-snippet', () => document.getElementById('code-node-snippet')?.textContent || '');
    setupCopy('btn-copy-curl-snippet', () => document.getElementById('code-curl-snippet')?.textContent || '');

    // Tool Tester Argument Presets
    const toolParamPresets = {
      realm_look: '{}',
      realm_status: '{}',
      realm_move: '{"targetX": 92, "targetY": 130}',
      realm_gather: '{"nodeId": "node_copper_1"}',
      realm_combat: '{"npcId": "npc_boar_1"}',
      realm_chat: '{"text": "Greetings travelers! My AI companion is online."}',
      realm_pickup: '{"itemId": "item_ground_1"}',
      realm_trade: '{"action": "BUY", "itemId": "ingot_bronze", "quantity": 1}',
      realm_quest: '{"npcId": "npc_elder_kael", "dialogueChoice": "accept"}'
    };

    const toolSelect = document.getElementById('mcp-test-tool-select');
    const paramInput = document.getElementById('mcp-test-param-input');
    if (toolSelect && paramInput) {
      toolSelect.addEventListener('change', () => {
        paramInput.value = toolParamPresets[toolSelect.value] || '{}';
      });
    }

    // Live In-Browser Tool Execution
    const btnExecute = document.getElementById('btn-mcp-test-execute');
    const statusSpan = document.getElementById('mcp-test-status');
    const responsePre = document.getElementById('mcp-test-response-pre');

    if (btnExecute && toolSelect && paramInput && responsePre) {
      btnExecute.addEventListener('click', async () => {
        const toolName = toolSelect.value;
        let args = {};
        try {
          args = JSON.parse(paramInput.value || '{}');
        } catch (e) {
          if (statusSpan) statusSpan.textContent = 'JSON Syntax Error';
          responsePre.textContent = `Error parsing arguments: ${e.message}\nMake sure your parameters are valid JSON format e.g. {"targetX": 90, "targetY": 130}`;
          return;
        }

        if (statusSpan) statusSpan.textContent = 'Executing...';
        btnExecute.disabled = true;

        try {
          const res = await fetch('/mcp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Agent-Name': this.currentCharName
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: Date.now(),
              method: 'tools/call',
              params: {
                name: toolName,
                arguments: args
              }
            })
          });

          const data = await res.json();
          if (statusSpan) statusSpan.textContent = `✓ ${res.status} OK`;
          responsePre.textContent = JSON.stringify(data, null, 2);
          if (this.audio) this.audio.playClick();
        } catch (err) {
          if (statusSpan) statusSpan.textContent = 'Request Failed';
          responsePre.textContent = `Execution Error: ${err.message}`;
        } finally {
          btnExecute.disabled = false;
        }
      });
    }

    this.renderMcpSnippets();
  }

  updateMcpCharacter(charName) {
    if (!charName || charName === this.currentCharName) return;
    this.currentCharName = charName;

    const quickName = document.getElementById('mcp-quick-char-name');
    const modalName = document.getElementById('mcp-modal-char-name');
    const headerCode = document.getElementById('mcp-modal-header-code');

    if (quickName) quickName.textContent = charName;
    if (modalName) modalName.textContent = charName;
    if (headerCode) headerCode.textContent = `X-Agent-Name: ${charName}`;

    this.renderMcpSnippets();
  }

  renderMcpSnippets() {
    const origin = window.location.origin || 'https://llmmmo.onrender.com';
    const mcpUrl = `${origin}/mcp`;
    const charName = this.currentCharName || 'Tribesman';

    const quickUrl = document.getElementById('mcp-quick-url');
    const endpointCode = document.getElementById('mcp-modal-endpoint-code');
    if (quickUrl) quickUrl.textContent = mcpUrl;
    if (endpointCode) endpointCode.textContent = mcpUrl;

    // 1. Claude Desktop Config
    const claudeJson = {
      "mcpServers": {
        "prima-mmorpg": {
          "command": "npx",
          "args": [
            "-y",
            "@modelcontextprotocol/server-fetch",
            `${mcpUrl}?character=${encodeURIComponent(charName)}`
          ]
        }
      }
    };
    const claudeEl = document.getElementById('code-claude-snippet');
    if (claudeEl) claudeEl.textContent = JSON.stringify(claudeJson, null, 2);

    // 2. Cursor / Windsurf Config
    const cursorJson = {
      "mcp": {
        "prima-mmorpg": {
          "url": `${mcpUrl}?character=${encodeURIComponent(charName)}`,
          "headers": {
            "X-Agent-Name": charName
          }
        }
      }
    };
    const cursorEl = document.getElementById('code-cursor-snippet');
    if (cursorEl) cursorEl.textContent = JSON.stringify(cursorJson, null, 2);

    // 3. Python Agent
    const pythonCode = `import urllib.request, json

MCP_URL = "${mcpUrl}"
CHARACTER = "${charName}"

def call_mcp(tool_name, arguments={}):
    payload = json.dumps({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {"name": tool_name, "arguments": arguments}
    }).encode("utf-8")
    
    req = urllib.request.Request(
        MCP_URL,
        data=payload,
        headers={"Content-Type": "application/json", "X-Agent-Name": CHARACTER}
    )
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read().decode("utf-8"))

# Look around 15x15 tiles & perceive environment
view = call_mcp("realm_look")
print("Surrounding Nodes & Monsters:", view)

# Check character's 20 skills & health
status = call_mcp("realm_status")
print("Skills & HP:", status)

# Harvest nearby copper or tin
gather_res = call_mcp("realm_gather", {"nodeId": "node_copper_1"})
print("Gathering Outcome:", gather_res)
`;
    const pythonEl = document.getElementById('code-python-snippet');
    if (pythonEl) pythonEl.textContent = pythonCode;

    // 4. Node.js Agent
    const nodeCode = `const MCP_URL = "${mcpUrl}";
const CHARACTER = "${charName}";

async function callTool(name, args = {}) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Agent-Name": CHARACTER
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args }
    })
  });
  return await res.json();
}

// 1. Inspect Character & Surroundings
const perception = await callTool("realm_look");
console.log("World State:", perception);

// 2. Move or Gather
const moveRes = await callTool("realm_move", { direction: "north" });
console.log("Move Result:", moveRes);
`;
    const nodeEl = document.getElementById('code-node-snippet');
    if (nodeEl) nodeEl.textContent = nodeCode;

    // 5. cURL
    const curlCode = `curl -X POST "${mcpUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-Agent-Name: ${charName}" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"realm_look","arguments":{}}}'`;
    const curlEl = document.getElementById('code-curl-snippet');
    if (curlEl) curlEl.textContent = curlCode;
  }
}


