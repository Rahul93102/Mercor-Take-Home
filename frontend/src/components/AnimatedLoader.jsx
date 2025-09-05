/**
 * Animated Loading Component
 * 
 * Beautiful loading animation with project-specific indicators
 */

import React from 'react';

const AnimatedLoader = ({ message = "Loading...", components = [] }) => {
  const defaultComponents = [
    { label: "Add User", color: "#007bff", delay: "0s" },
    { label: "Build Network", color: "#28a745", delay: "0.3s" },
    { label: "Calculate Reach", color: "#ffc107", delay: "0.6s" },
    { label: "Analyze Probability", color: "#dc3545", delay: "0.9s" }
  ];

  const loadingComponents = components.length > 0 ? components : defaultComponents;

  return (
    <div className="animated-loader">
      <div className="loader-container">
        <div className="loading-circles">
          {loadingComponents.map((comp, index) => (
            <div
              key={index}
              className="loading-circle"
              style={{
                backgroundColor: comp.color,
                animationDelay: comp.delay
              }}
            >
              <div className="circle-pulse" style={{ backgroundColor: comp.color }}></div>
            </div>
          ))}
        </div>
        
        <div className="loading-labels">
          {loadingComponents.map((comp, index) => (
            <div
              key={index}
              className="loading-label"
              style={{
                color: comp.color,
                animationDelay: comp.delay
              }}
            >
              {comp.label}
            </div>
          ))}
        </div>
        
        <div className="loading-message">
          <span className="message-text">{message}</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animated-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          padding: 40px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
          border-radius: 12px;
          margin: 20px 0;
        }

        .loader-container {
          text-align: center;
        }

        .loading-circles {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .loading-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: relative;
          animation: bounce 1.5s ease-in-out infinite;
        }

        .circle-pulse {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          opacity: 0.3;
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-labels {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .loading-label {
          font-size: 12px;
          font-weight: 600;
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .loading-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .message-text {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }

        .loading-dots {
          display: flex;
          gap: 4px;
        }

        .loading-dots span {
          width: 6px;
          height: 6px;
          background: #007bff;
          border-radius: 50%;
          animation: dotPulse 1.4s ease-in-out infinite both;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8) translateY(0);
            opacity: 0.7;
          }
          40% {
            transform: scale(1.2) translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 0.8;
            transform: translateY(0);
          }
        }

        @keyframes dotPulse {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLoader;
