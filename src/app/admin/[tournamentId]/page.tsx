import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { AddTeamForm } from "@/components/features/admin/AddTeamForm";
import { DangerZone } from "@/components/features/admin/DangerZone";
import { EditMatchDialog } from "@/components/features/admin/EditMatchDialog";
import { GenerateMatchesButton } from "@/components/features/admin/GenerateMatchesButton";
import { MatchRescueActions } from "@/components/features/admin/MatchRescueActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@prisma/client";

interface Props {
  params: Promise<{ tournamentId: string }>;
}

export default async function TournamentDashboardPage({ params }: Props) {
  const { tournamentId } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: {
        orderBy: { name: "asc" }
      },
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

  const teamsPF = tournament.teams.filter(t => t.category === "PF");
  const teamsF = tournament.teams.filter(t => t.category === "F");
  const matchesPF = tournament.matches.filter(m => m.category === "PF");
  const matchesF = tournament.matches.filter(m => m.category === "F");

  return (
    <div className="py-8">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{tournament.name}</h2>
          <p className="text-slate-500">
            Dashboard d'administration • {tournament.numberOfFields} terrain(s)
          </p>
        </div>
        <div className="flex-1 max-w-md ml-4">
           <DangerZone tournamentId={tournamentId} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SECTION GAUCHE : Ajout Équipe */}
        <section className="lg:col-span-1 space-y-6">
          <AddTeamForm tournamentId={tournamentId} />
        </section>

        {/* SECTION DROITE : Équipes et Planning par Catégorie */}
        <section className="lg:col-span-2">
          <Tabs defaultValue="PF" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="PF" className="text-lg font-bold">Tournoi PF ({teamsPF.length} équipes)</TabsTrigger>
              <TabsTrigger value="F" className="text-lg font-bold">Tournoi F ({teamsF.length} équipes)</TabsTrigger>
            </TabsList>

            <TabsContent value="PF" className="space-y-6">
              <TeamAndMatchList 
                tournamentId={tournamentId}
                category="PF"
                teams={teamsPF}
                matches={matchesPF}
              />
            </TabsContent>

            <TabsContent value="F" className="space-y-6">
              <TeamAndMatchList 
                tournamentId={tournamentId}
                category="F"
                teams={teamsF}
                matches={matchesF}
              />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}

function TeamAndMatchList({ 
  tournamentId, 
  category, 
  teams, 
  matches 
}: { 
  tournamentId: string, 
  category: Category, 
  teams: any[], 
  matches: any[] 
}) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Équipes {category} ({teams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center gap-1 group">
                  <Badge 
                    variant="outline" 
                    className="px-3 py-1 flex gap-2 items-center text-sm font-medium"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: team.color }} 
                    />
                    {team.name}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary" asChild>
                    <Link href={`/admin/equipes/${team.id}/edit`}>
                      <Pencil className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic text-center py-4">
              Aucune équipe {category} pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm min-h-[300px]">
        <CardHeader>
          <CardTitle className="text-lg">Planning {category}</CardTitle>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 mb-6">Le planning {category} n'a pas encore été généré.</p>
              {teams.length >= 2 ? (
                <div className="max-w-xs mx-auto">
                  <GenerateMatchesButton tournamentId={tournamentId} category={category} />
                </div>
              ) : (
                <p className="text-sm text-orange-600 font-medium">
                  Inscrivez au moins 2 équipes {category} pour générer les matchs.
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
                  {matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {match.teamA.name} <span className="text-slate-400 font-normal">vs</span> {match.teamB.name}
                          <EditMatchDialog 
                            matchId={match.id}
                            initialTerrain={match.terrain || match.fieldName}
                            initialManche={match.manche}
                            initialCategory={match.category}
                            teamAName={match.teamA.name}
                            teamBName={match.teamB.name}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{match.terrain || match.fieldName}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Tour {match.manche}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-3">
                        <Badge variant={match.status === 'FINISHED' ? 'secondary' : 'outline'}>
                          {match.status}
                        </Badge>
                        <MatchRescueActions matchId={match.id} status={match.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
