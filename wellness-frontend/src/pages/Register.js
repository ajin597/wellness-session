import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
    const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await api.post('/users/register/', { username, password });
      setMsg('Registered successfully. Please login.');
      setUsername(''); setPassword('');
      navigate('/login');  
    } catch (err) {
      setMsg(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {msg && <div style={{ marginBottom: 10 }}>{msg}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
