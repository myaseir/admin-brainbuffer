"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail } from 'lucide-react'; // Changed User icon to Mail

export default function AdminLogin() {
  const router = useRouter();
  // 👇 Changed 'username' to 'email'
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 👇 CHANGE: Sending JSON with 'email' instead of Form Data
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', // ✅ Using JSON
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        // Handle validation errors (arrays) or simple text errors
        if (errData.detail && Array.isArray(errData.detail)) {
            const firstError = errData.detail[0];
            throw new Error(`${firstError.msg} (Field: ${firstError.loc[1]})`);
        }
        throw new Error(errData.detail || 'Login failed');
      }

      const data = await res.json();

      // 4. Save Token & Redirect
      localStorage.setItem('token', data.access_token);
      router.push('/'); 
      
    } catch (err: any) {
      setError(typeof err.message === 'object' ? JSON.stringify(err.message) : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Glacia<span className="text-emerald-500">Admin</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
            Secure Command Center
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl text-red-500 text-xs font-bold text-center border border-red-100 break-words">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* 👇 Input changed to Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" // Kept as text in case you used "admin" as the email
              required
              placeholder="Admin Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white pl-12 p-4 rounded-2xl text-sm font-bold outline-none transition-all text-slate-900"
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="password" 
              required
              placeholder="Secure Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full bg-slate-50 border-2 border-slate-50 focus:border-emerald-500 focus:bg-white pl-12 p-4 rounded-2xl text-sm font-bold outline-none transition-all text-slate-900"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-xl shadow-slate-200 mt-4"
          >
            {loading ? "Verifying..." : "Initialize Session"}
          </button>
        </form>
      </div>
    </div>
  );
}