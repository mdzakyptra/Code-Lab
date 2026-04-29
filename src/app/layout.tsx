import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stunting Early Detection & Monitoring",
  description: "Platform digital untuk deteksi dini stunting dan pemantauan pertumbuhan anak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
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
            <h1 style={{ fontSize: "1.5rem", color: "var(--primary)" }}>GrowthGuard</h1>
            <div className="flex gap-4 items-center">
              <a href="/" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Dashboard</a>
              <a href="/add-data" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Input Data</a>
              <a href="/nutrition" style={{ fontWeight: 500, fontSize: "0.875rem" }}>Nutrisi</a>
            </div>
          </div>
        </nav>
        <main className="container mt-8 mb-8 animate-fade-in">
          {children}
        </main>
      </body>
    </html>
  );
}
