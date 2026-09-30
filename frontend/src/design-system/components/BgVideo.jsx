import React, { useRef, useEffect, useState } from 'react';

/**
 * BgVideo — High-performance background video component.
 * - Autoplays, loops, muted, playsInline.
 * - Uses IntersectionObserver to pause playback when out of viewport.
 * - Falls back to poster if prefers-reduced-motion or saveData is enabled.
 */
export const BgVideo = ({
  src,
  webmSrc,
  poster,
  className = '',
  style = {},
  overlay = null,
  ...props
}) => {
  const videoRef = useRef(null);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(true);

  useEffect(() => {
    // Check user accessibility & data constraints
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = Boolean(navigator.connection && navigator.connection.saveData);

    if (prefersReducedMotion || saveData) {
      setShouldPlayVideo(false);
      return;
    }

    const videoEl = videoRef.current;
    if (!videoEl) return;

    // IntersectionObserver to pause video when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = videoEl.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Ignore autoplay rejection
            });
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
  }, []);

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
      {shouldPlayVideo ? (
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
          }}
          {...props}
        >
          {webmUrl && <source src={webmUrl} type="video/webm" />}
          {mp4Url && <source src={mp4Url} type="video/mp4" />}
          Your browser does not support the video tag.
        </video>
      ) : (
        poster && (
          <img
            src={poster}
            alt="Background fallback"
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
        )
      )}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};

export default BgVideo;
