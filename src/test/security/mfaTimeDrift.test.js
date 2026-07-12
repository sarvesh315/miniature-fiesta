import { describe, test, expect } from 'vitest';

function validateOtpWindow(userOtp, actualRecord, currentTimeMs) {
  const driftWindowMs = 30 * 1000; // Allow a 30-second window before or after creation
  const expiryWindowMs = 5 * 60 * 1000; // Total 5-minute lifecycle

  if (userOtp !== actualRecord.code) return false;
  
  const timeDifference = Math.abs(currentTimeMs - actualRecord.createdAtMs);
  
  // Check if code falls within the acceptable window or has completely expired
  if (currentTimeMs > actualRecord.createdAtMs + expiryWindowMs) return false;
  
  return timeDifference <= (expiryWindowMs + driftWindowMs);
}

describe('⏱️ Security: MFA Window Boundary Verification and Time Skews', () => {
  const baseTime = Date.now();
  const mockOtpRecord = { code: '123456', createdAtMs: baseTime };

  test('✅ Should accept codes submitted within an acceptable latency window', () => {
    const normalTransitTime = baseTime + 15 * 1000; // Client sends code 15 seconds late
    expect(validateOtpWindow('123456', mockOtpRecord, normalTransitTime)).toBe(true);
  });

  test('❌ Should drop validation attempts targeting heavily expired windows', () => {
    const expiredTime = baseTime + (6 * 60 * 1000); // 6 minutes later
    expect(validateOtpWindow('123456', mockOtpRecord, expiredTime)).toBe(false);
  });
});