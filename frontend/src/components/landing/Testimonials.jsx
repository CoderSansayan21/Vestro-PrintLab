import { Container } from '../ui/index.js';

const testimonials = [
  {
    quote:
      'The AI design feature made creating our team jerseys incredibly easy.',
    name: 'John Carter',
    initials: 'JC',
    role: 'Football Coach',
  },
  {
    quote: 'Excellent quality, premium fabric, and fast delivery.',
    name: 'Sarah Wilson',
    initials: 'SW',
    role: 'Club Manager',
  },
  {
    quote: 'Our players loved the customization options and the final result.',
    name: 'Michael Lee',
    initials: 'ML',
    role: 'Team Captain',
  },
];

function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="bg-vestro-secondary py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
            Testimonials
          </p>
          <h2
            id="testimonials-title"
            className="mt-3 text-3xl font-black leading-[1.08] text-vestro-text sm:text-4xl lg:text-5xl"
          >
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vestro-muted sm:text-lg sm:leading-8">
            Trusted by athletes, teams, schools, and organizations around the world.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              aria-label={`Review from ${testimonial.name}, ${testimonial.role}`}
              className="group flex h-full min-h-[260px] flex-col rounded-2xl border border-vestro-border bg-vestro-card p-6 shadow-vestro-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-vestro-gold/45 hover:shadow-[0_22px_50px_rgba(0,0,0,0.32)] sm:p-7"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-vestro-gold/25 bg-vestro-gold/10 text-sm font-black text-vestro-gold-light transition-colors duration-300 group-hover:border-vestro-gold/45 group-hover:bg-vestro-gold/15">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-vestro-gold/20 bg-vestro-page/70 leading-none">
                    {testimonial.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase leading-5 tracking-[0.1em] text-vestro-text">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-vestro-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-1 text-sm text-vestro-gold-light" aria-label="5 out of 5 stars">
                <span aria-hidden="true">&#9733;</span>
                <span aria-hidden="true">&#9733;</span>
                <span aria-hidden="true">&#9733;</span>
                <span aria-hidden="true">&#9733;</span>
                <span aria-hidden="true">&#9733;</span>
              </div>

              <blockquote className="mt-5 flex-1 text-base leading-7 text-vestro-text sm:text-[1.03rem]">
                &quot;{testimonial.quote}&quot;
              </blockquote>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
