import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, RefreshCw } from 'lucide-react';

const ScannerPage = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null); 
  const [message, setMessage] = useState('');
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const qrCodeRef = useRef(null);
  const isScanningRef = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const html5QrCode = new Html5Qrcode("reader");
    qrCodeRef.current = html5QrCode;

    const startScanner = async () => {
        if (isScanningRef.current) return;
        setIsCameraStarting(true);
        try {
            const config = { 
                fps: 60, 
                qrbox: undefined,
                aspectRatio: 1.0, 
                videoConstraints: {
                    facingMode: "environment",
                    focusMode: "continuous"
                }
            };
            if (isMounted && !isScanningRef.current) {
                isScanningRef.current = true;
                await html5QrCode.start(
                    { facingMode: "environment" }, 
                    config, 
                    onScanSuccess, 
                    onScanError
                );
            }
        } catch (err) {
            isScanningRef.current = false;
            console.error("Scanner Error:", err);
        } finally {
            setIsCameraStarting(false);
        }
    };

    // Small timeout to allow DOM to settle correctly in React StrictMode
    const timer = setTimeout(startScanner, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (qrCodeRef.current) {
        if (qrCodeRef.current.isScanning) {
          qrCodeRef.current.stop().then(() => {
            qrCodeRef.current.clear();
          }).catch(err => console.error("Failed to stop scanner", err));
        } else {
          qrCodeRef.current.clear();
        }
      }
    };
  }, [navigate]);

  const onScanSuccess = async (decodedText) => {
    if (isProcessingRef.current) return;
    
    // IMMEDIATE LOCK
    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
        // QUICK STOP to prevent multiple detections
        if (qrCodeRef.current && qrCodeRef.current.isScanning) {
            await qrCodeRef.current.stop();
            isScanningRef.current = false;
        }
    } catch (e) {
        console.warn("Soft catch during stop:", e);
    }
    
    let ticketId = decodedText.trim();
    let studentName = "";
    try {
        if (decodedText.startsWith('http')) {
            const url = new URL(decodedText);
            ticketId = url.searchParams.get('id') || decodedText.trim();
            studentName = url.searchParams.get('name') || "";
            
            // If name is in the 'data' blob, try to decode it
            if (!studentName && url.searchParams.get('data')) {
                try {
                    const decodedData = JSON.parse(atob(decodeURIComponent(url.searchParams.get('data'))));
                    studentName = decodedData.name || decodedData["Student Name"] || "";
                } catch(e) {}
            }
        }
    } catch (e) { ticketId = decodedText.trim(); }

    if (!ticketId) {
        isProcessingRef.current = false;
        setIsProcessing(false);
        return;
    }

    setScanResult(ticketId);
    if (window.navigator.vibrate) window.navigator.vibrate(100);

    try {
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
            action: 'checkin', 
            ticketId: ticketId,
            studentName: studentName // Send name for double verification
        }).toString()
      });

      const result = await response.json();

      if (result.status === 'success') {
        setStatus('success');
        setMessage(result.message || 'Access Granted: Attendance Logged');
      } else if (result.status === 'already') {
        setStatus('already');
        setMessage(result.message || 'Duplicate: Already Verified');
      } else {
        setStatus('error');
        // If result.error exists, show it, otherwise result.message, finally default
        setMessage(result.error || result.message || 'Unknown ID: Scan Blocked');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setStatus('error');
      setMessage('Sync Error: Connection Lost');
    } finally {
      setIsProcessing(false);
      // NOTE: We keep isProcessingRef true until "Scan Next" is clicked
      // to ensure NO more scanning happens while showing the result.
    }
  };

  const onScanError = (err) => {
    // Console suppression to avoid log spam
    // console.warn(err);
  };

  const resetScanner = async () => {
    isProcessingRef.current = false;
    setScanResult(null);
    setStatus(null);
    setMessage('');
    setIsCameraStarting(true);
    
    // Give time for the previous camera session to fully release
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (qrCodeRef.current && !isScanningRef.current) {
        try {
            // Hard cleanup before restart
            try { await qrCodeRef.current.clear(); } catch(e) {}
            
            const config = { 
                fps: 60, 
                aspectRatio: 1.0, 
                qrbox: undefined,
                videoConstraints: {
                    facingMode: "environment",
                    focusMode: "continuous"
                }
            };
            isScanningRef.current = true;
            await qrCodeRef.current.start(
                { facingMode: "environment" }, 
                config, 
                onScanSuccess, 
                onScanError
            );
        } catch (err) {
            isScanningRef.current = false;
            console.error("Failed to restart scanner", err);
        } finally {
            setIsCameraStarting(false);
        }
    } else {
        setIsCameraStarting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        <button 
          onClick={() => navigate('/scanner')}
          className="glass-panel"
          style={{ 
            padding: '10px 20px', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer', 
            fontWeight: 700, 
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            borderRadius: '14px'
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button 
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: '#EA4335', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Logout
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', border: 'none', background: 'white' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#202124' }}>
            <div className={`status-dot ${isProcessing ? 'processing' : 'ready'}`} style={{ width: '12px', height: '12px', borderRadius: '50%' }}></div>
            Attendance Scanner
        </h2>
        <p style={{ color: '#5f6368', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 500 }}>Align QR code within the frame</p>

        {!status ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <div className="scanner-container" style={{ position: 'relative', width: '280px', height: '280px', borderRadius: '32px', overflow: 'hidden', border: '2px solid rgba(66, 133, 244, 0.3)', boxShadow: '0 0 30px rgba(66, 133, 244, 0.1)' }}>
              {isCameraStarting && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', borderRadius: '32px' }}>
                  <div className="pulse-dot" style={{ width: '40px', height: '40px' }}></div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--google-blue)', letterSpacing: '0.2em' }}>WAKING SENSORS...</p>
                </div>
              )}
              <div id="reader"></div>
              <div className="scanner-overlay">
                <div className="scanner-line"></div>
                <div className="tech-ring ring-outer"></div>
                <div className="tech-ring ring-inner"></div>
                <div className="scanner-hud">
                    <div className="hud-line h-top"></div>
                    <div className="hud-line h-bottom"></div>
                    <div className="hud-text">DATA_ANALYSIS_ACTIVE</div>
                    <div className="hud-data">
                        SYS_713.0<br/>
                        LNG_82.11<br/>
                        TRK_009
                    </div>
                </div>
                <div className="scanner-corners">
                  <div className="corner tl"></div>
                  <div className="corner tr"></div>
                  <div className="corner bl"></div>
                  <div className="corner br"></div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="pulse-dot"></div>
                <p style={{ color: 'var(--google-blue)', fontSize: '0.75rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                    Optical Sensor Active
                </p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            {status === 'success' && <CheckCircle2 size={80} color="#34A853" className="animate-bounce" />}
            {status === 'already' && <RefreshCw size={80} color="#FBBC05" className="animate-pulse" />}
            {status === 'error' && <XCircle size={80} color="#EA4335" />}
            
            <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0' }}>
                    {status === 'success' ? 'Verified!' : status === 'already' ? 'Already Done' : 'Failed'}
                </h3>
                <p style={{ color: '#5f6368', marginTop: '0.4rem', fontWeight: 600, fontSize: '0.95rem' }}>{message}</p>
                {scanResult && <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9aa0a6', marginTop: '0.75rem', letterSpacing: '0.05em' }}>TICKET: {scanResult}</p>}
            </div>

            <button 
              onClick={resetScanner} 
              className="btn-primary" 
              style={{ width: '100%', maxWidth: '200px' }}
            >
              Scan Next
            </button>
          </div>
        )}

        {isProcessing && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: '24px' }}>
            <Loader2 className="animate-spin" size={48} color="var(--google-blue)" />
            <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--google-blue)' }}>Verifying Ticket...</p>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ marginTop: '1rem', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.8)', border: 'none' }}>
        <div style={{ background: 'var(--google-blue-soft)', padding: '8px', borderRadius: '10px' }}>
            <Loader2 size={16} color="var(--google-blue)" className="animate-spin" />
        </div>
        <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0, color: '#202124' }}>Active Staff Session</p>
            <p style={{ fontSize: '0.7rem', color: '#5f6368', margin: 0 }}>Logged in: NeoTech Admin</p>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
