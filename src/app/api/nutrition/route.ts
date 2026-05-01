import { NextResponse, NextRequest } from 'next/server';
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { age_in_months, weight, height, health_status, messages = [] } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY tidak ditemukan di .env.local' }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const prompt = `Anda adalah dokter spesialis gizi anak di Indonesia. 
Berikan rekomendasi menu makanan untuk anak usia ${age_in_months} bulan.
Berat badannya ${weight} kg dan tingginya ${height} cm.
Status gizinya: "${health_status}".

Jawab HANYA dalam format JSON tanpa markdown, tanpa penjelasan tambahan:
{
  "recommendation": "saran singkat dan ramah untuk orang tua",
  "menu": [
    { "time": "Pagi", "meal": "nama makanan", "nutrients": "kandungan gizi utama" },
    { "time": "Siang", "meal": "nama makanan", "nutrients": "kandungan gizi utama" },
    { "time": "Malam", "meal": "nama makanan", "nutrients": "kandungan gizi utama" }
  ],
  "dailyNeeds": {
    "calories": "target kalori",
    "protein": "target protein",
    "iron": "target zat besi"
  }
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: prompt },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
      stream: false,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Gagal mendapatkan respons dari AI");
    }

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(content);
    } catch (e) {
      console.warn("Format respons AI tidak valid:", content);
      return NextResponse.json({ error: 'Format respons AI tidak valid' }, { status: 500 });
    }

    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error('Nutrition API Error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Gagal mendapatkan rekomendasi AI' }, { status: 500 });
  }
}
