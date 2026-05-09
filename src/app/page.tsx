"use client";
import Link from "next/link";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');
        .hp*{box-sizing:border-box;margin:0;padding:0;}
        .hp{font-family:'Nunito',sans-serif;background:#FFFDE7;overflow-x:hidden;}

        /* NAV */
        .hp-nav{position:sticky;top:0;z-index:100;background:#FFC107;border-bottom:3px solid #111;padding:.875rem 2rem;display:flex;align-items:center;justify-content:space-between;}
        .hp-logo{font-size:1.625rem;font-weight:900;color:#111;text-decoration:none;display:flex;align-items:center;gap:8px;}
        .hp-links{display:flex;align-items:center;gap:1.5rem;}
        .hp-links a{font-size:.9375rem;font-weight:700;color:#111;text-decoration:none;}
        .hp-links a:hover{text-decoration:underline;}
        .hp-cta-nav{background:#111;color:#FFC107;padding:.6rem 1.5rem;border-radius:999px;font-weight:800;font-size:.9375rem;text-decoration:none;border:2.5px solid #111;box-shadow:3px 3px 0 #5d4037;transition:transform .15s,box-shadow .15s;display:inline-block;}
        .hp-cta-nav:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #5d4037;}

        /* HERO */
        .hp-hero{background:#FFC107;position:relative;overflow:hidden;min-height:88vh;display:flex;align-items:center;padding:4rem 2rem 2rem;border-bottom:4px solid #111;}
        .hp-hero-content{position:relative;z-index:2;max-width:560px;}
        .hp-badge{display:inline-block;background:#111;color:#FFC107;border-radius:999px;padding:5px 18px;font-size:.75rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1.5rem;box-shadow:3px 3px 0 #5d4037;animation:bobBadge 2.2s ease-in-out infinite;}
        @keyframes bobBadge{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .hp-hero h1{font-size:clamp(2.75rem,6vw,4.5rem);font-weight:900;color:#111;line-height:1.05;letter-spacing:-.02em;margin-bottom:1.25rem;}
        .hp-hero h1 em{font-style:normal;color:#fff;text-shadow:2px 2px 0 #111;}
        .hp-hero p{font-size:1.1rem;color:#4a3000;line-height:1.7;margin-bottom:2rem;max-width:440px;}
        .btn-y{background:#111;color:#FFC107;padding:.875rem 2rem;border-radius:999px;font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;text-decoration:none;border:2.5px solid #111;box-shadow:4px 4px 0 #5d4037;transition:transform .15s,box-shadow .15s;display:inline-flex;align-items:center;gap:6px;}
        .btn-y:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #5d4037;}
        .btn-w{background:#fff;color:#111;padding:.875rem 2rem;border-radius:999px;font-family:'Nunito',sans-serif;font-weight:800;font-size:1rem;text-decoration:none;border:2.5px solid #111;box-shadow:4px 4px 0 #5d4037;transition:transform .15s,box-shadow .15s;display:inline-flex;align-items:center;gap:6px;}
        .btn-w:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #5d4037;}
        .hp-hero-btns{display:flex;gap:1rem;flex-wrap:wrap;}

        /* Honeycomb bg */
        .hive-bg{position:absolute;inset:0;opacity:.12;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32z' fill='none' stroke='%23111' stroke-width='2'/%3E%3Cpath d='M28 100L0 84V52l28-16 28 16v32z' fill='none' stroke='%23111' stroke-width='2'/%3E%3Cpath d='M56 66L28 50V18L56 2' fill='none' stroke='%23111' stroke-width='2'/%3E%3C/svg%3E");pointer-events:none;}

        /* STATS */
        .hp-stats{background:#FFE082;border-top:3px solid #111;border-bottom:3px solid #111;padding:1.25rem 2rem;display:flex;align-items:center;justify-content:center;gap:3rem;flex-wrap:wrap;}
        .hp-stat-num{font-size:1.875rem;font-weight:900;color:#111;}
        .hp-stat-label{font-size:.8125rem;font-weight:600;color:#5d4037;}

        /* FEATURES */
        .hp-features{background:#FFFDE7;border-bottom:3px solid #111;}
        .hp-fhead{text-align:center;padding:4rem 2rem 2rem;}
        .hp-tag{display:inline-block;background:#111;color:#FFC107;padding:4px 14px;border-radius:999px;font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem;}
        .hp-fhead h2{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;color:#111;letter-spacing:-.03em;line-height:1.15;margin-bottom:.75rem;}
        .hp-fhead p{color:#6d4c00;font-size:1rem;max-width:460px;margin:0 auto;line-height:1.65;}

        .feat-stack .scroll-stack-card{height:auto;min-height:19rem;border:3px solid #111!important;border-radius:28px!important;display:flex;flex-direction:column;justify-content:space-between;box-shadow:6px 6px 0 #111!important;}

        .fc-tag{display:inline-flex;align-items:center;padding:3px 12px;border-radius:999px;background:rgba(0,0,0,.15);border:1.5px solid rgba(0,0,0,.25);font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#111;width:fit-content;margin-bottom:1rem;}
        .fc-icon{font-size:2.75rem;line-height:1;margin-bottom:.75rem;}
        .fc-title{font-size:1.625rem;font-weight:900;color:#111;letter-spacing:-.02em;line-height:1.15;margin-bottom:.75rem;}
        .fc-desc{font-size:.9375rem;color:#111;line-height:1.65;flex:1;opacity:.85;}
        .fc-dots{display:flex;gap:6px;margin-top:1.5rem;}
        .fc-dot{width:10px;height:10px;border-radius:50%;background:rgba(0,0,0,.2);border:1.5px solid rgba(0,0,0,.3);}
        .fc-dot.on{background:#111;}
        .cc1{background:#FFC107!important;}
        .cc2{background:#FFD54F!important;}
        .cc3{background:#FFB300!important;}
        .cc4{background:#FF8F00!important;}

        /* CTA */
        .hp-cta{background:#111;padding:5rem 2rem;text-align:center;position:relative;overflow:hidden;}
        .hp-cta h2{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;color:#FFC107;letter-spacing:-.02em;margin-bottom:1rem;}
        .hp-cta p{color:rgba(255,255,255,.75);font-size:1rem;max-width:460px;margin:0 auto 2rem;line-height:1.65;}
        .btn-cta{background:#FFC107;color:#111;padding:1rem 2.5rem;border-radius:999px;font-family:'Nunito',sans-serif;font-weight:900;font-size:1.0625rem;text-decoration:none;border:2.5px solid #FFC107;box-shadow:5px 5px 0 #FF8F00;transition:transform .15s,box-shadow .15s;display:inline-flex;align-items:center;gap:8px;}
        .btn-cta:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 #FF8F00;}

        /* FOOTER */
        .hp-footer{background:#111;border-top:3px solid #FFC107;color:rgba(255,255,255,.45);padding:2rem;text-align:center;font-size:.8125rem;}
        .hp-footer strong{color:#FFC107;}
      `}</style>

      <div className="hp">
        {/* NAV */}
        <nav className="hp-nav">
          <Link href="/" className="hp-logo">🐝 GrowB</Link>
          <div className="hp-links">
            <a href="/dashboard">Dashboard</a>
            <a href="/add-data">Input Data</a>
            <a href="/nutrition">Nutrisi</a>
            <Link href="/register" className="hp-cta-nav">Daftar Gratis</Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="hp-hero">
          <div className="hive-bg"/>
          <div className="hp-hero-content">
            <div className="hp-badge">🏥 Berbasis Standar WHO 2024</div>
            <h1>Pantau Tumbuh<br/>Kembang Si Kecil,<br/><em>Lebih Mudah!</em></h1>
            <p>Platform cerdas deteksi dini stunting & pemantauan gizi anak. Seperti lebah yang rajin menjaga sarangnya, kami menjaga pertumbuhan si buah hati 🐝</p>
            <div className="hp-hero-btns">
              <Link href="/register" className="btn-y">Mulai Sekarang 🚀</Link>
              <Link href="/login" className="btn-w">Sudah Punya Akun</Link>
            </div>
          </div>

          {/* Bee SVG art */}
          <svg style={{position:"absolute",right:"5%",bottom:"5%",width:"420px",height:"420px",zIndex:2,pointerEvents:"none"}} viewBox="0 0 420 420">
            {/* Honeycomb cells */}
            {[[210,80],[160,108],[260,108],[135,150],[210,150],[285,150],[160,192],[260,192]].map(([cx,cy],i)=>(
              <polygon key={i} points={`${cx},${cy-28} ${cx+24},${cy-14} ${cx+24},${cy+14} ${cx},${cy+28} ${cx-24},${cy+14} ${cx-24},${cy-14}`} fill={i%2===0?"#FFD54F":"#FFC107"} stroke="#111" strokeWidth="2"/>
            ))}
            {/* Big bee body */}
            <ellipse cx="210" cy="300" rx="55" ry="75" fill="#FFC107" stroke="#111" strokeWidth="3"/>
            <rect x="155" y="260" width="110" height="20" rx="10" fill="#111"/>
            <rect x="155" y="300" width="110" height="20" rx="10" fill="#111"/>
            <rect x="155" y="340" width="110" height="18" rx="9" fill="#111"/>
            {/* Wings */}
            <ellipse cx="155" cy="275" rx="48" ry="28" fill="rgba(255,255,255,0.7)" stroke="#111" strokeWidth="2" transform="rotate(-20 155 275)"/>
            <ellipse cx="265" cy="275" rx="48" ry="28" fill="rgba(255,255,255,0.7)" stroke="#111" strokeWidth="2" transform="rotate(20 265 275)"/>
            {/* Head */}
            <circle cx="210" cy="225" r="38" fill="#FFC107" stroke="#111" strokeWidth="3"/>
            <circle cx="196" cy="218" r="8" fill="#111"/>
            <circle cx="224" cy="218" r="8" fill="#111"/>
            <circle cx="198" cy="216" r="3" fill="#fff"/>
            <circle cx="226" cy="216" r="3" fill="#fff"/>
            <path d="M196 235 Q210 246 224 235" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Antennae */}
            <line x1="200" y1="188" x2="185" y2="165" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="185" cy="163" r="5" fill="#111"/>
            <line x1="220" y1="188" x2="235" y2="165" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="235" cy="163" r="5" fill="#111"/>
            {/* Stinger */}
            <polygon points="210,375 204,395 216,395" fill="#FF8F00" stroke="#111" strokeWidth="2"/>
          </svg>

          {/* Honey drip border */}
          <svg style={{position:"absolute",bottom:-2,left:0,right:0,width:"100%",pointerEvents:"none"}} viewBox="0 0 1440 60" preserveAspectRatio="none">
            {[...Array(20)].map((_,i)=>(
              <ellipse key={i} cx={36*i+18} cy={20+Math.sin(i*1.3)*12} rx="14" ry={18+Math.sin(i*0.9)*6} fill="#FFA000"/>
            ))}
            <rect x="0" y="30" width="1440" height="30" fill="#FFA000"/>
          </svg>
        </section>

        {/* STATS */}
        <div className="hp-stats">
          {[
            {num:"Z-Score",label:"Standar WHO"},
            {num:"4 Fitur",label:"Lengkap & Gratis"},
            {num:"AI 🤖",label:"Rekomendasi Gizi"},
            {num:"Real-time",label:"Pantau Pertumbuhan"},
          ].map(s=>(
            <div key={s.num} style={{textAlign:"center"}}>
              <div className="hp-stat-num">{s.num}</div>
              <div className="hp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="hp-features">
          <div className="hp-fhead">
            <div className="hp-tag">🍯 Fitur Unggulan</div>
            <h2>Semua yang kamu butuhkan,<br/>ada di sini! 🐝</h2>
            <p>Scroll ke bawah dan lihat semua fitur manis GrowB 👇</p>
          </div>
          <ScrollStack className="feat-stack" itemDistance={100} itemScale={0.035} itemStackDistance={20} stackPosition="12%" scaleEndPosition="6%" baseScale={0.9} rotationAmount={1} useWindowScroll={true}>
            <ScrollStackItem itemClassName="cc1">
              <div><div className="fc-tag">🎯 WHO Standard</div><div className="fc-icon">🎯</div><div className="fc-title">Deteksi Dini Stunting</div><div className="fc-desc">Sistem hitung Z-Score otomatis standar WHO untuk deteksi risiko stunting. Akurat dan cepat seperti lebah yang sigap!</div></div>
              <div className="fc-dots"><div className="fc-dot on"/><div className="fc-dot"/><div className="fc-dot"/><div className="fc-dot"/></div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="cc2">
              <div><div className="fc-tag">📈 Real-time</div><div className="fc-icon">📈</div><div className="fc-title">Grafik Pertumbuhan</div><div className="fc-desc">Pantau tinggi & berat badan si kecil bulan per bulan dengan grafik interaktif lengkap kurva persentil WHO.</div></div>
              <div className="fc-dots"><div className="fc-dot"/><div className="fc-dot on"/><div className="fc-dot"/><div className="fc-dot"/></div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="cc3">
              <div><div className="fc-tag">🤖 AI-Powered</div><div className="fc-icon">🤖</div><div className="fc-title">Rekomendasi Nutrisi AI</div><div className="fc-desc">Menu makan harian + target kalori & protein dipersonalisasi AI — semanis madu untuk tumbuh kembang si kecil!</div></div>
              <div className="fc-dots"><div className="fc-dot"/><div className="fc-dot"/><div className="fc-dot on"/><div className="fc-dot"/></div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="cc4">
              <div><div className="fc-tag">📋 Ekspor PDF</div><div className="fc-icon">📋</div><div className="fc-title">Laporan Lengkap</div><div className="fc-desc">Generate laporan pertumbuhan anak PDF profesional — siap dibagikan ke dokter atau kader Posyandu. Manis dan berguna!</div></div>
              <div className="fc-dots"><div className="fc-dot"/><div className="fc-dot"/><div className="fc-dot"/><div className="fc-dot on"/></div>
            </ScrollStackItem>
          </ScrollStack>
        </section>

        {/* CTA */}
        <section className="hp-cta">
          <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>🐝🍯</div>
          <h2>Yuk, Mulai Jaga Pertumbuhan<br/>Si Buah Hati!</h2>
          <p>Gratis, mudah, dan manis seperti madu — dirancang untuk orang tua & kader Posyandu Indonesia.</p>
          <Link href="/register" className="btn-cta">Daftar Gratis Sekarang 🎉</Link>
          <div style={{marginTop:"1.25rem",fontSize:".85rem",color:"rgba(255,193,7,.7)"}}>
            Sudah punya akun?{" "}
            <Link href="/login" style={{color:"#FFC107",fontWeight:700,textDecoration:"underline"}}>Masuk di sini</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hp-footer">
          <p>© {new Date().getFullYear()} <strong>GrowB 🐝</strong> — Platform Deteksi Dini Stunting Anak Indonesia</p>
          <p style={{marginTop:".4rem"}}>Dibuat dengan ❤️ dan 🍯 untuk masa depan anak yang lebih sehat</p>
        </footer>
      </div>
    </>
  );
}
