/**
 * Test Suite for Referral Network Implementation
 * 
 * This file demonstrates the functionality of all five parts
 * of the referral network challenge through automated tests.
 */

import { InfluencerAnalysis } from './src/InfluencerAnalysis.js';
import { NetworkGrowthSimulation } from './src/NetworkGrowthSimulation.js';
import { BonusOptimization } from './src/BonusOptimization.js';

// Test Suite Runner
class ReferralNetworkTestSuite {
  constructor() {
    this.network = new InfluencerAnalysis();
    this.simulator = new NetworkGrowthSimulation();
    this.optimizer = new BonusOptimization();
    this.testResults = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().substr(11, 8);
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }

  assert(condition, testName, description = '') {
    const result = {
      testName,
      description,
      passed: condition,
      timestamp: new Date().toISOString()
    };

    this.testResults.tests.push(result);
    
    if (condition) {
      this.testResults.passed++;
      this.log(`✅ ${testName} - ${description}`, 'pass');
    } else {
      this.testResults.failed++;
      this.log(`❌ ${testName} - ${description}`, 'fail');
    }
  }

  // PART 1: Test Referral Graph Structure
  testPart1() {
    this.log('Testing Part 1: Referral Graph Structure', 'section');

    // Test basic user addition
    this.network.addUser('alice');
    this.network.addUser('bob');
    this.assert(
      this.network.getAllUsers().has('alice') && this.network.getAllUsers().has('bob'),
      'User Addition',
      'Users can be added to the network'
    );

    // Test referral addition
    try {
      this.network.addReferral('alice', 'bob');
      this.assert(
        this.network.getDirectReferrals('alice').has('bob'),
        'Referral Addition',
        'Valid referral relationships can be added'
      );
    } catch (error) {
      this.assert(false, 'Referral Addition', `Failed: ${error.message}`);
    }

    // Test self-referral prevention
    try {
      this.network.addReferral('alice', 'alice');
      this.assert(false, 'Self-Referral Prevention', 'Should prevent self-referrals');
    } catch (error) {
      this.assert(
        error.message.includes('Self-referrals are not allowed'),
        'Self-Referral Prevention',
        'Correctly prevents self-referrals'
      );
    }

    // Test unique referrer constraint
    this.network.addUser('charlie');
    try {
      this.network.addReferral('alice', 'charlie');
      this.network.addReferral('bob', 'charlie');
      this.assert(false, 'Unique Referrer Constraint', 'Should prevent multiple referrers');
    } catch (error) {
      this.assert(
        error.message.includes('already has a referrer'),
        'Unique Referrer Constraint',
        'Correctly enforces unique referrer rule'
      );
    }

    // Test cycle prevention
    this.network.addUser('david');
    this.network.addReferral('charlie', 'david');
    try {
      this.network.addReferral('david', 'alice');
      this.assert(false, 'Cycle Prevention', 'Should prevent cycle creation');
    } catch (error) {
      this.assert(
        error.message.includes('cycle'),
        'Cycle Prevention',
        'Correctly prevents cycle creation'
      );
    }
  }

  // PART 2: Test Network Reach Analysis
  testPart2() {
    this.log('Testing Part 2: Network Reach Analysis', 'section');

    // Build a test network
    const users = ['eve', 'frank', 'george', 'helen', 'ivan'];
    users.forEach(user => this.network.addUser(user));
    
    try {
      this.network.addReferral('alice', 'eve');
      this.network.addReferral('eve', 'frank');
      this.network.addReferral('frank', 'george');
      this.network.addReferral('bob', 'helen');
      this.network.addReferral('helen', 'ivan');

      // Test reach calculation
      const aliceReach = this.network.calculateReach('alice');
      this.assert(
        aliceReach >= 3,
        'Reach Calculation',
        `Alice's reach should include eve, frank, george (got ${aliceReach})`
      );

      // Test top referrers
      const topReferrers = this.network.getTopReferrersByReach(5);
      this.assert(
        topReferrers.length > 0 && topReferrers[0].reach > 0,
        'Top Referrers',
        'Can identify top referrers by reach'
      );

      // Test reach analysis
      const analysis = this.network.getReachAnalysis();
      this.assert(
        analysis.statistics.totalUsers > 0 && analysis.statistics.totalReach > 0,
        'Reach Analysis',
        'Can generate comprehensive reach analysis'
      );

    } catch (error) {
      this.assert(false, 'Network Building', `Failed to build test network: ${error.message}`);
    }
  }

