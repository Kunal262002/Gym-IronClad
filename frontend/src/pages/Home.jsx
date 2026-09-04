import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Members', value: '2,400+' },
  { label: 'Coached Sessions / Week', value: '180' },
  { label: 'Years Running', value: '12' },
];

const pillars = [
  {
    title: 'Programmed, Not Guessed',
    copy: 'Every block of training builds on the last one. Progress is tracked, not hoped for.',
  },
  {
    title: 'Coached Every Rep',
    copy: 'Trainers are on the floor during sessions, not behind a desk.',
  },
  {
    title: 'Built For The Long Run',
    copy: 'Mobility, recovery, and conditioning work sit alongside the heavy lifting.',
  },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section
      className="relative overflow-hidden border-b border-white/10"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(9, 12, 15, 0.9) 0%, rgba(9, 12, 15, 0.72) 35%, rgba(9, 12, 15, 0.55) 100%), url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative z-10">
        <p className="section-eyebrow">Foundry Street Gym</p>
        <h1 className="font-display text-5xl sm:text-6xl md:text-8xl leading-[0.95] mb-8 max-w-4xl">
          TRAIN LIKE THE
          <br />
          WORK <span className="text-volt">COUNTS.</span>
        </h1>
        <p className="text-chalk/70 max-w-lg mb-10 text-lg">
          IRONCLAD is a strength and conditioning gym built for people who want a real program,
          real coaching, and results they can measure — not just a membership card.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/register" className="btn-primary">
            Start Training
          </Link>
          <Link to="/classes" className="btn-outline">
            View Class Schedule
          </Link>
        </div>
      </div>

      {/* Diagonal accent band — the page's signature element */}
      <div className="absolute -right-24 top-0 h-full w-64 bg-volt/10 -skew-x-12 hidden lg:block" />
      <div className="absolute -right-10 top-0 h-full w-16 bg-rust/20 -skew-x-12 hidden lg:block" />
    </section>

    {/* Stats strip */}
    <section className="border-b border-white/10 bg-steel">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-5xl text-volt mb-1">{stat.value}</p>
            <p className="text-sm uppercase tracking-wide text-chalk/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Pillars */}
    <section className="max-w-7xl mx-auto px-6 py-24">
      <p className="section-eyebrow">The Approach</p>
      <h2 className="font-display text-4xl md:text-5xl mb-14 max-w-2xl">
        THREE THINGS WE DON'T COMPROMISE ON
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((pillar, index) => (
          <div key={pillar.title} className="card">
            <p className="font-display text-4xl text-white/10 mb-4">
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="font-display text-xl mb-3">{pillar.title}</h3>
            <p className="text-sm text-chalk/60">{pillar.copy}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="border-t border-white/10 bg-steel">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <h2 className="font-display text-3xl md:text-4xl max-w-xl">
          YOUR FIRST SESSION IS ON US.
        </h2>
        <Link to="/contact" className="btn-primary shrink-0">
          Book A Free Session
        </Link>
      </div>
    </section>
  </div>
);

export default Home;
