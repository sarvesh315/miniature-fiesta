import { execSync } from 'child_process';
import chalk from 'chalk';

async function runSecurityGauntlet() {
  console.log(chalk.cyan.bold('\n======================================================'));
  console.log(chalk.cyan.bold('🛡️  STARTING HIGH-PERFORMANCE TIER-1 THREAT PIPELINE  '));
  console.log(chalk.cyan.bold('======================================================\n'));

  const stages = [
    { name: '🧹 Rust-Powered Native SAST Code Linting (Oxlint)', cmd: 'npm run security-lint' },
    { name: '🔍 Supply Chain SCA Dependency Auditing', cmd: 'npm run audit-ci' },
    { name: '🔬 Data Sanitization & Schema Casting Tests', cmd: 'npm run test:integration' },
    { name: '☠️ Anti-CSRF & Brute Force Isolation Controls', cmd: 'npm run test:adversarial' },
    { name: '⚡ Input Fuzzing & OWASP Compliance Audits', cmd: 'npm run test:stability' },
    { name: '⛓️ Ledger Integrity & JWT Cryptographic Scans', cmd: 'npm run test:security' },
    { name: '💥 High-Concurrency Race Conditions & Chaos Faults', cmd: 'npm run test:chaos' }
  ];

  let passedStages = 0;

  for (const stage of stages) {
    console.log(chalk.yellow(`⏳ Executing: ${stage.name}...`));
    try {
      // Run each command synchronously and forward stdio formatting parameters
      execSync(stage.cmd, { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' } });
      console.log(chalk.green(`✅ PASSED: ${stage.name}\n`));
      passedStages++;
} catch {
  console.log(chalk.red(`\n❌ CRITICAL DEFECT OR VULNERABILITY FOUND DURING: ${stage.name}`));

      console.log(chalk.red(`⚠️ Pipeline halted immediately to isolate the security regression.\n`));
      process.exit(1);
    }
  }

  console.log(chalk.green.bold('======================================================'));
  console.log(chalk.green.bold(`🎉 SUCCESS: ALL ${passedStages}/${stages.length} THREAT VECTOR SHIELDS HELD!`));
  console.log(chalk.green.bold('======================================================\n'));
  process.exit(0);
}

runSecurityGauntlet().catch((err) => {
  console.error('Fatal execution error within threat runner:', err);
  process.exit(1);
});