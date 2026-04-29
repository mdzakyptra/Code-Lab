import { ArrowLeft, Sparkles, Utensils, Droplet, Flame, Brain } from "lucide-react";

export default function Nutrition() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="btn btn-outline" style={{ padding: "0.5rem" }}>
            <ArrowLeft size={20} />
          </a>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Rekomendasi Nutrisi AI</h2>
            <p className="text-muted">Menu harian disesuaikan untuk kebutuhan anak usia 6 bulan</p>
          </div>
        </div>
        <button className="btn btn-primary gap-2" style={{ background: "var(--accent)" }}>
          <Sparkles size={18} /> Generate Ulang Menu
        </button>
      </div>

      {/* Daily Needs Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in delay-100">
        <div className="glass-panel flex flex-col items-center justify-center text-center p-4">
          <Flame size={24} className="text-warning mb-2" />
          <span className="text-xl font-bold">450</span>
          <span className="text-sm text-muted">Kkal Kalori</span>
        </div>
        <div className="glass-panel flex flex-col items-center justify-center text-center p-4">
          <Utensils size={24} className="text-primary mb-2" />
          <span className="text-xl font-bold">12g</span>
          <span className="text-sm text-muted">Protein</span>
        </div>
        <div className="glass-panel flex flex-col items-center justify-center text-center p-4">
          <Droplet size={24} className="text-accent mb-2" />
          <span className="text-xl font-bold">400ml</span>
          <span className="text-sm text-muted">Cairan</span>
        </div>
        <div className="glass-panel flex flex-col items-center justify-center text-center p-4">
          <Brain size={24} className="text-purple-500 mb-2" />
          <span className="text-xl font-bold">Tinggi</span>
          <span className="text-sm text-muted">Zat Besi / DHA</span>
        </div>
      </div>

      {/* Menu Schedule */}
      <div className="glass-panel animate-fade-in delay-200">
        <h3 className="text-xl font-bold mb-6">Menu Harian Anak</h3>
        
        <div className="flex flex-col gap-6">
          {/* Breakfast */}
          <div className="flex flex-col md:flex-row gap-4 border-b pb-6" style={{ borderColor: "var(--border)" }}>
            <div className="md:w-1/4">
              <span className="badge status-normal mb-2">07:00 Pagi</span>
              <h4 className="font-bold">Sarapan Utama</h4>
            </div>
            <div className="md:w-3/4 flex flex-col gap-3">
              <div className="p-4" style={{ background: "var(--background)", borderRadius: "0.5rem" }}>
                <h5 className="font-semibold text-lg">Bubur Saring Hati Ayam & Bayam</h5>
                <p className="text-muted text-sm mt-1">Bahan: Beras putih, hati ayam, bayam cincang halus, kaldu ayam murni.</p>
                <div className="flex gap-2 mt-3">
                  <span className="badge" style={{ background: "var(--border)" }}>150 Kkal</span>
                  <span className="badge" style={{ background: "var(--border)" }}>Tinggi Zat Besi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Snack */}
          <div className="flex flex-col md:flex-row gap-4 border-b pb-6" style={{ borderColor: "var(--border)" }}>
            <div className="md:w-1/4">
              <span className="badge status-warning mb-2">10:00 Siang</span>
              <h4 className="font-bold">Cemilan / Snack</h4>
            </div>
            <div className="md:w-3/4 flex flex-col gap-3">
              <div className="p-4" style={{ background: "var(--background)", borderRadius: "0.5rem" }}>
                <h5 className="font-semibold text-lg">Puree Buah Alpukat Mentega</h5>
                <p className="text-muted text-sm mt-1">Bahan: 1/2 buah alpukat mentega matang, ASI/Susu Formula.</p>
                <div className="flex gap-2 mt-3">
                  <span className="badge" style={{ background: "var(--border)" }}>100 Kkal</span>
                  <span className="badge" style={{ background: "var(--border)" }}>Lemak Baik</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lunch */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/4">
              <span className="badge status-normal mb-2">13:00 Siang</span>
              <h4 className="font-bold">Makan Siang</h4>
            </div>
            <div className="md:w-3/4 flex flex-col gap-3">
              <div className="p-4" style={{ background: "var(--background)", borderRadius: "0.5rem" }}>
                <h5 className="font-semibold text-lg">Nasi Tim Salmon Brokoli</h5>
                <p className="text-muted text-sm mt-1">Bahan: Nasi putih cincang, ikan salmon, brokoli rebus, sedikit unsalted butter.</p>
                <div className="flex gap-2 mt-3">
                  <span className="badge" style={{ background: "var(--border)" }}>200 Kkal</span>
                  <span className="badge" style={{ background: "var(--border)" }}>DHA & Omega-3</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
