import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = { name: '', email: '', phone: '', password: '' };

const Register = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <p className="section-eyebrow">Join IRONCLAD</p>
      <h1 className="font-display text-4xl mb-8">CREATE ACCOUNT</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

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
          <label htmlFor="phone" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">
            Phone <span className="text-chalk/30">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
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
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        {error && <p className="text-rust">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-chalk/60 mt-6">
        Already a member?{' '}
        <Link to="/login" className="text-volt">
          Log in
        </Link>
      </p>
    </section>
  );
};

export default Register;
