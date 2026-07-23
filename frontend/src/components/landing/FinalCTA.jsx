import { Container, PrimaryButton, SecondaryButton } from '../ui/index.js';

const trustBadges = ['AI-Powered Design', 'Premium Printing', 'Fast Delivery', 'Secure Ordering'];

function FinalCTA() {
  return (
    <section
      id="contact"
      aria-labelledby="final-cta-title"
      className="bg-vestro-page py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto max-w-5xl rounded-2xl border border-vestro-border bg-vestro-card px-6 py-12 text-center shadow-vestro-md sm:px-8 sm:py-16 lg:px-14 lg:py-18">
          <p className="mx-auto max-w-2xl text-xs font-bold uppercase leading-6 tracking-[0.2em] text-vestro-gold-light sm:tracking-[0.22em]">
            Bring your team's identity to life with AI-powered customization.
          </p>
          <h2
            id="final-cta-title"
            className="mx-auto mt-4 max-w-3xl text-3xl font-black leading-[1.06] text-vestro-text sm:text-4xl lg:text-5xl"
          >
            Ready to Create Your Dream Jersey?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-vestro-muted sm:text-lg sm:leading-8">
            Start designing premium sports jerseys with real-time previews, unlimited customization, and professional printing.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <PrimaryButton
              as="a"
              href="#home"
              aria-label="Start designing your custom jersey"
              className="w-full justify-center shadow-[0_14px_34px_rgba(214,167,55,0.18)] transition-all duration-300 ease-out hover:-translate-y-1 sm:w-auto"
            >
              Start Designing
            </PrimaryButton>
            <SecondaryButton
              as="a"
              href="#contact"
              aria-label="Explore the premium jersey collection"
              className="w-full justify-center border-vestro-gold/30 bg-vestro-page/70 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-vestro-gold/55 sm:w-auto"
            >
              Explore Collection
            </SecondaryButton>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9">
            {trustBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-vestro-gold/20 bg-vestro-surface px-4 py-2 text-xs font-bold uppercase leading-5 tracking-[0.12em] text-vestro-muted"
              >
                <span aria-hidden="true" className="text-vestro-gold-light">&#10003;</span>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FinalCTA;
