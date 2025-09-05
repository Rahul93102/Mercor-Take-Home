/**
 * Influencer Finder Component - Part 3 Implementation
 * 
 * Interface for advanced influencer identification using unique reach and flow centrality
 */

import React, { useState, useEffect } from 'react';

const InfluencerFinder = ({ network }) => {
  const [uniqueReachResults, setUniqueReachResults] = useState(null);
  const [flowCentralityResults, setFlowCentralityResults] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [maxInfluencers, setMaxInfluencers] = useState(10);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (network && network.getAllUsers().size > 0) {
      calculateInfluencers();
    }
  }, [network, maxInfluencers]);

  const calculateInfluencers = async () => {
    if (!network) return;

    setIsCalculating(true);
    
    try {
      // Use setTimeout to allow UI to update
      setTimeout(() => {
        const uniqueReach = network.calculateUniqueReachExpansion(maxInfluencers);
        const flowCentrality = network.calculateFlowCentrality(maxInfluencers);
        const comparisonData = network.getInfluencerComparison(maxInfluencers);

        setUniqueReachResults(uniqueReach);
        setFlowCentralityResults(flowCentrality);
        setComparison(comparisonData);
        setIsCalculating(false);
      }, 100);
    } catch (error) {
      console.error('Error calculating influencers:', error);
      setIsCalculating(false);
    }
  };

  const handleMaxInfluencersChange = (e) => {
    const value = parseInt(e.target.value) || 10;
    setMaxInfluencers(Math.min(Math.max(value, 1), 50)); // Limit to reasonable range
  };

  if (!network || network.getAllUsers().size === 0) {
    return (
      <div className="influencer-finder">
        <div className="section-header">
          <h2>Influencer Finder</h2>
          <p>Identify key influencers using advanced metrics</p>
        </div>
        <div className="empty-state">
          <h3>No Network Data Available</h3>
          <p>Please build a network first using the Network Builder tab</p>
        </div>
      </div>
    );
  }

  return (
    <div className="influencer-finder">
      <div className="section-header">
        <h2>Influencer Finder</h2>
        <p>Advanced influencer identification using sophisticated algorithms</p>
      </div>

      <div className="controls-section">
        <div className="control-group">
          <label htmlFor="max-influencers">Maximum influencers to analyze:</label>
          <input
            id="max-influencers"
            type="number"
            value={maxInfluencers}
            onChange={handleMaxInfluencersChange}
            min="1"
            max="50"
            className="number-input"
          />
          <button 
            onClick={calculateInfluencers} 
            className="btn btn-primary"
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Recalculate'}
          </button>
        </div>
      </div>

      {isCalculating && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Calculating advanced influence metrics...</p>
        </div>
      )}

      {!isCalculating && (
        <div className="metrics-grid">
          <div className="metric-panel">
            <div className="panel-header">
              <h3>🎯 Unique Reach Expansion</h3>
              <p>Greedy algorithm for maximum unique audience coverage</p>
              <div className="business-use">
                <strong>Best for:</strong> Cost-optimized marketing campaigns with budget constraints
              </div>
            </div>

            {uniqueReachResults && (
              <div className="unique-reach-results">
                <div className="summary-stats">
                  <div className="stat-card">
                    <div className="stat-value">{uniqueReachResults.totalUniqueCoverage}</div>
                    <div className="stat-label">Total Unique Coverage</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{uniqueReachResults.efficiency.toFixed(2)}</div>
                    <div className="stat-label">Efficiency (Coverage/Influencer)</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{uniqueReachResults.selectedReferrers.length}</div>
                    <div className="stat-label">Selected Influencers</div>
                  </div>
                </div>

                <div className="influencers-list">
                  <h4>Selected Influencers (Greedy Order)</h4>
                  {uniqueReachResults.selectedReferrers.map((influencer, index) => (
                    <div key={influencer.userId} className="influencer-item unique-reach">
                      <div className="influencer-rank">#{index + 1}</div>
                      <div className="influencer-info">
                        <div className="influencer-name">{influencer.userId}</div>
                        <div className="influencer-metrics">
                          <div className="metric">
                            <span className="metric-label">Unique Contribution:</span>
                            <span className="metric-value">{influencer.uniqueContribution}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Total Reach:</span>
                            <span className="metric-value">{influencer.totalReach}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Efficiency:</span>
                            <span className="metric-value">
                              {((influencer.uniqueContribution / influencer.totalReach) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="contribution-bar">
                        <div 
                          className="contribution-fill"
                          style={{
                            width: `${(influencer.uniqueContribution / uniqueReachResults.totalUniqueCoverage) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="metric-panel">
            <div className="panel-header">
              <h3>🌐 Flow Centrality</h3>
              <p>Betweenness centrality for identifying critical network brokers</p>
              <div className="business-use">
                <strong>Best for:</strong> Network resilience and organizational design
              </div>
            </div>

            <div className="flow-centrality-results">
              {flowCentralityResults.length > 0 ? (
                <div className="brokers-list">
                  <h4>Top Network Brokers</h4>
                  {flowCentralityResults.map((broker, index) => (
                    <div key={broker.userId} className="influencer-item flow-centrality">
                      <div className="influencer-rank">#{index + 1}</div>
                      <div className="influencer-info">
                        <div className="influencer-name">{broker.userId}</div>
                        <div className="influencer-metrics">
                          <div className="metric">
                            <span className="metric-label">Centrality Score:</span>
                            <span className="metric-value">{broker.centralityScore}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Normalized Score:</span>
                            <span className="metric-value">{broker.normalizedScore.toFixed(4)}</span>
                          </div>
                          <div className="metric">
                            <span className="metric-label">Critical Paths:</span>
                            <span className="metric-value">{broker.centralityScore} shortest paths</span>
                          </div>
                        </div>
                      </div>
                      <div className="centrality-bar">
                        <div 
                          className="centrality-fill"
                          style={{
                            width: `${(broker.centralityScore / (flowCentralityResults[0]?.centralityScore || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-brokers">
                  <p>No significant brokers found in current network structure</p>
                  <p className="help-text">
                    Flow centrality requires users who lie on shortest paths between other users.
                    Try building a more interconnected network structure.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {comparison && !isCalculating && (
        <div className="comparison-panel">
          <div className="panel-header">
            <h3>📊 Metric Comparison</h3>
            <p>Comprehensive comparison of all influence metrics</p>
          </div>

          <div className="comparison-tabs">
            <div className="metric-comparison">
              <h4>Business Scenario Guide</h4>
              <div className="scenario-grid">
                <div className="scenario-card">
                  <div className="scenario-header">
                    <h5>🎯 Reach Metric</h5>
                    <span className="scenario-badge">Viral Marketing</span>
                  </div>
                  <div className="scenario-content">
                    <p><strong>Best for:</strong> Brand awareness, viral campaigns</p>
                    <p><strong>Use when:</strong> Raw exposure matters most</p>
                    <p><strong>Top performer:</strong> {comparison.byReach[0]?.userId || 'N/A'} 
                      ({comparison.byReach[0]?.reach || 0} reach)</p>
                  </div>
                </div>

                <div className="scenario-card">
                  <div className="scenario-header">
                    <h5>💰 Unique Reach</h5>
                    <span className="scenario-badge">Budget Optimization</span>
                  </div>
                  <div className="scenario-content">
                    <p><strong>Best for:</strong> Cost-optimized marketing</p>
                    <p><strong>Use when:</strong> Budget constraints exist</p>
                    <p><strong>Total coverage:</strong> {comparison.byUniqueReach[0]?.uniqueContribution || 0} unique users</p>
                  </div>
                </div>

                <div className="scenario-card">
                  <div className="scenario-header">
                    <h5>🌐 Flow Centrality</h5>
                    <span className="scenario-badge">Network Resilience</span>
                  </div>
                  <div className="scenario-content">
                    <p><strong>Best for:</strong> Organizational design, knowledge sharing</p>
                    <p><strong>Use when:</strong> Network stability matters</p>
                    <p><strong>Top broker:</strong> {comparison.byFlowCentrality[0]?.userId || 'N/A'} 
                      ({comparison.byFlowCentrality[0]?.centralityScore || 0} score)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-metrics">
            <h4>Summary Statistics</h4>
            <div className="summary-grid">
              <div className="summary-stat">
                <span className="stat-label">Active Referrers:</span>
                <span className="stat-value">{comparison.summary.totalActiveReferrers}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Maximum Individual Reach:</span>
                <span className="stat-value">{comparison.summary.maxReach}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Unique Coverage Achieved:</span>
                <span className="stat-value">{comparison.summary.totalUniqueCoverage}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Top Broker Score:</span>
                <span className="stat-value">{comparison.summary.topBrokerScore}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfluencerFinder;
