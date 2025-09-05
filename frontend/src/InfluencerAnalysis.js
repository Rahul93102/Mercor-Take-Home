/**
 * Influencer Analysis Module
 * 
 * This module implements sophisticated metrics for identifying influential users:
 * 1. Unique Reach Expansion (greedy set cover algorithm)
 * 2. Flow Centrality (betweenness-based broker identification)
 */

import { NetworkAnalysis } from './NetworkAnalysis.js';

export class InfluencerAnalysis extends NetworkAnalysis {
  constructor() {
    super();
    this.reachCache = new Map(); // Cache for reach sets to improve performance
    this.distanceCache = new Map(); // Cache for all-pairs shortest path
  }

  /**
   * METRIC 1: Unique Reach Expansion
   * 
   * Uses a greedy algorithm to find referrers who collectively cover the maximum
   * number of unique candidates with minimal overlap.
   * 
   * Business Use Case: Optimal influencer selection for marketing campaigns
   * where you want maximum unique audience reach with minimal budget.
   * 
   * @param {number} maxReferrers - Maximum number of referrers to select
   * @returns {Array} - Selected referrers with their unique contribution
   */
  calculateUniqueReachExpansion(maxReferrers = 10) {
    // Use cache if available
    if (this.reachCache.size > 0) {
      // This is a simplified check; in a real app, you'd invalidate cache on network change
      console.log("Using cached reach sets for expansion calculation.");
    }

    // Pre-compute reach sets for all users with referrals
    const userReachSets = new Map();
    const activeReferrers = [];

    for (const userId of this.users) {
      const reachSet = this.getReachSet(userId);
      if (reachSet.size > 0) {
        userReachSets.set(userId, reachSet);
        activeReferrers.push(userId);
      }
    }

    const selectedReferrers = [];
    const globalCoveredSet = new Set();

    // Greedy selection algorithm
    for (let i = 0; i < maxReferrers && activeReferrers.length > 0; i++) {
      let bestReferrer = null;
      let bestNewCoverage = 0;
      let bestNewUsers = new Set();

      // Find referrer that adds the most new unique users
      for (const referrer of activeReferrers) {
        const reachSet = userReachSets.get(referrer);
        const newUsers = new Set([...reachSet].filter(user => !globalCoveredSet.has(user)));
        
        if (newUsers.size > bestNewCoverage) {
          bestNewCoverage = newUsers.size;
          bestReferrer = referrer;
          bestNewUsers = newUsers;
        }
      }

      // If no referrer adds new coverage, break
      if (bestNewCoverage === 0) break;

      // Add best referrer to selection
      selectedReferrers.push({
        userId: bestReferrer,
        uniqueContribution: bestNewCoverage,
        totalReach: userReachSets.get(bestReferrer).size,
        newUsersCovered: Array.from(bestNewUsers)
      });

      // Update global coverage and remove selected referrer
      for (const user of bestNewUsers) {
        globalCoveredSet.add(user);
      }
      activeReferrers.splice(activeReferrers.indexOf(bestReferrer), 1);
    }

    return {
      selectedReferrers,
      totalUniqueCoverage: globalCoveredSet.size,
      efficiency: selectedReferrers.length > 0 ? 
        globalCoveredSet.size / selectedReferrers.length : 0
    };
  }

