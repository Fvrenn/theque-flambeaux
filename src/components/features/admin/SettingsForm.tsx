"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SettingsFormProps {
  initialSettings: {
    isMaintenanceMode: boolean;
    tournamentDate: string | null;
  };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(initialSettings.isMaintenanceMode);
  const [tournamentDate, setTournamentDate] = useState(initialSettings.tournamentDate || "");

  async function handleSave() {
    setLoading(true);
    try {
      await updateSettings({ isMaintenanceMode, tournamentDate });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Réglages Globaux</CardTitle>
        <CardDescription>Configurez le mode maintenance et la date du tournoi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
            <span>Mode Maintenance ("Tournoi à venir")</span>
            <span className="font-normal text-slate-500 text-xs">
              Remplace la page d'accueil par une page d'attente
            </span>
          </Label>
          <Switch
            id="maintenance-mode"
            checked={isMaintenanceMode}
            onCheckedChange={setIsMaintenanceMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tournamentDate">Date du tournoi</Label>
          <Input
            id="tournamentDate"
            placeholder="ex: 15 Juin 2026"
            value={tournamentDate}
            onChange={(e) => setTournamentDate(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Enregistrement..." : "Sauvegarder les réglages"}
        </Button>
      </CardContent>
    </Card>
  );
}
