import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonProps {
  tournamentDate: string | null;
}

export function ComingSoon({ tournamentDate }: ComingSoonProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-none shadow-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-princeton-orange-500/10">
        <CardContent className="p-12 text-center space-y-8">
          <div className="inline-block p-4 rounded-full bg-primary/20 animate-pulse">
            <svg
              className="w-16 h-16 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Tournoi de thèque à venir !
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-medium">
              Nous préparons le terrain pour une compétition légendaire.
            </p>
          </div>

          {tournamentDate && (
            <div className="py-6 px-8 rounded-2xl bg-white shadow-sm inline-block border border-slate-100">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">
                Rendez-vous le
              </p>
              <p className="text-3xl font-black text-slate-900">
                {tournamentDate}
              </p>
            </div>
          )}

          <div className="pt-8 border-t border-slate-200/50">
            <p className="text-slate-500 italic">
              Revenez bientôt pour suivre les scores en direct et le classement !
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
