import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password. Please request a new link.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <p className="section-eyebrow">Account Recovery</p>
      <h1 className="font-display text-4xl mb-8">NEW PASSWORD</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">New Password</label>
          <input id="password" type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="input-field" />
        </div>
        <div>
          <label htmlFor="confirmation" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">Confirm Password</label>
          <input id="confirmation" type="password" required minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="input-field" />
        </div>
        {error && <p className="text-rust">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
      <Link to="/login" className="inline-block text-sm text-volt mt-6">Back to log in</Link>
    </section>
  );
};

export default ResetPassword;