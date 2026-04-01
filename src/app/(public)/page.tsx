import { prisma } from "@/lib/prisma";
import { LiveMatches } from "@/components/features/public/LiveMatches";

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
          <div className="space-y-3">
            {recentFinished.map((match) => (
              <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate">{match.teamA.name}</span>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: match.teamA.color }} />
                </div>
                
                <div className="px-4 text-sm font-black text-slate-900 tabular-nums">
                  {match.scoreTeamA} - {match.scoreTeamB}
                </div>

                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: match.teamB.color }} />
                  <span className="text-xs font-bold text-slate-900 truncate text-right">{match.teamB.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
