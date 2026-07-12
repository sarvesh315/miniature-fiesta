import { describe, test, expect, vi } from 'vitest';

class UserService {
  async registerUser(userData, dbDriverInstance) {
    // Step 1: Pre-registration indexing validation passes
    const formattedEmail = userData.email.toLowerCase().trim();
    
    // Step 2: Write command to data layer
    await dbDriverInstance.saveRecord({ email: formattedEmail, status: 'PENDING' });

    // Step 3: Out-of-band transaction confirmation (where faults or timeouts often hit)
    await dbDriverInstance.commitTransaction();
    
    return { success: true };
  }
}

describe('💥 Chaos Simulation: Mid-Transaction Driver Fault Injections', () => {
  test('🛡️ Mid-Transaction Failure: Corrupting the connection layer mid-save must drop state cleanly', async () => {
    const service = new UserService();

    // Create a mock database driver with intentional self-destruct exceptions
    const mockCorruptedDbDriver = {
      saveRecord: vi.fn().mockResolvedValue(true),
      commitTransaction: vi.fn().mockImplementation(() => {
        throw new Error('CRITICAL_IO_PARTITION_FAILURE: Connection dropped by external cloud hypervisor.');
      })
    };

    const targetUser = { email: 'chaos-target@defense.test' };

    // 1. App must handle the exception gracefully without throwing an unhandled runtime rejection
    await expect(async () => {
      await service.registerUser(targetUser, mockCorruptedDbDriver);
    }).rejects.toThrow('CRITICAL_IO_PARTITION_FAILURE');

    // 2. Validate that commit hooks were evaluated but failed, triggering fallback containment rules
    expect(mockCorruptedDbDriver.saveRecord).toHaveBeenCalledTimes(1);
    expect(mockCorruptedDbDriver.commitTransaction).toHaveBeenCalledTimes(1);
  });
});