import { useEffect, useRef } from 'react';

const usePoint = (url: string, volume: number = 0.5) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = new Audio(url);
    audioElement.volume = volume;

    audioRef.current = audioElement;
  }, [url, volume]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
        }).catch((error) => {
          console.error('Failed to start playback:', error);
        });
      }
    }
  };

  return { play };
};

export default usePoint;
