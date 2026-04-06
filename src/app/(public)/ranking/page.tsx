import { prisma } from "@/lib/prisma";
import { calculateRanking } from "@/lib/ranking";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Target } from "lucide-react";
export const dynamic = "force-dynamic";
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
            <div className="w-10 h-10 bg-princeton-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-1">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Top Home Runs</p>
            <p className="text-sm font-black truncate">{topHomeRuns?.name || "-"}</p>
            <p className="text-xl font-black text-primary">{topHomeRuns?.homeRuns || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-1">
              <Target className="h-5 w-5 text-slate-800" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Top Balles Gobées</p>
            <p className="text-sm font-black truncate">{topBallesGobees?.name || "-"}</p>
            <p className="text-xl font-black text-slate-800">{topBallesGobees?.ballesGobees || 0}</p>
          </div>
        </div>
      </section>

      {/* 3. Classement Général */}
      <header className="px-1 pb-10">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 px-1">Classement Général</h2>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-8 text-center text-[7px] font-black uppercase px-0.5">#</TableHead>
                <TableHead className="text-[7px] font-black uppercase px-0.5 min-w-[50px]">Équipe</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">Pts</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">J</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">M(+/-)</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">Diff</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">HR</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">BG</TableHead>
                <TableHead className="text-center text-[7px] font-black uppercase px-0.5">BO/BD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((team, index) => (
                <TableRow key={team.id} className={index === 0 ? "bg-princeton-orange-50/50" : ""}>
                  <TableCell className="text-center font-black px-0.5 text-[10px]">
                    {index === 0 ? "🏆" : index + 1}
                  </TableCell>
                  <TableCell className="font-bold px-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                      <span className="truncate max-w-[50px] text-[10px]">{team.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-black text-primary tabular-nums px-0.5 text-xs">
                    {team.points}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-400 tabular-nums px-0.5 text-[10px]">
                    {team.played}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-500 tabular-nums px-0.5 text-[9px]">
                    {team.goalsFor}-{team.goalsAgainst}
                  </TableCell>
                  <TableCell className={`text-center font-black tabular-nums px-0.5 text-[10px] ${
                    team.goalsFor - team.goalsAgainst > 0 ? "text-green-600" : 
                    team.goalsFor - team.goalsAgainst < 0 ? "text-red-600" : "text-slate-400"
                  }`}>
                    {team.goalsFor - team.goalsAgainst > 0 ? "+" : ""}{team.goalsFor - team.goalsAgainst}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-600 tabular-nums px-0.5 text-[10px]">
                    {team.homeRuns}
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-600 tabular-nums px-0.5 text-[10px]">
                    {team.ballesGobees}
                  </TableCell>
                  <TableCell className="text-center font-bold tabular-nums px-0.5 text-[9px]">
                    <span className="text-primary">{team.bo}</span>
                    <span className="text-slate-300 mx-0.5">/</span>
                    <span className="text-blue-600">{team.bd}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Légende */}
        <div className="mt-6 px-2 space-y-1.5">
          <p className="text-[9px] text-slate-500 font-medium">
            <span className="font-black text-slate-900">J :</span> Matchs Joués
          </p>
          <p className="text-[9px] text-slate-500 font-medium">
            <span className="font-black text-slate-900">M(+/-) :</span> Points marqués - Points encaissés (Total du tournoi)
          </p>
          <p className="text-[9px] text-slate-500 font-medium">
            <span className="font-black text-slate-900">Diff :</span> Différentiel de points (Marqués - Encaissés)
          </p>
          <div className="flex gap-4">
            <p className="text-[9px] text-slate-500 font-medium">
              <span className="font-black text-slate-900">HR :</span> Home Runs
            </p>
            <p className="text-[9px] text-slate-500 font-medium">
              <span className="font-black text-slate-900">BG :</span> Balles Gobées
            </p>
          </div>
          <p className="text-[9px] text-slate-400 font-medium italic pt-2 border-t border-slate-100">
            <span className="font-bold text-primary">BO :</span> Bonus Offensif (+1 pt si victoire &gt; 5 pts d'écart)
          </p>
          <p className="text-[9px] text-slate-400 font-medium italic">
            <span className="font-bold text-blue-600">BD :</span> Bonus Défensif (+1 pt si défaite &lt; 5 pts d'écart)
          </p>
        </div>
      </header>
    </div>
  );
}
