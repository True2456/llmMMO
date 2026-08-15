/**
 * PRIMA: Age of Bronze - Deduplicated Hugging Face Dataset Exporter
 * Streams agentic traces + Chain-of-Thought datasets to Hugging Face Hub with zero duplicate uploads.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

export class HuggingFaceExporter {
  constructor(options = {}) {
    this.tracesFile = options.tracesFile || path.resolve('data/agent_traces.jsonl');
    this.ledgerFile = options.ledgerFile || path.resolve('data/exported_traces_ledger.json');
    this.hfToken = options.hfToken || process.env.HF_TOKEN || '';
    this.datasetRepo = options.datasetRepo || process.env.HF_DATASET_REPO || '';
    this.exportedSet = new Set();
    this.loadLedger();
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
      console.warn('[HF Exporter] Warning: Could not read ledger, starting fresh.', err.message);
      this.exportedSet = new Set();
    }
  }

  saveLedger() {
    try {
      const dir = path.dirname(this.ledgerFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.ledgerFile, JSON.stringify(Array.from(this.exportedSet), null, 2), 'utf8');
    } catch (err) {
      console.error('[HF Exporter Error] Failed to persist export ledger:', err.message);
    }
  }

  getUnexportedTraces() {
    if (!fs.existsSync(this.tracesFile)) return [];

    try {
      const lines = fs.readFileSync(this.tracesFile, 'utf8').trim().split('\n').filter(Boolean);
      const unexported = [];

      for (const line of lines) {
        const record = JSON.parse(line);
        if (record.trace_id && !this.exportedSet.has(record.trace_id)) {
          unexported.push(record);
        }
      }

      return unexported;
    } catch (err) {
      console.error('[HF Exporter Error] Failed to read traces:', err.message);
      return [];
    }
  }

  async exportBatch({ repo = this.datasetRepo, token = this.hfToken, dryRun = false } = {}) {
    const unexported = this.getUnexportedTraces();

    if (unexported.length === 0) {
      return {
        success: true,
        message: 'No new traces to export (0 uncommitted records).',
        exportedCount: 0,
        totalExportedSoFar: this.exportedSet.size
      };
    }

    console.log(`[HF Exporter] Preparing batch of ${unexported.length} new deduplicated traces for ${repo || '(dry-run)'}...`);

    const jsonlContent = unexported.map(r => JSON.stringify(r)).join('\n') + '\n';
    const batchId = `batch_${Date.now()}`;
    const targetFileName = `data/traces_${batchId}.jsonl`;

    if (dryRun || !token || !repo) {
      // Local simulation / dry-run
      for (const record of unexported) {
        this.exportedSet.add(record.trace_id);
      }
      this.saveLedger();

      return {
        success: true,
        mode: dryRun ? 'DRY_RUN' : 'NO_CREDENTIALS_SIMULATED',
        exportedCount: unexported.length,
        totalExportedSoFar: this.exportedSet.size,
        batchId,
        previewSample: unexported[0]
      };
    }

    // Live HTTP upload to Hugging Face Hub
    const uploadResult = await this.uploadToHuggingFaceHub(repo, targetFileName, jsonlContent, token);

    if (uploadResult.success) {
      for (const record of unexported) {
        this.exportedSet.add(record.trace_id);
      }
      this.saveLedger();
    }

    return {
      ...uploadResult,
      exportedCount: unexported.length,
      totalExportedSoFar: this.exportedSet.size,
      batchId
    };
  }

  uploadToHuggingFaceHub(repoId, remotePath, fileContent, token) {
    return new Promise((resolve) => {
      const url = `https://huggingface.co/api/datasets/${repoId}/upload/main/${remotePath}`;
      const parsedUrl = new URL(url);

      const req = https.request({
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': Buffer.byteLength(fileContent)
        },
        timeout: 15000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, message: `Successfully committed ${remotePath} to HF Hub.` });
          } else {
            resolve({
              success: false,
              statusCode: res.statusCode,
              error: body || `Hugging Face API returned HTTP ${res.statusCode}`
            });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Hugging Face API request timed out.' });
      });

      req.write(fileContent);
      req.end();
    });
  }
}
