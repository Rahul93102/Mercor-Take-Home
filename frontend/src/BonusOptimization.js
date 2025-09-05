/**
 * Referral Bonus Optimization Module
 * 
 * Finds the minimum bonus amount required to achieve a hiring target using
 * the network growth simulation with variable adoption probabilities.
 * 
 * Time Complexity Analysis:
 * - Binary search over bonus amounts: O(log(max_bonus))
 * - Each simulation call: O(days) 
 * - Total: O(days * log(max_bonus))
 * 
 * Where max_bonus is determined by the adoption_prob function's range
 */

import { NetworkGrowthSimulation } from './NetworkGrowthSimulation.js';

export class BonusOptimization {
  constructor() {
    this.simulation = new NetworkGrowthSimulation();
  }

  /**
   * Find minimum bonus to achieve target hires within given timeframe
   * 
   * Uses binary search over possible bonus amounts to efficiently find
   * the minimum bonus that achieves the target.
   * 
   * @param {number} days - Timeframe for achieving target
   * @param {number} targetHires - Number of hires needed
   * @param {Function} adoptionProb - Function: bonus -> probability (monotonically increasing)
   * @param {number} eps - Precision threshold for convergence (default 1e-3)
   * @returns {number|null} - Minimum bonus rounded UP to nearest $10, or null if impossible
   */
  minBonusForTarget(days, targetHires, adoptionProb, eps = 1e-3) {
    if (days <= 0 || targetHires <= 0) {
      return null;
    }

    // Find reasonable upper bound for binary search
    const maxBonus = this.findMaxSearchBonus(adoptionProb, targetHires, days);
    if (maxBonus === null) {
      return null; // Target is unachievable
    }

    // Binary search over bonus amounts
    let low = 0;
    let high = maxBonus;
    let bestBonus = null;

    while (high - low > eps) {
      const mid = (low + high) / 2;
      const probability = adoptionProb(mid);
      
      // Run simulation to see if this probability achieves target
      const results = this.simulation.simulate(probability, days);
      const finalHires = results[results.length - 1] || 0;

      if (finalHires >= targetHires) {
        bestBonus = mid;
        high = mid;
      } else {
        low = mid;
      }
    }

    if (bestBonus === null) {
      return null;
    }

    // Round UP to nearest $10
    return Math.ceil(bestBonus / 10) * 10;
  }

  /**
   * Find a reasonable upper bound for bonus search
   * Tests exponentially increasing bonus amounts until target is achievable
   */
  findMaxSearchBonus(adoptionProb, targetHires, days) {
    let testBonus = 10; // Start at $10
    const maxIterations = 20; // Prevent infinite loops

    for (let i = 0; i < maxIterations; i++) {
      const probability = adoptionProb(testBonus);
      
      // If probability is close to 1, we've likely hit the function's max
      if (probability >= 0.99) {
        const results = this.simulation.simulate(probability, days);
        const finalHires = results[results.length - 1] || 0;
        
        if (finalHires >= targetHires) {
          return testBonus;
        } else {
          return null; // Target unachievable even with max probability
        }
      }

      // Test if current bonus achieves target
      const results = this.simulation.simulate(probability, days);
      const finalHires = results[results.length - 1] || 0;
      
      if (finalHires >= targetHires) {
        return testBonus;
      }

      // Exponentially increase test bonus
      testBonus *= 2;
      
      // Safety check for very large bonuses
      if (testBonus > 100000) {
        return null; // Unreasonably high bonus required
      }
    }

    return null;
  }

