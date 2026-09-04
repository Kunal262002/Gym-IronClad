import React, { useState } from 'react';
import api from '../api/axios.js';

const initialForm = { name: '', email: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', text: '' });
    try {
      await api.post('/contact', form);
      setStatus({ type: 'success', text: 'Thanks — we will get back to you within a day.' });
      setForm(initialForm);
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <p className="section-eyebrow">Get In Touch</p>
      <h1 className="font-display text-4xl md:text-6xl mb-6">TALK TO THE TEAM</h1>
      <p className="text-chalk/60 mb-12 text-lg">
        Questions about membership, a class, or booking a free session? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">
            Name
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
            Phone No.
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>


        <div>
          <label htmlFor="message" className="block text-sm uppercase tracking-wide text-chalk/60 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={form.message}
            onChange={handleChange}
            className="input-field resize-none"
          />
        </div>

        {status.text && (
          <p className={status.type === 'success' ? 'text-volt' : 'text-rust'}>{status.text}</p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </section>
  );
};

export default Contact;
