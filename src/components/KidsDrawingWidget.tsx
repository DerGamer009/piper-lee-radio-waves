
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Download, RotateCcw, Sparkles } from "lucide-react";

const KidsDrawingWidget = () => {
  const [currentColor, setCurrentColor] = useState("#ff6b6b");
  const [isDrawing, setIsDrawing] = useState(false);
  
  const colors = [
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", 
    "#feca57", "#ff9ff3", "#a8e6cf", "#ff8b94"
  ];
  
  const clearCanvas = () => {
    // Simple animation effect for clearing
    const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-pink-100/50 to-orange-100/50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-200/50 dark:border-pink-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5 text-pink-500" />
          Mal-Ecke
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-2">
          <canvas 
            id="drawing-canvas"
            width={200} 
            height={150}
            className="border-2 border-dashed border-gray-300 rounded cursor-crosshair"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setCurrentColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={clearCanvas}
            variant="outline" 
            size="sm"
            className="flex-1 border-pink-400 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Löschen
          </Button>
          <Button 
            size="sm"
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Fertig!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KidsDrawingWidget;
