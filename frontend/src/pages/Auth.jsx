import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Input, Alert } from 'antd';
import { MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import PoweredByStrip from '../sections/PoweredByStrip';
import Footer from '../components/Footer';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      {/* 1. Fixed Top Glass Pill Navbar */}
      <Navbar onOpenAuth={() => setShowPanel(true)} />

      {/* 2. 100vh Hero Section */}
      <HeroSection
        onPrimaryAction={() => setShowPanel(true)}
        onSecondaryAction={() => {
          const target = document.getElementById('powered-by-strip');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Below Hero: Real Tech Powered By Strip */}
      <PoweredByStrip />

      {/* 4. Footer with Real Routes */}
      <Footer />

      {/* 5. Accessible Sliding Auth Drawer (keeps all login/register business logic) */}
      <Drawer
        open={showPanel}
        onClose={() => setShowPanel(false)}
        placement="right"
        width={420}
        styles={{
          header: { borderBottom: 'none', padding: '24px 28px 0' },
          body: { padding: '16px 28px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
          content: {
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: '24px',
            borderBottomLeftRadius: '24px',
            boxShadow: '-10px 0 40px rgba(14, 42, 18, 0.15)',
          }
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <span className="eyebrow-tag" style={{ marginBottom: '12px' }}>
            Farmer Portal
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-forest-ink, #0E2A12)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              color: 'var(--color-text-muted, #7C8B7E)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {isLogin
              ? 'Enter your credentials to access your agricultural dashboard.'
              : 'Join Kisan Sakhi to access AI crop diagnosis and fertilizer planning.'}
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: '20px', borderRadius: '12px' }}
          />
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              Email Address
            </label>
            <Input
              type="email"
              required
              size="large"
              prefix={<MailOutlined style={{ color: '#7C8B7E', marginRight: '6px' }} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
              style={{ borderRadius: '12px', height: '46px' }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-forest-ink, #0E2A12)',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <Input.Password
              required
              size="large"
              prefix={<LockOutlined style={{ color: '#7C8B7E', marginRight: '6px' }} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ borderRadius: '12px', height: '46px' }}
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            disabled={loading}
            icon={loading ? <LoadingOutlined spin /> : null}
            style={{
              backgroundColor: 'var(--color-cta-green, #2E6B34)',
              borderRadius: '999px',
              height: '48px',
              fontSize: '15px',
              fontWeight: 600,
              marginTop: '10px',
              boxShadow: '0 4px 14px rgba(46, 107, 52, 0.3)',
            }}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Dashboard' : 'Create Free Account'}
          </Button>

          {/* Quick Access bypass for demonstration */}
          <Button
            type="default"
            size="large"
            block
            onClick={() => navigate('/dashboard')}
            style={{
              borderRadius: '999px',
              height: '44px',
              fontSize: '13.5px',
              fontWeight: 500,
              color: 'var(--color-text-muted, #7C8B7E)',
              borderColor: 'rgba(14, 42, 18, 0.15)',
            }}
          >
            Continue as Guest &rarr;
          </Button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '13.5px',
              color: 'var(--color-text-muted, #7C8B7E)',
              margin: 0,
            }}
          >
            {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-cta-green, #2E6B34)',
                fontWeight: 700,
                marginLeft: '8px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {isLogin ? 'Register now' : 'Sign in'}
            </button>
          </p>
        </div>
      </Drawer>
    </div>
  );
};

export default Auth;
