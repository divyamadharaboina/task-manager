import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{
  minHeight: '100vh',
  backgroundColor: '#020617',
  backgroundImage: `
    radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Inter, system-ui, sans-serif'
}}>
      <div style={{
        background: 'white', borderRadius: 16, padding: '40px 36px',
        width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, background: '#4f46e5', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, margin: '0 auto 12px'
          }}>✓</div>
          <h2 style={{ margin: 0, color: '#222' }}>Welcome back</h2>
          <p style={{ color: '#888', margin: '4px 0 0', fontSize: 14 }}>Login to your account</p>
        </div>
        <form onSubmit={submit}>
          <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Email</label>
          <input
            placeholder="you@example.com"
            type="email"
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 8,
              border: '1px solid #ddd', fontSize: 14, marginBottom: 14, boxSizing: 'border-box'
            }}
          />
          <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Password</label>
          <input
            placeholder="••••••••"
            type="password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 8,
              border: '1px solid #ddd', fontSize: 14, marginBottom: 20, boxSizing: 'border-box'
            }}
          />
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#4f46e5', color: 'white',
            border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 600
          }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
          No account? <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}