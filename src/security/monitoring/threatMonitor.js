import SecurityEvent from '../../models/SecurityEvent.js';

export const runThreatAnalysisSummary = async (timeframeMs = 3600000) => {
  const cutoff = new Date(Date.now() - timeframeMs);
  const criticalEventCount = await SecurityEvent.countDocuments({
    severity: { $in: ['high', 'critical'] },
    createdAt: { $gte: cutoff }
  });

  return {
    recentThreatVolume: criticalEventCount,
    actionRequired: criticalEventCount > 5
  };
};