/**
 * PRIMA: Age of Bronze - Model Performance Evaluator & Benchmarker
 * Tracks productivity, survival, combat, crafting, and reasoning efficiency for LLM models.
 */

export class ModelEvaluator {
  constructor() {
    this.modelStats = new Map(); // modelId -> stats object
  }

  getOrCreateStats(modelId) {
    if (!this.modelStats.has(modelId)) {
      this.modelStats.set(modelId, {
        modelId,
        totalDecisions: 0,
        totalXpGained: 0,
        resourcesGathered: 0,
        itemsCrafted: 0,
        monstersDefeated: 0,
        damageDealt: 0,
        damageTaken: 0,
        deaths: 0,
        totalLatencyMs: 0,
        skillsProgress: {},
        firstSeen: Date.now(),
        lastActive: Date.now()
      });
    }
    return this.modelStats.get(modelId);
  }

  recordDecision(modelId, latencyMs = 0) {
    const stats = this.getOrCreateStats(modelId);
    stats.totalDecisions++;
    stats.totalLatencyMs += latencyMs;
    stats.lastActive = Date.now();
  }

  recordXpGain(modelId, skill, xpAmount) {
    const stats = this.getOrCreateStats(modelId);
    stats.totalXpGained += xpAmount;
    stats.skillsProgress[skill] = (stats.skillsProgress[skill] || 0) + xpAmount;
    stats.lastActive = Date.now();
  }

  recordGather(modelId, count = 1) {
    const stats = this.getOrCreateStats(modelId);
    stats.resourcesGathered += count;
    stats.lastActive = Date.now();
  }

  recordCraft(modelId, count = 1) {
    const stats = this.getOrCreateStats(modelId);
    stats.itemsCrafted += count;
    stats.lastActive = Date.now();
  }

  recordCombat(modelId, damageDealt = 0, damageTaken = 0, isKill = false) {
    const stats = this.getOrCreateStats(modelId);
    stats.damageDealt += damageDealt;
    stats.damageTaken += damageTaken;
    if (isKill) stats.monstersDefeated++;
    stats.lastActive = Date.now();
  }

  recordDeath(modelId) {
    const stats = this.getOrCreateStats(modelId);
    stats.deaths++;
    stats.lastActive = Date.now();
  }

  computeScore(stats) {
    // Composite Benchmark Formula: XP + Combat Kills + Crafting Output - Deaths
    const xpScore = stats.totalXpGained * 1.0;
    const combatScore = (stats.monstersDefeated * 40) + (stats.damageDealt * 5);
    const craftScore = (stats.itemsCrafted * 30) + (stats.resourcesGathered * 10);
    const deathPenalty = stats.deaths * 100;

    return Math.max(0, Math.round(xpScore + combatScore + craftScore - deathPenalty));
  }

  getLeaderboard() {
    const list = Array.from(this.modelStats.values()).map(stats => {
      const avgLatency = stats.totalDecisions > 0 
        ? Math.round(stats.totalLatencyMs / stats.totalDecisions) 
        : 0;
      const score = this.computeScore(stats);
      return {
        ...stats,
        avgLatencyMs: avgLatency,
        compositeScore: score
      };
    });

    return list.sort((a, b) => b.compositeScore - a.compositeScore);
  }
}
