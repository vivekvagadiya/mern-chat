import React, { useState } from 'react';
import { Download, FileText, Eye } from 'lucide-react';
import ImagePreviewModal from '../modals/ImagePreviewModal';

export const MessageAttachment = ({ message }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!message?.mediaUrl) return null;

  switch (message.type) {
    case 'image':
      return (
        <>
          <div
            onClick={() => setIsPreviewOpen(true)}
            className="group/image mb-2.5 relative rounded-xl overflow-hidden w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[480px] bg-dark-surface-2 border border-dark-border/40 hover:border-primary/30 transition-all duration-300 shadow-premium-sm hover:shadow-premium-md cursor-pointer"
          >
            <img
              src={message.mediaUrl}
              alt={message.content || 'Image attachment'}
              className="w-full h-auto object-cover max-h-[320px] transition-transform duration-500 group-hover/image:scale-[1.02]"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <span className="p-2 bg-dark-surface-2/95 rounded-full text-white backdrop-blur-sm border border-white/10 shadow-elevation-1">
                <Eye size={18} />
              </span>
            </div>
          </div>

          <ImagePreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            imageUrl={message.mediaUrl}
            description={message.content}
          />
        </>
      );
    case 'video':
      return (
        <div className="mb-2.5 relative rounded-xl overflow-hidden w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[480px] bg-black border border-dark-border/40 shadow-premium-sm">
          <video
            controls
            className="w-full h-auto max-h-[320px] rounded-xl outline-none"
            preload="metadata"
          >
            <source src={message.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case 'file': {
      const fileName =
        message.fileName ||
        (typeof message.mediaUrl === 'string' ? message.mediaUrl.split('/').pop() : 'Unknown file');
      const fileSize = message.fileSize || 'Attachment';

      return (
        <div className="mb-2.5 flex items-center gap-3 p-3.5 rounded-xl bg-dark-surface-2 border border-dark-border/45 hover:border-primary/40 transition-all duration-300 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] shadow-premium-sm hover:shadow-premium-md">
          {/* File Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl shrink-0">
            <FileText size={20} />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-dark-text truncate" title={fileName}>
              {fileName}
            </p>
            <p className="text-xs text-dark-text-muted mt-0.5">{fileSize}</p>
          </div>

          {/* Download Button */}
          <a
            href={message.mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-dark-surface-alt hover:bg-dark-surface-3 rounded-full text-dark-text-muted hover:text-primary transition-all border border-dark-border shrink-0 hover:scale-105"
            title="Download"
          >
            <Download size={15} />
          </a>
        </div>
      );
    }
    default:
      return null;
  }
};
