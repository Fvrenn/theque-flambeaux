import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EquipesPage() {
  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 py-2 pb-10">
      <div className="px-2">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2 mb-6">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          Les Équipes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {teams.length > 0 ? (
            teams.map((team) => (
              <Link key={team.id} href={`/equipes/${team.id}`} className="block group">
                <Card className="border-2 border-slate-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] overflow-hidden group-hover:border-primary/20 group-hover:shadow-md transition-all kawaii-bounce">
                  <div className="p-6 flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-2xl shadow-sm rotate-[-3deg] group-hover:rotate-0 transition-transform shrink-0" 
                      style={{ backgroundColor: team.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight truncate">
                        {team.name}
                      </CardTitle>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {team.playersList ? team.playersList.split(",").filter(p => p.trim() !== "").length : 0} Joueurs
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Users className="h-4 w-4 text-slate-300 group-hover:text-primary" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-400 italic font-medium">
                Aucune équipe inscrite pour le moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
