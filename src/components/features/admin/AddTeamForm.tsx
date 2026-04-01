"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { addTeamToTournament } from "@/actions/tournament.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddTeamFormProps {
  tournamentId: string;
}

export default function AddTeamForm({ tournamentId }: AddTeamFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    try {
      await addTeamToTournament({ name, color, tournamentId });
      event.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="team-name">Nom de l&apos;équipe</Label>
        <Input
          id="team-name"
          name="name"
          placeholder="Ex: Louveteaux"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="team-color">Couleur</Label>
        <Input
          id="team-color"
          name="color"
          type="color"
          defaultValue="#ed7112"
          className="h-10 w-16 cursor-pointer p-1"
          required
          disabled={isLoading}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={isLoading} className="self-end">
        {isLoading ? "Ajout…" : "Ajouter l'équipe"}
      </Button>
    </form>
  );
}
