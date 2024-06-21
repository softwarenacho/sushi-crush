import { useRef } from 'react';

const useBgSound = (url: string, volume: number = 0.5, loop: boolean = false) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    audioRef.current = new Audio(url);
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;
  }

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Failed to start playback:', error);
      });
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { play, stop };
};

export default useBgSound;
