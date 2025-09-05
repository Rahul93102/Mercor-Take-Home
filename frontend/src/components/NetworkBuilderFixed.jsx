/**
 * Network Builder Component - Part 1 Implementation (Enhanced)
 * 
 * Interactive interface for building and managing referral networks with animations
 */

import React, { useState, useEffect } from 'react';
import AnimatedLoader from './AnimatedLoader';
import AnimatedBarChart from './AnimatedBarChart';
import AlgorithmVisualizer from './AlgorithmVisualizer';
import { DemoController } from './DemoController';

const NetworkBuilderFixed = ({ network, onNetworkUpdate }) => {
  const [referrerId, setReferrerId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAlgorithmViz, setShowAlgorithmViz] = useState(false);
  const [chartData, setChartData] = useState([]);

  // Initialize component with loading animation
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(loadingTimer);
  }, []);

  // Update chart data when network changes
  useEffect(() => {
    if (network) {
      updateChartData();
      checkForAlgorithmTrigger();
    }
  }, [network]);

  const updateChartData = () => {
    const allUsers = Array.from(network.getAllUsers());
    const userData = allUsers.map(userId => ({
      label: userId,
      value: network.calculateReach(userId),
      description: `Total reach for ${userId}`
    })).sort((a, b) => b.value - a.value).slice(0, 10); // Top 10 users
    
    setChartData(userData);
  };

  const checkForAlgorithmTrigger = () => {
    const allUsers = Array.from(network.getAllUsers());
    const hasUserWith10Plus = allUsers.some(userId => 
      network.calculateReach(userId) >= 10
    );
    
    if (hasUserWith10Plus && !showAlgorithmViz) {
      setShowAlgorithmViz(true);
      showMessage('🎉 Algorithm visualization triggered! Someone reached 10+ referrals!', 'success');
    }
  };

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddUser = () => {
    if (!newUserId.trim()) {
      showMessage('User ID is required', 'error');
      return;
    }

    setIsLoading(true);
    
    // Add loading delay for better UX
    setTimeout(() => {
      try {
        network.addUser(newUserId.trim());
        showMessage(`✨ Successfully added user: ${newUserId}`, 'success');
        setNewUserId('');
        onNetworkUpdate(network);
      } catch (error) {
        showMessage(error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleAddReferral = () => {
    if (!referrerId.trim() || !candidateId.trim()) {
      showMessage('Both referrer and candidate IDs are required', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        network.addReferral(referrerId.trim(), candidateId.trim());
        showMessage(`🎯 Successfully added referral: ${referrerId} → ${candidateId}`, 'success');
        setReferrerId('');
        setCandidateId('');
        onNetworkUpdate(network);
      } catch (error) {
        showMessage(error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const stats = network.getStats();
  const allUsers = Array.from(network.getAllUsers()).sort();

  if (isLoading && allUsers.length === 0) {
    return (
      <AnimatedLoader 
        message="Initializing Network Builder..."
        components={[
          { label: "Add Users", color: "#007bff", delay: "0s" },
          { label: "Create Referrals", color: "#28a745", delay: "0.4s" },
          { label: "Calculate Reach", color: "#ffc107", delay: "0.8s" },
          { label: "Build Network", color: "#dc3545", delay: "1.2s" }
        ]}
      />
    );
  }

  return (
    <div className="network-builder">
      <div className="component-header">
        <h2>🏗️ Part 1: Network Builder</h2>
        <p>Build your referral network by adding users and relationships with stunning visualizations</p>
      </div>

      {isLoading && (
        <AnimatedLoader 
          message="Processing network changes..."
          components={[
            { label: "Validating", color: "#17a2b8", delay: "0s" },
            { label: "Computing", color: "#ffc107", delay: "0.3s" },
            { label: "Updating", color: "#28a745", delay: "0.6s" }
          ]}
        />
      )}

      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      <div className="builder-controls">
        {/* Add User Section */}
        <div className="control-section">
          <h3>👤 Add New User</h3>
          <div className="input-group">
            <input
              type="text"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              placeholder="Enter user ID (e.g., alice, bob, charlie)"
              className="text-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
            />
            <button 
              onClick={handleAddUser} 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Adding...' : '✨ Add User'}
            </button>
          </div>
        </div>

        {/* Add Referral Section */}
        <div className="control-section">
          <h3>🔗 Create Referral Relationship</h3>
          <div className="input-group">
            <select
              value={referrerId}
              onChange={(e) => setReferrerId(e.target.value)}
              className="select-input"
            >
              <option value="">Select Referrer</option>
              {allUsers.map(userId => (
                <option key={userId} value={userId}>👤 {userId}</option>
              ))}
            </select>
            <span className="arrow animated-arrow">→</span>
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              className="select-input"
            >
              <option value="">Select Candidate</option>
              {allUsers.map(userId => (
                <option key={userId} value={userId}>👤 {userId}</option>
              ))}
            </select>
            <button 
              onClick={handleAddReferral} 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Creating...' : '🎯 Add Referral'}
            </button>
          </div>
        </div>
      </div>

      {/* Charts and Visualizations */}
      {chartData.length > 0 && (
        <AnimatedBarChart
          data={chartData}
          title="📊 Top Referrers by Reach"
          height={300}
          animated={true}
          showValues={true}
          className="referral-chart"
        />
      )}

      {/* Algorithm Visualization */}
      {showAlgorithmViz && (
        <AlgorithmVisualizer
          type="referral"
          data={chartData.map(d => d.value)}
          autoPlay={true}
          speed={1200}
          onComplete={() => console.log('Algorithm visualization completed!')}
        />
      )}

      {/* Network Overview */}
      <div className="network-overview">
        <h3>📈 Network Overview & Analytics</h3>
        <div className="stats-grid">
          <div className="stat-card interactive-element">
            <div className="stat-icon">👥</div>
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats.totalUsers}</span>
            <div className="stat-trend">+{stats.totalUsers} this session</div>
          </div>
          <div className="stat-card interactive-element">
            <div className="stat-icon">🔗</div>
            <span className="stat-label">Total Referrals</span>
            <span className="stat-value">{stats.totalReferrals}</span>
            <div className="stat-trend">+{stats.totalReferrals} connections</div>
          </div>
          <div className="stat-card interactive-element">
            <div className="stat-icon">🌟</div>
            <span className="stat-label">Max Reach</span>
            <span className="stat-value">
              {chartData.length > 0 ? chartData[0].value : 0}
            </span>
            <div className="stat-trend">Best performer</div>
          </div>
          <div className="stat-card interactive-element">
            <div className="stat-icon">🎯</div>
            <span className="stat-label">Algorithm Status</span>
            <span className="stat-value">
              {showAlgorithmViz ? 'Active' : 'Ready'}
            </span>
            <div className="stat-trend">
              {showAlgorithmViz ? '🔥 Triggered!' : 'Awaiting 10+ reach'}
            </div>
          </div>
        </div>

        {/* Enhanced Users List */}
        {allUsers.length > 0 && (
          <div className="users-section data-viz-container">
            <h4>👤 Network Members ({allUsers.length})</h4>
            <div className="users-grid">
              {allUsers.map((userId, index) => {
                const reach = network.calculateReach(userId);
                const directReferrals = network.getDirectReferrals(userId).size;
                
                return (
                  <div 
                    key={userId} 
                    className={`user-card interactive-element ${reach >= 10 ? 'user-card-premium' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="user-header">
                      <div className="user-avatar">
                        {reach >= 10 ? '🌟' : '👤'}
                      </div>
                      <div className="user-id">{userId}</div>
                      {reach >= 10 && <div className="premium-badge">⚡ Power User</div>}
                    </div>
                    <div className="user-stats">
                      <div className="user-stat">
                        <span className="stat-icon">👥</span>
                        <span>Direct: {directReferrals}</span>
                      </div>
                      <div className="user-stat">
                        <span className="stat-icon">📈</span>
                        <span>Reach: {reach}</span>
                      </div>
                    </div>
                    {reach > 0 && (
                      <div className="user-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${Math.min((reach / 20) * 100, 100)}%`,
                              backgroundColor: reach >= 10 ? '#28a745' : '#007bff'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Referral Relationships */}
        {stats.totalReferrals > 0 && (
          <div className="referrals-section data-viz-container">
            <h4>🔗 Referral Network ({stats.totalReferrals} connections)</h4>
            <div className="referrals-list">
              {Array.from(network.referrals.entries()).map(([referrer, candidates]) => 
                Array.from(candidates).map((candidate, index) => {
                  const reach = network.calculateReach(candidate);
                  
                  return (
                    <div 
                      key={`${referrer}-${candidate}`} 
                      className={`referral-item interactive-element ${reach >= 5 ? 'referral-item-strong' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="referral-flow">
                        <span className="referrer">
                          <span className="user-emoji">👤</span>
                          {referrer}
                        </span>
                        <span className="arrow animated-arrow">
                          <span className="arrow-line">─────</span>
                          <span className="arrow-head">▶</span>
                        </span>
                        <span className="candidate">
                          <span className="user-emoji">{reach >= 10 ? '🌟' : '👤'}</span>
                          {candidate}
                        </span>
                      </div>
                      <div className="referral-metrics">
                        <span className="reach-badge">
                          📈 Reach: {reach}
                        </span>
                        {reach >= 10 && (
                          <span className="power-badge">⚡ Power</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkBuilderFixed;
