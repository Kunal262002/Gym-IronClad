import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';
import ClassCard from '../components/ClassCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import AdminContentManager from '../components/AdminContentManager.jsx';
const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const isSubscriber = Boolean(
    user?.membershipPlan && user?.membershipExpiresAt && new Date(user.membershipExpiresAt) > new Date()
  );

  const [managing, setManaging] = useState(false);
  useEffect(() => {
    const fetchClasses = async () => {
      try {
            const { data } = await api.get('/classes');
            setClasses(data.data);
      } catch (err) {
        setError('Could not load the class schedule right now. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleBook = async (classItem) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingId(classItem._id);
    setMessage('');
    try {
      const { data } = await api.post(`/classes/${classItem._id}/book`);
      setClasses((prev) => prev.map((item) => (item._id === data.data._id ? data.data : item)));
      setMessage(`You're booked into ${classItem.title}.`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not book this class.');
    } finally {
      setBookingId(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-6">
        <div>
          <p className="section-eyebrow">{isSubscriber ? 'Weekly Member Schedule' : 'This Week'}</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl max-w-2xl">CLASS SCHEDULE</h1>
        </div>
        {user?.role === 'admin' && <button type="button" onClick={() => setManaging(true)} className="btn-primary shrink-0">Manage classes</button>}
      </div>
      <p className="text-chalk/60 max-w-xl mb-10 sm:mb-14 text-base sm:text-lg">
        {isSubscriber
          ? 'Your class times repeat every week while your membership is active.'
          : 'Drop into any class with an open spot — no separate booking fee for members.'}
      </p>

      {loading && <p className="text-chalk/50">Loading schedule…</p>}
      {error && <p className="text-rust">{error}</p>}
      {message && <p className="text-volt mb-8">{message}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          {classes.length === 0 ? (
            <p className="text-chalk/50">No classes scheduled yet. Add the first session from the admin manager.</p>
          ) : (
            classes.map((classItem) => (
              <ClassCard
                key={classItem._id}
                classItem={classItem}
                onBook={handleBook}
                booking={bookingId === classItem._id}
              />
            ))
          )}
        </div>
      )}
      {managing && <AdminContentManager resource="classes" modal onClose={() => setManaging(false)} />}
    </section>
  );
};

export default Classes;
