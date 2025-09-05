/**
 * Simple Test App to isolate dashboard issues
 */

import React, { useState, useCallback, useMemo } from 'react';
import { InfluencerAnalysis } from './InfluencerAnalysis';
import './App.css';

const App = React.memo(() => {
  // Initialize network only once
  const network = useMemo(() => new InfluencerAnalysis(), []);
  const [networkData, setNetworkData] = useState(network);

  const handleNetworkUpdate = useCallback((net) => {
    setNetworkData(net);
  }, []);

  return (
    <div className="App">
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Referral Network Dashboard</h1>
        <p>Dashboard is loading...</p>
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          background: '#f0f0f0', 
          borderRadius: '8px' 
        }}>
          <p>Total Users: {networkData?.users?.size || 0}</p>
          <p>Total Referrals: {networkData ? Array.from(networkData.referrals.values()).reduce((sum, refs) => sum + refs.length, 0) : 0}</p>
          <p>Status: ✅ Basic components working</p>
        </div>
      </div>
    </div>
  );
});

export default App;
