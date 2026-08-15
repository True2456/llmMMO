/**
 * Economy & The Grand Realm Exchange
 * Manages peer-to-peer trading and centralized limit orderbook exchange
 */

import { ITEM_DEFINITIONS } from './player.js';

export class GrandExchange {
  constructor() {
    this.buyOrders = []; // [{ id, playerId, itemId, quantity, price, filled, createdAt }]
    this.sellOrders = []; // [{ id, playerId, itemId, quantity, price, filled, createdAt }]
    this.tradeHistory = [];
    this.orderCounter = 1;
  }

  createSellOrder(player, itemId, quantity, pricePerUnit) {
    if (!player.removeItem(itemId, quantity)) {
      return { success: false, error: 'Insufficient items in inventory.' };
    }

    const order = {
      id: `so_${this.orderCounter++}`,
      playerId: player.id,
      playerName: player.username,
      itemId,
      quantity,
      remaining: quantity,
      price: pricePerUnit,
      createdAt: Date.now()
    };

    this.sellOrders.push(order);
    this.matchOrders();

    return { success: true, orderId: order.id, message: `Listed ${quantity}x ${ITEM_DEFINITIONS[itemId]?.name || itemId} for ${pricePerUnit} coins each.` };
  }

  createBuyOrder(player, itemId, quantity, pricePerUnit) {
    const totalCost = quantity * pricePerUnit;
    const hasCurrency = player.removeItem('amber_beads', totalCost) || player.removeItem('coins', totalCost);
    if (!hasCurrency) {
      return { success: false, error: 'Insufficient Amber Beads in inventory.' };
    }

    const order = {
      id: `bo_${this.orderCounter++}`,
      playerId: player.id,
      playerName: player.username,
      itemId,
      quantity,
      remaining: quantity,
      price: pricePerUnit,
      createdAt: Date.now()
    };

    this.buyOrders.push(order);
    this.matchOrders();

    return { success: true, orderId: order.id, message: `Placed buy order for ${quantity}x ${ITEM_DEFINITIONS[itemId]?.name || itemId} at ${pricePerUnit} amber each.` };
  }

  matchOrders() {
    for (let i = this.buyOrders.length - 1; i >= 0; i--) {
      const buy = this.buyOrders[i];
      if (buy.remaining <= 0) continue;

      for (let j = this.sellOrders.length - 1; j >= 0; j--) {
        const sell = this.sellOrders[j];
        if (sell.remaining <= 0 || sell.itemId !== buy.itemId) continue;

        // Price match condition
        if (buy.price >= sell.price) {
          const tradeQty = Math.min(buy.remaining, sell.remaining);
          const tradePrice = sell.price;

          buy.remaining -= tradeQty;
          sell.remaining -= tradeQty;

          this.tradeHistory.unshift({
            itemId: buy.itemId,
            quantity: tradeQty,
            price: tradePrice,
            timestamp: Date.now()
          });

          if (this.tradeHistory.length > 50) this.tradeHistory.pop();
        }
      }
    }

    // Clean up completed orders
    this.buyOrders = this.buyOrders.filter(o => o.remaining > 0);
    this.sellOrders = this.sellOrders.filter(o => o.remaining > 0);
  }

  getOrderbook(itemId) {
    const buys = this.buyOrders.filter(o => o.itemId === itemId);
    const sells = this.sellOrders.filter(o => o.itemId === itemId);
    return { buys, sells };
  }
}
