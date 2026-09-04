import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-300' };
  if (bmi < 25) return { label: 'Healthy', color: 'text-emerald-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-400' };
  return { label: 'Obese', color: 'text-red-400' };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(70);

  const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '—');

  const bmiResult = useMemo(() => {
    if (!heightCm || !weightKg || Number(heightCm) <= 0 || Number(weightKg) <= 0) {
      return null;
    }

    const heightInMeters = Number(heightCm) / 100;
    const bmi = Number(weightKg) / (heightInMeters * heightInMeters);

    return {
      bmi: bmi.toFixed(1),
      category: getBmiCategory(bmi),
    };
  }, [heightCm, weightKg]);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div>
          <p className="section-eyebrow">Member Dashboard</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl break-words">WELCOME BACK, {user?.name?.split(' ')[0]?.toUpperCase()}</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:justify-end">
          <Link to="/classes" className="btn-primary w-full sm:w-auto">
            Browse Classes
          </Link>
          <Link to="/membership" className="btn-outline w-full sm:w-auto">
            Manage Membership
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="card">
          <p className="section-eyebrow">Account</p>
          <p className="text-lg break-words">{user?.email}</p>
        </div>
        <div className="card">
          <p className="section-eyebrow">Current Plan</p>
          <p className="text-lg">{user?.membershipPlan?.name || 'No active plan'}</p>
          {user?.membershipPlan && (
            <div className="mt-4 space-y-1 text-sm text-chalk/60">
              <p>Starts: {formatDateTime(user.membershipStartedAt)}</p>
              <p>Expires: {formatDateTime(user.membershipExpiresAt)}</p>
            </div>
          )}
        </div>
        <div className="card">
          <p className="section-eyebrow">Member Since</p>
          <p className="text-lg">
            {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '—'}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 card">
        <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-8 items-start">
          <div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="section-eyebrow">BMI Calculator</p>
                <h2 className="font-display text-3xl mb-2">Body Mass Index</h2>
              </div>
              {bmiResult && (
                <div className="text-left md:text-right">
                  <p className="text-sm uppercase tracking-[0.2em] text-chalk/50">Your BMI</p>
                  <p className={`font-display text-4xl ${bmiResult.category.color}`}>{bmiResult.bmi}</p>
                </div>
              )}
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-[0.2em] text-chalk/60 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  min="50"
                  max="250"
                  onChange={(event) => setHeightCm(event.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-[0.2em] text-chalk/60 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  min="20"
                  max="250"
                  onChange={(event) => setWeightKg(event.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="lg:pt-6">
            {bmiResult ? (
              <div className="rounded-md border border-white/10 bg-ink/40 p-5 h-full">
                <p className="text-sm uppercase tracking-[0.2em] text-chalk/60">Status</p>
                <p className={`font-display text-3xl mt-3 ${bmiResult.category.color}`}>
                  {bmiResult.category.label}
                </p>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-chalk/60">
                    <span>Progress</span>
                    <span>{bmiResult.bmi}/40</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-volt"
                      style={{ width: `${Math.min((Number(bmiResult.bmi) / 40) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="mt-5 text-sm text-chalk/70">
                  A BMI of {bmiResult.bmi} falls into the {bmiResult.category.label.toLowerCase()} range.
                </p>
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-white/10 bg-ink/40 p-5 h-full flex items-center">
                <p className="text-sm text-chalk/60">Enter a valid height and weight to calculate your BMI.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 card">
        <p className="section-eyebrow">Booked Classes</p>
        {user?.bookedClasses?.length ? (
          <div className="space-y-4 mt-4">
            {user.bookedClasses.map((classItem) => (
              <div key={classItem._id} className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                <p className="font-display text-2xl mb-1">{classItem.title}</p>
                <p className="text-chalk/70">
                  {classItem.dayOfWeek} · {classItem.startTime}{' '}
                  {classItem.durationMinutes ? `· ${classItem.durationMinutes} min` : ''}
                </p>
                <p className="text-sm text-volt mt-1">
                  Trainer: {classItem.trainer?.name || 'TBD'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-chalk/60 mt-4">No classes booked yet.</p>
        )}
      </div>

    </section>
  );
};

export default Dashboard;
