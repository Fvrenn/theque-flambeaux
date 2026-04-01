"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTournament } from "@/actions/tournament.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function CreateTournamentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const numberOfFields = parseInt(formData.get("numberOfFields") as string);

    try {
      const tournament = await createTournament(name, numberOfFields);
      router.push(`/admin/${tournament.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-10 border-princeton-orange-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Nouveau Tournoi</CardTitle>
        <CardDescription>Configurez les paramètres de base.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du tournoi</Label>
            <Input id="name" name="name" placeholder="ex: Thèque Flambeaux 2026" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numberOfFields">Nombre de terrains</Label>
            <Input 
              id="numberOfFields" 
              name="numberOfFields" 
              type="number" 
              min="1" 
              defaultValue="1" 
              required 
            />
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-princeton-orange-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer le Tournoi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
