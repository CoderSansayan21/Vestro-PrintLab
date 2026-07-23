import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo (2).png';
import { Container } from '../ui/index.js';

const linkGroups = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/#about' },
      { label: 'How It Works', to: '/#how-it-works' },
      { label: 'Pricing', to: '/#pricing' },
      { label: 'Contact', to: '/#contact' },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'Design Studio', to: '/dashboard' },
      { label: 'Jersey Collection', to: '/#products' },
      { label: 'Team Orders', to: '/#contact' },
      { label: 'AI Customization', to: '/#features' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '/#contact' },
      { label: 'Order Tracking', to: '/#contact' },
      { label: 'Shipping', to: '/#contact' },
      { label: 'Returns', to: '/#contact' },
    ],
  },
];

const contacts = [
  'support@vestroprintlab.com',
  '+1 (555) 014-9921',
  'Worldwide custom jersey production',
];

const socialLinks = [
  { label: 'Instagram', href: '#instagram', icon: 'instagram' },
  { label: 'X', href: '#x', icon: 'x' },
  { label: 'LinkedIn', href: '#linkedin', icon: 'linkedin' },
];

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
        <path d="M7.5 3.75h9A3.75 3.75 0 0 1 20.25 7.5v9a3.75 3.75 0 0 1-3.75 3.75h-9A3.75 3.75 0 0 1 3.75 16.5v-9A3.75 3.75 0 0 1 7.5 3.75Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M15.75 11.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" stroke="currentColor" strokeWidth="1.7" />
        <path d="M17.25 7.25h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
      </svg>
    );
  }

  if (type === 'linkedin') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
        <path d="M6.25 9.75v8.5M6.25 6.75h.01M10.25 18.25v-8.5M10.25 13.5c.35-2.3 1.65-3.95 3.85-3.95 2.35 0 3.65 1.55 3.65 4.25v4.45" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
      <path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center text-sm leading-6 text-vestro-muted transition duration-200 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
    >
      <span className="bg-gradient-to-r from-vestro-gold-light to-vestro-gold bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-200 group-hover:bg-[length:100%_1px]">
        {children}
      </span>
    </Link>
  );
}

function Footer() {
  const [email, setEmail] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = hasInteracted && email.length > 0 && !isEmailValid;

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    setHasInteracted(true);
  };

  return (
    <footer className="border-t border-vestro-gold/20 bg-vestro-page text-vestro-muted">
      <Container>
        <div className="grid gap-10 py-12 sm:gap-12 sm:py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-16">
          <div>
            <Link
              to="/"
              aria-label="VESTRO PRINTLAB home"
              className="inline-flex items-center gap-3 rounded-xl transition duration-200 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-vestro-gold/25 bg-vestro-elevated shadow-vestro-sm">
                <img src={logo} alt="" className="h-10 w-10 object-contain" />
              </span>
              <span className="leading-none">
                <span className="block text-sm font-black tracking-[0.16em] text-vestro-text">VESTRO</span>
                <span className="mt-1 block text-[0.68rem] font-bold tracking-[0.24em] text-vestro-gold-light">PRINTLAB</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-vestro-muted">
              Premium AI-powered jersey customization for teams, clubs, schools, and athletes worldwide.
            </p>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} aria-label={`${group.title} footer links`}>
              <h2 className="text-sm font-black uppercase leading-5 tracking-[0.16em] text-vestro-text">
                {group.title}
              </h2>
              <ul className="mt-5 space-y-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-sm font-black uppercase leading-5 tracking-[0.16em] text-vestro-text">
              Contact
            </h2>
            <address className="mt-5 not-italic">
              <ul className="space-y-3.5 text-sm leading-6 text-vestro-muted">
                {contacts.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </address>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleNewsletterSubmit}
          className="border-t border-vestro-border py-8 sm:py-10"
        >
          <div className="grid gap-6 rounded-2xl border border-vestro-border bg-vestro-card p-5 shadow-vestro-sm sm:p-6 lg:grid-cols-[1fr_460px] lg:items-center lg:p-8">
            <div>
              <h2 className="text-xl font-black leading-tight text-vestro-text sm:text-2xl">
                Stay Updated
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-vestro-muted">
                Get updates about new jersey collections, AI features, and exclusive offers.
              </p>
            </div>

            <div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="footer-newsletter-email">
                  Email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onBlur={() => setHasInteracted(true)}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (!hasInteracted) {
                      setHasInteracted(true);
                    }
                  }}
                  aria-invalid={showEmailError}
                  aria-describedby={showEmailError ? 'footer-newsletter-error' : undefined}
                  placeholder="Enter your email"
                  className="min-h-12 flex-1 rounded-xl border border-vestro-border bg-vestro-page px-4 text-sm font-medium text-vestro-text outline-none transition duration-200 placeholder:text-vestro-muted focus:border-vestro-gold/55 focus:ring-2 focus:ring-vestro-gold/20"
                />
                <button
                  type="submit"
                  className="min-h-12 rounded-xl border border-vestro-gold/70 bg-vestro-gold px-5 text-sm font-black text-vestro-page shadow-vestro-gold transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold-light hover:bg-vestro-gold-light focus-visible:outline-vestro-gold sm:w-auto"
                >
                  Subscribe
                </button>
              </div>
              {showEmailError && (
                <p id="footer-newsletter-error" className="mt-2 text-sm text-vestro-gold-light">
                  Enter a valid email address.
                </p>
              )}
            </div>
          </div>
        </form>

        <div className="flex flex-col gap-5 border-t border-vestro-border py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-6">&copy; 2026 VESTRO PRINTLAB. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <FooterLink to="/#privacy">Privacy Policy</FooterLink>
            <FooterLink to="/#terms">Terms</FooterLink>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-vestro-border bg-vestro-card text-vestro-muted transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold/45 hover:text-vestro-gold-light focus-visible:outline-vestro-gold"
              >
                <SocialIcon type={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
