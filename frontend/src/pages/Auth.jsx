import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Loader, X } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [showPanel, setShowPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // FastAPI OAuth2PasswordRequestForm expects form-urlencoded data for username and password
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');
        
        localStorage.setItem('kisan_token', data.access_token);
        navigate('/dashboard');
      } else {
        // Register expects JSON
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Registration failed');
        
        // Auto-login after register
        const loginData = new URLSearchParams();
        loginData.append('username', email);
        loginData.append('password', password);
        const loginRes = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: loginData
        });
        const finalData = await loginRes.json();
        localStorage.setItem('kisan_token', finalData.access_token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Hero Section */}
      <div className="animate-fade-in" style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '-25vh', // Push it up towards the mountains
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: showPanel ? 'translateX(-50px)' : 'translateX(0)',
        opacity: showPanel ? 0.3 : 1,
        zIndex: 10
      }}>
        <div>
          <h1 style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: 'clamp(4rem, 8vw, 8rem)', 
            fontWeight: 700,
            color: '#000000', // Solid black
            margin: 0,
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 24px rgba(255,255,255,0.4)' // Subtle glow to ensure legibility against any dark spots
          }}>
            KisanSathi
          </h1>
        </div>

        <button 
          onClick={() => setShowPanel(true)}
          className="glass-button" 
          style={{ 
            marginTop: '32px', 
            fontSize: '1.1rem', 
            padding: '16px 40px',
            borderRadius: '100px'
          }}
        >
          Get Started <ArrowRight size={20} />
        </button>
      </div>

      {/* Sliding Auth Panel */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: showPanel ? 0 : '-500px',
        width: '100%',
        maxWidth: '450px',
        height: '100vh',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '-20px 0 50px rgba(0,0,0,0.5)',
        transition: 'right 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        zIndex: 50
      }}>
        
        <button 
          onClick={() => setShowPanel(false)}
          style={{ position: 'absolute', top: '32px', right: '32px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', margin: '0 0 8px 0' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 32px 0' }}>
          {isLogin ? 'Enter your details to access your dashboard.' : 'Join KisanSathi to get AI farming insights.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px 14px 44px', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 16px 14px 44px', borderRadius: '12px', fontSize: '1rem', outline: 'none', transition: 'border 0.2s' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)', transition: 'background 0.2s' }}
            onMouseOver={e => !loading && (e.currentTarget.style.background = 'var(--primary-dark)')}
            onMouseOut={e => !loading && (e.currentTarget.style.background = 'var(--accent)')}
          >
            {loading ? <Loader size={20} style={{ animation: 'spin 2s linear infinite' }} /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: 600, marginLeft: '8px', cursor: 'pointer' }}
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Auth;
