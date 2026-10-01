import React, { useState, Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../sections/HeroSection';
import PoweredByStrip from '../sections/PoweredByStrip';
import DeferredSection from '../components/DeferredSection';

// Lazy-load below-the-fold sections for optimal LCP and TBT
const StatementSection = lazy(() => import('../sections/StatementSection'));
const FeaturesAccordion = lazy(() => import('../sections/FeaturesAccordion'));
const HowItWorks = lazy(() => import('../sections/HowItWorks'));
const SolutionsCarousel = lazy(() => import('../sections/SolutionsCarousel'));
const TestimonialsSection = lazy(() => import('../sections/TestimonialsSection'));
const FAQSection = lazy(() => import('../sections/FAQSection'));
const FinalCtaSection = lazy(() => import('../sections/FinalCtaSection'));
const Footer = lazy(() => import('../components/Footer'));
const AuthDrawer = lazy(() => import('../components/AuthDrawer'));

/**
 * Auth / Landing Page — Complete Kisan Sakhi landing experience.
 * Uses DeferredSection to keep initial mobile payload under 40 KB,
 * loading below-the-fold sections as the user scrolls.
 */
const Auth = () => {
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    document.title = 'KisanSathi — Har kisan ka saccha sathi | AI Smart Farming';
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        color: '#0E2A12',
        overflowX: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* 1. Fixed Pill Navbar */}
      <Navbar onOpenAuth={() => setShowPanel(true)} />

      {/* 2. Main Content Landmark */}
      <main id="main-content">
        {/* Hero Section (100vh full-bleed, LCP priority) */}
        <HeroSection
          onPrimaryAction={() => setShowPanel(true)}
          onSecondaryAction={() => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Modern Agritech Technologies Strip */}
        <PoweredByStrip />

        {/* 4. Statement Section (Deferred until scroll) */}
        <DeferredSection minHeight="280px">
          <Suspense fallback={<div style={{ minHeight: '280px' }} />}>
            <StatementSection />
          </Suspense>
        </DeferredSection>

        {/* 5. Features Accordion with Dynamic Image Display (Deferred) */}
        <DeferredSection minHeight="500px" id="features">
          <Suspense fallback={<div style={{ minHeight: '500px' }} />}>
            <FeaturesAccordion onTryFeature={() => setShowPanel(true)} />
          </Suspense>
        </DeferredSection>

        {/* 6. How It Works Interactive Preview (Deferred) */}
        <DeferredSection minHeight="500px" id="how-it-works">
          <Suspense fallback={<div style={{ minHeight: '500px' }} />}>
            <HowItWorks />
          </Suspense>
        </DeferredSection>

        {/* 7. Solutions Carousel with Staggered Layout (Deferred) */}
        <DeferredSection minHeight="400px" id="solutions">
          <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <SolutionsCarousel />
          </Suspense>
        </DeferredSection>

        {/* 8. Testimonials Section (Deferred) */}
        <DeferredSection minHeight="400px" id="testimonials">
          <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <TestimonialsSection />
          </Suspense>
        </DeferredSection>

        {/* 9. FAQ Section (Deferred) */}
        <DeferredSection minHeight="400px" id="faq">
          <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
            <FAQSection />
          </Suspense>
        </DeferredSection>

        {/* 10. Final Call-to-Action Banner (Deferred) */}
        <DeferredSection minHeight="350px">
          <Suspense fallback={<div style={{ minHeight: '350px' }} />}>
            <FinalCtaSection onCtaClick={() => setShowPanel(true)} />
          </Suspense>
        </DeferredSection>
      </main>

      {/* 11. Minimal Footer (Deferred) */}
      <DeferredSection minHeight="100px">
        <Suspense fallback={<div style={{ minHeight: '100px' }} />}>
          <Footer />
        </Suspense>
      </DeferredSection>

      {/* 12. Accessible Sliding Auth Drawer (Lazy loaded on demand) */}
      {showPanel && (
        <Suspense fallback={null}>
          <AuthDrawer open={showPanel} onClose={() => setShowPanel(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default Auth;
