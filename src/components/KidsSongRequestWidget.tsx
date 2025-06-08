
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Send, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const KidsSongRequestWidget = () => {
  const [songRequest, setSongRequest] = useState("");
  const [childName, setChildName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (songRequest.trim() && childName.trim()) {
      toast({
        title: "Liedwunsch gesendet! 🎵",
        description: `Hallo ${childName}! Wir versuchen "${songRequest}" für dich zu spielen!`,
      });
      setSongRequest("");
      setChildName("");
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5 text-purple-500" />
          Lied wünschen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Dein Name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="border-purple-300 focus:border-purple-500"
          />
          <Input
            placeholder="Welches Lied möchtest du hören?"
            value={songRequest}
            onChange={(e) => setSongRequest(e.target.value)}
            className="border-purple-300 focus:border-purple-500"
          />
          <Button 
            type="submit" 
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
            disabled={!songRequest.trim() || !childName.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Wunsch senden
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default KidsSongRequestWidget;
