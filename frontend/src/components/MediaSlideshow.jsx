import React, { useState, useEffect, useRef } from 'react';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

const MediaSlideshow = ({ mediaItems = [], isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reset index when slideshow opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          if (getCurrentMedia()?.type === 'video') {
            togglePlayPause();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  // Prevent body scroll when slideshow is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getCurrentMedia = () => mediaItems[currentIndex];

  const goToNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoLoadStart = () => {
    setIsLoading(true);
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  if (!isOpen || !mediaItems.length) return null;

  const currentMedia = getCurrentMedia();
  const isVideo = currentMedia?.type === 'video';
  const mediaUrl = currentMedia?.url?.startsWith('http') 
    ? currentMedia.url 
    : `http://localhost/Eaglonhytes-main/api/uploads/${currentMedia?.url}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      {mediaItems.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex === mediaItems.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Media Display */}
      <div 
        className="relative w-full h-full flex items-center justify-center p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isVideo ? (
          <div className="relative max-w-full max-h-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            
            <video
              ref={videoRef}
              src={mediaUrl}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              controls={false}
              muted={isMuted}
              onLoadStart={handleVideoLoadStart}
              onLoadedData={handleVideoLoad}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onClick={togglePlayPause}
            />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePlayPause}
                  className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                >
                  {isPlaying ? (
                    <PauseIcon className="w-5 h-5" />
                  ) : (
                    <PlayIcon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                >
                  {isMuted ? (
                    <SpeakerXMarkIcon className="w-5 h-5" />
                  ) : (
                    <SpeakerWaveIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <img
            src={mediaUrl}
            alt={currentMedia?.caption || `Media ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onError={(e) => {
              console.error('Image failed to load:', e.target.src);
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        )}
      </div>

      {/* Media Caption */}
      {currentMedia?.caption && (
        <div className="absolute bottom-20 left-4 right-4 text-center">
          <p className="text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
            {currentMedia.caption}
          </p>
        </div>
      )}

      {/* Thumbnail Navigation */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
            {mediaItems.map((media, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-white' 
                    : 'border-transparent opacity-60 hover:opacity-80'
                }`}
              >
                {media.type === 'video' ? (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <PlayIcon className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <img
                    src={media.url?.startsWith('http') 
                      ? media.url 
                      : `http://localhost/Eaglonhytes-main/api/uploads/${media.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Counter */}
      {mediaItems.length > 1 && (
        <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-lg">
          {currentIndex + 1} / {mediaItems.length}
        </div>
      )}
    </div>
  );
};

export default MediaSlideshow;
