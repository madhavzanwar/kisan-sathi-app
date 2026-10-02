import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Input, Alert } from 'antd';
import { MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useLang } from '../i18n/index.js';

export const AuthDrawer = ({ open, onClose }) => {
  const { t } = useLang();
  const navigate = useNavigate();
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
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Registration failed');
        
        setIsLogin(true);
        setError(t('landing:auth.accountCreated'));
      }
    } catch (err) {
      setError(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
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
          {t('landing:auth.eyebrow')}
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
          {isLogin ? t('landing:auth.welcomeBack') : t('landing:auth.createAccount')}
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '14px',
            color: 'var(--color-text-muted, #5C6E5F)',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {isLogin
            ? t('landing:auth.loginSubtext')
            : t('landing:auth.registerSubtext')}
        </p>
      </div>

      {error && (
        <Alert
          type={error.includes('successfully') ? 'success' : 'error'}
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
            {t('landing:auth.emailLabel')}
          </label>
          <Input
            type="email"
            required
            size="large"
            prefix={<MailOutlined style={{ color: '#5C6E5F', marginRight: '6px' }} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('landing:auth.emailPlaceholder')}
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
            {t('landing:auth.passwordLabel')}
          </label>
          <Input.Password
            required
            size="large"
            prefix={<LockOutlined style={{ color: '#5C6E5F', marginRight: '6px' }} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('landing:auth.passwordPlaceholder')}
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
          {loading ? t('landing:auth.authenticating') : isLogin ? t('landing:auth.signInBtn') : t('landing:auth.registerBtn')}
        </Button>

        {/* Quick Access bypass for demonstration */}
        <Button
          type="default"
          size="large"
          block
          onClick={() => {
            onClose();
            navigate('/dashboard');
          }}
          style={{
            borderRadius: '999px',
            height: '44px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--color-text-muted, #5C6E5F)',
            borderColor: 'rgba(14, 42, 18, 0.15)',
          }}
        >
          {t('landing:auth.guestBtn')}
        </Button>
      </form>

      <div style={{ marginTop: '28px', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '13.5px',
            color: 'var(--color-text-muted, #5C6E5F)',
            margin: 0,
          }}
        >
          {isLogin ? t('landing:auth.noAccount') : t('landing:auth.hasAccount')}
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
            {isLogin ? t('landing:auth.registerNow') : t('landing:auth.signInNow')}
          </button>
        </p>
      </div>
    </Drawer>
  );
};

export default AuthDrawer;
