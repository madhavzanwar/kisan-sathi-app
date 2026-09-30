/**
 * KisanSathi Design System — Ant Design Theme Tokens & Component Overrides
 * Tuned to match the editorial agricultural reference design.
 */

export const kisanSathiTheme = {
  cssVar: { prefix: 'ant' },
  hashed: false,
  token: {
    // --- Brand Palette ---
    colorPrimary: '#2E6B34',        // Balanced natural CTA green
    colorSuccess: '#2E6B34',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#059669',

    // --- Text Hierarchy ---
    colorTextBase: '#0E2A12',       // Forest ink
    colorText: '#0E2A12',
    colorTextSecondary: '#7C8B7E',  // Muted sage text
    colorTextTertiary: '#A0ACA2',
    colorTextQuaternary: '#CCD4CD',

    // --- Surfaces & Layout ---
    colorBgBase: '#FFFFFF',
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#F4F5F3',       // Warm light agricultural paper
    colorBgSpotlight: '#0E2A12',

    // --- Borders ---
    colorBorder: 'rgba(14, 42, 18, 0.12)',
    colorBorderSecondary: 'rgba(14, 42, 18, 0.06)',

    // --- Typography & Scale ---
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 15,
    fontSizeHeading1: 52,
    fontSizeHeading2: 38,
    fontSizeHeading3: 26,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // --- Dimensions & Radii ---
    borderRadius: 14,
    borderRadiusLG: 20,
    borderRadiusSM: 8,
    borderRadiusXS: 4,
    controlHeight: 44,
    controlHeightLG: 50,
    controlHeightSM: 36,

    // --- Subtle Shadows ---
    boxShadow: '0 4px 16px rgba(14, 42, 18, 0.06)',
    boxShadowSecondary: '0 8px 24px rgba(14, 42, 18, 0.08)',
  },
  components: {
    Button: {
      borderRadius: 999,
      borderRadiusLG: 999,
      borderRadiusSM: 999,
      controlHeight: 44,
      controlHeightLG: 52,
      controlHeightSM: 36,
      fontWeight: 600,
      defaultColor: '#0E2A12',
      defaultBorderColor: 'rgba(14, 42, 18, 0.18)',
      defaultBg: '#FFFFFF',
      defaultHoverBg: '#F4F5F3',
      defaultHoverColor: '#0E2A12',
      defaultHoverBorderColor: '#0E2A12',
      primaryColor: '#FFFFFF',
      colorPrimary: '#2E6B34',
      colorPrimaryHover: '#245729',
      colorPrimaryActive: '#1B421F',
    },
    Collapse: {
      colorBgContainer: '#F4F5F3',
      contentBg: 'transparent',
      headerBg: 'transparent',
      borderRadiusLG: 14,
      colorBorder: 'transparent',
    },
    Tabs: {
      itemColor: '#7C8B7E',
      itemHoverColor: '#0E2A12',
      itemSelectedColor: '#0E2A12',
      inkBarColor: '#2E6B34',
      titleFontSize: 15,
    },
    Segmented: {
      colorBgLayout: '#ECEEE9',
      itemSelectedBg: '#FFFFFF',
      itemSelectedColor: '#0E2A12',
      itemColor: '#7C8B7E',
      borderRadius: 999,
      borderRadiusSM: 999,
      trackPadding: 4,
    },
    Drawer: {
      colorBgElevated: '#FFFFFF',
      borderRadiusLG: 24,
    },
    Tag: {
      borderRadiusSM: 999,
    },
    Input: {
      borderRadius: 14,
      colorBorder: 'rgba(14, 42, 18, 0.15)',
      activeBorderColor: '#2E6B34',
      hoverBorderColor: '#7C8B7E',
      controlHeight: 44,
    },
    Select: {
      borderRadius: 14,
      colorBorder: 'rgba(14, 42, 18, 0.15)',
      controlHeight: 44,
    },
    Upload: {
      borderRadiusLG: 16,
    },
    Modal: {
      borderRadiusLG: 20,
      colorBgElevated: '#FFFFFF',
    },
    Table: {
      borderRadiusLG: 14,
      headerBg: '#F9FAF8',
      headerColor: '#0E2A12',
      colorBorderSecondary: 'rgba(14, 42, 18, 0.08)',
    },
    Slider: {
      colorPrimary: '#2E6B34',
      colorPrimaryBorder: '#2E6B34',
      dotActiveBorderColor: '#2E6B34',
      trackBg: '#2E6B34',
      trackHoverBg: '#245729',
      handleColor: '#2E6B34',
      handleActiveColor: '#1B421F',
    },
    InputNumber: {
      borderRadius: 12,
      controlHeight: 44,
    },
    Spin: {
      colorPrimary: '#2E6B34',
    },
    Progress: {
      defaultColor: '#2E6B34',
    },
  },
};

export default kisanSathiTheme;
