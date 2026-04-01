import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
export const dynamic = "force-dynamic";
export default async function SchedulePage() {
  const matches = await prisma.match.findMany({
    include: { teamA: true, teamB: true },
    orderBy: { createdAt: "asc" },
  });

  // Extraire les terrains uniques
  const fields = Array.from(new Set(matches.map(m => m.fieldName))).sort();

  return (
    <div className="space-y-6 py-2">
      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 px-2">Planning des Matchs</h2>

      <Tabs defaultValue={fields[0]} className="w-full">
        <TabsList className="w-full justify-start bg-slate-100/50 p-1 mb-4 overflow-x-auto h-auto">
          {fields.map(field => (
            <TabsTrigger
              key={field}
              value={field}
              className="px-4 py-2 text-[10px] font-black uppercase data-[state=active]:bg-white data-[state=active]:text-primary"
            >
              {field}
            </TabsTrigger>
          ))}
        </TabsList>

        {fields.map(field => (
          <TabsContent key={field} value={field} className="space-y-3 px-2">
            {matches
              .filter(m => m.fieldName === field)
              .map(match => (
                <div
                  key={match.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border ${match.status === "IN_PROGRESS" ? "border-primary ring-1 ring-primary/20" : "border-slate-100"
                    } flex flex-col gap-3`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Match {match.id.slice(-4)}</span>
                    <Badge
                      variant={match.status === "IN_PROGRESS" ? "default" : "outline"}
                      className={`text-[9px] font-black tracking-tighter ${match.status === "IN_PROGRESS" ? "bg-red-600 animate-pulse border-none" : ""
                        }`}
                    >
                      {match.status === "IN_PROGRESS" ? "EN DIRECT" : match.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: match.teamA.color }} />
                      <span className="text-sm font-bold truncate">{match.teamA.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-200">VS</span>
                    <div className="flex items-center gap-3 min-w-0 flex-row-reverse">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: match.teamB.color }} />
                      <span className="text-sm font-bold truncate text-right">{match.teamB.name}</span>
                    </div>
                  </div>

                  {match.status === "FINISHED" && (
                    <div className="mt-1 pt-3 border-t border-slate-50 text-center font-black text-slate-900 tabular-nums">
                      Score : {match.scoreTeamA} - {match.scoreTeamB}
                    </div>
                  )}
                </div>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
