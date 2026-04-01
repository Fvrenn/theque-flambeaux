import Link from "next/link";

import { prisma } from "@/lib/prisma";
import CreateTournamentForm from "@/components/features/admin/CreateTournamentForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Admin - Flambeaux Thèque",
  description: "Gestion des tournois de Thèque",
};

async function getTournaments() {
  return prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { teams: true, matches: true } } },
  });
}

export default async function AdminPage() {
  const tournaments = await getTournaments();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="mb-4 text-2xl font-bold text-foreground">
          Vos tournois
        </h1>

        {tournaments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun tournoi pour le moment. Créez-en un ci-dessous !
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/admin/${tournament.id}`}
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{tournament.name}</CardTitle>
                    <CardDescription>
                      {tournament.date.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {tournament._count.teams} équipe
                        {tournament._count.teams > 1 ? "s" : ""}
                      </Badge>
                      <Badge variant="outline">
                        {tournament._count.matches} match
                        {tournament._count.matches > 1 ? "s" : ""}
                      </Badge>
                      <Badge variant="outline">
                        {tournament.numberOfFields} terrain
                        {tournament.numberOfFields > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <CreateTournamentForm />
      </section>
    </div>
  );
}
