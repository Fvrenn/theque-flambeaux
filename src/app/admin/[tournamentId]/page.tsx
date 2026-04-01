import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import AddTeamForm from "@/components/features/admin/AddTeamForm";
import GenerateMatchesButton from "@/components/features/admin/GenerateMatchesButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TournamentDashboardProps {
  params: Promise<{ tournamentId: string }>;
}

async function getTournamentWithDetails(tournamentId: string) {
  return prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      teams: { orderBy: { createdAt: "asc" } },
      matches: {
        orderBy: { createdAt: "asc" },
        include: { teamA: true, teamB: true },
      },
    },
  });
}

function MatchStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; variant: "outline" | "default" | "secondary" }> = {
    PENDING: { label: "À venir", variant: "outline" },
    IN_PROGRESS: { label: "En cours", variant: "default" },
    FINISHED: { label: "Terminé", variant: "secondary" },
  };

  const { label, variant } = config[status] ?? { label: status, variant: "outline" as const };

  return <Badge variant={variant}>{label}</Badge>;
}

export default async function TournamentDashboardPage({
  params,
}: TournamentDashboardProps) {
  const { tournamentId } = await params;
  const tournament = await getTournamentWithDetails(tournamentId);

  if (!tournament) notFound();

  const hasMatches = tournament.matches.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {tournament.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {tournament.date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          {" · "}
          {tournament.numberOfFields} terrain
          {tournament.numberOfFields > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ── SECTION A : Équipes ── */}
        <section className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <AddTeamForm tournamentId={tournament.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Équipes inscrites ({tournament.teams.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tournament.teams.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune équipe inscrite.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tournament.teams.map((team) => (
                    <Badge
                      key={team.id}
                      variant="outline"
                      className="gap-1.5 px-2.5 py-1 text-sm"
                    >
                      <span
                        className="inline-block size-3 rounded-full"
                        style={{ backgroundColor: team.color }}
                      />
                      {team.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── SECTION B : Planning ── */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Planning des matchs</CardTitle>
            </CardHeader>
            <CardContent>
              {!hasMatches ? (
                <GenerateMatchesButton tournamentId={tournament.id} />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Match</TableHead>
                      <TableHead>Terrain</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournament.matches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block size-2.5 rounded-full"
                              style={{ backgroundColor: match.teamA.color }}
                            />
                            {match.teamA.name}
                            <span className="text-muted-foreground">vs</span>
                            <span
                              className="inline-block size-2.5 rounded-full"
                              style={{ backgroundColor: match.teamB.color }}
                            />
                            {match.teamB.name}
                          </div>
                        </TableCell>
                        <TableCell>{match.fieldName}</TableCell>
                        <TableCell>
                          <MatchStatusBadge status={match.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
