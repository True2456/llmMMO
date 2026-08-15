/**
 * WebSocket Network Manager & Delta State Synchronizer
 */

export class NetworkManager {
  constructor(onDeltaReceived, onWelcome) {
    this.ws = null;
    this.onDeltaReceived = onDeltaReceived;
    this.onWelcome = onWelcome;
    this.connected = false;
    this.reconnectTimeout = null;
  }

  connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:3000';
    const wsUrl = `${protocol}//${host}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.connected = true;
      console.log('[Network] Connected to Aetheria Realm Engine.');
    };

    this.ws.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data);
        if (packet.type === 'WELCOME') {
          if (this.onWelcome) this.onWelcome(packet);
        } else if (packet.type === 'TICK') {
          if (this.onDeltaReceived) this.onDeltaReceived(packet);
        } else if (packet.type === 'STASH_STATE') {
          if (window.latestGameState?.self) {
            window.latestGameState.self.bankStorage = packet.bankStorage;
            window.latestGameState.self.inventory = packet.inventory;
            window.ui?.openStashVault(window.latestGameState.self);
          }
        }
      } catch (err) {
        console.error('[Network Error] Failed to parse delta packet:', err);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      console.warn('[Network] Disconnected from server. Reconnecting in 2s...');
      this.reconnectTimeout = setTimeout(() => this.connect(), 2000);
    };

    this.ws.onerror = (err) => {
      console.error('[Network Error]', err);
    };
  }

  send(action) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(action));
    }
  }

  move(x, y) {
    this.send({ type: 'MOVE', x, y });
  }

  interactResource(nodeId) {
    this.send({ type: 'INTERACT_RESOURCE', nodeId });
  }

  attackNPC(npcId) {
    this.send({ type: 'ATTACK_NPC', npcId });
  }

  talkNPC(npcId) {
    this.send({ type: 'TALK_NPC', npcId });
  }

  pickupItem(groundItemId) {
    this.send({ type: 'PICKUP_ITEM', groundItemId });
  }

  eatFood(slotIndex) {
    this.send({ type: 'EAT_FOOD', slotIndex });
  }

  equipItem(slotIndex) {
    this.send({ type: 'EQUIP_ITEM', slotIndex });
  }

  unequipItem(equipSlot) {
    this.send({ type: 'UNEQUIP_ITEM', equipSlot });
  }

  chat(text) {
    this.send({ type: 'CHAT', text });
  }

  exchangeBuy(itemId, quantity, price) {
    this.send({ type: 'EXCHANGE_BUY', itemId, quantity, price });
  }

  exchangeSell(itemId, quantity, price) {
    this.send({ type: 'EXCHANGE_SELL', itemId, quantity, price });
  }
}
