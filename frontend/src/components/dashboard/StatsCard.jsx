import React, { useState, useEffect } from 'react';

const StatsCard = ({ title, value, change, icon: Icon, color, delay = 0 }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setAnimatedValue(Math.floor(value * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 group-hover:rotate-3`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
          isPositive 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>
      
      <div>
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 tabular-nums">
          {animatedValue.toLocaleString()}
        </p>
      </div>

      <div className="mt-4 flex items-center">
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full ${color.replace('bg-', 'bg-')} rounded-full transition-all duration-1000 ease-out`}
            style={{ 
              width: `${Math.min((animatedValue / value) * 100, 100)}%`,
              transitionDelay: `${delay}ms`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
