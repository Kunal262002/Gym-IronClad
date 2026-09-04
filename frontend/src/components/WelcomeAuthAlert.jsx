import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const WELCOME_ALERT_KEY = 'ironclad_welcome_alert_seen';

const WelcomeAuthAlert = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && !localStorage.getItem(WELCOME_ALERT_KEY)) {
      setOpen(true);
      localStorage.setItem(WELCOME_ALERT_KEY, 'true');
    }
  }, [loading, user]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-alert-title"
        className="relative w-full max-w-md border border-white/10 bg-steel p-6 sm:p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-2xl leading-none text-chalk/50 hover:text-chalk"
          aria-label="Close welcome message"
        >
          ×
        </button>

        <p className="section-eyebrow">Welcome To IRONCLAD</p>
        <h2 id="welcome-alert-title" className="font-display text-3xl sm:text-4xl mb-4">
          READY TO TRAIN?
        </h2>
        <p className="text-chalk/70 mb-7">
          Log in to continue your training journey, or create an account to join the community.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/login" onClick={() => setOpen(false)} className="btn-outline flex-1">
            Log In
          </Link>
          <Link to="/register" onClick={() => setOpen(false)} className="btn-primary flex-1">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAuthAlert;
