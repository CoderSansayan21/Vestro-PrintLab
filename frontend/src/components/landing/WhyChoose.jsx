import { Container } from '../ui/index.js';

const reasons = [
  {
    title: 'AI-Powered Design',
    description: 'Generate unique jersey concepts in seconds.',
    icon: 'spark',
  },
  {
    title: 'Premium Quality',
    description: 'High-quality materials and professional printing.',
    icon: 'shield',
  },
  {
    title: 'Unlimited Customization',
    description: 'Customize colors, names, numbers, logos, and patterns.',
    icon: 'palette',
  },
  {
    title: 'Fast Production',
    description: 'Quick turnaround without compromising quality.',
    icon: 'eye',
  },
  {
    title: 'Secure Ordering',
    description: 'Safe payments and reliable order management.',
    icon: 'card',
  },
  {
    title: 'Worldwide Delivery',
    description: 'Track your order from production to your doorstep.',
    icon: 'truck',
  },
];

const iconPaths = {
  spark: 'M12 3.5 13.7 8.3l4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7L12 3.5Z',
  shield: 'M12 3.5 18 6v4.25c0 3.35-2.1 6.15-6 7.25-3.9-1.1-6-3.9-6-7.25V6l6-2.5Z',
  eye: 'M4 12s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Zm8 2.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z',
  palette: 'M12 4a8 8 0 0 0-3.2 15.33c.82.34 1.7-.24 1.7-1.13v-.95c0-.69.56-1.25 1.25-1.25H13a7 7 0 0 0 7-7c0-2.76-3.58-5-8-5ZM8.2 10.2h.01M10.5 7.8h.01M14 7.8h.01M15.8 10.5h.01',
  card: 'M4 7h16v10H4V7Zm0 3h16M7 14h4',
  truck: 'M3.5 7h9v7.5h-9V7Zm9 2.5h3l2 2.25v2.75h-5V9.5ZM6.5 18a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm8.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z',
};

function ReasonIcon({ type }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d={iconPaths[type]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function WhyChoose() {
  return (
    <section
      id="why-choose"
      aria-labelledby="why-choose-title"
      className="bg-vestro-page py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
            Why Choose VESTRO
          </p>
          <h2
            id="why-choose-title"
            className="mt-3 text-3xl font-black leading-[1.08] text-vestro-text sm:text-4xl lg:text-5xl"
          >
            Why Choose VESTRO
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vestro-muted sm:text-lg sm:leading-8">
            Everything you need to design and order premium sports jerseys in one place.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              tabIndex={0}
              className="group flex h-full flex-col rounded-2xl border border-vestro-border bg-vestro-card p-6 shadow-vestro-sm outline-none transition-all duration-300 ease-out hover:-translate-y-1 hover:border-vestro-gold/45 hover:shadow-[0_22px_50px_rgba(0,0,0,0.32)] focus-visible:-translate-y-1 focus-visible:border-vestro-gold/55 focus-visible:ring-2 focus-visible:ring-vestro-gold/30 focus-visible:ring-offset-2 focus-visible:ring-offset-vestro-page"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-vestro-gold/25 bg-vestro-gold/10 text-vestro-gold-light transition-colors duration-300 group-hover:border-vestro-gold/45 group-hover:bg-vestro-gold/15 group-focus-visible:border-vestro-gold/45 group-focus-visible:bg-vestro-gold/15">
                <ReasonIcon type={reason.icon} />
              </div>
              <h3 className="mt-5 text-lg font-black leading-snug text-vestro-text sm:text-xl">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-vestro-muted sm:text-[0.95rem]">
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default WhyChoose;

