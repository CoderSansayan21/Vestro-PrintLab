import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import heroImage from '../../assets/images/vestro-hero.svg';

const actions = [
  {
    label: 'Start Designing',
    href: '#start-designing',
    variant: 'primary',
  },
  {
    label: 'Explore Products',
    href: '#products',
    variant: 'secondary',
  },
];

const featureBadges = ['AI logo tools', 'Interactive 3D preview', 'Premium sportswear'];

const productHighlights = [
  {
    title: 'Custom Jerseys',
    description: 'Build team-ready sportswear with colors, names, numbers, and branded artwork.',
  },
  {
    title: 'Printlab Finish',
    description: 'Prepare clean apparel concepts for premium printing and order handoff.',
  },
  {
    title: 'Saved Concepts',
    description: 'Keep your jersey ideas ready for refinement, preview, and ordering.',
  },
];

const workflowSteps = [
  'Create or upload artwork',
  'Customize apparel details',
  'Preview the final jersey',
  'Order premium sportswear',
];

function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-vestro-page text-vestro-text">
      <Navbar />

      <section className="relative border-b border-vestro-cyan/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(236,22,140,0.18),transparent_30rem),radial-gradient(circle_at_82%_20%,rgba(22,191,253,0.16),transparent_28rem),linear-gradient(135deg,#020617_0%,#050816_54%,#07101F_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-vestro-cyan/60 to-transparent" />

        <div className="relative mx-auto grid min-h-[calc(100vh-69px)] max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.95fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-vestro-cyan">
              AI apparel customization
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight text-vestro-text text-vestro-glow sm:text-5xl lg:text-6xl">
              Design Your Dream Jersey with AI
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-vestro-muted sm:text-lg">
              Create, customize, preview, and order premium sportswear using AI-powered tools and interactive 3D design.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {featureBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-vestro-cyan/30 bg-vestro-cyan/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-cyan-100"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              {actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={
                    action.variant === 'primary'
                      ? 'rounded-full border border-vestro-pink/60 bg-vestro-pink px-7 py-3.5 text-center text-sm font-black text-vestro-text shadow-vestro-pink transition duration-200 hover:-translate-y-0.5 hover:border-vestro-cyan/70 hover:shadow-vestro-cyan focus-visible:outline-vestro-cyan'
                      : 'rounded-full border border-vestro-cyan/45 bg-vestro-elevated/70 px-7 py-3.5 text-center text-sm font-black text-vestro-text shadow-vestro-cyan transition duration-200 hover:-translate-y-0.5 hover:border-vestro-pink/60 hover:bg-vestro-card focus-visible:outline-vestro-pink'
                  }
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-vestro-pink/20 via-transparent to-vestro-cyan/20 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-vestro-cyan/25 bg-vestro-card/70 p-3 shadow-vestro-cyan backdrop-blur-xl sm:p-4">
              <img
                src={heroImage}
                alt="Custom VESTRO PRINTLAB jersey preview"
                className="h-auto w-full rounded-[1.25rem] border border-vestro-border bg-vestro-secondary/60"
              />
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-vestro-muted">
                <span className="rounded-xl border border-vestro-pink/25 bg-vestro-pink/10 px-2 py-2">AI</span>
                <span className="rounded-xl border border-vestro-cyan/25 bg-vestro-cyan/10 px-2 py-2">3D</span>
                <span className="rounded-xl border border-vestro-purple/30 bg-vestro-purple/10 px-2 py-2">Print</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="relative bg-vestro-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-vestro-pink">Products</p>
            <h2 className="mt-3 text-3xl font-black text-vestro-text sm:text-4xl">
              Premium sportswear concepts built for teams and creators.
            </h2>
            <p className="mt-4 text-base leading-7 text-vestro-muted">
              VESTRO PRINTLAB brings custom jersey ideas, artwork, previews, and order preparation into one focused design experience.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {productHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-vestro-border bg-vestro-card/85 p-6 shadow-vestro-sm transition duration-200 hover:-translate-y-1 hover:border-vestro-cyan/45 hover:shadow-vestro-cyan"
              >
                <h3 className="text-lg font-black text-vestro-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-vestro-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="customizer" className="relative border-y border-vestro-cyan/10 bg-vestro-page py-16 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(22,191,253,0.09),transparent_28rem),radial-gradient(circle_at_85%_80%,rgba(236,22,140,0.1),transparent_26rem)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-vestro-cyan">Customizer</p>
            <h2 className="mt-3 text-3xl font-black text-vestro-text sm:text-4xl">
              Design flow made for fast jersey iteration.
            </h2>
            <p className="mt-4 text-base leading-7 text-vestro-muted">
              Move from artwork to apparel preview with a workflow shaped around custom sportswear decisions.
            </p>
          </div>

          <div id="start-designing" className="grid gap-3 sm:grid-cols-2">
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-vestro-border bg-vestro-elevated/80 p-5 shadow-vestro-sm transition duration-200 hover:border-vestro-pink/45 hover:shadow-vestro-pink"
              >
                <span className="text-xs font-black uppercase tracking-[0.18em] text-vestro-pink">
                  Step {index + 1}
                </span>
                <p className="mt-3 text-lg font-black text-vestro-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-logos" className="bg-vestro-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-vestro-pink/20 bg-gradient-to-br from-vestro-card/95 via-vestro-elevated/90 to-vestro-secondary p-6 shadow-vestro-pink sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-vestro-pink">AI Logos</p>
                <h2 className="mt-3 text-3xl font-black text-vestro-text sm:text-4xl">
                  Generate artwork ideas that belong on the jersey.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-vestro-muted">
                  Use AI-powered logo generation as part of the VESTRO design process, then carry the concept into apparel customization and preview.
                </p>
              </div>
              <a
                href="#start-designing"
                className="rounded-full border border-vestro-cyan/50 bg-vestro-cyan/10 px-7 py-3.5 text-center text-sm font-black text-vestro-text shadow-vestro-cyan transition duration-200 hover:-translate-y-0.5 hover:border-vestro-pink/70 hover:bg-vestro-pink/15 hover:shadow-vestro-pink focus-visible:outline-vestro-cyan"
              >
                Start Designing
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Home;
