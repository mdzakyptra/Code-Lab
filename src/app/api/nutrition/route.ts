import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age_in_months, weight, height, health_status } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Jika user belum setup API key, berikan jawaban dummy simulasi AI
    if (!apiKey) {
      // Delay to simulate AI thinking
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        recommendation: `Data simulasi (Tambahkan GEMINI_API_KEY di .env.local untuk AI asli): Untuk anak usia ${age_in_months} bulan dengan status ${health_status}, fokus pada protein hewani dan zat besi.`,
        menu: [
          { time: "Pagi", meal: "Bubur Sup Daging Cincang + Wortel", nutrients: "Protein tinggi, Vitamin A" },
          { time: "Siang", meal: "Nasi Tim Hati Ayam + Brokoli", nutrients: "Zat besi, Folat" },
          { time: "Malam", meal: "Mashed Potato + Ikan Salmon", nutrients: "Omega-3, Karbohidrat" }
        ],
        dailyNeeds: {
          calories: "800 - 900 kkal",
          protein: "15 - 20 gram",
          iron: "7 - 10 mg"
        }
      });
    }

    // Call real Gemini API
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const prompt = `
      Anda adalah dokter spesialis gizi anak. 
      Tolong berikan rekomendasi menu makanan untuk anak usia ${age_in_months} bulan.
      Saat ini berat badannya ${weight} kg dan tingginya ${height} cm.
      Status gizinya saat ini adalah: "${health_status}".
      
      Harap kembalikan respon HANYA dalam format JSON dengan struktur persis seperti berikut tanpa markdown tambahan:
      {
        "recommendation": "Teks saran singkat untuk orang tua",
        "menu": [
          { "time": "Pagi", "meal": "Nama Makanan", "nutrients": "Kandungan gizi utamanya" },
          { "time": "Siang", "meal": "Nama Makanan", "nutrients": "Kandungan gizi utamanya" },
          { "time": "Malam", "meal": "Nama Makanan", "nutrients": "Kandungan gizi utamanya" }
        ],
        "dailyNeeds": {
          "calories": "Target kalori harian",
          "protein": "Target protein",
          "iron": "Target zat besi"
        }
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    const text = response.text;
    
    // Parse JSON
    // Remove markdown code blocks if any
    const cleanJson = text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Gagal mendapatkan rekomendasi AI' }, { status: 500 });
  }
}
