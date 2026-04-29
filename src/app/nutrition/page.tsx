"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Utensils, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function NutritionPage() {
  const router = useRouter();
  
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [latestRecord, setLatestRecord] = useState<any>(null);
  
  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="btn btn-outline bg-white border border-gray-300 rounded p-2 hover:bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-amber-500" /> AI Rekomendasi Nutrisi
            </h1>
            <p className="text-gray-500 text-sm">Resep dan panduan makanan khusus sesuai status gizi anak</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="font-semibold text-gray-800">Pilih Anak</h2>
            {children.length > 0 && (
              <select 
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white min-w-[200px]"
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>{child.full_name}</option>
                ))}
              </select>
            )}
          </div>

          {!latestRecord ? (
            <div className="text-center p-6 bg-gray-50 rounded-lg text-gray-500 text-sm border border-dashed">
              Belum ada data pengukuran anak ini. Silakan kembali ke Dashboard dan tambah data terlebih dahulu.
            </div>
          ) : (
            <div className="bg-indigo-50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-indigo-900">
                <p>Usia: <strong>{latestRecord.age_in_months >= 12 ? `${Math.floor(latestRecord.age_in_months / 12)} Tahun ${latestRecord.age_in_months % 12 !== 0 ? (latestRecord.age_in_months % 12) + " Bulan" : ""}` : `${latestRecord.age_in_months} Bulan`}</strong></p>
                <p>Status Saat Ini: <strong className="bg-white px-2 py-1 rounded ml-1 border">{latestRecord.health_status}</strong></p>
              </div>
              <button 
                onClick={getRecommendation}
                disabled={loading}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
              >
                {loading ? "AI Sedang Berpikir..." : <><Sparkles size={18} /> Buat Resep dengan AI</>}
              </button>
            </div>
          )}
          {error && <p className="mt-4 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={16}/> {error}</p>}
        </div>

        {/* Hasil AI */}
        {aiData && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 border-l-4 border-l-amber-500">
              <h3 className="font-bold text-gray-800 mb-2">💡 Saran Dokter AI</h3>
              <p className="text-gray-600 leading-relaxed">{aiData.recommendation}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                <p className="text-sm text-gray-500">Target Kalori Harian</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">{aiData.dailyNeeds?.calories || "-"}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                <p className="text-sm text-gray-500">Target Protein</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{aiData.dailyNeeds?.protein || "-"}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
                <p className="text-sm text-gray-500">Target Zat Besi</p>
                <p className="text-xl font-bold text-rose-600 mt-1">{aiData.dailyNeeds?.iron || "-"}</p>
              </div>
            </div>

            <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2 mt-8 mb-4">
              <Utensils className="text-gray-500" /> Contoh Menu Harian
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiData.menu?.map((m: any, i: number) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {m.time}
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg mt-3 mb-2 pr-10">{m.meal}</h4>
                  <div className="inline-block bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded border border-emerald-100">
                    Kaya akan: {m.nutrients}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
