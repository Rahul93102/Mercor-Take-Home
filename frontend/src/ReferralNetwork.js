/**
 * Referral Network - Core Graph Implementation
 * 
 * This class implements a directed acyclic graph (DAG) to manage referral relationships.
 * Each user can refer multiple candidates, but each candidate can only have one referrer.
 */

export class ReferralNetwork {
  constructor() {
    // Store referral relationships: referrer -> Set of candidates
    this.referrals = new Map();
    // Reverse mapping: candidate -> referrer (for unique referrer constraint)
    this.referrers = new Map();
    // Set of all users in the network
    this.users = new Set();
  }

  /**
   * Add a user to the network
   * @param {string} userId - Unique identifier for the user
   */
  addUser(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a non-empty string');
    }
    
    this.users.add(userId);
    if (!this.referrals.has(userId)) {
      this.referrals.set(userId, new Set());
    }
  }

  /**
   * Add a referral relationship from referrer to candidate
   * @param {string} referrerId - User making the referral
   * @param {string} candidateId - User being referred
   * @returns {boolean} - Success status
   */
  addReferral(referrerId, candidateId) {
    // Validation checks
    if (!referrerId || !candidateId) {
      throw new Error('Both referrer and candidate IDs are required');
    }

    if (referrerId === candidateId) {
      throw new Error('Self-referrals are not allowed');
    }

    // Add users if they don't exist
    this.addUser(referrerId);
    this.addUser(candidateId);

    // Check if candidate already has a referrer
    if (this.referrers.has(candidateId)) {
      throw new Error(`Candidate ${candidateId} already has a referrer: ${this.referrers.get(candidateId)}`);
    }

    // Check for cycle creation using DFS
    if (this.wouldCreateCycle(referrerId, candidateId)) {
      throw new Error('Adding this referral would create a cycle');
    }

    // Add the referral relationship
    this.referrals.get(referrerId).add(candidateId);
    this.referrers.set(candidateId, referrerId);

    return true;
  }

  /**
   * Check if adding a referral would create a cycle
   * @param {string} referrerId - Proposed referrer
   * @param {string} candidateId - Proposed candidate
   * @returns {boolean} - True if cycle would be created
   */
  wouldCreateCycle(referrerId, candidateId) {
    // If candidate can reach referrer through existing paths, adding this edge creates a cycle
    return this.canReach(candidateId, referrerId);
  }

  /**
   * Check if one user can reach another through referral chain
   * @param {string} fromUser - Starting user
   * @param {string} toUser - Target user
   * @returns {boolean} - True if path exists
   */
  canReach(fromUser, toUser) {
    if (fromUser === toUser) return true;
    
    const visited = new Set();
    const stack = [fromUser];

    while (stack.length > 0) {
      const current = stack.pop();
      if (visited.has(current)) continue;
      visited.add(current);

      const directReferrals = this.referrals.get(current);
      if (directReferrals) {
        for (const referral of directReferrals) {
          if (referral === toUser) return true;
          stack.push(referral);
        }
      }
    }

    return false;
  }

  /**
   * Get direct referrals for a user
   * @param {string} userId - User ID
   * @returns {Set} - Set of direct referrals
   */
  getDirectReferrals(userId) {
    return this.referrals.get(userId) || new Set();
  }

  /**
   * Get the referrer of a user (if any)
   * @param {string} userId - User ID
   * @returns {string|null} - Referrer ID or null
   */
  getReferrer(userId) {
    return this.referrers.get(userId) || null;
  }

  /**
   * Get all users in the network
   * @returns {Set} - Set of all user IDs
   */
  getAllUsers() {
    return new Set(this.users);
  }

  /**
   * Get network statistics
   * @returns {Object} - Network statistics
   */
  getStats() {
    return {
      totalUsers: this.users.size,
      totalReferrals: Array.from(this.referrals.values())
        .reduce((sum, referrals) => sum + referrals.size, 0),
      usersWithReferrals: Array.from(this.referrals.values())
        .filter(referrals => referrals.size > 0).length
    };
  }
}
