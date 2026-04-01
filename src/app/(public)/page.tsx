import { prisma } from "@/lib/prisma";
import { LiveMatches } from "@/components/features/public/LiveMatches";
import { calculateMatchTournamentPoints } from "@/lib/ranking";
export const dynamic = "force-dynamic";
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
    <div className="space-y-10 py-2">
      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400 animate-ping" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800">Matchs en Live</h2>
          </div>
          <span className="text-[10px] font-bold text-kawaii-pink bg-kawaii-pink/10 px-3 py-1 rounded-full uppercase">Direct</span>
        </div>

        <LiveMatches initialMatches={liveMatches as any} />
      </section>

      {recentFinished.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="h-1.5 w-1.5 rounded-full bg-kawaii-blue" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Derniers Scores</h2>
          </div>
          <div className="space-y-4">
            {recentFinished.map((match) => {
              const { pointsA, pointsB } = calculateMatchTournamentPoints(match);
              return (
                <div key={match.id} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-2 border-slate-50 relative group kawaii-bounce cursor-default">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 text-center">
                      <div
                        className="w-10 h-10 rounded-2xl mx-auto mb-3 border-4 border-white shadow-sm rotate-[-3deg] transition-transform group-hover:rotate-0"
                        style={{ backgroundColor: match.teamA.color }}
                      />
                      <p className="text-[10px] font-black uppercase text-slate-400 truncate mb-1">{match.teamA.name}</p>
                      <p className="text-xl font-black text-slate-800">{pointsA} pts</p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="bg-kawaii-cream px-3 py-1 rounded-full border border-kawaii-pink/20 mb-2">
                        <span className="text-[10px] font-black text-kawaii-pink tabular-nums">{match.scoreTeamA} - {match.scoreTeamB}</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-200 uppercase">Score Match</span>
                    </div>

                    <div className="flex-1 text-center">
                      <div
                        className="w-10 h-10 rounded-2xl mx-auto mb-3 border-4 border-white shadow-sm rotate-[3deg] transition-transform group-hover:rotate-0"
                        style={{ backgroundColor: match.teamB.color }}
                      />
                      <p className="text-[10px] font-black uppercase text-slate-400 truncate mb-1">{match.teamB.name}</p>
                      <p className="text-xl font-black text-slate-800">{pointsB} pts</p>
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
