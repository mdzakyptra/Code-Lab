"use client";

import { Save, ArrowLeft } from "lucide-react";

export default function AddData() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <a href="/" className="btn btn-outline" style={{ padding: "0.5rem" }}>
          <ArrowLeft size={20} />
        </a>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Input Data Pertumbuhan</h2>
          <p className="text-muted">Masukkan data terbaru untuk memperbarui status anak</p>
        </div>
      </div>

      <form className="glass-panel flex flex-col gap-6 animate-fade-in delay-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="label">Umur Anak (Bulan)</label>
            <input type="number" className="input-field" placeholder="Contoh: 6" min="0" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="label">Jenis Kelamin</label>
            <select className="input-field" required>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="label">Berat Badan (kg)</label>
            <input type="number" step="0.1" className="input-field" placeholder="Contoh: 7.5" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="label">Tinggi Badan (cm)</label>
            <input type="number" step="0.1" className="input-field" placeholder="Contoh: 65.0" required />
          </div>

        </div>

        <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "1rem 0" }} />

        <h3 className="text-lg font-bold">Data Tambahan (Opsional)</h3>

        <div className="flex flex-col gap-2">
          <label className="label">Riwayat Kesehatan / Keluhan</label>
          <textarea className="input-field" rows={3} placeholder="Contoh: Anak sering rewel, nafsu makan berkurang..."></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="label">Pola Makan Saat Ini</label>
          <textarea className="input-field" rows={3} placeholder="Contoh: Susu formula 3x sehari, ASI, MPASI bubur instan..."></textarea>
        </div>

        <div className="flex justify-end mt-4">
          <button type="button" className="btn btn-primary gap-2" style={{ padding: "0.75rem 2rem" }}>
            <Save size={20} />
            Simpan Data & Analisis
          </button>
        </div>
      </form>
    </div>
  );
}
