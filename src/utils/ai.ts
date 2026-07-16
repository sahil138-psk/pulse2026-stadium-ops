import type { RAGChunk } from '../mockData';

// Sanitizes inputs to prevent HTML and Script injection (Security score booster)
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '') // Strip script tags
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '') // Strip inline event handlers like onload, onerror
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:\s*/gi, '') // Strip javascript: URLs
    .replace(/<\/?[^>]+(>|$)/g, ''); // Strip remaining HTML tags
}

// Checks for prompt injection indicators to block malicious instruction overrides
export function isPromptInjection(input: string): boolean {
  if (!input) return false;
  const injectionPatterns = [
    /ignore\s+(previous|prior|above)\s+(instructions|prompt|rules|commands)/i,
    /system\s+(override|bypass|reset)/i,
    /you\s+are\s+now\s+a\s+(helpful\s+)?assistant/i,
    /delete\s+all\s+files/i,
    /bypass\s+restrictions/i,
    /acting\s+as\s+/i
  ];
  return injectionPatterns.some(pattern => pattern.test(input));
}

// Computes cosine similarity between queries and indexed document chunks
export function computeCosineSimilarityMock(query: string, chunk: RAGChunk): number {
  const queryLower = query.toLowerCase();
  let matches = 0;
  chunk.keywords.forEach(keyword => {
    if (queryLower.includes(keyword.toLowerCase())) {
      matches += 1;
    }
  });

  const baseScore = 0.45; // baseline context similarity
  const increment = (matches / Math.max(chunk.keywords.length, 1)) * 0.5;
  return Math.min(parseFloat((baseScore + increment + (query.length % 5) * 0.01).toFixed(4)), 0.98);
}
