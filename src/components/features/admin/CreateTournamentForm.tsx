"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { createTournament } from "@/actions/tournament.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateTournamentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const numberOfFields = Number(formData.get("numberOfFields"));

    try {
      await createTournament(name, numberOfFields);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un tournoi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tournament-name">Nom du tournoi</Label>
            <Input
              id="tournament-name"
              name="name"
              placeholder="Ex: Tournoi de Pâques 2026"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tournament-fields">Nombre de terrains</Label>
            <Input
              id="tournament-fields"
              name="numberOfFields"
              type="number"
              min={1}
              max={10}
              defaultValue={2}
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={isLoading} className="self-end">
            {isLoading ? "Création…" : "Créer le tournoi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
