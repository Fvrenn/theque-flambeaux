import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <p className="text-slate-500">Sélectionnez votre terrain</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {activeMatches.length > 0 ? (
          activeMatches.map((match) => (
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
                    <Badge variant="outline" className="bg-white">
                      {match.fieldName}
                    </Badge>
                    <Badge 
                      variant={match.status === "IN_PROGRESS" ? "default" : "secondary"}
                      className={match.status === "IN_PROGRESS" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {match.status === "IN_PROGRESS" ? "EN COURS" : "À VENIR"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg flex flex-col gap-1">
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
                  <CardDescription className="pt-2 text-xs font-medium uppercase tracking-wider">
                    {match.tournament.name}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 italic">Aucun match disponible pour le moment.</p>
            <Link href="/admin" className="text-primary hover:underline mt-4 inline-block text-sm">
              Aller à l'admin pour générer des matchs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
