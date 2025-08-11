import React, { useState } from 'react';
import api from '../services/api';
import { saveTokens, saveUsername } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUsername }) {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await api.post('/token/', { username, password });
      saveTokens({ access: res.data.access, refresh: res.data.refresh });
      saveUsername(username);
      setUsername(username);  
      navigate('/my-sessions');
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {msg && <div style={{ marginBottom: 10, color: 'red' }}>{msg}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={e => setLocalUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
