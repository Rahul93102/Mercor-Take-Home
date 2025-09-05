/**
 * Simple Test App to isolate dashboard issues
 */

import React, { useState, useCallback } from 'react';
import { InfluencerAnalysis } from './InfluencerAnalysis';
import './App.css';

function App() {
  // Initialize network only once
  const [networkData, setNetworkData] = useState(() => new InfluencerAnalysis());

  const handleNetworkUpdate = useCallback((network) => {
    setNetworkData(network);
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
}

export default App;
