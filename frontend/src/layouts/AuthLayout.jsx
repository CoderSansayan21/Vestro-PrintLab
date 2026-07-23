import { Link } from 'react-router-dom';
import logo from '../assets/logos/vestro-logo (2).png';

function AuthLayout({ children, eyebrow, title, description }) {
  return (
    <main className="min-h-screen bg-vestro-page text-vestro-text">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(236,22,140,0.16),transparent_28rem),radial-gradient(circle_at_84%_18%,rgba(22,191,253,0.14),transparent_30rem),linear-gradient(135deg,#020617_0%,#050816_52%,#07101F_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-vestro-cyan/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-vestro-pink/50 to-transparent" />

        <div className="relative grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1fr]">
          <div className="hidden lg:block">
            <Link to="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-vestro-cyan">
              <span className="rounded-2xl border border-vestro-pink/25 bg-vestro-elevated/70 p-1.5 shadow-vestro-pink">
                <img src={logo} alt="VESTRO PRINTLAB" className="h-11 w-auto" />
              </span>
              <span className="text-sm font-black tracking-[0.16em] text-vestro-text">VESTRO PRINTLAB</span>
            </Link>
            <h1 className="mt-10 max-w-xl text-5xl font-black leading-tight text-vestro-text text-vestro-glow">
              Create, customize, and print without friction.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-vestro-muted">
              Access your design studio, saved jerseys, AI-generated logos, and
              order tracking from one secure VESTRO PRINTLAB account.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md sm:max-w-lg">
            <div className="mb-6 flex justify-center lg:hidden">
              <Link to="/" aria-label="Go to VESTRO PRINTLAB home" className="rounded-xl focus-visible:outline-vestro-cyan">
                <span className="inline-flex rounded-2xl border border-vestro-pink/25 bg-vestro-elevated/70 p-1.5 shadow-vestro-pink">
                  <img src={logo} alt="VESTRO PRINTLAB" className="h-11 w-auto" />
                </span>
              </Link>
            </div>

            <div className="rounded-3xl border border-vestro-cyan/25 bg-vestro-card/80 p-5 shadow-vestro-cyan backdrop-blur-xl sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-vestro-cyan">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-3xl font-black text-vestro-text">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-vestro-muted">{description}</p>
              <div className="mt-8">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
