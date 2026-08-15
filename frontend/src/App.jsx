import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

// Global Video Background Component
const VideoBackground = () => (
  <div className="video-bg-container">
    <video autoPlay loop muted playsInline>
      <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4" type="video/mp4" />
    </video>
  </div>
);

function App() {
  return (
    <Router>
      <VideoBackground />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
