"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { calculateZScore, determineStuntingStatus, determineWeightStatus } from "@/utils/whoStandards";

function AddDataForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const childIdParam = searchParams.get("child");

  // State user & children
  const [userId, setUserId] = useState<string | null>(null);
  const [existingChildren, setExistingChildren] = useState<any[]>([]);
  const [isNewChild, setIsNewChild] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState("");

  // State form profil anak baru
  const [childName, setChildName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // State form pengukuran
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (childrenData && childrenData.length > 0) {
        setExistingChildren(childrenData);
        setIsNewChild(false);

        if (childIdParam) {
          setSelectedChildId(childIdParam);
        } else {
          setSelectedChildId(childrenData[0].id);
        }
      }

      // Jika mode edit, ambil data pengukuran
      if (editId) {
        setIsNewChild(false);
        const { data: recordData } = await supabase
          .from("growth_records")
          .select("*")
          .eq("id", editId)
          .single();

        if (recordData) {
          setWeight(recordData.weight.toString());
          setHeight(recordData.height.toString());
        }
      }

      setPageLoading(false);
    };
    fetchUserData();
  }, [router, editId, childIdParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!userId) throw new Error("Sesi tidak valid.");

      let currentChildId = selectedChildId;
      let ageInMonths = 0;
      let childGender = gender;

      if (isNewChild) {
        const { data: childData, error: childError } = await supabase
          .from("children")
          .insert({
            parent_id: userId,
            full_name: childName,
            date_of_birth: dateOfBirth,
            gender: gender,
          })
          .select()
          .single();

        if (childError) throw childError;
        currentChildId = childData.id;

        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      } else {
        const selectedChild = existingChildren.find(c => c.id === currentChildId);
        if (!selectedChild) throw new Error("Anak tidak ditemukan.");

        childGender = selectedChild.gender;
        const birthDate = new Date(selectedChild.date_of_birth);

        if (editId) {
          // Jika edit, hitung umur berdasarkan tanggal pengukuran asli jika memungkinkan
          // Tapi untuk amannya kita pakai today()
          const today = new Date();
          ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        } else {
          const today = new Date();
          ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        }
      }

      ageInMonths = ageInMonths < 0 ? 0 : ageInMonths;

      const wZScore = calculateZScore(childGender as "L" | "P", ageInMonths, parseFloat(weight), 'weight');
      const hZScore = calculateZScore(childGender as "L" | "P", ageInMonths, parseFloat(height), 'height');

      const stuntingStatus = determineStuntingStatus(hZScore).label;
      const weightStatus = determineWeightStatus(wZScore).label;
      const combinedStatus = `${stuntingStatus} & ${weightStatus}`;

      if (editId) {
        const { error: updateError } = await supabase
          .from("growth_records")
          .update({
            weight: parseFloat(weight),
            height: parseFloat(height),
            z_score_wfa: wZScore,
            z_score_hfa: hZScore,
            health_status: combinedStatus,
            age_in_months: ageInMonths // Update umur juga
          })
          .eq("id", editId);

        if (updateError) throw updateError;
        alert("Data berhasil diperbarui!");
      } else {
        const { error: growthError } = await supabase
          .from("growth_records")
          .insert({
            child_id: currentChildId,
            measurement_date: new Date().toISOString().split('T')[0],
            age_in_months: ageInMonths,
            weight: parseFloat(weight),
            height: parseFloat(height),
            z_score_wfa: wZScore,
            z_score_hfa: hZScore,
            health_status: combinedStatus
          });

        if (growthError) throw growthError;
        alert("Data berhasil disimpan!");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>Memuat lebah madu... 🐝</div>;
  }

  return (
    <>
      <style>{`
        .neo-container { max-width: 800px; margin: 0 auto; font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 4rem; }

        .neo-header { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 1.25rem; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; }
        @media(min-width: 640px) { .neo-header { border-radius: 20px; padding: 2rem; margin-bottom: 2rem; align-items: center; } }
        .neo-title { font-size: 1.4rem; font-weight: 900; color: #111; line-height: 1.1; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
        @media(min-width: 640px) { .neo-title { font-size: 2rem; } }
        .neo-subtitle { font-size: 0.875rem; color: #5d4037; font-weight: 600; }
        @media(min-width: 640px) { .neo-subtitle { font-size: 1rem; } }

        .btn-back { padding: 0.5rem 1rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.875rem; text-decoration: none; border: 1.5px solid #d1d5db; border-radius: 999px; cursor: pointer; transition: background 0.2s, box-shadow 0.2s; background: #FFFDE7; color: #111; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
        .btn-back:hover { background: #FFF8E1; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

        .alert-error { background: #fff1f2; border: 1.5px solid #fca5a5; border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; display: flex; gap: 0.75rem; align-items: flex-start; box-shadow: 0 2px 8px rgba(239,68,68,0.1); color: #b71c1c; }
        .alert-error-title { font-weight: 900; font-size: 1rem; margin-bottom: 0.25rem; }

        .neo-card { background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px; padding: 1.25rem; box-shadow: 0 2px 12px rgba(0,0,0,0.07); margin-bottom: 1.25rem; }
        @media(min-width: 640px) { .neo-card { border-radius: 20px; padding: 2rem; margin-bottom: 2rem; } }
        .neo-card-title { font-size: 1.05rem; font-weight: 900; color: #111; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.4rem; }
        @media(min-width: 640px) { .neo-card-title { font-size: 1.25rem; } }
        .neo-card-desc { font-size: 0.85rem; color: #5d4037; font-weight: 600; margin-bottom: 1.25rem; }
        @media(min-width: 640px) { .neo-card-desc { font-size: 0.95rem; margin-bottom: 1.5rem; } }

        .neo-tabs { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .neo-tab { flex: 1; min-width: 130px; padding: 0.75rem 0.5rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 0.875rem; border: 1.5px solid #e5e7eb; border-radius: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.4rem; background: #FFFDE7; color: #5d4037; }
        @media(min-width: 640px) { .neo-tab { font-size: 1rem; padding: 1rem; min-width: 180px; } }
        .neo-tab:hover:not(:disabled) { background: #FFF8E1; border-color: #d1d5db; }
        .neo-tab.active { background: #FFC107; color: #111; border-color: #FFC107; box-shadow: 0 2px 8px rgba(255,193,7,0.3); }
        .neo-tab:disabled { opacity: 0.5; cursor: not-allowed; }

        .badge-count { background: #111; color: #FFC107; padding: 2px 7px; border-radius: 999px; font-size: 0.7rem; font-weight: 900; }

        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media(min-width: 640px) { .form-grid { grid-template-columns: 1fr 1fr; gap: 1.25rem; } .col-span-2 { grid-column: span 2; } }

        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .neo-label { font-size: 0.875rem; font-weight: 800; color: #111; }
        @media(min-width: 640px) { .neo-label { font-size: 0.95rem; } }

        .neo-input { width: 100%; border: 1.5px solid #d1d5db; border-radius: 12px; padding: 0.75rem 1rem; font-size: 1rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: #111; background: #fff; transition: border-color 0.2s, box-shadow 0.2s; outline: none; }
        .neo-input:focus { border-color: #FFC107; box-shadow: 0 0 0 3px rgba(255,193,7,0.15); }
        .neo-input::placeholder { color: #9e9e9e; font-weight: 600; }

        .neo-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem; }

        .input-wrapper { position: relative; }
        .input-addon { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); font-size: 0.85rem; font-weight: 900; color: #5d4037; }

        .info-box { background: #FFF8E1; border: 1.5px solid #FFC107; border-radius: 12px; padding: 1rem; display: flex; gap: 0.75rem; align-items: flex-start; margin-top: 1.25rem; }
        @media(min-width: 640px) { .info-box { padding: 1.25rem; gap: 1rem; margin-top: 1.5rem; } }
        .info-box p { font-size: 0.85rem; font-weight: 700; color: #3e2723; margin: 0; }
        @media(min-width: 640px) { .info-box p { font-size: 0.9rem; } }

        .form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; justify-content: flex-end; flex-wrap: wrap; }
        .btn-cancel { padding: 0.75rem 1.5rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 900; font-size: 0.95rem; border: 1.5px solid #d1d5db; border-radius: 999px; cursor: pointer; background: #FFFDE7; color: #111; text-decoration: none; transition: background 0.2s; }
        @media(min-width: 640px) { .btn-cancel { padding: 0.875rem 2rem; font-size: 1.05rem; } }
        .btn-cancel:hover { background: #FFF8E1; }

        .btn-submit { padding: 0.75rem 1.75rem; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 900; font-size: 0.95rem; border: none; border-radius: 999px; cursor: pointer; background: #111; color: #FFC107; box-shadow: 0 4px 14px rgba(0,0,0,0.2); transition: box-shadow 0.2s, background 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        @media(min-width: 640px) { .btn-submit { padding: 0.875rem 2.5rem; font-size: 1.05rem; } }
        .btn-submit:hover:not(:disabled) { background: #2a2a2a; box-shadow: 0 6px 20px rgba(0,0,0,0.28); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }
      `}</style>

      <div className="neo-container">
        {/* Header */}
        <div className="neo-header">
          <div>
            <h1 className="neo-title"><img src="/accountant.png" alt="" width={28} height={28} /> Input Data</h1>
            <p className="neo-subtitle">Perbarui data ukur atau tambahkan profil anak</p>
          </div>
          <Link href="/dashboard" className="btn-back">
            ← Kembali
          </Link>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="alert-error animate-fade-in">
            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
            <div>
              <h3 className="alert-error-title">Terjadi Kesalahan</h3>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Tab Selection */}
          <div className="neo-card">
            <h2 className="neo-card-title">Pilih Mode Input</h2>
            <div className="neo-tabs" style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setIsNewChild(false)}
                disabled={existingChildren.length === 0}
                className={`neo-tab ${!isNewChild ? 'active' : ''}`}
              >
                <img src="/good-choice.png" alt="" width={20} height={20} style={{display:'inline',verticalAlign:'middle'}} /> Lanjutkan Pengisian
                {existingChildren.length > 0 && (
                  <span className="badge-count">{existingChildren.length}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsNewChild(true)}
                className={`neo-tab ${isNewChild ? 'active' : ''}`}
              >
                <img src="/kid.png" alt="" width={20} height={20} style={{display:'inline',verticalAlign:'middle'}} /> Tambah Anak Baru
              </button>
            </div>
          </div>

          {/* Profil Anak Section */}
          <div className="neo-card animate-fade-in">
            {isNewChild ? (
              <>
                <h2 className="neo-card-title"><img src="/graphics.png" alt="" width={22} height={22} /> Profil Anak Baru</h2>
                <p className="neo-card-desc">Isi data lengkap anak yang akan dipantau pertumbuhannya</p>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label className="neo-label">Nama Lengkap Anak</label>
                    <input
                      type="text"
                      className="neo-input"
                      placeholder="Contoh: Budi Santoso"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      required={isNewChild}
                    />
                  </div>
                  <div className="form-group">
                    <label className="neo-label">Tanggal Lahir</label>
                    <input
                      type="date"
                      className="neo-input"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required={isNewChild}
                    />
                  </div>
                  <div className="form-group">
                    <label className="neo-label">Jenis Kelamin</label>
                    <select
                      className="neo-input neo-select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required={isNewChild}
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="neo-card-title"><img src="/kid.png" alt="" width={22} height={22} /> Pilih Anak</h2>
                <p className="neo-card-desc">Pilih anak yang akan dicatat pengukurannya</p>
                <div className="form-group">
                  <label className="neo-label">Nama Anak yang Akan Diukur</label>
                  <select
                    className="neo-input neo-select"
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    required={!isNewChild}
                  >
                    {existingChildren.map(child => (
                      <option key={child.id} value={child.id}>{child.full_name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Pengukuran Section */}
          <div className="neo-card">
            <h2 className="neo-card-title">Data Pengukuran</h2>
            <p className="neo-card-desc">Masukkan hasil pengukuran tubuh anak saat ini</p>
            <div className="form-grid">
              <div className="form-group">
                <label className="neo-label">Berat Badan (kg)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="neo-input"
                    placeholder="Contoh: 7.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                  />
                  <span className="input-addon">kg</span>
                </div>
              </div>
              <div className="form-group">
                <label className="neo-label">Tinggi Badan (cm)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="neo-input"
                    placeholder="Contoh: 65.0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                  />
                  <span className="input-addon">cm</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <img src="/idea.png" alt="" width={28} height={28} style={{flexShrink:0}} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#111' }}>Tips Pengukuran</strong>
                <p>Ukur berat dan tinggi badan anak di pagi hari sebelum makan untuk hasil yang akurat. Gunakan timbangan dan alat ukur standar!</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <Link href="/dashboard" className="btn-cancel">
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-submit"
            >
              {loading ? 'Menyimpan... 🐝' : 'Simpan Data & Analisis'}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}

export default function AddData() {
  return (
    <Suspense fallback={<div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.2rem", fontWeight: 800 }}>Memuat lebah madu... 🐝</div>}>
      <AddDataForm />
    </Suspense>
  );
}
