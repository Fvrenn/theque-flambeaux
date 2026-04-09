"use client";

import { Match, Team } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target } from "lucide-react";

interface MatchWithTeams extends Match {
  teamA: Team;
  teamB: Team;
}

export function LiveMatchDetail({ match }: { match: MatchWithTeams }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 mb-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">En Direct</span>
        </div>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{match.fieldName}</h2>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl bg-white rounded-[2.5rem]">
        <CardContent className="p-8">
          <div className="flex justify-between items-center gap-6">
            <div className="flex-1 text-center space-y-4">
              <div 
                className="w-20 h-20 rounded-3xl mx-auto border-4 border-slate-50 shadow-lg rotate-[-3deg]"
                style={{ backgroundColor: match.teamA.color }}
              />
              <div>
                <p className="text-xs font-black uppercase text-slate-400 mb-1">{match.teamA.name}</p>
                <p className="text-6xl font-black text-slate-900 tabular-nums">{match.scoreTeamA}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="h-px w-8 bg-slate-100" />
              <span className="text-2xl font-black text-slate-200">VS</span>
              <div className="h-px w-8 bg-slate-100" />
            </div>

            <div className="flex-1 text-center space-y-4">
              <div 
                className="w-20 h-20 rounded-3xl mx-auto border-4 border-slate-50 shadow-lg rotate-[3deg]"
                style={{ backgroundColor: match.teamB.color }}
              />
              <div>
                <p className="text-xs font-black uppercase text-slate-400 mb-1">{match.teamB.name}</p>
                <p className="text-6xl font-black text-slate-900 tabular-nums">{match.scoreTeamB}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Stats Equipe A */}
        <div className="space-y-3">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Trophy className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Home Runs</span>
              </div>
              <p className="text-4xl font-black text-slate-900">{match.homeRunsTeamA}</p>
            </div>
            <div className="h-px w-8 bg-slate-100 mx-auto" />
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-slate-800">
                <Target className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Balles Gobées</span>
              </div>
              <p className="text-4xl font-black text-slate-900">{match.ballesGobeesTeamA}</p>
            </div>
          </div>
        </div>

        {/* Stats Equipe B */}
        <div className="space-y-3">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Trophy className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Home Runs</span>
              </div>
              <p className="text-4xl font-black text-slate-900">{match.homeRunsTeamB}</p>
            </div>
            <div className="h-px w-8 bg-slate-100 mx-auto" />
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-slate-800">
                <Target className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Balles Gobées</span>
              </div>
              <p className="text-4xl font-black text-slate-900">{match.ballesGobeesTeamB}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
