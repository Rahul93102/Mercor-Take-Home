
import React, { useState, useEffect } from 'react';
import { BonusOptimization } from '../BonusOptimization';
import AnimatedLoader from './AnimatedLoader';
import AnimatedBarChart from './AnimatedBarChart';
import AlgorithmVisualizer from './AlgorithmVisualizer';

const BonusOptimizer = () => {
  const [days, setDays] = useState(60);
  const [targetHires, setTargetHires] = useState(500);
  const [recommendation, setRecommendation] = useState(null);
  const [sensitivityAnalysis, setSensitivityAnalysis] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedAdoptionFunction, setSelectedAdoptionFunction] = useState('sigmoid');
  
  const optimizer = new BonusOptimization();

  // Sample adoption probability functions
  const adoptionFunctions = {
    linear: (bonus) => Math.min(bonus / 1000, 1), // Linear up to $1000
    sigmoid: (bonus) => 1 / (1 + Math.exp(-(bonus - 200) / 100)), // Sigmoid centered at $200
    logarithmic: (bonus) => Math.min(Math.log(bonus + 1) / Math.log(1001), 1), // Log function
    exponential: (bonus) => Math.min(1 - Math.exp(-bonus / 300), 0.95), // Exponential saturation
    stepwise: (bonus) => {
      if (bonus < 50) return 0.05;
      if (bonus < 100) return 0.15;
      if (bonus < 200) return 0.35;
      if (bonus < 300) return 0.55;
      if (bonus < 500) return 0.75;
      return 0.85;
    }
  };

  const functionDescriptions = {
    linear: 'Linear adoption: probability increases linearly with bonus up to $1000',
    sigmoid: 'Sigmoid adoption: smooth S-curve with inflection point at $200',
    logarithmic: 'Logarithmic adoption: diminishing returns, levels off quickly',
    exponential: 'Exponential adoption: rapid initial growth, then saturation',
    stepwise: 'Stepwise adoption: discrete jumps in adoption at specific bonus levels'
  };

  useEffect(() => {
    calculateOptimalBonus();
  }, []);

  const calculateOptimalBonus = async () => {
    setIsCalculating(true);
    
    try {
      setTimeout(() => {
        const adoptionProb = adoptionFunctions[selectedAdoptionFunction];
        const rec = optimizer.getBonusRecommendation(days, targetHires, adoptionProb);
        const sensitivity = optimizer.analyzeBonusSensitivity(days, targetHires, adoptionProb, 1000, 20);
        
        setRecommendation(rec);
        setSensitivityAnalysis(sensitivity);
        setIsCalculating(false);
      }, 100);
    } catch (error) {
      console.error('Optimization error:', error);
      setIsCalculating(false);
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
      setTargetHires(value);
    }
  };

  const handleFunctionChange = (e) => {
    setSelectedAdoptionFunction(e.target.value);
  };

  return (
    <div className="bonus-optimizer">
      <div className="section-header">
        <h2>Bonus Optimizer</h2>
        <p>Find the minimum bonus required to achieve hiring targets efficiently</p>
      </div>

      <div className="optimizer-controls">
        <div className="control-grid">
          <div className="control-group">
            <label htmlFor="days">Target Timeframe (days):</label>
            <input
              id="days"
              type="number"
              value={days}
              onChange={handleDaysChange}
              min="1"
              max="365"
              className="number-input"
            />
            <span className="input-help">Number of days to achieve the hiring target</span>
          </div>

          <div className="control-group">
            <label htmlFor="target-hires">Target Hires:</label>
            <input
              id="target-hires"
              type="number"
              value={targetHires}
              onChange={handleTargetChange}
              min="1"
              className="number-input"
            />
            <span className="input-help">Number of successful hires needed</span>
          </div>

          <div className="control-group">
            <label htmlFor="adoption-function">Adoption Function:</label>
            <select
              id="adoption-function"
              value={selectedAdoptionFunction}
              onChange={handleFunctionChange}
              className="select-input"
            >
              {Object.keys(adoptionFunctions).map(key => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
            <span className="input-help">{functionDescriptions[selectedAdoptionFunction]}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={calculateOptimalBonus} 
            className="btn btn-primary"
            disabled={isCalculating}
          >
            {isCalculating ? 'Optimizing...' : 'Find Optimal Bonus'}
          </button>
        </div>
      </div>

      <div className="model-details">
        <h3>Optimization Model</h3>
        <div className="model-params">
          <div className="param-grid">
            <div className="param-item">
              <span className="param-label">Initial Referrers:</span>
              <span className="param-value">100</span>
            </div>
            <div className="param-item">
              <span className="param-label">Referral Capacity:</span>
              <span className="param-value">10 per user</span>
            </div>
            <div className="param-item">
              <span className="param-label">Bonus Increment:</span>
              <span className="param-value">$10</span>
            </div>
            <div className="param-item">
              <span className="param-label">Algorithm:</span>
              <span className="param-value">Binary Search</span>
            </div>
          </div>
        </div>
        
        <div className="complexity-analysis">
          <h4>Time Complexity Analysis</h4>
          <p><strong>Overall:</strong> O(days × log(max_bonus))</p>
          <ul>
            <li>Binary search over bonus amounts: O(log(max_bonus))</li>
            <li>Each simulation call: O(days)</li>
            <li>Max bonus typically bounded by adoption function characteristics</li>
          </ul>
        </div>
      </div>

      {isCalculating && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding optimal bonus amount...</p>
        </div>
      )}

      {recommendation && !isCalculating && (
        <div className="optimization-results">
          <div className="results-grid">
            <div className="recommendation-panel">
              <div className="panel-header">
                <h3>💡 Optimization Recommendation</h3>
                <div className={`confidence-badge ${recommendation.confidence?.toLowerCase()}`}>
                  Confidence: {recommendation.confidence}
                </div>
              </div>

              {recommendation.achievable ? (
                <div className="recommendation-content">
                  <div className="optimal-bonus">
                    <div className="bonus-amount">${recommendation.recommendation}</div>
                    <div className="bonus-label">Minimum Required Bonus</div>
                  </div>

                  <div className="business-insights">
                    <h4>Business Insights</h4>
                    <div className="insights-grid">
                      <div className="insight-item">
                        <span className="insight-label">Expected Hires:</span>
                        <span className="insight-value">{recommendation.businessInsights.expectedHires}</span>
                      </div>
                      <div className="insight-item">
                        <span className="insight-label">Daily Success Rate:</span>
                        <span className="insight-value">{recommendation.businessInsights.probabilityOfSuccess}</span>
                      </div>
                      <div className="insight-item">
                        <span className="insight-label">Daily Budget:</span>
                        <span className="insight-value">${recommendation.businessInsights.dailyBudget}</span>
                      </div>
                      <div className="insight-item">
                        <span className="insight-label">Cost per Hire:</span>
                        <span className="insight-value">${recommendation.businessInsights.costPerHire}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bonus-analysis">
                    <h4>Bonus Amount Analysis</h4>
                    <div className="bonus-scenarios">
                      {recommendation.bonusAnalysis.map((scenario, index) => (
                        <div key={scenario.bonus} className={`bonus-scenario ${scenario.bonus === recommendation.recommendation ? 'optimal' : ''}`}>
                          <div className="scenario-bonus">${scenario.bonus}</div>
                          <div className="scenario-details">
                            <div className="detail">
                              <span className="detail-label">Expected:</span>
                              <span className="detail-value">{scenario.expectedHires} hires</span>
                            </div>
                            <div className="detail">
                              <span className="detail-label">Surplus:</span>
                              <span className="detail-value">
                                {scenario.surplusHires > 0 ? '+' : ''}{scenario.surplusHires}
                              </span>
                            </div>
                            <div className="detail">
                              <span className="detail-label">Probability:</span>
                              <span className="detail-value">{(scenario.probability * 100).toFixed(1)}%</span>
                            </div>
                          </div>
                          {scenario.bonus === recommendation.recommendation && (
                            <div className="optimal-indicator">OPTIMAL</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="not-achievable">
                  <div className="not-achievable-message">
                    <h4>❌ Target Not Achievable</h4>
                    <p>{recommendation.reason}</p>
                  </div>
                  
                  <div className="alternatives">
                    <h4>Suggested Alternatives:</h4>
                    <div className="alternative-list">
                      <div className="alternative-item">
                        <strong>Extend Timeframe:</strong> {recommendation.alternatives.extendTimeframe}
                      </div>
                      <div className="alternative-item">
                        <strong>Reduce Target:</strong> {recommendation.alternatives.reduceTarget}
                      </div>
                      <div className="alternative-item">
                        <strong>Process Improvement:</strong> {recommendation.alternatives.improveProcess}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sensitivityAnalysis && !isCalculating && (
        <div className="sensitivity-analysis">
          <div className="panel-header">
            <h3>📊 Sensitivity Analysis</h3>
            <p>How hiring outcomes vary with bonus amounts</p>
          </div>

          <div className="sensitivity-summary">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Optimal Bonus:</span>
                <span className="stat-value">${sensitivityAnalysis.optimalBonus || 'N/A'}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Most Efficient Bonus:</span>
                <span className="stat-value">${sensitivityAnalysis.mostEfficientBonus || 'N/A'}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Max Efficiency:</span>
                <span className="stat-value">{sensitivityAnalysis.maxEfficiency.toFixed(4)} hires/$</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Target Achievable:</span>
                <span className="stat-value">{sensitivityAnalysis.targetAchievable ? '✅ Yes' : '❌ No'}</span>
              </div>
            </div>
          </div>

          <div className="sensitivity-chart">
            <h4>Expected Hires vs Bonus Amount</h4>
            <div className="chart-container">
              <div className="sensitivity-bars">
                {sensitivityAnalysis.results.filter((_, index) => index % 5 === 0).map((result, index) => (
                  <div key={result.bonus} className="sensitivity-bar-container">
                    <div 
                      className={`sensitivity-bar ${result.achievesTarget ? 'achieves-target' : ''} ${result.bonus === sensitivityAnalysis.optimalBonus ? 'optimal' : ''}`}
                      style={{
                        height: `${(result.expectedHires / targetHires) * 200}px`
                      }}
                      title={`$${result.bonus}: ${result.expectedHires.toFixed(1)} hires (${result.probability.toFixed(3)} prob)`}
                    ></div>
                    <div className="bar-label">${result.bonus}</div>
                  </div>
                ))}
              </div>
              <div className="target-line" style={{bottom: '200px'}}>
                <span>Target: {targetHires} hires</span>
              </div>
            </div>
          </div>

          <div className="efficiency-analysis">
            <h4>Cost Efficiency Analysis</h4>
            <div className="efficiency-chart">
              {sensitivityAnalysis.results.filter((_, index) => index % 10 === 0).map((result) => (
                <div key={result.bonus} className="efficiency-item">
                  <div className="efficiency-bonus">${result.bonus}</div>
                  <div className="efficiency-metrics">
                    <div className="efficiency-metric">
                      <span className="metric-label">Hires:</span>
                      <span className="metric-value">{result.expectedHires.toFixed(1)}</span>
                    </div>
                    <div className="efficiency-metric">
                      <span className="metric-label">Efficiency:</span>
                      <span className="metric-value">{result.efficiency.toFixed(4)}</span>
                    </div>
                    <div className="efficiency-metric">
                      <span className="metric-label">Probability:</span>
                      <span className="metric-value">{(result.probability * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  {result.bonus === sensitivityAnalysis.mostEfficientBonus && (
                    <div className="most-efficient-badge">Most Efficient</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonusOptimizer;
