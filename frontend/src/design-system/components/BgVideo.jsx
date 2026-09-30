import React, { useRef, useEffect, useState } from 'react';

/**
 * BgVideo — High-performance background video component.
 * - Skips video loading entirely on mobile (< 768px), saveData, or prefers-reduced-motion.
 * - Always renders a right-sized high-priority poster image (< 60 KB on mobile) as the LCP element.
 * - Autoplays, loops, muted, playsInline on desktop when visible.
 */
export const BgVideo = ({
  src,
  webmSrc,
  poster = '/videos/hero-poster.webp',
  mobilePoster = '/videos/hero-poster-mobile.webp',
  className = '',
  style = {},
  overlay = null,
  forcePoster = false,
  ...props
}) => {
  const videoRef = useRef(null);

  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) || forcePoster;
  });

  // Check initial constraints synchronously to prevent video request on mobile initial paint
  const [shouldPlayVideo, setShouldPlayVideo] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isMobile = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !isMobile && !saveData && !prefersReducedMotion && !forcePoster;
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 768 || (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsMobileScreen(isMobile || forcePoster);

    if (isMobile || saveData || prefersReducedMotion || forcePoster) {
      setShouldPlayVideo(false);
      return;
    }

    setShouldPlayVideo(true);

    const videoEl = videoRef.current;
    if (!videoEl) return;

    // IntersectionObserver to pause video when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(videoEl);

    return () => {
      observer.disconnect();
    };
  }, [forcePoster]);

  const mp4Url = typeof src === 'string' ? src : src?.mp4;
  const webmUrl = webmSrc || (typeof src === 'object' ? src?.webm : null);

  return (
    <div
      className={`bg-video-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* 1. Instant LCP Poster Layer (Responsive Picture, Eager, High Priority) */}
      {isMobileScreen ? (
        <img
          src={mobilePoster}
          alt="KisanSathi Hero Crop Field"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />
      ) : (
        <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <source media="(max-width: 768px)" srcSet={mobilePoster} type="image/webp" />
          <source media="(min-width: 769px)" srcSet={poster} type="image/webp" />
          <img
            src={poster}
            alt="KisanSathi Hero Crop Field"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />
        </picture>
      )}

      {/* 2. Desktop Video Layer (only rendered and loaded on desktop non-saveData screens) */}
      {shouldPlayVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            zIndex: 1,
          }}
          {...props}
        >
          {webmUrl && <source src={webmUrl} type="video/webm" />}
          {mp4Url && <source src={mp4Url} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      )}

      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};

export default BgVideo;
