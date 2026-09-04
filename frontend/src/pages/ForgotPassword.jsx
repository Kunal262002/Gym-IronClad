import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.resetUrl ? `${data.message} Development link: ${data.resetUrl}` : data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <p className="section-eyebrow">Account Recovery</p>
      <h1 className="font-display text-4xl mb-4">FORGOT PASSWORD?</h1>
      <p className="text-chalk/60 mb-8">Enter your email and we will send you a secure reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">Email</label>
          <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="input-field" />
        </div>
        {message && <p className="text-volt break-words">{message}</p>}
        {error && <p className="text-rust">{error}</p>}
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <Link to="/login" className="inline-block text-sm text-volt mt-6">Back to log in</Link>
    </section>
  );
};

export default ForgotPassword;