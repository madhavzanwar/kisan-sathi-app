import React from 'react';
import { motion } from 'framer-motion';

/**
 * BlurIn — One-shot viewport entrance animation.
 * Smoothly transitions from blurred, translated, low-opacity to sharp and in-place.
 */
export const BlurIn = ({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 24,
  blurAmount = 12,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        filter: `blur(${blurAmount}px)`,
        y: yOffset,
      }}
      whileInView={{
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // expo out curve
      }}
      className={className}
      style={{
        willChange: 'transform, opacity, filter',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default BlurIn;
