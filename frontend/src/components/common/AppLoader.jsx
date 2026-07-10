import React from 'react';
import { motion } from 'framer-motion';

export default function AppLoader() {
  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Glowing Ring */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Inner ring */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
          
          {/* Rotating active ring segment */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </div>

        {/* Text Fade/Pulse */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-sm font-semibold tracking-wide text-dark-text select-none">
            Initializing Chat
          </span>
          <span className="text-xs text-dark-text-muted select-none">
            Please wait...
          </span>
        </motion.div>
      </div>
    </div>
  );
}
