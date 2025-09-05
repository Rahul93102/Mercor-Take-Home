/**
 * Growth Simulator Component - Part 4 Implementation
 * 
 * Interface for network growth simulation and scenario analysis
 */

import React, { useState, useEffect } from 'react';
import { NetworkGrowthSimulation } from '../NetworkGrowthSimulation';

const GrowthSimulator = () => {
  const [probability, setProbability] = useState(0.1);
  const [days, setDays] = useState(30);
  const [targetTotal, setTargetTotal] = useState(1000);
  const [simulationResults, setSimulationResults] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [daysToTarget, setDaysToTarget] = useState(null);
  const [scenarioComparison, setScenarioComparison] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulator = new NetworkGrowthSimulation();

  useEffect(() => {
    runSimulation();
  }, []);

  const runSimulation = async () => {
    setIsSimulating(true);
    
    try {
      // Use setTimeout to prevent UI blocking
      setTimeout(() => {
        const results = simulator.simulate(probability, days);
        const analyticsData = simulator.getSimulationAnalytics(probability, days);
        const daysNeeded = simulator.daysToTarget(probability, targetTotal);
        
        setSimulationResults(results);
        setAnalytics(analyticsData);
        setDaysToTarget(daysNeeded);
        setIsSimulating(false);
      }, 100);
    } catch (error) {
      console.error('Simulation error:', error);
      setIsSimulating(false);
    }
  };

  const runScenarioComparison = () => {
    const probabilities = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
    const comparison = simulator.compareScenarios(probabilities, days);
    setScenarioComparison(comparison);
  };

  const handleProbabilityChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value >= 0 && value <= 1) {
      setProbability(value);
    }
  };

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 365) {
      setDays(value);
    }
  };

  const handleTargetChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setTargetTotal(value);
    }
  };

  return (
    <div className="growth-simulator">
      <div className="section-header">
        <h2>Growth Simulator</h2>
        <p>Model referral network growth with configurable parameters</p>
      </div>

      <div className="simulation-controls">
        <div className="control-grid">
          <div className="control-group">
            <label htmlFor="probability">Daily Referral Probability:</label>
            <input
              id="probability"
              type="number"
              value={probability}
              onChange={handleProbabilityChange}
              min="0"
              max="1"
              step="0.01"
              className="number-input"
            />
            <span className="input-help">Probability (0-1) that each active referrer makes a successful referral per day</span>
          </div>

          <div className="control-group">
            <label htmlFor="days">Simulation Days:</label>
            <input
              id="days"
              type="number"
              value={days}
              onChange={handleDaysChange}
              min="1"
              max="365"
              className="number-input"
            />
            <span className="input-help">Number of days to simulate (1-365)</span>
          </div>

          <div className="control-group">
            <label htmlFor="target">Target Total Referrals:</label>
            <input
              id="target"
              type="number"
              value={targetTotal}
              onChange={handleTargetChange}
              min="1"
              className="number-input"
            />
            <span className="input-help">Target number of cumulative referrals</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={runSimulation} 
            className="btn btn-primary"
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </button>
          <button 
            onClick={runScenarioComparison} 
            className="btn btn-secondary"
          >
            Compare Scenarios
          </button>
        </div>
      </div>

      <div className="simulation-params">
        <h3>Simulation Parameters</h3>
        <div className="params-grid">
          <div className="param-item">
            <span className="param-label">Initial Referrers:</span>
            <span className="param-value">100</span>
          </div>
          <div className="param-item">
            <span className="param-label">Max Referrals per User:</span>
            <span className="param-value">10</span>
          </div>
          <div className="param-item">
            <span className="param-label">Time Unit:</span>
            <span className="param-value">Days</span>
          </div>
        </div>
      </div>

      {isSimulating && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Running growth simulation...</p>
        </div>
      )}

      {simulationResults && analytics && !isSimulating && (
        <div className="results-grid">
          <div className="results-panel">
            <div className="panel-header">
              <h3>Simulation Results</h3>
              <p>Growth trajectory over {days} days</p>
            </div>

            <div className="key-metrics">
              <div className="metric-card">
                <div className="metric-value">{analytics.totalReferrals.toFixed(0)}</div>
                <div className="metric-label">Final Total Referrals</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{analytics.averageDailyGrowth.toFixed(1)}</div>
                <div className="metric-label">Avg Daily Growth</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{analytics.peakGrowthDay}</div>
                <div className="metric-label">Peak Growth Day</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{analytics.peakGrowthRate.toFixed(1)}</div>
                <div className="metric-label">Peak Daily Growth</div>
              </div>
            </div>

            <div className="chart-container">
              <h4>Cumulative Referrals Over Time</h4>
              <div className="simple-chart">
                {simulationResults.map((value, index) => (
                  <div key={index} className="chart-point-container">
                    <div 
                      className="chart-bar"
                      style={{
                        height: `${(value / analytics.totalReferrals) * 200}px`,
                        opacity: 0.8
                      }}
                      title={`Day ${index + 1}: ${value.toFixed(1)} referrals`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="chart-labels">
                <span>Day 1</span>
                <span>Day {Math.floor(days / 2)}</span>
                <span>Day {days}</span>
              </div>
            </div>

            <div className="daily-growth-chart">
              <h4>Daily Growth Rate</h4>
              <div className="simple-chart growth-chart">
                {analytics.dailyGrowthRates.map((rate, index) => (
                  <div key={index} className="chart-point-container">
                    <div 
                      className="growth-bar"
                      style={{
                        height: `${(rate / analytics.peakGrowthRate) * 100}px`,
                        opacity: 0.7
                      }}
                      title={`Day ${index + 2}: ${rate.toFixed(1)} new referrals`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="target-analysis-panel">
            <div className="panel-header">
              <h3>Target Analysis</h3>
              <p>Time required to reach targets</p>
            </div>

            <div className="target-results">
              <div className="target-card">
                <div className="target-question">
                  Days to reach {targetTotal.toLocaleString()} referrals:
                </div>
                <div className="target-answer">
                  {daysToTarget === Infinity ? 
                    'Impossible with current probability' : 
                    `${daysToTarget} days`
                  }
                </div>
              </div>

              {daysToTarget !== Infinity && daysToTarget <= days && (
                <div className="target-achieved">
                  ✅ Target achieved within simulation period!
                </div>
              )}

              {daysToTarget !== Infinity && daysToTarget > days && (
                <div className="target-not-achieved">
                  ⏰ Target requires longer timeframe ({daysToTarget - days} more days)
                </div>
              )}

              {daysToTarget === Infinity && (
                <div className="target-impossible">
                  ❌ Target impossible with probability {probability}. Try increasing probability.
                </div>
              )}
            </div>

            <div className="target-variations">
              <h4>Time to Various Targets</h4>
              <div className="target-list">
                {[100, 500, 1000, 2000, 5000, 10000].map(target => {
                  const daysNeeded = simulator.daysToTarget(probability, target);
                  return (
                    <div key={target} className="target-item">
                      <span className="target-amount">{target.toLocaleString()}</span>
                      <span className="target-days">
                        {daysNeeded === Infinity ? '∞' : `${daysNeeded} days`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {scenarioComparison && (
        <div className="scenario-comparison">
          <div className="panel-header">
            <h3>Scenario Comparison</h3>
            <p>Comparing different probability scenarios over {days} days</p>
          </div>

          <div className="scenarios-grid">
            {scenarioComparison.scenarios.map((scenario, index) => (
              <div 
                key={scenario.probability} 
                className={`scenario-card ${scenario === scenarioComparison.bestScenario ? 'best-scenario' : ''}`}
              >
                <div className="scenario-header">
                  <h4>Probability: {(scenario.probability * 100).toFixed(0)}%</h4>
                  {scenario === scenarioComparison.bestScenario && (
                    <span className="best-badge">Best</span>
                  )}
                </div>
                <div className="scenario-metrics">
                  <div className="scenario-metric">
                    <span className="metric-label">Total Referrals:</span>
                    <span className="metric-value">{scenario.totalReferrals.toFixed(0)}</span>
                  </div>
                  <div className="scenario-metric">
                    <span className="metric-label">Avg Daily Growth:</span>
                    <span className="metric-value">{scenario.averageDailyGrowth.toFixed(1)}</span>
                  </div>
                  <div className="scenario-metric">
                    <span className="metric-label">Peak Growth:</span>
                    <span className="metric-value">{scenario.peakGrowthRate.toFixed(1)}</span>
                  </div>
                  <div className="scenario-metric">
                    <span className="metric-label">Growth Acceleration:</span>
                    <span className="metric-value">{scenario.growthAcceleration.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="comparison-summary">
            <h4>Summary Statistics</h4>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Best Scenario:</span>
                <span className="stat-value">
                  {(scenarioComparison.bestScenario.probability * 100).toFixed(0)}% 
                  ({scenarioComparison.bestScenario.totalReferrals.toFixed(0)} referrals)
                </span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Average Across Scenarios:</span>
                <span className="stat-value">{scenarioComparison.averageTotalReferrals.toFixed(0)} referrals</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthSimulator;
