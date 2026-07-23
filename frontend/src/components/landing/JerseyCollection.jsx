import { useMemo, useState } from 'react';
import jerseyImage from '../../assets/images/vestro.png';
import { Container } from '../ui/index.js';

const categories = ['All', 'Football', 'Cricket', 'Basketball', 'Volleyball'];

const jerseys = [
  {
    name: 'Vestro United',
    category: 'Football',
    description: 'A bold match-day kit for elite football squads.',
  },
  {
    name: 'Colombo Strikers',
    category: 'Cricket',
    description: 'A polished cricket jersey for confident team identity.',
  },
  {
    name: 'Metro Hoops',
    category: 'Basketball',
    description: 'A clean court-ready jersey with premium contrast.',
  },
  {
    name: 'Golden Spikers',
    category: 'Volleyball',
    description: 'A lightweight volleyball kit made for fast movement.',
  },
  {
    name: 'Royal City FC',
    category: 'Football',
    description: 'A luxury football design with sharp gold detailing.',
  },
  {
    name: 'Lions XI',
    category: 'Cricket',
    description: 'A professional cricket jersey for tournament play.',
  },
  {
    name: 'North Court Kings',
    category: 'Basketball',
    description: 'A statement jersey built for speed and presence.',
  },
  {
    name: 'Velocity Volley',
    category: 'Volleyball',
    description: 'A premium volleyball style with clean team branding.',
  },
];

function JerseyCollection() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredJerseys = useMemo(
    () =>
      activeCategory === 'All'
        ? jerseys
        : jerseys.filter((jersey) => jersey.category === activeCategory),
    [activeCategory],
  );

  return (
    <section id="collection" aria-labelledby="jersey-collection-title" className="bg-vestro-secondary py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-vestro-gold-light">
            Premium collection
          </p>
          <h2 id="jersey-collection-title" className="mt-3 text-3xl font-black leading-tight text-vestro-text sm:text-4xl lg:text-5xl">
            Premium Jersey Collection
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-vestro-muted">
            Choose a professional jersey style and make it uniquely yours.
          </p>
        </div>

        <div
          className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-2 rounded-2xl border border-vestro-border bg-vestro-card/70 p-2"
          role="group"
          aria-label="Filter jersey collection by sport"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`min-h-10 rounded-xl border px-4 py-2 text-sm font-bold transition duration-200 focus-visible:outline-vestro-gold ${
                  isActive
                    ? 'border-vestro-gold/70 bg-vestro-gold text-vestro-page'
                    : 'border-transparent bg-transparent text-vestro-muted hover:border-vestro-gold/35 hover:bg-vestro-gold/10 hover:text-vestro-gold-light'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {filteredJerseys.map((jersey) => (
            <article
              key={jersey.name}
              className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-vestro-border bg-vestro-card shadow-vestro-sm transition duration-200 hover:-translate-y-1 hover:border-vestro-gold/55 hover:shadow-vestro-md"
            >
              <div className="overflow-hidden border-b border-vestro-border bg-vestro-page p-3">
                <img
                  src={jerseyImage}
                  alt={`${jersey.name} jersey preview`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full rounded-xl object-cover transition duration-200 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="inline-flex rounded-full border border-vestro-gold/30 bg-vestro-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-vestro-gold-light">
                  {jersey.category}
                </p>
                <h3 className="mt-4 text-lg font-black leading-snug text-vestro-text">
                  {jersey.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-vestro-muted">
                  {jersey.description}
                </p>
                <button
                  type="button"
                  aria-label={`Customize ${jersey.name} design`}
                  className="mt-auto w-full rounded-xl border border-vestro-gold/45 bg-vestro-gold/10 px-4 py-2.5 text-sm font-bold text-vestro-gold-light transition duration-200 hover:border-vestro-gold-light hover:bg-vestro-gold hover:text-vestro-page focus-visible:outline-vestro-gold"
                >
                  Customize Design
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default JerseyCollection;