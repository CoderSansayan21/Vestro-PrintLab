import { Container, PrimaryButton, SecondaryButton } from '../ui/index.js';

const featureHighlights = [
  { label: 'AI Design Assistant', icon: 'spark' },
  { label: 'Real-time 3D Preview', icon: 'cube' },
  { label: 'Premium Materials', icon: 'shield' },
  { label: 'Fast & Secure Delivery', icon: 'delivery' },
];

const featureIconPaths = {
  spark: 'M10 2.75 11.7 7.3l4.55 1.7-4.55 1.7L10 15.25l-1.7-4.55L3.75 9l4.55-1.7L10 2.75Z',
  cube: 'm4 6.5 6-3 6 3v7l-6 3-6-3v-7Zm0 0 6 3m0 7v-7m0 0 6-3',
  shield: 'M10 3.25 16 5.5v4.2c0 3.15-2.05 5.95-6 7.05-3.95-1.1-6-3.9-6-7.05V5.5l6-2.25Z',
  delivery: 'M3.5 6h8.75v7.25H3.5V6Zm8.75 2.25h2.5L17 10.5v2.75h-4.75v-5Zm-6.5 7a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm8.75 0a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z',
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d="M4.25 10h11m0 0-4.5-4.5m4.5 4.5-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d="M7.25 5.8v8.4c0 .58.63.94 1.13.63l6.55-4.2a.74.74 0 0 0 0-1.26l-6.55-4.2a.74.74 0 0 0-1.13.63Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function FeatureIcon({ type }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d={featureIconPaths[type]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
      <path d="m10 2.5 2.22 4.5 4.96.72-3.59 3.5.85 4.94L10 13.82l-4.44 2.34.85-4.94-3.59-3.5L7.78 7 10 2.5Z" />
    </svg>
  );
}

function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-vestro-page pt-16 text-vestro-text md:pt-[72px] xl:pt-20">
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,11,0.82)_0%,rgba(3,7,11,0.96)_72%,#03070B_100%),radial-gradient(ellipse_at_72%_20%,rgba(242,206,114,0.16),transparent_34rem),radial-gradient(ellipse_at_84%_58%,rgba(214,167,55,0.10),transparent_30rem),linear-gradient(115deg,#03070B_0%,#071018_48%,#03070B_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-[-10%] top-10 h-44 bg-[radial-gradient(ellipse_at_center,rgba(242,206,114,0.12),transparent_62%)] blur-2xl" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-vestro-page via-vestro-page/88 to-transparent lg:w-[62%]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-vestro-page to-transparent" />

      <Container className="relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 sm:py-16 md:min-h-[calc(100vh-4.5rem)] lg:grid-cols-[42fr_58fr] lg:gap-12 lg:py-24 xl:min-h-[calc(100vh-5rem)]">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <span className="inline-flex rounded-full border border-vestro-gold/30 bg-vestro-gold/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-vestro-gold-light">
            AI-POWERED JERSEY CUSTOMIZATION
          </span>

          <h1 className="mt-6 text-4xl font-black leading-[1.05] text-vestro-text sm:text-5xl lg:text-6xl">
            Design Your Dream Jersey
            <span className="block text-vestro-gold-light">Powered by AI.</span>
            <span className="block">Built for Champions.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-vestro-muted sm:text-lg lg:mx-0">
            Create premium custom jerseys with AI-generated artwork, real-time 3D previews, and seamless online ordering.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <PrimaryButton as="a" href="#how-it-works">
              Start Designing
              <ArrowIcon />
            </PrimaryButton>
            <SecondaryButton as="a" href="#demo">
              <PlayIcon />
              Watch Demo
            </SecondaryButton>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-4 border-t border-vestro-border pt-6 sm:flex-row sm:items-center lg:justify-start">
            <div>
              <p className="text-sm font-black text-vestro-text">4.9/5 from 1,200+ customers</p>
            </div>
            <div className="flex justify-center gap-1 text-vestro-gold-light" aria-label="Five star customer rating">
              {Array.from({ length: 5 }).map((_, index) => (
                <StarIcon key={index} />
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-0 overflow-hidden rounded-2xl border border-vestro-border bg-vestro-card/80 text-left shadow-vestro-sm sm:grid-cols-2 lg:grid-cols-4">
            {featureHighlights.map((feature, index) => (
              <div
                key={feature.label}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-vestro-muted transition duration-200 hover:bg-vestro-gold/5 hover:text-vestro-text ${
                  index > 0 ? 'border-t border-vestro-border sm:border-t-0' : ''
                } ${index % 2 === 1 ? 'sm:border-l sm:border-vestro-border' : ''} ${
                  index > 0 ? 'lg:border-l lg:border-vestro-border' : ''
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-vestro-gold/20 bg-vestro-gold/10 text-vestro-gold-light">
                  <FeatureIcon type={feature.icon} />
                </span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[22rem] rounded-2xl border border-vestro-border bg-vestro-card/80 p-4 shadow-vestro-md sm:min-h-[28rem] lg:min-h-[34rem]">
          <div className="flex h-full min-h-[20rem] items-center justify-center rounded-xl border border-dashed border-vestro-gold/25 bg-vestro-secondary/70 px-6 text-center sm:min-h-[26rem] lg:min-h-[32rem]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-vestro-gold-light">
                Jersey showcase placeholder
              </p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-vestro-muted">
                Reserved for the dedicated JerseyShowcase component.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
