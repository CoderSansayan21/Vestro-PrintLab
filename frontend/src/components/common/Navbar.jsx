import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import useAuthStore from '../../store/authStore.js';

const navItems = [
  { label: 'Home', to: '/', type: 'route' },
  { label: 'Design Studio', to: '/dashboard', type: 'route' },
  { label: 'Products', to: '/#products', hash: '#products' },
  { label: 'How It Works', to: '/#how-it-works', hash: '#how-it-works' },
  { label: 'About Us', to: '/#about', hash: '#about' },
  { label: 'Pricing', to: '/#pricing', hash: '#pricing' },
  { label: 'Contact', to: '/#contact', hash: '#contact' },
];

function getDashboardPath(user) {
  return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="m20 20-4.5-4.5m2.5-5A7.5 7.5 0 1 1 3 10.5a7.5 7.5 0 0 1 15 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M6.5 8.5h13l-1.35 7.35a2 2 0 0 1-1.97 1.65H8.32a2 2 0 0 1-1.97-1.65L5 4H3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9 21a.75.75 0 1 0 0-1.5A.75.75 0 0 0 9 21Zm7 0a.75.75 0 1 0 0-1.5A.75.75 0 0 0 16 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MenuIcon({ isOpen }) {
  return (
    <span aria-hidden="true" className="space-y-1.5">
      <span className={`block h-0.5 w-5 bg-current transition duration-200 ${isOpen ? 'translate-y-2 rotate-45' : ''}`} />
      <span className={`block h-0.5 w-5 bg-current transition duration-200 ${isOpen ? 'opacity-0' : ''}`} />
      <span className={`block h-0.5 w-5 bg-current transition duration-200 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`} />
    </span>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const dashboardPath = getDashboardPath(user);
  const cartCount = 0;

  const resolvedNavItems = useMemo(
    () =>
      navItems.map((item) =>
        item.label === 'Design Studio' ? { ...item, to: dashboardPath } : item,
      ),
    [dashboardPath],
  );

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  const isHashActive = (item) => location.pathname === '/' && item.hash && location.hash === item.hash;
  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login', { replace: true });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        hasScrolled || isOpen
          ? 'border-b border-vestro-border bg-vestro-page/88 shadow-vestro-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Go to VESTRO PRINTLAB home"
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-vestro-gold"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-vestro-gold/25 bg-vestro-elevated shadow-vestro-sm transition duration-200 group-hover:border-vestro-gold/55">
            <img src={logo} alt="" className="h-10 w-10 object-contain" />
          </span>
          <span className="hidden whitespace-nowrap text-sm font-black tracking-[0.14em] text-vestro-text sm:inline">
            VESTRO PRINTLAB
          </span>
        </Link>

        <div className="hidden items-center justify-center gap-1 text-sm font-bold xl:flex">
          {resolvedNavItems.map((item) =>
            item.type === 'route' ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-xl px-3 py-2 transition duration-200 hover:text-vestro-text focus-visible:outline-vestro-gold ${
                    isActive ? 'text-vestro-text after:opacity-100' : 'text-vestro-muted after:opacity-0'
                  } after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:bg-vestro-gold after:transition after:duration-200 hover:after:opacity-100`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={`relative rounded-xl px-3 py-2 transition duration-200 hover:text-vestro-text focus-visible:outline-vestro-gold ${
                  isHashActive(item) ? 'text-vestro-text after:opacity-100' : 'text-vestro-muted after:opacity-0'
                } after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:bg-vestro-gold after:transition after:duration-200 hover:after:opacity-100`}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <button
            type="button"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-vestro-muted transition duration-200 hover:border-vestro-gold/30 hover:bg-vestro-gold/10 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            <SearchIcon />
          </button>
          <Link
            to="/#cart"
            aria-label={`Cart with ${cartCount} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-vestro-muted transition duration-200 hover:border-vestro-gold/30 hover:bg-vestro-gold/10 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            <CartIcon />
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full border border-vestro-page bg-vestro-gold px-1.5 py-0.5 text-center text-[0.65rem] font-black leading-none text-vestro-page">
              {cartCount}
            </span>
          </Link>
          <Link
            to={isAuthenticated ? dashboardPath : '/login'}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-vestro-muted transition duration-200 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-vestro-muted transition duration-200 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
            >
              Logout
            </button>
          )}
          <Link
            to={isAuthenticated ? dashboardPath : '/register'}
            className="rounded-xl border border-vestro-gold/70 bg-vestro-gold px-5 py-2.5 text-sm font-black text-vestro-page shadow-vestro-gold transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to="/#cart"
            aria-label={`Cart with ${cartCount} items`}
            onClick={closeMenu}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-vestro-gold/20 bg-vestro-elevated/70 text-vestro-text transition duration-200 hover:border-vestro-gold/45 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            <CartIcon />
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full border border-vestro-page bg-vestro-gold px-1.5 py-0.5 text-center text-[0.65rem] font-black leading-none text-vestro-page">
              {cartCount}
            </span>
          </Link>
          <button
            type="button"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="public-navigation-menu"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-vestro-gold/25 bg-vestro-elevated/80 text-vestro-text transition duration-200 hover:border-vestro-gold/50 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            <MenuIcon isOpen={isOpen} />
          </button>
        </div>
      </nav>

      <div
        className={`xl:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        } transition duration-200`}
      >
        <div className="fixed inset-0 top-16 bg-black/55 sm:top-20" onClick={closeMenu} aria-hidden="true" />
        <div
          id="public-navigation-menu"
          className={`relative border-t border-vestro-border bg-vestro-secondary/98 px-4 pb-6 pt-4 shadow-vestro-md transition duration-300 sm:px-6 ${
            isOpen ? 'translate-y-0' : '-translate-y-4'
          }`}
        >
          <div className="mx-auto grid max-h-[calc(100dvh-5rem)] max-w-[1280px] gap-2 overflow-y-auto">
            <button
              type="button"
              aria-label="Search"
              className="mb-2 flex items-center gap-3 rounded-2xl border border-vestro-border bg-vestro-card px-4 py-3 text-left text-sm font-bold text-vestro-muted transition duration-200 hover:border-vestro-gold/40 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
            >
              <SearchIcon />
              <span>Search</span>
            </button>

            {resolvedNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMenu}
                className={`rounded-2xl border px-4 py-3 text-sm font-bold transition duration-200 focus-visible:outline-vestro-gold ${
                  (item.type === 'route' && location.pathname === item.to) || isHashActive(item)
                    ? 'border-vestro-gold/45 bg-vestro-gold/10 text-vestro-text'
                    : 'border-transparent text-vestro-muted hover:border-vestro-gold/30 hover:bg-vestro-gold/5 hover:text-vestro-text'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 grid gap-3 border-t border-vestro-border pt-4 sm:grid-cols-2">
              <Link
                to={isAuthenticated ? dashboardPath : '/login'}
                onClick={closeMenu}
                className="rounded-xl border border-vestro-border bg-vestro-card px-4 py-3 text-center text-sm font-bold text-vestro-text transition duration-200 hover:border-vestro-gold/40 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
              >
                {isAuthenticated ? 'Dashboard' : 'Login'}
              </Link>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-vestro-border bg-vestro-card px-4 py-3 text-center text-sm font-bold text-vestro-text transition duration-200 hover:border-vestro-gold/40 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
                >
                  Logout
                </button>
              )}
              <Link
                to={isAuthenticated ? dashboardPath : '/register'}
                onClick={closeMenu}
                className="rounded-xl border border-vestro-gold/70 bg-vestro-gold px-4 py-3 text-center text-sm font-black text-vestro-page shadow-vestro-gold transition duration-200 hover:bg-vestro-gold-light focus-visible:outline-vestro-gold"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
