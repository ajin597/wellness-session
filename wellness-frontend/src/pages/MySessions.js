import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMySessions() {
      try {
        const res = await api.get('/sessions/my/');
        setSessions(res.data);
      } catch {
        setError('Failed to load sessions');
      }
    }
    fetchMySessions();
  }, []);

  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Sessions</h2>
      {sessions.length === 0 ? (
        <p style={styles.emptyMsg}>No sessions found.</p>
      ) : (
        <ul style={styles.list}>
          {sessions.map(s => (
            <li key={s.id} style={styles.card}>
              <Link to={`/editor?id=${s.id}`} style={styles.link}>
                {s.title || '(Untitled)'}
              </Link>
              <span style={s.is_published ? styles.published : styles.draft}>
                {s.is_published ? 'Published' : 'Draft'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '30px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 20,
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyMsg: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#777',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  card: {
    backgroundColor: '#f7f9fc',
    padding: 15,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    fontWeight: '600',
    fontSize: 18,
    color: '#34495e',
    textDecoration: 'none',
  },
  published: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  draft: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
};
