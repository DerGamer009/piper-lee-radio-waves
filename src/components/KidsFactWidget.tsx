
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, RefreshCw } from "lucide-react";

const KidsFactWidget = () => {
  const [currentFact, setCurrentFact] = useState(0);
  
  const facts = [
    "Wusstest du, dass Elefanten mit ihren Füßen hören können?",
    "Ein Pingpongball kann schneller als ein Rennwagen sein!",
    "Schmetterlinge schmecken mit ihren Füßen!",
    "Delfine haben Namen füreinander!",
    "Ein Jahr auf dem Mars dauert 687 Erdentage!",
    "Kolibris sind die einzigen Vögel, die rückwärts fliegen können!",
    "Wale singen Lieder, die andere Wale kilometerweit hören können!",
    "Pinguine können bis zu 20 Minuten unter Wasser bleiben!"
  ];

  const getNewFact = () => {
    const newIndex = Math.floor(Math.random() * facts.length);
    setCurrentFact(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(getNewFact, 30000); // New fact every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-green-100/50 to-teal-100/50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200/50 dark:border-green-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-green-500" />
          Wusstest du schon?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{facts[currentFact]}</p>
        <Button 
          onClick={getNewFact}
          variant="outline" 
          size="sm"
          className="w-full border-green-400 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Neuer Fakt!
        </Button>
      </CardContent>
    </Card>
  );
};

export default KidsFactWidget;
