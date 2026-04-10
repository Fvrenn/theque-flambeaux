"use client";

import { useState } from "react";
import { 
  updateTeamName, 
  updateTeamColor, 
  updatePlayerName, 
  deletePlayer, 
  addPlayersToTeam 
} from "@/actions/team.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Save, Plus, CheckCircle2 } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Player {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  color: string;
  players: Player[];
}

export function EditTeamForm({ team }: { team: Team }) {
  const [parent] = useAutoAnimate();
  const [teamName, setTeamName] = useState(team.name);
  const [teamColor, setTeamColor] = useState(team.color);
  const [newPlayers, setNewPlayers] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUpdateTeam = async () => {
    setLoading("team");
    try {
      await updateTeamName(team.id, teamName);
      await updateTeamColor(team.id, teamColor);
      showSuccess("Équipe mise à jour !");
    } catch (err) {
      alert("Erreur lors de la mise à jour de l'équipe");
    } finally {
      setLoading(null);
    }
  };

  const handleUpdatePlayer = async (playerId: string, name: string) => {
    setLoading(playerId);
    try {
      await updatePlayerName(playerId, name);
      showSuccess("Joueur mis à jour !");
    } catch (err) {
      alert("Erreur lors de la mise à jour du joueur");
    } finally {
      setLoading(null);
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm("Supprimer ce joueur ?")) return;
    setLoading(playerId);
    try {
      await deletePlayer(playerId);
    } catch (err) {
      alert("Erreur lors de la suppression du joueur");
    } finally {
      setLoading(null);
    }
  };

  const handleAddPlayers = async () => {
    if (!newPlayers.trim()) return;
    setLoading("add");
    try {
      await addPlayersToTeam(team.id, newPlayers);
      setNewPlayers("");
      showSuccess("Joueurs ajoutés !");
    } catch (err) {
      alert("Erreur lors de l'ajout des joueurs");
    } finally {
      setLoading(null);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Configuration Équipe */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Configuration de l'équipe
              {success === "Équipe mise à jour !" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Nom de l'équipe</Label>
              <Input 
                id="teamName" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamColor">Couleur</Label>
              <div className="flex gap-2 items-center">
                <Input 
                  id="teamColor" 
                  type="color" 
                  value={teamColor} 
                  onChange={(e) => setTeamColor(e.target.value)} 
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <span className="text-sm text-slate-500 italic">{teamColor}</span>
              </div>
            </div>
            <Button 
              onClick={handleUpdateTeam} 
              disabled={loading === "team"}
              className="w-full bg-primary hover:bg-princeton-orange-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading === "team" ? "Sauvegarde..." : "Sauvegarder les infos"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Ajouter des joueurs
              {success === "Joueurs ajoutés !" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPlayers">Nouveaux noms (un par ligne ou virgules)</Label>
              <textarea
                id="newPlayers"
                value={newPlayers}
                onChange={(e) => setNewPlayers(e.target.value)}
                placeholder="Ex: Jean, Paul, Pierre..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button 
              onClick={handleAddPlayers} 
              disabled={loading === "add" || !newPlayers.trim()}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              {loading === "add" ? "Ajout..." : "Ajouter à l'équipe"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Liste des joueurs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liste des joueurs ({team.players.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" ref={parent}>
            {team.players.length === 0 && (
              <p className="text-sm text-slate-500 italic text-center py-4">Aucun joueur pour le moment.</p>
            )}
            {team.players.map((player) => (
              <div key={player.id} className="flex gap-2 items-center group">
                <Input 
                  defaultValue={player.name}
                  onBlur={(e) => {
                    if (e.target.value !== player.name) {
                      handleUpdatePlayer(player.id, e.target.value);
                    }
                  }}
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-slate-400 hover:text-red-500 h-9 w-9"
                  onClick={() => handleDeletePlayer(player.id)}
                  disabled={loading === player.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
