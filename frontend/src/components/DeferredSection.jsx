import React, { useState, useEffect, useRef } from 'react';

/**
 * DeferredSection — Defers mounting children until scrolled near viewport (rootMargin: 350px).
 * Prevents dynamic imports, below-the-fold component waterfalls, and heavy images
 * from competing with critical LCP and FCP resources on mobile.
 */
export const DeferredSection = ({ children, minHeight = '400px', id = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '80px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
};

export default DeferredSection;
