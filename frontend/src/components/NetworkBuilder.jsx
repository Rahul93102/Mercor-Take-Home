/**
 * Network Builder Component - Part 1 Implementation
 * 
 * Interactive interface for building and managing referral networks
 */

import React, { useState, useEffect } from 'react';
import { InfluencerAnalysis } from '../InfluencerAnalysis';

const NetworkBuilder = ({ network, onNetworkUpdate }) => {
  const [referrerId, setReferrerId] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [bulkUsers, setBulkUsers] = useState('');

  const showMessage = (text, type = 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddReferral = (e) => {
    e.preventDefault();
    
    if (!referrerId.trim() || !candidateId.trim()) {
      showMessage('Both referrer and candidate IDs are required', 'error');
      return;
    }

    try {
      network.addReferral(referrerId.trim(), candidateId.trim());
      showMessage(`Successfully added referral: ${referrerId} → ${candidateId}`, 'success');
      setReferrerId('');
      setCandidateId('');
      onNetworkUpdate(network);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleAddBulkUsers = () => {
    const users = bulkUsers.split(',').map(u => u.trim()).filter(u => u);
    let addedCount = 0;

    users.forEach(userId => {
      try {
        localNetwork.addUser(userId);
        addedCount++;
      } catch (error) {
        // User might already exist, which is fine
      }
    });

    showMessage(`Added ${addedCount} users to the network`, 'success');
    setBulkUsers('');
    onNetworkUpdate(localNetwork);
  };

  const handleLoadSampleData = () => {
    const sampleData = [
      ['alice', 'bob'],
      ['alice', 'charlie'],
      ['bob', 'david'],
      ['bob', 'eve'],
      ['charlie', 'frank'],
      ['david', 'george'],
      ['eve', 'helen'],
      ['frank', 'ivan'],
      ['george', 'jack'],
      ['helen', 'kate']
    ];

    sampleData.forEach(([referrer, candidate]) => {
      try {
        localNetwork.addReferral(referrer, candidate);
      } catch (error) {
        // Some referrals might already exist or create cycles
      }
    });

    showMessage('Sample data loaded successfully!', 'success');
    onNetworkUpdate(localNetwork);
  };

  const handleClearNetwork = () => {
    const newNetwork = new InfluencerAnalysis();
    setLocalNetwork(newNetwork);
    onNetworkUpdate(newNetwork);
    showMessage('Network cleared', 'info');
  };

  const stats = localNetwork.getStats();
  const allUsers = Array.from(localNetwork.getAllUsers()).sort();

  return (
    <div className="network-builder">
      <div className="section-header">
        <h2>Network Builder</h2>
        <p>Build your referral network by adding users and referral relationships</p>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="builder-grid">
        <div className="builder-panel">
          <div className="panel-header">
            <h3>Add Referral Relationship</h3>
            <p>Connect a referrer to a candidate (enforces acyclic graph)</p>
          </div>
          
          <form onSubmit={handleAddReferral} className="referral-form">
            <div className="form-group">
              <label htmlFor="referrer">Referrer ID:</label>
              <input
                id="referrer"
                type="text"
                value={referrerId}
                onChange={(e) => setReferrerId(e.target.value)}
                placeholder="Enter referrer user ID"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="candidate">Candidate ID:</label>
              <input
                id="candidate"
                type="text"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                placeholder="Enter candidate user ID"
                className="form-input"
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              Add Referral
            </button>
          </form>

          <div className="bulk-actions">
            <div className="form-group">
              <label htmlFor="bulk-users">Bulk Add Users (comma-separated):</label>
              <textarea
                id="bulk-users"
                value={bulkUsers}
                onChange={(e) => setBulkUsers(e.target.value)}
                placeholder="user1, user2, user3..."
                className="form-textarea"
                rows="3"
              />
              <button 
                onClick={handleAddBulkUsers}
                className="btn btn-secondary"
                disabled={!bulkUsers.trim()}
              >
                Add Users
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={handleLoadSampleData} className="btn btn-accent">
              Load Sample Data
            </button>
            <button onClick={handleClearNetwork} className="btn btn-danger">
              Clear Network
            </button>
          </div>
        </div>

        <div className="stats-panel">
          <div className="panel-header">
            <h3>Network Statistics</h3>
            <p>Current state of your referral network</p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalReferrals}</div>
              <div className="stat-label">Total Referrals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.usersWithReferrals}</div>
              <div className="stat-label">Active Referrers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.totalUsers > 0 ? (stats.totalReferrals / stats.totalUsers).toFixed(2) : '0'}
              </div>
              <div className="stat-label">Avg Referrals/User</div>
            </div>
          </div>

          <div className="user-list">
            <h4>All Users in Network ({allUsers.length})</h4>
            <div className="user-chips">
              {allUsers.map(userId => (
                <div key={userId} className="user-chip">
                  <span className="user-id">{userId}</span>
                  <span className="user-referrals">
                    {localNetwork.getDirectReferrals(userId).size} direct
                  </span>
                </div>
              ))}
              {allUsers.length === 0 && (
                <p className="empty-state">No users in network yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="network-visualization">
        <div className="panel-header">
          <h3>Network Relationships</h3>
          <p>Visual representation of referral connections</p>
        </div>
        
        <div className="relationships-list">
          {Array.from(localNetwork.referrals.entries()).map(([referrer, candidates]) => (
            Array.from(candidates).map(candidate => (
              <div key={`${referrer}-${candidate}`} className="relationship-item">
                <div className="referrer">{referrer}</div>
                <div className="arrow">→</div>
                <div className="candidate">{candidate}</div>
                <div className="relationship-info">
                  <span className="reach-info">
                    Reach: {localNetwork.calculateReach(candidate)}
                  </span>
                </div>
              </div>
            ))
          ))}
          {stats.totalReferrals === 0 && (
            <div className="empty-state">
              <p>No referral relationships yet</p>
              <p>Add some referrals to see the network structure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkBuilder;
