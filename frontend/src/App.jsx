import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, Spin } from 'antd';
import { kisanSathiTheme } from './design-system/theme.js';
import { SmoothScroll } from './design-system/components/SmoothScroll.jsx';

// Route code-splitting
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const RouteLoadingFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F4F5F3',
    }}
  >
    <Spin size="large" />
  </div>
);

function AppRoutes() {
  return (
    <div className="legacy-app">
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ConfigProvider theme={kisanSathiTheme}>
      <AntdApp className="ant-app">
        <SmoothScroll>
          <Router>
            <AppRoutes />
          </Router>
        </SmoothScroll>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
