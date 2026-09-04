import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FadeUpProps {
  children: React.ReactNode;
  keyTrigger?: string | number;
  delay?: number;
  className?: string;
  yOffset?: number;
}

export const FadeUp: React.FC<FadeUpProps> = ({
  children,
  keyTrigger,
  delay = 0,
  className = '',
  yOffset = 12,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyTrigger}
        initial={{ opacity: 0, y: yOffset, filter: 'blur(3px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -yOffset * 0.7, filter: 'blur(3px)' }}
        transition={{
          duration: 0.35,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
