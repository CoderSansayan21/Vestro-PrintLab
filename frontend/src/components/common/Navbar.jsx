import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo.svg';
import useAuthStore from '../../store/authStore.js';

const navItems = [
  { label: 'Products', href: '#products' },
  { label: 'Customizer', href: '#customizer' },
  { label: 'AI Logos', href: '#ai-logos' },
];

function getDashboardPath(user) {
  return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
}

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const dashboardPath = getDashboardPath(user);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-vestro-cyan/20 bg-vestro-page/80 shadow-vestro-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Go to VESTRO PRINTLAB home"
          className="group flex items-center gap-3 rounded-xl focus-visible:outline-vestro-cyan"
        >
          <span className="rounded-2xl border border-vestro-pink/25 bg-vestro-elevated/70 p-1.5 shadow-vestro-pink transition group-hover:border-vestro-cyan/50 group-hover:shadow-vestro-cyan">
            <img src={logo} alt="VESTRO PRINTLAB" className="h-9 w-auto" />
          </span>
          <span className="hidden text-sm font-black tracking-[0.16em] text-vestro-text sm:inline">
            VESTRO PRINTLAB
          </span>
        </Link>

        <div className="hidden items-center gap-2 text-sm font-bold text-vestro-muted md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`rounded-full border px-4 py-2 transition ${
                location.hash === item.href
                  ? 'border-vestro-cyan/60 bg-vestro-cyan/10 text-vestro-text shadow-vestro-cyan'
                  : 'border-transparent hover:border-vestro-pink/45 hover:bg-vestro-pink/10 hover:text-vestro-text'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-vestro-cyan ${
                  location.pathname === dashboardPath
                    ? 'border-vestro-cyan/60 bg-vestro-cyan/10 text-vestro-text shadow-vestro-cyan'
                    : 'border-vestro-border bg-vestro-elevated/70 text-vestro-text hover:border-vestro-cyan/60 hover:shadow-vestro-cyan'
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-vestro-pink/45 bg-vestro-pink/10 px-4 py-2 text-sm font-bold text-vestro-text transition hover:-translate-y-0.5 hover:bg-vestro-pink/20 hover:shadow-vestro-pink focus-visible:outline-vestro-cyan"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline-vestro-cyan ${
                  location.pathname === '/login'
                    ? 'text-vestro-cyan'
                    : 'text-vestro-muted hover:text-vestro-cyan'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-vestro-pink/60 bg-vestro-pink px-5 py-2.5 text-sm font-bold text-vestro-text shadow-vestro-pink transition hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-vestro-cyan/30 bg-vestro-elevated/80 text-vestro-text shadow-vestro-cyan transition hover:border-vestro-pink/60 hover:shadow-vestro-pink focus-visible:outline-vestro-cyan md:hidden"
        >
          <span className="sr-only">Menu</span>
          <span aria-hidden="true" className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-current transition ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </span>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-vestro-pink/15 bg-vestro-secondary/95 px-4 py-4 shadow-vestro-sm backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  location.hash === item.href
                    ? 'border-vestro-cyan/60 bg-vestro-cyan/10 text-vestro-text'
                    : 'border-vestro-border bg-vestro-card/70 text-vestro-muted hover:border-vestro-pink/50 hover:text-vestro-text'
                }`}
              >
                {item.label}
              </a>
            ))}

            <div className="mt-3 grid gap-2 border-t border-vestro-border pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="rounded-xl border border-vestro-cyan/45 bg-vestro-cyan/10 px-4 py-3 text-sm font-bold text-vestro-text"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="rounded-xl border border-vestro-pink/45 bg-vestro-pink/10 px-4 py-3 text-left text-sm font-bold text-vestro-text"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-vestro-border bg-vestro-card/70 px-4 py-3 text-sm font-bold text-vestro-text"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-xl border border-vestro-pink/60 bg-vestro-pink px-4 py-3 text-center text-sm font-bold text-vestro-text shadow-vestro-pink"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
