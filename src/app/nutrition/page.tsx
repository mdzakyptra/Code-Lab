"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NutritionPage() {
  const router = useRouter();
  
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [latestRecord, setLatestRecord] = useState<any>(null);
  
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");

      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (childrenData && childrenData.length > 0) {
        setChildren(childrenData);
        setSelectedChildId(childrenData[0].id);
      }
      setPageLoading(false);
    };
    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (!selectedChildId) return;

    const fetchLatestRecord = async () => {
      setAiData(null); // Reset AI data saat ganti anak
      
      const { data: growthData } = await supabase
        .from("growth_records")
        .select("*")
        .eq("child_id", selectedChildId)
        .order("age_in_months", { ascending: false })
        .limit(1);

      if (growthData && growthData.length > 0) {
        setLatestRecord(growthData[0]);
      } else {
        setLatestRecord(null);
      }
    };
    fetchLatestRecord();
  }, [selectedChildId]);

  const getRecommendation = async () => {
    if (!latestRecord) return;
    
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age_in_months: latestRecord.age_in_months,
          weight: latestRecord.weight,
          height: latestRecord.height,
          health_status: latestRecord.health_status || "Belum dievaluasi"
        })
      });

      if (!res.ok) throw new Error("Gagal terhubung ke AI server");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiData(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memanggil AI");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito', sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>Memuat lebah madu... 🐝</div>;
  }

  return (
    <>
      <style>{`
        .neo-container { max-width: 1000px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
        
        .neo-header { background: #fff; border: 3px solid #111; border-radius: 20px; padding: 2rem; box-shadow: 6px 6px 0 #111; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
        .neo-title { font-size: 2rem; font-weight: 900; color: #111; line-height: 1.1; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
        .neo-subtitle { font-size: 1rem; color: #5d4037; font-weight: 600; }
        
        .btn-back { padding: 0.6rem 1.25rem; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 0.95rem; text-decoration: none; border: 2.5px solid #111; border-radius: 999px; cursor: pointer; transition: transform 0.1s, box-shadow 0.1s; background: #FFFDE7; color: #111; box-shadow: 3px 3px 0 #111; display: inline-flex; align-items: center; gap: 6px; }
        .btn-back:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 #111; }

        .child-select-card { background: #FFE082; border: 3px solid #111; border-radius: 16px; padding: 1.5rem; box-shadow: 4px 4px 0 #111; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
        .child-select-label { font-size: 1.1rem; font-weight: 900; color: #111; display: flex; align-items: center; gap: 0.5rem; }
        .child-select { appearance: none; background-color: #fff; border: 3px solid #111; border-radius: 12px; padding: 0.875rem 1.25rem; font-family: 'Nunito', sans-serif; font-size: 1.15rem; font-weight: 900; color: #111; cursor: pointer; box-shadow: 4px 4px 0 #111; background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; transition: transform 0.1s, box-shadow 0.1s; width: 100%; max-width: 400px; }
        .child-select:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #111; }
        .child-select:focus { outline: none; border-color: #FF8F00; }

        .neo-card { background: #fff; border: 3px solid #111; border-radius: 20px; padding: 2rem; box-shadow: 6px 6px 0 #111; margin-bottom: 2rem; }
        .neo-card-title { font-size: 1.25rem; font-weight: 900; color: #111; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
        
        .alert-error { background: #ffcdd2; border: 3px solid #b71c1c; border-radius: 12px; padding: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; display: flex; gap: 1rem; align-items: flex-start; box-shadow: 4px 4px 0 #b71c1c; color: #b71c1c; }
        
        .status-box-wrap { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .status-box { background: #FFFDE7; border: 2.5px solid #111; border-radius: 12px; padding: 1rem 1.5rem; flex: 1; min-width: 200px; }
        .status-label { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #5d4037; display: block; margin-bottom: 0.25rem; }
        .status-val { font-size: 1.25rem; font-weight: 900; color: #111; display: block; }
        .status-pill { display: inline-block; background: #fff; border: 2px solid #111; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 1rem; margin-top: 0.25rem; box-shadow: 2px 2px 0 #111; }

        .btn-ai-submit { width: 100%; padding: 1rem 2rem; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 1.15rem; border: 3px solid #111; border-radius: 16px; cursor: pointer; background: #FFC107; color: #111; box-shadow: 4px 4px 0 #111; transition: transform 0.15s, box-shadow 0.15s; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-ai-submit:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #111; background: #FFD54F; }
        .btn-ai-submit:active:not(:disabled) { transform: translate(0, 0); box-shadow: 2px 2px 0 #111; }
        .btn-ai-submit:disabled { opacity: 0.7; cursor: not-allowed; background: #FFE082; box-shadow: 2px 2px 0 #111; transform: translate(2px, 2px); }

        .ai-result-card { background: #FFFDE7; border: 3px solid #111; border-radius: 20px; padding: 2rem; box-shadow: 6px 6px 0 #111; margin-bottom: 2rem; }
        .ai-result-text { font-size: 1.05rem; font-weight: 600; color: #3e2723; line-height: 1.6; white-space: pre-wrap; }

        .targets-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
        @media(min-width: 768px) { .targets-grid { grid-template-columns: repeat(3, 1fr); } }
        .target-box { background: #fff; border: 2.5px solid #111; border-radius: 12px; padding: 1.25rem; text-align: center; box-shadow: 3px 3px 0 #111; }
        .target-box p:first-child { font-size: 0.9rem; font-weight: 800; color: #5d4037; text-transform: uppercase; margin-bottom: 0.5rem; }
        .target-box p:last-child { font-size: 1.5rem; font-weight: 900; color: #111; }

        .menu-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media(min-width: 768px) { .menu-grid { grid-template-columns: repeat(3, 1fr); } }
        .menu-card { background: #fff; border: 3px solid #111; border-radius: 16px; padding: 1.5rem; position: relative; box-shadow: 5px 5px 0 #111; transition: transform 0.2s; }
        .menu-card:hover { transform: translateY(-4px); box-shadow: 5px 9px 0 #111; }
        .menu-time { position: absolute; top: 0; right: 0; background: #FFC107; border-bottom: 3px solid #111; border-left: 3px solid #111; border-top-right-radius: 13px; border-bottom-left-radius: 12px; padding: 0.4rem 0.8rem; font-weight: 900; font-size: 0.85rem; color: #111; }
        .menu-title { font-size: 1.25rem; font-weight: 900; color: #111; margin-top: 0.5rem; margin-bottom: 1rem; padding-right: 3.5rem; }
        .menu-nutrients { display: inline-block; background: #FFFDE7; border: 2px solid #111; border-radius: 8px; padding: 0.4rem 0.75rem; font-size: 0.85rem; font-weight: 800; color: #5d4037; }
      `}</style>

      <div className="neo-container">
        {/* Header */}
        <div className="neo-header">
          <div>
            <h1 className="neo-title">✨ AI Rekomendasi Nutrisi</h1>
            <p className="neo-subtitle">Resep dan panduan makanan khusus sesuai status gizi anak</p>
          </div>
          <Link href="/dashboard" className="btn-back">
            ← Kembali
          </Link>
        </div>

        {/* Child Selector */}
        {children.length > 0 && (
          <div className="child-select-card animate-fade-in">
            <label className="child-select-label">
              <span>👶</span> Pilih Anak:
            </label>
            <select 
              className="child-select"
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>{child.full_name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Content Section */}
        <div className="neo-card">
          {!latestRecord ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#FFFDE7', border: '3px dashed #111', borderRadius: '16px', fontWeight: 800, color: '#5d4037' }}>
              Belum ada data pengukuran untuk anak ini. Silakan kembali ke Dashboard dan tambah data terlebih dahulu. 🍯
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="neo-card-title" style={{ marginBottom: '1.5rem' }}>📊 Profil Anak Saat Ini</h2>
              
              <div className="status-box-wrap">
                <div className="status-box">
                  <span className="status-label">Usia</span>
                  <span className="status-val">
                    {latestRecord.age_in_months >= 12 
                      ? `${Math.floor(latestRecord.age_in_months / 12)} Tahun ${latestRecord.age_in_months % 12 !== 0 ? (latestRecord.age_in_months % 12) + " Bulan" : ""}` 
                      : `${latestRecord.age_in_months} Bulan`}
                  </span>
                </div>
                <div className="status-box" style={{ background: '#FFE082' }}>
                  <span className="status-label">Status Gizi</span>
                  <span className="status-pill">{latestRecord.health_status}</span>
                </div>
              </div>

              <button 
                onClick={getRecommendation}
                disabled={loading}
                className="btn-ai-submit"
              >
                {loading ? "AI Sedang Menganalisis... 🐝" : "✨ Buat Resep dengan AI"}
              </button>

              {error && (
                <div className="alert-error">
                  <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                  <div>
                    <h3 style={{ fontWeight: 900, marginBottom: '0.25rem', color: '#b71c1c' }}>Gagal</h3>
                    <p style={{ fontWeight: 600 }}>{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Result */}
        {aiData && (
          <div className="animate-fade-in">
            <div className="ai-result-card">
              <h2 className="neo-card-title" style={{ fontSize: '1.5rem' }}>💡 Saran Dokter AI</h2>
              <p className="ai-result-text">{aiData.recommendation}</p>
            </div>

            <h2 className="neo-card-title" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>🎯 Target Harian</h2>
            <div className="targets-grid">
              <div className="target-box" style={{ background: '#FFFDE7' }}>
                <p>Kalori</p>
                <p>{aiData.dailyNeeds?.calories || "-"}</p>
              </div>
              <div className="target-box" style={{ background: '#e8f5e9' }}>
                <p>Protein</p>
                <p>{aiData.dailyNeeds?.protein || "-"}</p>
              </div>
              <div className="target-box" style={{ background: '#ffebee' }}>
                <p>Zat Besi</p>
                <p>{aiData.dailyNeeds?.iron || "-"}</p>
              </div>
            </div>

            <h2 className="neo-card-title" style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>🍽️ Contoh Menu Harian</h2>
            <div className="menu-grid">
              {aiData.menu?.map((m: any, i: number) => (
                <div key={i} className="menu-card">
                  <div className="menu-time">{m.time}</div>
                  <h4 className="menu-title">{m.meal}</h4>
                  <div className="menu-nutrients">
                    Kaya akan: {m.nutrients}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
