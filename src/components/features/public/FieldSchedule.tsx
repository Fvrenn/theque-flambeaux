"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@prisma/client";

interface Match {
  id: string;
  terrain: string | null;
  fieldName: string;
  manche: number;
  status: string;
  category: Category;
  scoreTeamA: number;
  scoreTeamB: number;
  teamAId: string;
  teamBId: string;
  teamA: { id: string; name: string; color: string };
  teamB: { id: string; name: string; color: string };
}

interface FieldScheduleProps {
  initialMatches: Match[];
}

export function FieldSchedule({ initialMatches }: FieldScheduleProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("PF");
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const categoryMatches = initialMatches.filter(m => m.category === selectedCategory);

  const fields = Array.from(
    new Set(categoryMatches.map((m) => m.terrain || m.fieldName))
  ).sort();

  const filteredMatches = selectedField
    ? categoryMatches.filter((m) => (m.terrain || m.fieldName) === selectedField)
    : categoryMatches;

  return (
    <div className="space-y-6">
      <div className="px-2">
        <Tabs value={selectedCategory} onValueChange={(v) => {
          setSelectedCategory(v as Category);
          setSelectedField(null); // Reset field when changing category
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="PF" className="text-xs font-bold">Tournoi PF</TabsTrigger>
            <TabsTrigger value="F" className="text-xs font-bold">Tournoi F</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-2 justify-center px-2">
        <Button
          variant={selectedField === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedField(null)}
          className="text-[10px] font-black uppercase tracking-widest rounded-full px-4 h-8"
        >
          Tous les terrains
        </Button>
        {fields.map((field) => (
          <Button
            key={field}
            variant={selectedField === field ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedField(field)}
            className="text-[10px] font-black uppercase tracking-widest rounded-full px-4 h-8"
          >
            {field}
          </Button>
        ))}
      </div>

      <div className="space-y-4 px-2">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div
              key={match.id}
              className={`bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-2 transition-all ${
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
                    Tour {match.manche}
                  </Badge>
                  <Badge
                    className={`text-[9px] font-black tracking-widest uppercase py-0.5 px-2 border-none ${
                      match.category === 'PF' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {match.category}
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
                <Link 
                  href={`/equipes/${match.teamA.id}`} 
                  className="flex-1 flex flex-col items-center text-center gap-2 group transition-all active:scale-95"
                >
                  <div
                    className="w-10 h-10 rounded-2xl shadow-sm rotate-[-3deg] transition-transform group-hover:rotate-0"
                    style={{ backgroundColor: match.teamA.color }}
                  />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tighter truncate w-full group-hover:text-primary">
                    {match.teamA.name}
                  </span>
                </Link>

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

                <Link 
                  href={`/equipes/${match.teamB.id}`} 
                  className="flex-1 flex flex-col items-center text-center gap-2 group transition-all active:scale-95"
                >
                  <div
                    className="w-10 h-10 rounded-2xl shadow-sm rotate-[3deg] transition-transform group-hover:rotate-0"
                    style={{ backgroundColor: match.teamB.color }}
                  />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-tighter truncate w-full group-hover:text-primary">
                    {match.teamB.name}
                  </span>
                </Link>
              </div>

              {match.status === "IN_PROGRESS" && (
                <div className="mt-4 pt-4 border-t border-primary/10 text-center">
                  <Link href="/">
                    <Button variant="ghost" className="w-full text-[10px] font-black text-primary uppercase tracking-widest">
                      Voir le direct →
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 italic font-medium">
              Aucun match prévu pour cette catégorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
