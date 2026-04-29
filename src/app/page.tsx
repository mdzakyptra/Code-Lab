import Link from "next/link";
import { Activity, BrainCircuit, LineChart, BellRing, ArrowRight, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl tracking-tight">
            <Activity size={24} />
            <span>StuntGuard</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">
              Masuk
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-indigo-50 to-slate-50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-6">
          <ShieldCheck size={14} /> Berbasis Standar WHO
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight mb-6">
          Deteksi Dini Stunting, <br className="hidden md:block" />
          <span className="text-indigo-600">Lindungi Masa Depan Anak</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
          Platform digital pintar untuk memantau tumbuh kembang anak Anda. Dilengkapi dengan diagnosis awal Z-Score dan rekomendasi gizi dari Dokter AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="px-8 py-4 text-base font-bold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2">
            Mulai Pantau Sekarang <ArrowRight size={18} />
          </Link>
          <Link href="/login" className="px-8 py-4 text-base font-bold bg-white text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 transition-all flex items-center justify-center">
            Saya Sudah Punya Akun
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fitur Utama Aplikasi</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Kami merancang sistem ini untuk memberikan kemudahan bagi orang tua dan kader kesehatan dalam memantau gizi anak.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Visualisasi Grafik</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pantau riwayat tinggi dan berat badan anak bulan demi bulan dalam grafik interaktif yang mudah dibaca.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Diagnosis WHO</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sistem otomatis menghitung Z-Score (TB/U & BB/U) standar WHO untuk mendeteksi risiko stunting secara dini.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Dokter AI Nutrisi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dapatkan rekomendasi menu makan harian, target kalori, dan protein khusus dari AI berdasarkan kondisi anak Anda.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <BellRing size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Alarm Pengingat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tidak akan ada lagi jadwal Posyandu yang terlewat. Aplikasi akan mengingatkan Anda jika sudah waktunya menimbang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} StuntGuard - Sistem Deteksi Dini Stunting Anak.</p>
        <p className="mt-2">Dikembangkan untuk masa depan yang lebih sehat.</p>
      </footer>
    </div>
  );
}
