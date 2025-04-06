import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";
import StreamInfo from "./StreamInfo";
import { useToast } from "@/components/ui/use-toast";

interface RadioPlayerProps {
  streamUrl: string;
  stationName: string;
  compact?: boolean;
}

const RadioPlayer = ({ streamUrl, stationName, compact = false }: RadioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Create a new audio element or reset the existing one
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    // Set proper properties
    audioRef.current.src = streamUrl;
    audioRef.current.volume = volume;
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.preload = "auto";
    
    const handleWaiting = () => {
      setIsLoading(true);
      setStreamError(null);
    };
    
    const handlePlaying = () => {
      setIsLoading(false);
      setStreamError(null);
    };
    
    const handleError = (e: ErrorEvent) => {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
      setIsLoading(false);
      setStreamError("Der Stream konnte nicht geladen werden");
      toast({
        title: "Fehler beim Abspielen",
        description: "Der Stream konnte nicht geladen werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    };
    
    const handleStalled = () => {
      setIsLoading(true);
      setStreamError("Stream wird geladen...");
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setStreamError("Stream wurde beendet");
    };
    
    audioRef.current.addEventListener("waiting", handleWaiting);
    audioRef.current.addEventListener("playing", handlePlaying);
    audioRef.current.addEventListener("error", handleError as EventListener);
    audioRef.current.addEventListener("stalled", handleStalled);
    audioRef.current.addEventListener("ended", handleEnded);
    
    // Clean up
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("waiting", handleWaiting);
        audioRef.current.removeEventListener("playing", handlePlaying);
        audioRef.current.removeEventListener("error", handleError as EventListener);
        audioRef.current.removeEventListener("stalled", handleStalled);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [streamUrl, toast]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        setStreamError(null);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Audio playback failed:", error);
            setIsLoading(false);
            setStreamError("Fehler beim Abspielen");
            toast({
              title: "Fehler beim Abspielen",
              description: "Der Stream konnte nicht abgespielt werden. Bitte versuchen Sie es später erneut.",
              variant: "destructive",
            });
          });
      }
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

  // Compact version for admin/moderator pages
  if (compact) {
    return (
      <div className="bg-card rounded-lg p-4 flex flex-col gap-2 w-full max-w-xs shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{stationName}</h3>
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            disabled={!!streamError}
          >
            {isLoading ? (
              <div className="h-3 w-3 rounded-full border-2 border-radio-purple border-t-transparent animate-spin"></div>
            ) : streamError ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 text-radio-purple" />
            ) : (
              <Play className="h-4 w-4 text-radio-purple" />
            )}
          </Button>
        </div>
        
        {streamError && (
          <p className="text-xs text-red-500">{streamError}</p>
        )}
        
        <div className="flex items-center gap-2 w-full">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white p-0 h-6 w-6"
            disabled={!!streamError}
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-full"
            disabled={!!streamError}
          />
        </div>
      </div>
    );
  }

  // Full version (original)
  return (
    <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">{stationName}</h2>
        <p className="text-muted-foreground">Live Stream</p>
      </div>
      
      <StreamInfo />
      
      <div className="flex justify-center mb-8 mt-6">
        {streamError ? (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-500">{streamError}</p>
          </div>
        ) : isPlaying ? (
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
      
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-radio-purple hover:bg-radio-purple/20 transition-all duration-300"
          disabled={!!streamError}
        >
          {isLoading ? (
            <div className="h-4 w-4 rounded-full border-2 border-radio-purple border-t-transparent animate-spin"></div>
          ) : streamError ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
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
            disabled={!!streamError}
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
            disabled={!!streamError}
          />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
