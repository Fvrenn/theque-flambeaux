"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefereeFilter } from "./RefereeFilter";
import { Category } from "@prisma/client";

interface MatchListItem {
  id: string;
  fieldName: string;
  manche: number;
  status: string;
  category: Category;
  teamA: { name: string; color: string };
  teamB: { name: string; color: string };
  tournament: { name: string };
}

export function RefereeMatchList({ matches }: { matches: MatchListItem[] }) {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">("ALL");

  const fields = Array.from(new Set(matches.map((m) => m.fieldName))).sort();
  
  const filteredMatches = matches.filter((m) => {
    const fieldMatch = selectedField ? m.fieldName === selectedField : true;
    const categoryMatch = selectedCategory !== "ALL" ? m.category === selectedCategory : true;
    return fieldMatch && categoryMatch;
  });

  return (
    <div className="max-w-5xl mx-auto w-full pb-20">
      <RefereeFilter 
        fields={fields} 
        selectedField={selectedField} 
        onSelectField={setSelectedField}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => {
            return (
              <Link key={match.id} href={`/referee/${match.id}`}>
                <Card className="hover:border-primary transition-all active:scale-[0.98] border-slate-200 shadow-sm overflow-hidden">
                  <div 
                    className="h-2 w-full" 
                    style={{ 
                      background: `linear-gradient(to right, ${match.teamA.color}, ${match.teamB.color})` 
                    }} 
                  />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <Badge 
                            className={`text-[10px] font-black uppercase tracking-widest border-none ${
                              match.category === 'PF' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-orange-600 text-white'
                            }`}
                          >
                            {match.category}
                          </Badge>
                          <Badge variant="outline" className="bg-slate-900 text-white border-none text-[10px] font-black uppercase tracking-widest">
                            Tour {match.manche}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="bg-white text-[10px] font-bold w-fit">
                          {match.fieldName}
                        </Badge>
                      </div>
                      <Badge 
                        variant={match.status === "IN_PROGRESS" ? "default" : "secondary"}
                        className={match.status === "IN_PROGRESS" ? "bg-green-600 hover:bg-green-700 text-[10px]" : "text-[10px]"}
                      >
                        {match.status === "IN_PROGRESS" ? "EN COURS" : "À VENIR"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg flex flex-col gap-1 mt-2">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: match.teamA.color }} />
                        {match.teamA.name}
                      </span>
                      <span className="text-xs text-slate-400 font-normal ml-4">contre</span>
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: match.teamB.color }} />
                        {match.teamB.name}
                      </span>
                    </CardTitle>
                    <CardDescription className="pt-2 text-[10px] font-medium uppercase tracking-wider">
                      {match.tournament.name}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 italic">Aucun match disponible pour ces filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
}