  /**
   * METRIC 2: Flow Centrality (Betweenness Centrality)
   * 
   * Identifies users who act as critical "brokers" in the network by lying
   * on the shortest paths between many pairs of users.
   * 
   * Business Use Case: Identifying key connectors whose departure would
   * fragment the network or reduce information flow efficiency.
   * 
   * @param {number} topK - Number of top brokers to return
   * @returns {Array} - Users ranked by their flow centrality score
   */
  calculateFlowCentrality(topK = 10) {
    const centralityScores = new Map();
    const allUsers = Array.from(this.users);

    // Initialize scores
    for (const user of allUsers) {
      centralityScores.set(user, 0);
    }

    // Pre-compute all-pairs shortest distances
    const distances = this.computeAllPairsDistances();

    // For each pair of users (s, t), check which users lie on shortest paths
    for (let i = 0; i < allUsers.length; i++) {
      for (let j = i + 1; j < allUsers.length; j++) {
        const source = allUsers[i];
        const target = allUsers[j];
        
        const directDistance = distances.get(source)?.get(target);
        if (directDistance === undefined || directDistance === Infinity) {
          continue; // No path between source and target
        }

        // Check each potential broker
        for (const broker of allUsers) {
          if (broker === source || broker === target) continue;

          const distSourceToBroker = distances.get(source)?.get(broker);
          const distBrokerToTarget = distances.get(broker)?.get(target);

          // Check if broker lies on shortest path: dist(s,v) + dist(v,t) == dist(s,t)
          if (distSourceToBroker !== undefined && distBrokerToTarget !== undefined &&
              distSourceToBroker + distBrokerToTarget === directDistance) {
            centralityScores.set(broker, centralityScores.get(broker) + 1);
          }
        }
      }
    }

    // Convert to array and sort
    const rankedBrokers = Array.from(centralityScores.entries())
      .map(([userId, score]) => ({
        userId,
        centralityScore: score,
        normalizedScore: allUsers.length > 2 ? 
          score / ((allUsers.length - 1) * (allUsers.length - 2)) : 0
      }))
      .filter(broker => broker.centralityScore > 0)
      .sort((a, b) => b.centralityScore - a.centralityScore)
      .slice(0, topK);

    return rankedBrokers;
  }

  /**
   * Compute all-pairs shortest distances using BFS from each node
   * @returns {Map<string, Map<string, number>>} - Distance matrix
   */
  computeAllPairsDistances() {
    if (this.distanceCache.size > 0) {
      return this.distanceCache;
    }

    const distances = new Map();

    for (const source of this.users) {
      const sourceDistances = new Map();
      const visited = new Set();
      const queue = [{node: source, distance: 0}];
      visited.add(source);

      while (queue.length > 0) {
        const {node: current, distance} = queue.shift();
        sourceDistances.set(current, distance);

        const neighbors = this.referrals.get(current) || new Set();
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push({node: neighbor, distance: distance + 1});
          }
        }
      }

      distances.set(source, sourceDistances);
    }

    this.distanceCache = distances;
    return distances;
  }

  /**
   * Get comprehensive influencer analysis comparing all three metrics
   * @param {number} topK - Number of top influencers per metric
   * @returns {Object} - Comparative analysis of influence metrics
   */
  getInfluencerComparison(topK = 10) {
    const reachRanking = this.getTopReferrersByReach(topK);
    const uniqueReachAnalysis = this.calculateUniqueReachExpansion(topK);
    const flowCentralityRanking = this.calculateFlowCentrality(topK);

    return {
      byReach: reachRanking,
      byUniqueReach: uniqueReachAnalysis.selectedReferrers,
      byFlowCentrality: flowCentralityRanking,
      summary: {
        totalActiveReferrers: reachRanking.length,
        maxReach: reachRanking[0]?.reach || 0,
        totalUniqueCoverage: uniqueReachAnalysis.totalUniqueCoverage,
        topBrokerScore: flowCentralityRanking[0]?.centralityScore || 0
      }
    };
  }

  /**
   * Clear caches to free memory or refresh calculations
   */
  clearCaches() {
    this.reachCache.clear();
    this.distanceCache.clear();
  }
}

/**
 * BUSINESS SCENARIO COMPARISON FOR INFLUENCE METRICS:
 * 
 * 1. REACH METRIC:
 *    Best for: Viral marketing campaigns, brand awareness initiatives
 *    Scenario: "We need to reach the maximum number of people through our referral program"
 *    Use when: Raw exposure and scale matter most
 * 
 * 2. UNIQUE REACH EXPANSION:
 *    Best for: Cost-optimized marketing, diverse audience targeting
 *    Scenario: "We have a limited budget and want maximum unique customer acquisition"  
 *    Use when: Budget constraints exist and audience overlap should be minimized
 * 
 * 3. FLOW CENTRALITY:
 *    Best for: Network resilience, knowledge sharing, organizational design
 *    Scenario: "We need to identify key employees whose departure would hurt team connectivity"
 *    Use when: Network stability and information flow efficiency are priorities
 */
