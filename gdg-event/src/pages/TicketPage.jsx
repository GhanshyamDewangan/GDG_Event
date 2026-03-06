import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Download, ArrowLeft, Ticket as TicketIcon, MapPin } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: stateUser, ticketId: stateTicketId } = location.state || {};
  const [searchParams] = useSearchParams();
  
  let user = stateUser;
  let ticketId = stateTicketId;

  if (!user && searchParams.get('data')) {
    try {
      user = JSON.parse(atob(decodeURIComponent(searchParams.get('data'))));
      ticketId = searchParams.get('id');
    } catch(e) { console.log(e); }
  }

  useEffect(() => {
    if (!user || !ticketId) navigate('/');
  }, [user, ticketId, navigate]);

  const ticketRef = React.useRef(null);
  if (!user) return null;

  const qrScanUrl = `${window.location.origin}/ticket?id=${ticketId}&name=${encodeURIComponent(user.name)}&data=${encodeURIComponent(btoa(JSON.stringify(user || {})))}`;

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    try {
      // Use higher scale for print quality, ensure background is white
      const canvas = await html2canvas(ticketRef.current, { 
        scale: 4, 
        useCORS: true, 
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: ticketRef.current.scrollWidth,
        windowHeight: ticketRef.current.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate dimensions in mm for the PDF
      // We'll create a PDF that exactly fits the ticket proportions
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;
      
      // Convert pixels to mm (1px = 0.264583mm at 96 DPI)
      // But we'll just use the aspect ratio and a standard width
      const pdfWidth = 100; // 100mm wide
      const pdfHeight = (imgHeightPx * pdfWidth) / imgWidthPx;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`IWD_Pass_${user.name.split(' ')[0]}.pdf`);
    } catch (error) { 
      console.error('PDF Generation Error:', error); 
    }
  };
 streams:

  return (
    <div className="animate-slide-up" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '0 1rem 4rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
        <Link to="/" className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '100px' }}>
          <ArrowLeft size={16} /> <span style={{ fontSize: '0.9rem' }}>Back</span>
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Your <span className="color-blue">Digital Pass</span></h2>
        <p style={{ color: '#5f6368', marginTop: '0.25rem', fontSize: '0.9rem' }}>Show Email Or QR Code at the registration desk</p>
      </div>

      {/* 🎟️ Premium Google Ticket 🎟️ */}
      <div 
        ref={ticketRef}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Google Stripes Top */}
        <div style={{ display: 'flex', height: '6px', width: '100%' }}>
          <div style={{ flex: 1, background: 'var(--google-blue)' }}></div>
          <div style={{ flex: 1, background: 'var(--google-red)' }}></div>
          <div style={{ flex: 1, background: 'var(--google-yellow)' }}></div>
          <div style={{ flex: 1, background: 'var(--google-green)' }}></div>
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <img src="/gdg_logo.png" alt="GDG" style={{ height: '20px' }} />
               </div>
               <div style={{ fontSize: '0.75rem', color: '#5f6368', opacity: 0.8 }}>SRU Raipur | Neo Tech Club</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5f6368', letterSpacing: '1px' }}>ID Code</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'monospace' }}>{ticketId}</div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>
              IWD 2026
            </h1>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--google-blue)', marginBottom: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
               International Women's Day
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
               <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5f6368', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>07 Mar, 2026</div>
               </div>
               <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5f6368', marginBottom: '4px' }}>Time</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>09:30 AM</div>
               </div>
            </div>
          </div>

          <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', position: 'relative' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5f6368', marginBottom: '4px' }}>Participant Name</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--google-blue)' }}>{user.name}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5f6368', marginBottom: '2px' }}>Enrollment</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.enrollment}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#5f6368', marginBottom: '2px' }}>Course</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.course} - Sem {user.semester}</div>
              </div>
            </div>
          </div>

          {/* Perforation Line */}
          <div style={{ borderTop: '2px dashed #e8eaed', margin: '0 -2rem 2.5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-10px', top: '-10px', width: '20px', height: '20px', background: '#f8f9fa', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '20px', height: '20px', background: '#f8f9fa', borderRadius: '50%' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1.5px solid #e8eaed' }}>
                 <QRCode value={qrScanUrl} size={140} fgColor="#202124" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#5f6368', fontWeight: 500, marginBottom: '0.5rem' }}>Scan at Venue Entrance</p>
                <div style={{ height: '4px', width: '60px', background: 'var(--google-blue)', borderRadius: '2px', margin: '0 auto' }}></div>
              </div>
          </div>
        </div>

        {/* Venue Footer */}
        <div style={{ background: '#f1f3f4', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MapPin size={16} color="var(--google-red)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Shri Rawatpura Sarkar University, Raipur</span>
        </div>
      </div>

      <button onClick={handleDownloadPDF} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
        <Download size={20} /> Download PDF Pass
      </button>

    </div>
  );
};

export default TicketPage;
