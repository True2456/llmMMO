/**
 * PRIMA: Age of Bronze - Deduplicated GitHub Dataset & Trace Exporter
 * Appends new agentic trajectories & Chain-of-Thought reasoning directly into GitHub repository,
 * commits and pushes periodically with zero duplicate entries.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export class GitTraceExporter {
  constructor(options = {}) {
    this.tracesFile = options.tracesFile || path.resolve('data/agent_traces.jsonl');
    this.repoTracesFile = options.repoTracesFile || path.resolve('traces/dataset_agent_cot.jsonl');
    this.ledgerFile = options.ledgerFile || path.resolve('data/exported_traces_ledger.json');
    this.exportedSet = new Set();
    this.ensureDirs();
    this.loadLedger();
  }

  ensureDirs() {
    const dir = path.dirname(this.repoTracesFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ledgerDir = path.dirname(this.ledgerFile);
    if (!fs.existsSync(ledgerDir)) fs.mkdirSync(ledgerDir, { recursive: true });
  }

  loadLedger() {
    try {
      if (fs.existsSync(this.ledgerFile)) {
        const raw = fs.readFileSync(this.ledgerFile, 'utf8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          this.exportedSet = new Set(data);
        }
      }
    } catch (err) {
      this.exportedSet = new Set();
    }
  }

  saveLedger() {
    try {
      fs.writeFileSync(this.ledgerFile, JSON.stringify(Array.from(this.exportedSet), null, 2), 'utf8');
    } catch (err) {
      console.error('[Git Exporter Error] Failed to save ledger:', err.message);
    }
  }

  getUncommittedTraces() {
    if (!fs.existsSync(this.tracesFile)) return [];

    try {
      const lines = fs.readFileSync(this.tracesFile, 'utf8').trim().split('\n').filter(Boolean);
      const uncommitted = [];

      for (const line of lines) {
        const record = JSON.parse(line);
        if (record.trace_id && !this.exportedSet.has(record.trace_id)) {
          uncommitted.push(record);
        }
      }

      return uncommitted;
    } catch (err) {
      console.error('[Git Exporter Error] Failed to read local traces:', err.message);
      return [];
    }
  }

  async exportAndCommitToGit({ autoPush = true, dryRun = false } = {}) {
    const uncommitted = this.getUncommittedTraces();

    if (uncommitted.length === 0) {
      return {
        success: true,
        message: 'No new traces to export (0 uncommitted records).',
        newTracesCount: 0,
        totalDatasetSize: this.exportedSet.size
      };
    }

    console.log(`[Git Exporter] Appending ${uncommitted.length} new deduplicated traces to ${this.repoTracesFile}...`);

    // 1. Append formatted JSONL records to git-tracked traces file
    const content = uncommitted.map(r => JSON.stringify(r)).join('\n') + '\n';
    fs.appendFileSync(this.repoTracesFile, content, 'utf8');

    // 2. Update watermark ledger
    for (const record of uncommitted) {
      this.exportedSet.add(record.trace_id);
    }
    this.saveLedger();

    if (dryRun) {
      return {
        success: true,
        mode: 'DRY_RUN',
        newTracesCount: uncommitted.length,
        totalDatasetSize: this.exportedSet.size
      };
    }

    // 3. Git commit & push
    return new Promise((resolve) => {
      const commitMsg = `Telemetry: Append ${uncommitted.length} new agent CoT traces (Total: ${this.exportedSet.size})`;
      const cmd = autoPush
        ? `git add "${this.repoTracesFile}" && git commit -m "${commitMsg}" && git push origin main`
        : `git add "${this.repoTracesFile}" && git commit -m "${commitMsg}"`;

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.warn('[Git Exporter] Git commit/push warning:', err.message);
          resolve({
            success: false,
            error: err.message,
            newTracesCount: uncommitted.length,
            totalDatasetSize: this.exportedSet.size
          });
        } else {
          console.log(`✅ [Git Exporter] Committed & pushed ${uncommitted.length} new traces to GitHub!`);
          resolve({
            success: true,
            newTracesCount: uncommitted.length,
            totalDatasetSize: this.exportedSet.size,
            commitMessage: commitMsg
          });
        }
      });
    });
  }
}
