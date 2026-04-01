import { prisma } from "@/lib/prisma";
import { calculateRanking } from "@/lib/ranking";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Target } from "lucide-react";

export default async function RankingPage() {
  const teams = await prisma.team.findMany();
  const matches = await prisma.match.findMany({
    where: { status: "FINISHED" },
  });

  const ranking = calculateRanking(teams, matches);

  // Statistiques Globales du Tournoi
  const totalHomeRuns = ranking.reduce((acc, team) => acc + team.homeRuns, 0);
  const totalBallesGobees = ranking.reduce((acc, team) => acc + team.ballesGobees, 0);

  const topHomeRuns = [...ranking].sort((a, b) => b.homeRuns - a.homeRuns)[0];
  const topBallesGobees = [...ranking].sort((a, b) => b.ballesGobees - a.ballesGobees)[0];

  return (
    <div className="space-y-8 py-2">
      {/* 1. Statistiques Globales du Tournoi */}
      <section className="px-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 px-1">Stats Globales</h2>
        <div className="grid grid-cols-2 gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
          <div className="text-center border-r border-slate-700">
            <p className="text-4xl font-black text-princeton-orange-400 mb-1">{totalHomeRuns}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Home Runs</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-black text-white mb-1">{totalBallesGobees}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Balles Gobées</p>
          </div>
        </div>
      </section>

      {/* 2. Tableau d'Honneur */}
      <section className="px-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Tableau d'Honneur</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
            <div className="w-10 h-10 bg-princeton-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Top Home Runs</p>
            <p className="text-sm font-black truncate">{topHomeRuns?.name || "-"}</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-5 w-5 text-slate-800" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Top Balles Gobées</p>
            <p className="text-sm font-black truncate">{topBallesGobees?.name || "-"}</p>
          </div>
        </div>
      </section>

      {/* 3. Classement Général */}
      <header className="px-1">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 px-1">Classement Général</h2>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-8 text-center text-[8px] font-black uppercase px-1">#</TableHead>
                <TableHead className="text-[8px] font-black uppercase px-1">Équipe</TableHead>
                <TableHead className="text-center text-[8px] font-black uppercase px-1">Pts</TableHead>
                <TableHead className="text-center text-[8px] font-black uppercase px-1">HR</TableHead>
                <TableHead className="text-center text-[8px] font-black uppercase px-1">BG</TableHead>
                <TableHead className="text-center text-[8px] font-black uppercase px-1 text-primary">BO</TableHead>
                <TableHead className="text-center text-[8px] font-black uppercase px-1 text-blue-600">BD</TableHead>
                <TableHead className="text-center text-[8px] font-black uppercase px-1">V/N/D</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((team, index) => (
                <TableRow key={team.id} className={index === 0 ? "bg-princeton-orange-50/50" : ""}>
                  <TableCell className="text-center font-black px-1">
                    {index === 0 ? "🏆" : index + 1}
                  </TableCell>
                  <TableCell className="font-bold px-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                      <span className="truncate max-w-[60px] text-[11px]">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-black text-primary tabular-nums px-1 text-xs">
                    {team.points}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-600 tabular-nums px-1 text-[10px]">
                    {team.homeRuns}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-600 tabular-nums px-1 text-[10px]">
                    {team.ballesGobees}
                  </TableCell>
                  <TableCell className="text-center font-black text-primary tabular-nums px-1 text-[10px]">
                    {team.bo}
                  </TableCell>
                  <TableCell className="text-center font-black text-blue-600 tabular-nums px-1 text-[10px]">
                    {team.bd}
                  </TableCell>
                  <TableCell className="text-center text-[8px] text-slate-400 font-bold px-1">
                    {team.wins}/{team.draws}/{team.losses}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Légende */}
        <div className="mt-4 px-2 space-y-1">
          <p className="text-[9px] text-slate-400 font-medium italic">
            <span className="font-bold text-primary">BO :</span> Bonus Offensif (+1 pt si victoire avec &gt; 5 pts d'écart)
          </p>
          <p className="text-[9px] text-slate-400 font-medium italic">
            <span className="font-bold text-blue-600">BD :</span> Bonus Défensif (+1 pt si défaite avec &lt; 5 pts d'écart)
          </p>
        </div>
      </header>
    </div>
  );
}
