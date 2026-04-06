"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateMatch } from "@/actions/match.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditMatchDialogProps {
  matchId: string;
  initialTerrain: string | null;
  initialManche: number;
  teamAName: string;
  teamBName: string;
}

export function EditMatchDialog({ 
  matchId, 
  initialTerrain, 
  initialManche,
  teamAName,
  teamBName
}: EditMatchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terrain, setTerrain] = useState(initialTerrain || "");
  const [manche, setManche] = useState(initialManche.toString());

  async function handleSave() {
    setLoading(true);
    try {
      await updateMatch({ 
        matchId, 
        terrain, 
        fieldName: terrain, // On synchronise les deux pour la compatibilité
        manche: parseInt(manche) 
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit2 className="h-4 w-4 text-slate-400" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le match</DialogTitle>
          <p className="text-sm text-slate-500">{teamAName} vs {teamBName}</p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="terrain">Terrain</Label>
            <Input 
              id="terrain" 
              value={terrain} 
              onChange={(e) => setTerrain(e.target.value)} 
              placeholder="Ex: Terrain 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manche">Manche</Label>
            <Input 
              id="manche" 
              type="number"
              value={manche} 
              onChange={(e) => setManche(e.target.value)} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
