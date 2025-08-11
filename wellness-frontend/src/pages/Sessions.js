import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/sessions/');
        setSessions(res.data);
      } catch (err) {
        setError('Failed to load sessions');
      }
    };
    fetch();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Public Wellness Sessions</h2>
      {error && <div style={styles.error}>{error}</div>}
      <ul style={styles.list}>
        {sessions.map(s => (
          <li key={s.id} style={styles.card}>
            <h3 style={styles.title}>{s.title || '(no title)'}</h3>
            <p style={styles.description}>{s.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: '20px auto',
    padding: '0 15px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
  },
  card: {
    backgroundColor: '#f7f9fc',
    borderRadius: 8,
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    padding: 20,
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
  },
  title: {
    margin: '0 0 10px',
    color: '#34495e',
  },
  description: {
    color: '#555',
    lineHeight: 1.4,
  },
};
