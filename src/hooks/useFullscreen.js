import { useState, useEffect, useRef } from 'react';

export const useFullscreen = () => {
  const [fullscreenWarnings, setFullscreenWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  const enterFullscreen = async () => {
    try {
      if (fullscreenRef.current) {
        if (fullscreenRef.current.requestFullscreen) {
          await fullscreenRef.current.requestFullscreen();
        } else if (fullscreenRef.current.webkitRequestFullscreen) {
          await fullscreenRef.current.webkitRequestFullscreen();
        } else if (fullscreenRef.current.mozRequestFullScreen) {
          await fullscreenRef.current.mozRequestFullScreen();
        } else if (fullscreenRef.current.msRequestFullscreen) {
          await fullscreenRef.current.msRequestFullscreen();
        }
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
      setIsFullscreen(false);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.log('Exit fullscreen failed:', error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return {
    fullscreenWarnings,
    setFullscreenWarnings,
    isFullscreen,
    setIsFullscreen,
    fullscreenRef,
    enterFullscreen,
    exitFullscreen
  };
};
