import { Link } from 'react-router-dom';
import logo from '../../assets/logos/vestro-logo.svg';

const footerLinks = [
  { label: 'Products', href: '#products' },
  { label: 'Customizer', href: '#customizer' },
  { label: 'AI Logos', href: '#ai-logos' },
];

function Footer() {
  return (
    <footer className="border-t border-vestro-cyan/20 bg-vestro-secondary text-vestro-muted">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_1fr] lg:px-8">
        <div>
          <Link
            to="/"
            aria-label="Go to VESTRO PRINTLAB home"
            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-vestro-cyan"
          >
            <span className="rounded-2xl border border-vestro-pink/25 bg-vestro-elevated/70 p-1.5 shadow-vestro-pink">
              <img src={logo} alt="VESTRO PRINTLAB" className="h-9 w-auto" />
            </span>
            <span className="text-sm font-black tracking-[0.16em] text-vestro-text">
              VESTRO PRINTLAB
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6">
            Cyber-neon custom apparel design, AI artwork, and premium sportswear printing.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-2 md:justify-end">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-transparent px-4 py-2 text-sm font-bold transition hover:border-vestro-cyan/45 hover:bg-vestro-cyan/10 hover:text-vestro-text focus-visible:outline-vestro-cyan"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-xs uppercase tracking-[0.18em] text-vestro-muted">
            Dark sports-tech printlab
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
