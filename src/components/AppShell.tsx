"use client";

import { usePathname } from "next/navigation";

// Pages that should NOT show the global nav bar (they manage their own layout)
const NO_NAV_PATHS = ["/", "/login", "/register"];


export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !NO_NAV_PATHS.includes(pathname);

  return (
    <>
      {showNav && (
        <nav style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "1rem 0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "var(--shadow-sm)"
        }}>
          <div className="container flex items-center justify-between">
            <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--primary)", fontFamily: "'Outfit', sans-serif" }}>
              GrowB
            </span>
            <div className="flex gap-4 items-center">
              <a href="/" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Dashboard</a>
              <a href="/add-data" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Input Data</a>
              <a href="/nutrition" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Nutrisi</a>
            </div>
          </div>
        </nav>
      )}
      {showNav ? (
        <main className="container mt-8 mb-8 animate-fade-in">
          {children}
        </main>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
