import React from 'react';
import { createPortal } from 'react-dom';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImagePreviewModal({ isOpen, onClose, imageUrl, description }) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4 select-none"
          onClick={onClose}
        >
          {/* Header Actions */}
          <div
            className="absolute top-4 right-4 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-dark-surface-2/85 hover:bg-dark-surface-2 border border-dark-border rounded-full text-white transition-all hover:scale-105"
              title="Download original"
            >
              <Download size={18} />
            </a>
            <button
              onClick={onClose}
              className="p-2.5 bg-dark-surface-2/85 hover:bg-dark-surface-2 border border-dark-border rounded-full text-white transition-all hover:scale-105"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Image Content Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="max-w-full max-h-[80vh] md:max-w-4xl md:max-h-[85vh] flex items-center justify-center relative rounded-2xl overflow-hidden shadow-elevation-3 border border-dark-border/40"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageUrl}
              alt={description || 'Image Preview'}
              className="max-w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded-2xl"
            />
          </motion.div>

          {/* Optional Caption */}
          {description && (
            <p className="mt-4 text-sm text-dark-text bg-dark-surface-2/95 border border-dark-border/50 px-4 py-2 rounded-xl max-w-xl text-center shadow backdrop-blur-sm">
              {description}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
