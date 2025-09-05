/**
 * Network Analyzer Component - Part 2 Implementation
 * 
 * Interface for analyzing network reach and identifying top referrers with enhanced animations
 */

import React, { useState, useEffect } from 'react';
import AnimatedLoader from './AnimatedLoader';
import AnimatedBarChart from './AnimatedBarChart';
import AlgorithmVisualizer from './AlgorithmVisualizer';

const NetworkAnalyzer = ({ network }) => {
  const [topK, setTopK] = useState(10);
  const [selectedUser, setSelectedUser] = useState('');
  const [reachAnalysis, setReachAnalysis] = useState(null);
  const [topReferrers, setTopReferrers] = useState([]);
  const [depthAnalysis, setDepthAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (network && network.getAllUsers().size > 0) {
      setIsAnalyzing(true);
      // Add loading delay for better UX
      setTimeout(() => {
        updateAnalysis();
        setIsAnalyzing(false);
      }, 1200);
    }
  }, [network, topK]);

  const updateAnalysis = () => {
    if (!network) return;

    const analysis = network.getReachAnalysis();
    const top = network.getTopReferrersByReach(topK);
    
    setReachAnalysis(analysis);
    setTopReferrers(top);

    // Update chart data
    const topChartData = top.map(user => ({
      label: user.userId,
      value: user.reach,
      description: `${user.userId} has reached ${user.reach} people`
    }));
    setChartData(topChartData);

    if (analysis.reachData.size > 0 && !selectedUser) {
      const firstUser = Array.from(analysis.reachData.keys())[0];
      setSelectedUser(firstUser);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    if (network && userId) {
      const depthData = {};
      for (let depth = 1; depth <= 5; depth++) {
        const usersAtDepth = network.getUsersAtDepth(userId, depth);
        depthData[depth] = Array.from(usersAtDepth);
      }
      setDepthAnalysis(depthData);
    }
  };

  const handleTopKChange = (e) => {
    const k = parseInt(e.target.value) || 10;
    setTopK(k);
  };

  if (!network || network.getAllUsers().size === 0) {
    return (
      <div className="network-analyzer">
        <div className="component-header">
          <h2>📊 Part 2: Network Analysis</h2>
          <p>Analyze reach patterns and identify top referrers with advanced visualizations</p>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <h3>No Network Data Available</h3>
          <p>Please build a network first using the Network Builder tab to see amazing analytics!</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="network-analyzer">
        <div className="component-header">
          <h2>📊 Part 2: Network Analysis</h2>
          <p>Analyze reach patterns and identify top referrers with advanced visualizations</p>
        </div>
        <AnimatedLoader 
          message="Analyzing network structure..."
          components={[
            { label: "BFS Traversal", color: "#007bff", delay: "0s" },
            { label: "Reach Calculation", color: "#28a745", delay: "0.3s" },
            { label: "Statistical Analysis", color: "#ffc107", delay: "0.6s" },
            { label: "Ranking Algorithm", color: "#dc3545", delay: "0.9s" }
          ]}
        />
      </div>
    );
  }

  const allUsers = Array.from(network.getAllUsers()).sort();

  return (
    <div className="network-analyzer">
      <div className="component-header">
        <h2>📊 Part 2: Network Analysis</h2>
        <p>Comprehensive reach analysis and top referrer identification with real-time charts</p>
      </div>

      {/* Interactive Bar Chart */}
      {chartData.length > 0 && (
        <AnimatedBarChart
          data={chartData}
          title="🏆 Top Referrers by Network Reach"
          height={350}
          animated={true}
          showValues={true}
          className="top-referrers-chart"
        />
      )}

      {/* Algorithm Visualization for BFS */}
      <AlgorithmVisualizer
        type="network-growth"
        data={chartData.map(d => d.value)}
        autoPlay={false}
        speed={800}
        onComplete={() => console.log('Network analysis visualization completed!')}
      />

      <div className="analyzer-grid">
        <div className="analysis-panel data-viz-container">
          <div className="panel-header">
            <h3>📈 Network Reach Statistics</h3>
            <p>Comprehensive metrics powered by BFS algorithm</p>
          </div>

          {reachAnalysis && (
            <div className="stats-overview">
              <div className="stats-row">
                <div className="stat-card interactive-element">
                  <div className="stat-icon">👥</div>
                  <span className="stat-label">Total Users</span>
                  <span className="stat-value">{reachAnalysis.statistics.totalUsers}</span>
                  <div className="stat-trend">Network size</div>
                </div>
                <div className="stat-card interactive-element">
                  <div className="stat-icon">📊</div>
                  <span className="stat-label">Total Reach</span>
                  <span className="stat-value">{reachAnalysis.statistics.totalReach}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Reach</span>
                  <span className="stat-value">{reachAnalysis.statistics.averageReach}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max Reach</span>
                  <span className="stat-value">{reachAnalysis.statistics.maxReach}</span>
                </div>
              </div>
              <div className="stats-row">
                <div className="stat-item">
                  <span className="stat-label">Median Reach</span>
                  <span className="stat-value">{reachAnalysis.statistics.medianReach}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Active Referrers</span>
                  <span className="stat-value">{reachAnalysis.statistics.usersWithReach}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Activity Rate</span>
                  <span className="stat-value">
                    {(reachAnalysis.statistics.usersWithReach / reachAnalysis.statistics.totalUsers * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="top-referrers-panel">
          <div className="panel-header">
            <h3>Top Referrers by Reach</h3>
            <div className="controls">
              <label htmlFor="topK">Show top:</label>
              <input
                id="topK"
                type="number"
                value={topK}
                onChange={handleTopKChange}
                min="1"
                max="100"
                className="number-input"
              />
              <span>referrers</span>
            </div>
          </div>

          <div className="referrers-list">
            {topReferrers.map((referrer, index) => (
              <div key={referrer.userId} className="referrer-item">
                <div className="rank">#{index + 1}</div>
                <div className="user-info">
                  <div className="user-id">{referrer.userId}</div>
                  <div className="user-metrics">
                    <span className="reach">Reach: {referrer.reach}</span>
                    <span className="direct">
                      Direct: {network.getDirectReferrals(referrer.userId).size}
                    </span>
                  </div>
                </div>
                <div className="reach-bar">
                  <div 
                    className="reach-fill"
                    style={{
                      width: `${(referrer.reach / (reachAnalysis?.statistics.maxReach || 1)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="k-selection-guide">
            <h4>How to choose k:</h4>
            <ul>
              <li><strong>Executive dashboards:</strong> k = 5-10 (top performers)</li>
              <li><strong>Team management:</strong> k = 20-50 (broader view)</li>
              <li><strong>Incentive programs:</strong> k = 100+ (include more participants)</li>
              <li><strong>Statistical analysis:</strong> k = √(total_users) (~{Math.ceil(Math.sqrt(allUsers.length))})</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="user-detail-analysis">
        <div className="panel-header">
          <h3>Individual User Analysis</h3>
          <div className="controls">
            <label htmlFor="user-select">Select user:</label>
            <select
              id="user-select"
              value={selectedUser}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="user-select"
            >
              <option value="">Choose a user...</option>
              {allUsers.map(userId => (
                <option key={userId} value={userId}>
                  {userId} (reach: {network.calculateReach(userId)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedUser && (
          <div className="user-details">
            <div className="user-summary">
              <h4>User: {selectedUser}</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="label">Total Reach:</span>
                  <span className="value">{network.calculateReach(selectedUser)}</span>
                </div>
                <div className="summary-stat">
                  <span className="label">Direct Referrals:</span>
                  <span className="value">{network.getDirectReferrals(selectedUser).size}</span>
                </div>
                <div className="summary-stat">
                  <span className="label">Referrer:</span>
                  <span className="value">{network.getReferrer(selectedUser) || 'None'}</span>
                </div>
              </div>
            </div>

            {depthAnalysis && (
              <div className="depth-analysis">
                <h4>Network Depth Analysis</h4>
                <div className="depth-levels">
                  {Object.entries(depthAnalysis).map(([depth, users]) => (
                    users.length > 0 && (
                      <div key={depth} className="depth-level">
                        <div className="depth-header">
                          <span className="depth-number">Level {depth}</span>
                          <span className="user-count">({users.length} users)</span>
                        </div>
                        <div className="depth-users">
                          {users.map(userId => (
                            <span key={userId} className="depth-user">{userId}</span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            <div className="reach-set-display">
              <h4>Complete Reach Set</h4>
              <div className="reach-users">
                {Array.from(network.getReachSet(selectedUser)).map(userId => (
                  <div key={userId} className="reach-user">
                    <span className="user-name">{userId}</span>
                    <span className="user-reach">→ {network.calculateReach(userId)}</span>
                  </div>
                ))}
                {network.getReachSet(selectedUser).size === 0 && (
                  <p className="empty-reach">No downstream referrals</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkAnalyzer;
