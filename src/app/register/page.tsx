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

    try {
      // 1. Mendaftarkan Akun ke Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Jika berhasil, masukkan data nama dan role ke tabel Profiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            role: role,
          });

        if (profileError) throw profileError;
      }

      alert('Pendaftaran berhasil! Silakan masuk.');
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
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
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='69.28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 17.32l-20 11.55L0 17.32V0h40v17.32zm0 34.64l-20 11.55-20-11.55V34.64h40v17.32z' fill='%23fef08a' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
          padding: 2rem;
          font-family: 'Nunito', sans-serif;
        }
        .auth-card {
          display: flex;
          width: 100%;
          max-width: 900px;
          min-height: 540px;
          background: #fff;
          border: 2px solid #FDBC15;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.15);
          overflow: hidden;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(20px)'};
          transition: all 0.5s ease;
        }
        .auth-left {
          flex: 1;
          background-color: #FDBC15;
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='69.28' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 17.32l-20 11.55L0 17.32V0h40v17.32zm0 34.64l-20 11.55-20-11.55V34.64h40v17.32z' fill='%23FFB300' fill-opacity='0.25' fill-rule='evenodd'/%3E%3C/svg%3E");
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
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 2rem;
        }
        .big-bee {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
          animation: floatBee 3s ease-in-out infinite;
        }
        @keyframes floatBee {
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
          background: #4CAF50;
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
        .floating-bee {
          position: absolute;
          font-size: 1.25rem;
          opacity: 0.7;
          pointer-events: none;
        }
        .bee-1 { top: 10%; right: 10%; animation: floatBee 4s ease-in-out infinite 1s; }
        .bee-2 { bottom: 20%; right: 5%; animation: floatBee 5s ease-in-out infinite 2s; }
        .bee-3 { bottom: 10%; left: 5%; animation: floatBee 3.5s ease-in-out infinite; }

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
          font-family: 'Nunito', sans-serif;
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
          font-family: 'Nunito', sans-serif;
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
        <div className="auth-card">
          
          <div className="auth-left">
            <div className="brand-logo">
              <span>🍯</span> GrowB
            </div>
            <div className="big-bee">🐝</div>
            <h2 className="left-title">Pantau tumbuh kembang<br/>si kecil! 🌟</h2>
            
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
            <div className="floating-bee bee-1">🐝</div>
            <div className="floating-bee bee-2">🐝</div>
            <div className="floating-bee bee-3">🐝</div>

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
                {loading ? 'Memproses...' : 'Daftar Sekarang'} 🍯
              </button>
            </form>

          </div>
        </div>
      </div>
    </>
  );
}
