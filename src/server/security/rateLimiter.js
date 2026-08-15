/**
 * Sliding Window Token-Bucket Rate Limiter
 * Protects WebSocket frames and MCP endpoints from DDoS and runaway LLM action loops.
 */

export class RateLimiter {
  constructor(options = {}) {
    this.maxTokens = options.maxTokens || 30; // 30 actions allowed per burst
    this.refillRate = options.refillRate || 10; // 10 tokens refilled per second
    this.clients = new Map();

    // Clean up stale client entries periodically (every 5 minutes)
    setInterval(() => this.cleanup(), 300000);
  }

  /**
   * Checks if a client request is allowed.
   * @param {string} clientId - IP address or API key
   * @param {number} cost - Number of tokens to consume (default: 1)
   * @returns {boolean} True if allowed, false if rate limited
   */
  allow(clientId, cost = 1) {
    const now = Date.now();
    let record = this.clients.get(clientId);

    if (!record) {
      record = {
        tokens: this.maxTokens - cost,
        lastRefill: now
      };
      this.clients.set(clientId, record);
      return true;
    }

    // Refill tokens based on elapsed time
    const elapsedSeconds = (now - record.lastRefill) / 1000;
    record.tokens = Math.min(this.maxTokens, record.tokens + elapsedSeconds * this.refillRate);
    record.lastRefill = now;

    if (record.tokens >= cost) {
      record.tokens -= cost;
      return true;
    }

    return false;
  }

  cleanup() {
    const now = Date.now();
    for (const [clientId, record] of this.clients.entries()) {
      if (now - record.lastRefill > 600000) { // Inactive for 10 minutes
        this.clients.delete(clientId);
      }
    }
  }
}
