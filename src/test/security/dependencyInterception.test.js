import { describe, test, expect } from 'vitest';

// Safe cloning recursive iterator utility example
function safeJsonParseAndCast(rawInputJson) {
  const parsed = JSON.parse(rawInputJson);
  const target = {};

  for (const key in parsed) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      // DEFENSE: Block object constructor modifiers from mutating the base context parameters
      if (key === '__proto__' || key === 'constructor') continue;
      target[key] = parsed[key];
    }
  }
  return target;
}

describe('☣️ Security: Prototype Pollution Obstruction Checks', () => {
  test('🛡️ Object properties must not pollute global Javascript prototype attributes', () => {
    const maliciousPayload = '{"name":"Safe Text Content","__proto__":{"isSystemAdminRole":true}}';
    
    const outcome = safeJsonParseAndCast(maliciousPayload);
    
    // Ensure the output contains the safe data block
    expect(outcome.name).toBe('Safe Text Content');
    expect(outcome.__proto__.isSystemAdminRole).toBeUndefined();

    // CRITICAL GLOBAL ASSERTION: Verify base javascript literals remain pristine across the server instance
    const cleanLiteralSandbox = {};
    expect(cleanLiteralSandbox.isSystemAdminRole).toBeUndefined();
  });
});