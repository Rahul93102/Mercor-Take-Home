/**
 * Network Growth Simulation Module
 * 
 * Models how a referral network grows over time with the following parameters:
 * - Initial referrers: 100 active users
 * - Referral capacity: Each user can make up to 10 successful referrals
 * - Time progression: Discrete daily steps
 * - Probabilistic referrals: Each active user has probability p of making a referral each day
 */

export class NetworkGrowthSimulation {
  constructor() {
    this.INITIAL_REFERRERS = 100;
    this.MAX_REFERRALS_PER_USER = 10;
  }

  /**
   * Run simulation for given probability and duration
   * 
   * @param {number} p - Daily probability (0-1) that an active referrer makes a successful referral
   * @param {number} days - Number of days to simulate
   * @returns {Array<number>} - Cumulative expected referrals at end of each day
   */
  simulate(p, days) {
    if (p < 0 || p > 1) {
      throw new Error('Probability must be between 0 and 1');
    }
    if (days < 0 || days > 10000) { // Safeguard against excessive simulation days
      throw new Error('Days must be between 0 and 10000');
    }

    const results = [];
    let activeReferrers = this.INITIAL_REFERRERS;
    let cumulativeReferrals = 0;

    for (let day = 1; day <= days; day++) {
      // Expected referrals for this day
      const expectedDailyReferrals = activeReferrers * p;
      cumulativeReferrals += expectedDailyReferrals;
      
      // Update active referrers for next day
      // Each successful referral reduces a referrer's remaining capacity
      // When capacity reaches 0, referrer becomes inactive
      const referralsToday = expectedDailyReferrals;
      const referrersBecomingInactive = Math.min(
        activeReferrers,
        referralsToday / this.MAX_REFERRALS_PER_USER
      );
      
      // New referrers join (those who were referred become active)
      const newActiveReferrers = referralsToday;
      
      // Update active count: remove exhausted referrers, add new ones
      activeReferrers = Math.max(0, activeReferrers - referrersBecomingInactive + newActiveReferrers);
      
      results.push(cumulativeReferrals);
    }

    return results;
  }

  /**
   * Calculate minimum days to reach a target number of referrals
   * 
   * Uses binary search for efficiency when target is large
   * 
   * @param {number} p - Daily probability of successful referral
   * @param {number} targetTotal - Target cumulative referrals
   * @returns {number} - Minimum number of days needed
   */
  daysToTarget(p, targetTotal) {
    if (p <= 0) {
      return Infinity; // Cannot reach target with zero probability
    }
    if (targetTotal <= 0) {
      return 0;
    }

    // For small targets, use linear search
    if (targetTotal < 1000) {
      return this.linearSearchDays(p, targetTotal);
    }

    // For large targets, use binary search
    return this.binarySearchDays(p, targetTotal);
  }

  /**
   * Linear search for small targets (more precise for low day counts)
   */
  linearSearchDays(p, targetTotal) {
    let day = 1;
    let activeReferrers = this.INITIAL_REFERRERS;
    let cumulativeReferrals = 0;

    while (cumulativeReferrals < targetTotal) {
      const expectedDailyReferrals = activeReferrers * p;
      cumulativeReferrals += expectedDailyReferrals;
      
      if (cumulativeReferrals >= targetTotal) {
        return day;
      }

      // Update active referrers for next day
      const referralsToday = expectedDailyReferrals;
      const referrersBecomingInactive = Math.min(
        activeReferrers,
        referralsToday / this.MAX_REFERRALS_PER_USER
      );
      const newActiveReferrers = referralsToday;
      activeReferrers = Math.max(0, activeReferrers - referrersBecomingInactive + newActiveReferrers);
      
      day++;
      
      // Prevent infinite loops
      if (day > 20000) { // Increased safeguard limit
        return Infinity;
      }
    }

    return day - 1;
  }

  /**
   * Binary search for large targets (more efficient)
   */
  binarySearchDays(p, targetTotal) {
    let low = 1;
    let high = Math.ceil(targetTotal / (this.INITIAL_REFERRERS * p)) + 100;
    
    // Ensure high is actually high enough
    let highSimulation = this.simulate(p, high);
    while (highSimulation[high - 1] < targetTotal) {
      high *= 2;
      if (high > 200000) { // Increased safeguard limit
        return Infinity;
      }
      highSimulation = this.simulate(p, high);
    }

    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      const results = this.simulate(p, mid);
      
      if (results.length > 0 && results[mid - 1] >= targetTotal) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }

    return low;
  }

  /**
   * Get detailed simulation analytics
   * @param {number} p - Daily probability
   * @param {number} days - Simulation duration
   * @returns {Object} - Detailed analytics including growth rate, peak day, etc.
   */
  getSimulationAnalytics(p, days) {
    const dailyResults = this.simulate(p, days);
    
    if (dailyResults.length === 0) {
      return {
        totalReferrals: 0,
        averageDailyGrowth: 0,
        peakGrowthDay: 0,
        peakGrowthRate: 0,
        growthAcceleration: 0
      };
    }

    // Calculate daily growth rates
    const dailyGrowthRates = [];
    for (let i = 1; i < dailyResults.length; i++) {
      dailyGrowthRates.push(dailyResults[i] - dailyResults[i - 1]);
    }

    // Find peak growth day
    let peakGrowthDay = 1;
    let peakGrowthRate = dailyGrowthRates[0] || 0;
    
    for (let i = 0; i < dailyGrowthRates.length; i++) {
      if (dailyGrowthRates[i] > peakGrowthRate) {
        peakGrowthRate = dailyGrowthRates[i];
        peakGrowthDay = i + 2; // +2 because array is 0-indexed and we start from day 2
      }
    }

    // Calculate average daily growth
    const averageDailyGrowth = dailyGrowthRates.length > 0 
      ? dailyGrowthRates.reduce((sum, rate) => sum + rate, 0) / dailyGrowthRates.length
      : 0;

    // Calculate growth acceleration (second derivative)
    const growthAccelerations = [];
    for (let i = 1; i < dailyGrowthRates.length; i++) {
      growthAccelerations.push(dailyGrowthRates[i] - dailyGrowthRates[i - 1]);
    }
    const averageAcceleration = growthAccelerations.length > 0
      ? growthAccelerations.reduce((sum, acc) => sum + acc, 0) / growthAccelerations.length
      : 0;

    return {
      totalReferrals: dailyResults[dailyResults.length - 1],
      dailyResults,
      dailyGrowthRates,
      averageDailyGrowth: parseFloat(averageDailyGrowth.toFixed(2)),
      peakGrowthDay,
      peakGrowthRate: parseFloat(peakGrowthRate.toFixed(2)),
      growthAcceleration: parseFloat(averageAcceleration.toFixed(4))
    };
  }

  /**
   * Compare different probability scenarios
   * @param {Array<number>} probabilities - Array of probabilities to compare
   * @param {number} days - Duration for comparison
   * @returns {Object} - Comparative analysis
   */
  compareScenarios(probabilities, days) {
    const scenarios = probabilities.map(p => {
      const analytics = this.getSimulationAnalytics(p, days);
      return {
        probability: p,
        ...analytics
      };
    });

    return {
      scenarios,
      bestScenario: scenarios.reduce((best, current) => 
        current.totalReferrals > best.totalReferrals ? current : best
      ),
      averageTotalReferrals: scenarios.reduce((sum, s) => sum + s.totalReferrals, 0) / scenarios.length
    };
  }
}
