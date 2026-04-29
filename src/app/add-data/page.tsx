"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, PlusCircle, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { calculateZScore, determineStuntingStatus, determineWeightStatus } from "@/utils/whoStandards";

export default function AddData() {
  const router = useRouter();
  
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

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      // Ambil daftar anak yang sudah ada
      const { data: childrenData } = await supabase
        .from("children")
        .select("*")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (childrenData && childrenData.length > 0) {
        setExistingChildren(childrenData);
        setIsNewChild(false);
        setSelectedChildId(childrenData[0].id);
      }
    };
    fetchUserData();
  }, [router]);

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
        // 1. Simpan Profil Anak Baru
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
        // Ambil data umur & gender anak lama
        const selectedChild = existingChildren.find(c => c.id === currentChildId);
        if (!selectedChild) throw new Error("Anak tidak ditemukan.");
        
        childGender = selectedChild.gender;
        const birthDate = new Date(selectedChild.date_of_birth);
        const today = new Date();
        ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      }

      ageInMonths = ageInMonths < 0 ? 0 : ageInMonths;

      // Hitung Diagnosis Awal (Z-Score)
      const wZScore = calculateZScore(childGender as "L"|"P", ageInMonths, parseFloat(weight), 'weight');
      const hZScore = calculateZScore(childGender as "L"|"P", ageInMonths, parseFloat(height), 'height');
      
      const stuntingStatus = determineStuntingStatus(hZScore).label;
      const weightStatus = determineWeightStatus(wZScore).label;
      const combinedStatus = `${stuntingStatus} & ${weightStatus}`;

      // 2. Simpan Data Pengukuran beserta Hasil Diagnosis Z-Score
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
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="btn btn-outline border border-gray-300 rounded p-2 hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Input Data Pertumbuhan</h2>
          <p className="text-gray-500">Perbarui data ukur atau tambah profil baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-6">
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        {/* Tab Selection */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setIsNewChild(false)}
            disabled={existingChildren.length === 0}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
              !isNewChild ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700 disabled:opacity-40"
            }`}
          >
            <UserCheck size={16} /> Lanjutkan Pengisian
          </button>
          <button
            type="button"
            onClick={() => setIsNewChild(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${
              isNewChild ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <PlusCircle size={16} /> Tambah Anak Baru
          </button>
        </div>

        {/* Profil Anak Section */}
        {isNewChild ? (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">Profil Anak Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nama Anak</label>
                <input type="text" className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Budi Santoso" value={childName} onChange={(e) => setChildName(e.target.value)} required={isNewChild} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input type="date" className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required={isNewChild} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <select className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white" value={gender} onChange={(e) => setGender(e.target.value)} required={isNewChild}>
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mb-4">Pilih Anak</h3>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Nama Anak yang Akan Diukur</label>
              <select className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 bg-white" value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)} required={!isNewChild}>
                {existingChildren.map(child => (
                  <option key={child.id} value={child.id}>{child.full_name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-700 border-b pb-2 mt-4">Pengukuran Bulan Ini</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Berat Badan (kg)</label>
            <input type="number" step="0.1" className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 7.5" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Tinggi Badan (cm)</label>
            <input type="number" step="0.1" className="rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: 65.0" value={height} onChange={(e) => setHeight(e.target.value)} required />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            <Save size={20} />
            {loading ? "Menyimpan..." : "Simpan Data & Analisis"}
          </button>
        </div>
      </form>
    </div>
  );
}
