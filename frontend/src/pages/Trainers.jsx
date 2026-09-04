import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';
import TrainerCard from '../components/TrainerCard.jsx';

import AdminContentManager from '../components/AdminContentManager.jsx';
import { useAuth } from '../context/AuthContext.jsx';
const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [managing, setManaging] = useState(false);
  const { user } = useAuth();
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data } = await api.get('/trainers');
        setTrainers(data.data);
      } catch (err) {
        setError('Could not load trainers right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="section-eyebrow">Our Coaches</p>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-14">
        <h1 className="font-display text-4xl md:text-6xl max-w-2xl">MEET THE COACHING STAFF</h1>
        {user?.role === 'admin' && <button type="button" onClick={() => setManaging(true)} className="btn-primary shrink-0">Manage trainers</button>}
      </div>

      {loading && <p className="text-chalk/50">Loading trainers…</p>}
      {error && <p className="text-rust">{error}</p>}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <TrainerCard key={trainer._id} trainer={trainer} />
          ))}
        </div>
      )}

      {!loading && !error && trainers.length === 0 && (
        <p className="text-chalk/50">
          No trainers listed yet. Run <code className="text-volt">npm run seed</code> in the backend
          to load sample data.
        </p>
      )}
      {managing && <AdminContentManager resource="trainers" modal onClose={() => setManaging(false)} />}
    </section>
  );
};

export default Trainers;
