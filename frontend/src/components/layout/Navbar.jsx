import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import useAuthStore from '../../store/authStore.js';
import Container from '../ui/Container.jsx';

const navItems = [
  { label: 'Home', to: '/', type: 'route' },
  { label: 'Design Studio', to: '/dashboard', type: 'route' },
  { label: 'Products', to: '/#products', hash: '#products' },
  { label: 'How It Works', to: '/#how-it-works', hash: '#how-it-works' },
  { label: 'Pricing', to: '/#pricing', hash: '#pricing' },
  { label: 'About', to: '/#about', hash: '#about' },
  { label: 'Contact', to: '/#contact', hash: '#contact' },
];

const mobileMenuId = 'landing-navigation-menu';

function getDashboardPath(user) {
  return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
}

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
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
        d="M6 8h14l-1.25 7.15A2.2 2.2 0 0 1 16.58 17H8.16A2.2 2.2 0 0 1 6 15.2L4.75 4H3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9 21h.01M17 21h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
    </svg>
  );
}

function MenuIcon({ isOpen }) {
  return (
    <span aria-hidden="true" className="flex h-5 w-5 flex-col justify-center gap-1.5">
      <span className={joinClasses('h-0.5 w-5 rounded-full bg-current transition duration-200', isOpen && 'translate-y-2 rotate-45')} />
      <span className={joinClasses('h-0.5 w-5 rounded-full bg-current transition duration-200', isOpen && 'opacity-0')} />
      <span className={joinClasses('h-0.5 w-5 rounded-full bg-current transition duration-200', isOpen && '-translate-y-2 -rotate-45')} />
    </span>
  );
}

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const dashboardPath = getDashboardPath(user);
  const cartCount = 0;
  const designStudioPath = dashboardPath;
  const loginPath = isAuthenticated ? dashboardPath : '/login';

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 10);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  const isHashActive = (item) => location.pathname === '/' && location.hash === item.hash;
  const closeMenu = () => setIsMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login', { replace: true });
  };

  const headerClassName = joinClasses(
    'fixed inset-x-0 top-0 z-50 transition duration-200',
    hasScrolled || isMenuOpen
      ? 'border-b border-vestro-gold/20 bg-[#03070B]/[0.92] shadow-vestro-sm backdrop-blur-xl'
      : 'border-b border-transparent bg-transparent',
  );

  const navLinkClassName = ({ isActive }, item) =>
    joinClasses(
      'group relative rounded-lg px-2.5 py-2 text-sm font-medium transition duration-200 hover:text-vestro-gold-light focus-visible:outline-vestro-gold xl:px-3 after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-px after:origin-left after:bg-vestro-gold after:transition after:duration-200 hover:after:scale-x-100',
      isActive || isHashActive(item) ? 'text-vestro-text' : 'text-vestro-muted',
      isActive || isHashActive(item) ? 'after:scale-x-100' : 'after:scale-x-0',
    );

  return (
    <header className={headerClassName}>
      <Container as="nav" className="flex h-16 items-center justify-between md:h-[72px] xl:h-20">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="VESTRO PRINTLAB home"
          className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-vestro-gold"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-vestro-gold/25 bg-vestro-elevated shadow-vestro-sm transition duration-200 group-hover:border-vestro-gold/55 md:h-11 md:w-11">
            <img src={logo} alt="" className="h-9 w-9 object-contain md:h-10 md:w-10" />
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-sm font-black tracking-[0.16em] text-vestro-text">VESTRO</span>
            <span className="mt-1 block text-[0.68rem] font-bold tracking-[0.24em] text-vestro-gold-light">PRINTLAB</span>
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 xl:flex">
          {navItems.map((item) => {
            const to = item.label === 'Design Studio' ? designStudioPath : item.to;

            return item.type === 'route' ? (
              <NavLink key={item.label} to={to} end={to === '/'} className={(state) => navLinkClassName(state, item)}>
                {item.label}
              </NavLink>
            ) : (
              <Link key={item.label} to={to} className={navLinkClassName({ isActive: false }, item)}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <button
            type="button"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-vestro-muted transition duration-200 hover:border-vestro-gold/25 hover:bg-vestro-gold/10 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            <SearchIcon />
          </button>
          <Link
            to="/#cart"
            aria-label={`Cart with ${cartCount} items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-vestro-muted transition duration-200 hover:border-vestro-gold/25 hover:bg-vestro-gold/10 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full border border-vestro-page bg-vestro-gold px-1.5 py-0.5 text-center text-[0.65rem] font-black leading-none text-vestro-page">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to={loginPath}
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
            to={designStudioPath}
            className="rounded-xl border border-vestro-gold/70 bg-vestro-gold px-5 py-2.5 text-sm font-black text-vestro-page shadow-vestro-gold transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold-light focus-visible:outline-vestro-gold"
          >
            Start Designing
          </Link>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <Link
            to="/#cart"
            onClick={closeMenu}
            aria-label={`Cart with ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-vestro-gold/20 bg-vestro-elevated/75 text-vestro-text transition duration-200 hover:border-vestro-gold/45 hover:text-vestro-gold-light focus-visible:outline-vestro-gold md:h-11 md:w-11"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full border border-vestro-page bg-vestro-gold px-1.5 py-0.5 text-center text-[0.65rem] font-black leading-none text-vestro-page">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls={mobileMenuId}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-vestro-gold/25 bg-vestro-elevated/80 text-vestro-text transition duration-200 hover:border-vestro-gold/50 hover:text-vestro-gold-light focus-visible:outline-vestro-gold md:h-11 md:w-11"
          >
            <MenuIcon isOpen={isMenuOpen} />
          </button>
        </div>
      </Container>

      <div className={joinClasses('xl:hidden', isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0', 'transition duration-200')}>
        <div className="fixed inset-0 top-16 bg-black/60 md:top-[72px]" onClick={closeMenu} aria-hidden="true" />
        <div
          id={mobileMenuId}
          className={joinClasses(
            'relative border-t border-vestro-gold/15 bg-vestro-secondary/98 px-4 pb-6 pt-4 shadow-vestro-md transition duration-200 sm:px-6',
            isMenuOpen ? 'translate-y-0' : '-translate-y-3',
          )}
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

            {navItems.map((item) => {
              const to = item.label === 'Design Studio' ? designStudioPath : item.to;
              const isActive = (item.type === 'route' && location.pathname === to) || isHashActive(item);

              return (
                <Link
                  key={item.label}
                  to={to}
                  onClick={closeMenu}
                  className={joinClasses(
                    'rounded-2xl border px-4 py-3 text-sm font-bold transition duration-200 focus-visible:outline-vestro-gold',
                    isActive
                      ? 'border-vestro-gold/45 bg-vestro-gold/10 text-vestro-text'
                      : 'border-transparent text-vestro-muted hover:border-vestro-gold/30 hover:bg-vestro-gold/5 hover:text-vestro-text',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-4 grid gap-3 border-t border-vestro-border pt-4 sm:grid-cols-2">
              <Link
                to={loginPath}
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
                to={designStudioPath}
                onClick={closeMenu}
                className="rounded-xl border border-vestro-gold/70 bg-vestro-gold px-4 py-3 text-center text-sm font-black text-vestro-page shadow-vestro-gold transition duration-200 hover:bg-vestro-gold-light focus-visible:outline-vestro-gold"
              >
                Start Designing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
