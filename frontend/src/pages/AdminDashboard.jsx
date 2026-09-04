import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [visibleUsersCount, setVisibleUsersCount] = useState(5);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [trainers, plans, classes, contacts, userResponse] = await Promise.all([
          api.get('/trainers'),
          api.get('/memberships'),
          api.get('/classes'),
          api.get('/contact'),
          api.get('/auth/users'),
        ]);

        setStats({
          trainers: trainers.data.count,
          plans: plans.data.count,
          classes: classes.data.count,
          messages: contacts.data.count,
        });
        setMessages(contacts.data.data.slice(0, 5));
        setUsers(userResponse.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load admin data.');
      }
    };

    loadAdminData();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <p className="section-eyebrow">Operations</p>
          <h1 className="font-display text-4xl md:text-6xl">ADMIN DASHBOARD</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/trainers" className="btn-outline">Manage Trainers</Link>
          <Link to="/membership" className="btn-outline">Manage Plans</Link>
          <Link to="/classes" className="btn-primary">View Schedule</Link>
        </div>
      </div>

      {error && <p className="text-rust mb-8">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {[
          ['Trainers', stats?.trainers],
          ['Membership Plans', stats?.plans],
          ['Classes', stats?.classes],
          ['Contact Messages', stats?.messages],
        ].map(([label, value]) => (
          <div className="card" key={label}>
            <p className="section-eyebrow">{label}</p>
            <p className="font-display text-5xl text-volt">{value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="space-y-16">
        <div>
        <p className="section-eyebrow">Members</p>
        <h2 className="font-display text-3xl mb-8">MEMBER TRAINING STATUS</h2>
        {users.length === 0 ? (
          <p className="text-chalk/50 mb-14">No registered users yet.</p>
        ) : (
          <div className="overflow-x-auto mb-14">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-chalk/50">
                  <th className="py-3 pr-4">User</th>
                  <th className="py-3 pr-4">Plan</th>
                  <th className="py-3 pr-4">Expires</th>
                  <th className="py-3 pr-4">Booked Slots / Trainer</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, visibleUsersCount).map((member) => (
                  <tr className="border-b border-white/10 align-top" key={member._id}>
                    <td className="py-4 pr-4">
                      <p className="font-bold">{member.name}</p>
                      <p className="text-sm text-chalk/50">{member.email}</p>
                    </td>
                    <td className="py-4 pr-4 text-chalk/80">
                      {member.membershipPlan?.name || 'No active plan'}
                    </td>
                    <td className="py-4 pr-4 text-chalk/80">
                      {member.membershipExpiresAt
                        ? new Date(member.membershipExpiresAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="py-4 pr-4 text-sm text-chalk/70">
                      {member.bookedClasses?.length ? (
                        <div className="space-y-2">
                          {member.bookedClasses.map((classItem) => (
                            <div key={classItem._id}>
                              <p className="text-chalk">{classItem.title}</p>
                              <p>
                                {classItem.dayOfWeek} {classItem.startTime} ·{' '}
                                {classItem.trainer?.name || 'Trainer TBD'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : 'No booked slots'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleUsersCount < users.length && (
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setVisibleUsersCount((count) => count + 5)} className="btn-outline flex-1">
                  More
                </button>
                {visibleUsersCount > 5 && <button type="button" onClick={() => setVisibleUsersCount(5)} className="btn-outline flex-1">Less</button>}
              </div>
            )}
            {visibleUsersCount >= users.length && visibleUsersCount > 5 && (
              <button type="button" onClick={() => setVisibleUsersCount(5)} className="btn-outline w-full mt-4">Less</button>
            )}
          </div>
        )}
        </div>

        <div>
        <p className="section-eyebrow">Inbox</p>
        <h2 className="font-display text-3xl mb-8">RECENT CONTACT MESSAGES</h2>
        {messages.length === 0 ? (
          <p className="text-chalk/50">No contact messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <article className="card" key={message._id}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-display text-xl">{message.name}</h3>
                    <p className="text-sm text-chalk/50">{message.email}</p>
                  </div>
                  <time className="text-xs text-chalk/40">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-chalk/70">{message.message}</p>
              </article>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;