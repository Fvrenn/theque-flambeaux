"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Match, Team } from "@prisma/client";

interface MatchWithTeams extends Match {
  teamA: Team;
  teamB: Team;
}

export function LiveMatches({ initialMatches }: { initialMatches: MatchWithTeams[] }) {
  const [matches, setMatches] = useState(initialMatches);
  const [updatedMatchId, setUpdatedMatchId] = useState<string | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/live-events");

    source.addEventListener("matchUpdated", (event) => {
      const updatedMatch = JSON.parse(event.data);
      
      setMatches((prev) => {
        const index = prev.findIndex((m) => m.id === updatedMatch.id);
        if (index === -1) {
          if (updatedMatch.status === "IN_PROGRESS") {
            return [updatedMatch, ...prev];
          }
          return prev;
        }
        
        const newMatches = [...prev];
        if (updatedMatch.status !== "IN_PROGRESS") {
          newMatches.splice(index, 1);
        } else {
          newMatches[index] = updatedMatch;
        }
        return newMatches;
      });

      setUpdatedMatchId(updatedMatch.id);
      setTimeout(() => setUpdatedMatchId(null), 1000);
    });

    return () => source.close();
  }, []);

  if (matches.length === 0) {
    return (
      <p className="text-slate-400 text-center italic text-xs py-10 bg-white rounded-3xl border-2 border-dashed border-slate-100">
        Aucun match en direct pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card 
          key={match.id} 
          className={`overflow-hidden border-none shadow-lg ring-1 ring-slate-200 transition-all duration-500 ${
            updatedMatchId === match.id ? "ring-primary ring-offset-2 scale-[1.02]" : ""
          }`}
        >
          <div className="bg-slate-900 text-white p-2 text-center text-[10px] font-bold uppercase tracking-widest">
            {match.fieldName}
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1 text-center space-y-2">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 border-4 border-slate-50 shadow-sm"
                  style={{ backgroundColor: match.teamA.color }}
                />
                <p className="text-xs font-black uppercase leading-tight line-clamp-1">{match.teamA.name}</p>
                <p className={`text-4xl font-black transition-all ${updatedMatchId === match.id ? "text-primary scale-110" : ""}`}>
                  {match.scoreTeamA}
                </p>
              </div>
              
              <div className="text-xl font-black text-slate-200">-</div>

              <div className="flex-1 text-center space-y-2">
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-2 border-4 border-slate-50 shadow-sm"
                  style={{ backgroundColor: match.teamB.color }}
                />
                <p className="text-xs font-black uppercase leading-tight line-clamp-1">{match.teamB.name}</p>
                <p className={`text-4xl font-black transition-all ${updatedMatchId === match.id ? "text-primary scale-110" : ""}`}>
                  {match.scoreTeamB}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
