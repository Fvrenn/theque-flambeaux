import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { LiveMatchDetail } from "@/components/features/public/LiveMatchDetail";
import { SSERefresh } from "@/components/shared/SSERefresh";

interface Props {
  params: Promise<{ matchId: string }>;
}

export default async function PublicMatchLivePage({ params }: Props) {
  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      teamA: true,
      teamB: true,
    },
  });

  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-6 py-4">
      <SSERefresh />
      <LiveMatchDetail match={match as any} />
    </div>
  );
}
