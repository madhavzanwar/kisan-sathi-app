import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Word component that maps scroll position to text ink reveal.
 * Runs completely via framer-motion transforms without re-rendering the React tree.
 */
const RevealWord = ({ word, progress, range }) => {
  const color = useTransform(progress, range, ['#5C6E5F', '#0E2A12']);
  const opacity = useTransform(progress, range, [0.55, 1]);

  return (
    <motion.span
      style={{
        display: 'inline-block',
        color,
        opacity,
        marginRight: '0.28em',
        transition: 'none',
      }}
    >
      {word}
    </motion.span>
  );
};

/**
 * ScrollRevealText — Scrolls words from muted sage to dark forest ink.
 * - Driven by framer-motion useScroll & useTransform.
 * - No per-frame React state updates.
 * - Supports an optional inlineElement (e.g. video pill) inserted at insertIndex.
 */
export const ScrollRevealText = ({
  text = '',
  children,
  className = '',
  style = {},
  inlineElement = null,
  inlineInsertIndex = -1,
  offset = ['start 0.85', 'end 0.35'],
}) => {
  const containerRef = useRef(null);
  const rawText = text || (typeof children === 'string' ? children : '');
  const words = rawText.trim().split(/\s+/);
  const total = words.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  return (
    <p
      ref={containerRef}
      className={`scroll-reveal-text ${className}`}
      style={{
        display: 'inline',
        lineHeight: 1.45,
        letterSpacing: '-0.02em',
        margin: 0,
        ...style,
      }}
    >
      {words.map((word, i) => {
        const start = i / total;
        const end = Math.min(1, (i + 1.5) / total);

        return (
          <React.Fragment key={i}>
            <RevealWord
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
            />
            {inlineElement && i === inlineInsertIndex && (
              <span
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  margin: '0 0.4em 0.15em',
                }}
              >
                {inlineElement}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </p>
  );
};

export default ScrollRevealText;
