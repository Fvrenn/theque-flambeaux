import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AddTeamForm } from "@/components/features/admin/AddTeamForm";
import { GenerateMatchesButton } from "@/components/features/admin/GenerateMatchesButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ tournamentId: string }>;
}

export default async function TournamentDashboardPage({ params }: Props) {
  const { tournamentId } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: true,
      matches: {
        include: {
          teamA: true,
          teamB: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!tournament) {
    notFound();
  }

  return (
    <div className="py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900">{tournament.name}</h2>
        <p className="text-slate-500">
          Dashboard d'administration • {tournament.numberOfFields} terrain(s)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SECTION A : Équipes */}
        <section className="space-y-6">
          <AddTeamForm tournamentId={tournamentId} />

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Équipes Inscrites ({tournament.teams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.teams.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tournament.teams.map((team) => (
                    <Badge 
                      key={team.id} 
                      variant="outline" 
                      className="px-3 py-1 flex gap-2 items-center text-sm font-medium"
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: team.color }} 
                      />
                      {team.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic text-center py-4">
                  Aucune équipe pour le moment.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* SECTION B : Planning */}
        <section className="space-y-6">
          <Card className="border-slate-200 shadow-sm min-h-[300px]">
            <CardHeader>
              <CardTitle className="text-lg">Planning des Matchs</CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.matches.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-500 mb-6">Le planning n'a pas encore été généré.</p>
                  {tournament.teams.length >= 2 ? (
                    <GenerateMatchesButton tournamentId={tournamentId} />
                  ) : (
                    <p className="text-sm text-orange-600 font-medium">
                      Inscrivez au moins 2 équipes pour générer les matchs.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Match</TableHead>
                        <TableHead>Terrain</TableHead>
                        <TableHead className="text-right">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournament.matches.map((match) => (
                        <TableRow key={match.id}>
                          <TableCell className="font-medium">
                            {match.teamA.name} <span className="text-slate-400">vs</span> {match.teamB.name}
                          </TableCell>
                          <TableCell>{match.fieldName}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={match.status === 'FINISHED' ? 'secondary' : 'outline'}>
                              {match.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
