import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { CheckCircle, ShieldCheck, Ticket, Download } from 'lucide-react';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, ticketId } = location.state || {};

  useEffect(() => {
    if (!user || !ticketId) {
      navigate('/');
    }
  }, [user, ticketId, navigate]);

  if (!user) return null;

  const qrScanUrl = `${window.location.origin}/ticket?id=${ticketId}&data=${encodeURIComponent(btoa(JSON.stringify(user || {})))}`;

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '0 1.5rem' }}>
      
      <div style={{ marginBottom: '2.5rem', marginTop: '1.5rem' }}>
        <div style={{ width: '80px', height: '80px', background: 'rgba(52, 168, 83, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CheckCircle size={48} color="var(--google-green)" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Registration <span className="color-green">Confirmed!</span></h1>
        <p style={{ color: '#5f6368', fontSize: '1.05rem' }}>
          Great to have you with us, <strong>{user.name}</strong>.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', textAlign: 'left' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--google-blue)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Event Summary
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f3f4', paddingBottom: '0.75rem' }}>
            <span style={{ color: '#5f6368', fontSize: '0.9rem' }}>Ticket ID</span>
            <span style={{ fontWeight: 600, color: '#202124', fontFamily: 'monospace' }}>{ticketId}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f3f4', paddingBottom: '0.75rem' }}>
            <span style={{ color: '#5f6368', fontSize: '0.9rem' }}>Organized By :</span>
            <span style={{ fontWeight: 600, color: '#202124' }}>SRU Raipur X Neo Tech Club</span>
          </div>

          <div style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '0.75rem' }}>
            <span style={{ color: '#5f6368', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Participant</span>
            <span style={{ fontWeight: 600, color: '#202124', display: 'block' }}>{user.name}</span>
            <span style={{ fontSize: '0.85rem', color: '#5f6368' }}>{user.enrollment} • {user.course}</span>
          </div>
        </div>

        <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.5rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
           <QRCode 
              value={qrScanUrl} 
              size={120}
              fgColor="#202124" 
            />
            <p style={{ fontSize: '0.8rem', color: '#5f6368', fontWeight: 500 }}>Scanner Preview</p>
        </div>
      </div>

      <div style={{ paddingBottom: '3rem' }}>
        <Link to="/ticket" state={{ user, ticketId }} className="btn-primary" style={{ width: '100%' }}>
          <Ticket size={20} /> View Digital Pass
        </Link>
      </div>
      
    </div>
  );
};

export default SuccessPage;
