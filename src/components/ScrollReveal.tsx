import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
  amount?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  yOffset = 24,
  className = '',
  amount = 0.15,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, filter: 'blur(2px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1], // Desaceleración física suave
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
