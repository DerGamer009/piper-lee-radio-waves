
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Heart, Smile, Music } from "lucide-react";

const KidsGameWidget = () => {
  const [score, setScore] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState("🎵");
  
  const emojis = ["🎵", "🎶", "🎤", "🎸", "🥁", "🎹", "🎺", "🎷"];
  
  const playGame = () => {
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setCurrentEmoji(randomEmoji);
    setScore(prev => prev + 1);
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-100/50 to-orange-100/50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200/50 dark:border-yellow-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Musik-Memory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{currentEmoji}</div>
          <p className="text-sm text-muted-foreground">Punkte: {score}</p>
        </div>
        <Button 
          onClick={playGame}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <Music className="h-4 w-4 mr-2" />
          Neues Instrument!
        </Button>
      </CardContent>
    </Card>
  );
};

export default KidsGameWidget;
