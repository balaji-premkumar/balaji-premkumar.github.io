import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Github } from 'lucide-react';
import useGitHubAvatar from '../hooks/useGitHubAvatar';

interface GitHubAvatarProps {
  size?: number;
  className?: string;
  showGitHubIcon?: boolean;
  animate?: boolean;
}

const GitHubAvatar: React.FC<GitHubAvatarProps> = ({ 
  size = 200, 
  className = '', 
  showGitHubIcon = false,
  animate = true
}) => {
  const { avatarUrl, isLoading, initials, fallbackUrl } = useGitHubAvatar(size);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl animate-pulse ${className}`}
        style={{ width: size, height: size }}
      >
        <User size={size * 0.4} className="text-primary-400 dark:text-primary-600" />
      </div>
    );
  }

  // Show avatar or fallback
  const avatarContent = (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {!imageError && avatarUrl ? (
        <>
          {/* GitHub Avatar */}
          <img
            src={avatarUrl}
            alt="GitHub Profile"
            className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
          
          {/* Loading placeholder while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl animate-pulse">
              <User size={size * 0.4} className="text-primary-400 dark:text-primary-600" />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Fallback: Try direct GitHub URL */}
          {!imageError && fallbackUrl && (
            <img
              src={fallbackUrl}
              alt="GitHub Profile Fallback"
              className="w-full h-full object-cover rounded-xl"
              onError={() => setImageError(true)}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          )}
          
          {/* Final fallback: Initials */}
          {imageError && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl">
              <span className="font-bold" style={{ fontSize: size * 0.3 }}>
                {initials}
              </span>
            </div>
          )}
        </>
      )}
      
      {/* GitHub icon overlay (optional) */}
      {showGitHubIcon && imageLoaded && !imageError && (
        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg border-2 border-gray-200 dark:border-gray-600">
          <Github size={size * 0.15} className="text-gray-700 dark:text-gray-300" />
        </div>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {avatarContent}
      </motion.div>
    );
  }

  return avatarContent;
};

export default GitHubAvatar;
