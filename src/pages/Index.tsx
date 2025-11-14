import { useState } from 'react';
import { MusicPlayer } from '@/components/MusicPlayer';
import { HeartsAnimation } from '@/components/HeartsAnimation';
import { Heart } from 'lucide-react';

// Sample songs - users can add their own songs to the public/songs folder
const sampleSongs = [
  {
    title: "Our First Song",
    artist: "For My Love",
    src: "/songs/song1.mp3",
    cover: "",
  },
  {
    title: "Dancing Together",
    artist: "For My Love",
    src: "/songs/song2.mp3",
    cover: "",
  },
  {
    title: "Forever Yours",
    artist: "For My Love",
    src: "/songs/song3.mp3",
    cover: "",
  },
];

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Animated Hearts Background */}
      <HeartsAnimation isPlaying={isPlaying} />
      
      {/* Decorative Elements */}
      <div className="fixed top-10 left-10 animate-float">
        <Heart className="w-12 h-12 text-love-pink opacity-30" fill="currentColor" />
      </div>
      <div className="fixed bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <Heart className="w-16 h-16 text-love-purple opacity-30" fill="currentColor" />
      </div>
      <div className="fixed top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
        <Heart className="w-10 h-10 text-love-red opacity-30" fill="currentColor" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 romantic-gradient bg-clip-text text-transparent">
            Music for My Love
          </h1>
          <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
            Every song reminds me of you <Heart className="w-5 h-5 text-love-pink animate-heart-beat" fill="currentColor" />
          </p>
        </div>

        {/* Music Player */}
        <MusicPlayer songs={sampleSongs} onPlayingChange={setIsPlaying} />

        {/* Instructions */}
        <div className="mt-12 text-center max-w-lg mx-auto px-4">
          <p className="text-sm text-muted-foreground bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-soft">
            💝 <strong>Add Your Songs:</strong> Place your music files in the <code className="bg-muted px-2 py-1 rounded">public/songs/</code> folder
            <br />
            🎨 <strong>Add Album Art:</strong> Name your images the same as your songs (e.g., song1.jpg)
            <br />
            📝 <strong>Add Subtitles:</strong> Create .srt files with the same name as your songs
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
