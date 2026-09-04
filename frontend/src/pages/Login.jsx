import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <p className="section-eyebrow">Welcome Back</p>
      <h1 className="font-display text-4xl mb-8">LOG IN</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-field"
          />
          
        </div>

        <div>
          <label htmlFor="password" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="input-field"
          />
          <Link to="/forgot-password" className="inline-block text-sm text-volt mt-2">
            Forgot your password?
          </Link>
        </div>

        {error && <p className="text-rust">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="text-sm text-chalk/60 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-volt">
          Join now
        </Link>
      </p>
    </section>
  );
};

export default Login;
