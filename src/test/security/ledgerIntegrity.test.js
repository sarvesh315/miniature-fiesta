import { describe, test, expect } from 'vitest';
import crypto from 'crypto';

// Minimal implementation of a sequential hashing ledger loop for validation
function calculateBlockHash(block, parentHash) {
  const payload = `${block.id}-${block.action}-${block.data}-${parentHash}`;
  return crypto.createHmac('sha256', 'ledger_secret_key').update(payload).digest('hex');
}

function verifyChainIntegrity(ledger) {
  for (let i = 0; i < ledger.length; i++) {
    const currentBlock = ledger[i];
    const expectedParentHash = i === 0 ? '0000000000000000' : ledger[i - 1].currentHash;
    
    if (currentBlock.parentHash !== expectedParentHash) return false;
    
    const verifiedHash = calculateBlockHash(currentBlock, expectedParentHash);
    if (currentBlock.currentHash !== verifiedHash) return false;
  }
  return true;
}

describe('⛓️ Security: Cryptographic Audit Ledger Integrity Verification', () => {
  test('✅ Should pass validation with un-tampered chronological events', () => {
    const block1 = { id: 1, action: 'CREATE', data: 'user_01', parentHash: '0000000000000000' };
    block1.currentHash = calculateBlockHash(block1, '0000000000000000');

    const block2 = { id: 2, action: 'UPDATE', data: 'user_01', parentHash: block1.currentHash };
    block2.currentHash = calculateBlockHash(block2, block1.currentHash);

    const ledger = [block1, block2];
    expect(verifyChainIntegrity(ledger)).toBe(true);
  });

  test('🚨 Should drop validation if a historical ledger record is maliciously modified', () => {
    const block1 = { id: 1, action: 'CREATE', data: 'user_01', parentHash: '0000000000000000' };
    block1.currentHash = calculateBlockHash(block1, '0000000000000000');

    const block2 = { id: 2, action: 'UPDATE', data: 'user_01', parentHash: block1.currentHash };
    block2.currentHash = calculateBlockHash(block2, block1.currentHash);

    const ledger = [block1, block2];

    // Attacker modifies an historical row in place directly inside database rows
    ledger[0].action = 'MALICIOUS_TAMPER';

    expect(verifyChainIntegrity(ledger)).toBe(false);
  });
});