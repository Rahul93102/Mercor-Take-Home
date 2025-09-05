/**
 * Algorithm Visualization Component
 * 
 * Animated visualization of network growth and referral algorithms
 */

import React, { useState, useEffect, useCallback } from 'react';

const AlgorithmVisualizer = ({ 
  type = 'referral', 
  data = [], 
  autoPlay = true, 
  speed = 1000,
  onComplete = () => {}
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizationData, setVisualizationData] = useState([]);
  const [algorithm, setAlgorithm] = useState('breadth-first');

  // Initialize visualization based on type
  useEffect(() => {
    switch (type) {
      case 'referral':
        initializeReferralVisualization();
        break;
      case 'sorting':
        initializeSortingVisualization();
        break;
      case 'network-growth':
        initializeNetworkGrowthVisualization();
        break;
      default:
        initializeReferralVisualization();
    }
  }, [type, data]);

  useEffect(() => {
    if (autoPlay && visualizationData.length > 0) {
      setIsPlaying(true);
    }
  }, [visualizationData, autoPlay]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < visualizationData.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= visualizationData.length - 1) {
            setIsPlaying(false);
            onComplete();
          }
          return next;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, visualizationData.length, speed, onComplete]);

  const initializeReferralVisualization = () => {
    // Simulate referral network growth with 10 people
    const steps = [
      { step: 0, nodes: [{ id: 'root', x: 50, y: 50, level: 0, active: true, newlyAdded: false }], description: 'Initial referrer' },
      { step: 1, nodes: [
        { id: 'root', x: 50, y: 20, level: 0, active: true, newlyAdded: false },
        { id: 'r1', x: 25, y: 50, level: 1, active: true, newlyAdded: true },
        { id: 'r2', x: 75, y: 50, level: 1, active: true, newlyAdded: true }
      ], description: 'First 2 referrals added' },
      { step: 2, nodes: [
        { id: 'root', x: 50, y: 15, level: 0, active: true, newlyAdded: false },
        { id: 'r1', x: 25, y: 35, level: 1, active: true, newlyAdded: false },
        { id: 'r2', x: 75, y: 35, level: 1, active: true, newlyAdded: false },
        { id: 'r1-1', x: 15, y: 65, level: 2, active: true, newlyAdded: true },
        { id: 'r1-2', x: 35, y: 65, level: 2, active: true, newlyAdded: true },
        { id: 'r2-1', x: 65, y: 65, level: 2, active: true, newlyAdded: true },
        { id: 'r2-2', x: 85, y: 65, level: 2, active: true, newlyAdded: true }
      ], description: 'Network expands to 6 people' },
      { step: 3, nodes: [
        { id: 'root', x: 50, y: 10, level: 0, active: true, newlyAdded: false },
        { id: 'r1', x: 25, y: 30, level: 1, active: true, newlyAdded: false },
        { id: 'r2', x: 75, y: 30, level: 1, active: true, newlyAdded: false },
        { id: 'r1-1', x: 15, y: 50, level: 2, active: true, newlyAdded: false },
        { id: 'r1-2', x: 35, y: 50, level: 2, active: true, newlyAdded: false },
        { id: 'r2-1', x: 65, y: 50, level: 2, active: true, newlyAdded: false },
        { id: 'r2-2', x: 85, y: 50, level: 2, active: true, newlyAdded: false },
        { id: 'r1-1-1', x: 5, y: 75, level: 3, active: true, newlyAdded: true },
        { id: 'r1-1-2', x: 25, y: 75, level: 3, active: true, newlyAdded: true },
        { id: 'r2-2-1', x: 75, y: 75, level: 3, active: true, newlyAdded: true },
        { id: 'r2-2-2', x: 95, y: 75, level: 3, active: true, newlyAdded: true }
      ], description: 'Network reaches 10+ people - Algorithm triggered!' }
    ];
    setVisualizationData(steps);
  };

  const initializeSortingVisualization = () => {
    // Create sorting visualization for referral reach values
    const referralValues = data.length > 0 ? data : [5, 12, 3, 8, 15, 7, 10, 2, 11, 6];
    const steps = bubbleSortSteps(referralValues);
    setVisualizationData(steps);
  };

  const initializeNetworkGrowthVisualization = () => {
    // Simulate exponential network growth
    const steps = [];
    let currentSize = 1;
    for (let day = 0; day <= 30; day += 5) {
      const growthRate = 1.1 + (Math.sin(day / 10) * 0.1);
      currentSize *= growthRate;
      steps.push({
        step: day / 5,
        day,
        size: Math.round(currentSize),
        growth: currentSize > 1 ? ((currentSize - 1) * 100).toFixed(1) : 0,
        description: `Day ${day}: ${Math.round(currentSize)} users in network`
      });
    }
    setVisualizationData(steps);
  };

  const bubbleSortSteps = (arr) => {
    const steps = [];
    const array = [...arr];
    const n = array.length;
    
    steps.push({
      step: 0,
      array: [...array],
      comparing: [],
      swapping: false,
      description: 'Initial referral reach values'
    });

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Show comparison
        steps.push({
          step: steps.length,
          array: [...array],
          comparing: [j, j + 1],
          swapping: false,
          description: `Comparing reaches: ${array[j]} vs ${array[j + 1]}`
        });

        if (array[j] > array[j + 1]) {
          // Show swap
          steps.push({
            step: steps.length,
            array: [...array],
            comparing: [j, j + 1],
            swapping: true,
            description: `Swapping: ${array[j]} ↔ ${array[j + 1]}`
          });

          // Perform swap
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          
          steps.push({
            step: steps.length,
            array: [...array],
            comparing: [],
            swapping: false,
            description: `Swapped successfully`
          });
        }
      }
    }

    steps.push({
      step: steps.length,
      array: [...array],
      comparing: [],
      swapping: false,
      description: 'Sorting complete - Top referrers identified!'
    });

    return steps;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStep < visualizationData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderReferralVisualization = () => {
    if (!visualizationData[currentStep]) return null;
    
    const currentData = visualizationData[currentStep];
    const levelColors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

    return (
      <div className="referral-network">
        <svg viewBox="0 0 100 100" className="network-svg">
          {/* Draw connections */}
          {currentData.nodes.map(node => {
            const parent = currentData.nodes.find(n => 
              node.id.startsWith(n.id) && node.id !== n.id && node.level === n.level + 1
            );
            if (parent) {
              return (
                <line
                  key={`${parent.id}-${node.id}`}
                  x1={parent.x}
                  y1={parent.y}
                  x2={node.x}
                  y2={node.y}
                  stroke="#ddd"
                  strokeWidth="0.3"
                  className="connection-line"
                />
              );
            }
            return null;
          })}
          
          {/* Draw nodes */}
          {currentData.nodes.map(node => (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.newlyAdded ? "2.5" : "2"}
              fill={levelColors[node.level] || '#6c757d'}
              className={`network-node ${node.newlyAdded ? 'newly-added' : ''} ${node.active ? 'active' : ''}`}
            />
          ))}
        </svg>
        
        <div className="network-stats">
          <div className="stat">
            <span className="label">Total Users:</span>
            <span className="value">{currentData.nodes.length}</span>
          </div>
          <div className="stat">
            <span className="label">Network Levels:</span>
            <span className="value">{Math.max(...currentData.nodes.map(n => n.level)) + 1}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSortingVisualization = () => {
    if (!visualizationData[currentStep]) return null;
    
    const currentData = visualizationData[currentStep];
    const maxValue = Math.max(...currentData.array);

    return (
      <div className="sorting-visualization">
        <div className="sorting-bars">
          {currentData.array.map((value, index) => (
            <div
              key={index}
              className={`sort-bar ${
                currentData.comparing.includes(index) ? 'comparing' : ''
              } ${currentData.swapping && currentData.comparing.includes(index) ? 'swapping' : ''}`}
              style={{
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: currentData.comparing.includes(index) ? '#ffc107' : '#007bff'
              }}
            >
              <span className="bar-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNetworkGrowthVisualization = () => {
    if (!visualizationData[currentStep]) return null;
    
    const currentData = visualizationData[currentStep];

    return (
      <div className="growth-visualization">
        <div className="growth-chart">
          <div className="growth-bar" style={{ width: `${Math.min(currentData.size / 100 * 100, 100)}%` }}>
            <span className="growth-value">{currentData.size}</span>
          </div>
        </div>
        <div className="growth-metrics">
          <div className="metric">
            <span className="metric-label">Day:</span>
            <span className="metric-value">{currentData.day}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Growth:</span>
            <span className="metric-value">{currentData.growth}%</span>
          </div>
        </div>
      </div>
    );
  };

  const renderVisualization = () => {
    switch (type) {
      case 'referral':
        return renderReferralVisualization();
      case 'sorting':
        return renderSortingVisualization();
      case 'network-growth':
        return renderNetworkGrowthVisualization();
      default:
        return renderReferralVisualization();
    }
  };

  return (
    <div className="algorithm-visualizer">
      <div className="visualizer-header">
        <h3>Algorithm Visualization: {type.replace('-', ' ').toUpperCase()}</h3>
        <div className="algorithm-selector">
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value)}
            className="algorithm-select"
          >
            <option value="breadth-first">Breadth-First Search</option>
            <option value="depth-first">Depth-First Search</option>
            <option value="bubble-sort">Bubble Sort</option>
            <option value="network-analysis">Network Analysis</option>
          </select>
        </div>
      </div>

      <div className="visualization-container">
        {renderVisualization()}
      </div>

      <div className="visualization-description">
        {visualizationData[currentStep]?.description || 'Loading visualization...'}
      </div>

      <div className="visualizer-controls">
        <button onClick={prevStep} disabled={currentStep === 0} className="control-btn">
          ⏮ Prev
        </button>
        <button onClick={togglePlayPause} className="control-btn play-pause">
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={nextStep} disabled={currentStep >= visualizationData.length - 1} className="control-btn">
          Next ⏭
        </button>
        <button onClick={resetVisualization} className="control-btn">
          🔄 Reset
        </button>
        
        <div className="step-indicator">
          Step {currentStep + 1} / {visualizationData.length}
        </div>
      </div>

      <style jsx>{`
        .algorithm-visualizer {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
        }

        .visualizer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .visualizer-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .algorithm-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          font-size: 14px;
        }

        .visualization-container {
          min-height: 300px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .referral-network {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .network-svg {
          width: 100%;
          height: 200px;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          background: white;
        }

        .network-node {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .network-node.newly-added {
          animation: nodeAppear 0.6s ease-out;
        }

        .network-node.active:hover {
          r: 3;
          opacity: 0.8;
        }

        .connection-line {
          animation: lineAppear 0.4s ease-out;
        }

        .network-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .stat .label {
          font-size: 12px;
          color: #666;
        }

        .stat .value {
          font-size: 20px;
          font-weight: bold;
          color: #007bff;
        }

        .sorting-visualization {
          height: 200px;
          display: flex;
          align-items: flex-end;
          padding: 20px;
        }

        .sorting-bars {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          width: 100%;
          height: 100%;
        }

        .sort-bar {
          flex: 1;
          min-height: 20px;
          border-radius: 4px 4px 0 0;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          transition: all 0.3s ease;
          position: relative;
        }

        .sort-bar.comparing {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
        }

        .sort-bar.swapping {
          animation: swap 0.5s ease-in-out;
        }

        .bar-value {
          color: white;
          font-size: 12px;
          font-weight: bold;
          padding: 2px;
        }

        .growth-visualization {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .growth-chart {
          height: 60px;
          background: #e9ecef;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
        }

        .growth-bar {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #28a745);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 15px;
          transition: width 1s ease-out;
          position: relative;
        }

        .growth-value {
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .growth-metrics {
          display: flex;
          justify-content: center;
          gap: 40px;
        }

        .metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
        }

        .metric-label {
          font-size: 12px;
          color: #666;
        }

        .metric-value {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
        }

        .visualization-description {
          text-align: center;
          padding: 15px;
          background: linear-gradient(135deg, #e3f2fd, #f8f9fa);
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: 500;
          color: #333;
        }

        .visualizer-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .control-btn {
          padding: 10px 15px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .control-btn:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .control-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .control-btn.play-pause {
          background: #28a745;
          font-weight: bold;
          padding: 10px 20px;
        }

        .control-btn.play-pause:hover {
          background: #1e7e34;
        }

        .step-indicator {
          padding: 8px 12px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          font-size: 14px;
          color: #666;
        }

        @keyframes nodeAppear {
          0% {
            r: 0;
            opacity: 0;
          }
          50% {
            r: 3;
            opacity: 0.8;
          }
          100% {
            r: 2.5;
            opacity: 1;
          }
        }

        @keyframes lineAppear {
          from {
            stroke-opacity: 0;
            stroke-dasharray: 2;
            stroke-dashoffset: 4;
          }
          to {
            stroke-opacity: 1;
            stroke-dasharray: none;
            stroke-dashoffset: 0;
          }
        }

        @keyframes swap {
          0%, 100% {
            transform: scale(1.1);
          }
          50% {
            transform: scale(1.3) rotateY(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AlgorithmVisualizer;
