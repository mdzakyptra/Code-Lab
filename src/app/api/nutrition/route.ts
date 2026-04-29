import { NextResponse } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age_in_months, weight, height, health_status } = body;

    const apiKey = process.env.GROQ_API_KEY;

    // Jika user belum setup API key, berikan jawaban dummy simulasi AI
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return NextResponse.json({
        recommendation: `Data simulasi (Tambahkan GROQ_API_KEY di .env.local untuk AI asli): Untuk anak usia ${age_in_months} bulan dengan status ${health_status}, fokus pada protein hewani dan zat besi.`,
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

    // Call real Groq API
    const groq = new Groq({ apiKey });
    
    const prompt = `
      Anda adalah dokter spesialis gizi anak. 
      Tolong berikan rekomendasi menu makanan untuk anak usia ${age_in_months} bulan.
      Saat ini berat badannya ${weight} kg dan tingginya ${height} cm.
      Status gizinya saat ini adalah: "${health_status}".
      
      Harap kembalikan respon HANYA dalam format JSON (json_object) dengan struktur persis seperti berikut tanpa markdown tambahan:
      {
        "recommendation": "Teks saran edukatif dan ramah singkat untuk orang tua",
        "menu": [
          { "time": "Pagi", "meal": "Nama Makanan Lengkap", "nutrients": "Kandungan gizi utamanya" },
          { "time": "Siang", "meal": "Nama Makanan Lengkap", "nutrients": "Kandungan gizi utamanya" },
          { "time": "Malam", "meal": "Nama Makanan Lengkap", "nutrients": "Kandungan gizi utamanya" }
        ],
        "dailyNeeds": {
          "calories": "Target kalori harian (contoh: 800 kkal)",
          "protein": "Target protein",
          "iron": "Target zat besi"
        }
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192", // Llama 3 70B sangat cerdas dan cepat di Groq
      response_format: { type: "json_object" }, // Memaksa model me-return strict JSON
    });

    const text = chatCompletion.choices[0]?.message?.content || '{}';
    
    // Parse JSON
    const cleanJson = text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
    const result = JSON.parse(cleanJson);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: 'Gagal mendapatkan rekomendasi dari Groq AI' }, { status: 500 });
  }
}