  /**
   * Analyze bonus sensitivity - how target achievement varies with bonus amount
   * @param {number} days - Timeframe
   * @param {number} targetHires - Target
   * @param {Function} adoptionProb - Adoption probability function
   * @param {number} maxBonus - Maximum bonus to test
   * @param {number} step - Bonus increment for testing
   * @returns {Object} - Sensitivity analysis results
   */
  analyzeBonusSensitivity(days, targetHires, adoptionProb, maxBonus = 1000, step = 10) {
    const results = [];
    const bonusAmounts = [];
    
    for (let bonus = 0; bonus <= maxBonus; bonus += step) {
      const probability = adoptionProb(bonus);
      const simResults = this.simulation.simulate(probability, days);
      const finalHires = simResults[simResults.length - 1] || 0;
      
      results.push({
        bonus,
        probability: parseFloat(probability.toFixed(4)),
        expectedHires: parseFloat(finalHires.toFixed(2)),
        achievesTarget: finalHires >= targetHires,
        efficiency: bonus > 0 ? parseFloat((finalHires / bonus).toFixed(4)) : 0
      });
      
      bonusAmounts.push(bonus);
    }

    // Find optimal bonus (minimum that achieves target)
    const optimalResult = results.find(r => r.achievesTarget);
    
    // Calculate cost-effectiveness metrics
    const maxEfficiency = Math.max(...results.map(r => r.efficiency));
    const mostEfficientBonus = results.find(r => r.efficiency === maxEfficiency);

    return {
      results,
      optimalBonus: optimalResult?.bonus || null,
      mostEfficientBonus: mostEfficientBonus?.bonus || null,
      maxEfficiency,
      targetAchievable: optimalResult !== undefined
    };
  }

  /**
   * Generate bonus recommendation with business insights
   * @param {number} days - Timeframe
   * @param {number} targetHires - Target
   * @param {Function} adoptionProb - Adoption function
   * @param {number} eps - Precision
   * @returns {Object} - Comprehensive recommendation
   */
  getBonusRecommendation(days, targetHires, adoptionProb, eps = 1e-3) {
    const minBonus = this.minBonusForTarget(days, targetHires, adoptionProb, eps);
    
    if (minBonus === null) {
      return {
        recommendation: null,
        achievable: false,
        reason: "Target is not achievable within the given timeframe with any reasonable bonus amount.",
        alternatives: {
          extendTimeframe: `Consider extending the timeframe beyond ${days} days`,
          reduceTarget: `Consider reducing the target below ${targetHires} hires`,
          improveProcess: "Consider improving the referral process efficiency"
        }
      };
    }

    // Analyze nearby bonus amounts for insights
    const testBonuses = [minBonus - 20, minBonus - 10, minBonus, minBonus + 10, minBonus + 20]
      .filter(b => b >= 0);
    
    const bonusAnalysis = testBonuses.map(bonus => {
      const prob = adoptionProb(bonus);
      const results = this.simulation.simulate(prob, days);
      const expectedHires = results[results.length - 1] || 0;
      
      return {
        bonus,
        probability: prob,
        expectedHires: parseFloat(expectedHires.toFixed(2)),
        surplusHires: parseFloat((expectedHires - targetHires).toFixed(2))
      };
    });

    return {
      recommendation: minBonus,
      achievable: true,
      confidence: this.calculateConfidence(minBonus, adoptionProb, days, targetHires),
      bonusAnalysis,
      businessInsights: {
        dailyBudget: parseFloat((minBonus * adoptionProb(minBonus) * 100).toFixed(2)),
        expectedHires: bonusAnalysis.find(b => b.bonus === minBonus)?.expectedHires,
        probabilityOfSuccess: parseFloat((adoptionProb(minBonus) * 100).toFixed(1)) + '%',
        costPerHire: parseFloat((minBonus / (bonusAnalysis.find(b => b.bonus === minBonus)?.expectedHires || 1) * 100).toFixed(2))
      }
    };
  }

  /**
   * Calculate confidence level in the recommendation
   */
  calculateConfidence(bonus, adoptionProb, days, target) {
    const prob = adoptionProb(bonus);
    const results = this.simulation.simulate(prob, days);
    const expectedHires = results[results.length - 1] || 0;
    
    // Higher confidence if we exceed target by a reasonable margin
    const margin = (expectedHires - target) / target;
    
    if (margin > 0.2) return "High";
    if (margin > 0.1) return "Medium";
    if (margin > 0.05) return "Low";
    return "Very Low";
  }
}
