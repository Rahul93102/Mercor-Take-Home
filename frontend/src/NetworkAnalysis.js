/**
 * Network Analysis Module
 * 
 * This module extends the ReferralNetwork with reach analysis capabilities,
 * including BFS-based traversal for calculating total reach and identifying top referrers.
 */

import { ReferralNetwork } from './ReferralNetwork.js';

export class NetworkAnalysis extends ReferralNetwork {
  /**
   * Calculate total referral count (reach) for a user using BFS
   * This includes both direct and all indirect referrals
   * @param {string} userId - User ID
   * @returns {number} - Total number of referrals in user's downstream network
   */
  calculateReach(userId) {
    if (!this.users.has(userId)) {
      return 0;
    }

    const visited = new Set();
    const queue = [userId];
    visited.add(userId);

    // BFS traversal to find all reachable users
    while (queue.length > 0) {
      const current = queue.shift();
      const directReferrals = this.referrals.get(current);

      if (directReferrals) {
        for (const referral of directReferrals) {
          if (!visited.has(referral)) {
            visited.add(referral);
            queue.push(referral);
          }
        }
      }
    }

    // Subtract 1 to exclude the user themselves
    return visited.size - 1;
  }

  /**
   * Get all users in a user's downstream network (their reach set)
   * @param {string} userId - User ID
   * @returns {Set} - Set of all users in downstream network
   */
  getReachSet(userId) {
    // Return from cache if available
    if (this.reachCache.has(userId)) {
      return this.reachCache.get(userId);
    }

    if (!this.users.has(userId)) {
      return new Set();
    }

    const reachSet = new Set();
    const queue = [userId];
    const visited = new Set([userId]);

    while (queue.length > 0) {
      const current = queue.shift();
      const directReferrals = this.referrals.get(current);

      if (directReferrals) {
        for (const referral of directReferrals) {
          if (!visited.has(referral)) {
            visited.add(referral);
            queue.push(referral);
            reachSet.add(referral);
          }
        }
      }
    }

    // Cache the result before returning
    this.reachCache.set(userId, reachSet);
    return reachSet;
  }

  /**
   * Get top k referrers by reach
   * 
   * How to choose k:
   * - For executive dashboards: k = 5-10 (focus on top performers)
   * - For team management: k = 20-50 (broader view of active referrers)  
   * - For incentive programs: k = 100+ (include more participants)
   * - For network analysis: k = sqrt(total_users) (statistical significance)
   * 
   * @param {number} k - Number of top referrers to return
   * @returns {Array} - Array of {userId, reach} objects sorted by reach (descending)
   */
  getTopReferrersByReach(k = 10) {
    const userReachPairs = [];

    // Calculate reach for all users
    for (const userId of this.users) {
      const reach = this.calculateReach(userId);
      if (reach > 0) { // Only include users with actual referrals
        userReachPairs.push({ userId, reach });
      }
    }

    // Sort by reach in descending order and return top k
    return userReachPairs
      .sort((a, b) => b.reach - a.reach)
      .slice(0, k);
  }

  /**
   * Get detailed reach analysis for all users
   * @returns {Object} - Comprehensive reach analysis
   */
  getReachAnalysis() {
    const reachData = new Map();
    const allReaches = [];

    // Calculate reach for all users
    for (const userId of this.users) {
      const reach = this.calculateReach(userId);
      reachData.set(userId, reach);
      allReaches.push(reach);
    }

    // Calculate statistics
    const totalReach = allReaches.reduce((sum, reach) => sum + reach, 0);
    const averageReach = totalReach / allReaches.length;
    const maxReach = Math.max(...allReaches);
    const minReach = Math.min(...allReaches);

    // Calculate median
    const sortedReaches = allReaches.sort((a, b) => a - b);
    const median = sortedReaches.length % 2 === 0
      ? (sortedReaches[sortedReaches.length / 2 - 1] + sortedReaches[sortedReaches.length / 2]) / 2
      : sortedReaches[Math.floor(sortedReaches.length / 2)];

    return {
      reachData,
      statistics: {
        totalUsers: this.users.size,
        totalReach,
        averageReach: parseFloat(averageReach.toFixed(2)),
        medianReach: median,
        maxReach,
        minReach,
        usersWithReach: allReaches.filter(reach => reach > 0).length
      }
    };
  }

  /**
   * Find users at a specific depth level from a root user
   * @param {string} rootUserId - Starting user
   * @param {number} depth - Depth level (1 = direct referrals)
   * @returns {Set} - Users at the specified depth
   */
  getUsersAtDepth(rootUserId, depth) {
    if (!this.users.has(rootUserId) || depth < 1) {
      return new Set();
    }

    let currentLevel = new Set([rootUserId]);
    const visited = new Set([rootUserId]);

    // Traverse depth levels
    for (let level = 0; level < depth; level++) {
      const nextLevel = new Set();
      
      for (const userId of currentLevel) {
        const directReferrals = this.referrals.get(userId);
        if (directReferrals) {
          for (const referral of directReferrals) {
            if (!visited.has(referral)) {
              nextLevel.add(referral);
              visited.add(referral);
            }
          }
        }
      }
      
      currentLevel = nextLevel;
    }

    return currentLevel;
  }
}
