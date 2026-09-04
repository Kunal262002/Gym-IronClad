import React from 'react';
import gymitLogo from '../images/gymit-logo-768x543.png';

const timeline = [
  { year: '2014', event: 'IRONCLAD opens as a single-room strength studio on Foundry Street.' },
  { year: '2017', event: 'First group conditioning classes launch alongside personal training.' },
  { year: '2021', event: 'Facility expands to a full 12,000 sq ft floor with dedicated recovery space.' },
  { year: '2026', event: 'Now home to 2,400+ members and a coaching staff of 14.' },
];

const About = () => (
  <div>
    <section className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center">
        <div>
          <p className="section-eyebrow">About Us</p>
          <h1 className="font-display text-4xl md:text-6xl mb-6 max-w-2xl">
            Welcome to IRON<span className="text-volt">CLAD!</span>
          </h1>
          <p className="text-chalk/70 max-w-2xl text-lg">
           IRONCLAD transcends the conventional idea of a gym; it’s a lifestyle embraced by those committed to wellness. Widely acknowledged as a premium destination promoting a healthy lifestyle, IRONCLAD stands proudly as one of the finest fitness centers across four locations in Mathura. It has become the preferred choice for individuals seeking top-notch training programs.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <img
            src={gymitLogo}
            alt="Gymit Fitness logo"
            className="w-full max-w-md object-contain"
          />
        </div>
      </div>
    </section>

    <section className="border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <p className="section-eyebrow">What Drives Us</p>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <article className="card">
            
            <h2 className="font-display text-3xl md:text-4xl mb-4">OUR MISSION</h2>
            <p className="text-chalk/70 text-lg">
              To foster a community that embraces a healthy and active lifestyle, ensuring every
              member achieves their fitness goals with support and expertise.
            </p>
          </article>

          <article className="card">
            <h2 className="font-display text-3xl md:text-4xl mb-4">OUR VISION</h2>
            <p className="text-chalk/70 text-lg">
              We see IRONCLAD as more than a workout space: a community where individuals unite
              to fulfill their fitness goals under the guidance of skilled professionals.
            </p>
          </article>
        </div>
      </div>
    </section>


    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="section-eyebrow">Our Story</p>
      <h2 className="font-display text-3xl md:text-4xl mb-12">HOW WE GOT HERE</h2>
      <div className="space-y-8">
        {timeline.map((item) => (
          <div key={item.year} className="flex gap-8 border-b border-white/10 pb-8">
            <p className="font-display text-3xl text-volt w-24 shrink-0">{item.year}</p>
            <p className="text-chalk/70 text-lg">{item.event}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default About;
