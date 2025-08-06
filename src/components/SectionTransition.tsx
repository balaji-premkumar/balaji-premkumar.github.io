import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  className = '',
  gradientFrom = 'from-transparent',
  gradientTo = 'to-transparent'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, y }}
      className={`relative ${className}`}
    >
      {/* Gradient overlay for smooth transitions */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientFrom} ${gradientTo} pointer-events-none`} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default SectionTransition;
