/**
 * Simplified Network Builder Component for Testing
 */

import React, { useState } from 'react';

const SimpleNetworkBuilder = () => {
  const [users, setUsers] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [referrerId, setReferrerId] = useState('');
  const [candidateId, setCandidateId] = useState('');

  const addUser = () => {
    if (newUser.trim() && !users.includes(newUser.trim())) {
      setUsers([...users, newUser.trim()]);
      setNewUser('');
    }
  };

  const addReferral = () => {
    if (referrerId.trim() && candidateId.trim()) {
      const referral = `${referrerId} → ${candidateId}`;
      setReferrals([...referrals, referral]);
      setReferrerId('');
      setCandidateId('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Network Builder</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Add User</h3>
        <input
          type="text"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          placeholder="Enter user ID"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button onClick={addUser} style={{ padding: '8px 16px' }}>
          Add User
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Add Referral</h3>
        <select
          value={referrerId}
          onChange={(e) => setReferrerId(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="">Select Referrer</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
        <select
          value={candidateId}
          onChange={(e) => setCandidateId(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="">Select Candidate</option>
          {users.map(user => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
        <button onClick={addReferral} style={{ padding: '8px 16px' }}>
          Add Referral
        </button>
      </div>

      <div>
        <h3>Current Network</h3>
        <p><strong>Users:</strong> {users.join(', ')}</p>
        <p><strong>Referrals:</strong></p>
        <ul>
          {referrals.map((referral, index) => (
            <li key={index}>{referral}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SimpleNetworkBuilder;
