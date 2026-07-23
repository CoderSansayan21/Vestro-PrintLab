import { Container } from '../ui/index.js';

const features = [
  {
    title: 'AI Design Assistant',
    description: 'Smart AI helps create professional jersey artwork.',
    icon: 'spark',
  },
  {
    title: 'Real-time 3D Preview',
    description: 'Preview every detail before placing your order.',
    icon: 'preview',
  },
  {
    title: 'Unlimited Customization',
    description: 'Customize colors, names, numbers, logos, and patterns.',
    icon: 'material',
  },
  {
    title: 'Fast & Secure Delivery',
    description: 'Reliable production, secure payment, and worldwide shipping.',
    icon: 'delivery',
  },
];

const iconPaths = {
  spark: 'M12 3.5 13.9 8.1l4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6L5.5 10l4.6-1.9L12 3.5Z',
  preview: 'M4 7.5S7 4 12 4s8 3.5 8 3.5-3 3.5-8 3.5-8-3.5-8-3.5Zm8 2.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM5 15h14',
  material: 'M5 5.5h14L16.5 18h-9L5 5.5Zm2.25 0L9 3h6l1.75 2.5',
  delivery: 'M3.5 7h9v7.5h-9V7Zm9 2.5h3l2 2.25v2.75h-5V9.5ZM6.5 18a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm8.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z',
};

function FeatureIcon({ type }) {
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

function FeatureStrip() {
  return (
    <section id="features" className="bg-vestro-secondary py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="overflow-hidden rounded-2xl border border-[rgba(214,167,55,0.18)] bg-[#0B141D] shadow-vestro-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className={`group min-w-0 px-5 py-6 transition duration-200 hover:-translate-y-0.5 hover:border-vestro-gold/45 hover:bg-vestro-elevated/40 sm:px-6 lg:px-7 lg:py-8 ${
                  index > 0 ? 'border-t border-[rgba(214,167,55,0.18)] sm:border-t-0' : ''
                } ${index > 1 ? 'sm:border-t sm:border-[rgba(214,167,55,0.18)] lg:border-t-0' : ''} ${
                  index % 2 === 1 ? 'sm:border-l sm:border-[rgba(214,167,55,0.18)]' : ''
                } ${index > 0 ? 'lg:border-l lg:border-[rgba(214,167,55,0.18)]' : ''}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-vestro-gold/20 bg-vestro-gold/10 text-vestro-gold transition duration-200 group-hover:border-vestro-gold/45 group-hover:text-vestro-gold-light">
                  <FeatureIcon type={feature.icon} />
                </div>
                <h3 className="mt-5 text-base font-black leading-snug text-vestro-text">
                  {feature.title}
                </h3>
                <p className="mt-2.5 max-w-xs text-sm leading-6 text-vestro-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FeatureStrip;
