import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, LogOut, ArrowLeft, QrCode, ShieldCheck } from 'lucide-react';

const ScannerDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '400px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#5f6368', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={18} /> Exit
        </button>
        <button 
          onClick={handleLogout} 
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--google-red)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Logout <LogOut size={18} />
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: 'white', border: 'none' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'var(--google-blue-soft)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 1.5rem',
          border: '2px solid var(--google-blue)'
        }}>
          <ShieldCheck size={40} color="var(--google-blue)" />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#202124', marginBottom: '0.5rem' }}>Staff Portal</h2>
        <p style={{ color: '#5f6368', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Ready to verify event attendees? Tap below to initialize the optical scanner.
        </p>

        <button 
          onClick={() => navigate('/scan')}
          className="btn-primary"
          style={{ 
            width: '100%', 
            padding: '20px', 
            borderRadius: '20px', 
            fontSize: '1.1rem', 
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            height: 'auto',
            background: 'linear-gradient(135deg, var(--google-blue), #1a73e8)',
            boxShadow: '0 10px 25px rgba(66, 133, 244, 0.3)'
          }}
        >
          <QrCode size={32} />
          TAP TO SCAN
        </button>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#9aa0a6', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--google-green)', borderRadius: '50%' }}></span>
            SYSTEM ONLINE & ENCRYPTED
        </p>
      </div>
    </div>
  );
};

export default ScannerDashboard;
