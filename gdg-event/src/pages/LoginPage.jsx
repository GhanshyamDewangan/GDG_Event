import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === 'NeoTech' && password === 'SRU123') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/scanner');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="animate-slide-up" style={{ width: '92%', maxWidth: '380px', margin: '1rem auto' }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          background: 'none', 
          border: 'none', 
          color: '#5f6368', 
          cursor: 'pointer', 
          marginBottom: '1rem',
          fontSize: '0.85rem',
          fontWeight: 700
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem 1.75rem', border: 'none', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            background: 'var(--google-blue)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 0.75rem',
            boxShadow: '0 8px 16px rgba(66, 133, 244, 0.2)'
          }}>
            <Lock color="white" size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#202124', letterSpacing: '-0.02em' }}>Admin Access</h2>
          <p style={{ color: '#5f6368', fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: 500 }}>Secure Login for Event Staff</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">User ID</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5f6368' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="Enter User ID" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5f6368' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '40px' }}
                placeholder="Enter Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--google-red)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
          >
            Login <LogIn size={18} />
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#5f6368', opacity: 0.7 }}>
        © 2026 Neo Tech Club x GDG Raipur
      </p>
    </div>
  );
};

export default LoginPage;
