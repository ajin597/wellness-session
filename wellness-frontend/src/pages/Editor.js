import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Editor() {
  const [session, setSession] = useState({
    id: null,
    title: '',
    description: '',
    tags: '',
    jsonUrl: '',
  });
  const [status, setStatus] = useState('');
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');

  useEffect(() => {
    if (!sessionId) return;

    async function loadSession() {
      try {
        const res = await api.get(`/sessions/my/${sessionId}/`);
        setSession({
          id: res.data.id,
          title: res.data.title || '',
          description: res.data.description || '',
          tags: res.data.tags ? res.data.tags.join(', ') : '',
          jsonUrl: res.data.jsonUrl || '',
          is_published: res.data.is_published || false,
        });
      } catch (err) {
        setStatus('Failed to load session');
      }
    }
    loadSession();
  }, [sessionId]);


  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveDraft();
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [session.title, session.description, session.tags, session.jsonUrl]);

  const saveDraft = async () => {
    setStatus('Saving...');
    try {
      const payload = {
        id: session.id,
        title: session.title,
        description: session.description,
        tags: session.tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
        jsonUrl: session.jsonUrl,
      };
      const res = await api.post('/sessions/my/save-draft/', payload);
      setSession(prev => ({ ...prev, id: res.data.id }));
      setStatus('Saved');
      setTimeout(() => setStatus(''), 1000);
    } catch (err) {
      setStatus('Save failed');
      setTimeout(() => setStatus(''), 1500);
    }
  };

  const publish = async () => {
    if (!session.id) {
      await saveDraft();
    }
    try {
      await api.post('/sessions/my/publish/', { id: session.id });
      setStatus('Published');
      setTimeout(() => setStatus(''), 1500);
      navigate('/my-sessions');
    } catch (err) {
      setStatus('Publish failed');
      setTimeout(() => setStatus(''), 1500);
    }
  };

  return (
    <div>
      <h2>Session Editor</h2>
      <div>
        <input
          placeholder="Title"
          value={session.title}
          onChange={e => setSession({ ...session, title: e.target.value })}
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <textarea
          placeholder="Description"
          value={session.description}
          onChange={e => setSession({ ...session, description: e.target.value })}
          rows={8}
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Tags (comma separated)"
          value={session.tags}
          onChange={e => setSession({ ...session, tags: e.target.value })}
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="JSON file URL"
          value={session.jsonUrl}
          onChange={e => setSession({ ...session, jsonUrl: e.target.value })}
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={saveDraft}>Save Now</button>{' '}
        <button onClick={publish}>Publish</button>{' '}
        <button onClick={() => navigate('/my-sessions')}>Back</button>
        <span style={{ marginLeft: 12 }}>{status}</span>
      </div>
    </div>
  );
}
