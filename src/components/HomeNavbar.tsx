"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [appOpen, setAppOpen] = useState(false);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".hn-app-wrap")) setAppOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

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
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');

        /* ── wrapper: always fixed, always transparent ── */
        .hn {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          z-index: 9999;
          font-family: 'Nunito', sans-serif;
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
        .hn.hn-scrolled {
          height: 64px;
          padding: 0 1.25rem;
        }

        /* ── inner container ── */
        .hn-container {
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

        /* scrolled → white pill with border */
        .hn.hn-scrolled .hn-container {
          background: #fff;
          border: 2px solid #111;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          max-width: 860px;
          padding: 0 0.5rem 0 1.5rem;
        }

        /* ── logo ── */
        .hn-logo {
          font-size: 1.75rem;
          font-weight: 900;
          text-decoration: none;
          display: flex;
          align-items: center;
          letter-spacing: -0.04em;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .hn-logo:hover { opacity: 0.8; }
        .hn-logo .p1 { color: #FF4C00; }
        .hn-logo .p2 { color: #6C4EE5; transition: color 0.4s; }
        .hn.hn-scrolled .hn-logo .p2 { color: #a78bfa; }

        /* ── desktop links — default: white pill ── */
        .hn-links {
          background: #fff;
          border-radius: 999px;
          padding: 0.6rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 1.75rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
          transition: background 0.4s, box-shadow 0.4s, padding 0.4s;
        }
        .hn-links a {
          font-size: 1rem;
          font-weight: 800;
          color: #111;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .hn-links a:hover { color: #FF4C00; }

        /* scrolled → links lose pill, become plain white text */
        .hn.hn-scrolled .hn-links {
          background: transparent;
          box-shadow: none;
          padding: 0.6rem 1.25rem;
        }
        .hn.hn-scrolled .hn-links a { color: #111; }
        .hn.hn-scrolled .hn-links a:hover { color: #FF4C00; }

        /* ── login button ── */
        .hn-btn {
          background: #FF4C00;
          color: #fff;
          padding: 0.55rem 1.6rem;
          border-radius: 999px;
          font-weight: 900;
          font-size: 0.95rem;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(255,76,0,0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.15s;
        }
        .hn-btn:hover {
          background: #e04300;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255,76,0,0.45);
        }
        /* scrolled → keep orange button */
        .hn.hn-scrolled .hn-btn {
          background: #FF4C00;
          color: #fff;
          box-shadow: 0 4px 12px rgba(255,76,0,0.3);
        }

        /* ── app dropdown ── */
        .hn-app-wrap { position: relative; flex-shrink: 0; }
        .hn-app-btn {
          background: #111; color: #FDBC15;
          padding: 0.55rem 1.2rem; border-radius: 999px;
          font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 0.9rem;
          border: none; cursor: pointer; display: flex; align-items: center; gap: 6px;
          white-space: nowrap; transition: background 0.2s, transform 0.15s;
        }
        .hn-app-btn:hover { background: #2a2a2a; transform: translateY(-1px); }
        .hn.hn-scrolled .hn-app-btn { background: #111; color: #FDBC15; }
        .hn-app-chevron { transition: transform 0.25s ease; display: inline-block; }
        .hn-app-chevron.open { transform: rotate(180deg); }
        .hn-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #fff; border: 2.5px solid #111;
          border-radius: 16px; box-shadow: 5px 5px 0 #111;
          min-width: 200px; overflow: hidden;
          opacity: 0; transform: translateY(-8px) scale(0.97);
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 10000;
        }
        .hn-dropdown.open {
          opacity: 1; transform: translateY(0) scale(1); pointer-events: all;
        }
        .hn-dropdown-label {
          font-size: 0.7rem; font-weight: 900; color: #999;
          text-transform: uppercase; letter-spacing: .08em;
          padding: 0.75rem 1rem 0.4rem;
        }
        .hn-dropdown a {
          display: flex; align-items: center; gap: 10px;
          padding: 0.65rem 1rem; font-family: 'Nunito', sans-serif;
          font-size: 0.95rem; font-weight: 800; color: #111;
          text-decoration: none; transition: background 0.15s;
        }
        .hn-dropdown a:hover { background: #FFFDE7; }
        .hn-dropdown a .dd-icon { font-size: 1.1rem; width: 24px; text-align: center; }
        .hn-dropdown-divider { height: 2px; background: #f0f0f0; margin: 0.25rem 0; }

        /* ── hamburger — mobile only ── */
        .hn-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px; height: 36px;
          background: none; border: none;
          cursor: pointer; padding: 4px;
          flex-shrink: 0;
        }
        .hn-burger span {
          display: block; height: 3px;
          background: #111;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.25s ease, background 0.4s;
          transform-origin: center;
        }
        .hn.hn-scrolled .hn-burger span { background: #111; }
        .hn-burger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hn-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hn-burger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

        /* ── mobile dropdown ── */
        .hn-mobile {
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
        .hn-mobile.open { max-height: 300px; }
        .hn-mobile a {
          display: block;
          font-size: 1rem; font-weight: 800;
          color: #fff; text-decoration: none;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-family: 'Nunito', sans-serif;
          transition: background 0.15s;
        }
        .hn-mobile a:hover { background: rgba(255,255,255,0.06); }
        .hn-mobile .hn-mobile-btn {
          margin: 1rem 1.5rem;
          background: #FF4C00;
          color: #fff;
          border-radius: 999px;
          text-align: center;
          border-bottom: none;
        }

        @media (max-width: 640px) {
          .hn-links { display: none; }
          .hn-btn   { display: none; }
          .hn-burger { display: flex; }
          .hn-mobile { display: flex; }
        }
      `}</style>

      <nav className={`hn${scrolled ? " hn-scrolled" : ""}`} role="navigation" aria-label="Main navigation">
        <div className="hn-container">
          <Link href="/" className="hn-logo">
            <span className="p1">grow</span><span className="p2">b</span>
          </Link>

          <div className="hn-links">
            <a href="#features">Feature</a>
            <a href="#how-to-use">How to Use</a>
            <a href="#about-us">About Us</a>
          </div>

          {/* App dropdown */}
          <div className="hn-app-wrap">
            <button className="hn-app-btn" onClick={() => setAppOpen(o => !o)} aria-expanded={appOpen}>
              🐝 Buka App
              <span className={`hn-app-chevron${appOpen ? " open" : ""}`}>▾</span>
            </button>
            <div className={`hn-dropdown${appOpen ? " open" : ""}`}>
              <div className="hn-dropdown-label">Halaman Utama</div>
              <Link href="/dashboard"  onClick={() => setAppOpen(false)}><span className="dd-icon">📊</span>Dashboard</Link>
              <Link href="/add-data"   onClick={() => setAppOpen(false)}><span className="dd-icon">➕</span>Input Data</Link>
              <Link href="/nutrition"  onClick={() => setAppOpen(false)}><span className="dd-icon">🥗</span>Rekomendasi Nutrisi</Link>
            </div>
          </div>

          <Link href="/login" className="hn-btn">Login</Link>

          <button
            className={`hn-burger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`hn-mobile${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <a href="#features"   onClick={() => setMenuOpen(false)}>Feature</a>
        <a href="#how-to-use" onClick={() => setMenuOpen(false)}>How to Use</a>
        <a href="#about-us"   onClick={() => setMenuOpen(false)}>About Us</a>
        <Link href="/login" className="hn-mobile-btn" onClick={() => setMenuOpen(false)}>Login</Link>
      </div>
    </>
  );
}
