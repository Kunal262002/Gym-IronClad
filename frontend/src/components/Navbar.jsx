import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/classes', label: 'Classes' },
  { to: '/trainers', label: 'Trainers' },
  { to: '/membership', label: 'Membership' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `uppercase text-sm font-bold tracking-wide transition-colors duration-200 ${
      isActive ? 'text-volt' : 'text-chalk/80 hover:text-chalk'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink to="/" className="font-display text-2xl tracking-wider">
          IRON<span className="text-volt">CLAD</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="btn-outline">
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Log In
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                Join Now
              </NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden text-chalk"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="block w-7 h-0.5 bg-chalk mb-1.5" />
          <span className="block w-7 h-0.5 bg-chalk mb-1.5" />
          <span className="block w-7 h-0.5 bg-chalk" />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-steel border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={linkClass}>
                    Admin
                  </NavLink>
                )}
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className={linkClass}>
                  Dashboard
                </NavLink>
                <button onClick={handleLogout} className="btn-outline w-full">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>
                  Log In
                </NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                  Join Now
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
