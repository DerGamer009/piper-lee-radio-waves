
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, AlertCircle, Baby, Star } from "lucide-react";
import AudioVisualizer from "./AudioVisualizer";
import KidsStreamInfo from "./KidsStreamInfo";
import { useToast } from "@/hooks/use-toast";

interface KidsRadioPlayerProps {
  streamUrl: string;
  stationName: string;
  compact?: boolean;
}

const KidsRadioPlayer = ({ streamUrl, stationName, compact = false }: KidsRadioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6); // Lower default volume for kids
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
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
      console.error("Kids audio playback error:", e);
      setIsPlaying(false);
      setIsLoading(false);
      setStreamError("Das Kids Radio konnte nicht geladen werden");
      toast({
        title: "Ups! Ein kleiner Fehler",
        description: "Das Kids Radio konnte nicht abgespielt werden. Versuche es gleich nochmal!",
        variant: "destructive",
      });
    };
    
    const handleStalled = () => {
      setIsLoading(true);
      setStreamError("Kids Radio wird geladen...");
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setStreamError("Das Kids Radio wurde beendet");
    };
    
    audioRef.current.addEventListener("waiting", handleWaiting);
    audioRef.current.addEventListener("playing", handlePlaying);
    audioRef.current.addEventListener("error", handleError as EventListener);
    audioRef.current.addEventListener("stalled", handleStalled);
    audioRef.current.addEventListener("ended", handleEnded);
    
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
  }, [toast, streamUrl]);

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
            console.error("Kids audio playback failed:", error);
            setIsLoading(false);
            setStreamError("Fehler beim Abspielen");
            toast({
              title: "Ups! Ein kleiner Fehler",
              description: "Das Kids Radio konnte nicht abgespielt werden. Versuche es gleich nochmal!",
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

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 flex flex-col gap-2 w-full max-w-xs shadow-sm border border-pink-200/50 dark:border-pink-700/50">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm flex items-center gap-1">
            <Baby className="h-4 w-4 text-pink-500" />
            {stationName}
          </h3>
          <Button
            onClick={togglePlay}
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            disabled={!!streamError}
          >
            {isLoading ? (
              <div className="h-3 w-3 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
            ) : streamError ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : isPlaying ? (
              <Pause className="h-4 w-4 text-pink-500" />
            ) : (
              <Play className="h-4 w-4 text-pink-500" />
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
            className="text-muted-foreground hover:text-pink-500 p-0 h-6 w-6"
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

  return (
    <div className="bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10 border border-pink-200/50 dark:border-pink-700/50 rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Baby className="h-6 w-6 text-pink-500" />
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stationName}</h2>
        <p className="text-pink-500/70 dark:text-pink-400/70">Live für Kids</p>
      </div>
      
      <KidsStreamInfo />
      
      <div className="flex justify-center mb-8 mt-6">
        {streamError ? (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-500 text-center">{streamError}</p>
          </div>
        ) : isPlaying ? (
          <div className="relative">
            <div className="absolute -inset-1 rounded-full opacity-75 bg-pink-400 animate-pulse-ring"></div>
            <AudioVisualizer isActive={isPlaying && !isLoading} />
          </div>
        ) : (
          <div className="h-12 flex items-center justify-center">
            <p className="text-pink-500/70 dark:text-pink-400/70">Klicke Play zum Hören</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-pink-400 hover:bg-pink-400/20 transition-all duration-300"
          disabled={!!streamError}
        >
          {isLoading ? (
            <div className="h-4 w-4 rounded-full border-2 border-pink-500 border-t-transparent animate-spin"></div>
          ) : streamError ? (
            <AlertCircle className="h-6 w-6 text-red-500" />
          ) : isPlaying ? (
            <Pause className="h-6 w-6 text-pink-500" />
          ) : (
            <Play className="h-6 w-6 text-pink-500" />
          )}
        </Button>
        
        <div className="flex items-center gap-2 w-3/5">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="icon"
            className="text-pink-400 hover:text-pink-500"
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

export default KidsRadioPlayer;
