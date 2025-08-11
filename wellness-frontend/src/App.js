import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Sessions from './pages/Sessions';
import MySessions from './pages/MySessions';
import Editor from './pages/Editor';
import RequireAuth from './components/RequireAuth';
import { removeTokens, removeUsername, getUsername } from './utils/auth';

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedUser = getUsername();
    if (storedUser) setUsername(storedUser);
  }, []);

  const logout = () => {
    removeTokens();
    removeUsername();
    setUsername(null);
    window.location.href = '/';
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/sessions" style={styles.navLink}>Public Sessions</Link>
          <Link to="/my-sessions" style={styles.navLink}>My Sessions</Link>
          <Link to="/editor" style={styles.navLink}>Editor</Link>

          {!username ? (
            <>
              <Link to="/register" style={styles.navLink}>Register</Link>
              <Link to="/login" style={styles.navLink}>Login</Link>
            </>
          ) : (
            <>
              <span style={styles.username}>Hi, {username}</span>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/register" element={<Register setUsername={setUsername} />} />
          <Route path="/login" element={<Login setUsername={setUsername} />} />
          <Route path="/my-sessions" element={
            <RequireAuth><MySessions /></RequireAuth>
          } />
          <Route path="/editor" element={
            <RequireAuth><Editor /></RequireAuth>
          } />
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    color: '#2c3e50',
  },
  header: {
    backgroundColor: '#34495e',
    padding: '15px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  nav: {
    maxWidth: 960,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: 4,
    transition: 'background-color 0.3s',
  },
  username: {
    marginLeft: 'auto',
    color: '#ecf0f1',
    fontWeight: '600',
  },
  logoutBtn: {
    marginLeft: 12,
    padding: '6px 14px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  main: {
    maxWidth: 960,
    margin: '40px auto',
    padding: '0 20px',
  },
};

export default App;
