"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTeamToTournament } from "@/actions/tournament.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddTeamForm({ tournamentId }: { tournamentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;

    try {
      await addTeamToTournament({ name, color, tournamentId });
      router.refresh();
      (event.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Ajouter une équipe</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Nom de l'équipe</Label>
            <Input id="teamName" name="name" placeholder="ex: Louveteaux" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <div className="flex gap-2 items-center">
              <Input 
                id="color" 
                name="color" 
                type="color" 
                defaultValue="#ed7112" 
                className="w-12 h-10 p-1 cursor-pointer"
                required 
              />
              <span className="text-sm text-slate-500 italic">Cliquez pour choisir</span>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-princeton-orange-600"
            disabled={loading}
          >
            {loading ? "Ajout..." : "Ajouter l'équipe"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
