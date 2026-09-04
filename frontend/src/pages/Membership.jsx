import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import PlanCard from '../components/PlanCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

import AdminContentManager from '../components/AdminContentManager.jsx';
const Membership = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [managing, setManaging] = useState(false);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get('/memberships');
        setPlans(data.data);
      } catch (err) {
        setError('Could not load membership plans right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelect = async (plan) => {
    if (!user) {
      navigate('/register');
      return;
    }
    try {
      const { data } = await api.post(`/memberships/${plan._id}/subscribe`);
      updateUser(data.data);
      setMessage(`You're subscribed to the ${plan.name} plan.`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong while subscribing. Please try again.');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="section-eyebrow">Membership</p>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
        <h1 className="font-display text-4xl md:text-6xl max-w-2xl">PICK YOUR PLAN</h1>
        {user?.role === 'admin' && <button type="button" onClick={() => setManaging(true)} className="btn-primary shrink-0">Manage plans</button>}
      </div>
      <p className="text-chalk/60 max-w-xl mb-14 text-lg">
        No contracts, no hidden fees. Cancel or switch plans any time from your dashboard.
      </p>

      {loading && <p className="text-chalk/50">Loading plans…</p>}
      {error && <p className="text-rust">{error}</p>}
      {message && <p className="text-volt mb-8">{message}</p>}

      {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onSelect={handleSelect}
              actionLabel={user ? 'Subscribe' : 'Join To Subscribe'}
            />
          ))}
        </div>
      )}
      {managing && <AdminContentManager resource="plans" modal onClose={() => setManaging(false)} />}
    </section>
  );
};

export default Membership;
