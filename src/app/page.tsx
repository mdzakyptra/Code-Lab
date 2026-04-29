import GrowthChart from "../components/GrowthChart";
import { AlertCircle, CheckCircle, Info, Activity, Scale, Ruler, Coffee } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl" style={{ color: "var(--foreground)" }}>Dashboard Pemantauan</h2>
          <p className="text-muted">Pantau pertumbuhan anak Anda secara real-time</p>
        </div>
        <a href="/add-data" className="btn btn-primary">
          + Tambah Data Baru
        </a>
      </div>

      {/* Early Warning Alert */}
      <div className="glass-panel status-warning flex items-center gap-4 animate-fade-in delay-100">
        <AlertCircle size={28} className="text-warning" />
        <div>
          <h3 style={{ fontWeight: 600, color: "var(--foreground)" }}>Perhatian Diperlukan</h3>
          <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.8 }}>Pertumbuhan tinggi badan anak sedikit di bawah standar WHO untuk usia 6 bulan. Disarankan untuk memantau asupan nutrisi.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-200">
        <div className="glass-panel flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-muted text-sm font-medium">Status Gizi (BB/U)</span>
            <Scale size={20} className="text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">Normal</span>
          </div>
          <div className="badge status-normal mt-2" style={{ width: "fit-content" }}>Z-Score: -0.5</div>
        </div>

        <div className="glass-panel flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-muted text-sm font-medium">Tinggi Badan (TB/U)</span>
            <Ruler size={20} className="text-warning" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">Risiko Stunting</span>
          </div>
          <div className="badge status-warning mt-2" style={{ width: "fit-content" }}>Z-Score: -2.1</div>
        </div>

        <div className="glass-panel flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-muted text-sm font-medium">Diagnosis Awal</span>
            <Activity size={20} className="text-accent" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold" style={{ color: "var(--accent)" }}>Perlu Perhatian</span>
          </div>
          <p className="text-sm text-muted mt-2">Berdasarkan data bulan ke-6</p>
        </div>
      </div>

      {/* Chart & Nutrition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-300">
        <div className="glass-panel md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Grafik Pertumbuhan (WHO Standard)</h3>
            <button className="btn btn-outline text-sm">Export PDF</button>
          </div>
          <GrowthChart />
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-panel" style={{ flex: 1 }}>
            <div className="flex items-center gap-2 mb-4">
              <Coffee size={20} className="text-primary" />
              <h3 className="text-lg font-bold">Rekomendasi Nutrisi</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3" style={{ background: "var(--background)", borderRadius: "0.5rem" }}>
                <h4 className="font-semibold text-sm">Pagi</h4>
                <p className="text-sm text-muted mt-1">Bubur saring hati ayam, bayam, & wortel (150 kalori)</p>
              </div>
              <div className="p-3" style={{ background: "var(--background)", borderRadius: "0.5rem" }}>
                <h4 className="font-semibold text-sm">Siang</h4>
                <p className="text-sm text-muted mt-1">Nasi tim tahu brokoli dengan kaldu tulang (200 kalori)</p>
              </div>
              <div className="p-3" style={{ background: "var(--background)", borderRadius: "0.5rem" }}>
                <h4 className="font-semibold text-sm">Malam</h4>
                <p className="text-sm text-muted mt-1">Puree pisang & alpukat (120 kalori)</p>
              </div>
            </div>
            <a href="/nutrition" className="btn btn-outline text-sm mt-4" style={{ width: "100%" }}>
              Lihat Detail Gizi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
