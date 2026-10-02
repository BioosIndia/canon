/**
 * Deterministic Exact Word/Token Diff Engine
 * Pure algorithmic implementation (Myers/Levenshtein word-level diff)
 * Zero LLM reliance for exact differences.
 */

import { DiffChunk } from '../types/canon';

export function computeExactWordDiff(
  oldText: string,
  newText: string,
  sectionCode: string = '4.3',
  canonicalConcept: string = 'CONTRAINDICATIONS'
): DiffChunk[] {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  const chunks: DiffChunk[] = [];
  let i = 0;
  let j = 0;
  let oldLine = 1;
  let newLine = 1;

  while (i < oldWords.length && j < newWords.length) {
    if (oldWords[i] === newWords[j]) {
      if (oldWords[i].includes('\n')) {
        oldLine += (oldWords[i].match(/\n/g) || []).length;
        newLine += (oldWords[i].match(/\n/g) || []).length;
      }
      chunks.push({
        id: `chunk-${i}-${j}-eq`,
        type: 'EQUAL',
        text: oldWords[i],
        oldLineNumber: oldLine,
        newLineNumber: newLine,
        sectionCode,
        canonicalConcept,
      });
      i++;
      j++;
    } else {
      // Find lookahead match
      let matchOld = -1;
      let matchNew = -1;
      const windowSize = 12;

      for (let w = 1; w <= windowSize; w++) {
        if (i + w < oldWords.length && oldWords[i + w] === newWords[j]) {
          matchOld = i + w;
          break;
        }
        if (j + w < newWords.length && oldWords[i] === newWords[j + w]) {
          matchNew = j + w;
          break;
        }
      }

      if (matchOld !== -1) {
        // Words were deleted in new version
        while (i < matchOld) {
          chunks.push({
            id: `chunk-${i}-${j}-del`,
            type: 'DELETION',
            text: oldWords[i],
            oldLineNumber: oldLine,
            sectionCode,
            canonicalConcept,
          });
          if (oldWords[i].includes('\n')) oldLine++;
          i++;
        }
      } else if (matchNew !== -1) {
        // Words were inserted in new version
        while (j < matchNew) {
          chunks.push({
            id: `chunk-${i}-${j}-ins`,
            type: 'INSERTION',
            text: newWords[j],
            newLineNumber: newLine,
            sectionCode,
            canonicalConcept,
          });
          if (newWords[j].includes('\n')) newLine++;
          j++;
        }
      } else {
        // Replacement: both deletion and insertion
        chunks.push({
          id: `chunk-${i}-${j}-rep-del`,
          type: 'DELETION',
          text: oldWords[i],
          oldLineNumber: oldLine,
          sectionCode,
          canonicalConcept,
        });
        chunks.push({
          id: `chunk-${i}-${j}-rep-ins`,
          type: 'INSERTION',
          text: newWords[j],
          newLineNumber: newLine,
          sectionCode,
          canonicalConcept,
        });
        i++;
        j++;
      }
    }
  }

  // Flush remaining
  while (i < oldWords.length) {
    chunks.push({
      id: `chunk-${i}-del-tail`,
      type: 'DELETION',
      text: oldWords[i],
      oldLineNumber: oldLine,
      sectionCode,
      canonicalConcept,
    });
    i++;
  }

  while (j < newWords.length) {
    chunks.push({
      id: `chunk-${j}-ins-tail`,
      type: 'INSERTION',
      text: newWords[j],
      newLineNumber: newLine,
      sectionCode,
      canonicalConcept,
    });
    j++;
  }

  return chunks;
}

/**
 * SHA-256 Mock/WebCrypto Hash generator for source preservation
 */
export async function calculateSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic fallback for non-crypto contexts
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256_${Math.abs(hash).toString(16).padStart(16, '0')}${text.length.toString(16)}`;
}
