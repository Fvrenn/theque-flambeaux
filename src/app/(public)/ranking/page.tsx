import { prisma } from "@/lib/prisma";
import { calculateRanking } from "@/lib/ranking";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Target, Star } from "lucide-react";

export default async function RankingPage() {
  const teams = await prisma.team.findMany();
  const matches = await prisma.match.findMany({
    where: { status: "FINISHED" },
  });

  const ranking = calculateRanking(teams, matches);

  // Calcul des records
  const statsByTeam = teams.map(team => {
    let homeRuns = 0;
    let ballesGobees = 0;

    matches.forEach(m => {
      if (m.teamAId === team.id) {
        const stats = m.statsTeamA as any;
        homeRuns += stats?.homeRun || 0;
        ballesGobees += stats?.balleGobee || 0;
      }
      if (m.teamBId === team.id) {
        const stats = m.statsTeamB as any;
        homeRuns += stats?.homeRun || 0;
        ballesGobees += stats?.balleGobee || 0;
      }
    });

    return { team, homeRuns, ballesGobees };
  });

  const topHomeRuns = [...statsByTeam].sort((a, b) => b.homeRuns - a.homeRuns)[0];
  const topBallesGobees = [...statsByTeam].sort((a, b) => b.ballesGobees - a.ballesGobees)[0];

  return (
    <div className="space-y-8 py-2">
      <header className="px-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4">Classement Général</h2>
        
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-12 text-center text-[10px] font-black uppercase">#</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Équipe</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase">Pts</TableHead>
                <TableHead className="text-center text-[10px] font-black uppercase">V/N/D</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((team, index) => (
                <TableRow key={team.id} className={index === 0 ? "bg-princeton-orange-50/50" : ""}>
                  <TableCell className="text-center font-black">
                    {index === 0 ? "🏆" : index + 1}
                  </TableCell>
                  <TableCell className="font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                    <span className="truncate">{team.name}</span>
                  </TableCell>
                  <TableCell className="text-center font-black text-primary tabular-nums">
                    {team.points}
                  </TableCell>
                  <TableCell className="text-center text-[10px] text-slate-400 font-bold">
                    {team.wins}/{team.draws}/{team.losses}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </header>

      <section className="px-2">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Tableau d'Honneur</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
            <div className="w-10 h-10 bg-princeton-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Home Runs</p>
            <p className="text-sm font-black truncate">{topHomeRuns?.team.name || "-"}</p>
            <p className="text-xl font-black text-primary tabular-nums">{topHomeRuns?.homeRuns || 0}</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center space-y-2">
            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-5 w-5 text-slate-800" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Balles Gobées</p>
            <p className="text-sm font-black truncate">{topBallesGobees?.team.name || "-"}</p>
            <p className="text-xl font-black text-slate-800 tabular-nums">{topBallesGobees?.ballesGobees || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
