import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TeamDetailsPage({ params }: Props) {
  const { id } = await params;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      players: {
        orderBy: { name: 'asc' }
      }
    }
  });

  if (!team) {
    notFound();
  }

  const players = team.players;

  return (
    <div className="py-6 space-y-8">
      <div className="flex justify-start px-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-slate-500 font-bold">
            <ChevronLeft className="h-4 w-4 mr-1" /> Retour
          </Button>
        </Link>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        <div 
          className="w-24 h-24 rounded-[2.5rem] shadow-xl border-4 border-white rotate-[-3deg]"
          style={{ backgroundColor: team.color }}
        />
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            {team.name}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Fiche Équipe
          </p>
        </div>
      </div>

      <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
          <CardTitle className="flex items-center gap-3 text-slate-800 text-lg font-black uppercase tracking-tight">
            <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100">
              <Users className="h-5 w-5 text-primary" />
            </div>
            Composition
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {players.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {players.map((player, index) => (
                <div 
                  key={player.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-primary/20"
                >
                  <span className="text-[10px] font-black text-slate-300 w-4 tracking-tighter">{index + 1}</span>
                  <span className="font-bold text-slate-700">{player.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 space-y-2">
              <p className="text-slate-400 italic font-medium">
                Aucun joueur n'est renseigné.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
