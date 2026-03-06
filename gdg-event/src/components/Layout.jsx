import React from 'react';
import { Cloud, Code, Terminal, Database, Cpu, Globe, Smartphone, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLogin = location.pathname === '/login' || location.pathname === '/scanner' || location.pathname === '/scan';

  return (
    <div className="app-container">
      {/* 🌈 Live Animated Background 🌈 */}
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        
        {/* HIGH DENSITY Branded Floating Elements */}
        
        {/* Android Logos */}
        <div className="bg-icon" style={{ top: '5%', left: '3%', animationDuration: '40s' }}>
          <img src="https://www.gstatic.com/images/branding/product/1x/android_48dp.png" style={{ height: '40px', opacity: 0.12 }} alt="" />
        </div>
        <div className="bg-icon" style={{ top: '65%', left: '8%', animationDuration: '35s', animationDelay: '-12s' }}>
          <img src="https://www.gstatic.com/images/branding/product/1x/android_48dp.png" style={{ height: '35px', opacity: 0.1 }} alt="" />
        </div>
        <div className="bg-icon" style={{ top: '25%', right: '5%', animationDuration: '45s', animationDelay: '-5s' }}>
          <img src="https://www.gstatic.com/images/branding/product/1x/android_48dp.png" style={{ height: '30px', opacity: 0.12 }} alt="" />
        </div>

        {/* Tech Icons Staggered */}
        <div className="bg-icon" style={{ top: '15%', left: '45%', animationDuration: '28s', animationDelay: '-3s' }}><Cloud size={32} color="var(--google-blue)" /></div>
        <div className="bg-icon" style={{ top: '75%', right: '35%', animationDuration: '32s', animationDelay: '-18s' }}><Code size={28} color="var(--google-red)" /></div>
        <div className="bg-icon" style={{ top: '45%', right: '15%', animationDuration: '38s', animationDelay: '-8s' }}><Terminal size={24} color="var(--google-green)" /></div>
        <div className="bg-icon" style={{ top: '85%', left: '40%', animationDuration: '42s', animationDelay: '-22s' }}><Database size={30} color="var(--google-yellow)" /></div>
        <div className="bg-icon" style={{ top: '10%', right: '25%', animationDuration: '45s', animationDelay: '-10s' }}><Cpu size={35} color="var(--google-blue)" /></div>
        <div className="bg-icon" style={{ top: '35%', left: '20%', animationDuration: '30s', animationDelay: '-15s' }}><Globe size={26} color="var(--google-green)" /></div>
        
        {/* Additional Floating Tech Shapes */}
        <div className="bg-icon" style={{ top: '55%', left: '75%', animationDuration: '25s' }}><Smartphone size={24} color="var(--google-yellow)" /></div>
        <div className="bg-icon" style={{ top: '20%', left: '15%', animationDuration: '40s', animationDelay: '-5s' }}><Code size={20} color="var(--google-blue)" /></div>
        <div className="bg-icon" style={{ top: '80%', left: '20%', animationDuration: '38s', animationDelay: '-10s' }}><Terminal size={22} color="var(--google-red)" /></div>
        <div className="bg-icon" style={{ top: '40%', right: '45%', animationDuration: '34s', animationDelay: '-25s' }}><Cloud size={35} color="var(--google-green)" /></div>
        <div className="bg-icon" style={{ top: '90%', right: '15%', animationDuration: '48s', animationDelay: '-2s' }}><Cpu size={25} color="var(--google-yellow)" /></div>

        {/* Floating Mini Logos */}
        <img src="/gdg_logo.png" className="bg-icon" style={{ top: '50%', left: '5%', height: '22px', opacity: 0.1, animationDuration: '40s' }} alt="" />
        <img src="/sru_logo.png" className="bg-icon" style={{ top: '30%', right: '10%', height: '18px', opacity: 0.1, animationDuration: '44s' }} alt="" />
        <img src="/gdg_logo.png" className="bg-icon" style={{ bottom: '10%', right: '45%', height: '20px', opacity: 0.08, animationDuration: '50s' }} alt="" />
        
        {/* Google Colored Decorative Dots (High Density) */}
        <div className="bg-icon" style={{ top: '12%', left: '30%', width: '10px', height: '10px', background: 'var(--google-blue)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '45%', left: '60%', width: '8px', height: '8px', background: 'var(--google-red)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '75%', left: '25%', width: '12px', height: '12px', background: 'var(--google-yellow)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '20%', right: '40%', width: '7px', height: '7px', background: 'var(--google-green)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '85%', right: '20%', width: '9px', height: '9px', background: 'var(--google-blue)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '60%', right: '50%', width: '6px', height: '6px', background: 'var(--google-red)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '40%', left: '35%', width: '8px', height: '8px', background: 'var(--google-green)', borderRadius: '50%', opacity: 0.15 }}></div>
        <div className="bg-icon" style={{ top: '10%', left: '70%', width: '11px', height: '11px', background: 'var(--google-yellow)', borderRadius: '50%', opacity: 0.15 }}></div>
      </div>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div className="logo-container" style={{ margin: 0 }}>
          <img src="/gdg_logo.png" alt="GDG Logo" />
          <div className="divider"></div>
          <img src="/sru_logo.png" alt="SRU Logo" />
        </div>
        
        {!hideLogin && (
          <Link 
            to="/login" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'white', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--google-blue)',
              transition: 'all 0.3s ease',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Lock size={18} />
          </Link>
        )}
      </header>
      
      <main style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        {children}
      </main>

      <footer style={{ padding: '1rem 1rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', color: 'var(--color-text-muted)', fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>
        <p>© 2026 Google Developer Group Raipur.</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>Powered by</p>
        <p style={{ marginTop: '0.15rem', opacity: 0.8, fontWeight: 600 }}>SRU Raipur | Neo Tech Club</p>
      </footer>
    </div>
  );
};

export default Layout;
