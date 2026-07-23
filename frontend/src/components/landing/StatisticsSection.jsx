import { Container } from '../ui/index.js';

const stats = [
  {
    value: '10,000+',
    label: 'Happy Customers',
    icon: 'users',
  },
  {
    value: '50,000+',
    label: 'Jerseys Delivered',
    icon: 'jersey',
  },
  {
    value: '120,000+',
    label: 'AI Designs Created',
    icon: 'spark',
  },
  {
    value: '99%',
    label: 'Customer Satisfaction',
    icon: 'badge',
  },
];

const iconPaths = {
  users: 'M8 11.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 18c.45-2.75 2.15-4.5 4.5-4.5s4.05 1.75 4.5 4.5H3.5Zm10.25-.25h6.75c-.3-2.25-1.75-3.75-3.75-3.75-1.1 0-2.02.42-2.72 1.15',
  jersey: 'M8 4.5 5 6.25 3.5 10l3 1.2V19h11v-7.8l3-1.2L19 6.25l-3-1.75c-.9 1-2.25 1.55-4 1.55S8.9 5.5 8 4.5Z',
  spark: 'M12 3.5 13.7 8.3l4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7L12 3.5ZM18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z',
  badge: 'M12 3.5 14.2 6l3.3-.35.65 3.25 2.35 2.1-1.65 2.8.65 3.2-3.2.7-2.1 2.3-2.2-1.65L9.8 20l-2.1-2.3-3.2-.7.65-3.2L3.5 11l2.35-2.1.65-3.25L9.8 6 12 3.5Zm-3 8.8 2 2 4-4',
};

function StatIcon({ type }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none">
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

function StatisticsSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="statistics-title"
      className="bg-vestro-page py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
            Our Impact
          </p>
          <h2
            id="statistics-title"
            className="mt-3 text-3xl font-black leading-[1.08] text-vestro-text sm:text-4xl lg:text-5xl"
          >
            Our Impact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vestro-muted sm:text-lg sm:leading-8">
            Trusted by teams, clubs, and athletes around the world.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => (
            <article
              key={stat.label}
              aria-label={`${stat.value} ${stat.label}`}
              className="group flex h-full min-h-[190px] flex-col items-center justify-center rounded-2xl border border-vestro-border bg-vestro-card px-5 py-7 text-center shadow-vestro-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-vestro-gold/45 hover:shadow-[0_22px_50px_rgba(0,0,0,0.32)] sm:min-h-[205px] sm:px-6 sm:py-8"
            >
              <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-vestro-gold/25 bg-vestro-gold/10 text-vestro-gold-light transition-colors duration-300 group-hover:border-vestro-gold/45 group-hover:bg-vestro-gold/15">
                <StatIcon type={stat.icon} />
              </div>
              <p className="text-4xl font-black leading-none text-vestro-gold-light sm:text-5xl lg:text-[3.25rem]">
                {stat.value}
              </p>
              <div className="mt-4 h-px w-10 bg-vestro-gold/60" />
              <h3 className="mt-4 text-sm font-bold uppercase leading-5 tracking-[0.14em] text-vestro-text">
                {stat.label}
              </h3>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default StatisticsSection;
