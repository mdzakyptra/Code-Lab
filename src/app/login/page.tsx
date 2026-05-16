"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // SIMULASI LOGIN (Karena Supabase belum dikonfigurasi)
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFFDE7;
          padding: 2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* BACKGROUND BUBBLES */
        .anim-bubble {
          position: absolute;
          background: rgba(253, 188, 21, 0.3);
          border-radius: 50%;
          animation: floatUp 5s linear infinite;
          bottom: -50px;
          z-index: 1;
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.2); opacity: 0; }
        }
        .bub-1 { left: 10%; width: 40px; height: 40px; animation-duration: 6s; animation-delay: 0s; }
        .bub-2 { left: 25%; width: 60px; height: 60px; animation-duration: 5s; animation-delay: 1s; }
        .bub-3 { left: 40%; width: 30px; height: 30px; animation-duration: 7s; animation-delay: 2s; }
        .bub-4 { right: 30%; width: 50px; height: 50px; animation-duration: 6.5s; animation-delay: 0.5s; }
        .bub-5 { right: 15%; width: 45px; height: 45px; animation-duration: 5.5s; animation-delay: 1.5s; }
        .bub-6 { left: 5%; width: 20px; height: 20px; animation-duration: 4s; animation-delay: 0.2s; }
        .bub-7 { right: 5%; width: 35px; height: 35px; animation-duration: 6.2s; animation-delay: 1.2s; }
        .bub-8 { left: 55%; width: 25px; height: 25px; animation-duration: 4.5s; animation-delay: 2.5s; }
        .bub-9 { left: 75%; width: 45px; height: 45px; animation-duration: 7.2s; animation-delay: 0.3s; }
        .auth-card {
          display: flex;
          width: 100%;
          max-width: 1000px;
          min-height: 580px;
          background: #fff;
          border: 2px solid #FDBC15;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.15);
          overflow: hidden;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(20px)'};
          transition: all 0.5s ease;
          position: relative;
          z-index: 10;
        }
        .auth-left {
          flex: 1;
          background-color: #FDBC15;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #111;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          font-size: 1.75rem;
          font-weight: 900;
          margin-bottom: 2rem;
          letter-spacing: -0.04em;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .brand-logo:hover {
          opacity: 0.8;
        }
        .floating-img {
          width: 120px;
          height: auto;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
          animation: floatImg 4s ease-in-out infinite;
        }
        @keyframes floatImg {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .left-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 2rem;
          line-height: 1.4;
        }
        .benefits {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
          width: 100%;
          max-width: 280px;
        }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #3e2723;
        }
        .check-icon {
          background: #111;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          flex-shrink: 0;
        }

        .auth-right {
          flex: 1.1;
          padding: 3rem 4rem;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }


        .auth-toggle {
          display: flex;
          border: 2px solid #FDBC15;
          border-radius: 999px;
          margin-bottom: 2.5rem;
          overflow: hidden;
          position: relative;
        }
        .toggle-btn {
          flex: 1;
          padding: 0.6rem;
          text-align: center;
          font-weight: 800;
          font-size: 0.95rem;
          color: #111;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .toggle-btn.active {
          background: #FDBC15;
          color: #fff;
          border-radius: 999px;
          margin: 2px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #5d4037;
          margin-bottom: 0.4rem;
        }
        .input-wrapper { position: relative; }
        .form-input {
          width: 100%;
          border: 2px solid #FDBC15;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: #111;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          outline: none;
          transition: box-shadow 0.2s;
        }
        .form-input::placeholder { color: #bdbdbd; font-weight: 500; }
        .form-input:focus { box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.2); }
        .form-input.has-toggle { padding-right: 2.5rem; }
        .pw-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #795548;
          display: flex;
          align-items: center;
        }

        .btn-submit {
          width: 100%;
          padding: 0.85rem;
          border-radius: 999px;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          margin-top: 1rem;
          background: #FDBC15;
          color: #111;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
          transition: transform 0.1s, box-shadow 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 193, 7, 0.4); }
        .btn-submit:active:not(:disabled) { transform: translateY(0); box-shadow: 0 2px 4px rgba(255, 193, 7, 0.2); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .forgot-pw {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #795548;
          text-decoration: none;
        }
        .forgot-pw:hover { text-decoration: underline; color: #3e2723; }

        .auth-error {
          background: #ffcdd2;
          color: #b71c1c;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .auth-card { flex-direction: column; min-height: auto; }
          .auth-left { padding: 2rem; }
          .auth-right { padding: 2rem; }
          .big-bee { font-size: 4rem; }
        }
      `}</style>

      <div className="auth-page">
        <div className="anim-bubble bub-1"></div>
        <div className="anim-bubble bub-2"></div>
        <div className="anim-bubble bub-3"></div>
        <div className="anim-bubble bub-4"></div>
        <div className="anim-bubble bub-5"></div>
        <div className="anim-bubble bub-6"></div>
        <div className="anim-bubble bub-7"></div>
        <div className="anim-bubble bub-8"></div>
        <div className="anim-bubble bub-9"></div>

        <div className="auth-card">

          <div className="auth-left">
            <a href="/" className="brand-logo">
              <span style={{color: '#FF4C00'}}>grow</span><span style={{color: '#6C4EE5'}}>b</span>
            </a>
            <img src="/bees.png" alt="GrowB" className="floating-img" />
            <h2 className="left-title">Pantau tumbuh kembang<br />si kecil!</h2>

            <div className="benefits">
              <div className="benefit-item">
                <div className="check-icon">✓</div>
                Monitoring pertumbuhan real-time
              </div>
              <div className="benefit-item">
                <div className="check-icon">✓</div>
                Deteksi dini stunting & gizi
              </div>
              <div className="benefit-item">
                <div className="check-icon">✓</div>
                Tips parenting dari ahli
              </div>
            </div>
          </div>

          <div className="auth-right">


            <div className="auth-toggle">
              <div className="toggle-btn active">Masuk</div>
              <a href="/register" className="toggle-btn">Daftar</a>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input has-toggle"
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
              </button>
            </form>

            <a href="#" className="forgot-pw">Lupa password?</a>
          </div>

        </div>
      </div>
    </>
  );
}
