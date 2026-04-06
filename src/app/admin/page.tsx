import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CreateTournamentForm } from "@/components/features/admin/CreateTournamentForm";
import { SettingsForm } from "@/components/features/admin/SettingsForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSettings } from "@/actions/settings.actions";

export default async function AdminPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
  });

  const settings = await getSettings();

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Nouveau Tournoi</h2>
          <CreateTournamentForm />
        </div>
        <div>
          <SettingsForm initialSettings={settings} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Tournois existants</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Link key={tournament.id} href={`/admin/${tournament.id}`}>
              <Card className="h-full cursor-pointer hover:border-primary transition-colors border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {tournament.name}
                  </CardTitle>
                  <CardDescription>
                    {new Date(tournament.date).toLocaleDateString("fr-FR")} • {tournament.numberOfFields} Terrain(s)
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <p className="text-slate-500 text-center col-span-full italic">
            Aucun tournoi n'a été créé pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
