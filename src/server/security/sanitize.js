/**
 * Security & Sanitization Layer
 * Protects against XSS, HTML injection, and AI prompt injection attacks.
 */

const PROMPT_INJECTION_PATTERNS = [
  /system\s*:/i,
  /assistant\s*:/i,
  /human\s*:/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[inst\]/i,
  /\[\/inst\]/i,
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /disregard\s+all\s+/i,
  /output\s+the\s+system\s+prompt/i,
  /reveal\s+your\s+instructions/i
];

/**
 * Strips HTML special characters to prevent XSS.
 */
export function sanitizeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes chat messages and text inputs for both human and LLM consumption.
 * Normalizes Unicode, removes control characters, and neutralizes prompt-injection payloads.
 */
export function sanitizeChat(text, maxLength = 140) {
  if (typeof text !== 'string') return '';
  
  // Normalize Unicode and strip control characters
  let clean = text.normalize('NFKC').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Truncate to maximum length
  clean = clean.substring(0, maxLength).trim();
  
  // Neutralize prompt-injection attack strings
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    clean = clean.replace(pattern, '[REDACTED_PROMPT]');
  }
  
  return sanitizeHtml(clean);
}

/**
 * Sanitizes username and handles
 */
export function sanitizeUsername(name) {
  if (typeof name !== 'string') return 'Adventurer';
  return name.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().substring(0, 20) || 'Adventurer';
}
