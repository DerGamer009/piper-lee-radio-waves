
import { useEffect, useState } from "react";

interface AudioVisualizerProps {
  isActive: boolean;
}

const AudioVisualizer = ({ isActive }: AudioVisualizerProps) => {
  // For a simple visualizer, we'll just animate bars
  return (
    <div className="audio-visualizer">
      {[...Array(5)].map((_, i) => (
        <div 
          key={i}
          className={`audio-visualizer-bar h-${Math.floor(Math.random() * 8) + 2} ${
            isActive 
              ? i % 2 === 0 
                ? 'animate-wave-1' 
                : i % 3 === 0 
                  ? 'animate-wave-2' 
                  : 'animate-wave-3'
              : 'h-2'
          }`}
          style={{
            backgroundColor: isActive 
              ? `rgb(139, 92, 246, ${(i + 1) / 5})` 
              : '#4B5563',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
