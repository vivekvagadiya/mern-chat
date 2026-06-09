import React from 'react';

const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'w-10 h-10',
  rounded = 'rounded-lg',
  fallback = '👤',
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`${size} ${rounded} bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg ${className}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={`${size} ${rounded} object-cover ${className}`}
    />
  );
};

export default Avatar;