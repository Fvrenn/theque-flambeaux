"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Match {
  id: string;
  terrain: string | null;
  fieldName: string;
  manche: number;
  status: string;
  scoreTeamA: number;
  scoreTeamB: number;
  teamA: { name: string; color: string };
  teamB: { name: string; color: string };
}

interface FieldScheduleProps {
  initialMatches: Match[];
}

export function FieldSchedule({ initialMatches }: FieldScheduleProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const fields = Array.from(
    new Set(initialMatches.map((m) => m.terrain || m.fieldName))
  ).sort();

  const filteredMatches = selectedField
    ? initialMatches.filter((m) => (m.terrain || m.fieldName) === selectedField)
    : initialMatches;

  return (
    <div className="space-y-6">
      {/* Système de boutons comme l'arbitre */}
      <div className="flex flex-wrap gap-2 justify-center px-2">
        <Button
          variant={selectedField === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedField(null)}
          className="text-[10px] font-black uppercase tracking-widest rounded-full px-4"
        >
          Tous
        </Button>
        {fields.map((field) => (
          <Button
            key={field}
            variant={selectedField === field ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedField(field)}
            className="text-[10px] font-black uppercase tracking-widest rounded-full px-4"
          >
            {field}
          </Button>
        ))}
      </div>

      <div className="space-y-4 px-2">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <Link key={match.id} href="/" className="block group">
              <div
                className={`bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-2 transition-all kawaii-bounce ${
                  match.status === "IN_PROGRESS"
                    ? "border-primary ring-1 ring-primary/10"
                    : "border-slate-50"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2 items-center">
                    <Badge
                      variant="outline"
                      className="text-[9px] font-black tracking-widest uppercase py-0.5 px-2 bg-slate-50 border-slate-100 text-slate-400"
                    >
                      {match.terrain || match.fieldName}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-black tracking-widest uppercase py-0.5 px-2 bg-slate-50 border-slate-100 text-slate-400"
                    >
                      Manche {match.manche}
                    </Badge>
                  </div>
                  <Badge
                    variant={match.status === "IN_PROGRESS" ? "default" : "outline"}
                    className={`text-[9px] font-black tracking-tighter ${
                      match.status === "IN_PROGRESS"
                        ? "bg-red-500 animate-pulse border-none"
                        : "text-slate-300 border-slate-100"
                    }`}
                  >
                    {match.status === "IN_PROGRESS"
                      ? "EN DIRECT"
                      : match.status === "FINISHED"
                      ? "TERMINÉ"
                      : "À VENIR"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div
                      className="w-10 h-10 rounded-2xl shadow-sm rotate-[-3deg] transition-transform group-hover:rotate-0"
                      style={{ backgroundColor: match.teamA.color }}
                    />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter truncate w-full">
                      {match.teamA.name}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    {match.status !== "PENDING" ? (
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black text-slate-900 tabular-nums">
                          {match.scoreTeamA}
                        </span>
                        <span className="text-slate-200 font-black">-</span>
                        <span className="text-2xl font-black text-slate-900 tabular-nums">
                          {match.scoreTeamB}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">
                        VS
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div
                      className="w-10 h-10 rounded-2xl shadow-sm rotate-[3deg] transition-transform group-hover:rotate-0"
                      style={{ backgroundColor: match.teamB.color }}
                    />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter truncate w-full">
                      {match.teamB.name}
                    </span>
                  </div>
                </div>

                {match.status === "IN_PROGRESS" && (
                  <div className="mt-4 pt-4 border-t border-primary/10 text-center">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      Voir le direct →
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 italic font-medium">
              Aucun match prévu pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
