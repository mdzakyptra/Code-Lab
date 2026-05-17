"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('orang_tua');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        role: role,
      });
    }

    alert('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');
    router.push('/login');
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
          gap: 1rem;
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
          padding: 0.7rem 1rem;
          font-size: 0.95rem;
          color: #111;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          outline: none;
          transition: box-shadow 0.2s;
        }
        .form-input::placeholder { color: #bdbdbd; font-weight: 500; }
        .form-input:focus { box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.2); }
        .form-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
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
          margin-top: 0.5rem;
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

        .auth-error {
          background: #ffcdd2;
          color: #b71c1c;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
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
              <a href="/login" className="toggle-btn">Masuk</a>
              <div className="toggle-btn active">Daftar</div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Bunda Lebah..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>

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
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Daftar Sebagai</label>
                <div className="input-wrapper">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="form-input form-select">
                    <option value="orang_tua">Orang Tua</option>
                    <option value="kader_kesehatan">Kader Posyandu / Nakes</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-submit">
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
