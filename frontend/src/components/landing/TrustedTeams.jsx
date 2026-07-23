import { Container } from '../ui/index.js';

const teams = [
  { name: 'Falcons FC', initials: 'FF', category: 'Football Club' },
  { name: 'Titan Cricket Club', initials: 'TC', category: 'Cricket Club' },
  { name: 'Elite Basketball', initials: 'EB', category: 'Basketball Team' },
  { name: 'Thunder Volleyball', initials: 'TV', category: 'Volleyball Team' },
  { name: 'University Sports Club', initials: 'US', category: 'School Sports' },
  { name: 'Corporate Sports League', initials: 'CS', category: 'Organization' },
];

function TrustedTeams() {
  return (
    <section
      id="about"
      aria-labelledby="trusted-teams-title"
      className="bg-vestro-secondary py-16 sm:py-20 lg:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
            Trusted By Teams
          </p>
          <h2
            id="trusted-teams-title"
            className="mt-3 text-3xl font-black leading-[1.08] text-vestro-text sm:text-4xl lg:text-5xl"
          >
            Trusted By Teams
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vestro-muted sm:text-lg sm:leading-8">
            Teams, schools, clubs, and organizations trust VESTRO PRINTLAB for premium sportswear customization.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {teams.map((team) => (
            <article
              key={team.name}
              aria-label={`${team.name}, ${team.category}`}
              className="group flex h-full min-h-[150px] flex-col items-center justify-center rounded-2xl border border-vestro-border bg-vestro-card px-4 py-6 text-center shadow-vestro-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-vestro-gold/45 hover:shadow-[0_22px_50px_rgba(0,0,0,0.32)] sm:min-h-[160px] sm:px-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-vestro-gold/25 bg-vestro-gold/10 text-base font-black text-vestro-gold-light transition-colors duration-300 group-hover:border-vestro-gold/45 group-hover:bg-vestro-gold/15">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-vestro-gold/20 bg-vestro-page/70 leading-none">
                  {team.initials}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase leading-5 tracking-[0.1em] text-vestro-text">
                {team.name}
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-vestro-muted">
                {team.category}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default TrustedTeams;
