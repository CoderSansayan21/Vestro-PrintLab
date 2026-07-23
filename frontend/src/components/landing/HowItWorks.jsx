import { Container, SectionHeading } from '../ui/index.js';

const steps = [
  {
    title: 'Upload Photo',
    description: 'Upload your photo or select a jersey template.',
    icon: 'upload',
  },
  {
    title: 'AI Design',
    description: 'Generate a professional jersey design with AI assistance.',
    icon: 'sparkles',
  },
  {
    title: 'Customize',
    description: 'Personalize colors, logos, names, and numbers.',
    icon: 'palette',
  },
  {
    title: 'Live Preview',
    description: 'Review your design in a realistic 3D preview.',
    icon: 'cube',
  },
  {
    title: 'Secure Checkout',
    description: 'Complete your order using a secure payment process.',
    icon: 'card',
  },
  {
    title: 'Production & Delivery',
    description: 'Your jersey is produced and delivered to your doorstep.',
    icon: 'truck',
  },
];

const iconPaths = {
  upload: 'M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5M5 15v3.5h14V15',
  sparkles: 'M12 3.5 13.7 8.3l4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7L12 3.5ZM5 4v3m-1.5-1.5h3M18 15v3m-1.5-1.5h3',
  palette: 'M12 4a8 8 0 0 0-3.2 15.33c.82.34 1.7-.24 1.7-1.13v-.95c0-.69.56-1.25 1.25-1.25H13a7 7 0 0 0 7-7c0-2.76-3.58-5-8-5ZM8.2 10.2h.01M10.5 7.8h.01M14 7.8h.01M15.8 10.5h.01',
  cube: 'm5 7 7-3.5L19 7v8l-7 3.5L5 15V7Zm0 0 7 3.5m0 8v-8m0 0L19 7',
  card: 'M4 7h16v10H4V7Zm0 3h16M7 14h4',
  truck: 'M3.5 7h9v7.5h-9V7Zm9 2.5h3l2 2.25v2.75h-5V9.5ZM6.5 18a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm8.5 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z',
};

function StepIcon({ type }) {
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

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-label="How It Works"
      className="bg-vestro-page py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          align="center"
          eyebrow="How It Works"
          title="Create Your Custom Jersey in Just 6 Easy Steps"
          description="Our streamlined process lets you design, preview, and order premium sports jerseys with ease."
        />

        <div className="relative mt-14 lg:mt-16">
          <ol className="grid gap-7 md:grid-cols-3 md:gap-x-6 md:gap-y-14 lg:grid-cols-6 lg:gap-6">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={`group relative pl-16 transition duration-200 hover:-translate-y-0.5 md:pl-0 md:text-center ${
                  index < steps.length - 1
                    ? 'after:absolute after:bottom-[-1.75rem] after:left-6 after:top-12 after:w-px after:bg-vestro-gold/25 md:after:bottom-auto md:after:left-1/2 md:after:top-7 md:after:h-px md:after:w-full lg:after:block'
                    : ''
                } ${
                  index === 2 ? 'md:after:hidden lg:after:block' : ''
                } ${
                  index === 5 ? 'md:after:hidden lg:after:hidden' : ''
                }`}
              >
                <div className="absolute left-0 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-vestro-gold/35 bg-vestro-card text-vestro-gold shadow-vestro-sm transition duration-200 group-hover:border-vestro-gold/70 group-hover:text-vestro-gold-light md:relative md:left-auto md:mx-auto md:h-14 md:w-14">
                  <StepIcon type={step.icon} />
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-vestro-page bg-vestro-gold px-1 text-[0.62rem] font-black leading-none text-vestro-page">
                    {index + 1}
                  </span>
                </div>
                <div className="rounded-2xl border border-vestro-border bg-vestro-card/70 px-4 py-4 transition duration-200 group-hover:border-vestro-gold/35 md:mt-6 md:border-transparent md:bg-transparent md:px-2 md:py-0 md:group-hover:border-transparent">
                  <p className="mb-2 hidden text-xs font-bold uppercase tracking-[0.16em] text-vestro-gold-light md:block">
                    Step {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-base font-black leading-snug text-vestro-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-vestro-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;
