import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-steel border-t border-white/10 mt-24">
    <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
      <div>
        <p className="font-display text-2xl tracking-wider mb-3">
          IRON<span className="text-volt">CLAD</span>
        </p>
        <p className="text-chalk/60 text-sm max-w-xs">
          A gym built around one idea: consistent, well-coached effort compounds into real results.
        </p>
      </div>

      <div>
        <p className="section-eyebrow">Explore</p>
        <ul className="space-y-2 text-sm text-chalk/70">
          <li><Link to="/classes" className="hover:text-volt">Classes</Link></li>
          <li><Link to="/trainers" className="hover:text-volt">Trainers</Link></li>
          <li><Link to="/membership" className="hover:text-volt">Membership</Link></li>
          <li><Link to="/contact" className="hover:text-volt">Contact</Link></li>
        </ul>
      </div>

      <div>
        <p className="section-eyebrow">Visit Us</p>
        <ul className="space-y-2 text-sm text-chalk/70">
          <li>212 Foundry Street, Unit 4</li>
          <li>Mon – Fri: 5am – 11pm</li>
          <li>Sat – Sun: 7am – 9pm</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10 py-6 text-center text-xs text-chalk/40">
      © {new Date().getFullYear()} IRONCLAD Gym. All rights reserved.
    </div>
  </footer>
);

export default Footer;
