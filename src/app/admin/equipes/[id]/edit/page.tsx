import { notFound } from "next/navigation";
import { getTeamWithPlayers } from "@/actions/team.actions";
import { EditTeamForm } from "@/components/features/admin/EditTeamForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditTeamPage({ params }: Props) {
  const { id } = await params;
  const team = await getTeamWithPlayers(id);

  if (!team) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/${team.tournamentId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold text-slate-900">Édition de l'équipe : {team.name}</h2>
      </div>

      <EditTeamForm team={team} />
    </div>
  );
}
