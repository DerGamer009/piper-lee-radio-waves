
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";
import StreamInfo from "./StreamInfo";

interface RadioPlayerProps {
  streamUrl: string;
  stationName: string;
}

const RadioPlayer = ({ streamUrl, stationName }: RadioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(streamUrl);
    audioRef.current.volume = volume;
    
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);
    
    audioRef.current.addEventListener("waiting", handleWaiting);
    audioRef.current.addEventListener("playing", handlePlaying);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("waiting", handleWaiting);
        audioRef.current.removeEventListener("playing", handlePlaying);
      }
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
    
    if (volumeValue === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{stationName}</h2>
        <p className="text-muted-foreground">Live Stream</p>
      </div>
      
      <StreamInfo />
      
      <div className="flex justify-center mb-8 mt-6">
        {isPlaying ? (
          <div className="relative">
            <div className="absolute -inset-1 rounded-full opacity-75 bg-radio-purple animate-pulse-ring"></div>
            <AudioVisualizer isActive={isPlaying && !isLoading} />
          </div>
        ) : (
          <div className="h-12 flex items-center justify-center">
            <p className="text-muted-foreground">Klicken Sie Play zum Hören</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-radio-purple hover:bg-radio-purple/20 transition-all duration-300"
        >
          {isLoading ? (
            <div className="h-4 w-4 rounded-full border-2 border-radio-purple border-t-transparent animate-spin"></div>
          ) : isPlaying ? (
            <Pause className="h-6 w-6 text-radio-purple" />
          ) : (
            <Play className="h-6 w-6 text-radio-purple" />
          )}
        </Button>
        
        <div className="flex items-center gap-2 w-3/5">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-white"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
