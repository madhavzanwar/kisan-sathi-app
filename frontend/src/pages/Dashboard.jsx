import React, { useState } from 'react';
import { Menu, User, Globe, Leaf } from 'lucide-react';
import HealCrop from '../tabs/HealCrop';
import FertilizerCalc from '../tabs/FertilizerCalc';
import CultivationGuide from '../tabs/CultivationGuide';
import WeatherIrrigation from '../tabs/WeatherIrrigation';
import FloatingAssistant from '../components/FloatingAssistant';

const tabs = [
  { id: 'heal', name: 'Heal Your Crop' },
  { id: 'fertilizer', name: 'Fertilizer Calc' },
  { id: 'guide', name: 'Cultivation Guide' },
  { id: 'weather', name: 'Live Weather' }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('heal');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'heal': return <HealCrop />;
      case 'fertilizer': return <FertilizerCalc />;
      case 'guide': return <CultivationGuide />;
      case 'weather': return <WeatherIrrigation />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="app-overlay"></div>
      
      {/* Top Navigation */}
      <header style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Menu className="lucide-icon" style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }} onClick={() => setDrawerOpen(true)} />
          <Leaf style={{ color: '#fff' }} />
          <h1 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 600, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            KisanSathi <span style={{ fontSize: '1.1rem', fontWeight: 400, color: 'rgba(255,255,255,0.9)', letterSpacing: 'normal', fontFamily: "'Inter', sans-serif" }}>- Har kisan ka saccha sathi</span>
          </h1>
        </div>
        
        {/* Removed unused Globe and User buttons for a cleaner UI */}
      </header>

      {/* Side Drawer Overlay */}
      {drawerOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setDrawerOpen(false)}>
          <div className="glass-panel" style={{ width: '280px', height: '100%', borderRadius: '0 16px 16px 0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: 'var(--accent)' }}>Menu</h2>
            <hr style={{ borderColor: 'var(--glass-border)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ cursor: 'pointer' }}>Profile</p>
              <p style={{ cursor: 'pointer' }}>Settings</p>
              <p style={{ cursor: 'pointer', color: '#ff6b6b' }} onClick={() => window.location.href='/'}>Log Out</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Navigation (Segmented Control) */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 16px 32px 16px', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '100px', overflowX: 'auto', maxWidth: '100%', scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#0f172a' : 'rgba(255,255,255,0.6)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 600 : 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
              }}
              onMouseOver={e => !activeTab === tab.id && (e.currentTarget.style.color = '#fff')}
              onMouseOut={e => !activeTab === tab.id && (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main className="container animate-fade-in" style={{ flex: 1, padding: '0 16px 32px 16px' }}>
        {renderTabContent()}
      </main>

      {/* Floating AI Assistant */}
      <FloatingAssistant activeTab={activeTab} />
    </div>
  );
};

export default Dashboard;
