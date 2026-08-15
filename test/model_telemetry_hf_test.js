/**
 * Test Suite: Model Evaluator, Trace Recorder & Deduplicated Hugging Face Exporter
 */

import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

import { ModelEvaluator } from '../src/server/telemetry/modelEvaluator.js';
import { TraceRecorder } from '../src/server/telemetry/traceRecorder.js';
import { HuggingFaceExporter } from '../src/server/telemetry/huggingfaceExporter.js';
import { GitTraceExporter } from '../src/server/telemetry/gitTraceExporter.js';

const TEST_DIR = path.resolve('test/temp_telemetry');
const TEST_TRACES = path.join(TEST_DIR, 'test_traces.jsonl');
const TEST_LEDGER = path.join(TEST_DIR, 'test_ledger.json');

test('1. ModelEvaluator tracks metrics and computes composite benchmark scores', () => {
  const evaluator = new ModelEvaluator();
  const modelA = 'poolside/laguna-s-2.1:free';
  const modelB = 'nvidia/nemotron-3.5-lightning:free';

  // Record stats for Model A
  evaluator.recordDecision(modelA, 120);
  evaluator.recordDecision(modelA, 180);
  evaluator.recordXpGain(modelA, 'mining', 150);
  evaluator.recordGather(modelA, 5);
  evaluator.recordCraft(modelA, 2);
  evaluator.recordCombat(modelA, 10, 2, true); // 1 kill, 10 damage

  // Record stats for Model B
  evaluator.recordDecision(modelB, 90);
  evaluator.recordXpGain(modelB, 'hunting', 80);
  evaluator.recordCombat(modelB, 6, 12, false);
  evaluator.recordDeath(modelB);

  const leaderboard = evaluator.getLeaderboard();
  assert.strictEqual(leaderboard.length, 2, 'Leaderboard contains both models');

  const topModel = leaderboard[0];
  assert.strictEqual(topModel.modelId, modelA, 'Model A has higher score');
  assert.strictEqual(topModel.totalXpGained, 150);
  assert.strictEqual(topModel.resourcesGathered, 5);
  assert.strictEqual(topModel.itemsCrafted, 2);
  assert.strictEqual(topModel.monstersDefeated, 1);
  assert.strictEqual(topModel.avgLatencyMs, 150);
  assert.ok(topModel.compositeScore > 0, 'Composite score is positive');
});

test('2. TraceRecorder generates deterministic trace IDs and persists JSONL format', () => {
  if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });

  const recorder = new TraceRecorder({ tracesFile: TEST_TRACES });

  const step1 = recorder.recordStep({
    modelId: 'poolside/laguna-s-2.1:free',
    agentName: 'Gorak_The_Flint',
    badge: 'Laguna-S1',
    role: 'MINER_SMITH',
    perception: {
      location: { x: 90, y: 132 },
      stats: { hp: 10, maxHp: 10 },
      inventory: [{ id: 'ore_copper' }],
      nearby_nodes: [{ id: 'node_copper_1', name: 'Native Copper Boulder' }]
    },
    chainOfThought: 'I see a copper boulder nearby. Walking over to mine it.',
    action: { type: 'INTERACT_RESOURCE', nodeId: 'node_copper_1' },
    outcome: { success: true, xpGained: 20 },
    latencyMs: 140
  });

  assert.ok(step1.trace_id, 'Trace ID is generated');
  assert.strictEqual(typeof step1.trace_id, 'string');
  assert.strictEqual(step1.trace_id.length, 64, 'SHA-256 hash length is 64 hex chars');
  assert.strictEqual(step1.chain_of_thought, 'I see a copper boulder nearby. Walking over to mine it.');
  assert.strictEqual(recorder.getTotalTracesCount(), 1, 'Total traces count is 1');

  // Record a second step
  recorder.recordStep({
    modelId: 'poolside/laguna-s-2.1:free',
    agentName: 'Gorak_The_Flint',
    badge: 'Laguna-S1',
    perception: { location: { x: 91, y: 132 } },
    chainOfThought: 'Smelting bronze at the crucible.',
    action: { type: 'CRAFT_SMELT' },
    outcome: { success: true, xpGained: 40 }
  });

  assert.strictEqual(recorder.getTotalTracesCount(), 2, 'Total traces count is 2');
  const recent = recorder.getRecentTraces(10);
  assert.strictEqual(recent.length, 2);
  assert.strictEqual(recent[1].action.type, 'CRAFT_SMELT');
});

test('3. HuggingFaceExporter deduplicates traces and enforces ledger watermarks', async () => {
  const exporter = new HuggingFaceExporter({
    tracesFile: TEST_TRACES,
    ledgerFile: TEST_LEDGER
  });

  // Check unexported traces
  const unexported = exporter.getUnexportedTraces();
  assert.strictEqual(unexported.length, 2, 'Found 2 unexported traces');

  // Export First Batch (Simulated Dry Run)
  const res1 = await exporter.exportBatch({ dryRun: true });
  assert.strictEqual(res1.success, true);
  assert.strictEqual(res1.exportedCount, 2, 'Exported 2 traces');
  assert.strictEqual(res1.totalExportedSoFar, 2, 'Ledger now tracks 2 traces');

  // Immediate Second Export -> MUST BE 0 (NO DUPLICATES)
  const res2 = await exporter.exportBatch({ dryRun: true });
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.exportedCount, 0, 'Zero duplicate traces exported on 2nd run');
  assert.strictEqual(res2.totalExportedSoFar, 2, 'Ledger count preserved');

  // Add 1 more trace
  const recorder = new TraceRecorder({ tracesFile: TEST_TRACES });
  recorder.recordStep({
    modelId: 'poolside/laguna-s-2.1:free',
    agentName: 'Gorak_The_Flint',
    chainOfThought: 'Depositing ingots into tribal stash.',
    action: { type: 'DEPOSIT_STASH' }
  });

  // Third Export -> Exactly 1 new trace
  const res3 = await exporter.exportBatch({ dryRun: true });
  assert.strictEqual(res3.exportedCount, 1, 'Only newly added trace was exported');
  assert.strictEqual(res3.totalExportedSoFar, 3, 'Ledger updated to 3');
});

test('4. GitTraceExporter deduplicates and appends traces into Git dataset', async () => {
  const TEST_GIT_TRACES = path.join(TEST_DIR, 'git_dataset.jsonl');
  const TEST_GIT_LEDGER = path.join(TEST_DIR, 'git_ledger.json');

  const gitExporter = new GitTraceExporter({
    tracesFile: TEST_TRACES,
    repoTracesFile: TEST_GIT_TRACES,
    ledgerFile: TEST_GIT_LEDGER
  });

  const uncommitted = gitExporter.getUncommittedTraces();
  assert.strictEqual(uncommitted.length, 3, '3 uncommitted traces found');

  const res1 = await gitExporter.exportAndCommitToGit({ dryRun: true });
  assert.strictEqual(res1.success, true);
  assert.strictEqual(res1.newTracesCount, 3, 'Appended 3 traces to Git dataset');
  assert.strictEqual(res1.totalDatasetSize, 3);

  // Subsequent export has 0 new traces
  const res2 = await gitExporter.exportAndCommitToGit({ dryRun: true });
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.newTracesCount, 0, 'Zero duplicate traces added on 2nd export');

  // Clean up
  if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
});

