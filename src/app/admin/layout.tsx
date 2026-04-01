import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">
            Flambeaux Thèque - Admin
          </h1>
          <div className="flex gap-4">
            <a href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary">
              Tournois
            </a>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6">
        {children}
      </main>
    </div>
  );
}
