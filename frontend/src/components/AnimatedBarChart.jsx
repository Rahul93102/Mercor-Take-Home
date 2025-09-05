/**
 * Animated Bar Chart Component
 * 
 * Custom animated bar chart with smooth transitions and hover effects
 */

import React, { useEffect, useRef, useState } from 'react';

const AnimatedBarChart = ({ 
  data = [], 
  title = "Chart", 
  height = 300, 
  animated = true,
  colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'],
  showValues = true,
  className = ""
}) => {
  const [animatedData, setAnimatedData] = useState([]);
  const chartRef = useRef(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    if (!animated) {
      setAnimatedData(data);
      return;
    }

    // Animate bars growing from 0 to their final values
    const maxValue = Math.max(...data.map(d => d.value));
    let currentStep = 0;
    const totalSteps = 60; // 60 frames for smooth animation
    
    const animateStep = () => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easedProgress = easeOutCubic(progress);
      
      const newData = data.map((item, index) => ({
        ...item,
        value: item.value * easedProgress,
        delay: index * 100 // Stagger animation
      }));
      
      setAnimatedData(newData);
      
      if (currentStep < totalSteps) {
        requestAnimationFrame(animateStep);
      }
    };
    
    // Start animation after a brief delay
    setTimeout(() => {
      requestAnimationFrame(animateStep);
    }, 200);
    
  }, [data, animated]);

  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  if (!data || data.length === 0) {
    return (
      <div className={`chart-container ${className}`}>
        <div className="chart-placeholder">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const displayData = animatedData.length > 0 ? animatedData : data;

  return (
    <div className={`animated-bar-chart ${className}`} ref={chartRef}>
      <div className="chart-title">{title}</div>
      
      <div className="chart-container" style={{ height: `${height}px` }}>
        <div className="y-axis">
          {[0, 25, 50, 75, 100].map(percent => (
            <div key={percent} className="y-axis-label">
              {Math.round((maxValue * percent) / 100)}
            </div>
          ))}
        </div>
        
        <div className="bars-container">
          {displayData.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100;
            const color = colors[index % colors.length];
            
            return (
              <div
                key={item.label || index}
                className="bar-wrapper"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{ animationDelay: `${(item.delay || 0)}ms` }}
              >
                <div
                  className={`bar ${hoveredBar === index ? 'hovered' : ''}`}
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: color,
                    transform: hoveredBar === index ? 'scaleY(1.05)' : 'scaleY(1)',
                    boxShadow: hoveredBar === index ? `0 4px 15px ${color}30` : 'none'
                  }}
                >
                  {showValues && (
                    <div className="bar-value">
                      {typeof item.value === 'number' ? item.value.toFixed(0) : item.value}
                    </div>
                  )}
                </div>
                
                <div className="bar-label">
                  {item.label || `Item ${index + 1}`}
                </div>
                
                {hoveredBar === index && (
                  <div className="tooltip">
                    <strong>{item.label}</strong>
                    <br />
                    Value: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                    {item.description && (
                      <>
                        <br />
                        <span className="tooltip-desc">{item.description}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .animated-bar-chart {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin: 20px 0;
          transition: all 0.3s ease;
        }

        .animated-bar-chart:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }

        .chart-container {
          position: relative;
          display: flex;
          align-items: flex-end;
          padding-left: 60px;
          padding-bottom: 40px;
        }

        .y-axis {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 40px;
          width: 50px;
          display: flex;
          flex-direction: column-reverse;
          justify-content: space-between;
        }

        .y-axis-label {
          font-size: 12px;
          color: #666;
          text-align: right;
          padding-right: 10px;
        }

        .bars-container {
          flex: 1;
          display: flex;
          align-items: flex-end;
          gap: 10px;
          height: 100%;
        }

        .bar-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .bar {
          width: 100%;
          max-width: 60px;
          background: linear-gradient(to top, currentColor, currentColor);
          border-radius: 4px 4px 0 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          cursor: pointer;
          transform-origin: bottom;
          animation: growUp 1s ease-out forwards;
        }

        .bar.hovered {
          transform: scaleY(1.05) scaleX(1.1);
        }

        .bar-value {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: 600;
          color: #333;
          background: rgba(255, 255, 255, 0.9);
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0;
          animation: fadeIn 0.5s ease-out 0.8s forwards;
        }

        .bar-label {
          margin-top: 10px;
          font-size: 12px;
          color: #666;
          text-align: center;
          word-break: break-word;
          max-width: 80px;
        }

        .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 10;
          animation: tooltipAppear 0.2s ease-out;
        }

        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.8);
        }

        .tooltip-desc {
          opacity: 0.8;
          font-style: italic;
        }

        .chart-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-style: italic;
        }

        @keyframes slideInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        @keyframes growUp {
          from {
            height: 0%;
          }
          to {
            height: var(--final-height, 100%);
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        @keyframes tooltipAppear {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBarChart;
