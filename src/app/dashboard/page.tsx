"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import GrowthChart from '@/components/GrowthChart';
import { formatAge } from '@/utils/whoStandards';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [historyRecords, setHistoryRecords] = useState<any[]>([]);
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

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
      }
      
      const { data: childrenData } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', session.user.id)
        .order('created_at', { ascending: true });

      if (childrenData && childrenData.length > 0) {
        setChildren(childrenData);
        setSelectedChildId(childrenData[0].id);

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
            
            if (diffDays >= 30) {
              newReminders.push(`Waktunya timbang! Sudah ${diffDays} hari sejak pengukuran terakhir ${child.full_name}.`);
            }
          } else {
            newReminders.push(`Belum ada data awal pertumbuhan untuk ${child.full_name}. Yuk, isi sekarang!`);
          }
        }
        setReminders(newReminders);
      }
      
      setLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (!selectedChildId) return;

    const fetchGrowthRecords = async () => {
      const { data: growthData } = await supabase
        .from('growth_records')
        .select('*')
        .eq('child_id', selectedChildId)
        .order('age_in_months', { ascending: true });
        
      if (growthData && growthData.length > 0) {
          setHistoryRecords([...growthData].reverse());

          const formattedData = growthData.map(record => ({
            id: record.id,
            month: record.age_in_months,
            weight: record.weight,
            height: record.height,
            normalWeight: record.age_in_months * 0.5 + 3.3, 
            normalHeight: record.age_in_months * 2 + 50.5
          }));
          setChartData(formattedData);

          const latest = growthData[growthData.length - 1];
          setLatestStatus({
            status: latest.health_status,
            zScoreHFA: latest.z_score_hfa,
            zScoreWFA: latest.z_score_wfa
          });
        } else {
          setChartData([]);
          setHistoryRecords([]);
          setLatestStatus(null);
        }
    };

    fetchGrowthRecords();
  }, [selectedChildId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDeleteRecord = async (recordId: string) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus data pengukuran ini?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('growth_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;
      
      setHistoryRecords(prev => prev.filter(r => r.id !== recordId));
      setChartData(prev => prev.filter(r => r.id !== recordId));
      
      window.location.reload();
    } catch (err: any) {
      alert("Gagal menghapus data: " + (err.message || "Kesalahan tak dikenal"));
      console.error("Delete Error:", err);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito', sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>Memuat lebah madu... 🐝</div>;
  }

  return (
    <>
      <style>{`
        .dash-container { max-width: 1000px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
        
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem; }
        .dash-title { font-size: 2.5rem; font-weight: 900; color: #111; line-height: 1.1; margin-bottom: 0.5rem; }
        .dash-subtitle { font-size: 1.1rem; color: #5d4037; font-weight: 600; }
        
        .dash-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-neo { padding: 0.6rem 1.25rem; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.95rem; text-decoration: none; border: 2.5px solid #111; border-radius: 999px; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-neo:hover { transform: translate(-2px, -2px); }
        .btn-print { background: #fff; color: #111; box-shadow: 3px 3px 0 #111; }
        .btn-print:hover { box-shadow: 5px 5px 0 #111; }
        .btn-ai { background: #FFC107; color: #111; box-shadow: 3px 3px 0 #5d4037; }
        .btn-ai:hover { box-shadow: 5px 5px 0 #5d4037; }
        .btn-add { background: #111; color: #FFC107; box-shadow: 3px 3px 0 #5d4037; }
        .btn-add:hover { box-shadow: 5px 5px 0 #5d4037; }
        .btn-logout { background: #ffcdd2; color: #b71c1c; box-shadow: 3px 3px 0 #111; }
        .btn-logout:hover { box-shadow: 5px 5px 0 #111; }

        .child-select-card { background: #FFE082; border: 3px solid #111; border-radius: 16px; padding: 1.25rem; box-shadow: 4px 4px 0 #111; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .child-select-label { font-size: 1.1rem; font-weight: 900; color: #111; display: flex; align-items: center; gap: 0.5rem; }
        .child-select { appearance: none; background-color: #fff; border: 3px solid #111; border-radius: 12px; padding: 0.875rem 1.25rem; font-family: 'Nunito', sans-serif; font-size: 1.15rem; font-weight: 900; color: #111; cursor: pointer; box-shadow: 4px 4px 0 #111; background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; transition: transform 0.1s, box-shadow 0.1s; width: 100%; max-width: 400px; }
        .child-select:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #111; }
        .child-select:focus { outline: none; border-color: #FF8F00; }

        .neo-card { background: #fff; border: 3px solid #111; border-radius: 20px; padding: 2rem; box-shadow: 6px 6px 0 #111; margin-bottom: 2rem; position: relative; overflow: hidden; }
        .neo-card-title { font-size: 1.5rem; font-weight: 900; color: #111; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
        
        .alert-box { background: #FFE082; border: 3px solid #111; border-radius: 16px; padding: 1.5rem; display: flex; gap: 1rem; align-items: flex-start; box-shadow: 4px 4px 0 #5d4037; margin-bottom: 2rem; }
        .alert-danger { background: #ffcdd2; box-shadow: 4px 4px 0 #b71c1c; }
        .alert-title { font-weight: 900; font-size: 1.1rem; color: #111; margin-bottom: 0.25rem; }
        .alert-text { font-size: 0.95rem; color: #3e2723; font-weight: 600; }

        .status-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        @media(min-width: 768px) { .status-grid { grid-template-columns: 1.5fr 1fr; } }
        
        .status-box { background: #FFFDE7; border: 2.5px solid #111; border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; justify-content: center; }
        .status-label { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #5d4037; margin-bottom: 0.5rem; }
        .status-value { font-size: 1.5rem; font-weight: 900; color: #111; }

        .chart-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }

        .neo-table-wrapper { border: 3px solid #111; border-radius: 16px; overflow: hidden; box-shadow: 5px 5px 0 #111; }
        .neo-table { width: 100%; border-collapse: collapse; text-align: left; }
        .neo-table th { background: #FFC107; padding: 1rem; font-weight: 900; color: #111; border-bottom: 3px solid #111; border-right: 2px solid #111; }
        .neo-table th:last-child { border-right: none; }
        .neo-table td { background: #fff; padding: 1rem; font-weight: 700; color: #3e2723; border-bottom: 2px solid #111; border-right: 2px solid #111; }
        .neo-table td:last-child { border-right: none; }
        .neo-table tr:last-child td { border-bottom: none; }
        .neo-table tr:hover td { background: #FFFDE7; }
        
        .action-btns { display: flex; gap: 0.5rem; justify-content: center; }
        .btn-mini { padding: 0.4rem 0.8rem; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.85rem; border: 2px solid #111; border-radius: 8px; cursor: pointer; transition: transform 0.1s; }
        .btn-mini:hover { transform: translate(-2px, -2px); }
        .btn-mini-edit { background: #FFFDE7; color: #111; }
        .btn-mini-del { background: #ffcdd2; color: #111; }

        @media print {
          .print-hidden, .neo-nav { display: none !important; }
          .neo-card { box-shadow: none; border: 1px solid #ccc; padding: 1rem; }
          .print-header { display: block !important; text-align: center; margin-bottom: 2rem; }
        }
        .print-header { display: none; }
      `}</style>

      <div className="dash-container">
        
        {/* Header khusus saat dicetak ke PDF */}
        <div className="print-header">
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>Laporan Pemantauan Pertumbuhan Anak</h1>
          <p>Sistem Deteksi Dini Stunting GrowB</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
        </div>

        <div className="dash-header print-hidden">
          <div>
            <h1 className="dash-title">Dashboard 🐝</h1>
            <p className="dash-subtitle">Halo Bunda {profile?.full_name || user?.email}!</p>
          </div>
          <div className="dash-actions">
            <button onClick={() => window.print()} className="btn-neo btn-print">🖨️ Cetak PDF</button>
            <Link href="/nutrition" className="btn-neo btn-ai">✨ Tanya AI Nutrisi</Link>
            <Link href="/add-data" className="btn-neo btn-add">+ Tambah Data</Link>
            <button onClick={handleLogout} className="btn-neo btn-logout">Keluar</button>
          </div>
        </div>

        {/* Tampilkan Notifikasi Reminder Bulanan */}
        {reminders.length > 0 && (
          <div className="print-hidden">
            {reminders.map((msg, idx) => (
              <div key={idx} className="alert-box animate-fade-in">
                <span style={{ fontSize: '2rem' }}>🔔</span>
                <div>
                  <h3 className="alert-title">Waktunya Timbang!</h3>
                  <p className="alert-text">{msg}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHILD SELECTOR DROPDOWN */}
        {children.length > 0 && (
          <div className="child-select-card print-hidden animate-fade-in">
            <label className="child-select-label">
              <span>👶</span> Pilih Anak untuk Dipantau:
            </label>
            <select 
              className="child-select"
              value={selectedChildId || ''}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.full_name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="status-grid">
          {latestStatus && latestStatus.status && (
            <div className="neo-card animate-fade-in" style={{ marginBottom: 0 }}>
              <h2 className="neo-card-title">🩺 Status Gizi Saat Ini</h2>
              
              <div className="status-box" style={{ marginBottom: '1rem', background: '#FFC107' }}>
                <span className="status-label">Kondisi (Z-Score WHO)</span>
                <span className="status-value">{latestStatus.status}</span>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="status-box" style={{ flex: 1 }}>
                  <span className="status-label">TB/U (Tinggi)</span>
                  <span className="status-value" style={{ fontSize: '1.25rem' }}>{latestStatus.zScoreHFA}</span>
                </div>
                <div className="status-box" style={{ flex: 1 }}>
                  <span className="status-label">BB/U (Berat)</span>
                  <span className="status-value" style={{ fontSize: '1.25rem' }}>{latestStatus.zScoreWFA}</span>
                </div>
              </div>

              {(latestStatus.zScoreHFA < -2 || latestStatus.zScoreWFA < -2) && (
                <div className="alert-box alert-danger" style={{ marginTop: '1.5rem', marginBottom: 0, padding: '1rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  <div>
                    <h3 className="alert-title">Peringatan Dini!</h3>
                    <p className="alert-text">Status gizi anak di bawah standar. Segera konsultasikan ke Posyandu atau Dokter Spesialis Anak.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="neo-card" style={{ marginBottom: 0, background: '#FFC107', borderColor: '#111' }}>
            <h2 className="neo-card-title">👤 Info Akun</h2>
            <div className="status-box" style={{ marginBottom: '1rem', background: '#fff' }}>
              <span className="status-label">Email Terdaftar</span>
              <span className="status-value" style={{ fontSize: '1.1rem' }}>{user?.email}</span>
            </div>
            <div className="status-box" style={{ background: '#fff' }}>
              <span className="status-label">Peran</span>
              <span className="status-value" style={{ fontSize: '1.1rem' }}>{profile?.role === 'kader_kesehatan' ? 'Kader Kesehatan' : 'Orang Tua'}</span>
            </div>
          </div>
        </div>

        <div className="neo-card print-visible">
          <div className="chart-header">
            <h2 className="neo-card-title" style={{ marginBottom: 0 }}>📈 Grafik Pertumbuhan</h2>
            
            <div style={{ display: 'none' }} className="print-header">
              <strong style={{ fontSize: '1.25rem' }}>Nama Anak: {children.find(c => c.id === selectedChildId)?.full_name}</strong>
            </div>
          </div>
          
          {children.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFDE7', border: '3px dashed #111', borderRadius: '16px', fontWeight: 800, color: '#5d4037' }}>
              Belum ada profil anak. Silakan klik + Tambah Data. 🍯
            </div>
          ) : (
            <div style={{ background: '#fff', border: '2.5px solid #111', borderRadius: '12px', padding: '1rem' }}>
              <GrowthChart data={chartData} />
            </div>
          )}
        </div>

        {historyRecords.length > 0 && (
          <div className="neo-card print-hidden">
            <h2 className="neo-card-title">📋 Riwayat Pengukuran</h2>
            <div className="neo-table-wrapper">
              <table className="neo-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Usia</th>
                    <th>Berat (kg)</th>
                    <th>Tinggi (cm)</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {historyRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.measurement_date).toLocaleDateString('id-ID')}</td>
                      <td>{formatAge(record.age_in_months)}</td>
                      <td>{record.weight}</td>
                      <td>{record.height}</td>
                      <td>
                        <div className="action-btns">
                          <button onClick={() => router.push(`/add-data?edit=${record.id}&child=${selectedChildId}`)} className="btn-mini btn-mini-edit" title="Edit">✏️</button>
                          <button onClick={() => handleDeleteRecord(record.id)} className="btn-mini btn-mini-del" title="Hapus">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
