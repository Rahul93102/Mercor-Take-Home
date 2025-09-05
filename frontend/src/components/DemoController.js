/**
 * Interactive Demo Script for Referral Network Analytics
 * 
 * This script demonstrates all the enhanced features including:
 * - Animated loading sequences
 * - Interactive bar charts
 * - Algorithm visualizations
 * - Network growth simulations
 */

// Demo data for testing
const demoUsers = ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank', 'george', 'helen'];

const demoReferrals = [
  ['alice', 'bob'],
  ['alice', 'charlie'], 
  ['bob', 'diana'],
  ['bob', 'eve'],
  ['charlie', 'frank'],
  ['diana', 'george'],
  ['eve', 'helen']
];

// Function to auto-populate network for demo
export const runDemo = (network, onNetworkUpdate) => {
  console.log('🎬 Starting Referral Network Demo...');
  
  let step = 0;
  const totalSteps = demoUsers.length + demoReferrals.length;
  
  // Step 1: Add users with delay
  const addUsersDemo = () => {
    if (step < demoUsers.length) {
      const user = demoUsers[step];
      try {
        network.addUser(user);
        console.log(`✨ Added user: ${user}`);
        onNetworkUpdate(network);
        step++;
        setTimeout(addUsersDemo, 800);
      } catch (error) {
        console.log(`⚠️ User ${user} already exists`);
        step++;
        setTimeout(addUsersDemo, 400);
      }
    } else {
      setTimeout(addReferralsDemo, 1000);
    }
  };
  
  // Step 2: Add referrals with delay
  const addReferralsDemo = () => {
    const referralIndex = step - demoUsers.length;
    if (referralIndex < demoReferrals.length) {
      const [referrer, candidate] = demoReferrals[referralIndex];
      try {
        network.addReferral(referrer, candidate);
        console.log(`🎯 Added referral: ${referrer} → ${candidate}`);
        onNetworkUpdate(network);
        step++;
        setTimeout(addReferralsDemo, 1200);
      } catch (error) {
        console.log(`⚠️ Could not add referral: ${error.message}`);
        step++;
        setTimeout(addReferralsDemo, 600);
      }
    } else {
      setTimeout(() => {
        console.log('🎉 Demo completed! Algorithm visualization should be triggered!');
        console.log(`📊 Final network stats:`, network.getStats());
        
        // Show final analysis
        const topReferrers = Array.from(network.getAllUsers())
          .map(user => ({
            user,
            reach: network.calculateReach(user),
            directReferrals: network.getDirectReferrals(user).size
          }))
          .sort((a, b) => b.reach - a.reach);
          
        console.log('🏆 Top referrers:', topReferrers);
      }, 1000);
    }
  };
  
  // Start the demo
  setTimeout(addUsersDemo, 1000);
  
  return {
    totalSteps,
    progress: () => ((step / totalSteps) * 100).toFixed(1)
  };
};

