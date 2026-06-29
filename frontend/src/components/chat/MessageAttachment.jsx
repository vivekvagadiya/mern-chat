import { Download, FileText } from 'lucide-react';

export const MessageAttachment = ({ message }) => {
  if (!message?.mediaUrl) return null;

  switch (message.type) {
    case 'image':
      return (
        <div className="mb-2 relative rounded-lg overflow-hidden max-w-[240px] sm:max-w-xs bg-dark-surface-2">
          <img
            src={message.mediaUrl}
            alt={message.content || 'Image attachment'}
            className="w-full h-auto object-cover max-h-[300px]"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    case 'video':
      return (
        <div className="mb-2 relative rounded-lg overflow-hidden max-w-[240px] sm:max-w-xs bg-black">
          <video controls className="w-full h-auto max-h-[300px]" preload="metadata">
            <source src={message.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case 'file': {
      const fileName =
        message.fileName ||
        (typeof message.mediaUrl === 'string' ? message.mediaUrl.split('/').pop() : 'Unknown file');
      // Just a mock placeholder for file size if it's not provided by backend yet
      const fileSize = message.fileSize || 'Attachment';

      return (
        <div className="mb-2 flex items-center gap-3 p-3 rounded-lg bg-dark-surface border border-dark-border transition-colors w-full max-w-[240px] sm:max-w-xs hover:border-glass-light shadow-elevation-1">
          {/* File Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg shrink-0">
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
            className="p-2 bg-dark-surface-alt rounded-full transition-colors hover:text-primary hover:bg-dark-surface-2 shrink-0 border border-dark-border"
            title="Download"
          >
            <Download size={16} />
          </a>
        </div>
      );
    }
    default:
      return null;
  }
};
