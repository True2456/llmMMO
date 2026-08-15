/**
 * PRIMA: Age of Bronze - Agentic Trace & Chain-of-Thought (CoT) Recorder
 * Formats and persists rich LLM sensory-reasoning-action-reward trajectories for dataset generation.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class TraceRecorder {
  constructor(options = {}) {
    this.tracesFile = options.tracesFile || path.resolve('data/agent_traces.jsonl');
    this.memoryBuffer = [];
    this.ensureDirectory();
  }

  ensureDirectory() {
    const dir = path.dirname(this.tracesFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  generateTraceId(agentName, modelId, timestamp, perception, action) {
    const payload = JSON.stringify({
      agentName,
      modelId,
      timestamp,
      location: perception?.location,
      action
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  recordStep({
    modelId,
    agentName,
    badge,
    role,
    perception,
    chainOfThought,
    action,
    outcome,
    latencyMs = 0
  }) {
    const timestamp = new Date().toISOString();
    const traceId = this.generateTraceId(agentName, modelId, timestamp, perception, action);

    const record = {
      trace_id: traceId,
      timestamp,
      model_id: modelId,
      agent_name: agentName,
      badge: badge || 'LLM',
      role: role || 'ADVENTURER',
      perception: {
        location: perception?.location || { x: 0, y: 0 },
        stats: perception?.stats || {},
        inventory_count: (perception?.inventory || []).filter(Boolean).length,
        nearby_nodes_count: (perception?.nearby_nodes || []).length,
        nearby_monsters_count: (perception?.nearby_monsters || []).length,
        ground_items_count: (perception?.ground_items || []).length
      },
      chain_of_thought: chainOfThought || '',
      action: action || { type: 'IDLE' },
      outcome: outcome || { success: true },
      latency_ms: latencyMs
    };

    // Store in memory buffer & write line to disk
    this.memoryBuffer.push(record);
    try {
      fs.appendFileSync(this.tracesFile, JSON.stringify(record) + '\n', 'utf8');
    } catch (err) {
      console.error('[TraceRecorder Error] Failed to append trace to disk:', err.message);
    }

    return record;
  }

  getRecentTraces(limit = 50) {
    if (this.memoryBuffer.length >= limit) {
      return this.memoryBuffer.slice(-limit);
    }

    if (!fs.existsSync(this.tracesFile)) return [];

    try {
      const lines = fs.readFileSync(this.tracesFile, 'utf8').trim().split('\n').filter(Boolean);
      return lines.slice(-limit).map(line => JSON.parse(line));
    } catch (err) {
      return [];
    }
  }

  getTotalTracesCount() {
    if (!fs.existsSync(this.tracesFile)) return 0;
    try {
      const lines = fs.readFileSync(this.tracesFile, 'utf8').trim().split('\n').filter(Boolean);
      return lines.length;
    } catch (err) {
      return 0;
    }
  }
}
