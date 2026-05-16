"use client";
import Link from "next/link";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import HomeNavbar from "@/components/HomeNavbar";

export default function HomePage() {

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900');
        .hp*{box-sizing:border-box;margin:0;padding:0;}
        .hp{font-family:'Plus Jakarta Sans',sans-serif;background:#FFFDE7;overflow-x:clip;}

        
        html { scroll-behavior: smooth; }

        /* HERO */
        /* HERO */
        .hp-hero{background:#FFFDE7;padding:0;display:flex;justify-content:center;}
        .hp-hero-card{background:#FDBC15;border-radius:0;position:relative;width:100%;max-width:none;display:flex;flex-direction:column;align-items:center;min-height:100vh;overflow:hidden;box-shadow:none;}
        .hp-hero-bg{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;}
        .hp-hero-content{max-width:800px;text-align:center;padding:8rem 2rem 2rem;z-index:10;position:relative;margin-top:2rem;}
        .hp-hero h1{font-size:clamp(3rem,6vw,4.5rem);font-weight:900;color:#fff;line-height:1.1;letter-spacing:-.02em;margin-bottom:1.5rem;text-shadow:0 4px 12px rgba(0,0,0,0.1);}
        .hp-hero h1 span{color:#FFFDE7;}
        .hp-hero p{font-size:1.25rem;color:#fff;line-height:1.6;margin:0 auto 2.5rem;max-width:600px;font-weight:700;}
        .hp-hero-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;}
        
        .btn-primary{background:#fff;color:#111;padding:1rem 2.5rem;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.1rem;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,0.1);transition:transform .15s,box-shadow .15s,border-color .15s;display:inline-flex;align-items:center;border:2px solid transparent;}
        .btn-primary:hover{transform:translate(-2px,-2px);box-shadow:0 12px 24px rgba(0,0,0,0.15);border-color:#111;color:#111!important;}
        .btn-secondary{background:rgba(255,255,255,0.2);color:#fff;padding:1rem 2.5rem;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.1rem;text-decoration:none;backdrop-filter:blur(4px);transition:background .15s;display:inline-flex;align-items:center;}
        .btn-secondary:hover{background:rgba(255,255,255,0.3);}

        .hp-hero-bottom{width:100%;flex:1;position:relative;display:flex;align-items:flex-end;justify-content:center;min-height:440px;z-index:5;}
        
        .speech-bubble {
          position: absolute;
          background: #fff;
          border-radius: 24px 24px 24px 6px;
          padding: 1rem 1.5rem;
          font-weight: 800;
          font-size: 1.25rem;
          color: #FDBC15;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          bottom: 250px; right: 15%;
          animation: floatSpeech 3s ease-in-out infinite;
          z-index: 20;
        }
        @keyframes floatSpeech {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        
        .anim-bubble {
          position: absolute;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          animation: floatUp 5s linear infinite;
          bottom: -50px;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-400px) scale(1.2); opacity: 0; }
        }
        .bub-1 { left: 10%; width: 40px; height: 40px; animation-duration: 6s; animation-delay: 0s; }
        .bub-2 { left: 25%; width: 60px; height: 60px; animation-duration: 5s; animation-delay: 1s; }
        .bub-3 { left: 40%; width: 30px; height: 30px; animation-duration: 7s; animation-delay: 2s; }
        .bub-4 { right: 30%; width: 50px; height: 50px; animation-duration: 6.5s; animation-delay: 0.5s; }
        .bub-5 { right: 15%; width: 45px; height: 45px; animation-duration: 5.5s; animation-delay: 1.5s; }
        .bub-6 { left: 5%; width: 20px; height: 20px; animation-duration: 4s; animation-delay: 0.2s; }
        .bub-7 { left: 18%; width: 35px; height: 35px; animation-duration: 6.2s; animation-delay: 1.2s; }
        .bub-8 { left: 32%; width: 50px; height: 50px; animation-duration: 5.8s; animation-delay: 0.8s; }
        .bub-9 { left: 55%; width: 25px; height: 25px; animation-duration: 4.5s; animation-delay: 2.5s; }
        .bub-10 { left: 68%; width: 45px; height: 45px; animation-duration: 7.2s; animation-delay: 0.3s; }
        .bub-11 { right: 8%; width: 30px; height: 30px; animation-duration: 5.1s; animation-delay: 1.7s; }
        .bub-12 { right: 22%; width: 55px; height: 55px; animation-duration: 6.8s; animation-delay: 0.9s; }
        .bub-13 { right: 45%; width: 20px; height: 20px; animation-duration: 4.8s; animation-delay: 2.1s; }
        .bub-14 { left: 50%; width: 40px; height: 40px; animation-duration: 6s; animation-delay: 1.4s; }
        .bub-15 { right: 38%; width: 25px; height: 25px; animation-duration: 5.5s; animation-delay: 0.6s; }

        /* ANIMATIONS (Maxima Style) */
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatSmooth {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes swayPlant {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes flyBee {
          0%, 100% { transform: translate(100px, 150px) scale(0.6) rotate(-10deg); }
          50% { transform: translate(100px, 135px) scale(0.6) rotate(-14deg); }
        }
        @keyframes drawCurve {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }

        .anim-pop { opacity: 0; }
        .hp-ready .anim-pop { animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .hp-ready .hp-hero-illustration svg { animation: popIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; animation-delay: 0.4s; }
        
        .hp-ready .cloud-1 { animation: floatSmooth 4s ease-in-out infinite; }
        .hp-ready .cloud-2 { animation: floatSmooth 5s ease-in-out infinite 1s; }
        
        .hp-ready .plant-1 { transform-origin: center 350px; animation: swayPlant 3s ease-in-out infinite; }
        .hp-ready .plant-2 { transform-origin: center 360px; animation: swayPlant 4s ease-in-out infinite 0.5s; }
        .hp-ready .plant-3 { transform-origin: center 350px; animation: swayPlant 3.5s ease-in-out infinite 1s; }
        
        .hp-ready .anim-bee { animation: flyBee 3s ease-in-out infinite; }
        .hp-ready .anim-curve { stroke-dasharray: 400; stroke-dashoffset: 400; animation: drawCurve 1.5s ease-out forwards 0.8s; }
        .hp-ready .anim-honey { animation: floatSmooth 3s ease-in-out infinite; }

        /* SPLASH SCREEN */
        .splash-wrap {
          position: fixed; inset: 0; z-index: 9999;
          background: #FFF8E7;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .splash-wrap.fading { opacity: 0; transform: scale(0.6); pointer-events: none; }
        .splash-wrap.hidden { display: none; }

        .hp {
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: center 20vh;
        }
        .hp.hp-zoomed { transform: scale(1.15); opacity: 0; pointer-events: none; }
        .hp.hp-ready { transform: scale(1); opacity: 1; pointer-events: auto; }
        
        .splash-text-svg { width: 400px; height: 120px; overflow: visible; }
        .splash-text {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 5.5rem;
          fill: transparent;
          stroke: #111;
          stroke-width: 3.5;
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: drawSplashText 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards, fillSplashText 0.5s ease-out 1.2s forwards, popBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards;
          transform-origin: center;
        }
        @keyframes drawSplashText { 100% { stroke-dashoffset: 0; } }
        @keyframes fillSplashText { 100% { fill: #FDBC15; } }
        @keyframes popBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }

        .splash-bee {
          position: absolute;
          top: 50%; left: 50%;
          width: 80px; height: 80px;
          margin-top: -80px; margin-left: -180px;
          opacity: 0;
          animation: splashBeeFly 2s cubic-bezier(0.25, 1, 0.5, 1) 0.5s forwards;
        }
        @keyframes splashBeeFly {
          0% { opacity: 0; transform: translate(-100px, 100px) scale(0.5) rotate(-30deg); }
          20% { opacity: 1; }
          100% { opacity: 1; transform: translate(140px, -60px) scale(1.2) rotate(10deg); }
        }

        /* STATS */
        .hp-stats{background:#FFE082;padding:1.25rem 2rem;display:flex;align-items:center;justify-content:center;gap:3rem;flex-wrap:wrap;}
        .hp-stat-num{font-size:1.875rem;font-weight:900;color:#111;}
        .hp-stat-label{font-size:.8125rem;font-weight:600;color:#5d4037;}

        /* FEATURES */
        .hp-features{background:#FFFDE7;}
        .hp-fhead{text-align:center;padding:2rem 2rem 4rem;}
        .hp-tag{display:inline-block;background:#111;color:#FDBC15;padding:4px 14px;border-radius:999px;font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem;}
        .hp-fhead h2{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;color:#111;letter-spacing:-.03em;line-height:1.15;margin-bottom:.75rem;}
        .hp-fhead p{color:#6d4c00;font-size:1rem;max-width:460px;margin:0 auto;line-height:1.65;}

        .feat-stack .scroll-stack-card {
          width: 100%;
          height: auto;
          min-height: 24rem;
          border-radius: 24px!important;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 3rem 2.5rem;
          border: 2px solid #111;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .fc-tag{display:inline-flex;align-items:center;padding:6px 16px;border-radius:999px;font-size:.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin-bottom:1.5rem;}
        .fc-icon{font-size:5rem;line-height:1;margin-bottom:1.5rem;}
        .fc-title{font-size:2rem;font-weight:800;letter-spacing:-.02em;line-height:1.2;margin-bottom:1rem;}
        .fc-desc{font-size:1.1rem;line-height:1.6;max-width:400px;font-weight:600;}

        .fc-dots{display:none;}

        .cc1{background:#FFC107!important;color:#111;}
        .cc1 .fc-tag{background:#111;color:#FDBC15;}
        .cc1 .fc-title, .cc1 .fc-desc{color:#111;}

        .cc2{background:#FFFDE7!important;color:#111;}
        .cc2 .fc-tag{background:#2A5FE3;color:#fff;}
        .cc2 .fc-title, .cc2 .fc-desc{color:#111;}

        .cc3{background:#fff!important;color:#111;}
        .cc3 .fc-tag{background:#111;color:#FFC107;}
        .cc3 .fc-title, .cc3 .fc-desc{color:#111;}

        .cc4{background:#FFE082!important;color:#111;}
        .cc4 .fc-tag{background:#111;color:#FDBC15;}
        .cc4 .fc-title, .cc4 .fc-desc{color:#111;}

        /* HOW TO USE */
        .hp-how{background:#FFFDE7;padding:6rem 2rem;}
        .hp-how-inner{max-width:1100px;margin:0 auto;}
        .hp-how-head{text-align:center;margin-bottom:4rem;}
        .hp-how-head h2{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;color:#111;letter-spacing:-.03em;line-height:1.2;margin-bottom:.75rem;}
        .hp-how-head p{color:#6d4c00;font-size:1rem;max-width:480px;margin:0 auto;line-height:1.65;}
        .hp-how-steps{display:flex;flex-direction:column;gap:0;position:relative;}
        .hp-how-row{display:flex;align-items:flex-start;gap:1.5rem;}
        .hp-how-row.reverse{flex-direction:row-reverse;text-align:right;}
        .hp-how-num{width:72px;height:72px;border-radius:999px;background:#FDBC15;border:3px solid #111;display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:900;color:#111;flex-shrink:0;}
        .hp-how-content{padding:.5rem 0 2rem;max-width:340px;}
        .hp-how-content h3{font-size:1.2rem;font-weight:900;color:#111;margin-bottom:.4rem;}
        .hp-how-content p{font-size:.9rem;color:#6d4c00;line-height:1.65;}
        .hp-how-wave{width:100%;overflow:visible;display:block;margin:-8px 0;height:60px;}

        /* ABOUT */
        .hp-about{background:#FFFDE7;padding:5rem 2rem;position:relative;overflow:hidden;}
        .hp-about-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;}
        .hp-about-left{display:flex;flex-direction:column;align-items:flex-start;}
        .hp-about-tag{display:inline-block;background:#FDBC15;color:#111;padding:4px 16px;border-radius:999px;font-size:.75rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.5rem;}
        .hp-about h2{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:900;color:#111;letter-spacing:-.02em;line-height:1.2;margin-bottom:1rem;}
        .hp-about-lead{color:#444;font-size:1.05rem;line-height:1.75;margin-bottom:2.5rem;}
        .hp-about-grid{display:grid;grid-template-columns:repeat(2, 1fr);gap:1.25rem;}
        @media (max-width: 900px) { .hp-about-inner { grid-template-columns: 1fr; gap: 3rem; } }
        .hp-about-card{background:#fff;border:1.5px solid #e0e0e0;border-radius:16px;padding:1.5rem;transition:border-color .2s,background .2s;box-shadow:0 4px 12px rgba(0,0,0,0.03);}
        .hp-about-card:hover{background:#FFF8E1;border-color:#FDBC15;}
        .hp-about-icon{font-size:2rem;margin-bottom:.75rem;}
        .hp-about-card h3{font-size:1rem;font-weight:900;color:#111;margin-bottom:.4rem;}
        .hp-about-card p{font-size:.875rem;color:#555;line-height:1.6;}
        .hp-about-bottom{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;}
        .btn-cta{background:#FDBC15;color:#111;padding:1rem 2.5rem;border-radius:999px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:900;font-size:1.0625rem;text-decoration:none;border:2.5px solid #FDBC15;box-shadow:5px 5px 0 #FF8F00;transition:transform .15s,box-shadow .15s;display:inline-flex;align-items:center;gap:8px;}
        .btn-cta:hover{transform:translate(-2px,-2px);box-shadow:7px 7px 0 #FF8F00;color:#111!important;}
        .hp-about-note{font-size:.875rem;color:#666;line-height:1.6;}

        /* FOOTER */
        .hp-footer{background:#FFFDE7;border-top:2px solid #e0e0e0;color:#666;padding:2rem;text-align:center;font-size:.8125rem;}
        .hp-footer strong{color:#111;}
      `}</style>
      <HomeNavbar />
      <div className="hp hp-ready">

        {/* HERO */}
        <section className="hp-hero">
          <div className="hp-hero-card">

            {/* Wavy Background inside the card */}
            <svg className="hp-hero-bg" preserveAspectRatio="none" viewBox="0 0 1440 800">
              <path d="M0 0 H1440 V500 Q1080 650 720 450 T0 600 Z" fill="#FFC107" />
              <path d="M0 0 H1440 V300 Q1080 450 720 250 T0 400 Z" fill="#FFD54F" />
            </svg>

            <div className="hp-hero-content">
              <h1 className="anim-pop delay-1">Pantau Tumbuh <span>Kembang</span> Anak Jadi Lebih Mudah</h1>
              <p className="anim-pop delay-2">Deteksi dini, rekomendasi gizi, dan pantau pertumbuhan anak setiap saat bersama GrowB!</p>
              <div className="hp-hero-btns anim-pop delay-3">
                <Link href="/register" className="btn-primary">Mulai Sekarang</Link>
              </div>
            </div>

            <div className="hp-hero-bottom">
              {/* Bubbles */}
              <div className="anim-bubble bub-1"></div>
              <div className="anim-bubble bub-2"></div>
              <div className="anim-bubble bub-3"></div>
              <div className="anim-bubble bub-4"></div>
              <div className="anim-bubble bub-5"></div>
              <div className="anim-bubble bub-6"></div>
              <div className="anim-bubble bub-7"></div>
              <div className="anim-bubble bub-8"></div>
              <div className="anim-bubble bub-9"></div>
              <div className="anim-bubble bub-10"></div>
              <div className="anim-bubble bub-11"></div>
              <div className="anim-bubble bub-12"></div>
              <div className="anim-bubble bub-13"></div>
              <div className="anim-bubble bub-14"></div>
              <div className="anim-bubble bub-15"></div>

              {/* Speech Bubble */}
              <div className="speech-bubble delay-3">
                Tumbuh sehat, <br />anak kuat! 💪
              </div>

              {/* Kids holding hands & Seamless Mountain SVG */}
              <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" style={{ width: "100%", height: "100%", maxHeight: "500px", position: "absolute", bottom: 0, zIndex: 10 }}>
                <g transform="translate(600, 120)">
                  {/* Kid 1 (Left) */}
                  <g transform="translate(-150, 60)">
                    {/* Left Arm raised */}
                    <path d="M-20 60 Q-60 0 -80 -20" fill="none" stroke="#F1A893" strokeWidth="18" strokeLinecap="round" />
                    {/* Right Arm to center kid */}
                    <path d="M20 60 Q60 50 80 10" fill="none" stroke="#F1A893" strokeWidth="18" strokeLinecap="round" />

                    {/* Body */}
                    <path d="M-30 60 Q0 40 30 60 L35 150 L-35 150 Z" fill="#EF476F" />
                    {/* Head */}
                    <circle cx="0" cy="15" r="35" fill="#FFCCBC" />
                    {/* Hair */}
                    <path d="M-40 20 Q-20 -20 0 -25 Q20 -20 40 20 Q30 -40 0 -45 Q-30 -40 -40 20 Z" fill="#FFD166" />
                    {/* Face */}
                    <circle cx="-10" cy="15" r="3" fill="#4A342E" />
                    <circle cx="10" cy="15" r="3" fill="#4A342E" />
                    <path d="M-8 28 Q0 38 8 28" fill="none" stroke="#4A342E" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  {/* Kid 3 (Right) */}
                  <g transform="translate(150, 60)">
                    {/* Right Arm raised */}
                    <path d="M20 60 Q60 0 80 -20" fill="none" stroke="#F1A893" strokeWidth="18" strokeLinecap="round" />
                    {/* Left Arm to center kid */}
                    <path d="M-20 60 Q-60 50 -80 10" fill="none" stroke="#F1A893" strokeWidth="18" strokeLinecap="round" />

                    {/* Body */}
                    <path d="M-30 60 Q0 40 30 60 L35 150 L-35 150 Z" fill="#06D6A0" />
                    {/* Head */}
                    <circle cx="0" cy="15" r="35" fill="#FFCCBC" />
                    {/* Hair */}
                    <path d="M-35 10 Q-30 -30 0 -35 Q30 -30 35 10 Q20 -20 0 -20 Q-20 -20 -35 10 Z" fill="#2B2B2B" />
                    {/* Face */}
                    <circle cx="-10" cy="15" r="3" fill="#4A342E" />
                    <circle cx="10" cy="15" r="3" fill="#4A342E" />
                    <path d="M-8 28 Q0 38 8 28" fill="none" stroke="#4A342E" strokeWidth="3" strokeLinecap="round" />
                  </g>

                  {/* Kid 2 (Center) */}
                  <g transform="translate(0, 30)">
                    {/* Arms holding the others (Front arms, so lighter skin) */}
                    <path d="M-25 70 Q-70 70 -90 40" fill="none" stroke="#FFCCBC" strokeWidth="18" strokeLinecap="round" />
                    <path d="M25 70 Q70 70 90 40" fill="none" stroke="#FFCCBC" strokeWidth="18" strokeLinecap="round" />

                    {/* Body */}
                    <path d="M-30 60 Q0 40 30 60 L35 160 L-35 160 Z" fill="#118AB2" />
                    {/* Head */}
                    <circle cx="0" cy="15" r="38" fill="#FFCCBC" />
                    {/* Hair */}
                    <path d="M-40 20 Q-20 -25 0 -30 Q20 -25 40 20 Q30 -45 0 -50 Q-30 -45 -40 20 Z" fill="#5D4037" />
                    {/* Face */}
                    <circle cx="-12" cy="12" r="4" fill="#4A342E" />
                    <circle cx="12" cy="12" r="4" fill="#4A342E" />
                    <path d="M-10 28 Q0 42 10 28" fill="none" stroke="#4A342E" strokeWidth="3" strokeLinecap="round" />
                  </g>
                </g>

                {/* Seamless Mountain Shape */}
                <path d="M-400 400 Q 600 180 1600 400 Z" fill="#FFFDE7" />
                {/* Clean cover at very bottom to ensure no gaps */}
                <rect x="-400" y="395" width="2000" height="20" fill="#FFFDE7" />
              </svg>

            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="hp-features" id="features">
          <div className="hp-fhead">

            <h2>Early Intervention</h2>
            <p>Mendukung Perjalanan Tumbuh Kembang Setiap Anak</p>
          </div>

          <ScrollStack className="feat-stack" itemDistance={100} itemScale={0.035} itemStackDistance={20} stackPosition="12%" scaleEndPosition="6%" baseScale={0.9} rotationAmount={1} useWindowScroll={true}>
            <ScrollStackItem itemClassName="cc1">
              <div>
                <div className="fc-title">Deteksi Dini Stunting</div>
                <img src="/target.png" alt="Deteksi" style={{ height: '80px', margin: '0 auto 1.5rem auto', display: 'block' }} />
                <div className="fc-desc">Sistem hitung Z-Score otomatis standar WHO untuk deteksi risiko stunting. Akurat dan cepat seperti lebah yang sigap!</div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="cc2">
              <div>
                <div className="fc-title">Grafik Pertumbuhan</div>
                <img src="/bar-chart.png" alt="Grafik" style={{ height: '80px', margin: '0 auto 1.5rem auto', display: 'block' }} />
                <div className="fc-desc">Pantau tinggi & berat badan si kecil bulan per bulan dengan grafik interaktif lengkap kurva persentil WHO.</div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="cc3">
              <div>
                <div className="fc-title">Rekomendasi Nutrisi AI</div>
                <img src="/puzzle.png" alt="Nutrisi" style={{ height: '80px', margin: '0 auto 1.5rem auto', display: 'block' }} />
                <div className="fc-desc">Menu makan harian + target kalori & protein dipersonalisasi AI — semanis madu untuk tumbuh kembang si kecil!</div>
              </div>
            </ScrollStackItem>
            <ScrollStackItem itemClassName="cc4">
              <div>
                <div className="fc-title">Laporan Lengkap</div>
                <img src="/analysis.png" alt="Laporan" style={{ height: '80px', margin: '0 auto 1.5rem auto', display: 'block' }} />
                <div className="fc-desc">Generate laporan pertumbuhan anak PDF profesional — siap dibagikan ke dokter atau kader Posyandu. Manis dan berguna!</div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </section>

        {/* HOW TO USE */}
        <section className="hp-how" id="how-to-use">
          <div className="hp-how-inner">
            <div className="hp-how-head">
              <h2>How It Works?</h2>
              <p>Tidak perlu keahlian khusus — cukup data anak dan GrowB sisanya.</p>
            </div>
            <div className="hp-how-steps">

              {/* Step 1 */}
              <div className="hp-how-row">
                <div className="hp-how-num">1</div>
                <div className="hp-how-content">
                  <h3>Buat Akun Gratis</h3>
                  <p>Daftar hanya dengan email. Tidak perlu kartu kredit atau biaya apapun.</p>
                </div>
              </div>

              {/* Wavy connector 1→2 */}
              <svg className="hp-how-wave" viewBox="0 0 400 60" preserveAspectRatio="none">
                <path d="M36 10 C100 50, 200 -10, 260 30 S360 50, 364 30" fill="none" stroke="#FDBC15" strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" />
              </svg>

              {/* Step 2 */}
              <div className="hp-how-row reverse">
                <div className="hp-how-num">2</div>
                <div className="hp-how-content">
                  <h3>Tambah Data Anak</h3>
                  <p>Masukkan nama, tanggal lahir, berat badan, dan tinggi badan si kecil.</p>
                </div>
              </div>

              {/* Wavy connector 2→3 */}
              <svg className="hp-how-wave" viewBox="0 0 400 60" preserveAspectRatio="none" style={{ transform: 'scaleX(-1)' }}>
                <path d="M36 10 C100 50, 200 -10, 260 30 S360 50, 364 30" fill="none" stroke="#FDBC15" strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" />
              </svg>

              {/* Step 3 */}
              <div className="hp-how-row">
                <div className="hp-how-num">3</div>
                <div className="hp-how-content">
                  <h3>Lihat Analisis Otomatis</h3>
                  <p>GrowB menghitung Z-Score WHO secara otomatis dan menampilkan status pertumbuhan.</p>
                </div>
              </div>

              {/* Wavy connector 3→4 */}
              <svg className="hp-how-wave" viewBox="0 0 400 60" preserveAspectRatio="none">
                <path d="M36 10 C100 50, 200 -10, 260 30 S360 50, 364 30" fill="none" stroke="#FDBC15" strokeWidth="3" strokeDasharray="10 8" strokeLinecap="round" />
              </svg>

              {/* Step 4 */}
              <div className="hp-how-row reverse">
                <div className="hp-how-num">4</div>
                <div className="hp-how-content">
                  <h3>Tindak Lanjut</h3>
                  <p>Dapatkan rekomendasi nutrisi dari AI dan ekspor laporan PDF untuk dokter atau Posyandu.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* TIES DIRECTLY INTO ABOUT US, NO DIVIDER NEEDED */}


        {/* ABOUT US */}
        <section className="hp-about" id="about-us">
          <div className="hp-about-inner">
            <div className="hp-about-left">
              <div className="hp-about-tag">Tentang GrowB</div>
              <h2>Dibangun untuk Masa Depan<br />Anak Indonesia</h2>
              <p className="hp-about-lead">
                Stunting masih menjadi tantangan besar di Indonesia — 1 dari 5 anak mengalaminya.
                GrowB hadir karena kami percaya setiap orang tua berhak mendapatkan alat yang mudah,
                akurat, dan gratis untuk memantau tumbuh kembang si kecil sedini mungkin.
              </p>

              <div className="hp-about-bottom">
                <Link href="/register" className="btn-cta">Mulai Sekarang — Gratis!</Link>
                <p className="hp-about-note">
                  Sudah punya akun?{" "}
                  <Link href="/login" style={{ color: "#FDBC15", fontWeight: 700, textDecoration: "underline" }}>Masuk di sini</Link>
                </p>
              </div>
            </div>

            <div className="hp-about-grid">
              <div className="hp-about-card">
                <div className="hp-about-icon"><img src="/research.png" alt="Misi" style={{ width: '48px', height: '48px', objectFit: 'contain' }} /></div>
                <h3>Misi Kami</h3>
                <p>Mendeteksi risiko stunting lebih awal menggunakan standar WHO agar intervensi gizi bisa dilakukan tepat waktu.</p>
              </div>
              <div className="hp-about-card">
                <div className="hp-about-icon"><img src="/team.png" alt="Untuk Siapa" style={{ width: '48px', height: '48px', objectFit: 'contain' }} /></div>
                <h3>Untuk Siapa</h3>
                <p>Orang tua, kader Posyandu, bidan desa, dan tenaga kesehatan yang ingin memantau pertumbuhan anak secara digital.</p>
              </div>
              <div className="hp-about-card">
                <div className="hp-about-icon"><img src="/rocket.png" alt="Teknologi" style={{ width: '48px', height: '48px', objectFit: 'contain' }} /></div>
                <h3>Teknologi</h3>
                <p>Kalkulasi Z-Score otomatis berbasis data WHO, dikombinasikan dengan rekomendasi nutrisi berbasis AI yang dipersonalisasi.</p>
              </div>
              <div className="hp-about-card">
                <div className="hp-about-icon"><img src="/piggy-bank.png" alt="Gratis" style={{ width: '48px', height: '48px', objectFit: 'contain' }} /></div>
                <h3>Gratis Selamanya</h3>
                <p>GrowB sepenuhnya gratis. Tidak ada biaya tersembunyi — karena kesehatan anak tidak boleh jadi privilege.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
