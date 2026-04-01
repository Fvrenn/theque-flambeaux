import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StartMatchButton } from "@/components/features/referee/StartMatchButton";
import { RefereeRemoteControl } from "@/components/features/referee/RefereeRemoteControl";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ matchId: string }>;
}

export default async function MatchRefereePage({ params }: Props) {
  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      teamA: true,
      teamB: true,
    },
  });

  if (!match) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header compact pour laisser de la place aux boutons */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
        <Link href="/referee">
          <Button variant="ghost" size="sm" className="text-slate-500">
            ← Terrains
          </Button>
        </Link>
        <div className="text-center">
          <h2 className="text-sm font-bold uppercase tracking-tight leading-none">{match.fieldName}</h2>
          <p className="text-[10px] text-slate-400 font-medium">{match.status}</p>
        </div>
        <div className="w-16" /> {/* Spacer */}
      </header>

      <main className="flex-1">
        {match.status === "PENDING" && (
          <div className="p-6">
            <StartMatchButton matchId={matchId} />
          </div>
        )}

        {match.status === "IN_PROGRESS" && (
          <RefereeRemoteControl match={match} />
        )}

        {match.status === "FINISHED" && (
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-8 min-h-[70vh]">
            <div className="space-y-2">
              <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 mb-4">MATCH TERMINÉ</Badge>
              <h3 className="text-4xl font-black text-slate-900">Score Final</h3>
            </div>
            
            <div className="flex items-center gap-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">{match.teamA.name}</p>
                <p className="text-6xl font-black" style={{ color: match.teamA.color }}>{match.scoreTeamA}</p>
              </div>
              <div className="text-3xl font-bold text-slate-200">-</div>
              <div className="text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">{match.teamB.name}</p>
                <p className="text-6xl font-black" style={{ color: match.teamB.color }}>{match.scoreTeamB}</p>
              </div>
            </div>

            <Link href="/referee" className="w-full max-w-xs">
              <Button variant="outline" className="w-full h-14 text-lg font-bold border-2">
                Retour à la liste
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

// Composant local pour le badge fini car pas importé
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
