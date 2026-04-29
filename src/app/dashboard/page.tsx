"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import GrowthChart from '@/components/GrowthChart';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [latestStatus, setLatestStatus] = useState<any>(null);
  const [reminders, setReminders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      setUser(session.user);

      // Ambil data profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
      }
      
      // Ambil semua data anak milik user ini
      const { data: childrenData } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', session.user.id)
        .order('created_at', { ascending: true });

      if (childrenData && childrenData.length > 0) {
        setChildren(childrenData);
        setSelectedChildId(childrenData[0].id); // Pilih anak pertama secara default

        // Cek Reminder Bulanan
        const newReminders: string[] = [];
        for (const child of childrenData) {
          const { data: latestRecord } = await supabase
            .from('growth_records')
            .select('measurement_date')
            .eq('child_id', child.id)
            .order('measurement_date', { ascending: false })
            .limit(1)
            .single();
            
          if (latestRecord) {
            const lastDate = new Date(latestRecord.measurement_date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Jika lewat dari 30 hari, berikan peringatan
            if (diffDays >= 30) {
              newReminders.push(`Waktunya timbang! Sudah ${diffDays} hari sejak pengukuran terakhir ${child.full_name}.`);
            }
          } else {
            // Jika baru daftar dan belum ada data record sama sekali
            newReminders.push(`Belum ada data awal pertumbuhan untuk ${child.full_name}. Yuk, isi sekarang!`);
          }
        }
        setReminders(newReminders);
      }
      
      setLoading(false);
    };

    checkUser();
  }, [router]);

  // Effect terpisah khusus untuk mengambil data grafik setiap kali pilihan anak diubah
  useEffect(() => {
    if (!selectedChildId) return;

    const fetchGrowthRecords = async () => {
      const { data: growthData } = await supabase
        .from('growth_records')
        .select('*')
        .eq('child_id', selectedChildId)
        .order('age_in_months', { ascending: true });
        
      if (growthData && growthData.length > 0) {
          const formattedData = growthData.map(record => ({
            month: record.age_in_months,
            weight: record.weight,
            height: record.height,
            normalWeight: record.age_in_months * 0.5 + 3.3, 
            normalHeight: record.age_in_months * 2 + 50.5
          }));
          setChartData(formattedData);

          // Data terbaru adalah data terakhir di array (karena di-sort ASC)
          const latest = growthData[growthData.length - 1];
          setLatestStatus({
            status: latest.health_status,
            zScoreHFA: latest.z_score_hfa,
            zScoreWFA: latest.z_score_wfa
          });
        } else {
          setChartData([]);
          setLatestStatus(null);
        }
    };

    fetchGrowthRecords();
  }, [selectedChildId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 print:shadow-none print:p-0">
        
        {/* Header khusus saat dicetak ke PDF */}
        <div className="hidden print:block text-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Laporan Pemantauan Pertumbuhan Anak</h1>
          <p className="text-gray-500">Sistem Deteksi Dini Stunting</p>
          <p className="text-sm text-gray-400 mt-2">Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
        </div>

        <div className="flex justify-between items-center mb-8 border-b pb-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Selamat datang kembali, {profile?.full_name || user?.email}!</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              🖨️ Cetak PDF
            </button>
            <Link 
              href="/nutrition"
              className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors flex items-center gap-1"
            >
              ✨ Tanya AI Nutrisi
            </Link>
            <Link 
              href="/add-data"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Tambah Data
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Tampilkan Notifikasi Reminder Bulanan */}
        {reminders.length > 0 && (
          <div className="mb-8 space-y-3 print:hidden">
            {reminders.map((msg, idx) => (
              <div key={idx} className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-lg flex items-start gap-3 shadow-sm animate-fade-in">
                <span className="text-xl mt-0.5">🔔</span>
                <div>
                  <h3 className="font-bold text-amber-900 mb-1">Pengingat Jadwal Posyandu/Mandiri</h3>
                  <p className="text-sm">{msg}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h2 className="font-semibold text-indigo-900 mb-1">Informasi Akun</h2>
            <p className="text-sm text-indigo-800">{user?.email} &bull; {profile?.role === 'kader_kesehatan' ? 'Kader Kesehatan' : 'Orang Tua'}</p>
          </div>
          
          {latestStatus && latestStatus.status && (
            <div className="bg-white rounded-xl p-6 border shadow-sm w-full animate-fade-in">
              <h2 className="font-semibold text-gray-800 mb-4">Diagnosis Awal (Status Gizi Saat Ini)</h2>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status berdasarkan Standar WHO (Z-Score)</p>
                  <p className="font-bold text-lg text-slate-800">{latestStatus.status}</p>
                </div>
                <div className="text-sm bg-white p-3 rounded border text-gray-600">
                  <p>TB/U (Tinggi): <span className="font-semibold text-gray-900">{latestStatus.zScoreHFA}</span></p>
                  <p>BB/U (Berat): <span className="font-semibold text-gray-900">{latestStatus.zScoreWFA}</span></p>
                </div>
              </div>

              {(latestStatus.zScoreHFA < -2 || latestStatus.zScoreWFA < -2) && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-md text-sm flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <strong className="block mb-1">Peringatan Dini (Early Warning)</strong>
                    Status gizi anak terdeteksi berada di bawah standar. Sangat disarankan untuk segera melakukan konsultasi dengan Puskesmas atau Dokter Spesialis Anak untuk penanganan lebih lanjut.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl p-6 border shadow-sm w-full overflow-hidden print:border-none print:shadow-none print:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 print:mb-2">
              <h2 className="font-semibold text-gray-800">Grafik Pertumbuhan Anak</h2>
              
              {children.length > 0 && (
                <div className="print:hidden">
                  <select 
                    className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white min-w-[200px]"
                    value={selectedChildId || ''}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                  >
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.full_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Teks label nama anak saat di PDF agar jelas grafik siapa */}
              <div className="hidden print:block font-bold text-indigo-700">
                Nama Anak: {children.find(c => c.id === selectedChildId)?.full_name}
              </div>
            </div>
            
            {children.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Belum ada profil anak. Silakan klik + Tambah Data.
              </div>
            ) : (
              <GrowthChart data={chartData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
