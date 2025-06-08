
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const KidsVoiceMessageWidget = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) { // Max 30 seconds
          stopRecording();
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecording(true);
  };

  const playRecording = () => {
    toast({
      title: "Abspielen! 🎵",
      description: "Deine Nachricht wird abgespielt...",
    });
  };

  const sendMessage = () => {
    toast({
      title: "Nachricht gesendet! 💌",
      description: "Deine Sprachnachricht wurde an das Radio-Team gesendet!",
    });
    setHasRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200/50 dark:border-purple-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Mic className="h-5 w-5 text-purple-500" />
          Sprachnachricht
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-6xl mb-2 transition-transform ${isRecording ? 'animate-pulse scale-110' : ''}`}>
            🎤
          </div>
          {isRecording && (
            <div className="text-lg font-bold text-red-500">
              ● REC {formatTime(recordingTime)}
            </div>
          )}
          {!isRecording && recordingTime > 0 && (
            <div className="text-sm text-muted-foreground">
              Aufnahme: {formatTime(recordingTime)}
            </div>
          )}
        </div>

        {!isRecording && !hasRecording && (
          <Button 
            onClick={startRecording}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            size="lg"
          >
            <Mic className="h-5 w-5 mr-2" />
            Aufnahme starten
          </Button>
        )}

        {isRecording && (
          <Button 
            onClick={stopRecording}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            size="lg"
          >
            <Square className="h-5 w-5 mr-2" />
            Aufnahme stoppen
          </Button>
        )}

        {hasRecording && (
          <div className="space-y-2">
            <Button 
              onClick={playRecording}
              variant="outline"
              className="w-full border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Play className="h-4 w-4 mr-2" />
              Anhören
            </Button>
            <Button 
              onClick={sendMessage}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              An Radio senden
            </Button>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Sende uns eine Nachricht! Erzähl uns, was dir gefällt oder was du hören möchtest.
        </p>
      </CardContent>
    </Card>
  );
};

export default KidsVoiceMessageWidget;
