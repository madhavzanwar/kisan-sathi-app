import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SmoothScroll } from './design-system/components/SmoothScroll.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

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
    <div
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        border: '3px solid rgba(46, 107, 52, 0.2)',
        borderTopColor: '#2E6B34',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <ErrorBoundary>
      <SmoothScroll>
        <Router>
          <AppRoutes />
        </Router>
      </SmoothScroll>
    </ErrorBoundary>
  );
}

export default App;
