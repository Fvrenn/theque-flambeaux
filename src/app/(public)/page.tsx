import { prisma } from "@/lib/prisma";
import { LiveMatches } from "@/components/features/public/LiveMatches";
import { calculateMatchTournamentPoints } from "@/lib/ranking";

export default async function PublicHomePage() {
  const liveMatches = await prisma.match.findMany({
    where: { status: "IN_PROGRESS" },
    include: { teamA: true, teamB: true },
    orderBy: { updatedAt: "desc" },
  });

  const recentFinished = await prisma.match.findMany({
    where: { status: "FINISHED" },
    include: { teamA: true, teamB: true },
    orderBy: { updatedAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8 py-2">
      <section>
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">En Direct</h2>
        </div>

        <LiveMatches initialMatches={liveMatches as any} />
      </section>

      {recentFinished.length > 0 && (
        <section>
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Derniers Scores</h2>
          <div className="space-y-4">
            {recentFinished.map((match) => {
              const { pointsA, pointsB } = calculateMatchTournamentPoints(match);
              return (
                <div key={match.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Points de Tournoi</span>
                   </div>
                   
                   <div className="flex justify-between items-center gap-2">
                      <div className="flex-1 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase truncate mb-1">{match.teamA.name}</p>
                        <p className="text-2xl font-black text-slate-900">{pointsA} <span className="text-xs font-medium text-slate-400">pts</span></p>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <span className="text-[10px] font-black text-slate-200 uppercase mb-1">vs</span>
                        <div className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                          <span className="text-[9px] font-bold text-slate-400 tabular-nums">{match.scoreTeamA}-{match.scoreTeamB}</span>
                        </div>
                      </div>

                      <div className="flex-1 text-center">
                        <p className="text-[10px] font-bold text-slate-500 uppercase truncate mb-1">{match.teamB.name}</p>
                        <p className="text-2xl font-black text-slate-900">{pointsB} <span className="text-xs font-medium text-slate-400">pts</span></p>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
