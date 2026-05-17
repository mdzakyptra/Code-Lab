"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const NO_NAV_PATHS = ["/", "/login", "/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const showNav = !NO_NAV_PATHS.includes(pathname);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const getY = () => Math.max(
      window.scrollY,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    let prev = false;
    let rafId: number;
    const tick = () => {
      const now = getY() > 80;
      if (now !== prev) { prev = now; setScrolled(now); }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        .an {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          z-index: 9999;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: transparent;
          border: none;
          box-shadow: none;
          height: 72px;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
          transition: height 0.4s cubic-bezier(0.4,0,0.2,1),
                      padding 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .an.an-scrolled {
          height: 64px;
          padding: 0 1.25rem;
        }

        .an-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0 1.5rem;
          height: 52px;
          border-radius: 999px;
          transition: background 0.4s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.4s cubic-bezier(0.4,0,0.2,1),
                      max-width 0.4s cubic-bezier(0.4,0,0.2,1),
                      padding 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .an.an-scrolled .an-container {
          background: #fff;
          border: 2px solid #111;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          max-width: 900px;
          padding: 0 0.5rem 0 1.5rem;
        }

        .an-logo {
          font-size: 1.75rem;
          font-weight: 900;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0;
          letter-spacing: -0.04em;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .an-logo:hover { opacity: 0.8; }
        .an-logo .p1 { color: #FF4C00; }
        .an-logo .p2 { color: #6C4EE5; transition: color 0.4s; }
        .an.an-scrolled .an-logo .p2 { color: #a78bfa; }

        .an-links {
          background: #fff;
          border-radius: 999px;
          padding: 0.6rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          transition: background 0.4s, box-shadow 0.4s, padding 0.4s;
        }
        .an-links a {
          font-size: 1rem;
          font-weight: 800;
          color: #111;
          text-decoration: none;
          white-space: nowrap;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .an-links a:hover { color: #FF4C00; }
        .an-links a.an-active {
          background: #111;
          color: #FDBC15;
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
        }
        .an-links a.an-active:hover { color: #FDBC15; }

        .an.an-scrolled .an-links {
          background: transparent;
          box-shadow: none;
          padding: 0.6rem 1.25rem;
        }
        .an.an-scrolled .an-links a { color: #111; }
        .an.an-scrolled .an-links a:hover { color: #FF4C00; }
        .an.an-scrolled .an-links a.an-active {
          background: #111;
          color: #FDBC15;
        }

        .an-right { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

        .an-btn {
          background: #FF4C00;
          color: #fff;
          padding: 0.55rem 1.6rem;
          border-radius: 999px;
          font-weight: 900;
          font-size: 0.95rem;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(255,76,0,0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
          border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .an-btn:hover {
          background: #e04300;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255,76,0,0.45);
        }
        .an.an-scrolled .an-btn {
          background: #FF4C00;
          color: #fff;
          box-shadow: 0 4px 12px rgba(255,76,0,0.3);
        }
        .an-logout {
          background: #ffcdd2;
          color: #b71c1c;
          padding: 0.55rem 1.2rem;
          border-radius: 999px;
          font-weight: 900;
          font-size: 0.95rem;
          white-space: nowrap;
          border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s;
        }
        .an-logout:hover { background: #fecaca; }

        .an-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px; height: 36px;
          background: none; border: none;
          cursor: pointer; padding: 4px;
          flex-shrink: 0;
        }
        .an-burger span {
          display: block; height: 3px;
          background: #111;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease;
          transform-origin: center;
        }
        .an-burger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .an-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .an-burger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        .an-mobile {
          display: none;
          position: fixed;
          top: 72px; left: 0;
          width: 100%;
          background: #111;
          z-index: 9998;
          flex-direction: column;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .an-mobile.open { max-height: 360px; }
        .an-mobile a {
          display: block;
          font-size: 1rem; font-weight: 800;
          color: #fff; text-decoration: none;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s;
        }
        .an-mobile a:hover { background: rgba(255,255,255,0.06); }
        .an-mobile a.an-mobile-active { color: #FDBC15; }
        .an-mobile .an-mobile-home {
          margin: 1rem 1.5rem 0;
          background: #FF4C00;
          color: #fff !important;
          border-radius: 999px;
          text-align: center;
          border-bottom: none;
        }
        .an-mobile .an-mobile-logout {
          margin: 0.5rem 1.5rem 1rem;
          background: #ffcdd2;
          color: #b71c1c !important;
          border-radius: 999px;
          text-align: center;
          border-bottom: none;
          padding: 1rem 1.5rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          width: calc(100% - 3rem);
          display: block;
        }
        .an-mobile .an-mobile-logout:hover { background: #fecaca; }

        @media (max-width: 768px) {
          .an-links  { display: none; }
          .an-right  { display: none; }
          .an-burger { display: flex; }
          .an-mobile { display: flex; }
        }

        .an-main {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #FFFDE7;
          min-height: 100vh;
          padding: 80px 1rem 0;
        }
        @media (min-width: 640px) {
          .an-main { padding: 88px 1.5rem 0; }
        }
        @media (min-width: 1024px) {
          .an-main { padding: 96px 2rem 0; }
        }
      `}</style>

      {showNav && (
        <>
          <nav className={`an${scrolled ? " an-scrolled" : ""}`} role="navigation" aria-label="App navigation">
            <div className="an-container">
              <Link href="/" className="an-logo">
                <span className="p1">grow</span><span className="p2">B</span>
              </Link>

              <div className="an-links">
                <Link href="/dashboard" className={pathname === "/dashboard" ? "an-active" : ""}>Dashboard</Link>
                <Link href="/add-data"  className={pathname === "/add-data"  ? "an-active" : ""}>Input Data</Link>
                <Link href="/nutrition" className={pathname === "/nutrition" ? "an-active" : ""}>Nutrisi</Link>
              </div>

              <div className="an-right">
                <Link href="/" className="an-btn">Home</Link>
                <button onClick={handleLogout} className="an-logout">Keluar</button>
              </div>

              <button
                className={`an-burger${menuOpen ? " open" : ""}`}
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                <span /><span /><span />
              </button>
            </div>
          </nav>

          <div className={`an-mobile${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
            <Link href="/dashboard" className={pathname === "/dashboard" ? "an-mobile-active" : ""} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link href="/add-data"  className={pathname === "/add-data"  ? "an-mobile-active" : ""} onClick={() => setMenuOpen(false)}>Input Data</Link>
            <Link href="/nutrition" className={pathname === "/nutrition" ? "an-mobile-active" : ""} onClick={() => setMenuOpen(false)}>Nutrisi</Link>
            <Link href="/" className="an-mobile-home" onClick={() => setMenuOpen(false)}>Home</Link>
            <button className="an-mobile-logout" onClick={() => { setMenuOpen(false); handleLogout(); }}>Keluar</button>
          </div>
        </>
      )}

      {showNav ? (
        <main className="an-main animate-fade-in">
          {children}
        </main>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
