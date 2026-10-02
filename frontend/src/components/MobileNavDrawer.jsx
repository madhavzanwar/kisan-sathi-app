import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, Button } from 'antd';
import { CloseOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Leaf } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useLang } from '../i18n/useLang.js';
import { getBrandName } from '../i18n/glossary.js';

export const MobileNavDrawer = ({
  open,
  onClose,
  isLinkActive,
  onActionClick,
}) => {
  const { t, currentLang } = useLang();

  const navItems = [
    { label: t('common:nav.home', 'Home'), path: '/', isHome: true },
    { label: t('common:nav.heal', 'Heal Your Crop'), path: '/dashboard?tab=heal' },
    { label: t('common:nav.fertilizer', 'Fertilizer Calc'), path: '/dashboard?tab=fertilizer' },
    { label: t('common:nav.guide', 'Cultivation Guides'), path: '/dashboard?tab=guide' },
    { label: t('common:nav.yieldPest', 'Yield & Pest'), path: '/dashboard?tab=yield-pest' },
    { label: t('common:nav.assistant', 'AI Assistant'), path: '/dashboard?tab=assistant' },
  ];

  return (
    <Drawer
      placement="right"
      open={open}
      onClose={onClose}
      closeIcon={<CloseOutlined style={{ fontSize: '18px', color: '#0E2A12' }} />}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-lime-accent, #D5F145)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Leaf size={15} color="#0E2A12" />
          </div>
          <span style={{ fontWeight: 700, color: '#0E2A12' }}>{getBrandName(currentLang)}</span>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>
        <LanguageSwitcher mode="segmented" />
        {navItems.map((item) => {
          const active = isLinkActive(item);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: active ? 'rgba(46, 107, 52, 0.1)' : '#F9FAF8',
                color: active ? '#2E6B34' : '#0E2A12',
                fontSize: '15px',
                fontWeight: active ? 600 : 500,
                textDecoration: 'none',
              }}
            >
              <span>{item.label}</span>
              <ArrowRightOutlined style={{ fontSize: '12px', opacity: 0.6 }} />
            </Link>
          );
        })}

        <div style={{ marginTop: '24px' }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => {
              onClose();
              onActionClick();
            }}
            style={{
              backgroundColor: 'var(--color-cta-green, #2E6B34)',
              borderRadius: '999px',
              height: '48px',
              fontWeight: 600,
            }}
          >
            {t('common:nav.openDashboard', 'Open Farmer Dashboard')}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default MobileNavDrawer;