// Enhanced demo with larger network
export const runLargeNetworkDemo = (network, onNetworkUpdate) => {
  console.log('🚀 Starting Large Network Demo...');
  
  const largeUserSet = [];
  const largeReferralSet = [];
  
  // Generate users
  for (let i = 1; i <= 20; i++) {
    largeUserSet.push(`user${i}`);
  }
  
  // Generate referral relationships to create reach > 10
  const referralPatterns = [
    // Root user refers to 5 people
    ['user1', 'user2'], ['user1', 'user3'], ['user1', 'user4'], ['user1', 'user5'], ['user1', 'user6'],
    
    // Level 2: Each of those refers to 2-3 people
    ['user2', 'user7'], ['user2', 'user8'],
    ['user3', 'user9'], ['user3', 'user10'], ['user3', 'user11'],
    ['user4', 'user12'], ['user4', 'user13'],
    ['user5', 'user14'], ['user5', 'user15'], ['user5', 'user16'],
    ['user6', 'user17'], ['user6', 'user18'],
    
    // Level 3: Some third-level referrals
    ['user7', 'user19'], ['user8', 'user20']
  ];
  
  let step = 0;
  const totalSteps = largeUserSet.length + referralPatterns.length;
  
  const addUsersLarge = () => {
    if (step < largeUserSet.length) {
      const user = largeUserSet[step];
      try {
        network.addUser(user);
        console.log(`✨ Added user: ${user}`);
        onNetworkUpdate(network);
        step++;
        setTimeout(addUsersLarge, 400); // Faster for large demo
      } catch (error) {
        step++;
        setTimeout(addUsersLarge, 200);
      }
    } else {
      setTimeout(addReferralsLarge, 800);
    }
  };
  
  const addReferralsLarge = () => {
    const referralIndex = step - largeUserSet.length;
    if (referralIndex < referralPatterns.length) {
      const [referrer, candidate] = referralPatterns[referralIndex];
      try {
        network.addReferral(referrer, candidate);
        console.log(`🎯 Added referral: ${referrer} → ${candidate}`);
        const reach = network.calculateReach(referrer);
        if (reach >= 10) {
          console.log(`🔥 ALGORITHM TRIGGER: ${referrer} reached ${reach} people!`);
        }
        onNetworkUpdate(network);
        step++;
        setTimeout(addReferralsLarge, 600);
      } catch (error) {
        console.log(`⚠️ Could not add referral: ${error.message}`);
        step++;
        setTimeout(addReferralsLarge, 300);
      }
    } else {
      setTimeout(() => {
        console.log('🎉 Large network demo completed!');
        const stats = network.getStats();
        console.log(`📊 Final stats: ${stats.totalUsers} users, ${stats.totalReferrals} referrals`);
        
        // Find users with 10+ reach
        const powerUsers = Array.from(network.getAllUsers())
          .map(user => ({
            user,
            reach: network.calculateReach(user)
          }))
          .filter(u => u.reach >= 10)
          .sort((a, b) => b.reach - a.reach);
          
        console.log('🌟 Power users (10+ reach):', powerUsers);
      }, 1000);
    }
  };
  
  setTimeout(addUsersLarge, 500);
  
  return {
    totalSteps,
    progress: () => ((step / totalSteps) * 100).toFixed(1)
  };
};

// Quick test function
export const quickTest = (network, onNetworkUpdate) => {
  console.log('⚡ Quick test - adding power user...');
  
  // Add a root user
  network.addUser('poweruser');
  onNetworkUpdate(network);
  
  // Add 12 referrals quickly to trigger algorithm
  const referrals = [];
  for (let i = 1; i <= 12; i++) {
    const candidate = `ref${i}`;
    network.addUser(candidate);
    referrals.push(['poweruser', candidate]);
  }
  
  let index = 0;
  const addQuickReferral = () => {
    if (index < referrals.length) {
      const [referrer, candidate] = referrals[index];
      try {
        network.addReferral(referrer, candidate);
        console.log(`⚡ Quick referral: ${referrer} → ${candidate}`);
        const reach = network.calculateReach(referrer);
        console.log(`📈 ${referrer} reach: ${reach}`);
        
        if (reach >= 10) {
          console.log('🔥 ALGORITHM VISUALIZATION TRIGGERED!');
        }
        
        onNetworkUpdate(network);
        index++;
        setTimeout(addQuickReferral, 300);
      } catch (error) {
        index++;
        setTimeout(addQuickReferral, 100);
      }
    } else {
      console.log('✅ Quick test completed!');
    }
  };
  
  setTimeout(addQuickReferral, 500);
};

// Export demo controller
export const DemoController = {
  runDemo,
  runLargeNetworkDemo,
  quickTest,
  
  // Helper to create sample data for charts
  generateChartData: (network) => {
    if (!network || network.getAllUsers().size === 0) return [];
    
    return Array.from(network.getAllUsers())
      .map(user => ({
        label: user,
        value: network.calculateReach(user),
        description: `${user} has ${network.calculateReach(user)} people in their network`
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  },
  
  // Helper to check if algorithm should be triggered
  shouldTriggerAlgorithm: (network) => {
    if (!network) return false;
    return Array.from(network.getAllUsers()).some(user => 
      network.calculateReach(user) >= 10
    );
  }
};

export default DemoController;
