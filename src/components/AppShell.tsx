"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Pages that should NOT show the global nav bar (they manage their own layout)
const NO_NAV_PATHS = ["/", "/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !NO_NAV_PATHS.includes(pathname);

  return (
    <>
      <style>{`
        .neo-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FFD54F;
          border-bottom: 3px solid #111;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Nunito', sans-serif;
        }
        .neo-logo {
          font-size: 1.9rem;
          font-weight: 900;
          color: #111;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .neo-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          min-width: 320px;
          justify-content: flex-end;
        }
        .neo-links a {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #111;
          text-decoration: none;
          padding: 0.4rem 0.8rem;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .neo-links a:hover {
          background: rgba(0,0,0,0.08);
        }
        .neo-links a.active {
          background: #111;
          color: #FFC107;
        }
        .neo-main {
          font-family: 'Nunito', sans-serif;
          background: #FFFDE7;
          min-height: calc(100vh - 70px);
          padding: 2rem;
        }
      `}</style>
      {showNav && (
        <nav className="neo-nav print:hidden">
          <Link href="/dashboard" className="neo-logo">
            <span>🐝</span> GrowB
          </Link>
          <div className="neo-links">
            <Link 
              href="/dashboard" 
              className={pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
            <Link 
              href="/add-data" 
              className={pathname === '/add-data' ? 'active' : ''}
            >
              Input Data
            </Link>
            <Link 
              href="/nutrition" 
              className={pathname === '/nutrition' ? 'active' : ''}
            >
              Nutrisi
            </Link>
          </div>
        </nav>
      )}
      {showNav ? (
        <main className="neo-main animate-fade-in">
          {children}
        </main>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
