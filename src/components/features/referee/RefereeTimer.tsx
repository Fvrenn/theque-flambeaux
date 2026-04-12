"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function RefereeTimer({ 
  isRunning, 
  setIsRunning,
  resetTrigger = 0
}: { 
  isRunning: boolean; 
  setIsRunning: (val: boolean) => void;
  resetTrigger?: number;
}) {
  const [time, setTime] = useState(0); // Temps en secondes
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    if (resetTrigger > 0) {
      reset();
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="bg-slate-900 border-none shadow-xl overflow-hidden">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="text-4xl font-black text-white tabular-nums tracking-tighter mb-4 font-mono">
          {formatTime(time)}
        </div>
        
        <div className="flex gap-3 w-full">
          <Button 
            variant={isRunning ? "secondary" : "default"}
            className={`flex-1 h-12 font-black uppercase text-xs ${!isRunning ? "bg-primary hover:bg-primary/90" : ""}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <><Pause className="w-4 h-4 mr-2" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 mr-2" /> Start</>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-12 h-12 p-0 border-white/10 hover:bg-white/5 text-slate-400 hover:text-white"
            onClick={reset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
