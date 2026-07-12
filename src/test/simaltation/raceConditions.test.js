import { describe, test, expect } from 'vitest';

// Simulates an isolated banking or token ledger state engine with an atomic update block
class AccountLedger {
  constructor(initialBalance) {
    this.balance = initialBalance;
    this.isProcessing = false;
  }

  // High-performance state update utilizing transactional lock tracking
  async withdrawTokenAtomic(amount) {
    // Simulated microsecond network latency block
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5));

    // CRITICAL DEFENSE: If a parallel processing thread holds the lock, reject concurrent mutations
    if (this.isProcessing) {
      return { success: false, reason: 'CONCURRENT_MUTATION_LOCK_BLOCKED' };
    }

    this.isProcessing = true;

    if (this.balance >= amount) {
      this.balance -= amount;
      this.isProcessing = false;
      return { success: true, remainingBalance: this.balance };
    }

    this.isProcessing = false;
    return { success: false, reason: 'INSUFFICIENT_FUNDS' };
  }
}

describe('⚡ Chaos Simulation: Multi-Threaded Balance Race Conditions', () => {
  test('🛡️ Parallel Request Explosion: Only exactly one validation thread can pass', async () => {
    const targetAccount = new AccountLedger(100); // Has enough tokens for exactly one deduction
    const concurrentRequestsCount = 50;
    const executionPool = [];

    // Fire 50 asynchronous withdrawal requests into the lifecycle pipeline simultaneously
    for (let i = 0; i < concurrentRequestsCount; i++) {
      executionPool.push(targetAccount.withdrawTokenAtomic(100));
    }

    // Resolve the entire request pool concurrently
    const outcomes = await Promise.all(executionPool);

    const successfulTransactions = outcomes.filter(res => res.success === true);
    const rejectedTransactions = outcomes.filter(res => res.success === false);

    // CRITICAL SECURITY ASSERTION: Balance can only be drained once; remaining 49 threads must be safely drop-blocked
    expect(successfulTransactions).toHaveLength(1);
    expect(rejectedTransactions).toHaveLength(49);
    expect(targetAccount.balance).toBe(0);
  });
});