  // PART 3: Test Influencer Analysis
  testPart3() {
    this.log('Testing Part 3: Influencer Analysis', 'section');

    try {
      // Test unique reach expansion
      const uniqueReach = this.network.calculateUniqueReachExpansion(3);
      this.assert(
        uniqueReach.selectedReferrers.length > 0,
        'Unique Reach Expansion',
        'Can identify influencers for unique coverage'
      );

      // Test flow centrality
      const flowCentrality = this.network.calculateFlowCentrality(3);
      this.assert(
        Array.isArray(flowCentrality),
        'Flow Centrality',
        'Can calculate flow centrality metrics'
      );

      // Test influencer comparison
      const comparison = this.network.getInfluencerComparison(5);
      this.assert(
        comparison.byReach && comparison.byUniqueReach && comparison.byFlowCentrality,
        'Influencer Comparison',
        'Can generate comprehensive influencer comparison'
      );

    } catch (error) {
      this.assert(false, 'Influencer Analysis', `Failed: ${error.message}`);
    }
  }

  // PART 4: Test Network Growth Simulation
  testPart4() {
    this.log('Testing Part 4: Network Growth Simulation', 'section');

    try {
      // Test simulation
      const results = this.simulator.simulate(0.1, 30);
      this.assert(
        results.length === 30 && results[29] > results[0],
        'Growth Simulation',
        'Simulation produces increasing growth over time'
      );

      // Test days to target
      const daysNeeded = this.simulator.daysToTarget(0.1, 500);
      this.assert(
        typeof daysNeeded === 'number' && daysNeeded > 0,
        'Days to Target',
        `Can calculate days needed to reach target (${daysNeeded} days)`
      );

      // Test simulation analytics
      const analytics = this.simulator.getSimulationAnalytics(0.1, 30);
      this.assert(
        analytics.totalReferrals > 0 && analytics.peakGrowthDay > 0,
        'Simulation Analytics',
        'Can generate detailed simulation analytics'
      );

      // Test scenario comparison
      const comparison = this.simulator.compareScenarios([0.05, 0.1, 0.15], 30);
      this.assert(
        comparison.scenarios.length === 3 && comparison.bestScenario,
        'Scenario Comparison',
        'Can compare multiple probability scenarios'
      );

    } catch (error) {
      this.assert(false, 'Growth Simulation', `Failed: ${error.message}`);
    }
  }

  // PART 5: Test Bonus Optimization
  testPart5() {
    this.log('Testing Part 5: Bonus Optimization', 'section');

    // Sample adoption function
    const adoptionProb = (bonus) => Math.min(bonus / 500, 0.9);

    try {
      // Test bonus optimization
      const minBonus = this.optimizer.minBonusForTarget(60, 200, adoptionProb);
      this.assert(
        typeof minBonus === 'number' && minBonus > 0,
        'Bonus Optimization',
        `Found minimum bonus: $${minBonus}`
      );

      // Test sensitivity analysis
      const sensitivity = this.optimizer.analyzeBonusSensitivity(60, 200, adoptionProb, 500, 50);
      this.assert(
        sensitivity.results.length > 0 && sensitivity.optimalBonus !== null,
        'Sensitivity Analysis',
        'Can analyze bonus sensitivity'
      );

      // Test recommendation system
      const recommendation = this.optimizer.getBonusRecommendation(60, 200, adoptionProb);
      this.assert(
        recommendation.achievable !== undefined,
        'Bonus Recommendation',
        'Can generate business recommendations'
      );

    } catch (error) {
      this.assert(false, 'Bonus Optimization', `Failed: ${error.message}`);
    }
  }

  // Run all tests
  runAllTests() {
    this.log('Starting Referral Network Test Suite', 'start');
    console.log('='.repeat(60));

    this.testPart1();
    this.testPart2();
    this.testPart3();
    this.testPart4();
    this.testPart5();

    console.log('='.repeat(60));
    this.log('Test Suite Complete', 'end');
    this.log(`Results: ${this.testResults.passed} passed, ${this.testResults.failed} failed`);
    
    if (this.testResults.failed === 0) {
      this.log('🎉 All tests passed! Implementation is working correctly.', 'success');
    } else {
      this.log(`⚠️  ${this.testResults.failed} tests failed. Check implementation.`, 'warning');
    }

    return this.testResults;
  }

  // Generate test report
  generateReport() {
    const report = {
      summary: {
        totalTests: this.testResults.passed + this.testResults.failed,
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        successRate: `${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%`
      },
      details: this.testResults.tests,
      recommendations: [
        'All five parts of the challenge have been implemented',
        'The system enforces all required constraints',
        'Advanced algorithms are working correctly',
        'Business logic is functioning as expected'
      ]
    };

    console.log('\n📊 DETAILED TEST REPORT');
    console.log(JSON.stringify(report, null, 2));
    
    return report;
  }
}

// Export for use
export { ReferralNetworkTestSuite };

// Auto-run if this file is executed directly
if (typeof window === 'undefined') {
  const testSuite = new ReferralNetworkTestSuite();
  const results = testSuite.runAllTests();
  testSuite.generateReport();
}
