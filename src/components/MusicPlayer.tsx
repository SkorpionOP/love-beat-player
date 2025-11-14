import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  src: string;
  cover?: string;
}

interface MusicPlayerProps {
  songs: Song[];
  onPlayingChange: (isPlaying: boolean) => void;
}

export function MusicPlayer({ songs, onPlayingChange }: MusicPlayerProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayingChange(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
      setIsTransitioning(false);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    }, 300);
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
      setIsTransitioning(false);
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
      }
    }, 300);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
      <Card 
        className={`
          romantic-gradient shadow-romantic border-love-blue/40 
          backdrop-blur-sm bg-card/95 p-8 rounded-3xl
          transition-all duration-300
          ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
          ${isPlaying ? 'animate-pulse-soft shadow-[0_0_60px_rgba(59,130,246,0.6)]' : ''}
        `}
      >
        {/* Album Art */}
        <div className="relative mb-8">
          <div 
            className={`
              w-64 h-64 mx-auto rounded-3xl shadow-glow 
              bg-gradient-to-br from-love-blue to-love-cyan
              flex items-center justify-center overflow-hidden
              ${isPlaying ? 'animate-pulse-soft shadow-[0_0_50px_rgba(59,130,246,0.8)]' : ''}
              transition-all duration-500
              ${isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
          >
            {currentSong.cover ? (
              <img 
                src={currentSong.cover} 
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Heart className="w-32 h-32 text-white animate-heart-beat drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Song Info */}
        <div 
          className={`
            text-center mb-6 transition-all duration-500
            ${isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {currentSong.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentSong.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="rounded-full w-14 h-14 hover:scale-110 transition-transform"
          >
            <SkipBack className="w-6 h-6" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlay}
            className="rounded-full w-20 h-20 romantic-gradient shadow-romantic hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8" fill="currentColor" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="rounded-full w-14 h-14 hover:scale-110 transition-transform"
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => setVolume(value[0])}
            className="cursor-pointer"
          />
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={currentSong.src} />
      </Card>
    </div>
  );
}
