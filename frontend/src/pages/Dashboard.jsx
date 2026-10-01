import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Drawer, Button, Tag, Spin, ConfigProvider, App as AntdApp } from 'antd';
import { kisanSathiTheme } from '../design-system/theme.js';
import { MenuOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';
import {
  Camera,
  FlaskConical,
  TrendingUp,
  Sprout,
  Droplets,
  Leaf,
  ChevronRight,
} from 'lucide-react';

const HealCrop = lazy(() => import('../tabs/HealCrop'));
const FertilizerCalc = lazy(() => import('../tabs/FertilizerCalc'));
const YieldPestForecaster = lazy(() => import('../tabs/YieldPestForecaster'));
const CultivationGuide = lazy(() => import('../tabs/CultivationGuide'));
const WeatherIrrigation = lazy(() => import('../tabs/WeatherIrrigation'));
import FloatingAssistant from '../components/FloatingAssistant';

const tabs = [
  {
    id: 'heal',
    name: 'Heal Your Crop',
    subtitle: 'Leaf Pathology & Diagnosis',
    badge: 'PyTorch AI',
    icon: Camera,
    color: '#2E6B34',
  },
  {
    id: 'fertilizer',
    name: 'Fertilizer Calculator',
    subtitle: 'NPK Soil & Dosage Balancing',
    badge: 'Exact kg',
    icon: FlaskConical,
    color: '#0E2A12',
  },
  {
    id: 'yield-pest',
    name: 'Yield & Pest Forecast',
    subtitle: 'Sentinel-2 Satellite Telemetry',
    badge: 'NDVI Vision',
    icon: TrendingUp,
    color: '#2E6B34',
  },
  {
    id: 'guide',
    name: 'Cultivation Guides',
    subtitle: 'Lifecycle Agronomic Protocols',
    badge: '6 Crops',
    icon: Sprout,
    color: '#0E2A12',
  },
  {
    id: 'weather',
    name: 'Live Weather',
    subtitle: 'Hyper-local Microclimate',
    badge: 'GPS Telemetry',
    icon: Droplets,
    color: '#2E6B34',
  },
];

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlTab = searchParams.get('tab');
  const initialTab = urlTab && tabs.some((t) => t.id === urlTab) ? urlTab : 'heal';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (urlTab && tabs.some((t) => t.id === urlTab)) {
      setActiveTab(urlTab);
    } else if (urlTab) {
      setActiveTab('heal');
    }
  }, [urlTab]);

  const handleLogout = () => {
    localStorage.removeItem('kisan_token');
    navigate('/');
  };

  useEffect(() => {
    const cur = tabs.find((t) => t.id === activeTab);
    document.title = cur
      ? `KisanSathi — ${cur.name} | Agronomy Suite`
      : 'KisanSathi — Precision Agronomy Dashboard';
  }, [activeTab]);

  // Accessibility: Ensure all Ant Design slider handles have accessible aria-labels
  useEffect(() => {
    const attachSliderAria = () => {
      document.querySelectorAll('.ant-slider').forEach((slider) => {
        const label =
          slider.getAttribute('aria-label') ||
          slider.closest('div')?.querySelector('span')?.textContent ||
          'Adjustment Slider';
        const handles = slider.querySelectorAll('.ant-slider-handle');
        handles.forEach((handle) => {
          if (!handle.getAttribute('aria-label')) {
            handle.setAttribute('aria-label', label.trim());
          }
          if (!handle.getAttribute('title')) {
            handle.setAttribute('title', label.trim());
          }
        });
      });
    };

    attachSliderAria();
    const observer = new MutationObserver(attachSliderAria);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    return () => observer.disconnect();
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'heal':
        return <HealCrop />;
      case 'fertilizer':
        return <FertilizerCalc />;
      case 'yield-pest':
        return <YieldPestForecaster />;
      case 'guide':
        return <CultivationGuide />;
      case 'weather':
        return <WeatherIrrigation />;
      default:
        return <HealCrop />;
    }
  };

  return (
    <ConfigProvider theme={kisanSathiTheme}>
      <AntdApp className="ant-app">
        <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F4F5F3',
        display: 'flex',
        flexDirection: 'column',
        color: '#0E2A12',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(14, 42, 18, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu drawer"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F4F5F3',
              border: '1px solid rgba(14, 42, 18, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0E2A12',
              transition: 'all 0.2s',
            }}
          >
            <MenuOutlined style={{ fontSize: '16px' }} />
          </button>

          {/* Brand Logo */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#D5F145',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(213, 241, 69, 0.4)',
              }}
            >
              <Leaf size={20} color="#0E2A12" strokeWidth={2.4} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#0E2A12',
                  lineHeight: 1.1,
                }}
              >
                KisanSathi
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#5C6E5F',
                  fontWeight: 500,
                }}
              >
                Har kisan ka saccha sathi
              </div>
            </div>
          </div>
        </div>

        {/* Right Nav CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: '1px solid rgba(14, 42, 18, 0.12)',
              backgroundColor: '#FFFFFF',
              color: '#0E2A12',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#F4F5F3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <HomeOutlined />
            <span>Home</span>
          </button>

          <button
            onClick={handleLogout}
            className="hide-on-mobile"
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#2E6B34',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(46, 107, 52, 0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0E2A12';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2E6B34';
            }}
          >
            <span>Exit Dashboard</span>
            <LogoutOutlined style={{ fontSize: '12px' }} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        id="main-dashboard-content"
        style={{
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          padding: '28px 20px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Welcome Eyebrow & Hero Banner */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: ' clamp(20px, 3.5vw, 32px)',
            border: '1px solid rgba(14, 42, 18, 0.06)',
            boxShadow: '0 8px 24px rgba(14, 42, 18, 0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span className="eyebrow-tag" style={{ marginBottom: '10px' }}>
              Precision Agronomy Suite
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 800,
                color: '#0E2A12',
                margin: '0 0 8px 0',
                letterSpacing: '-0.03em',
              }}
            >
              Smart Farming <span className="heading-accent">Dashboard</span>
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                color: '#5C6E5F',
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Select a specialized agronomic tool below to diagnose crop diseases, calculate exact fertilizer requirements, or access real-time microclimate intelligence.
            </p>
          </div>

          {/* Quick Telemetry Pill */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: '#F9FAF8',
              borderRadius: '16px',
              border: '1px solid rgba(14, 42, 18, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#2E6B34',
                boxShadow: '0 0 10px #2E6B34',
              }}
            />
            <div>
              <div style={{ fontSize: '11px', color: '#5C6E5F', fontWeight: 600, textTransform: 'uppercase' }}>
                System Telemetry
              </div>
              <div style={{ fontSize: '13.5px', color: '#0E2A12', fontWeight: 700 }}>
                PyTorch & Scikit-Learn Active
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Tool Switcher */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '16px',
                fontWeight: 700,
                color: '#0E2A12',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Agronomy Tools
            </h2>
            <span style={{ fontSize: '13px', color: '#5C6E5F' }}>
              Click any card to launch tool
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '14px',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;

              return (
                <div
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleTabChange(tab.id)}
                  style={{
                    backgroundColor: isActive ? '#FFFFFF' : '#FFFFFF',
                    borderRadius: '20px',
                    padding: '20px 18px',
                    cursor: 'pointer',
                    position: 'relative',
                    border: isActive
                      ? '2px solid #2E6B34'
                      : '1px solid rgba(14, 42, 18, 0.08)',
                    boxShadow: isActive
                      ? '0 12px 28px rgba(46, 107, 52, 0.12)'
                      : '0 4px 14px rgba(14, 42, 18, 0.03)',
                    transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '150px',
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 42, 18, 0.07)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(14, 42, 18, 0.03)';
                    }
                  }}
                >
                  {/* Top Row: Icon + Badge */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: isActive ? '#D5F145' : 'rgba(46, 107, 52, 0.08)',
                        color: '#0E2A12',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <IconComp size={22} strokeWidth={2.2} />
                    </div>

                    <Tag
                      style={{
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: isActive ? '#2E6B34' : '#F4F5F3',
                        color: isActive ? '#FFFFFF' : '#5C6E5F',
                        border: 'none',
                        margin: 0,
                        padding: '1px 8px',
                      }}
                    >
                      {tab.badge}
                    </Tag>
                  </div>

                  {/* Bottom Info */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#0E2A12',
                        margin: '0 0 4px 0',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {tab.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#5C6E5F',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {tab.subtitle}
                    </p>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-1px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '40px',
                        height: '3px',
                        backgroundColor: '#2E6B34',
                        borderRadius: '0 0 4px 4px',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Tool Content */}
        <section
          className="animate-fade-in"
          style={{
            marginTop: '8px',
            width: '100%',
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '80px 0',
                }}
              >
                <Spin size="large" />
              </div>
            }
          >
            {renderTabContent()}
          </Suspense>
        </section>
      </main>

      {/* Ant Design Menu Drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#D5F145',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={18} color="#0E2A12" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#0E2A12' }}>
                KisanSathi
              </div>
              <div style={{ fontSize: '11px', color: '#5C6E5F' }}>Har kisan ka saccha sathi</div>
            </div>
          </div>
        }
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{
          body: {
            backgroundColor: '#F9FAF8',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: '#5C6E5F',
                marginBottom: '10px',
              }}
            >
              Quick Tools
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map((tab) => {
                const isCurrent = activeTab === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabChange(tab.id);
                      setDrawerOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: isCurrent ? '1px solid #2E6B34' : '1px solid rgba(14, 42, 18, 0.06)',
                      backgroundColor: isCurrent ? '#FFFFFF' : 'transparent',
                      color: isCurrent ? '#2E6B34' : '#0E2A12',
                      fontWeight: isCurrent ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13.5px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComp size={16} />
                      <span>{tab.name}</span>
                    </div>
                    <ChevronRight size={14} color="#5C6E5F" />
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid rgba(14, 42, 18, 0.08)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0E2A12', marginBottom: '6px' }}>
              AI Model Specifications
            </div>
            <div style={{ fontSize: '12px', color: '#5C6E5F', lineHeight: '1.6' }}>
              • PyTorch ResNet18 (38 disease classes)<br />
              • Scikit-Learn Multiclass Fertilizer Regressor<br />
              • Copernicus Sentinel-2 Level-2A BOA
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button
            type="primary"
            block
            icon={<HomeOutlined />}
            onClick={() => {
              handleLogout();
              setDrawerOpen(false);
            }}
            style={{
              borderRadius: '999px',
              height: '42px',
              backgroundColor: '#2E6B34',
              fontWeight: 600,
            }}
          >
            Return to Landing Page
          </Button>
        </div>
      </Drawer>

      {/* Floating AI Assistant */}
      <FloatingAssistant activeTab={activeTab} />
    </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default Dashboard;
