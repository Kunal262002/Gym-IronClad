import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
    <p className="font-display text-8xl text-volt mb-4">404</p>
    <h1 className="font-display text-2xl mb-4">THIS PAGE SKIPPED LEG DAY</h1>
    <p className="text-chalk/60 mb-8 max-w-sm">
      We couldn't find the page you're looking for. It may have moved or no longer exists.
    </p>
    <Link to="/" className="btn-primary">
      Back To Home
    </Link>
  </div>
);

export default NotFound;
