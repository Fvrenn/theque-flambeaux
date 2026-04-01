import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
          <Link href="/admin" className="text-lg font-bold text-foreground">
            🔥 Flambeaux Thèque
            <span className="ml-1.5 text-sm font-medium text-princeton-orange-600">
              Admin
            </span>
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
