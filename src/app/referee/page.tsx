import { prisma } from "@/lib/prisma";
import { RefereeMatchList } from "@/components/features/referee/RefereeMatchList";

export default async function RefereePage() {
  const activeMatches = await prisma.match.findMany({
    where: {
      status: {
        in: ["PENDING", "IN_PROGRESS"],
      },
    },
    include: {
      teamA: true,
      teamB: true,
      tournament: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Interface Arbitre</h1>
        <p className="text-slate-500">Gérez vos terrains</p>
      </header>

      <RefereeMatchList matches={activeMatches as any} />
    </div>
  );
}
