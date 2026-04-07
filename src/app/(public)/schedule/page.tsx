import { prisma } from "@/lib/prisma";
import { FieldSchedule } from "@/components/features/public/FieldSchedule";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const matches = await prisma.match.findMany({
    include: { teamA: true, teamB: true },
    orderBy: [
      { manche: "asc" },
      { createdAt: "asc" },
    ],
  });

  return (
    <div className="space-y-6 py-2">
      <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 px-2 flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
        Planning des Matchs
      </h2>

      <FieldSchedule initialMatches={matches as any} />
    </div>
  );
}
